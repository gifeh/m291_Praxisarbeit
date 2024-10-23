const app = Vue.createApp({
    data() {
        return {
            project: null,
            teamMembers: [],
            availableEmployees: [],
            projectRoles: [],
            newMemberId: null,
            newMemberRole: ''
        };
    },
    methods: {
        async fetchProjectData() {
            try {
                // Beispielhafter API-Aufruf für das Projekt
                const response = await axios.get('https://api-sbw-plc.sbw.media/Project/{project_id}');
                this.project = response.data;
                this.teamMembers = this.project.teamMembers;  // Hier müssen Teammitglieder aus dem Projekt kommen
            } catch (error) {
                console.error("Fehler beim Laden der Projektdaten:", error);
            }
        },
        async fetchAvailableEmployees() {
            try {
                // API-Aufruf für verfügbare Mitarbeiter
                const response = await axios.get('https://api-sbw-plc.sbw.media/Student');
                this.availableEmployees = response.data.resources;  // Die Mitarbeiter sind in 'resources'
                console.log("Verfügbare Mitarbeiter:", this.availableEmployees);
            } catch (error) {
                console.error("Fehler beim Laden der verfügbaren Mitarbeiter:", error);
            }
        },
        async fetchProjectRoles() {
            try {
                // API-Aufruf für Projektrollen
                const response = await axios.get('https://api-sbw-plc.sbw.media/Projectrole');
                this.projectRoles = response.data.resources;  // Die Rollen sind in 'resources'
                console.log("Projektrollen:", this.projectRoles);
            } catch (error) {
                console.error("Fehler beim Laden der Projektrollen:", error);
            }
        },
        addTeamMember() {
            if (this.newMemberId && this.newMemberRole) {
                const newMember = this.availableEmployees.find(emp => emp.id === this.newMemberId);
                if (newMember) {
                    this.teamMembers.push({ ...newMember, role: this.newMemberRole });
                    // Zurücksetzen der Auswahl nach dem Hinzufügen
                    this.newMemberId = null;
                    this.newMemberRole = '';
                }
            }
        },
        removeTeamMember(memberId) {
            this.teamMembers = this.teamMembers.filter(member => member.id !== memberId);
        },
        saveChanges() {
            // Speichern der Änderungen
            console.log('Änderungen wurden gespeichert:', this.teamMembers);
        }
    },
    mounted() {
        // API-Aufrufe beim Laden der Seite
        this.fetchProjectData();
        this.fetchAvailableEmployees();
        this.fetchProjectRoles();
    }
});

app.mount('#app');
