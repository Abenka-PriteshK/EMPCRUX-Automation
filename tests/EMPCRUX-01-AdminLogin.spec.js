const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pageobjects/LoginPage");
const { HomePage } = require("../pageobjects/HomePage");
const { loginTestData } = require("../test-data/AdminLoginData");



test("Verify Sign in button is visible and enabled on launch", { tag: '@smoke' }, async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);

  // Navigate to application
  await loginPage.goto();

  // Verify primary sign in button on landing page
  await homePage.verifySignInButton();
});

test.describe("Valid Login Tests", { tag: ['@smoke', '@regression'] }, () => {
  for (const data of loginTestData.valid) {
    test(data.title, async ({ page }) => {
      const loginPage = new LoginPage(page);

      // Navigate to application
      await loginPage.goto();

      // Perform valid login
      await loginPage.validlogin(data.username, data.password);

      // Verify successful navigation (URL contains expected path)
      await expect(page).toHaveURL(new RegExp(data.expectedUrl));
    });
  }
});


test.describe("Invalid Login Tests", { tag: '@regression' }, () => {
  for (const data of loginTestData.invalid) {
    test(data.title, async ({ page }) => {
      const loginPage = new LoginPage(page);

      // Navigate to application
      await loginPage.goto();

      // Attempt invalid login
      await loginPage.invalidLogin(data.username, data.password);

      // For blank fields, verify both email and password required errors
      if (data.username === "" && data.password === "") {
        await loginPage.verifyBlankFieldErrors();
        // Verify specific error messages from test data
        await expect(loginPage.emailRequiredError).toHaveText(data.emailErrorMessage);
        await expect(loginPage.passwordRequiredError).toHaveText(data.passwordErrorMessage);
      } else {
        // Verify error message is displayed with expected text
        await loginPage.verifyInvalidLoginError();
        await expect(loginPage.loginErrorMessage).toHaveText(data.errorMessage);
      }
    });
  }
});