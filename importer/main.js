  console.log('Genshin Impact Team Scraper Initialized');
  let characterAvatars = {};

fetch('characterAvatars.json')
  .then(response => response.json())
  .then(data => {
    // Convertir array a objeto para búsqueda rápida
    characterAvatars = data.characters.reduce((acc, character) => {
      acc[character.name] = character.icon;
      return acc;
    }, {});
  }).finally(() => {;
  console.log('Character avatars loaded:', characterAvatars);
});
  
  
  document.addEventListener('DOMContentLoaded', function() {
            const scrapeBtn = document.getElementById('scrapeBtn');
            const urlInput = document.getElementById('url');
            const resultsDiv = document.getElementById('results');
            const loadingDiv = document.getElementById('loading');
            const errorDiv = document.getElementById('error');
            const jsonOutputDiv = document.getElementById('jsonOutput');
            const proxySelect = document.getElementById('proxySelect');
            const statusIndicator = document.getElementById('statusIndicator');
            const statusText = document.getElementById('statusText');
            const copyJsonBtn = document.getElementById('copyJsonBtn');
            const successMessage = document.getElementById('successMessage');
            
            // Hide loading initially
            loadingDiv.style.display = 'none';
            errorDiv.style.display = 'none';
            
            // Update status indicator
            function updateStatus(text, isActive = false) {
                statusText.textContent = text;
                statusIndicator.classList.toggle('active', isActive);
            }
            
            // Show success message
            function showSuccessMessage() {
                successMessage.classList.add('show');
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 3000);
            }
            
            scrapeBtn.addEventListener('click', async function() {
                const url = urlInput.value.trim();
                const proxy = proxySelect.value;
                
                if (!url) {
                    showError('Por favor ingresa una URL válida');
                    return;
                }
                
                try {
                    // Show loading and clear previous results
                    loadingDiv.style.display = 'block';
                    resultsDiv.innerHTML = '';
                    jsonOutputDiv.textContent = '';
                    errorDiv.style.display = 'none';
                    updateStatus('Obteniendo datos...', true);
                    
                    // Build proxy URL
                    const proxyUrl = proxy + encodeURIComponent(url);
                    
                    // Fetch data
                    const response = await fetch(proxyUrl);
                    
                    if (!response.ok) {
                        throw new Error(`Error HTTP! Estado: ${response.status}`);
                    }
                    
                    const htmlText = await response.text();
                    
                    // Parse the HTML content
                    const parser = new DOMParser();
                    const htmlDoc = parser.parseFromString(htmlText, 'text/html');
                    
                    // Extract team compositions
                    const teamData = extractTeamData(htmlDoc);
                    
                    // Display results
                    displayResults(teamData);
                    
                    // Display JSON output
                    jsonOutputDiv.textContent = JSON.stringify(teamData, null, 2);
                    
                    // Hide loading
                    loadingDiv.style.display = 'none';
                    updateStatus('Datos cargados correctamente', true);
                    
                    // Update status to ready after a delay
                    setTimeout(() => updateStatus('Listo'), 3000);
                } catch (error) {
                    console.error('Error:', error);
                    showError(`Error al obtener datos: ${error.message}`);
                    loadingDiv.style.display = 'none';
                    updateStatus(`Error: ${error.message}`);
                }
            });
            
            copyJsonBtn.addEventListener('click', function() {
                const text = jsonOutputDiv.textContent;
                navigator.clipboard.writeText(text).then(() => {
                    showSuccessMessage();
                });
            });
            
            function showError(message) {
                errorDiv.textContent = message;
                errorDiv.style.display = 'block';
            }
            
            function extractTeamData(doc) {
                const teamData = {};
                const headers = Array.from(doc.querySelectorAll('h3'));
                
                headers.forEach(header => {
                    const headerText = header.textContent.trim();
                    
                    if (headerText.startsWith('Best Teams for ')) {
                        const characterName = headerText.replace('Best Teams for ', '');
                        let nextElement = header.nextElementSibling;
                        
                        // Find the next table element
                        while (nextElement && nextElement.tagName !== 'TABLE') {
                            nextElement = nextElement.nextElementSibling;
                        }
                        
                        if (nextElement && nextElement.tagName === 'TABLE') {
                            const table = nextElement;
                            const teams = [];
                            const rows = table.querySelectorAll('tbody tr');
                            
                            rows.forEach(row => {
                                const cells = row.querySelectorAll('td');
                                if (cells.length >= 2) {
                                    const teamName = cells[0].textContent.trim();
                                    const characters = [];
                                    
                                    // Extract character links
                                    for (let i = 1; i < cells.length; i++) {
                                        const link = cells[i].querySelector('a');
                                        if (link) {
                                            // Try to get character name from image alt or link text
                                            const img = link.querySelector('img');
                                            let charName = img ? img.getAttribute('alt') : link.textContent.trim();
                                            
                                            // Clean up name if it contains "Icon"
                                            if (charName && charName.includes(' Icon')) {
                                                charName = charName.replace(' Icon', '');
                                            }
                                            
                                            const charUrl = link.href;
                                            characters.push({
                                                name: charName || 'Unknown Character',
                                                link: charUrl
                                            });
                                        }
                                    }
                                    
                                    teams.push({
                                        teamName: teamName,
                                        characters: characters
                                    });
                                }
                            });
                            
                            teamData[characterName] = teams;
                        }
                    }
                });
                
                return teamData;
            }
            
            function displayResults(data) {
                resultsDiv.innerHTML = '';
                
                if (Object.keys(data).length === 0) {
                    resultsDiv.innerHTML = '<div class="character-section"><p>No se encontraron composiciones de equipo</p></div>';
                    return;
                }
                
                for (const [character, teams] of Object.entries(data)) {
                    const characterSection = document.createElement('div');
                    characterSection.className = 'character-section';
                    
                    // Create header
                    const header = document.createElement('div');
                    header.className = 'character-header';
                    header.innerHTML = `
                        <div class="character-icon">${character.charAt(0)}</div>
                        <h2 class="character-name">${character}</h2>
                    `;
                    
                    // Create teams container
                    const teamsContainer = document.createElement('div');
                    teamsContainer.className = 'team-grid';
                    
                    // Add each team
                    teams.forEach(team => {
                        const teamCard = document.createElement('div');
                        teamCard.className = 'team-card';
                        
                        const teamName = document.createElement('h3');
                        teamName.className = 'team-name';
                        teamName.textContent = team.teamName;
                        
                        const characterList = document.createElement('ul');
                        characterList.className = 'character-list';
                        
                        team.characters.forEach(char => {
                            const charItem = document.createElement('li');
                            const charName = char.name.includes('Genshin ') ? char.name.replace('Genshin - ', '') : char.name;
                            const iconUrl = characterAvatars[char.name] || 'placeholder.png';
                            // TODO : Change Icon to character icon
                            charItem.className = 'character-item';
                            charItem.innerHTML = `
                                <a href="${char.link}" target="_blank" class="character-link">
                                    <img src="${iconUrl}" alt="${charName}" class="character-avatar">
                                    <span class="char-name">${charName}</span>
                                </a>
                            `;
                            characterList.appendChild(charItem);
                        });
                        
                        teamCard.appendChild(teamName);
                        teamCard.appendChild(characterList);
                        teamsContainer.appendChild(teamCard);
                    });
                    
                    characterSection.appendChild(header);
                    characterSection.appendChild(teamsContainer);
                    resultsDiv.appendChild(characterSection);
                }
            }
        });