import characterCombinations from '../data/characterCombinations.json';

const Builds = ({ ownedCharacters }) => {
    console.log("Owned Characters:", ownedCharacters);
    
    return (
        <>
            <h3>Builds</h3>
        <div className="builds-container">
            {Object.entries(characterCombinations).map(([mainCharacter, combinations]) => (
                
                <div key={mainCharacter} className="character-section">
                    <h4>{mainCharacter}</h4>
                    <div className="combinations-container">
                    {              
                    
                    combinations.map((combination, comboIndex) => (
                        <div key={`${mainCharacter}-${comboIndex}`} className="build-row">
                            {/* Personaje principal */}
                            <div className={`character-card ${ownedCharacters.includes(mainCharacter.toLowerCase().replace(/ /g, "_")) ? "selected" : ""}`}>
                                <img
                                    src={`https://i2.wp.com/images.genshin-builds.com/genshin/characters/${mainCharacter.toLowerCase().replace(/ /g, "_")}/image.png`}
                                    alt={mainCharacter}
                                    title={mainCharacter}
                                />
                                {/* <div className="character-name">{mainCharacter}</div> */}
                            </div>
                            
                            {/* Personajes de soporte */}
                            {combination.characters.map((character, charIndex) => {
                                const fixedName = character.name
                                    .replace("Genshin - ", "")
                                    .toLowerCase()
                                    .replace(/ /g, "_");
                                
                                return (
                                    <div key={`${mainCharacter}-${comboIndex}-${charIndex}`} className={`character-card ${ownedCharacters.includes(fixedName) ? "selected" : ""}`}>
                                        <a href={character.link} target="_blank" rel="noopener noreferrer">
                                            <img
                                                src={`https://i2.wp.com/images.genshin-builds.com/genshin/characters/${fixedName}/image.png`}
                                                alt={character.name.replace("Genshin - ", "")}
                                                title={character.name.replace("Genshin - ", "")}
                                            />
                                            {/* <div className="character-name">
                                                {character.name.replace("Genshin - ", "")}
                                            </div> */}
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                    </div>                  
                
                </div>
            ))}
        </div>
        </>
    );
};

export default Builds;