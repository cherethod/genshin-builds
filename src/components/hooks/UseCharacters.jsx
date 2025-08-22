import { useState, useEffect } from "react";
import charactersInfo from "../../data/charactersDB.json";
import defaultCharacterCompositions from "../../data/defaultCharacterCompositions";

const UseCharacters = () => {
    const [characters, setCharacters] = useState(charactersInfo);
    const [ownedCharacters, setOwnedCharacters] = useState([]);
    const [characterCompositions, setCharacterCompositions] = useState([]);
    

   const handleSetOwnedCharacters = (newOwnedCharacters) => {
    setOwnedCharacters(newOwnedCharacters);
    }



    
  useEffect(() => {
    // Initialize ownedCharacters from localStorage if available
    const storedOwnedCharacters = localStorage.getItem("ownedCharacters");
    if (storedOwnedCharacters && storedOwnedCharacters.length > 0) {
      setOwnedCharacters(JSON.parse(storedOwnedCharacters));
    }
  }, []);

  useEffect(() => {
    // Save ownedCharacters to localStorage whenever it changes
    localStorage.setItem("ownedCharacters", JSON.stringify(ownedCharacters));
  }, [ownedCharacters]);

  useEffect(() => {
    // Initialize characterComposition from localStorage if available
    const storedCharacterCompositions = localStorage.getItem("characterCompositions");
    if (storedCharacterCompositions) {
      setCharacterCompositions(JSON.parse(storedCharacterCompositions));
    }
  }, []);

  useEffect(() => {
    // Save characterCompositions to localStorage whenever it changes
    localStorage.setItem("characterCompositions", JSON.stringify(characterCompositions));
  }, [characterCompositions]);

     useEffect(() => {
        if (characterCompositions.length === 0) {
            console.log("No character compositions found, initializing with default.");
            setCharacterCompositions(defaultCharacterCompositions);
        }

    }, [characterCompositions]);

    // Hook logic here

    return { characters, ownedCharacters, setOwnedCharacters, characterCompositions, setCharacterCompositions };
}

export default UseCharacters;
