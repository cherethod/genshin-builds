import { useState, useEffect } from "react";
import BuildGroup from "./BuildGroup";

const Builds = ({ ownedCharacters, characterCompositions }) => {
  const [fullCompositions, setFullCompositions] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const count = characterCompositions.reduce((total, comp) => {
      return comp.every((character) => ownedCharacters.includes(character))
        ? total + 1
        : total;
    }, 0);

    setFullCompositions(count);
  }, [ownedCharacters, characterCompositions]); // Dependencias correctas

  const handleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <>
      <section className="builds-header">
        <h3>Builds (Total completed builds: {fullCompositions})</h3>
        <button onClick={() => handleShowAll()}>
          {showAll ? "Hide uncomplete" : "Show all builds"}
        </button>
      </section>
      <div className={`builds-container ${showAll ? "show-all" : ""}`}>
        {characterCompositions
          .filter((comp) => {
            if (showAll) return true;
            return comp.every((character) =>
              ownedCharacters.includes(character)
            );
          })
          .map((comp, index) => (
            <BuildGroup
              key={`group-${index}`}
              comp={comp}
              ownedCharacters={ownedCharacters}
            />
          ))}
      </div>
    </>
  );
};

export default Builds;
