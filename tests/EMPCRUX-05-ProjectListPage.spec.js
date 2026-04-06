const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pageobjects/LoginPage");
const { DashboardPage } = require("../pageobjects/DashboardPage");
const { ProjectsPage } = require("../pageobjects/ProjectsPage");
const { getCredentials } = require("../config/env.config");
const { addNewProjectTestData } = require("../test-data/AddNewProjectData");

// Get credentials from environment
const credentials = getCredentials();

test("Verify when user clicks on Projects from side menu, Project List Page is displayed", { tag: '@smoke' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const projectsPage = new ProjectsPage(page);

  // Step 1: Login to the application
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");

  // Step 2: Click on Projects menu from side navigation panel
  await dashboardPage.clickNavigationMenu("Projects");

  // Step 3: Verify Projects list page is displayed
  await projectsPage.verifyOnProjectsPage();
});

test("Verify all projects are displayed in the project table list", { tag: '@smoke' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const projectsPage = new ProjectsPage(page);

  // Step 1: Login to the application using valid credentials
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");

  // Step 2: From the left side navigation panel, click on the "Projects" menu
  await dashboardPage.clickNavigationMenu("Projects");
  await page.waitForLoadState("networkidle");

  // Step 3: Verify all projects are displayed in the project table list
  // Verify projects table is visible
  await expect(projectsPage.projectsTable).toBeVisible({ timeout: 10000 });
  console.log("Projects table is visible");

  // Verify there are projects in the list
  const projectsCount = await projectsPage.projectsList.count();
  expect(projectsCount).toBeGreaterThan(0);
  console.log(`Step 3: Verified ${projectsCount} project(s) are displayed in the project table list`);
});

test("Verify column headers in the projects table", { tag: '@smoke' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const projectsPage = new ProjectsPage(page);

  // Step 1: Login to the application using valid credentials
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");

  // Step 2: From the left side navigation panel, click on the "Projects" menu
  await dashboardPage.clickNavigationMenu("Projects");
  await page.waitForLoadState("networkidle");

  // Step 3: Verify column headers (Project, Contractors, Project Owner, Type, Start Date, Actions)
  const expectedHeaders = addNewProjectTestData.projectListPage.columnHeaders;
  await projectsPage.verifyColumnHeaders(expectedHeaders);
  console.log("Step 3: Verified all column headers are displayed correctly");
});

test("Verify opening new modal pop up window when user clicks on Add New Project button", { tag: '@smoke' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const projectsPage = new ProjectsPage(page);

  // Step 1: Login to the application using valid credentials
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");

  // Step 2: From the left side navigation panel, click on the "Projects" menu
  await dashboardPage.clickNavigationMenu("Projects");
  await page.waitForLoadState("networkidle");

  // Step 3: Click on Add New Project button
  await projectsPage.clickNewProjectButton();
  console.log("Step 3: Clicked on Add New Project button");

  // Step 4: Verify new modal pop up window is displayed
  await projectsPage.verifyModalIsVisible();
  console.log("Step 4: Verified new modal pop up window is displayed");
});

test("Create new project with valid data and verify it appears in list", { tag: '@regression' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const projectsPage = new ProjectsPage(page);

  // Step 1: Login to the application using valid credentials
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");

  // Step 2: From the left side navigation panel, click on the "Projects" menu
  await dashboardPage.clickNavigationMenu("Projects");
  await page.waitForLoadState("networkidle");

  // Step 3: Click on Add New Project button
  await projectsPage.clickNewProjectButton();
  await projectsPage.verifyModalIsVisible();

  // Step 4: Enter values in form with valid data
  const projectData = addNewProjectTestData.validProjectData;
  await projectsPage.fillFormWithTestData(projectData);

  // Step 5: Click on "Add Project" button
  await projectsPage.clickAddProjectButton();
  await page.waitForLoadState("networkidle");

  // Step 6: Verify newly added project appears in the list
  await projectsPage.verifyProjectInList(projectData.projectName);
});

test("Edit project and verify updated details in list", { tag: '@regression' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const projectsPage = new ProjectsPage(page);

  // Step 1: Login to the application using valid credentials
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");
  console.log("Step 1: Logged in successfully");

  // Step 2: From the left side navigation panel, click on the "Projects" menu
  await dashboardPage.clickNavigationMenu("Projects");
  await page.waitForLoadState("networkidle");
  console.log("Step 2: Navigated to Projects page");

  // Step 3: In the search input field, search for project with name: "Test Project Automation"
  const searchProjectName = addNewProjectTestData.editProjectData.originalProjectName;
  await projectsPage.searchProject(searchProjectName);
  console.log(`Step 3: Searched for project: ${searchProjectName}`);

  // Step 4: From the filtered search results, click on the Edit icon corresponding to that project
  await projectsPage.clickEditIconForProject(searchProjectName);
  console.log("Step 4: Clicked on Edit icon for the project");

  // Step 5: In the "Edit Project" popup window, update project details
  await projectsPage.verifyEditModalIsVisible();
  const editData = {
    projectName: addNewProjectTestData.editProjectData.editedProjectName,
    projectType: addNewProjectTestData.editProjectData.editedProjectType,
    startDate: addNewProjectTestData.editProjectData.editedStartDate
  };
  await projectsPage.fillEditFormWithData(editData);
  console.log("Step 5: Updated project details in Edit Project modal");

  // Step 6: Click on the "Update Project" button
  await projectsPage.clickUpdateProjectButton();
  console.log("Step 6: Clicked on Update Project button");

  // Step 7: After successful update, verify in the Projects list that:
  // - Project Name is updated to "Edited Test Project Automation"
  // - Project Type is updated to "Retainer"
  // - Start Date is updated to "05-01-2026"
  const expectedDetails = {
    projectName: addNewProjectTestData.editProjectData.editedProjectName,
    projectType: addNewProjectTestData.editProjectData.editedProjectType,
    startDate: addNewProjectTestData.editProjectData.editedStartDate
  };
  await projectsPage.verifyProjectDetailsInList(editData.projectName, expectedDetails);
  console.log("Step 7: Verified all updated project details in the list");
});

test("Verify delete confirmation popup appears when clicking delete icon", { tag: '@regression' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const projectsPage = new ProjectsPage(page);

  // Step 1: Login to the application using valid credentials
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");
  console.log("Step 1: Logged in successfully");

  // Step 2: From the left side navigation panel, click on the "Projects" menu
  await dashboardPage.clickNavigationMenu("Projects");
  await page.waitForLoadState("networkidle");
  console.log("Step 2: Navigated to Projects page");

  // Step 3: In the search input field, search for the project with name: "Edited Test Project Automation"
  const searchProjectName = addNewProjectTestData.deleteProjectData.projectName;
  await projectsPage.searchProject(searchProjectName);
  console.log(`Step 3: Searched for project: ${searchProjectName}`);

  // Step 4: From the filtered search results, click on the Delete icon corresponding to that project
  await projectsPage.clickDeleteIconForProject(searchProjectName);
  console.log("Step 4: Clicked on Delete icon for the project");

  // Step 5: Verify that a delete confirmation popup window appears
  await projectsPage.verifyDeleteModalIsVisible();
  console.log("Step 5: Verified delete confirmation popup window is displayed");

  // Step 6: In the delete confirmation popup:
  // - Verify that the message text is displayed
  await projectsPage.verifyDeleteMessageText(searchProjectName);
  console.log("Step 6a: Verified delete confirmation message text is displayed");

  // - Verify that both "Cancel" and "Delete" buttons are visible
  await projectsPage.verifyDeleteModalButtons();
  console.log("Step 6b: Verified both Cancel and Delete buttons are visible and enabled");

  // Step 7: Do NOT confirm deletion (only validate popup visibility and buttons)
  // Test completes here without clicking Delete button to avoid actual deletion
  console.log("Step 7: Test completed - popup validation successful, deletion not confirmed");
});

test("Delete project with cancel and confirm actions", { tag: '@regression' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const projectsPage = new ProjectsPage(page);

  // Step 1: Login to the application using valid credentials
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");
  console.log("Step 1: Logged in successfully");

  // Step 2: From the left side navigation panel, click on the "Projects" menu
  await dashboardPage.clickNavigationMenu("Projects");
  await page.waitForLoadState("networkidle");
  console.log("Step 2: Navigated to Projects page");

  // Step 3: In the search input field, search for the project with name: "Edited Test Project Automation"
  const projectName = addNewProjectTestData.deleteProjectData.projectName;
  await projectsPage.searchProject(projectName);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000); // Wait for search results to load
  console.log(`Step 3: Searched for project: ${projectName}`);

  // Step 4: From the filtered search results, click on the Delete icon corresponding to that project
  await projectsPage.clickDeleteIconForProject(projectName);
  console.log("Step 4: Clicked on Delete icon for the project");

  // Step 5: In the delete confirmation popup:
  // - Click on the "Cancel" button
  await projectsPage.verifyDeleteModalIsVisible();
  await projectsPage.cancelDelete();
  console.log("Step 5a: Clicked Cancel button in delete confirmation popup");

  // - Verify that the project "Edited Test Project Automation" is still present in the list
  // - Ensure the project is NOT deleted
  await projectsPage.verifyProjectPresent(projectName);
  console.log("Step 5b: Verified project is still present in the list after Cancel");

  // Step 6: Again click on the Delete icon corresponding to the same project
  await projectsPage.clickDeleteIconForProject(projectName);
  console.log("Step 6: Clicked on Delete icon again for the same project");

  // Step 7: In the delete confirmation popup:
  // - Click on the "Delete" button
  await projectsPage.verifyDeleteModalIsVisible();
  await projectsPage.confirmDelete();
  console.log("Step 7a: Clicked Delete button to confirm deletion");

  // - Wait for successful deletion (list refresh if applicable)
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000); // Additional wait for list to refresh after deletion
  console.log("Step 7b: Waited for list refresh after deletion");

  // Step 8: Verify that the project "Edited Test Project Automation" is no longer present in the list
  await projectsPage.verifyProjectNotPresent(projectName);
  console.log("Step 8: Verified project is no longer present in the list (successfully deleted)");
});
