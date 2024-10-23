const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const project = ref(null);
        const teamMembers = ref([]);

        // Funktion um Parameter aus der URL zu bekommen
        const getProjectIdFromUrl = () => {
            const params = new URLSearchParams(window.location.search);
            return params.get('projectId');
        };

        // Lade Projekt Details
        const loadProjectDetails = async () => {
            const projectId = getProjectIdFromUrl();
            try {
                const response = await axios.get(`https://api-sbw-plc.sbw.media/Project/${projectId}`);
                project.value = response.data;
                
                // Simuliere Teammitglieder
                teamMembers.value = [
                    { id: 1, name: 'Max Mustermann', role: 'Entwickler' },
                    { id: 2, name: 'Anna Beispiel', role: 'Designer' }
                ];
            } catch (error) {
                console.error('Fehler beim Laden des Projekts:', error);
            }
        };

        // Gehe zur Team bearbeiten Seite
        const goToEditTeam = () => {
            window.location.href = `team_bearbeiten.html?projectId=${project.value.ID}`;
        };

        onMounted(() => {
            loadProjectDetails();
        });

        return {
            project,
            teamMembers,
            goToEditTeam
        };
    }
}).mount('#app');
