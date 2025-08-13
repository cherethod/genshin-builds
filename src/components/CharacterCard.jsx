import { useState } from "react";

const CharacterCard = ({
  id,
  character,
  ownedCharacters,
  setOwnedCharacters,
}) => {
  const fixedName = character.name.toLocaleLowerCase().replace(/ /g, "_");
  const [isSelected, setIsSelected] = useState(false);

  function toggleCharacter(characterId) {
    if (ownedCharacters.includes(characterId)) {
      setOwnedCharacters(ownedCharacters.filter((id) => id !== characterId));
      setIsSelected(false);
    } else {
      setOwnedCharacters([...ownedCharacters, characterId]);
      setIsSelected(true);
    }
  }
  return (
    <div
      key={id}
      className={`character-card ${
        isSelected || ownedCharacters.includes(fixedName) ? "selected" : ""
      }`}
      onClick={() => toggleCharacter(fixedName)}
    >
      <img
        src={`https://i2.wp.com/images.genshin-builds.com/genshin/characters/${fixedName}/image.png`}
        alt={character.name}
        className="character-image"
        loading="lazy"
      />
      {/* <div className="character-info"> */}
        <span className="character-name">{character.name}</span>
        <img src={`img/elements/${character.vision}.png`} alt="" className="character-element" />
        <span className="character-rarity">{character.rarity}⭐</span>
      {/* </div> */}
    </div>
  );
};

export default CharacterCard;
