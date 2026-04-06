const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pageobjects/LoginPage");
const { DashboardPage } = require("../pageobjects/DashboardPage");
const { ProjectsPage } = require("../pageobjects/ProjectsPage");
const { getCredentials } = require("../config/env.config");
const { addNewProjectTestData } = require("../test-data/AddNewProjectData");

// Get credentials from environment
const credentials = getCredentials();

// Smoke tests: core UI and basic flow
test.describe("Add New Project - Modal Display and UI Tests", { tag: "@smoke" }, () => {
    
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);
        
        // Navigate to application and login
        await loginPage.goto();
        await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
        
        // Wait for dashboard to load
        await page.waitForLoadState("networkidle");
        await expect(page).toHaveURL(new RegExp("/dashboard"));
        
        // Navigate to Projects page
        await dashboardPage.clickNavigationMenu("Projects");
        await page.waitForLoadState("networkidle");
    });

    test("Verify modal opens when clicking '+ New Project' button", async ({ page }) => {
        const projectsPage = new ProjectsPage(page);
        
        // Click on "+ New Project" button
        await projectsPage.clickNewProjectButton();
        
        // Verify modal is visible
        await projectsPage.verifyModalIsVisible();
    });

    test("Verify modal title is 'Add New Project'", async ({ page }) => {
        const projectsPage = new ProjectsPage(page);
        
        // Open modal
        await projectsPage.clickNewProjectButton();
        
        // Verify modal title
        await projectsPage.verifyModalTitle(addNewProjectTestData.modal.title);
    });

    test("Verify modal description text", async ({ page }) => {
        const projectsPage = new ProjectsPage(page);
        
        // Open modal
        await projectsPage.clickNewProjectButton();
        
        // Verify modal description
        await projectsPage.verifyModalDescription(addNewProjectTestData.modal.description);
    });

    test("Verify close button (X) is visible and clickable", async ({ page }) => {
        const projectsPage = new ProjectsPage(page);
        
        // Open modal
        await projectsPage.clickNewProjectButton();
        
        // Verify close button is visible and clickable
        await projectsPage.verifyCloseButton();
    });

    test("Verify all form fields are visible", async ({ page }) => {
        const projectsPage = new ProjectsPage(page);
        
        // Open modal
        await projectsPage.clickNewProjectButton();
        
        // Verify all form fields are visible
        await projectsPage.verifyAllFormFieldsVisible();
    });

    test("Verify 'Cancel' and 'Add Project' buttons are visible", async ({ page }) => {
        const projectsPage = new ProjectsPage(page);
        
        // Open modal
        await projectsPage.clickNewProjectButton();
        
        // Verify form buttons are visible
        await projectsPage.verifyFormButtons();
    });

    test("Verify complete modal UI elements are displayed", async ({ page }) => {
        const projectsPage = new ProjectsPage(page);
        
        // Open modal
        await projectsPage.clickNewProjectButton();
        
        // Verify modal is visible
        await projectsPage.verifyModalIsVisible();
        
        // Verify modal title
        await projectsPage.verifyModalTitle(addNewProjectTestData.modal.title);
        
        // Verify modal description
        await projectsPage.verifyModalDescription(addNewProjectTestData.modal.description);
        
        // Verify close button
        await projectsPage.verifyCloseButton();
        
        // Verify all form fields
        await projectsPage.verifyAllFormFieldsVisible();
        
        // Verify form buttons
        await projectsPage.verifyFormButtons();
    });
});

// Regression tests: required field validation behaviour
test.describe("Add New Project - Required Field Validation Tests", { tag: "@regression" }, () => {
    
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);
        
        // Navigate to application and login
        await loginPage.goto();
        await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
        
        // Wait for dashboard to load
        await page.waitForLoadState("networkidle");
        await expect(page).toHaveURL(new RegExp("/dashboard"));
        
        // Navigate to Projects page
        await dashboardPage.clickNavigationMenu("Projects");
        await page.waitForLoadState("networkidle");
        
        // Open modal
        const projectsPage = new ProjectsPage(page);
        await projectsPage.clickNewProjectButton();
        await projectsPage.verifyModalIsVisible();
    });

    test("Submit with all fields empty → Project Name errors", async ({ page }) => {
        const projectsPage = new ProjectsPage(page);
        const scenario = addNewProjectTestData.validationScenarios.allFieldsEmpty;
        
        // Clear all fields (they should already be empty, but ensure)
        await projectsPage.clearAllFields();
        
        // Verify modal is still open before submitting
        await projectsPage.verifyModalIsVisible();
        
        // Submit form
        await projectsPage.clickAddProjectButton();
        
        // Wait a bit for validation errors to appear (form should not submit with empty fields)
        await page.waitForTimeout(500);
        
        // Verify modal is still open (validation should prevent submission)
        const isModalStillOpen = await projectsPage.modal.isVisible({ timeout: 2000 }).catch(() => false);
        if (!isModalStillOpen) {
            throw new Error("Modal closed unexpectedly - form may have submitted with empty fields (validation not working)");
        }
        
        // Verify error messages are displayed
        await projectsPage.verifyErrorMessages(scenario.expectedErrors);
        console.log(`Verified errors for: ${scenario.description}`);
    });

    test("Submit with all required fields filled → no required field errors", async ({ page }) => {
        const projectsPage = new ProjectsPage(page);
        const scenario = addNewProjectTestData.validationScenarios.allRequiredFieldsFilled;
        
        // Fill all required fields
        await projectsPage.fillProjectName(scenario.fields.projectName);
        
        // Select dropdowns if they have values
        if (scenario.fields.projectType) {
            await projectsPage.selectProjectType(scenario.fields.projectType);
        }
        
        // Submit form
        await projectsPage.clickAddProjectButton();
        
        // Verify no required field errors are displayed
        await projectsPage.verifyNoRequiredFieldErrors();
        console.log(`Verified no errors for: ${scenario.description}`);
    });
});

// Regression tests: dropdown behaviour and options
test.describe("Add New Project - Dropdown Validation Tests", { tag: "@regression" }, () => {
    
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);
        
        // Navigate to application and login
        await loginPage.goto();
        await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
        
        // Wait for dashboard to load
        await page.waitForLoadState("networkidle");
        await expect(page).toHaveURL(new RegExp("/dashboard"));
        
        // Navigate to Projects page
        await dashboardPage.clickNavigationMenu("Projects");
        await page.waitForLoadState("networkidle");
        
        // Open modal
        const projectsPage = new ProjectsPage(page);
        await projectsPage.clickNewProjectButton();
        await projectsPage.verifyModalIsVisible();
    });

    // Project Type Dropdown Tests
    test.describe("Project Type Dropdown Tests", () => {
        
        test("Verify Project Type dropdown default value is 'Fixed Price'", async ({ page }) => {
            const projectsPage = new ProjectsPage(page);
            const expectedDefault = addNewProjectTestData.formFields.projectType.defaultValue;
            
            // Verify default value
            await projectsPage.verifyDropdownDefaultValue(
                projectsPage.projectTypeDropdown,
                expectedDefault
            );
        });

        test("Verify all Project Type options are selectable", async ({ page }) => {
            const projectsPage = new ProjectsPage(page);
            const options = addNewProjectTestData.formFields.projectType.options;
            
            // Verify all options can be selected
            await projectsPage.verifyAllOptionsSelectable(
                projectsPage.projectTypeDropdown,
                options,
                "Project Type"
            );
        });

        test("Verify Project Type selected value persists", async ({ page }) => {
            const projectsPage = new ProjectsPage(page);
            const testValue = "Time & Materials"; // Test with a different value than default
            
            // Verify selected value persists
            await projectsPage.verifySelectedValuePersists(
                projectsPage.projectTypeDropdown,
                testValue,
                "Project Type"
            );
        });

        test("Verify Project Type required validation", async ({ page }) => {
            const projectsPage = new ProjectsPage(page);
            
            // Verify required validation
            await projectsPage.verifyProjectTypeRequiredValidation();
        });
    });

});

// Regression tests: cancel flow behaviour
test.describe("Add New Project - Cancel and Close Button Tests", { tag: "@regression" }, () => {
    
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);
        
        // Navigate to application and login
        await loginPage.goto();
        await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
        
        // Wait for dashboard to load
        await page.waitForLoadState("networkidle");
        await expect(page).toHaveURL(new RegExp("/dashboard"));
        
        // Navigate to Projects page
        await dashboardPage.clickNavigationMenu("Projects");
        await page.waitForLoadState("networkidle");
    });

    test("Cancel button - Closes modal without saving, no data saved, returns to Projects page", async ({ page }) => {
        const projectsPage = new ProjectsPage(page);
        const testData = {
            projectName: "Test Project Cancel",
            projectType: "Time & Materials",
            startDate: "01-01-2026",
            endDate: "31-12-2026"
        };
        
        // Open modal
        await projectsPage.clickNewProjectButton();
        await projectsPage.verifyModalIsVisible();
        
        // Fill form with test data
        await projectsPage.fillFormWithTestData(testData);
        
        // Click Cancel button
        await projectsPage.clickCancelButton();
        
        // Verify modal is closed
        await projectsPage.verifyModalIsClosed();
        
        // Verify we are on Projects page
        await projectsPage.verifyOnProjectsPage();
        
        // Verify no data was saved by reopening modal and checking fields are empty
        await projectsPage.verifyFormDataIsCleared();
        
        console.log("Cancel button test completed - modal closed, no data saved, returned to Projects page");
    });

});

// Critical path: both smoke and regression
test.describe("Add New Project - Successful Project Creation", { tag: ["@smoke", "@regression"] }, () => {
    
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);
        
        // Navigate to application and login
        await loginPage.goto();
        await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
        
        // Wait for dashboard to load
        await page.waitForLoadState("networkidle");
        await expect(page).toHaveURL(new RegExp("/dashboard"));
        
        // Navigate to Projects page
        await dashboardPage.clickNavigationMenu("Projects");
        await page.waitForLoadState("networkidle");
    });

    test("Create new project with valid data and verify it appears in list", async ({ page }) => {
        const projectsPage = new ProjectsPage(page);
        
        // Test data
        const testData = {
            projectName: "Test Automation EMPCRUX",
            projectType: "Fixed Price",
            startDate: "16-02-2026",
            endDate: "27-02-2026",
            projectOwnerType: "None"
        };
        
        // Step 1: Click "+ New Project" button
        await projectsPage.clickNewProjectButton();
        await projectsPage.verifyModalIsVisible();
        console.log("Step 1: Modal opened successfully");
        
        // Step 2: Enter values in form with valid data
        await projectsPage.fillProjectName(testData.projectName);
        await projectsPage.selectProjectType(testData.projectType);
        await projectsPage.fillStartDate(testData.startDate);
        await projectsPage.fillEndDate(testData.endDate);
        console.log("Step 2: Form filled with all test data");
        
        // Step 3: Click on "Add Project" button
        await projectsPage.clickAddProjectButton();
        console.log("Step 3: Add Project button clicked");
        
        // Step 4: Verify modal closes after successful submission
        await projectsPage.verifyModalIsClosed();
        console.log("Step 4: Modal closed after successful submission");
        
        // Step 5: Verify newly added project appears in the list
        await projectsPage.verifyProjectInList(testData.projectName);
        console.log("Step 5: Newly added project verified in the list");

        // Step 6: Click on delete icon for the newly added project
        await projectsPage.clickDeleteIconForProject(testData.projectName);
        await projectsPage.verifyDeleteModalIsVisible();
        console.log("Step 6: Delete icon clicked and delete confirmation modal opened");

        // Step 7: In the delete confirmation popup click on the "Delete" button
        await projectsPage.confirmDelete();
        console.log("Step 7: Delete button clicked in delete confirmation popup");

        // Step 8: Verify that the project is no longer present in the list
        await projectsPage.verifyProjectNotPresent(testData.projectName);
        console.log('Step 8: Verified project "Test Automation EMPCRUX" is no longer present in the list');
    
        console.log("Test completed successfully - Project created, verified in list, then deleted and removal verified");
    });
});
