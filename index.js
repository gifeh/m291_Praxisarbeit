const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const projects = ref([]);

        // Projekte laden
        const loadProjects = async () => {
            try {
                // Lade Projekte von der API
                const response = await axios.get('https://api-sbw-plc.sbw.media/Project');

                // Projekte initialisieren
                projects.value = response.data.resources.map(project => ({
                    ...project,
                    teamMembersCount: 0 // Platzhalter für Teammitgliedszähler
                }));

                // Lade Teammitglieder-Daten und aktualisiere Teammitgliedszähler für jedes Projekt
                for (let project of projects.value) {
                    const membersResponse = await axios.get(`https://api-sbw-plc.sbw.media/Studentroleproject?ProjectID=${project.ID}`);

                    // Überprüfen, ob das 'resources'-Array existiert
                    if (membersResponse.data && Array.isArray(membersResponse.data.resources)) {
                        project.teamMembersCount = membersResponse.data.resources.length;
                    } else {
                        console.warn(`Unerwartete Datenstruktur für Projekt ID ${project.ID}:`, membersResponse.data);
                        project.teamMembersCount = 0; // Fallback, falls keine Teammitglieder gefunden wurden
                    }
                }
            } catch (error) {
                console.error('Fehler beim Laden der Projekte:', error);
            }
        };

        // Navigiere zur Projektübersicht
        const goToProjectOverview = (projectId) => {
            window.location.href = `projekt_uebersicht.html?projectId=${projectId}`;
        };

        onMounted(() => {
            loadProjects();
        });

        return {
            projects,
            goToProjectOverview
        };
    }
}).mount('#app');
