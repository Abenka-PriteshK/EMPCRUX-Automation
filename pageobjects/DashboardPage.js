const { expect } = require("@playwright/test");

class DashboardPage {
    
    constructor(page) {
        this.page = page;
        // Left sidebar navigation menu items
        this.dashboardNav = page.locator("//a[normalize-space()='Dashboard']");
        this.projectsNav = page.locator("//a[normalize-space()='Projects']");
        this.employeesNav = page.locator("//a[normalize-space()='Employees']");
        this.contractorsNav = page.locator("//a[normalize-space()='Contractors']");
        this.reportsNav = page.locator("//a[normalize-space()='Reports']");
        this.adminNav = page.locator("//a[normalize-space()='Admin']");
        
        // Right panel page title (main heading)
        this.pageTitle = page.locator("h1").first(); // Assuming the main title is in h1 tag
        // Alternative selector if h1 doesn't work: page.locator("//h1[contains(@class, 'text-')]").first()
        
        // Dashboard tiles/cards
        this.totalProjectsTile = page.locator("//*[contains(text(), 'TOTAL PROJECTS') or contains(text(), 'Total Projects')]").first();
        this.activeProjectsTile = page.locator("//*[contains(text(), 'ACTIVE PROJECTS') or contains(text(), 'Active Projects')]").first();
        this.numberOfContractorsTile = page.locator("//*[contains(text(), 'NUMBER OF CONTRACTORS') or contains(text(), 'Number of Contractors')]").first();
        this.totalNumberOfEmployeesTile = page.locator("//*[contains(text(), 'TOTAL NUMBER OF EMPLOYEES') or contains(text(), 'Total Number of Employees')]").first();
        
        // Contracts Expiring Soon section
        this.contractsExpiringSoonSection = page.locator("//*[contains(text(), 'Contracts Expiring Soon') or contains(text(), 'CONTRACTS EXPIRING SOON')]").first();
    }

    // Generic method to get navigation locator by name
    getNavigationItem(menuName) {
        return this.page.locator(`//a[normalize-space()='${menuName}']`);
    }

    // Method to click on navigation menu item
    async clickNavigationMenu(menuName) {
        const navItem = this.getNavigationItem(menuName);
        await navItem.click();
        await this.page.waitForLoadState("networkidle");
    }

    // Method to verify page title matches navigation menu name
    async verifyPageTitle(expectedTitle) {
        await expect(this.pageTitle).toBeVisible();
        await expect(this.pageTitle).toHaveText(expectedTitle);
        console.log(`Page title "${expectedTitle}" is verified`);
    }

    // Method to verify navigation menu is visible
    async verifyNavigationMenuVisible(menuName) {
        const navItem = this.getNavigationItem(menuName);
        await expect(navItem).toBeVisible();
        console.log(`Navigation menu "${menuName}" is visible`);
    }

    // Method to verify all navigation menus are visible
    async verifyAllNavigationMenusVisible(menuItems) {
        for (const menu of menuItems) {
            await this.verifyNavigationMenuVisible(menu.name);
        }
    }

    // Method to navigate and verify page title
    async navigateAndVerifyPage(menuName, expectedTitle) {
        await this.clickNavigationMenu(menuName);
        await this.verifyPageTitle(expectedTitle);
    }

    // Method to verify a dashboard tile is visible with its label
    async verifyDashboardTile(tileLocator, expectedLabel) {
        await expect(tileLocator).toBeVisible();
        const tileText = await tileLocator.textContent();
        if (tileText && tileText.toUpperCase().includes(expectedLabel.toUpperCase())) {
            console.log(`Dashboard tile "${expectedLabel}" is visible`);
            return true;
        } else {
            throw new Error(`Dashboard tile "${expectedLabel}" label mismatch. Found: "${tileText}"`);
        }
    }

    // Method to verify all dashboard tiles are visible
    async verifyAllDashboardTiles() {
        const tiles = [
            { locator: this.totalProjectsTile, label: "TOTAL PROJECTS" },
            { locator: this.numberOfContractorsTile, label: "NUMBER OF CONTRACTORS" },
            { locator: this.totalNumberOfEmployeesTile, label: "TOTAL NUMBER OF EMPLOYEES" }
        ];

        for (const tile of tiles) {
            await this.verifyDashboardTile(tile.locator, tile.label);
        }
        console.log("All dashboard tiles are visible with correct labels");
    }

    // Method to get total projects count from dashboard tile
    async getTotalProjectsCountFromTile() {
        await expect(this.totalProjectsTile).toBeVisible();
        
        // Get the parent card/tile element that contains the count
        // The count is usually a large number displayed in the tile
        const tileCard = this.totalProjectsTile.locator("..").or(
            this.page.locator("//*[contains(text(), 'TOTAL PROJECTS')]/ancestor::*[contains(@class, 'card') or contains(@class, 'tile')]")
        );
        
        // Try multiple patterns to find the number
        const countSelectors = [
            tileCard.locator("//*[contains(@class, 'text-') and string-length(text()) < 10]").first(), // Large number
            tileCard.locator("//h1 | //h2 | //h3").first(), // Heading with number
            tileCard.locator("//*[contains(@class, 'value') or contains(@class, 'count')]").first(),
            this.page.locator("//*[contains(text(), 'TOTAL PROJECTS')]/following::*[1]").first(),
            this.page.locator("//*[contains(text(), 'TOTAL PROJECTS')]/ancestor::*[contains(@class, 'card')]//*[contains(@class, 'text-')]").first()
        ];
        
        for (const selector of countSelectors) {
            try {
                const count = await selector.count();
                if (count > 0) {
                    const text = await selector.first().textContent();
                    if (text) {
                        // Extract number from text (remove any non-numeric characters except digits)
                        const numberMatch = text.trim().match(/\d+/);
                        if (numberMatch) {
                            const totalCount = parseInt(numberMatch[0]);
                            console.log(`Total Projects count from tile: ${totalCount}`);
                            return totalCount;
                        }
                    }
                }
            } catch (e) {
                continue;
            }
        }
        
        // Fallback: get all text from tile and extract number
        const tileText = await this.totalProjectsTile.textContent();
        if (tileText) {
            const numberMatch = tileText.match(/\d+/);
            if (numberMatch) {
                const totalCount = parseInt(numberMatch[0]);
                console.log(`Total Projects count from tile (fallback): ${totalCount}`);
                return totalCount;
            }
        }
        
        throw new Error("Could not extract total projects count from dashboard tile");
    }

    // Method to get active contractors count from dashboard tile
    async getActiveContractorsCountFromTile() {
        await expect(this.numberOfContractorsTile).toBeVisible();

        let tileText = "";

        try {
            // Use explicit XPath so Playwright doesn't treat it as CSS
            const tileCard = this.numberOfContractorsTile.locator(
                "xpath=ancestor::*[contains(@class, 'card') or contains(@class, 'tile')][1]"
            );
            tileText = (await tileCard.textContent()) || "";
        } catch (e) {
            console.log("Could not get parent card for contractors tile, falling back to label element only");
            tileText = (await this.numberOfContractorsTile.textContent()) || "";
        }

        const match = tileText.match(/\d+/);
        if (!match) {
            throw new Error(`Could not extract active contractors count from tile text: "${tileText.trim()}"`);
        }

        const count = parseInt(match[0], 10);
        console.log(`Active contractors count from dashboard tile: ${count}`);
        return count;
    }

    // Method to get active employees count from dashboard tile
    async getActiveEmployeesCountFromTile() {
        await expect(this.totalNumberOfEmployeesTile).toBeVisible();

        let tileText = "";

        try {
            const tileCard = this.totalNumberOfEmployeesTile.locator(
                "xpath=ancestor::*[contains(@class, 'card') or contains(@class, 'tile')][1]"
            );
            tileText = (await tileCard.textContent()) || "";
        } catch (e) {
            console.log("Could not get parent card for employees tile, falling back to label element only");
            tileText = (await this.totalNumberOfEmployeesTile.textContent()) || "";
        }

        const match = tileText.match(/\d+/);
        if (!match) {
            throw new Error(`Could not extract active employees count from tile text: "${tileText.trim()}"`);
        }

        const count = parseInt(match[0], 10);
        console.log(`Active employees count from dashboard tile: ${count}`);
        return count;
    }

    // Method to get contractor names from "Contracts Expiring Soon" section
    async getContractorsFromExpiringSoonSection() {
        await expect(this.contractsExpiringSoonSection).toBeVisible();
        console.log("Contracts Expiring Soon section is visible");

        // Get the parent container of the section (card/section/container)
        const sectionContainer = this.contractsExpiringSoonSection.locator(
            "xpath=ancestor::*[contains(@class, 'card') or contains(@class, 'section') or contains(@class, 'container')][1]"
        ).or(
            this.page.locator("//*[contains(text(), 'Contracts Expiring Soon')]/ancestor::*[contains(@class, 'card') or contains(@class, 'section')][1]")
        );

        // Find the table within the section
        const table = sectionContainer.locator("table").or(sectionContainer.locator("//*[@role='table']")).first();
        const tableExists = await table.count() > 0;

        const contractorNames = [];

        if (tableExists) {
            console.log("Found table in Contracts Expiring Soon section");

            // Get all table rows (excluding header row if it exists)
            const rows = table.locator("tbody tr").or(table.locator("//*[@role='row']"));
            const rowCount = await rows.count();
            console.log(`Found ${rowCount} rows in the table`);

            // Common header text to skip
            const headerKeywords = [
                'contractor name', 'status', 'contract end date', 'days remaining',
                'name', 'end date', 'remaining', 'expiring', 'contract'
            ];

            for (let i = 0; i < rowCount; i++) {
                const row = rows.nth(i);
                const rowText = ((await row.textContent()) || '').trim().toLowerCase();

                // Skip header rows
                let isHeader = false;
                for (const keyword of headerKeywords) {
                    if (rowText.includes(keyword) && rowText.split(/\s+/).length <= 5) {
                        isHeader = true;
                        break;
                    }
                }

                if (isHeader) {
                    console.log(`Skipping header row: ${rowText}`);
                    continue;
                }

                // Get cells in the row
                const cells = row.locator("td").or(row.locator("//*[@role='cell']"));
                const cellCount = await cells.count();

                if (cellCount > 0) {
                    // Contractor name is typically in the first column
                    const firstCellText = ((await cells.nth(0).textContent()) || '').trim();
                    
                    // Skip if it looks like a header or UI element
                    if (firstCellText && 
                        firstCellText.length > 0 && 
                        !firstCellText.match(/^\d+$/) && // Not just numbers
                        !firstCellText.match(/^\d+\s*days?$/i) && // Not "X days"
                        !firstCellText.match(/^\d{1,2}[-\/]\d{1,2}[-\/]\d{4}$/) && // Not a date
                        !headerKeywords.some(kw => firstCellText.toLowerCase().includes(kw))) {
                        
                        contractorNames.push(firstCellText);
                        console.log(`Found contractor name from table row: ${firstCellText}`);
                    }
                }
            }
        } else {
            // Fallback: Try to find list items or divs with contractor names
            console.log("No table found, trying list items or divs");
            const listItems = sectionContainer.locator("li")
                .or(sectionContainer.locator("//*[@role='listitem']"))
                .or(sectionContainer.locator("//div[contains(@class, 'item')]"))
                .or(sectionContainer.locator("//div[contains(@class, 'row')]"));
            const itemCount = await listItems.count();

            if (itemCount > 0) {
                console.log(`Found ${itemCount} items in Contracts Expiring Soon section`);
                
                const headerKeywords = [
                    'contractor name', 'status', 'contract end date', 'days remaining',
                    'contracts expiring soon', 'name', 'end date', 'remaining'
                ];

                for (let i = 0; i < itemCount; i++) {
                    const item = listItems.nth(i);
                    const itemText = ((await item.textContent()) || '').trim();
                    
                    if (itemText && itemText.length > 0) {
                        // Skip if it's a header or UI element
                        const isHeader = headerKeywords.some(kw => itemText.toLowerCase().includes(kw));
                        const isDate = itemText.match(/^\d{1,2}[-\/]\d{1,2}[-\/]\d{4}$/);
                        const isDaysRemaining = itemText.match(/^\d+\s*days?\s*remaining?$/i);
                        const isOnlyNumbers = itemText.match(/^\d+$/);

                        if (!isHeader && !isDate && !isDaysRemaining && !isOnlyNumbers) {
                            // Extract contractor name (first part before date or "days")
                            const nameMatch = itemText.match(/^([^0-9\n]+?)(?:\s+\d+.*)?$/);
                            if (nameMatch) {
                                const name = nameMatch[1].trim();
                                if (name && name.length > 0 && name.length < 100) { // Reasonable name length
                                    contractorNames.push(name);
                                    console.log(`Found contractor in expiring soon section: ${name}`);
                                }
                            }
                        }
                    }
                }
            }
        }

        // Remove duplicates and filter out any remaining UI elements
        const uniqueNames = [...new Set(contractorNames)];
        const filteredNames = uniqueNames.filter(name => {
            const lower = name.toLowerCase();
            // Filter out common UI elements
            return !lower.includes('dashboard') && 
                   !lower.includes('quick view') && 
                   !lower.includes('empcrux') && 
                   !lower.includes('sa') &&
                   !lower.includes('showing') &&
                   !lower.includes('prevpage') &&
                   !lower.includes('projects by status') &&
                   !lower.includes('active employees vs contractors') &&
                   name.length > 0 && 
                   name.length < 100;
        });

        console.log(`Total contractors found in Contracts Expiring Soon section: ${filteredNames.length}`);
        console.log(`Contractor names: ${filteredNames.join(', ')}`);
        return filteredNames;
    }
}

module.exports = { DashboardPage };
