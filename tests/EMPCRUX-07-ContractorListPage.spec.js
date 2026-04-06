const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pageobjects/LoginPage");
const { DashboardPage } = require("../pageobjects/DashboardPage");
const { ContractorsPage } = require("../pageobjects/ContractorsPage");
const { getCredentials } = require("../config/env.config");
const { addContractorTestData } = require("../test-data/AddContractorData");

// Get credentials from environment
const credentials = getCredentials();

test("Verify loading of Contractors page when user click on Contarctors menu from side navigation panel", { tag: '@smoke' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const contractorsPage = new ContractorsPage(page);

  // Step 1: Login to the application using valid credentials
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");

  // Step 2: From the left side navigation panel, click on the "Contractors" menu
  await dashboardPage.clickNavigationMenu("Contractors");
  await page.waitForLoadState("networkidle");

  // Step 3: Verify that the Contractors page is loaded
  await contractorsPage.verifyContractorsPageLoaded();
});

test("Verify displaying of all table columns in contractors list page", { tag: '@smoke' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const contractorsPage = new ContractorsPage(page);

  // Step 1: Login to the application using valid credentials
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");

  // Step 2: Navigate to \"Contractors\" from the left sidebar
  await dashboardPage.clickNavigationMenu("Contractors");
  await page.waitForLoadState("networkidle");

  // Step 3: Verify Contractors list page is loaded
  await contractorsPage.verifyContractorsPageLoaded();

  // Step 4: Verify displaying of all table columns in contractors list page using test data
  const expectedHeaders = addContractorTestData.contractorListPage.columnHeaders;
  await contractorsPage.verifyContractorListColumnHeaders(expectedHeaders);
  console.log(`Verified contractors list table column headers: ${expectedHeaders.join(", ")}`);
});

test("Verify contractor records are displayed in contractors list page", { tag: '@smoke' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const contractorsPage = new ContractorsPage(page);

  // Step 1: Login to the application using valid credentials
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");

  // Step 2: Navigate to \"Contractors\" from the left sidebar
  await dashboardPage.clickNavigationMenu("Contractors");
  await page.waitForLoadState("networkidle");

  // Step 3: Verify Contractors list page is loaded
  await contractorsPage.verifyContractorsPageLoaded();

  // Step 4: Verify contractor records are displayed
  await contractorsPage.verifyContractorRecordsDisplayed();
});

test("Verify contractor search by name displays specific contractor in list", { tag: '@smoke' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const contractorsPage = new ContractorsPage(page);

  // Step 1: Login to the application using valid credentials
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");

  // Step 2: Navigate to "Contractors" from the left sidebar
  await dashboardPage.clickNavigationMenu("Contractors");
  await page.waitForLoadState("networkidle");

  // Step 3: Verify Contractors list page is loaded
  await contractorsPage.verifyContractorsPageLoaded();

  // Step 4: In Search input box enter contractor name and verify listing in page list
  const contractorName = addContractorTestData.addNewContractorWithAllFields.contractorName || "SAI PUMPS SOLUTIONS";
  await contractorsPage.searchContractorByName(contractorName);
  await contractorsPage.verifyContractorInList(contractorName);
});

test("Verify contractor search by GST Number displays correct contractor details in list", { tag: '@regression' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const contractorsPage = new ContractorsPage(page);

  // Step 1: Login to the application using valid credentials
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");

  // Step 2: Navigate to "Contractors" from the left sidebar
  await dashboardPage.clickNavigationMenu("Contractors");
  await page.waitForLoadState("networkidle");

  // Step 3: Verify Contractors list page is loaded
  await contractorsPage.verifyContractorsPageLoaded();

  // Step 4: In Search input box enter GST Number and verify listing in page list (values from test data)
  const gstNumber = addContractorTestData.addNewContractorWithAllFields.gstNumber;
  const contractorName = addContractorTestData.addNewContractorWithAllFields.contractorName;

  await contractorsPage.searchContractor(gstNumber);
  await contractorsPage.verifyContractorDetailsBySearchTerm(gstNumber, contractorName);
});

test("Verify Status filter dropdown default value, options, and filtering in contractors list page", { tag: '@regression' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const contractorsPage = new ContractorsPage(page);

  // Step 1: Login to the application using valid credentials
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");

  // Step 2: Navigate to "Contractors" from the left sidebar
  await dashboardPage.clickNavigationMenu("Contractors");
  await page.waitForLoadState("networkidle");

  // Step 3: Verify Contractors list page is loaded
  await contractorsPage.verifyContractorsPageLoaded();

  // Status filter test data
  const statusFilterData = addContractorTestData.contractorListPage.statusFilter;
  const expectedDefault = statusFilterData.defaultValue;
  const expectedOptions = statusFilterData.options;

  // Step 4: Verify default selected value in Status filter dropdown
  await contractorsPage.verifyStatusFilterDefault(expectedDefault);

  // Step 5: Verify all Status filter dropdown options
  await contractorsPage.verifyStatusFilterOptions(expectedOptions);

  // Step 6: Select each status option one by one and verify filtering behaviour
  for (const statusValue of expectedOptions) {
    console.log(`--- Verifying Status filter option: "${statusValue}" ---`);
    await contractorsPage.selectStatusFilter(statusValue);
    await contractorsPage.verifyStatusFilterResults(statusValue);
  }
});

test("Verify Agreement valid from filter displays contractor SAI PUMPS SOLUTIONS", { tag: '@regression' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const contractorsPage = new ContractorsPage(page);

  // Step 1: Login to the application using valid credentials
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");

  // Step 2: Navigate to "Contractors" from the left sidebar
  await dashboardPage.clickNavigationMenu("Contractors");
  await page.waitForLoadState("networkidle");

  // Step 3: Verify Contractors list page is loaded
  await contractorsPage.verifyContractorsPageLoaded();

  // Step 4: Set Agreement valid from filter date using test data and verify contractor is displayed
  const filterDate = addContractorTestData.contractorListPage.agreementValidFromFilter.filterDate;
  const expectedContractorName = addContractorTestData.addNewContractorWithAllFields.contractorName;

  await contractorsPage.setAgreementValidFromFilter(filterDate);
  await contractorsPage.verifyContractorInList(expectedContractorName);
});

test("Verify Agreement valid to filter displays contractor SAI PUMPS SOLUTIONS", { tag: '@regression' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const contractorsPage = new ContractorsPage(page);

  // Step 1: Login to the application using valid credentials
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");

  // Step 2: Navigate to "Contractors" from the left sidebar
  await dashboardPage.clickNavigationMenu("Contractors");
  await page.waitForLoadState("networkidle");

  // Step 3: Verify Contractors list page is loaded
  await contractorsPage.verifyContractorsPageLoaded();

  // Step 4: Set Agreement valid to filter date using test data and verify contractor is displayed
  const filterDate = addContractorTestData.contractorListPage.agreementValidToFilter.filterDate;
  const expectedContractorName = addContractorTestData.addNewContractorWithAllFields.contractorName;

  await contractorsPage.setAgreementValidToFilter(filterDate);
  await contractorsPage.verifyContractorInList(expectedContractorName);
});

test("Verify contractor details page displays correct Basic Information after clicking view icon", { tag: '@regression' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const contractorsPage = new ContractorsPage(page);

  // Step 1: Login to the application using valid credentials
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");

  // Step 2: Navigate to "Contractors" from the left sidebar
  await dashboardPage.clickNavigationMenu("Contractors");
  await page.waitForLoadState("networkidle");

  // Step 3: Verify Contractors list page is loaded
  await contractorsPage.verifyContractorsPageLoaded();

  // Step 4: Search for contractor by name
  const contractorName = addContractorTestData.addNewContractorWithAllFields.contractorName;
  await contractorsPage.searchContractorByName(contractorName);
  await contractorsPage.verifyContractorInList(contractorName);

  // Step 5: Click on the view icon for the contractor
  await contractorsPage.clickViewIconForContractor(contractorName);

  // Step 6: Verify Contractor Details page is loaded and Basic Information matches test data
  const testData = addContractorTestData.addNewContractorWithAllFields;
  await contractorsPage.verifyBasicInformation(testData);
});

test("Verify updating contractor details and verifying updated contractor in list", { tag: '@regression' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const contractorsPage = new ContractorsPage(page);

  // Step 1: Login to the application using valid credentials
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");

  // Step 2: Navigate to "Contractors" from the left sidebar
  await dashboardPage.clickNavigationMenu("Contractors");
  await page.waitForLoadState("networkidle");

  // Step 3: Verify Contractors list page is loaded
  await contractorsPage.verifyContractorsPageLoaded();

  // Step 4: Search for contractor by old name
  const oldContractorName = addContractorTestData.updateContractorData.oldContractorName;
  await contractorsPage.searchContractorByName(oldContractorName);
  await contractorsPage.verifyContractorInList(oldContractorName);

  // Step 5: Click on the Edit icon for the searched contractor
  await contractorsPage.clickEditIconForContractor(oldContractorName);

  // Step 6: Update contractor fields
  const updateData = {
    contractorName: addContractorTestData.updateContractorData.newContractorName,
    gstNumber: addContractorTestData.updateContractorData.newGSTNumber,
    panNumber: addContractorTestData.updateContractorData.newPANNumber,
    notes: addContractorTestData.updateContractorData.notes
  };
  await contractorsPage.updateContractorFields(updateData);

  // Step 7: Click on the "Update Contractor" button
  await contractorsPage.clickUpdateContractorButton();

  // Step 8: Wait for page to reload and verify Contractors list page is loaded
  const newContractorName = addContractorTestData.updateContractorData.newContractorName;
  await contractorsPage.verifyContractorsPageLoaded();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000); // Wait for list to refresh after update

  // Step 9: Clear search input explicitly and search with new contractor name
  // The search input might still contain the old search text, so clear it first
  const searchInput = page.locator("//input[contains(@placeholder, 'Search') or contains(@placeholder, 'contractor') or @type='search']").first();
  await searchInput.click();
  await searchInput.fill(""); // Clear existing text
  await page.waitForTimeout(500);
  await page.waitForLoadState("networkidle");
  
  // Now search for the new contractor name
  await contractorsPage.searchContractorByName(newContractorName);
  
  // Step 10: Verify updated contractor name appears in contractor list page
  await contractorsPage.verifyContractorInList(newContractorName);
  console.log(`Successfully verified updated contractor "${newContractorName}" appears in the list`);
});




