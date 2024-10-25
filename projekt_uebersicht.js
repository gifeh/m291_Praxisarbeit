const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const project = ref(null);
        const teamMembers = ref([]);
        const projectRoles = ref([]);

        // Funktion um Parameter aus der URL zu bekommen
        const getProjectIdFromUrl = () => {
            const params = new URLSearchParams(window.location.search);
            return params.get('projectId');
        };

        // Lade Projekt Details und Rollen
        const loadProjectDetails = async () => {
            const projectId = getProjectIdFromUrl();
            try {
                const projectResponse = await axios.get(`https://api-sbw-plc.sbw.media/Project/${projectId}`);
                project.value = projectResponse.data;

                // Lade die Projektrollen
                const rolesResponse = await axios.get('https://api-sbw-plc.sbw.media/Projectrole');
                projectRoles.value = rolesResponse.data.resources;

                // Lade Teammitglieder
                await fetchExistingTeamMembers(projectId);
            } catch (error) {
                console.error('Fehler beim Laden des Projekts:', error);
            }
        };

        // Lade Teammitglieder und verknüpfe mit Rollen
        const fetchExistingTeamMembers = async (projectId) => {
            try {
                const membersResponse = await axios.get(`https://api-sbw-plc.sbw.media/Studentroleproject?ProjectID=${projectId}`);
                const members = membersResponse.data.resources;

                for (const member of members) {
                    const role = projectRoles.value.find(role => role.ID === member.ProjectRoleID);
                    teamMembers.value.push({
                        id: member.StudentID,
                        name: await getStudentFullName(member.StudentID),
                        role: role ? role.Name : 'Unbekannte Rolle' // Vollständiger Rollenname
                    });
                }
            } catch (error) {
                console.error('Fehler beim Laden der Teammitglieder:', error);
            }
        };

        // Helper-Funktion zum Abrufen des vollständigen Namens eines Schülers
        const getStudentFullName = async (studentId) => {
            try {
                const response = await axios.get(`https://api-sbw-plc.sbw.media/Student/${studentId}`);
                return response.data.fullname;
            } catch (error) {
                console.error(`Fehler beim Abrufen des Namens für Schüler ID ${studentId}:`, error);
                return 'Unbekannter Student'; // Fallback
            }
        };

        // Gehe zur Team bearbeiten Seite
        const goToEditTeam = () => {
            console.log(`Navigiere zu Team bearbeiten mit projectId: ${project.value.ID}`);
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
