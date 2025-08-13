import { useState, useEffect } from "react";
import charactersInfo from "./data/charactersDB.json";
import "./App.css";
import CharacterCard from "./components/CharacterCard";
import Builds from "./components/Builds";
import Header from "./components/Header";

function App() {
  const [characters, setCharacters] = useState(charactersInfo);
  const [ownedCharacters, setOwnedCharacters] = useState([]);
  const [status, setStatus] = useState("main");

  useEffect(() => {
    // Initialize ownedCharacters from localStorage if available
    const storedOwnedCharacters = localStorage.getItem("ownedCharacters");
    if (storedOwnedCharacters) {
      setOwnedCharacters(JSON.parse(storedOwnedCharacters));
    }
  }, []);

  useEffect(() => {
    // Save ownedCharacters to localStorage whenever it changes
    localStorage.setItem("ownedCharacters", JSON.stringify(ownedCharacters));
  }, [ownedCharacters]);

  return (
    <>
      <Header status={status} setStatus={setStatus} />
      <main className="container">
        {characters && status === "main" && (
          <div className="home-container">
            <div className="owned-characters-list">
              {
                ownedCharacters.length === 0 && (
                  <h2>No characters selected</h2>
                )
              }
              {ownedCharacters.length > 0 && Object.entries(characters).map(([id, character]) => {
                if (ownedCharacters.includes(id)) {
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
          <Builds ownedCharacters={ownedCharacters} />
        )}
      </main>
    </>
  );
}

export default App;
