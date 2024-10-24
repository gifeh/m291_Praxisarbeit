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
            return new URLSearchParams(window.location.search).get('projectId');
        },

        async fetchData(url) {
            try {
                const response = await axios.get(url);
                return response.data.resources || response.data;
            } catch (error) {
                console.error(`Fehler beim Laden von ${url}:`, error);
            }
        },


        async fetchProjectData() {
            const projectId = this.getProjectIdFromUrl();
            if (!projectId) {
                console.error("Keine projectId in der URL gefunden.");
                return;
            }
            this.project = await this.fetchData(`https://api-sbw-plc.sbw.media/Project/${projectId}`);
            this.teamMembers = this.project.teamMembers || [];
        },

        async fetchAvailableEmployees() {
            this.availableEmployees = await this.fetchData('https://api-sbw-plc.sbw.media/Student');
        },

        async fetchProjectRoles() {
            this.projectRoles = await this.fetchData('https://api-sbw-plc.sbw.media/Projectrole');
        },

        async fetchExistingTeamMembers() {
            const projectId = 164; // Fester Wert, du kannst ihn auch dynamisch setzen, falls nötig
            const existingMembers = await this.fetchData(`https://api-sbw-plc.sbw.media/Studentroleproject?ProjectID=${projectId}`);
            
            // Für jedes existierende Teammitglied, hole die Details (z.B. Name) von der API
            existingMembers.forEach(async member => {
                const student = await axios.get(`https://api-sbw-plc.sbw.media/Student/${member.StudentID}`);
                this.teamMembers.push({
                    id: member.StudentID,
                    fullName: student.data.fullname, // Annahme, dass fullname im Response vorhanden ist
                    role: member.ProjectRoleID
                });
            });
        },

        addTeamMember() {
            if (!this.newMemberId || !this.newMemberRole) return;

            const newMember = this.availableEmployees.find(emp => emp.id === this.newMemberId);
            if (!newMember) return alert("Mitarbeiter nicht gefunden.");

            if (this.teamMembers.some(member => member.id === newMember.id)) {
                return alert("Dieses Teammitglied wurde bereits hinzugefügt.");
            }

            const isProjectLeaderAlreadyAdded = this.teamMembers.some(member => member.role === 'Projektleiter');
            if (this.newMemberRole === 'PL' && isProjectLeaderAlreadyAdded) {
                return alert('Es kann nur einen Projektleiter geben.');
            }

            this.teamMembers.push({ id: newMember.id, fullName: newMember.fullname, role: this.newMemberRole });
            this.newMemberId = null;
            this.newMemberRole = '';
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
<<<<<<< HEAD
            await axios.post("https://api-sbw-plc.sbw.media/Studentroleproject", {
=======

         
            const response = await axios.post("https://api-sbw-plc.sbw.media/Studentroleproject", {
>>>>>>> 2889bdfff10b97bccd2096b7972faa586ca7eda1
                StudentID: member.id,
                ProjectID: 164,
                Start: new Date().toISOString().split('T')[0], // Heute als Datum formatieren
                ProjectRoleID: member.role,
                End: "2024-10-24" // Enddatum im ISO-Format
            });
        },
       },

    mounted() {
        this.fetchProjectData();
        this.fetchAvailableEmployees();
        this.fetchProjectRoles();
        this.fetchExistingTeamMembers(); // Existierende Teammitglieder laden
    }
}).mount('#app');
