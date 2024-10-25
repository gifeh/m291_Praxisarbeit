const { createApp } = Vue;

createApp({
    data() {
        return {
            project: null,
            teamMembers: [],
            newMembers: [],
            availableEmployees: [],
            projectRoles: [],
            newMemberId: null,
            newMemberRole: '',
            projectId: null // Neue Eigenschaft zur Speicherung der projectId
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
            const projectId = this.projectId;
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
            const projectId = this.projectId;
            if (!projectId) {
                console.error("Keine projectId in der URL gefunden.");
                return;
            }
            const existingMembers = await this.fetchData(`https://api-sbw-plc.sbw.media/Studentroleproject?ProjectID=${projectId}`);

            existingMembers.forEach(async member => {
                const student = await axios.get(`https://api-sbw-plc.sbw.media/Student/${member.StudentID}`);
                this.teamMembers.push({
                    id: member.StudentID,
                    entryId: member.ID,
                    fullName: student.data.fullname,
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

            this.newMembers.push({ id: newMember.id, fullName: newMember.fullname, role: this.newMemberRole });
            this.teamMembers.push({ id: newMember.id, fullName: newMember.fullname, role: this.newMemberRole });
            this.newMemberId = null;
            this.newMemberRole = '';
        },

        removeTeamMember(memberId) {
            this.teamMembers.filter(member => member.id === memberId).forEach(this.deleteMember);
            this.teamMembers = this.teamMembers.filter(member => member.id !== memberId);
        },

        saveChanges() {
            console.log('Änderungen wurden gespeichert:', this.newMembers);
            this.newMembers.forEach(this.saveMember);
            this.newMembers = [];
        },

        async deleteMember(member) {
            console.log(member);
            await axios.delete(`https://api-sbw-plc.sbw.media/Studentroleproject/${member.entryId}`);
        },

        async saveMember(member) {
            const projectId = this.projectId;
            if (!projectId) {
                console.error("Keine projectId in der URL gefunden.");
                return;
            }
            await axios.post("https://api-sbw-plc.sbw.media/Studentroleproject", {
                StudentID: member.id,
                ProjectID: projectId,
                Start: new Date().toISOString().split('T')[0],
                ProjectRoleID: member.role,
                End: "2024-10-24"
            });
        },
    },

    mounted() {
        this.projectId = this.getProjectIdFromUrl(); // projectId beim Laden setzen
        if (!this.projectId) {
            console.error("Keine projectId in der URL gefunden.");
            return;
        }
        this.fetchProjectData();
        this.fetchAvailableEmployees();
        this.fetchProjectRoles();
        this.fetchExistingTeamMembers();
    }
}).mount('#app');
