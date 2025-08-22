import { useState, useEffect } from "react";
import "./App.css";
import CharacterCard from "./components/CharacterCard";
import Builds from "./components/Builds";
import Header from "./components/Header";
import LoadImportFile from "./components/LoadImportFile";
import Scrapper from "./components/Scrapper";
import UseCharacters from "./components/hooks/UseCharacters";

function App() {
  
  const [status, setStatus] = useState("main");
  const { characters, ownedCharacters, setOwnedCharacters, characterCompositions, setCharacterCompositions } = UseCharacters();


  const loadOwnedCharactersFromFile = async () => {
    setStatus('import-file')
  }

  function onFileLoad(data) {
    if (Array.isArray(data)) {
      setOwnedCharacters(data);
      setStatus("main");
    } else {
      Object.entries(data).forEach(([key, value]) => {
        const fixedName = key.toLocaleLowerCase().replace(/ /g, "_");
         if (Object.keys(characters).includes(fixedName)) {
          if (!ownedCharacters.includes(fixedName)) {
            setOwnedCharacters((prev) => [...prev, fixedName]);
          } else {
          }
        }          
      })
      if (ownedCharacters.length === 0) {
        alert("No characters found in the file.");
      }
    }
    setStatus("main");
  }
      

  return (
    <>
      <Header status={status} setStatus={setStatus} />
      <main className="container">
        {characters && status === "import-file" && (
          <LoadImportFile onFileLoad={onFileLoad}/>
        )}
        {characters && status === "main" && (          
          <div className="home-container">
            <div className="side-main-menu">
            <button className="menu-button" onClick={() => loadOwnedCharactersFromFile()}>Import Owned Characters from file</button>

            </div>
            <div className="owned-characters-list">
              {
                ownedCharacters.length === 0 && (
                  <h2 className="empty-box">No characters selected</h2>
                )
              }
              {ownedCharacters.length > 0 && Object.entries(characters).map(([id, character]) => {
                const fixedName = character.name.toLowerCase().replace(/ /g, "_");
                if (ownedCharacters.includes(fixedName)) {
                  return (
                    <CharacterCard
                      key={id}
                      character={character}
                      ownedCharacters={ownedCharacters}
                      setOwnedCharacters={setOwnedCharacters}
                    />
                  );
                }
                return null; // Skip characters not in ownedCharacters
              })}
            </div>
          </div>
        )}
        {characters && status === "owned-characters-selection" && (
          <div className="character-list">
            <div className="character-cards-container">
              {Object.entries(characters).map(([id, character]) => (
                <CharacterCard
                  key={id}
                  character={character}
                  ownedCharacters={ownedCharacters}
                  setOwnedCharacters={setOwnedCharacters}
                />
              ))}
            </div>
          </div>
        )}
        {status === "builds" && ownedCharacters.length < 4 && (
          <div className="no-characters">
            <h2 style={{ color: "red" }}>
              No hay suficientes personajes seleccionados
            </h2>
            <p>
              Vuelve a la selección de personajes y marca todos los que tienes
              en posesión
            </p>
          </div>
        )}
        {status === "builds" && ownedCharacters.length >= 4 && (
          <Builds 
            ownedCharacters={ownedCharacters}
            characterCompositions={characterCompositions}
           />
        )}
        {status === "Scrapper" && (
          <div className="scrapper-container">
            <Scrapper setCharacterCompositions={setCharacterCompositions} />
          </div>
        )}
      </main>
    </>
  );
}

export default App;
