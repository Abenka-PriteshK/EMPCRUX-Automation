const { expect } = require("@playwright/test");

class HomePage {
    
    constructor(page) {
        this.page = page;
        this.signInButton = page.locator("//button[normalize-space()='Sign in with Email']");
    }

    getTab(tabName) {
        return this.page.getByRole("link", { name: tabName });
    }

    async verifySignInButton() {

        await expect(this.signInButton).toBeVisible();
        console.log("Sign in button is visible");

        await expect(this.signInButton).toBeEnabled();
        console.log("Sign in button is enabled");

        await expect(this.signInButton).toHaveText("Sign in with Email");
        console.log("Sign in button text is correct");
    }

    async verifyTabsVisible(tabs) {
        for (const tab of tabs) {
            await expect(this.getTab(tab.name)).toBeVisible();
        }
    }

    async verifyTabsClickable(tabs) {
        for (const tab of tabs) {
            await expect(this.getTab(tab.name)).toBeEnabled();
        }
    }

    async verifyTabNavigation(tabs) {
        for (const tab of tabs) {
            await this.getTab(tab.name).click();
            await this.page.waitForLoadState("networkidle");
            await expect(this.page).toHaveURL(tab.url);
        }
    }    
}

module.exports = { HomePage };