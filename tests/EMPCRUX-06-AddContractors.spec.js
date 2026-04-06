const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pageobjects/LoginPage");
const { DashboardPage } = require("../pageobjects/DashboardPage");
const { ContractorsPage } = require("../pageobjects/ContractorsPage");
const { getCredentials } = require("../config/env.config");
const { addContractorTestData } = require("../test-data/AddContractorData");

// Get credentials from environment
const credentials = getCredentials();

test("Verify Add Contractor button is visible and in enabled status", { tag: '@smoke' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const contractorsPage = new ContractorsPage(page);

  // Step 1: Login to the application using valid credentials
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");
  console.log("Step 1: Logged in successfully");

  // Step 2: From the left side navigation panel, click on the "Contractors" menu
  await dashboardPage.clickNavigationMenu("Contractors");
  await page.waitForLoadState("networkidle");
  console.log("Step 2: Navigated to Contractors page");

  // Step 3: Verify that the "+ Add Contractor" button is visible and enabled
  await contractorsPage.verifyAddContractorButton();
  console.log("Step 3: Verified Add Contractor button is visible and enabled");
});

test("Verify Add Contractor modal options are displayed", { tag: '@smoke' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const contractorsPage = new ContractorsPage(page);

  // Step 1: Login to the application using valid credentials
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");
  console.log("Step 1: Logged in successfully");

  // Step 2: From the left side navigation panel, click on the "Contractors" menu
  await dashboardPage.clickNavigationMenu("Contractors");
  await page.waitForLoadState("networkidle");
  console.log("Step 2: Navigated to Contractors page");

  // Step 3: Click on the "+ Add Contractor" button
  await contractorsPage.clickAddContractorButton();
  console.log("Step 3: Clicked on Add Contractor button");

  // Step 4: Verify that the following options are displayed:
  // - "Add Contractor"
  // - "Send Link"
  await contractorsPage.verifyAddContractorModalIsVisible();
  await contractorsPage.verifyAddContractorModalOptions();
  console.log("Step 4: Verified both options (Add Contractor and Send Link) are displayed in the modal");
});

test("Verify all form labels and buttons in Add Contractor form", { tag: '@regression' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const contractorsPage = new ContractorsPage(page);

  // Step 1: Login to the application using valid credentials
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");
  console.log("Step 1: Logged in successfully");

  // Step 2: From the left side navigation panel, click on the "Contractors" menu
  await dashboardPage.clickNavigationMenu("Contractors");
  await page.waitForLoadState("networkidle");
  console.log("Step 2: Navigated to Contractors page");

  // Step 3: Click on the "+ Add Contractor" button
  await contractorsPage.clickAddContractorButton();
  console.log("Step 3: Clicked on Add Contractor button");

  // Step 4: Click on the "Add Contractors" tab/button
  await contractorsPage.verifyAddContractorModalIsVisible();
  await contractorsPage.clickAddContractorsOption();
  console.log("Step 4: Clicked on Add Contractors option");

  // Step 5: Verify that all the following labels are visible on the page
  await contractorsPage.verifyAllFormLabels();
  console.log("Step 5: Verified all form labels are visible");

  // Step 6: Verify buttons are visible and enabled
  await contractorsPage.verifyFormButtons();
  console.log("Step 6: Verified Cancel and Add Contractor buttons are visible and enabled");
});

test("Verify mandatory field validation errors in Add Contractor form", { tag: '@regression' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const contractorsPage = new ContractorsPage(page);

  // Step 1: Login to the application using valid credentials
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");
  console.log("Step 1: Logged in successfully");

  // Step 2: From the left side navigation panel, click on the "Contractors" menu
  await dashboardPage.clickNavigationMenu("Contractors");
  await page.waitForLoadState("networkidle");
  console.log("Step 2: Navigated to Contractors page");

  // Step 3: Click on the "+ Add Contractor" button
  await contractorsPage.clickAddContractorButton();
  console.log("Step 3: Clicked on Add Contractor button");

  // Step 4: Click on the "Add Contractors" tab/button
  await contractorsPage.verifyAddContractorModalIsVisible();
  await contractorsPage.clickAddContractorsOption();
  console.log("Step 4: Clicked on Add Contractors option");

  // Step 5: Without filling any form fields, click on the "Add Contractor" button
  await contractorsPage.clickAddContractorSubmitButton();
  console.log("Step 5: Clicked on Add Contractor button without filling any fields");

  // Step 6: Verify that validation error messages are displayed for mandatory fields
  const mandatoryFields = addContractorTestData.mandatoryFields;
  await contractorsPage.verifyMandatoryFieldErrors(mandatoryFields);
  console.log("Step 6: Verified all mandatory field validation error messages are displayed");
});

test("Verify Contractor Agreement file upload functionality", { tag: '@regression' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const contractorsPage = new ContractorsPage(page);

  // Step 1: Login to the application using valid credentials
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");
  console.log("Step 1: Logged in successfully");

  // Step 2: From the left side navigation panel, click on the "Contractors" menu
  await dashboardPage.clickNavigationMenu("Contractors");
  await page.waitForLoadState("networkidle");
  console.log("Step 2: Navigated to Contractors page");

  // Step 3: Click on the "+ Add Contractor" button
  await contractorsPage.clickAddContractorButton();
  console.log("Step 3: Clicked on Add Contractor button");

  // Step 4: Click on the "Add Contractors" tab/button
  await contractorsPage.verifyAddContractorModalIsVisible();
  await contractorsPage.clickAddContractorsOption();
  await page.waitForTimeout(2000); // Wait for form to fully load
  console.log("Step 4: Clicked on Add Contractors option");

  // Step 5: Click on "Upload Contractor Agreement" button
  // Step 6: Enter the file path and select the file
  // Step 7: Click on Open button (handled automatically by file chooser API)
  // The file chooser API intercepts the native file dialog, selects the file, and closes the dialog
  const filePath = addContractorTestData.fileUpload.contractorAgreementFilePath;
  await contractorsPage.uploadContractorAgreementFile(filePath);
  console.log(`Step 5-7: Clicked upload button, selected file "${filePath}", clicked Open, and verified file dialog closed`);

  // Step 8: Verify that the file is successfully uploaded
  const expectedFileName = addContractorTestData.fileUpload.expectedFileName;
  await contractorsPage.verifyFileUploaded(expectedFileName);
  console.log("Step 8: Verified file is successfully uploaded");

  // Step 9: After upload, verify:
  // - File name "Contract Basic Details.docx" is displayed
  // - "Change File" button is visible
  // - "Remove" option is visible
  await contractorsPage.verifyUploadedFileDetails(expectedFileName);
  console.log("Step 9: Verified all uploaded file details (file name, Change File button, Remove option)");
});

test("Verify Contractor Name validation error when all fields except Contractor Name are filled", { tag: '@regression' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const contractorsPage = new ContractorsPage(page);

  // Step 1: Login to the application using valid credentials
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");
  console.log("Step 1: Logged in successfully");

  // Step 2: Navigate to "Contractors" from the left sidebar
  await dashboardPage.clickNavigationMenu("Contractors");
  await page.waitForLoadState("networkidle");
  console.log("Step 2: Navigated to Contractors page");

  // Step 3: Click on "+ Add Contractor"
  await contractorsPage.clickAddContractorButton();
  console.log("Step 3: Clicked on Add Contractor button");

  // Step 4: Click on "Add Contractors" tab/button
  await contractorsPage.verifyAddContractorModalIsVisible();
  await contractorsPage.clickAddContractorsOption();
  await page.waitForTimeout(2000); // Wait for form to fully load
  console.log("Step 4: Clicked on Add Contractors option");

  // Step 5: Fill all fields using test data EXCEPT Contractor Name (leave it empty intentionally)
  const formData = addContractorTestData.contractorNameValidationTest;
  await contractorsPage.fillAllFieldsExceptContractorName(formData);
  console.log("Step 5: Filled all form fields except Contractor Name (intentionally left blank)");

  // Step 6: Click on "Add Contractor" button
  await contractorsPage.clickAddContractorSubmitButton();
  console.log("Step 6: Clicked on Add Contractor button");

  // Step 7: Verify validation error message is displayed for Contractor Name
  const expectedErrorMessage = formData.expectedErrorMessage;
  await contractorsPage.verifyContractorNameError(expectedErrorMessage);
  console.log(`Step 7: Verified Contractor Name validation error message: "${expectedErrorMessage}"`);
});


test("Verify validation error when user enter Valid To date earlier than Valid From", { tag: '@regression' }, async ({ page }) => {
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

  // Step 3: Click on "+ Add Contractor"
  await contractorsPage.clickAddContractorButton();

  // Step 4: Click on "Add Contractors" tab/button
  await contractorsPage.verifyAddContractorModalIsVisible();
  await contractorsPage.clickAddContractorsOption();
  await page.waitForTimeout(2000); // Wait for form to fully load

  // Step 5: Fill Contractor Name and all other fields using test data
  const formData = addContractorTestData.DateValidationValidationTest;
  await contractorsPage.fillContractorName(formData.contractorName);
  await contractorsPage.fillAllFieldsExceptContractorName(formData);

  // Step 6: Click on "Add Contractor" button
  await contractorsPage.clickAddContractorSubmitButton();

  // Step 7: Verify validation error when user enter Valid To date earlier than Valid From
  const expectedErrorMessage = formData.expectedErrorMessage;
  await contractorsPage.verifyDateValidationError(expectedErrorMessage);
  console.log(`Step 7: Verified validation error when user enter Valid To date earlier than Valid From: "${expectedErrorMessage}"`);
});

test("Verify validation error when user fill all field except GST number", { tag: '@regression' }, async ({ page }) => {
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

  // Step 3: Click on "+ Add Contractor"
  await contractorsPage.clickAddContractorButton();

  // Step 4: Click on "Add Contractors" tab/button
  await contractorsPage.verifyAddContractorModalIsVisible();
  await contractorsPage.clickAddContractorsOption();
  await page.waitForTimeout(2000); // Wait for form to fully load

  // Step 5: Fill Contractor Name and all other fields using test data
  const formData = addContractorTestData.GSTNumberValidationTest;
  await contractorsPage.fillContractorName(formData.contractorName);
  await contractorsPage.fillAllFieldsExceptContractorName(formData);

  // Step 6: Click on "Add Contractor" button
  await contractorsPage.clickAddContractorSubmitButton();

  // Step 7: Verify validation error when user enter Valid To date earlier than Valid From
  const expectedErrorMessage = formData.expectedErrorMessage;
  await contractorsPage.verifyGSTValidationError(expectedErrorMessage);
  console.log(`Step 7: Verified validation error when user fill all field except GST number "${expectedErrorMessage}"`);
});


test("Verify validation error when user enter GST number less than 15 characters", { tag: '@regression' }, async ({ page }) => {
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

  // Step 3: Click on "+ Add Contractor"
  await contractorsPage.clickAddContractorButton();

  // Step 4: Click on "Add Contractors" tab/button
  await contractorsPage.verifyAddContractorModalIsVisible();
  await contractorsPage.clickAddContractorsOption();
  await page.waitForTimeout(2000); // Wait for form to fully load

  // Step 5: Fill Contractor Name and all other fields using test data
  const formData = addContractorTestData.GSTNumberValidationLessThan15DigitsTest;
  await contractorsPage.fillContractorName(formData.contractorName);
  await contractorsPage.fillAllFieldsExceptContractorName(formData);

  // Step 6: Click on "Add Contractor" button
  await contractorsPage.clickAddContractorSubmitButton();

  // Step 7: Verify validation error when user enter Valid To date earlier than Valid From
  const expectedErrorMessage = formData.expectedErrorMessage;
  await contractorsPage.verifyGSTValidationErrorLessThan15Digits(expectedErrorMessage);
  console.log(`Step 7: Verified validation error when user enter GST number less than 15 characters "${expectedErrorMessage}"`);
});

test("Verify validation error when user try submitting without uploading agreement", { tag: '@regression' }, async ({ page }) => {
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

  // Step 3: Click on "+ Add Contractor"
  await contractorsPage.clickAddContractorButton();

  // Step 4: Click on "Add Contractors" tab/button
  await contractorsPage.verifyAddContractorModalIsVisible();
  await contractorsPage.clickAddContractorsOption();
  await page.waitForTimeout(2000); // Wait for form to fully load

  // Step 5: Fill Contractor Name and all other fields using test data
  const formData = addContractorTestData.AgreementValidationTest;
  await contractorsPage.fillContractorName(formData.contractorName);
  await contractorsPage.fillAgreementValidFrom(formData.agreementValidFrom);
  await contractorsPage.fillAgreementValidTo(formData.agreementValidTo);
  await contractorsPage.fillGSTNumber(formData.gstNumber);
  await contractorsPage.fillPANNumber(formData.panNumber);
  await contractorsPage.selectStatus(formData.status);

  // Step 6: Click on "Add Contractor" button
  await contractorsPage.clickAddContractorSubmitButton();

  // Step 7: Verify validation error when user enter Valid To date earlier than Valid From
  const expectedErrorMessage = formData.expectedErrorMessage;
  await contractorsPage.verifyAgreementValidationError(expectedErrorMessage);
  console.log(`Step 7: Verified validation error when user try submitting without uploading agreement "${expectedErrorMessage}"`);
});

test("Verify validation error when user enter invalid PAN number format", { tag: '@regression' }, async ({ page }) => {
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

  // Step 3: Click on "+ Add Contractor"
  await contractorsPage.clickAddContractorButton();

  // Step 4: Click on "Add Contractors" tab/button
  await contractorsPage.verifyAddContractorModalIsVisible();
  await contractorsPage.clickAddContractorsOption();
  await page.waitForTimeout(2000); // Wait for form to fully load

  // Step 5: Fill Contractor Name and all other fields using test data
  const formData = addContractorTestData.ErrorValidationForInvalidPANNumber;
  await contractorsPage.fillContractorName(formData.contractorName);
  await contractorsPage.fillAgreementValidFrom(formData.agreementValidFrom);
  await contractorsPage.fillAgreementValidTo(formData.agreementValidTo);
  await contractorsPage.fillGSTNumber(formData.gstNumber);
  await contractorsPage.fillPANNumber(formData.panNumber);
  await contractorsPage.selectStatus(formData.status);
  const filePath = addContractorTestData.fileUpload.contractorAgreementFilePath;
  await contractorsPage.uploadContractorAgreementFile(filePath);
  console.log(`Step 5a: Uploaded Contractor Agreement file: "${filePath}"`);

  // Step 6: Click on "Add Contractor" button
  await contractorsPage.clickAddContractorSubmitButton();

  // Step 7: Verify validation error when user enter invalid PAN number format
  const expectedErrorMessage = formData.expectedErrorMessage;
  await contractorsPage.verifyPANValidationError(expectedErrorMessage);
  console.log(`Step 7: Verified validation error when user enter invalid PAN number format: "${expectedErrorMessage}"`);
});

test("Verify when user Enter less than 10 digits contact phone number in contact information section", { tag: '@regression' }, async ({ page }) => {
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

  // Step 3: Click on "+ Add Contractor"
  await contractorsPage.clickAddContractorButton();

  // Step 4: Click on "Add Contractors" tab/button
  await contractorsPage.verifyAddContractorModalIsVisible();
  await contractorsPage.clickAddContractorsOption();
  await page.waitForTimeout(2000); // Wait for form to fully load

  // Step 5: Fill Contractor Name and all other fields using test data
  const formData = addContractorTestData.ErrorValidationForLessThan10DigitsPhoneNumber;
  await contractorsPage.fillContractorName(formData.contractorName);
  await contractorsPage.fillGSTNumber(formData.gstNumber);
  await contractorsPage.selectStatus(formData.status);
  await contractorsPage.fillContactPhone(formData.contactPhone);
  const filePath = addContractorTestData.fileUpload.contractorAgreementFilePath;
  await contractorsPage.uploadContractorAgreementFile(filePath);
  console.log(`Step 5a: Uploaded Contractor Agreement file: "${filePath}"`);

  // Step 6: Click on "Add Contractor" button
  await contractorsPage.clickAddContractorSubmitButton();

  // Step 7: Verify validation error when user enter invalid PAN number format
  const expectedErrorMessage = formData.expectedErrorMessage;
  await contractorsPage.verifyContactPhoneValidationError(expectedErrorMessage);
  console.log(`Step 7: Verified validation error when user enter less than 10 digits contact phone number in contact information section: "${expectedErrorMessage}"`);
});

test("Verify when user Enter more than 15 digits contact phone number in contact information section", { tag: '@regression' }, async ({ page }) => {
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

  // Step 3: Click on "+ Add Contractor"
  await contractorsPage.clickAddContractorButton();

  // Step 4: Click on "Add Contractors" tab/button
  await contractorsPage.verifyAddContractorModalIsVisible();
  await contractorsPage.clickAddContractorsOption();
  await page.waitForTimeout(2000); // Wait for form to fully load

  // Step 5: Fill Contractor Name and all other fields using test data
  const formData = addContractorTestData.ErrorValidationForMoreThan15DigitsPhoneNumber;
  await contractorsPage.fillContractorName(formData.contractorName);
  await contractorsPage.fillGSTNumber(formData.gstNumber);
  await contractorsPage.selectStatus(formData.status);
  await contractorsPage.fillContactPhone(formData.contactPhone);
  const filePath = addContractorTestData.fileUpload.contractorAgreementFilePath;
  await contractorsPage.uploadContractorAgreementFile(filePath);
  console.log(`Step 5a: Uploaded Contractor Agreement file: "${filePath}"`);

  // Step 6: Click on "Add Contractor" button
  await contractorsPage.clickAddContractorSubmitButton();

  // Step 7: Verify validation error when user enter invalid PAN number format
  const expectedErrorMessage = formData.expectedErrorMessage;
  await contractorsPage.verifyContactPhoneValidationError(expectedErrorMessage);
  console.log(`Step 7: Verified validation error when user enter more than 15 digits contact phone number in contact information section: "${expectedErrorMessage}"`);
});

test("Verify when user enter invalid email format for contact Email field in contact information section", { tag: '@regression' }, async ({ page }) => {
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

  // Step 3: Click on "+ Add Contractor"
  await contractorsPage.clickAddContractorButton();

  // Step 4: Click on "Add Contractors" tab/button
  await contractorsPage.verifyAddContractorModalIsVisible();
  await contractorsPage.clickAddContractorsOption();
  await page.waitForTimeout(2000); // Wait for form to fully load

  // Step 5: Fill Contractor Name and all other fields using test data
  const formData = addContractorTestData.ErrorValidationForInvalidEmailFormat;
  await contractorsPage.fillContractorName(formData.contractorName);
  await contractorsPage.fillGSTNumber(formData.gstNumber);
  await contractorsPage.selectStatus(formData.status);
  await contractorsPage.fillContactEmail(formData.contactEmail);
  const filePath = addContractorTestData.fileUpload.contractorAgreementFilePath;
  await contractorsPage.uploadContractorAgreementFile(filePath);
  console.log(`Step 5a: Uploaded Contractor Agreement file: "${filePath}"`);

  // Step 6: Click on "Add Contractor" button
  await contractorsPage.clickAddContractorSubmitButton();

  // Step 7: Verify validation error when user enter invalid PAN number format
  const expectedErrorMessage = formData.expectedErrorMessage;
  await contractorsPage.verifyContactEmailValidationError(expectedErrorMessage);
  console.log(`Step 7: Verified validation error when user enter invalid email format for contact Email field in contact information section: "${expectedErrorMessage}"`);
});

test("Verify when user enter invalid Pincode less than 6 digits", { tag: '@regression' }, async ({ page }) => {
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

  // Step 3: Click on "+ Add Contractor"
  await contractorsPage.clickAddContractorButton();

  // Step 4: Click on "Add Contractors" tab/button
  await contractorsPage.verifyAddContractorModalIsVisible();
  await contractorsPage.clickAddContractorsOption();
  await page.waitForTimeout(2000); // Wait for form to fully load

  // Step 5: Fill Contractor Name and all other fields using test data
  const formData = addContractorTestData.ErrorValidationForInvalidPincodeLessThan6Digits;
  await contractorsPage.fillContractorName(formData.contractorName);
  await contractorsPage.fillGSTNumber(formData.gstNumber);
  await contractorsPage.selectStatus(formData.status);
  await contractorsPage.fillPincode(formData.pincode);
  const filePath = addContractorTestData.fileUpload.contractorAgreementFilePath;
  await contractorsPage.uploadContractorAgreementFile(filePath);
  console.log(`Step 5a: Uploaded Contractor Agreement file: "${filePath}"`);

  // Step 6: Click on "Add Contractor" button
  await contractorsPage.clickAddContractorSubmitButton();

  // Step 7: Verify validation error when user enter invalid PAN number format
  const expectedErrorMessage = formData.expectedErrorMessage;
  await contractorsPage.verifyPincodeValidationError(expectedErrorMessage);
  console.log(`Step 7: Verified validation error when user enter invalid Pincode less than 6 digits: "${expectedErrorMessage}"`);
});

test("Verify Status dropdown default value and options in Add Contractor form", { tag: '@regression' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const contractorsPage = new ContractorsPage(page);

  // Step 1: Login to the application using valid credentials
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");
  console.log("Step 1: Logged in successfully");

  // Step 2: From the left side navigation panel, click on the "Contractors" menu
  await dashboardPage.clickNavigationMenu("Contractors");
  await page.waitForLoadState("networkidle");
  console.log("Step 2: Navigated to Contractors page");

  // Step 3: Click on the "+ Add Contractor" button
  await contractorsPage.clickAddContractorButton();
  console.log("Step 3: Clicked on Add Contractor button");

  // Step 4: Click on the "Add Contractors" tab/button
  await contractorsPage.verifyAddContractorModalIsVisible();
  await contractorsPage.clickAddContractorsOption();
  await page.waitForTimeout(2000); // Wait for form to fully load
  console.log("Step 4: Clicked on Add Contractors option");

  // Step 5: Verify that by default "Active" is selected in the Status dropdown field
  await contractorsPage.verifyDefaultStatus();
  console.log("Step 5: Verified default status is 'Active'");

  // Step 6: Click on the Status dropdown and verify the following options are visible:
  // - Active
  // - Inactive
  // - Blacklisted
  const expectedOptions = ["Active", "Inactive", "Blacklisted"];
  await contractorsPage.verifyStatusOptions(expectedOptions);
  console.log("Step 6: Verified all status options are visible: Active, Inactive, Blacklisted");

  // Step 7: Select each option one by one and verify that the selected value is displayed correctly in the Status field
  for (const option of expectedOptions) {
    await contractorsPage.selectAndVerifyStatus(option);
    console.log(`Step 7: Selected and verified status "${option}" is displayed correctly`);
  }

  // Step 8: Click on the Cancel button and verify the modal is closed
  await contractorsPage.clickCancelButton();
  await contractorsPage.verifyModalIsClosed();
  console.log("Step 8: Clicked Cancel button and verified modal is closed");
});

test("Verify Other Documents - Document Type dropdown options and selection", { tag: '@regression' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const contractorsPage = new ContractorsPage(page);

  // Step 1: Login to the application using valid credentials
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");
  console.log("Step 1: Logged in successfully");

  // Step 2: From the left side navigation panel, click on the "Contractors" menu
  await dashboardPage.clickNavigationMenu("Contractors");
  await page.waitForLoadState("networkidle");
  console.log("Step 2: Navigated to Contractors page");

  // Step 3: Click on the "+ Add Contractor" button
  await contractorsPage.clickAddContractorButton();
  console.log("Step 3: Clicked on Add Contractor button");

  // Step 4: Click on the "Add Contractors" tab/button
  await contractorsPage.verifyAddContractorModalIsVisible();
  await contractorsPage.clickAddContractorsOption();
  await page.waitForTimeout(2000); // Wait for form to fully load
  console.log("Step 4: Clicked on Add Contractors option");

  // Step 5: Click on "+ Add Document" button
  await contractorsPage.clickAddDocumentButton();
  console.log("Step 5: Clicked on + Add Document button");

  // Step 6: Click on Document type drop down and verify options from test data
  const documentTypes = addContractorTestData.documentTypeOptions;
  await contractorsPage.verifyDocumentTypeOptions(documentTypes);
  console.log("Step 6: Verified all Document Type options are visible from test data");

  // Step 7: Select each option one by one and verify that the selected value is displayed correctly in the Document Type field
  for (const docType of documentTypes) {
    await contractorsPage.selectAndVerifyDocumentType(docType);
    console.log(`Step 7: Selected and verified Document Type "${docType}" is displayed correctly`);
  }

  // Step 8: Click on the Cancel button and verify the modal is closed
  await contractorsPage.clickCancelButton();
  await contractorsPage.verifyModalIsClosed();
  console.log("Step 8: Clicked Cancel button and verified modal is closed");
});

test("Add new contractor with all fields and verify in list", { tag: '@regression' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const contractorsPage = new ContractorsPage(page);

  // Step 1: Login to the application using valid credentials
  await loginPage.goto();
  await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
  await page.waitForLoadState("networkidle");
  console.log("Step 1: Logged in successfully");

  // Step 2: Navigate to "Contractors" from the left sidebar
  await dashboardPage.clickNavigationMenu("Contractors");
  await page.waitForLoadState("networkidle");
  console.log("Step 2: Navigated to Contractors page");

  // Step 3: Click on "+ Add Contractor"
  await contractorsPage.clickAddContractorButton();
  console.log("Step 3: Clicked on + Add Contractor button");

  // Step 4: Click on "Add Contractors" tab/button
  await contractorsPage.verifyAddContractorModalIsVisible();
  await contractorsPage.clickAddContractorsOption();
  await page.waitForTimeout(2000); // Wait for form to fully load
  console.log("Step 4: Clicked on Add Contractors option");

  // Step 5: Fill all fields using test data
  const formData = addContractorTestData.addNewContractorWithAllFields;
  
  // Basic Information
  await contractorsPage.fillContractorName(formData.contractorName);
  await contractorsPage.fillAgreementValidFrom(formData.agreementValidFrom);
  await contractorsPage.fillAgreementValidTo(formData.agreementValidTo);
  await contractorsPage.fillGSTNumber(formData.gstNumber);
  await contractorsPage.fillPANNumber(formData.panNumber);
  await contractorsPage.selectStatus(formData.status);
  console.log("Step 5a: Filled basic information fields");

  // Upload Contractor Agreement
  await contractorsPage.uploadContractorAgreementFile(formData.contractorAgreementFilePath);
  console.log(`Step 5b: Uploaded Contractor Agreement file: "${formData.contractorAgreementFileName}"`);

  // Other Documents - Add Document and upload file
  await contractorsPage.clickAddDocumentButton();
  await contractorsPage.selectAndVerifyDocumentType(formData.documentType);
  await contractorsPage.uploadOtherDocumentFile(formData.otherDocumentFilePath);
  console.log(`Step 5c: Added Other Document - Type: "${formData.documentType}", File: "${formData.otherDocumentFileName}"`);

  // Contact Information
  await contractorsPage.fillContactPerson(formData.contactPerson);
  await contractorsPage.fillContactPhone(formData.contactPhone);
  await contractorsPage.fillContactEmail(formData.contactEmail);
  console.log("Step 5d: Filled contact information fields");

  // Address
  await contractorsPage.fillAddressLine1(formData.addressLine1);
  if (formData.addressLine2) {
    await contractorsPage.fillAddressLine2(formData.addressLine2);
  }
  await contractorsPage.fillCity(formData.city);
  await contractorsPage.fillState(formData.state);
  await contractorsPage.fillPincode(formData.pincode);
  console.log("Step 5e: Filled address fields");

  // Notes
  if (formData.notes) {
    await contractorsPage.fillNotes(formData.notes);
    console.log("Step 5f: Filled notes field");
  }

  console.log("Step 5: Completed filling all form fields with test data");

  // Step 6: Click on "Add Contractor" button
  await contractorsPage.clickAddContractorSubmitButton();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(3000); // Wait for contractor to be added and list to refresh
  console.log("Step 6: Clicked on Add Contractor button");

  // Step 7: In Contractor list page verify newly added contractor is getting displayed in list
  await contractorsPage.verifyContractorInList(formData.contractorName);
  console.log(`Step 7: Verified newly added contractor "${formData.contractorName}" is displayed in the list`);
});



