const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pageobjects/LoginPage");
const { DashboardPage } = require("../pageobjects/DashboardPage");
const { getCredentials } = require("../config/env.config");
const { navigationTestData } = require("../test-data/NavigationData");

// Get credentials from environment
const credentials = getCredentials();

test.describe("Navigation Menu Tests", { tag: ['@smoke', '@regression'] }, () => {
    
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        
        // Navigate to application and login
        await loginPage.goto();
        await loginPage.validlogin(credentials.admin.username, credentials.admin.password);
        
        // Wait for dashboard to load
        await page.waitForLoadState("networkidle");
        await expect(page).toHaveURL(new RegExp("/dashboard"));
    });

    test("Verify all navigation menu items are visible in left sidebar", async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        
        // Verify all navigation menus are visible
        await dashboardPage.verifyAllNavigationMenusVisible(navigationTestData.menuItems);
    });

    test.describe("Navigation and Page Title Validation", () => {
        for (const menuItem of navigationTestData.menuItems) {
            test(menuItem.description, async ({ page }) => {
                const dashboardPage = new DashboardPage(page);
                
                // Navigate to the menu item and verify page title
                await dashboardPage.navigateAndVerifyPage(menuItem.name, menuItem.expectedTitle);
            });
        }
    });

    test("Verify navigation menu items are clickable", async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        
        // Verify each navigation menu is enabled/clickable
        for (const menuItem of navigationTestData.menuItems) {
            const navItem = dashboardPage.getNavigationItem(menuItem.name);
            await expect(navItem).toBeEnabled();
            console.log(`Navigation menu "${menuItem.name}" is clickable`);
        }
    });
});
