const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pageobjects/LoginPage");
const { DashboardPage } = require("../pageobjects/DashboardPage");
const { ProjectsPage } = require("../pageobjects/ProjectsPage");
const { ContractorsPage } = require("../pageobjects/ContractorsPage");
const { EmployeesPage } = require("../pageobjects/EmployeesPage");
const { getCredentials } = require("../config/env.config");

// Get credentials from environment
const credentials = getCredentials();

test("Verify by default dashboard is displayed", { tag: '@smoke' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  // Navigate to application and login
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  
  // Wait for dashboard to load
  await page.waitForLoadState("networkidle");
  
  // Verify URL contains dashboard
  await expect(page).toHaveURL(new RegExp("/dashboard"));
  
  // Verify dashboard page title
  await dashboardPage.verifyPageTitle("Dashboard");
});

test("Verify all dashboard tiles are displayed with correct labels", { tag: '@smoke' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  // Navigate to application and login
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  
  // Wait for dashboard to load
  await page.waitForLoadState("networkidle");
  
  // Verify URL contains dashboard
  await expect(page).toHaveURL(new RegExp("/dashboard"));
  
  // Verify all dashboard tiles are visible with correct labels
  await dashboardPage.verifyAllDashboardTiles();
});

test("Verify Total Projects count in dashboard tile matches Projects list count", { tag: '@regression' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const projectsPage = new ProjectsPage(page);

  // Step 1: Login to the application
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveURL(new RegExp("/dashboard"));
  console.log("Step 1: Logged in successfully");

  // Step 2: Click on Project menu from side navigation panel
  await dashboardPage.clickNavigationMenu("Projects");
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveURL(new RegExp("/projects"));
  console.log("Step 2: Navigated to Projects page");

  // Step 3: Get the count of total projects displayed in project list
  const projectsListCount = await projectsPage.getTotalProjectsCountFromList();
  console.log(`Step 3: Total projects count from list: ${projectsListCount}`);

  // Step 4: Go back to the dashboard
  await dashboardPage.clickNavigationMenu("Dashboard");
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveURL(new RegExp("/dashboard"));
  console.log("Step 4: Navigated back to Dashboard");

  // Step 5: Verify the Total project count displayed in Tiles is same with total project count from Project list page
  const dashboardTileCount = await dashboardPage.getTotalProjectsCountFromTile();
  console.log(`Step 5: Total projects count from dashboard tile: ${dashboardTileCount}`);

  // Verify counts match
  expect(dashboardTileCount).toBe(projectsListCount);
  console.log(`✓ Verification passed: Dashboard tile count (${dashboardTileCount}) matches Projects list count (${projectsListCount})`);
});

test("Verify active contractors tile count matches Contractors list active count", { tag: '@regression' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const contractorsPage = new ContractorsPage(page);

  // Step 1: Login to the application
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveURL(new RegExp("/dashboard"));
  console.log("Step 1: Logged in and on Dashboard");

  // Step 2: Click on Contractors menu from side navigation panel
  await dashboardPage.clickNavigationMenu("Contractors");
  await contractorsPage.verifyOnContractorsPage();
  await expect(page).toHaveURL(new RegExp("/contractors"));
  console.log("Step 2: Navigated to Contractors page");

  // Step 3: Get the count of contractors whose status is Active
  const activeFromList = await contractorsPage.getTotalActiveContractorsCount();
  console.log(`Step 3: Active contractors count from list: ${activeFromList}`);

  // Step 4: Go back to the dashboard
  await dashboardPage.clickNavigationMenu("Dashboard");
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveURL(new RegExp("/dashboard"));
  console.log("Step 4: Navigated back to Dashboard");

  // Step 5: Verify the Number of active contractors in tiles matches list count
  const activeFromTile = await dashboardPage.getActiveContractorsCountFromTile();
  console.log(`Step 5: Active contractors count from dashboard tile: ${activeFromTile}`);

  expect(activeFromTile).toBe(activeFromList);
  console.log(`✓ Verification passed: tile (${activeFromTile}) == list (${activeFromList})`);
});

test("Verify active employees tile count matches Employees list active count", { tag: '@regression' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const employeesPage = new EmployeesPage(page);

  // Step 1: Login to the application
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveURL(new RegExp("/dashboard"));
  console.log("Employees Test - Step 1: Logged in and on Dashboard");

  // Step 2: Click on Employees menu from side navigation panel
  await dashboardPage.clickNavigationMenu("Employees");
  await employeesPage.verifyOnEmployeesPage();
  await expect(page).toHaveURL(new RegExp("/employees"));
  console.log("Employees Test - Step 2: Navigated to Employees page");

  // Step 3: Get the count of employees whose status is Active
  const activeFromList = await employeesPage.getTotalActiveEmployeesCount();
  console.log(`Employees Test - Step 3: Active employees count from list: ${activeFromList}`);

  // Step 4: Go back to the dashboard
  await dashboardPage.clickNavigationMenu("Dashboard");
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveURL(new RegExp("/dashboard"));
  console.log("Employees Test - Step 4: Navigated back to Dashboard");

  // Step 5: Verify the total Number of active employees in tile matches list count
  const activeFromTile = await dashboardPage.getActiveEmployeesCountFromTile();
  console.log(`Employees Test - Step 5: Active employees count from dashboard tile: ${activeFromTile}`);

  expect(activeFromTile).toBe(activeFromList);
  console.log(`Employees Test - ✓ Verification passed: tile (${activeFromTile}) == list (${activeFromList})`);
});

