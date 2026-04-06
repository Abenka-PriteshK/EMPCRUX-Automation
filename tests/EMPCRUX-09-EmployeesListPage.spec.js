const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pageobjects/LoginPage");
const { DashboardPage } = require("../pageobjects/DashboardPage");
const { EmployeesPage } = require("../pageobjects/EmployeesPage");
const { getCredentials } = require("../config/env.config");
const { addNewEmployeeTestData } = require("../test-data/AddNewEmployeeData");

// Get credentials from environment
const credentials = getCredentials();

test("Verify loading of Employees page when user click on Employees menu from side navigation panel", { tag: '@smoke' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const employeesPage = new EmployeesPage(page);

  // Step 1: Login to the application using valid credentials
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");

  // Step 2: From the left side navigation panel, click on the "Employees" menu
  await dashboardPage.clickNavigationMenu("Employees");
  await page.waitForLoadState("networkidle");

  // Step 3: Verify that the Employees page is loaded
  await employeesPage.verifyEmployeesPageLoaded();
});


test("Verify page title Employees is displayed", { tag: '@regression' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const employeesPage = new EmployeesPage(page);
  
    // Step 1: Login to the application using valid credentials
    await loginPage.goto();
    await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
    await page.waitForLoadState("networkidle");
  
    // Step 2: From the left side navigation panel, click on the "Employees" menu
    await dashboardPage.clickNavigationMenu("Employees");
    await page.waitForLoadState("networkidle");
  
    // Step 3: Verify page title Employees is displayed

    await expect(page.locator("//h1[normalize-space()='Employees']")).toBeVisible();
    await expect(page.locator("//h1[normalize-space()='Employees']")).toHaveText("Employees");
    console.log("Page title Employees is displayed");
  });

test("Verify Add Employee button is visible and enabled", { tag: '@regression' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const employeesPage = new EmployeesPage(page);
  
    // Step 1: Login to the application using valid credentials
    await loginPage.goto();
    await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
    await page.waitForLoadState("networkidle");
  
    // Step 2: From the left side navigation panel, click on the "Employees" menu
    await dashboardPage.clickNavigationMenu("Employees");
    await page.waitForLoadState("networkidle");
  
  // Step 3: Verify that the "+ Add Employee" button is visible and enabled
  await employeesPage.verifyAddEmployeeButton();
  console.log("Step 3: Verified Add Employee button is visible and enabled");
    
  });

test("Verify when user search employee by full name", { tag: '@regression' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const employeesPage = new EmployeesPage(page);

    // Test Data
    const employeeData = addNewEmployeeTestData.addEmployeeValidData;

    const fullEmployeeName = `${employeeData.firstName} ${employeeData.middleName} ${employeeData.lastName}`.trim();

    // Step 1: Login to the application using valid credentials
    await loginPage.goto();
    await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
    await page.waitForLoadState("networkidle");
    console.log("Step 1: Logged in successfully");

    // Step 2: Navigate to "Employees" from the left sidebar
    await dashboardPage.clickNavigationMenu("Employees");
    await page.waitForLoadState("networkidle");
    console.log("Step 2: Navigated to Employees page");

    // Step 3: Click on "+ Add Employee"
    await employeesPage.clickAddEmployeeButton();
    await page.waitForLoadState("networkidle");
    await employeesPage.verifyAddNewEmployeeFormPageLoaded();
    console.log("Step 3: Clicked on + Add Employee button and form loaded");

    // Step 4: Fill all fields as per test data
    await employeesPage.fillAllFieldsFromTestData(employeeData);

    console.log("Step 4: Filled all employee form fields with test data");

    // Step 5: Click on Add Employee button and verify navigation back to Employees list page
    await employeesPage.clickAddEmployeeButtonFromFormPage();
    await page.waitForLoadState("networkidle");
    await employeesPage.verifyOnEmployeesPage();
    console.log("Step 5: Submitted Add Employee form and verified navigation back to Employees list page");

    // Step 6: Search and verify the newly added employee appears in the list
    await employeesPage.searchEmployeeByName(fullEmployeeName);

    const matchingRows = employeesPage.employeeRows.filter({ hasText: fullEmployeeName });
    const rowCount = await matchingRows.count();
    let foundVisible = false;
    for (let i = 0; i < rowCount; i++) {
      const row = matchingRows.nth(i);
      const isVisible = await row.isVisible({ timeout: 2000 }).catch(() => false);
      if (isVisible) {
        foundVisible = true;
        break;
      }
    }
    if (!foundVisible) {
      throw new Error(`Employee "${fullEmployeeName}" was not found visible in the Employees list after creation.`);
    }

    console.log(`Step 6: Verified employee "${fullEmployeeName}" is displayed in the Employees list`);

  });


test("Verify when user search employee by partial name", { tag: '@regression' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const employeesPage = new EmployeesPage(page);

    // Test Data
    const employeeData = addNewEmployeeTestData.addEmployeeValidData;

    const fullEmployeeName = `${employeeData.firstName} ${employeeData.lastName}`.trim();
    const partialEmployeeName = `${employeeData.firstName.slice(0, 3)}`.trim();

    // Step 1: Login to the application using valid credentials
    await loginPage.goto();
    await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
    await page.waitForLoadState("networkidle");
    console.log("Step 1: Logged in successfully");

    // Step 2: Navigate to "Employees" from the left sidebar
    await dashboardPage.clickNavigationMenu("Employees");
    await page.waitForLoadState("networkidle");
    console.log("Step 2: Navigated to Employees page");

    // Step 3: Search and verify the newly added employee appears in the list by partial name
    await employeesPage.searchEmployeeByName(partialEmployeeName);

    const matchingRows = employeesPage.employeeRows.filter({ hasText: partialEmployeeName });
    const rowCount = await matchingRows.count();
    let foundVisible = false;
    for (let i = 0; i < rowCount; i++) {
      const row = matchingRows.nth(i);
      const isVisible = await row.isVisible({ timeout: 2000 }).catch(() => false);
      if (isVisible) {
        foundVisible = true;
        break;
      }
    }
    if (!foundVisible) {
      throw new Error(`Employee "${partialEmployeeName}" was not found visible in the Employees list after creation.`);
    }

    console.log(`Step 6: Verified employee "${partialEmployeeName}" is displayed in the Employees list`);

  });


test("Verify displaying of all table columns in employees list page", { tag: '@smoke' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const employeesPage = new EmployeesPage(page);
  
    // Step 1: Login to the application using valid credentials
    await loginPage.goto();
    await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
    await page.waitForLoadState("networkidle");
  
    // Step 2: Navigate to \"Employees\" from the left sidebar
    await dashboardPage.clickNavigationMenu("Employees");
    await page.waitForLoadState("networkidle");
  
    // Step 3: Verify Employees list page is loaded
    await employeesPage.verifyEmployeesPageLoaded();
  
    // Step 4: Verify displaying of all table columns in employees list page using test data
    const expectedHeaders = addNewEmployeeTestData.employeeListPage.columnHeaders;
    await employeesPage.verifyEmployeesListColumnHeaders(expectedHeaders);
    console.log(`Verified employees list table column headers: ${expectedHeaders.join(", ")}`);
  });



  

