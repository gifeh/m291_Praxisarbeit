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
        this.availableEmployees = response.data.resources;  
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
              // Vollständigen Namen zusammenfügen
              const fullName = `${newMember.firstname || ''} ${newMember.lastname || ''}`.trim();

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
    }
  },

  mounted() {
    this.fetchProjectData();
    this.fetchAvailableEmployees();
    this.fetchProjectRoles();
  }
}).mount('#app');
