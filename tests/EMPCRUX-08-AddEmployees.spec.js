const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pageobjects/LoginPage");
const { DashboardPage } = require("../pageobjects/DashboardPage");
const { EmployeesPage } = require("../pageobjects/EmployeesPage");
const { getCredentials } = require("../config/env.config");
const { addContractorTestData } = require("../test-data/AddContractorData");
const { addNewEmployeeTestData } = require("../test-data/AddNewEmployeeData");

// Get credentials from environment
const credentials = getCredentials();

test("Verify Add Employee button is visible and in enabled status", { tag: '@smoke' }, async ({ page }) => {
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

test("Verify Add New Employee form page loads successfully when user clicks on + Add Employee button", { tag: '@smoke' }, async ({ page }) => {
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
  
    // Step 3: Click on the "+ Add Employee" button
    await employeesPage.clickAddEmployeeButton();
    await page.waitForLoadState("networkidle");

    // Step 4: Verify that the Add New Employee form page loads successfully
    await employeesPage.verifyAddNewEmployeeFormPageLoaded();
    console.log("Step 4: Verified Add New Employee form page loaded successfully");
 
  });


  test("Verify Cancel and Add Employee buttons are visible and in enabled status", { tag: '@regression' }, async ({ page }) => {
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
  
    // Step 3: Click on the "+ Add Employee" button
    await employeesPage.clickAddEmployeeButton();
    await page.waitForLoadState("networkidle");

    // Step 4: Verify that the Cancel and Add Employee buttons are visible and in enabled status
    await employeesPage.verifyCancelAndAddEmployeeButtons();
    console.log("Step 4: Verified Cancel and Add Employee buttons are visible and in enabled status");
 
  });

  test("Verify Add Employee form fields and labels are visible", { tag: '@regression' }, async ({ page }) => {
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
  
    // Step 3: Click on the "+ Add Employee" button
    await employeesPage.clickAddEmployeeButton();
    await page.waitForLoadState("networkidle");

    // Step 4: Verify that the Add Employee form fields and labels are visible
    await employeesPage.verifyAddEmployeeFormFieldsAndLabels(addNewEmployeeTestData);
    console.log("Step 4: Verified Add Employee form fields and labels are visible");
 
  });

  test("Fill Add Employee form and verify Cancel button navigates back to Employees list page", { tag: '@regression' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const employeesPage = new EmployeesPage(page);
    const employeeData = addNewEmployeeTestData.fillFormAndCancelTest;

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
    console.log("Step 3: Clicked on + Add Employee button");

    // Step 4: Fill all fields as per test data
    await employeesPage.fillEmployeeForm(employeeData);
    console.log("Step 4: Filled all employee form fields with test data");

    // Step 5: Click on Cancel button
    await employeesPage.clickCancelAndVerifyNavigation();
    console.log("Step 5: Clicked Cancel button and verified navigation back to Employees list page without saving data");

    // Step 6: Search for the added employee name and verify it is NOT displayed in the list
    const fullEmployeeName = `${employeeData.firstName} ${employeeData.middleName} ${employeeData.lastName}`.trim();
    await employeesPage.verifyEmployeeNotPresentByName(fullEmployeeName);
    console.log(`Step 6: Verified employee "${fullEmployeeName}" is not displayed in Employees list after Cancel`);
  });

  test("Verify validation message when user submit form without filling mandatory fields", { tag: '@regression' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const employeesPage = new EmployeesPage(page);
    const employeeData = addNewEmployeeTestData.fillFormAndCancelTest;

    // Step 1: Login to the application using valid credentials
    await loginPage.goto();
    await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
    await page.waitForLoadState("networkidle");

    // Step 2: Navigate to "Employees" from the left sidebar
    await dashboardPage.clickNavigationMenu("Employees");
    await page.waitForLoadState("networkidle");

    // Step 3: Click on "+ Add Employee"
    await employeesPage.clickAddEmployeeButton();
    await page.waitForLoadState("networkidle");

    // Step 5: Click on Add Employee button
    await employeesPage.clickAddEmployeeButtonFromFormPage();
    await page.waitForLoadState("networkidle");

 // Step 6: Verify that validation error messages are displayed for mandatory fields
 const mandatoryFields = addNewEmployeeTestData.mandatoryFields;
 await employeesPage.verifyMandatoryFieldErrors(mandatoryFields);
 console.log("Step 6: Verified all mandatory field validation error messages are displayed");
  });

  test("Verify validation error when user fill all field except First Name", { tag: '@regression' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const employeesPage = new EmployeesPage(page);
  
    // Step 1: Login to the application using valid credentials
    await loginPage.goto();
    await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
    await page.waitForLoadState("networkidle");
  
    // Step 2: Navigate to "Employees" from the left sidebar
    await dashboardPage.clickNavigationMenu("Employees");
    await page.waitForLoadState("networkidle");
  
    // Step 3: Click on "+ Add Employee"
    await employeesPage.clickAddEmployeeButton();
    await page.waitForLoadState("networkidle");
  
    // Step 4: Fill all fields except First Name using test data
    const formData = addNewEmployeeTestData.FirstNameValidationTest;
    await employeesPage.fillAllFieldsExceptFirstName(formData);
  
    // Step 5: Click on "Add Employee" button
    await employeesPage.clickAddEmployeeButtonFromFormPage();
    await page.waitForTimeout(1000); // Wait for validation to trigger
  
    // Step 6: Verify validation error for First Name field
    const expectedErrorMessage = formData.expectedErrorMessage;
    await employeesPage.verifyFirstNameError(expectedErrorMessage);
    console.log(`Step 6: Verified validation error when user fill all field except First Name: "${expectedErrorMessage}"`);
  });

  test("Verify validation error when user fill all field except Department", { tag: '@regression' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const employeesPage = new EmployeesPage(page);
  
    // Step 1: Login to the application using valid credentials
    await loginPage.goto();
    await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
    await page.waitForLoadState("networkidle");
  
    // Step 2: Navigate to "Employees" from the left sidebar
    await dashboardPage.clickNavigationMenu("Employees");
    await page.waitForLoadState("networkidle");
  
    // Step 3: Click on "+ Add Employee"
    await employeesPage.clickAddEmployeeButton();
    await page.waitForLoadState("networkidle");
  
    // Step 4: Fill all fields except First Name using test data
    const formData = addNewEmployeeTestData.DepartmentValidationTest;
    await employeesPage.fillAllFieldsExceptDepartment(formData);
  
    // Step 5: Click on "Add Employee" button
    await employeesPage.clickAddEmployeeButtonFromFormPage();
    await page.waitForTimeout(1000); // Wait for validation to trigger
  
    // Step 6: Verify validation error for First Name field
    const expectedErrorMessage = formData.expectedErrorMessage;
    await employeesPage.verifyDepartmentError(expectedErrorMessage);
    console.log(`Step 6: Verified validation error when user fill all field except Department: "${expectedErrorMessage}"`);
  });

  test("Verify validation error when user fill all field except Designation", { tag: '@regression' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const employeesPage = new EmployeesPage(page);
  
    // Step 1: Login to the application using valid credentials
    await loginPage.goto();
    await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
    await page.waitForLoadState("networkidle");
  
    // Step 2: Navigate to "Employees" from the left sidebar
    await dashboardPage.clickNavigationMenu("Employees");
    await page.waitForLoadState("networkidle");
  
    // Step 3: Click on "+ Add Employee"
    await employeesPage.clickAddEmployeeButton();
    await page.waitForLoadState("networkidle");
  
    // Step 4: Fill all fields except Designation using test data
    const formData = addNewEmployeeTestData.DesignationValidationTest;
    await employeesPage.fillAllFieldsExceptDesignation(formData);
  
    // Step 5: Click on "Add Employee" button
    await employeesPage.clickAddEmployeeButtonFromFormPage();
    await page.waitForTimeout(1000); // Wait for validation to trigger
  
    // Step 6: Verify validation error for First Name field
    const expectedErrorMessage = formData.expectedErrorMessage;
    await employeesPage.verifyDesignationError(expectedErrorMessage);
    console.log(`Step 6: Verified validation error when user fill all field except Designation: "${expectedErrorMessage}"`);
  });

  test("Verify validation error when user fill all field except Date of Joining", { tag: '@regression' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const employeesPage = new EmployeesPage(page);
  
    // Step 1: Login to the application using valid credentials
    await loginPage.goto();
    await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
    await page.waitForLoadState("networkidle");
  
    // Step 2: Navigate to "Employees" from the left sidebar
    await dashboardPage.clickNavigationMenu("Employees");
    await page.waitForLoadState("networkidle");
  
    // Step 3: Click on "+ Add Employee"
    await employeesPage.clickAddEmployeeButton();
    await page.waitForLoadState("networkidle");
  
    // Step 4: Fill all fields except Date of Joining using test data
    const formData = addNewEmployeeTestData.DateOfJoiningValidationTest;
    await employeesPage.fillAllFieldsExceptDateOfJoining(formData);
  
    // Step 5: Click on "Add Employee" button
    await employeesPage.clickAddEmployeeButtonFromFormPage();
    await page.waitForTimeout(1000); // Wait for validation to trigger
  
    // Step 6: Verify validation error for Date of Joining field
    const expectedErrorMessage = formData.expectedErrorMessage;
    await employeesPage.verifyDateOfJoiningError(expectedErrorMessage);
    console.log(`Step 6: Verified validation error when user fill all field except Date of Joining: "${expectedErrorMessage}"`);
  });

  test("Verify validation error when user fill all field except Contractor", { tag: '@regression' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const employeesPage = new EmployeesPage(page);
  
    // Step 1: Login to the application using valid credentials
    await loginPage.goto();
    await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
    await page.waitForLoadState("networkidle");
  
    // Step 2: Navigate to "Employees" from the left sidebar
    await dashboardPage.clickNavigationMenu("Employees");
    await page.waitForLoadState("networkidle");
  
    // Step 3: Click on "+ Add Employee"
    await employeesPage.clickAddEmployeeButton();
    await page.waitForLoadState("networkidle");
  
    // Step 4: Fill all fields except Contractor using test data
    const formData = addNewEmployeeTestData.ContractorValidationTest;
    await employeesPage.fillAllFieldsExceptContractor(formData);
  
    // Step 5: Click on "Add Employee" button
    await employeesPage.clickAddEmployeeButtonFromFormPage();
    await page.waitForTimeout(1000); // Wait for validation to trigger
  
    // Step 6: Verify validation error for Contractor field
    const expectedErrorMessage = formData.expectedErrorMessage;
    await employeesPage.verifyContractorError(expectedErrorMessage);
    console.log(`Step 6: Verified validation error when user fill all field except Contractor: "${expectedErrorMessage}"`);
  });

  test("Verify Gender dropdown options and selection functionality", { tag: '@regression' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const employeesPage = new EmployeesPage(page);
    const genderOptions = addNewEmployeeTestData.genderOptions;

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

    // Step 4: Click on the Gender dropdown and verify the following options are visible:
    // - Male
    // - Female
    // - Other
    // - Prefer not to say
    await employeesPage.verifyGenderDropdownOptions(genderOptions);
    console.log("Step 4: Verified all Gender dropdown options are visible");

    // Step 5: Select each option one by one and verify that the selected value is displayed correctly in the Gender field
    // First, close the dropdown that was opened during verification
    await employeesPage.closeGenderDropdown();
    await page.waitForTimeout(300);
    
    for (const option of genderOptions) {
        // Verify we're still on the Add Employee form page before each selection
        await employeesPage.verifyAddNewEmployeeFormPageLoaded();
        
        // Select and verify the option (this will automatically close the dropdown after selection)
        // No need to close dropdown before selection - it should already be closed from previous selection
        await employeesPage.selectGenderAndVerify(option);
        console.log(`Step 5: Selected and verified Gender option: "${option}"`);
        
        // Wait a bit after each selection to ensure form stabilizes and dropdown closes
        await page.waitForTimeout(500);
        
        // Verify form is still open after selection (this will throw if form closed)
        await employeesPage.verifyAddNewEmployeeFormPageLoaded();
    }
    
    console.log("Test completed successfully - All Gender options verified and selected correctly");
  });

  test("Verify Marital Status dropdown options and selection functionality", { tag: '@regression' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const employeesPage = new EmployeesPage(page);
    const maritalOptions = addNewEmployeeTestData.maritalStatusOptions;

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
    console.log("Step 3: Clicked on + Add Employee button");

    // Step 4: Verify Marital Status options
    await employeesPage.verifyMaritalStatusDropdownOptions(maritalOptions);
    console.log("Step 4: Verified all Marital Status dropdown options are visible");

    // Ensure dropdown is closed before selections loop
    await employeesPage.closeMaritalStatusDropdown();
    await page.waitForTimeout(300);

    // Step 5: Select each option one by one and verify the selected value
    for (const option of maritalOptions) {
        // Verify we're still on the Add Employee form page before each selection
        await employeesPage.verifyAddNewEmployeeFormPageLoaded();

        await employeesPage.selectMaritalStatusAndVerify(option);
        console.log(`Step 5: Selected and verified Marital Status option: "${option}"`);

        // Wait a bit after each selection to ensure stability
        await page.waitForTimeout(400);

        // Verify form is still open after each selection
        await employeesPage.verifyAddNewEmployeeFormPageLoaded();
    }

    console.log("Test completed successfully - All Marital Status options verified and selected correctly");
  });

  test("Verify when user enter less than 12 digits in Aadhaar", { tag: '@regression' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const employeesPage = new EmployeesPage(page);
    const aadharOptions = addNewEmployeeTestData.AadharValidationTest;

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
    console.log("Step 3: Clicked on + Add Employee button");

    // Step 4: Enter aadhaar number less than 12 digits
    const formData = addNewEmployeeTestData.AadharValidationTest;
    await employeesPage.fillAllFieldsWithLessThan12DigitsInAadhaar(formData);
  
    // Step 5: Verify validation error for Aadhar Card Number field
    const expectedErrorMessage = formData.expectedErrorMessage;
    await employeesPage.verifyAadharValidationError(expectedErrorMessage);
    console.log(`Step 5: Verified validation error when user enter less than 12 digits in Aadhaar: "${expectedErrorMessage}"`);

  });

  test("Add Employee with valid data and verify it appears in Employees list", { tag: '@regression' }, async ({ page }) => {
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

    // Step 7: For the selected employee, click on the "Delete" button and verify the employee is deleted successfully
    await employeesPage.clickDeleteIconForEmployee(fullEmployeeName);
    await employeesPage.verifyEmployeeDeletedSuccessfully(fullEmployeeName);
    console.log(`Step 7: Verified employee "${fullEmployeeName}" is deleted successfully`);
  });






  

  




