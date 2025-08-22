const BuildGroup = ({ comp, index, ownedCharacters }) => {
  // const count =  comp.filter((character) => ownedCharacters.includes(character)).length;

  return (
    <div className={`card`} >
      {...comp.map((character, charIndex) => {       
        const fixedName = character.toLowerCase().replace(/_/g, " ");


        return (
          <div
            className={`character ${ownedCharacters.includes(character)? "owned" : ""}`}
            key={`composition-${index}-char-${charIndex}`}
          >
            <img
              src={`https://i2.wp.com/images.genshin-builds.com/genshin/characters/${
                character.includes("traveler")
                  ? "traveler"
                  : character.toLowerCase()
              }/image.png`}
              alt={character}
            />
            <span>{fixedName}</span>
          </div>
        );
      })}
    </div>
  );
};

export default BuildGroup;
