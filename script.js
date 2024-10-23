// URL der API, die die Projekte bereitstellt
const apiURL = 'http://api-sbw-plc.sbw.media/Project';

// Funktion, um die Projekte von der API abzurufen
async function fetchProjects() {
    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error('Fehler beim Abrufen der Projekte von der API');
        }
        const data = await response.json();
        return data; // Gehe davon aus, dass die Projektdaten direkt im JSON enthalten sind
    } catch (error) {
        console.error('API-Fehler:', error);
        return [];
    }
}

// Funktion, um die Projekte in das Dropdown-Menü einzufügen
// Funktion, um die Projektdaten von der API abzurufen
async function fetchProjects() {
    const apiURL = 'http://api-sbw-plc.sbw.media/Project'; 
    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`Fehler: ${response.status}`);
        }
        const projects = await response.json(); // Umwandeln der Antwort in JSON
        return projects; // Projektdaten zurückgeben
    } catch (error) {
        console.error('Fehler beim Abrufen der Projektdaten:', error);
        return [];
    }
}

// Funktion, um die Projekte in das Dropdown-Menü einzufügen
async function populateProjectDropdown() {
    const projectSelect = document.getElementById('project-select'); // Dropdown-Element
    const projects = await fetchProjects(); // Hole die Projektdaten von der API

    // Leere den Dropdown, bevor neue Optionen hinzugefügt werden
    projectSelect.innerHTML = '<option value="">Bitte wähle ein Projekt</option>';

    // Durch die Projektdaten laufen und die Optionen ins Dropdown-Menü einfügen
    projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.id; // Projekt-ID als Wert
        option.textContent = project.name; // Projektnamen als Anzeige
        projectSelect.appendChild(option);
    });
}

// Ruft die Funktion auf, um das Dropdown-Menü zu befüllen, sobald die Seite geladen ist
document.addEventListener('DOMContentLoaded', populateProjectDropdown);


// Funktion, um zur nächsten Seite zu navigieren
document.getElementById('continue-button').addEventListener('click', function() {
    const selectedProject = document.getElementById('project-select').value;
    if (selectedProject) {
        // Weiterleitung zur Teamauswahl-Seite mit der Projekt-ID
        window.location.href = "zwei.html?projectId=" + selectedProject;
    } else {
        alert('Bitte wähle ein Projekt aus.');
    }
});

// Rufe die Funktion auf, um das Dropdown-Menü zu füllen
populateProjectDropdown();
