import { useEffect, useState } from "react";

const Scrapper = ({setCharacterCompositions}) => {
  const [selectedCorsProxy, setSelectedCorsProxy] = useState(
    "https://api.codetabs.com/v1/proxy?quest="
  );
  const [selectedUrl, setSelectedUrl] = useState(
    "https://game8.co/games/Genshin-Impact/archives/301819"
  );
  const [status, setStatus] = useState("");
  const [results, setResults] = useState([]);
  const [showedMessage, setShowedMessage] = useState("");

    useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => setStatus(""), 3000);
      return () => clearTimeout(timer); 
    }
  }, [status]);

  const normalize = (s) =>
    s
      .trim()
      .replace(/^Genshin\s*-\s*/i, "") 
      .toLowerCase()
      .replace(/\s+/g, "_");

  const extractNameFromAnchor = (a) => {
    if (!a) return "";
    if (selectedUrl.includes("game8.co")) {
      const txt = a.textContent?.trim() || "";
      if (txt) return normalize(txt);
    } else if (selectedUrl.includes("genshin-builds.com")) {
      const spanText = a.querySelector("span")?.textContent?.trim();
      if (spanText) return spanText.toLowerCase().replace(/\s+/g, "_");
    }
  };

  const isBestTeamsTable = (table) => {
    const txt = table.previousElementSibling?.textContent || "";
    const keywords = [
      "Best Teams for",
      "DPS",
      "Support",
      "Spread",
      "Shielded",
      "Taser",
      "Hyperbloom",
      "Aggravate",
      "Quickbloom",
      "Pyro",
      "Hydro",
      "Cryo",
      "Electro",
      "Anemo",
      "Geo",
      "Physical",
    ];
    return keywords.some((word) => txt.includes(word));
  };

  const fetchData = async () => {
    try {
      setStatus("loading");

      const response = await fetch(`${selectedCorsProxy}${selectedUrl}`);
      if (!response.ok) throw new Error(response.statusText);

      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");

      const newCompositions = [];

      if (selectedUrl.includes("game8.co")) {
        // Filtra solo las tablas de equipos
        const webTables = [...doc.querySelectorAll("table")].filter(
          isBestTeamsTable
        );
        console.log(`Found ${webTables.length} tables matching criteria.`);
        webTables.forEach((table) => {
          // Toma solo filas de cuerpo y salta el header
          const rows = [...table.querySelectorAll("tr")];
          const dataRows = rows.filter((r) => !r.querySelector("th")); // o rows.slice(1)

          dataRows.forEach((row) => {
            // Toma enlaces dentro de celdas
            const anchors = [...row.querySelectorAll("a")];
            // Si hay más de 4 enlaces por rarezas de la página, nos quedamos con los 4 primeros
            const team = anchors
              .slice(0, 4)
              .map(extractNameFromAnchor)
              .filter(Boolean);

            // Asegura exactamente 4 y sin duplicados dentro de la fila
            const unique = [...new Set(team)];
            if (team.length === 4 && unique.length === 4) {
              newCompositions.push(team);
            }
          });
        });
      } else if (selectedUrl.includes("genshin-builds.com")) {
        const webTables = [...doc.querySelectorAll(".card")];
        console.log(`Found ${webTables.length} tables matching criteria.`);

        webTables.forEach((table) => {
          const row = table.querySelector(".grid");
          if (row) {
            const anchors = [...row.querySelectorAll("a")];
            const team = anchors.map(extractNameFromAnchor).filter(Boolean);

            // Asegura exactamente 4 y sin duplicados dentro de la fila
            const unique = [...new Set(team)];
            if (team.length === 4 && unique.length === 4) {
              newCompositions.push(team);
            }
          }
        });
      }

       setCharacterCompositions((prev) => {
      const existing = new Set(prev.map((team) => JSON.stringify(team)));
      const filtered = newCompositions.filter(
        (team) => !existing.has(JSON.stringify(team))
      );
      return [...prev, ...filtered];
    });

      setStatus("");
      console.log("Compositions:", results); // aquí sí verás el resultado final
    } catch (err) {
      console.error("Error fetching data:", err);
      setStatus("error");
    }
  };
  //   const fetchData = async () => {
  //     setStatus("loading");
  //     const response = await fetch(`${selectedCorsProxy}${selectedUrl}`);
  //     if (!response.ok) {
  //       setStatus("error");
  //       console.error("Error fetching data:", response.statusText);
  //       return;
  //     }
  //     const text = await response.text();
  //     const parser = new DOMParser();
  //     const doc = parser.parseFromString(text, "text/html");
  //     console.log("Document parsed successfully");
  //     console.log("Document content:", doc);
  //     if (selectedUrl.includes("game8.co")) {
  //       const webTables = [...doc.querySelectorAll("table")];
  //       webTables
  //         .filter(
  //           (table) =>
  //             table.previousElementSibling &&
  //             table.previousElementSibling.textContent.includes("Best Teams for")
  //         )
  //         .forEach((table) => {
  //             console.log("Processing table:", table);

  //           const rows = table.querySelectorAll("tr");
  //           rows.forEach((row) => {
  //               const cells = row.querySelectorAll("a");
  //               const team = [];
  //             if (cells.length > 0) {
  //                 // const mainCharacter = cells[0].textContent.trim().toLowerCase().replace(/ /g, "_");

  //               cells.forEach((cell) => {
  //                 const characterName = cell.textContent.trim().toLowerCase();
  //                 const fixedName = characterName.replace(/ /g, "_");
  //                 // if (Object.keys(charactersInfo).includes(fixedName)) {
  //                 //   team.push(fixedName);
  //                 // } else {
  //                 //   console.warn(`Character ${fixedName} not found in characters list.`);
  //                 // }
  //                 team.push(fixedName);
  //                 console.log(`Character added to team: ${fixedName}`);
  //               })
  //               setResults((prev) => [...prev, team]);
  //             }
  //           });
  //         });
  //       setStatus("");
  //       console.log("Data fetched successfully:", results);
  //     }
  //   };

  return (
    <>
      <div className="input-section">
        <input
          type="text"
          id="url"
          value={selectedUrl}
          placeholder="Introduce la URL... "
          onChange={(e) => setSelectedUrl(e.target.value)}
        />
        <button id="scrapeBtn" onClick={fetchData}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
          </svg>
          Obtener Composiciones
        </button>
      </div>

      <div className="controls">
        <div className="proxy-select">
          <label htmlFor="proxySelect">Proxy CORS:</label>
          <select
            id="proxySelect"
            value={selectedCorsProxy}
            onChange={(e) => setSelectedCorsProxy(e.target.value)}
          >
            <option value="https://api.codetabs.com/v1/proxy?quest=">
              Codetabs
            </option>
            <option value="https://corsproxy.io/?">CorsProxy.io</option>
            <option value="https://api.allorigins.win/raw?url=">
              AllOrigins
            </option>
          </select>
        </div>

        <div className="status">
          <div className="status-indicator" id="statusIndicator"></div>
          <span id="statusText">Listo</span>
        </div>
      </div>

      <div
        id="error"
        className={`error ${status === "error" ? "visible" : ""}`}
      >
        Error al cargar los datos...
      </div>
      <div
        id="loading"
        className={`loading ${status === "loading" ? "visible" : ""}`}
      >
        Cargando datos desde la web...
      </div>

      <div className="results-area">
        <div className="results-container" id="results"></div>

        <div className="json-container">
          <div className="json-header">
            <h3>Salida JSON</h3>
            <button className="copy-btn" id="copyJsonBtn">
              Copiar JSON
            </button>
          </div>
          <div className="json-output" id="jsonOutput"></div>
        </div>
      </div>

      <div
        className={`success-message ${status === "success" ? "visible" : ""}`}
        id="successMessage"
      >
        ¡JSON copiado al portapapeles!
      </div>
    </>
  );
};

export default Scrapper;
