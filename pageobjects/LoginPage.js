const { expect } = require("@playwright/test");
const { getCurrentEnv } = require("../config/env.config");

class LoginPage {

    constructor(page) {
        this.page = page;
        this.signInbutton = page.locator("//a[normalize-space()='Sign in']");
        this.signInWithEmail = page.locator("//button[normalize-space()='Sign in with Email']")
        this.username = page.locator("#email");
        this.password = page.locator("#password");
        //this.loginErrorMessage = page.getByText("Invalid email or password");
        this.loginErrorMessage = page.getByText(/Invalid email or password|Please enter a valid email address|Email is required|Password is required/);
        this.emailRequiredError = page.getByText("Email is required");
        this.passwordRequiredError = page.getByText("Password is required");
    }

    async goto() {
        // Use centralized baseURL from env.config.js
        const envConfig = getCurrentEnv();
        const baseURL = process.env.BASE_URL || envConfig.baseURL;
        await this.page.goto(baseURL);
    }

    async validlogin(username, password) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.signInWithEmail.click();
    }

    async invalidLogin(username, password) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.signInWithEmail.click();
    }

    async verifyInvalidLoginError() {
        await expect(this.loginErrorMessage).toBeVisible();
    }

    async verifyBlankFieldErrors() {
        // Verify both email and password required errors are visible
        await expect(this.emailRequiredError).toBeVisible();
        await expect(this.passwordRequiredError).toBeVisible();
    }
}

module.exports = { LoginPage };
