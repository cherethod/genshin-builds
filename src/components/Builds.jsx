import { useState, useEffect } from "react";
import defaultCharacterCompositions from "../data/defaultCharacterCompositions";

const Builds = ({ ownedCharacters, characterCompositions, setCharacterCompositions }) => {
    console.log("Owned Characters:", ownedCharacters);

    const [fullCompositions, setFullCompositions] = useState(0);

    useEffect(() => {
        if (characterCompositions.length === 0) {
            console.log("No character compositions found, initializing with default.");
            setCharacterCompositions(defaultCharacterCompositions);
        }

    }, [characterCompositions]);

    useEffect(() => {
        const count = characterCompositions.reduce((total, comp) => {
            return comp.every(character => ownedCharacters.includes(character))
                ? total + 1
                : total;
        }, 0);
        
        setFullCompositions(count);
    }, [ownedCharacters, characterCompositions]); // Dependencias correctas


    const normalizeCharacterName = (name) => {
        return name.toLowerCase().replace(/_/g, " ");
    }
    
    return (
        <>
            <h3>Builds  (Total completed builds: {fullCompositions})</h3>
        <div className="builds-container">
            {
                characterCompositions.map((comp, index) => {
                    return (
                        <div className="card" key={index}>
                         {
                            
                            ...comp.map((character, charIndex) => {
                                console.log(`Rendering character ${charIndex + 1} in composition ${index + 1}:`, character);
                                const fixedName = character.toLowerCase().replace(/_/g, " ");
                                
                                    return (
                                        <div className={`character ${ownedCharacters.includes(character) ? 'owned' : ''}`} key={charIndex}>
                                            <img
                                                src={`https://i2.wp.com/images.genshin-builds.com/genshin/characters/${character.includes("traveler") ? "traveler" : character.toLowerCase()}/image.png`}
                                                alt={character}
                                            />
                                            <span>{normalizeCharacterName(character)}</span>
                                        </div>
                                    );                               
                            })
                         }

                        </div>
                    )
            })
        }
           
        </div>
        </>
    );
};

export default Builds;