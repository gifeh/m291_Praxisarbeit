const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const projects = ref([]);

        // Projekte laden
        const loadProjects = async () => {
            try {
                const response = await axios.get('https://api-sbw-plc.sbw.media/Project');
                projects.value = response.data.resources.map(project => {
                    return {
                        ...project,
                        teamMembersCount: Math.floor(Math.random() * 10) + 1 // Zufällig generierte Anzahl
                    };
                });
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
