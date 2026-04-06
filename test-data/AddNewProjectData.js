const addNewProjectTestData = {
    modal: {
        title: "Add New Project",
        description: "Create a new project to track revenue, costs, and profitability."
    },
    
    formFields: {
        projectName: {
            label: "Project Name",
            placeholder: "e.g., Nimbus Revamp",
            required: true
        },
        projectType: {
            label: "Project Type",
            defaultValue: "Fixed Price",
            required: true,
            options: ["Fixed Price", "Time & Materials", "Retainer"]
        },
        startDate: {
            label: "Start Date",
            placeholder: "dd-mm-yyyy",
            required: false
        },
        endDate: {
            label: "End Date",
            placeholder: "dd-mm-yyyy",
            required: false
        },
        projectOwnerType: {
            label: "Project Owner Type",
            defaultValue: "None",
            required: false
        }
    },
    
    buttons: {
        cancel: "Cancel",
        addProject: "Add Project",
        newProject: "+ New Project"
    },
    
    validProjectData: {
        projectName: "Test Project Automation",
        projectType: "Fixed Price",
        startDate: "01-01-2026",
        endDate: "28-03-2026",
        projectOwnerType: "None"
    },
    
    invalidProjectData: {
        emptyFields: {
            projectName: "",
            projectType: ""
        },
        specialCharacters: {
            projectName: "Test@#$%Project"
        }
    },
    
    errorMessages: {
        projectNameRequired: "Project Name is required",
        projectTypeRequired: "Project Type is required"
    },
    
    validationScenarios: {
        allFieldsEmpty: {
            description: "Submit with all fields empty",
            fields: {
                projectName: ""
            },
            expectedErrors: ["Project Name"]
        },
        allRequiredFieldsFilled: {
            description: "Submit with all required fields filled",
            fields: {
                projectName: "Automation Test Project",
                projectType: "Fixed Price"
            },
            expectedErrors: []
        }
    },
    
    projectListPage: {
        columnHeaders: ["Project", "Contractors", "Project Owner", "Type", "Start Date", "Actions"]
    },
    
    editProjectData: {
        originalProjectName: "Test Project Automation",
        editedProjectName: "Edited Test Project Automation",
        originalProjectType: "Fixed Price",
        editedProjectType: "Retainer",
        originalStartDate: "01-01-2026",
        editedStartDate: "05-01-2026"
    },
    
    deleteProjectData: {
        projectName: "Edited Test Project Automation",
        deleteModalTitle: "Are you sure?",
        deleteModalMessageContains: "permanently delete",
        cancelButtonText: "Cancel",
        deleteButtonText: "Delete"
    }
};

module.exports = { addNewProjectTestData };
