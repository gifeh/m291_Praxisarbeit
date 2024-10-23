// URL der API für die Namen (Beispiel)
const apiURL = "https://api.example.com/names"; // Ersetze diese URL mit der tatsächlichen API

// Dummy-Namen zum Testen
const dummyNames = ["Anna", "Ben", "Clara", "David", "Eva"];

// Funktion, um die Namen von der API abzurufen
async function fetchNames() {
    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error("Fehler beim Abrufen der Namen von der API");
        }
        const data = await response.json();
        return data.names; // Gehe davon aus, dass die Namen in einem "names"-Array in der Antwort sind
    } catch (error) {
        console.error("API-Fehler:", error);
        return dummyNames; // Verwende Dummy-Namen, wenn die API fehlschlägt
    }
}

// Funktion, um die Select-Elemente mit den abgerufenen Namen zu befüllen
function populateSelect(select, names) {
    names.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
    });
}

// Initialisieren der Seite
window.onload = async function() {
    // Namen von der API abrufen
    const names = await fetchNames();

    if (names.length === 0) {
        alert("Keine Namen verfügbar");
        return;
    }

    // Befülle das Projektleiterfeld
    const leaderSelect = document.getElementById('leader-select');
    populateSelect(leaderSelect, names); 

    // Befülle die ersten beiden Teammitgliedfelder
    for (let i = 1; i <= 2; i++) {
        const teamSelect = document.getElementById(`team-select-${i}`);
        populateSelect(teamSelect, names);
    }

    // Überwachung der Enter-Taste, um neue Teammitglieder hinzuzufügen
    document.getElementById('team-container').addEventListener('keydown', function(event) {
        if (event.key === "Enter") {
            addNewTeamField(names);
        }
    });
};

// Zähler für zusätzliche Teammitglieder
let teamCounter = 2;

// Funktion, um ein neues Auswahlfeld und eine Rollen-Eingabe hinzuzufügen
function addNewTeamField(names) {
    teamCounter++;

    const teamContainer = document.getElementById('team-container');
    
    const newMemberDiv = document.createElement('div');
    newMemberDiv.classList.add('team-member');

    const newLabel = document.createElement('label');
    newLabel.setAttribute('for', `team-select-${teamCounter}`);
    newLabel.textContent = `Teammitglied ${teamCounter}`;
    newMemberDiv.appendChild(newLabel);
    
    const newSelect = document.createElement('select');
    newSelect.id = `team-select-${teamCounter}`;
    newSelect.className = "team-select";
    newSelect.innerHTML = '<option value="">-- Teammitglied auswählen --</option>';
    populateSelect(newSelect, names); 
    newMemberDiv.appendChild(newSelect);

    const roleLabel = document.createElement('label');
    roleLabel.setAttribute('for', `role-${teamCounter}`);
    roleLabel.textContent = 'Rolle:';
    newMemberDiv.appendChild(roleLabel);

    const roleInput = document.createElement('input');
    roleInput.type = 'text';
    roleInput.id = `role-${teamCounter}`;
    roleInput.placeholder = 'Rolle eingeben';
    newMemberDiv.appendChild(roleInput);

    newMemberDiv.appendChild(document.createElement('br'));
    newMemberDiv.appendChild(document.createElement('br'));

    teamContainer.appendChild(newMemberDiv);
}

// Funktion, um zur nächsten Seite zu navigieren
function weiter() {
    window.location.href = "drei.html";
}
