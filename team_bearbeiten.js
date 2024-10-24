const { createApp } = Vue;

createApp({
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
        getProjectIdFromUrl() {
            const params = new URLSearchParams(window.location.search);
            return params.get('projectId');
        },


        async fetchProjectData() {
            try {
                const projectId = this.getProjectIdFromUrl();
                if (!projectId) {
                    console.error("Keine projectId in der URL gefunden.");
                    return;
                }

                const response = await axios.get(`https://api-sbw-plc.sbw.media/Project/${projectId}`);
                this.project = response.data;
                this.teamMembers = this.project.teamMembers || [];
            } catch (error) {
                console.error("Fehler beim Laden der Projektdaten:", error);
            }
        },

        async fetchAvailableEmployees() {
            try {
                const response = await axios.get('https://api-sbw-plc.sbw.media/Student');
                this.availableEmployees = response.data.resources.map(emp => ({
                    id: emp.id,
                    fullname: emp.fullname // Nur fullname wird verwendet
                }));
                console.log("Verfügbare Mitarbeiter:", this.availableEmployees);
            } catch (error) {
                console.error("Fehler beim Laden der verfügbaren Mitarbeiter:", error);
            }
        },

        async fetchProjectRoles() {
            try {
                const response = await axios.get('https://api-sbw-plc.sbw.media/Projectrole');
                this.projectRoles = response.data.resources;
            } catch (error) {
                console.error("Fehler beim Laden der Projektrollen:", error);
            }
        },

        addTeamMember() {
            if (this.newMemberId && this.newMemberRole) {
                const newMember = this.availableEmployees.find(emp => emp.id === this.newMemberId);
                if (newMember) {
                    // Überprüfen, ob das Teammitglied bereits hinzugefügt wurde
                    const isMemberAlreadyAdded = this.teamMembers.some(member => member.id === newMember.id);
                    if (!isMemberAlreadyAdded) {
                        // Überprüfen, ob schon ein Projektleiter existiert
                        const isProjectLeaderAlreadyAdded = this.teamMembers.some(member => member.role === 'Projektleiter');

                        if (this.newMemberRole === 'PL' && isProjectLeaderAlreadyAdded) {
                            alert('Es kann nur einen Projektleiter geben.');
                            return; // Stoppe den Hinzufüge-Vorgang
                        }

                        // Verwende nur fullname aus den API-Daten
                        const fullName = newMember.fullname;

                        // Teammitglied hinzufügen
                        this.teamMembers.push({ id: newMember.id, fullName, role: this.newMemberRole });

                        // Zurücksetzen der Auswahl nach dem Hinzufügen
                        this.newMemberId = null;
                        this.newMemberRole = '';
                    } else {
                        alert("Dieses Teammitglied wurde bereits hinzugefügt.");
                    }
                }
            }
        },


        removeTeamMember(memberId) {
            this.teamMembers = this.teamMembers.filter(member => member.id !== memberId);
        },

        saveChanges() {
            console.log('Änderungen wurden gespeichert:', this.teamMembers);
            this.teamMembers.forEach(this.saveMember);
        },
        
        async mounted() {
        try {
        await this.loadTeamMembers();
        } catch (error) {
            console.error("Fehler beim Laden der Teammitglieder:", error);
        }
        },
        async loadTeamMembers() {
            try {
                const response = await axios.get("https://api-sbw-plc.sbw.media/Studentroleproject");
                this.teamMembers = response.data.resource
                    .map(teamMember => ({
                        id: teamMember.StudentID,
                        fullName: teamMember.Student.fullname,
                        role: teamMember.ProjectRoleID,
                        Start: new Date().toISOString().split('T')[0],
                        // end: new Date().toISOString().split('T')[0]
                    }));
            } catch (error) {
                console.error("Fehler beim Laden der Teammitglieder:", error);
            }
        },
        


        async saveMember(member) {

         
            const response = await axios.post("https://api-sbw-plc.sbw.media/Studentroleproject", {
                StudentID: member.id,
                ProjectID: 164,
                //Heute als Datum formatieren
                Start: new Date().toISOString().split('T')[0],
                ProjectRoleID: member.role,
                //End: "2024-10-24"
            })
        },
       },

    mounted() {
        this.fetchProjectData();
        this.fetchAvailableEmployees();
        this.fetchProjectRoles();
    }
}).mount('#app');
