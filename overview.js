// Beispiel-API-URL
const apiURL = "https://example.com/api/projects"; // Ersetze dies mit deiner echten API-URL

// Funktion, um die Projekte von der API abzurufen
async function fetchProjects() {
    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error("Fehler beim Abrufen der Projekte von der API");
        }
        const data = await response.json();
        return data.projects; // Gehe davon aus, dass die Projekte in einem "projects"-Array in der Antwort sind
    } catch (error) {
        console.error("API-Fehler:", error);
        return []; // Rückgabe eines leeren Arrays im Fehlerfall
    }
}

// Funktion, um die Projekte anzuzeigen
async function displayProjects() {
    const projectContainer = document.getElementById('project-container');
    const projects = await fetchProjects();

    projects.forEach(project => {
        const projectBox = document.createElement('div');
        projectBox.className = 'project-box';

        const projectName = document.createElement('h3');
        projectName.textContent = project.name;

        const projectDescription = document.createElement('p');
        projectDescription.textContent = project.description;

        projectBox.appendChild(projectName);
        projectBox.appendChild(projectDescription);

        const teamHeader = document.createElement('h4');
        teamHeader.textContent = 'Team:';
        projectBox.appendChild(teamHeader);

        if (project.team.length > 0) {
            const teamList = document.createElement('ul');
            project.team.forEach(member => {
                const teamMember = document.createElement('li');
                teamMember.textContent = `${member.name} - ${member.role}`;
                teamList.appendChild(teamMember);
            });
            projectBox.appendChild(teamList);
        } else {
            const noTeamMessage = document.createElement('p');
            noTeamMessage.textContent = "Es wurde noch kein Team zugewiesen.";
            projectBox.appendChild(noTeamMessage);
        }

        projectContainer.appendChild(projectBox);
    });
}

// Weiterleitung zur Startseite
function goToStartPage() {
    window.location.href = "index.html"; // Leite zur Startseite weiter
}


// Seite initialisieren und Projekte anzeigen
window.onload = displayProjects;
