import { genshin } from 'genshin-db';
      const characters = document.querySelectorAll("tr");
      const charactersArray = [];
      const charactersJSON = {}
      console.log(genshin.characters());

      characters.forEach((characterElement) => {
        const link = characterElement.firstElementChild.querySelector("a");
        const name = link ? link.textContent.trim() : '';
        if (name.length > 0) charactersArray.push(name);
      });
        charactersArray.forEach((character) => {
            const characterData = genshin.characters(character);
            if (characterData.length > 0) {
            charactersJSON[character] = characterData[0];
            }
        });
        console.log(charactersJSON);

      