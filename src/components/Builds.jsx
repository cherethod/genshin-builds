import { useState, useEffect } from "react";
import BuildGroup from "./BuildGroup";

const Builds = ({ ownedCharacters, characterCompositions }) => {

    const [fullCompositions, setFullCompositions] = useState(0);

    useEffect(() => {
        const count = characterCompositions.reduce((total, comp) => {
            return comp.every(character => ownedCharacters.includes(character))
                ? total + 1
                : total;
        }, 0);
        
        setFullCompositions(count);
    }, [ownedCharacters, characterCompositions]); // Dependencias correctas


    // const normalizeCharacterName = (name) => {
    //     return name.toLowerCase().replace(/_/g, " ");
    // }
    
    return (
        <>
            <h3>Builds  (Total completed builds: {fullCompositions})</h3>
        <div className="builds-container">
            {
                characterCompositions.map((comp, index) => {
                    let count = 0;
                    return (
                       <BuildGroup comp={comp} index={index} ownedCharacters={ownedCharacters} />
                    )
            })
        }
           
        </div>
        </>
    );
};

export default Builds;