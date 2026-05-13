const { expect } = require("@playwright/test");

class EmployeesPage {

    constructor(page) {
        this.page = page;

        // Page title
        this.pageTitle = page.locator("h1").first();

        // Add Employee button
        this.addEmployeeButton = page.locator("//button[normalize-space()='+ Add Employee']");

        // Search input on Employees list page
        this.searchInput = page
            .locator("//input[contains(@placeholder, 'Search') or contains(@placeholder, 'employee') or @type='search']")
            .first();

        // Add New Employee form/page elements
        this.addNewEmployeeTitle = page.getByText("Add New Employee", { exact: false }).first();
        this.employeeForm = page.locator("//form").first();
        this.cancelButton = this.employeeForm.getByRole("button", { name: /Cancel/i }).first();
        this.addEmployeeSubmitButton = this.employeeForm.getByRole("button", { name: /Add Employee/i }).first();


        // Validation error message locators
        this.firstNameError = this.employeeForm.getByText("First name is required.", { exact: false }).or(this.employeeForm.locator("//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'first name') and contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'required')]")).first();
        this.departmentError = this.employeeForm.getByText("Department is required.", { exact: false }).or(this.employeeForm.locator("//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'department') and contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'required')]")).first();
        this.designationError = this.employeeForm.getByText("Designation is required.", { exact: false }).or(this.employeeForm.locator("//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'designation') and contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'required')]")).first();
        this.dateOfJoiningError = this.employeeForm.getByText("Date of joining is required.", { exact: false }).or(this.employeeForm.locator("//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'date of joining') and contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'required')]")).first();
        this.contractorError = this.employeeForm.getByText("Contractor is required.", { exact: false }).or(this.employeeForm.locator("//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'please select a contractor') and contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'required')]")).first();


        // Employees list/table elements
        this.employeesTable = page
            .locator("//table | //div[contains(@class, 'table')] | //*[@role='table']")
            .first();
        this.employeeRows = this.employeesTable.locator("//tbody//tr | //*[@role='row']");

        // Pagination
        this.nextPageButton = page.locator("//button[normalize-space()='Next']");
    }

    // Fill all fields on Add Employee form using a provided test data object
    // Intended for Step 4: "Fill all fields as per test data"
    async fillAllFieldsFromTestData(testData) {
        await this.page.waitForLoadState("networkidle");
        await expect(this.employeeForm).toBeVisible({ timeout: 10000 });

        // Text inputs
        if (testData.firstName) await this.fillFieldByLabel("First Name", testData.firstName);
        if (testData.middleName) await this.fillFieldByLabel("Middle Name", testData.middleName);
        if (testData.lastName) await this.fillFieldByLabel("Last Name", testData.lastName);
        if (testData.officialEmail) await this.fillFieldByLabel("Official Email", testData.officialEmail);
        if (testData.department) await this.fillFieldByLabel("Department", testData.department);
        if (testData.subDepartment) await this.fillFieldByLabel("Sub Department", testData.subDepartment);
        if (testData.designation) await this.fillFieldByLabel("Designation", testData.designation);
        if (testData.primaryPhone) await this.fillFieldByLabel("Primary Phone", testData.primaryPhone);

        // Dates
        if (testData.dateOfJoining) await this.fillDateFieldByLabel("Date of Joining", testData.dateOfJoining);
        if (testData.dateOfBirth) await this.fillDateFieldByLabel("Date of Birth", testData.dateOfBirth);

        // Dropdowns
        if (testData.gender) await this.selectGenderAndVerify(testData.gender);
        if (testData.maritalStatus) await this.selectMaritalStatusAndVerify(testData.maritalStatus);

        // Aadhaar and Contractor
        if (testData.aadharCardNumber) await this.fillFieldByLabel("Aadhar Card Number", testData.aadharCardNumber);
        if (testData.contractor) await this.selectContractor(testData.contractor);

        // Other numeric/text fields
        if (testData.monthlySalary) await this.fillFieldByLabel("Monthly Salary", testData.monthlySalary);
        if (testData.qualification) await this.fillFieldByLabel("Qualification", testData.qualification);

        // Textareas
        if (testData.previousExperience) await this.fillTextareaByLabel("Previous Experience", testData.previousExperience);

        // Interview details
        if (testData.interviewBy) await this.fillFieldByLabel("Interview By", testData.interviewBy);
        if (testData.dateOfInterview) await this.fillDateFieldByLabel("Date Of Interview", testData.dateOfInterview);
        if (testData.interviewRemark) await this.fillTextareaByLabel("Interview Remark", testData.interviewRemark);

        // Management
        if (testData.headOfFunction) await this.fillFieldByLabel("Head of Function", testData.headOfFunction);

        console.log("All employee form fields filled successfully from provided test data");
    }

    // Open Marital Status dropdown and verify all options are visible
    async verifyMaritalStatusDropdownOptions(expectedOptions) {
        try {
            // Find Marital Status dropdown using getByLabel or fallback to button#maritalStatus
            let dropdown = this.page.getByLabel("Marital Status", { exact: false }).first();
            let exists = await dropdown.count().catch(() => 0);
            if (exists === 0) {
                dropdown = this.employeeForm.locator("//button[@id='maritalStatus']").first();
            }

            await expect(dropdown).toBeVisible({ timeout: 10000 });
            await dropdown.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(200);

            // Click to open
            await dropdown.click();
            await this.page.waitForTimeout(400);

            // Wait for listbox
            const listbox = this.page.locator("[role='listbox']").first();
            await expect(listbox).toBeVisible({ timeout: 5000 });

            // Verify options
            const missing = [];
            for (const option of expectedOptions) {
                const opt = this.page.getByRole("option", { name: option, exact: false }).first();
                const isVisible = await opt.isVisible({ timeout: 3000 }).catch(() => false);
                if (!isVisible) {
                    missing.push(option);
                } else {
                    console.log(`✓ Marital Status option "${option}" is visible`);
                }
            }

            if (missing.length > 0) {
                throw new Error(`Marital Status dropdown options not found: ${missing.join(", ")}`);
            }

            console.log(`All ${expectedOptions.length} Marital Status options are visible`);
        } catch (e) {
            console.error(`Error verifying Marital Status dropdown options: ${e.message}`);
            throw e;
        }
    }

    // Get selected value from Marital Status dropdown
    async getSelectedMaritalStatusValue() {
        try {
            let dropdown = this.page.getByLabel("Marital Status", { exact: false }).first();
            let exists = await dropdown.count().catch(() => 0);
            if (exists === 0) {
                dropdown = this.employeeForm.locator("//button[@id='maritalStatus']").first();
            }
            await expect(dropdown).toBeVisible({ timeout: 5000 });
            const selectedText = await dropdown.textContent();
            return selectedText ? selectedText.trim() : "";
        } catch (e) {
            console.error(`Error getting selected Marital Status value: ${e.message}`);
            throw e;
        }
    }

    // Close Marital Status dropdown safely
    async closeMaritalStatusDropdown() {
        try {
            const listbox = this.page.locator("[role='listbox']").first();
            const isVisible = await listbox.isVisible({ timeout: 1000 }).catch(() => false);
            if (isVisible) {
                await this.page.keyboard.press("Escape");
                await this.page.waitForTimeout(200);
                const stillVisible = await listbox.isVisible({ timeout: 1000 }).catch(() => false);
                if (stillVisible) {
                    // Try clicking the button to toggle close
                    let dropdown = this.page.getByLabel("Marital Status", { exact: false }).first();
                    let exists = await dropdown.count().catch(() => 0);
                    if (exists === 0) {
                        dropdown = this.employeeForm.locator("//button[@id='maritalStatus']").first();
                    }
                    const visibleButton = await dropdown.isVisible({ timeout: 1000 }).catch(() => false);
                    if (visibleButton) {
                        await dropdown.click();
                        await this.page.waitForTimeout(200);
                    }
                }
            }
        } catch (e) {
            console.log(`Note: Error closing Marital Status dropdown: ${e.message}`);
        }
    }

    // Select Marital Status option and verify the selected value
    async selectMaritalStatusAndVerify(optionValue) {
        try {
            // Ensure form visible if present
            const formExists = await this.employeeForm.count().catch(() => 0);
            if (formExists > 0) {
                const formVisible = await this.employeeForm.isVisible({ timeout: 2000 }).catch(() => false);
                if (formVisible) {
                    await this.employeeForm.scrollIntoViewIfNeeded();
                    await this.page.waitForTimeout(150);
                }
            }

            // Find dropdown
            let dropdown = this.page.getByLabel("Marital Status", { exact: false }).first();
            let exists = await dropdown.count().catch(() => 0);
            if (exists === 0) {
                dropdown = this.employeeForm.locator("//button[@id='maritalStatus']").first();
            }

            // Use common helper to select
            await this._selectFromResolvedDropdownElement(dropdown, "Marital Status", optionValue);

            // Ensure dropdown closed
            await this.closeMaritalStatusDropdown();

            // Ensure form still open
            const title = this.page.getByText("Add New Employee", { exact: false }).first();
            const titleVisible = await title.isVisible({ timeout: 3000 }).catch(() => false);
            if (!titleVisible) {
                throw new Error("Add New Employee form page closed after selecting Marital Status option.");
            }

            // Verify selection
            const selected = await this.getSelectedMaritalStatusValue();
            if (!selected.toLowerCase().includes(optionValue.toLowerCase())) {
                throw new Error(`Selected Marital Status value "${selected}" does not match expected "${optionValue}"`);
            }
            console.log(`✓ Verified Marital Status selection: "${optionValue}" is displayed as "${selected}"`);
            return true;
        } catch (e) {
            console.error(`Error selecting and verifying Marital Status option "${optionValue}": ${e.message}`);
            throw e;
        }
    }

    async verifyOnEmployeesPage() {
        await this.page.waitForLoadState("networkidle");

        // Ensure no Radix dialog/modal is still overlaying the page
        const openDialog = this.page.locator('[role="dialog"][data-state="open"]');
        await expect(openDialog).toHaveCount(0, { timeout: 10000 });

        await expect(this.pageTitle).toBeVisible();
        await expect(this.pageTitle).toHaveText(/Employees/i);
        console.log("On Employees page");
    }

    // Verify Employees list page is loaded (used by EMPCRUX-09 smoke test)
    async verifyEmployeesPageLoaded() {
        await this.verifyOnEmployeesPage();

        // Verify URL contains /employees
        await expect(this.page).toHaveURL(/\/employees/i);

        // Verify key UI elements are present
        await expect(this.addEmployeeButton).toBeVisible({ timeout: 10000 });
        await expect(this.searchInput).toBeVisible({ timeout: 10000 });

        console.log("Verified Employees page loaded successfully");
    }

    // Count employees on the current page whose status is 'Active'
    async getActiveEmployeesCountOnCurrentPage() {
        const rowCount = await this.employeeRows.count();
        let activeCount = 0;

        console.log(`Total employee rows on current page: ${rowCount}`);

        for (let i = 0; i < rowCount; i++) {
            const row = this.employeeRows.nth(i);

            const statusCell = row.locator(
                "xpath=.//td[" +
                "contains(normalize-space(.), 'Active') and " +
                "not(contains(normalize-space(.), 'Inactive'))" +
                "]"
            );

            try {
                const statusCount = await statusCell.count();
                if (statusCount > 0) {
                    const text = ((await statusCell.first().textContent()) || '').trim();
                    console.log(`Row ${i + 1} status cell text (employees): \"${text}\"`);
                    activeCount++;
                }
            } catch {
                continue;
            }
        }

        console.log(`Active employees on current page (status='Active'): ${activeCount}`);
        return activeCount;
    }

    // Get total active employees across all pages
    async getTotalActiveEmployeesCount() {
        let totalActive = 0;
        let pageIndex = 1;

        while (true) {
            console.log(`Counting active employees on page ${pageIndex}...`);
            await this.page.waitForLoadState("networkidle");
            await this.page.waitForTimeout(500);

            totalActive += await this.getActiveEmployeesCountOnCurrentPage();

            const hasNext = await this.nextPageButton.isEnabled().catch(() => false);
            if (!hasNext) {
                break;
            }

            await this.nextPageButton.click();
            pageIndex++;
        }

        console.log(`Total active employees from list: ${totalActive}`);
        return totalActive;
    }

    // Verify Add Employee button is visible and enabled
    async verifyAddEmployeeButton() {
        await expect(this.addEmployeeButton).toBeVisible({ timeout: 10000 });
        console.log("Add Employee button is visible");

        await expect(this.addEmployeeButton).toBeEnabled();
        console.log("Add Employee button is enabled");
    }

    // Click on Add Employee button to navigate to Add New Employee form page
    async clickAddEmployeeButton() {
        await expect(this.addEmployeeButton).toBeVisible({ timeout: 10000 });
        await expect(this.addEmployeeButton).toBeEnabled();
        await this.addEmployeeButton.click();
        await this.page.waitForLoadState("networkidle");
        console.log("Clicked on Add Employee button");
    }

       // Verify all mandatory field validation errors
       async verifyMandatoryFieldErrors(mandatoryFieldsData) {
        for (const field of mandatoryFieldsData) {
            switch (field.fieldName) {
                case "First Name":
                    await this.verifyFirstNameError(field.errorMessage);
                    break;
                case "Department":
                    await this.verifyDepartmentError(field.errorMessage);
                    break;
                case "Designation":
                    await this.verifyDesignationError(field.errorMessage);
                    break;
                case "Date of Joining":
                    await this.verifyDateOfJoiningError(field.errorMessage);
                    break;
                case "Contractor":
                    await this.verifyContractorError(field.errorMessage);
                    break;
                default:
                    console.log(`Validation for field "${field.fieldName}" not implemented`);
            }
        }
        console.log("All mandatory field validation errors are displayed");
    }


        // Verify First Name validation error
        async verifyFirstNameError(expectedErrorMessage) {
            const errorSelectors = [
                this.employeeForm.getByText(expectedErrorMessage, { exact: false }),
                this.employeeForm.locator(`//*[contains(text(), '${expectedErrorMessage}')]`),
                this.firstNameError
            ];
    
            let errorFound = false;
            for (const selector of errorSelectors) {
                try {
                    const count = await selector.count();
                    if (count > 0) {
                        const isVisible = await selector.first().isVisible({ timeout: 3000 }).catch(() => false);
                        if (isVisible) {
                            const errorText = await selector.first().textContent();
                            console.log(`First name error message is visible: "${errorText}"`);
                            errorFound = true;
                            break;
                        }
                    }
                } catch (e) {
                    continue;
                }
            }
    
            if (!errorFound) {
                throw new Error(`First name validation error message not found. Expected: "${expectedErrorMessage}"`);
            }
        }


    // Verify Department validation error
        async verifyDepartmentError(expectedErrorMessage) {
            const errorSelectors = [
                this.employeeForm.getByText(expectedErrorMessage, { exact: false }),
                this.employeeForm.locator(`//*[contains(text(), '${expectedErrorMessage}')]`),
                this.departmentError
            ];
    
            let errorFound = false;
            for (const selector of errorSelectors) {
                try {
                    const count = await selector.count();
                    if (count > 0) {
                        const isVisible = await selector.first().isVisible({ timeout: 3000 }).catch(() => false);
                        if (isVisible) {
                            const errorText = await selector.first().textContent();
                            console.log(`Department error message is visible: "${errorText}"`);
                            errorFound = true;
                            break;
                        }
                    }
                } catch (e) {
                    continue;
                }
            }
    
            if (!errorFound) {
                throw new Error(`Department validation error message not found. Expected: "${expectedErrorMessage}"`);
            }
        }


    // Verify Designation validation error
    async verifyDesignationError(expectedErrorMessage) {
        const errorSelectors = [
            this.employeeForm.getByText(expectedErrorMessage, { exact: false }),
            this.employeeForm.locator(`//*[contains(text(), '${expectedErrorMessage}')]`),
            this.designationError
        ];

        let errorFound = false;
        for (const selector of errorSelectors) {
            try {
                const count = await selector.count();
                if (count > 0) {
                    const isVisible = await selector.first().isVisible({ timeout: 3000 }).catch(() => false);
                    if (isVisible) {
                        const errorText = await selector.first().textContent();
                        console.log(`Designation error message is visible: "${errorText}"`);
                        errorFound = true;
                        break;
                    }
                }
            } catch (e) {
                continue;
            }
        }

        if (!errorFound) {
            throw new Error(`Designation validation error message not found. Expected: "${expectedErrorMessage}"`);
        }
    }

    // Verify Date of Joining validation error
    async verifyDateOfJoiningError(expectedErrorMessage) {
        const errorSelectors = [
            this.employeeForm.getByText(expectedErrorMessage, { exact: false }),
            this.employeeForm.locator(`//*[contains(text(), '${expectedErrorMessage}')]`),
            this.dateOfJoiningError
        ];

        let errorFound = false;
        for (const selector of errorSelectors) {
            try {
                const count = await selector.count();
                if (count > 0) {
                    const isVisible = await selector.first().isVisible({ timeout: 3000 }).catch(() => false);
                    if (isVisible) {
                        const errorText = await selector.first().textContent();
                        console.log(`Date of joining error message is visible: "${errorText}"`);
                        errorFound = true;
                        break;
                    }
                }
            } catch (e) {
                continue;
            }
        }

        if (!errorFound) {
            throw new Error(`Date of joining validation error message not found. Expected: "${expectedErrorMessage}"`);
        }
    }

    // Verify Contractor validation error
    async verifyContractorError(expectedErrorMessage) {
        const errorSelectors = [
            this.employeeForm.getByText(expectedErrorMessage, { exact: false }),
            this.employeeForm.locator(`//*[contains(text(), '${expectedErrorMessage}')]`),
            this.contractorError
        ];

        let errorFound = false;
        for (const selector of errorSelectors) {
            try {
                const count = await selector.count();
                if (count > 0) {
                    const isVisible = await selector.first().isVisible({ timeout: 3000 }).catch(() => false);
                    if (isVisible) {
                        const errorText = await selector.first().textContent();
                        console.log(`Contractor error message is visible: "${errorText}"`);
                        errorFound = true;
                        break;
                    }
                }
            } catch (e) {
                continue;
            }
        }

        if (!errorFound) {
            throw new Error(`Contractor validation error message not found. Expected: "${expectedErrorMessage}"`);
        }
    }






    // Verify Aadhar validation error
    async verifyAadharValidationError(expectedErrorMessage) {
        const errorSelectors = [
            this.employeeForm.getByText(expectedErrorMessage, { exact: false }),
            this.employeeForm.locator(`//*[contains(text(), '${expectedErrorMessage}')]`),
            this.contractorError
        ];

        let errorFound = false;
        for (const selector of errorSelectors) {
            try {
                const count = await selector.count();
                if (count > 0) {
                    const isVisible = await selector.first().isVisible({ timeout: 3000 }).catch(() => false);
                    if (isVisible) {
                        const errorText = await selector.first().textContent();
                        console.log(`Aadhar validation error message is visible: "${errorText}"`);
                        errorFound = true;
                        break;
                    }
                }
            } catch (e) {
                continue;
            }
        }

        if (!errorFound) {
            throw new Error(`Aadhar validation error message not found. Expected: "${expectedErrorMessage}"`);
        }
    }




































 
    // Verify that Add New Employee form page is loaded successfully
    async verifyAddNewEmployeeFormPageLoaded() {
        await this.page.waitForLoadState("networkidle");

        // Verify page title or heading
        await expect(this.addNewEmployeeTitle).toBeVisible({ timeout: 10000 });

        // Verify the main employee form is visible
        await expect(this.employeeForm).toBeVisible({ timeout: 10000 });

        console.log("Add New Employee form page is loaded successfully");
    }

    // Verify Cancel and Add Employee buttons are visible and enabled
    async verifyCancelAndAddEmployeeButtons() {
        // Verify Cancel button
        await expect(this.cancelButton).toBeVisible({ timeout: 10000 });
        await expect(this.cancelButton).toBeEnabled();
        const cancelButtonText = await this.cancelButton.textContent();
        console.log(`Cancel button is visible and enabled. Text: "${cancelButtonText}"`);

        // Verify Add Employee button
        await expect(this.addEmployeeSubmitButton).toBeVisible({ timeout: 10000 });
        await expect(this.addEmployeeSubmitButton).toBeDisabled();
        const addEmployeeButtonText = await this.addEmployeeSubmitButton.textContent();
        console.log(`Add Employee button is visible and disabled. Text: "${addEmployeeButtonText}"`);
    }

    // Verify Add Employee form fields and labels using test data
    async verifyAddEmployeeFormFieldsAndLabels(addEmployeeFormData) {
        await this.page.waitForLoadState("networkidle");
        await expect(this.employeeForm).toBeVisible({ timeout: 10000 });

        const missingItems = [];

        for (const field of addEmployeeFormData.formFields) {
            const {
                label,
                placeholder,
                checkLabel = true,
                checkPlaceholder = true
            } = field;

            // Check label visibility by text inside the form (if enabled)
            if (checkLabel && label) {
                try {
                    const labelLocator = this.employeeForm.locator(
                        `//*[contains(normalize-space(text()), '${label}')]`
                    ).first();

                    const labelCount = await labelLocator.count();
                    let labelVisible = false;
                    if (labelCount > 0) {
                        labelVisible = await labelLocator.isVisible({ timeout: 3000 }).catch(() => false);
                    }

                    if (!labelVisible) {
                        missingItems.push(`Label: ${label}`);
                        console.log(`✗ Label "${label}" not found or not visible`);
                    } else {
                        console.log(`✓ Label "${label}" is visible`);
                    }
                } catch (e) {
                    missingItems.push(`Label: ${label}`);
                    console.log(`✗ Error checking label "${label}": ${e.message}`);
                }
            }

            // If placeholder is provided in test data and checking is enabled, verify corresponding input/field
            if (placeholder && checkPlaceholder) {
                try {
                    const placeholderLocator = this.employeeForm.getByPlaceholder(placeholder);
                    const placeholderCount = await placeholderLocator.count();
                    let placeholderVisible = false;
                    if (placeholderCount > 0) {
                        placeholderVisible = await placeholderLocator
                            .first()
                            .isVisible({ timeout: 3000 })
                            .catch(() => false);
                    }

                    if (!placeholderVisible) {
                        missingItems.push(`Placeholder: ${placeholder}`);
                        console.log(`✗ Placeholder "${placeholder}" not found or not visible`);
                    } else {
                        console.log(`✓ Placeholder "${placeholder}" is visible`);
                    }
                } catch (e) {
                    missingItems.push(`Placeholder: ${placeholder}`);
                    console.log(`✗ Error checking placeholder "${placeholder}": ${e.message}`);
                }
            }
        }

        if (missingItems.length > 0) {
            throw new Error(
                `The following Add Employee form labels/fields are not visible: ${missingItems.join(
                    ", "
                )}`
            );
        }

        console.log("All Add Employee form fields and labels from test data are visible");
    }

    // Helper method to find input field by label text
    async findInputByLabel(labelText) {
        // Normalize label text for matching (case-insensitive, handle variations)
        const normalizedLabel = labelText.toLowerCase().trim();
        
        // Special handling for known fields with placeholders
        const placeholderMap = {
            "Previous Experience": "Brief previous work experience",
            "Interview Remark": "Remarks from interview",
            "Notes": "Additional notes about the employee",
            // Specific mapping for Aadhar Card Number field
            "Aadhar Card Number": "e.g., 123456789012"
        };
        
        // Strategy 0: Use Playwright's built-in getByLabel (most reliable)
        try {
            const byLabel = this.page.getByLabel(labelText, { exact: false });
            const labelCount = await byLabel.count();
            if (labelCount > 0) {
                const isVisible = await byLabel.first().isVisible({ timeout: 2000 }).catch(() => false);
                if (isVisible) {
                    return byLabel.first();
                }
            }
        } catch (e) {
            // Continue to other strategies
        }
        
        // Strategy 0.25: For Aadhar Card specifically, try by known placeholder before anything else
        if (labelText.includes("Aadhar")) {
            try {
                // First: use the actual known id/name from the app (aadhaarNumber)
                const aadhaarDirect = this.employeeForm.locator(
                    "//input[@id='aadhaarNumber' or @name='aadhaarNumber' or @id='aadhaarCardNumber' or @name='aadhaarCardNumber']"
                ).first();
                const directCount = await aadhaarDirect.count().catch(() => 0);
                if (directCount > 0) {
                    return aadhaarDirect;
                }

                // Placeholder text can vary (comma/space); try multiple patterns and also search near the label.
                const aadharPlaceholderCandidates = [
                    placeholderMap["Aadhar Card Number"],
                    "e.g. 123456789012",
                    "e.g.,123456789012",
                    "123456789012"
                ];

                let aadharInput = null;
                for (const ph of aadharPlaceholderCandidates) {
                    const loc = this.page.getByPlaceholder(ph, { exact: false });
                    const c = await loc.count().catch(() => 0);
                    if (c > 0) {
                        aadharInput = loc.first();
                        break;
                    }
                }

                if (!aadharInput) {
                    const byLabelFollowing = this.employeeForm.locator(
                        `//*[contains(translate(normalize-space(text()), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'aadhar card number')]/following::input[1]`
                    ).first();
                    const c2 = await byLabelFollowing.count().catch(() => 0);
                    if (c2 > 0) aadharInput = byLabelFollowing;
                }

                if (aadharInput) {
                    // Proactively scroll down so the field is actually rendered/visible
                    await this.employeeForm.scrollIntoViewIfNeeded().catch(() => {});
                    await this.page.waitForTimeout(200);
                    for (let i = 0; i < 2; i++) {
                        await this.page.keyboard.press("PageDown").catch(() => {});
                        await this.page.waitForTimeout(200);
                    }
                    await aadharInput.scrollIntoViewIfNeeded().catch(() => {});
                    const isVisible = await aadharInput.isVisible({ timeout: 3000 }).catch(() => false);
                    if (isVisible) {
                        return aadharInput;
                    }
                }
            } catch (e) {
                // Fall through to remaining strategies
            }
        }

        // Strategy 0.5: Use getByPlaceholder for known placeholders
        if (placeholderMap[labelText]) {
            try {
                const byPlaceholder = this.page.getByPlaceholder(placeholderMap[labelText], { exact: false });
                const placeholderCount = await byPlaceholder.count();
                if (placeholderCount > 0) {
                    const isVisible = await byPlaceholder.first().isVisible({ timeout: 2000 }).catch(() => false);
                    if (isVisible) {
                        return byPlaceholder.first();
                    }
                }
            } catch (e) {
                // Continue to other strategies
            }
        }
        
        const strategies = [
            // Strategy 1: Find by placeholder text first (most reliable for textareas)
            ...(placeholderMap[labelText] ? [
                this.employeeForm.locator(`//textarea[contains(@placeholder, '${placeholderMap[labelText]}')]`),
                this.employeeForm.locator(`//input[contains(@placeholder, '${placeholderMap[labelText]}')]`),
                this.page.locator(`//textarea[contains(@placeholder, '${placeholderMap[labelText]}')]`),
                this.page.locator(`//input[contains(@placeholder, '${placeholderMap[labelText]}')]`)
            ] : []),
            
            // Strategy 2: Find by name/id/placeholder (exact match or common variations)
            this.employeeForm.locator(`//input[@name='${normalizedLabel.replace(/\s+/g, '')}' or @id='${normalizedLabel.replace(/\s+/g, '')}' or contains(@placeholder, '${labelText}')]`),
            this.employeeForm.locator(`//textarea[@name='${normalizedLabel.replace(/\s+/g, '')}' or @id='${normalizedLabel.replace(/\s+/g, '')}' or contains(@placeholder, '${labelText}')]`),
            this.page.locator(`//input[@name='${normalizedLabel.replace(/\s+/g, '')}' or @id='${normalizedLabel.replace(/\s+/g, '')}']`),
            this.page.locator(`//textarea[@name='${normalizedLabel.replace(/\s+/g, '')}' or @id='${normalizedLabel.replace(/\s+/g, '')}']`),
            // Special-case Aadhar Card field by likely name/id
            ...(labelText.includes("Aadhar") ? [
                // Handle both spellings: aadhar/aadhaar
                this.employeeForm.locator("//input[@name='aadharCardNumber' or @id='aadharCardNumber' or @name='aadharNumber' or @id='aadharNumber' or @name='aadhaarNumber' or @id='aadhaarNumber']"),
                this.page.locator("//input[@name='aadharCardNumber' or @id='aadharCardNumber' or @name='aadharNumber' or @id='aadharNumber' or @name='aadhaarNumber' or @id='aadhaarNumber']")
            ] : []),
            
            // Strategy 3: Find label with exact text match, then find input/textarea
            this.employeeForm.locator(`//label[contains(normalize-space(text()), '${labelText}')]/following-sibling::input[1]`),
            this.employeeForm.locator(`//label[contains(normalize-space(text()), '${labelText}')]/following-sibling::textarea[1]`),
            this.employeeForm.locator(`//label[contains(normalize-space(text()), '${labelText}')]/parent::*/input`),
            this.employeeForm.locator(`//label[contains(normalize-space(text()), '${labelText}')]/parent::*/textarea`),
            this.page.locator(`//label[contains(normalize-space(text()), '${labelText}')]/following-sibling::textarea[1]`),
            this.page.locator(`//label[contains(normalize-space(text()), '${labelText}')]/following::textarea[1]`),
            
            // Strategy 4: Find label, then find next input/textarea in DOM
            this.employeeForm.locator(`//label[contains(normalize-space(text()), '${labelText}')]/following::input[1]`),
            this.employeeForm.locator(`//label[contains(normalize-space(text()), '${labelText}')]/following::textarea[1]`),
            this.page.locator(`//label[contains(normalize-space(text()), '${labelText}')]/following::textarea[1]`),
            
            // Strategy 5: Find any element containing label text, then find input/textarea in ancestor container
            this.employeeForm.locator(`//*[contains(normalize-space(text()), '${labelText}')]/ancestor::div[1]//input`),
            this.employeeForm.locator(`//*[contains(normalize-space(text()), '${labelText}')]/ancestor::div[1]//textarea`),
            this.employeeForm.locator(`//*[contains(normalize-space(text()), '${labelText}')]/ancestor::div[2]//input`),
            this.employeeForm.locator(`//*[contains(normalize-space(text()), '${labelText}')]/ancestor::div[2]//textarea`),
            this.page.locator(`//*[contains(normalize-space(text()), '${labelText}')]/ancestor::div[1]//textarea`),
            this.page.locator(`//*[contains(normalize-space(text()), '${labelText}')]/ancestor::div[2]//textarea`),
            
            // Strategy 6: Find label, then find input/textarea in next sibling div
            this.employeeForm.locator(`//label[contains(normalize-space(text()), '${labelText}')]/parent::*/following-sibling::*/input`),
            this.employeeForm.locator(`//label[contains(normalize-space(text()), '${labelText}')]/parent::*/following-sibling::*/textarea`),
            
            // Strategy 7: Find by placeholder text (for fields that might use placeholder as label)
            this.employeeForm.locator(`//input[contains(@placeholder, '${labelText}')]`),
            this.employeeForm.locator(`//textarea[contains(@placeholder, '${labelText}')]`),
            
            // Strategy 8: Find label with case-insensitive match
            this.employeeForm.locator(`//label[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${normalizedLabel}')]/following-sibling::input[1]`),
            this.employeeForm.locator(`//label[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${normalizedLabel}')]/following-sibling::textarea[1]`),
            this.employeeForm.locator(`//label[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${normalizedLabel}')]/following::input[1]`),
            this.employeeForm.locator(`//label[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${normalizedLabel}')]/following::textarea[1]`),
            
            // Strategy 9: Search entire page for textarea with placeholder containing key words
            ...(labelText.includes("Experience") ? [
                this.page.locator(`//textarea[contains(@placeholder, 'experience')]`),
                this.page.locator(`//textarea[contains(@placeholder, 'Experience')]`)
            ] : []),
            ...(labelText.includes("Remark") ? [
                this.page.locator(`//textarea[contains(@placeholder, 'remark')]`),
                this.page.locator(`//textarea[contains(@placeholder, 'Remark')]`)
            ] : []),
            ...(labelText.includes("Note") ? [
                this.page.locator(`//textarea[contains(@placeholder, 'note')]`),
                this.page.locator(`//textarea[contains(@placeholder, 'Note')]`)
            ] : [])
        ];

        for (const strategy of strategies) {
            try {
                const count = await strategy.count();
                if (count > 0) {
                    const input = strategy.first();
                    const isVisible = await input.isVisible({ timeout: 3000 }).catch(() => false);
                    if (isVisible) {
                        return input;
                    }
                }
            } catch (e) {
                continue;
            }
        }
        
        // Last resort: Try to find by searching the entire page for the label and then the closest input/textarea
        try {
            const labelElement = this.page.locator(`//*[contains(normalize-space(text()), '${labelText}')]`).first();
            const labelCount = await labelElement.count();
            if (labelCount > 0) {
                const isLabelVisible = await labelElement.isVisible({ timeout: 2000 }).catch(() => false);
                if (isLabelVisible) {
                    // Try to find input/textarea near this label (search in multiple ways)
                    const nearbySelectors = [
                        this.page.locator(`//*[contains(normalize-space(text()), '${labelText}')]/following::input[1]`),
                        this.page.locator(`//*[contains(normalize-space(text()), '${labelText}')]/following::textarea[1]`),
                        this.page.locator(`//*[contains(normalize-space(text()), '${labelText}')]/ancestor::div[1]//textarea[1]`),
                        this.page.locator(`//*[contains(normalize-space(text()), '${labelText}')]/ancestor::div[2]//textarea[1]`),
                        this.page.locator(`//*[contains(normalize-space(text()), '${labelText}')]/ancestor::div[3]//textarea[1]`)
                    ];
                    
                    for (const nearbySelector of nearbySelectors) {
                        try {
                            const nearbyCount = await nearbySelector.count();
                            if (nearbyCount > 0) {
                                const nearbyInput = nearbySelector.first();
                                const isInputVisible = await nearbyInput.isVisible({ timeout: 2000 }).catch(() => false);
                                if (isInputVisible) {
                                    return nearbyInput;
                                }
                            }
                        } catch (e) {
                            continue;
                        }
                    }
                }
            }
        } catch (e) {
            // Ignore and throw original error
        }
        
        // Final fallback: Try to find all textareas and match by context
        if (labelText.includes("Experience") || labelText.includes("Remark") || labelText.includes("Note")) {
            try {
                const allTextareas = this.page.locator("textarea");
                const textareaCount = await allTextareas.count();
                console.log(`Found ${textareaCount} textarea elements on page`);
                
                // Try to find by placeholder containing keywords
                const keywords = labelText.includes("Experience") ? ["experience", "Experience"] :
                               labelText.includes("Remark") ? ["remark", "Remark", "remarks", "Remarks"] :
                               ["note", "Note", "notes", "Notes"];
                
                for (const keyword of keywords) {
                    for (let i = 0; i < textareaCount; i++) {
                        try {
                            const textarea = allTextareas.nth(i);
                            const placeholder = await textarea.getAttribute("placeholder").catch(() => "");
                            if (placeholder && placeholder.toLowerCase().includes(keyword.toLowerCase())) {
                                const isVisible = await textarea.isVisible({ timeout: 2000 }).catch(() => false);
                                if (isVisible) {
                                    console.log(`Found ${labelText} textarea by placeholder keyword: ${keyword}`);
                                    return textarea;
                                }
                            }
                        } catch (e) {
                            continue;
                        }
                    }
                }
            } catch (e) {
                // Ignore
            }
        }
        
        throw new Error(`Could not find input field for label: ${labelText}. Please verify the field exists on the page.`);
    }

    // Helper method to convert date from DD-MM-YYYY to YYYY-MM-DD format (for date input fields)
    convertDateFormat(dateString) {
        // If date is already in YYYY-MM-DD format, return as is
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return dateString;
        }
        // If date is in DD-MM-YYYY format, convert to YYYY-MM-DD
        if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
            const parts = dateString.split('-');
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        // If date is in DD/MM/YYYY format, convert to YYYY-MM-DD
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
            const parts = dateString.split('/');
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        // Return as is if format is not recognized
        console.warn(`Date format not recognized: ${dateString}. Using as is.`);
        return dateString;
    }

    // Fill text input field by label
    async fillFieldByLabel(labelText, value) {
        try {
            if (this.page.isClosed()) {
                throw new Error(`Cannot fill "${labelText}" because the page/context is already closed.`);
            }

            // Some fields (like Aadhar Card Number) can be below the fold; scroll before locating.
            if (labelText.toLowerCase().includes("aadhar")) {
                await this.employeeForm.scrollIntoViewIfNeeded().catch(() => {});
                if (this.page.isClosed()) {
                    throw new Error(`Cannot fill "${labelText}" because the page/context was closed during scrolling.`);
                }
                await this.page.waitForTimeout(200).catch(() => {});
                for (let i = 0; i < 3; i++) {
                    await this.page.keyboard.press("PageDown").catch(() => {});
                    if (this.page.isClosed()) {
                        throw new Error(`Cannot fill "${labelText}" because the page/context was closed during scrolling.`);
                    }
                    await this.page.waitForTimeout(200).catch(() => {});
                }
            }
            const input = await this.findInputByLabel(labelText);
            await expect(input).toBeVisible({ timeout: 5000 });
            // Scroll field into view before interacting
            await input.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(200).catch(() => {});
            await input.clear();
            await input.fill(value);
            await this.page.waitForTimeout(300).catch(() => {});
            console.log(`Filled ${labelText}: ${value}`);
        } catch (e) {
            console.error(`Error filling ${labelText}: ${e.message}`);
            throw e;
        }
    }

    // Fill date field by label
    async fillDateFieldByLabel(labelText, date) {
        try {
            const input = await this.findInputByLabel(labelText);
            await expect(input).toBeVisible({ timeout: 5000 });
            // Scroll field into view before interacting
            await input.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(200);
            
            // Check if input is a date type
            const inputType = await input.getAttribute('type').catch(() => '');
            const convertedDate = inputType === 'date' ? this.convertDateFormat(date) : date;
            
            await input.clear();
            await input.fill(convertedDate);
            await this.page.waitForTimeout(300);
            console.log(`Filled ${labelText}: ${date} (converted to: ${convertedDate})`);
        } catch (e) {
            console.error(`Error filling ${labelText}: ${e.message}`);
            throw e;
        }
    }

    // Select dropdown option by label
    async selectDropdownByLabel(labelText, optionValue) {
        try {
            const normalizedLabel = labelText.toLowerCase().trim();

            // Strategy 0: Try Playwright's getByLabel directly (handles label/aria-label associations)
            try {
                const byLabelDropdown = this.page.getByLabel(labelText, { exact: false });
                const byLabelCount = await byLabelDropdown.count();
                if (byLabelCount > 0) {
                    const candidate = byLabelDropdown.first();
                    const isVisible = await candidate.isVisible({ timeout: 2000 }).catch(() => false);
                    if (isVisible) {
                        console.log(`Found dropdown for ${labelText} using getByLabel`);
                        // Use this element as our dropdownElement and skip the custom search
                        return await this._selectFromResolvedDropdownElement(candidate, labelText, optionValue);
                    }
                }
            } catch (e) {
                // continue to custom strategies
            }

            // For dropdowns that are typically lower on the form (e.g., Contractor, Marital Status, Gender),
            // proactively scroll the Add New Employee form into view before searching for label/controls.
            if (normalizedLabel.includes('contractor') || normalizedLabel.includes('marital') || normalizedLabel.includes('gender')) {
                try {
                    await this.employeeForm.scrollIntoViewIfNeeded().catch(() => {});
                    await this.page.waitForTimeout(200);
                    // Use PageDown a couple of times to bring lower fields into viewport
                    for (let i = 0; i < 2; i++) {
                        await this.page.keyboard.press('PageDown').catch(() => {});
                        await this.page.waitForTimeout(200);
                    }
                } catch (scrollErr) {
                    console.log(`Scroll/PageDown before locating ${labelText} failed: ${scrollErr.message}`);
                }
            }

            // Try multiple approaches for dropdown, case-insensitive on label text
            const labelLocator = this.employeeForm.locator(
                `//label[contains(translate(normalize-space(text()), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${normalizedLabel}')]` +
                ` | //*[(self::label or self::div or self::span) and contains(translate(normalize-space(text()), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${normalizedLabel}')]`
            ).first();

            // Prioritize button with role="combobox" first (for custom dropdowns like Contractor / Marital Status / Gender)
            const dropdownSelectors = [
                // Strategy 1: Find button with role="combobox" first (most common for custom dropdowns)
                labelLocator.locator("//following::button[@role='combobox'][1]"),
                labelLocator.locator("//following::button[contains(@class, 'select') or contains(@role, 'combobox') or contains(@aria-haspopup, 'listbox')][1]"),
                // Strategy 2: Special-case known fields (Contractor, Gender, Marital Status) by id/name
                ...(normalizedLabel.includes('contractor') ? [
                    this.employeeForm.locator("//button[@id='contractorId']"),
                    this.page.locator("//button[@id='contractorId']"),
                    this.employeeForm.locator("//select[@name='contractorId' or @id='contractorId']"),
                    this.page.locator("//select[@name='contractorId' or @id='contractorId']")
                ] : []),
                ...(normalizedLabel.includes('marital') ? [
                    this.employeeForm.locator("//select[@name='maritalStatus' or @id='maritalStatus']"),
                    this.page.locator("//select[@name='maritalStatus' or @id='maritalStatus']"),
                    this.employeeForm.locator("//button[@id='maritalStatus']"),
                    this.page.locator("//button[@id='maritalStatus']")
                ] : []),
                ...(normalizedLabel.includes('gender') ? [
                    this.employeeForm.locator("//select[@name='gender' or @id='gender']"),
                    this.page.locator("//select[@name='gender' or @id='gender']"),
                    this.employeeForm.locator("//button[@id='gender']"),
                    this.page.locator("//button[@id='gender']")
                ] : []),
                // Strategy 3: Find div with combobox role
                labelLocator.locator("//following::div[contains(@class, 'select') or contains(@role, 'combobox') or contains(@aria-haspopup, 'listbox')][1]"),
                // Strategy 4: Find in ancestor container
                this.employeeForm.locator(`//*[contains(translate(normalize-space(text()), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${normalizedLabel}')]//ancestor::div[1]//button[@role='combobox'][1]`),
                this.employeeForm.locator(`//*[contains(translate(normalize-space(text()), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${normalizedLabel}')]//ancestor::div[1]//button[1]`),
                this.employeeForm.locator(`//*[contains(translate(normalize-space(text()), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${normalizedLabel}')]//ancestor::div[1]//div[contains(@class, 'select') or contains(@role, 'combobox')][1]`),
                // Strategy 5: Standard select element (fallback)
                labelLocator.locator("//following::select[1]"),
                this.employeeForm.locator(`//*[contains(translate(normalize-space(text()), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${normalizedLabel}')]//ancestor::div[1]//select[1]`)
            ];
            
            let dropdownElement = null;
            for (const selector of dropdownSelectors) {
                try {
                    const count = await selector.count();
                    if (count > 0) {
                        const element = selector.first();
                        const isVisible = await element.isVisible({ timeout: 2000 }).catch(() => false);
                        if (isVisible) {
                            dropdownElement = element;
                            break;
                        }
                    }
                } catch (e) {
                    continue;
                }
            }

            if (!dropdownElement) {
                throw new Error(`Could not find dropdown for label: ${labelText}`);
            }

            // Scroll dropdown into view before interacting
            await dropdownElement.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(200);

            // Delegate actual selection logic to helper so we can reuse it when we already have a dropdown element
            return await this._selectFromResolvedDropdownElement(dropdownElement, labelText, optionValue);
        } catch (e) {
            console.error(`Error selecting ${labelText}: ${e.message}`);
            throw e;
        }
    }

    // Internal helper: given a resolved dropdown element, select the desired option
    async _selectFromResolvedDropdownElement(dropdownElement, labelText, optionValue) {
        try {
            // Check element type and role
            const tagName = await dropdownElement.evaluate(el => el.tagName).catch(() => '');
            const role = await dropdownElement.getAttribute('role').catch(() => '');
            const elementId = await dropdownElement.getAttribute('id').catch(() => '');

            // If it's a button with role="combobox" or has id="contractorId", skip selectOption and treat as custom dropdown
            if (tagName === 'BUTTON' && (role === 'combobox' || elementId === 'contractorId')) {
                console.log(`Found combobox button for ${labelText}, treating as custom dropdown`);
                // Skip selectOption and go straight to clicking
            } else if (tagName === 'SELECT') {
                // Try selectOption only for standard select elements
                try {
                    // Try by label first (most reliable)
                    await dropdownElement.selectOption({ label: optionValue }, { timeout: 5000 });
                    console.log(`Selected ${labelText}: ${optionValue} (by label)`);
                    return;
                } catch (e1) {
                    try {
                        // Try by value
                        await dropdownElement.selectOption(optionValue, { timeout: 5000 });
                        console.log(`Selected ${labelText}: ${optionValue} (by value)`);
                        return;
                    } catch (e2) {
                        // If selectOption fails, treat as custom dropdown
                        console.log(`selectOption failed for ${labelText}, treating as custom dropdown. Error: ${e2.message}`);
                        // Fall through to custom dropdown logic
                    }
                }
            }

            // Custom dropdown: click to open, then select option
            try {
                await dropdownElement.click({ timeout: 5000 });
            } catch (clickError) {
                if (clickError.message.includes('intercepts pointer events') || clickError.message.includes('element is not clickable')) {
                    await dropdownElement.click({ force: true, timeout: 5000 });
                } else {
                    throw clickError;
                }
            }
            
            // Wait for dropdown menu to appear - check for aria-expanded="true" or data-state="open"
            await this.page.waitForTimeout(500);

            // Fast-path for Radix/shadcn comboboxes: use listbox/option roles (avoids scanning entire DOM)
            if (role === 'combobox' || tagName === 'BUTTON') {
                const listbox = this.page.locator("[role='listbox']").first();
                await listbox.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});

                // If dropdown is searchable, type the desired option to filter
                const popoverInput = this.page.locator("[data-radix-popper-content-wrapper] input, [role='listbox'] input").first();
                if (await popoverInput.count().catch(() => 0)) {
                    const vis = await popoverInput.isVisible({ timeout: 500 }).catch(() => false);
                    if (vis) {
                        await popoverInput.fill("").catch(() => {});
                        await popoverInput.type(optionValue, { delay: 30 }).catch(() => {});
                        await this.page.waitForTimeout(300).catch(() => {});
                    }
                }

                const optionByRole = this.page.getByRole("option", { name: new RegExp(optionValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") }).first();
                const optionVisible = await optionByRole.isVisible({ timeout: 5000 }).catch(() => false);
                if (optionVisible) {
                    await optionByRole.click({ timeout: 5000 }).catch(async () => {
                        await optionByRole.click({ force: true, timeout: 5000 });
                    });
                    await this.page.waitForTimeout(200).catch(() => {});
                    console.log(`Selected ${labelText}: ${optionValue} (by role=option)`);
                    return;
                }
            }
            
            // Wait for the dropdown menu to be visible (check for common dropdown menu patterns)
            const menuSelectors = [
                this.page.locator("//*[@role='listbox']"),
                this.page.locator("//*[@role='menu']"),
                this.page.locator("//*[contains(@class, 'menu') or contains(@class, 'dropdown-menu')]"),
                this.page.locator("//ul[contains(@class, 'menu')]"),
                this.page.locator("//div[contains(@class, 'menu')]"),
                // For Radix UI (common pattern)
                this.page.locator("//*[contains(@id, 'radix-')]"),
                this.page.locator("//*[@data-radix-popper-content-wrapper]")
            ];
            
            let menuVisible = false;
            for (const menuSelector of menuSelectors) {
                try {
                    const menuCount = await menuSelector.count();
                    if (menuCount > 0) {
                        const isVisible = await menuSelector.first().isVisible({ timeout: 2000 }).catch(() => false);
                        if (isVisible) {
                            menuVisible = true;
                            break;
                        }
                    }
                } catch (e) {
                    continue;
                }
            }
            
            if (!menuVisible) {
                // Wait a bit more and try again
                await this.page.waitForTimeout(500);
            }
            
            // Helper to try selecting an option from the currently open dropdown
            const trySelectOption = async () => {
                const optionSelectors = [
                    // Strategy 1: Role-based selectors
                    this.page.locator(`//*[@role='option'][contains(normalize-space(text()), '${optionValue}')]`),
                    this.page.locator(`//*[@role='menuitem'][contains(normalize-space(text()), '${optionValue}')]`),
                    // Strategy 2: List items
                    this.page.locator(`//li[contains(normalize-space(text()), '${optionValue}')]`),
                    // Strategy 3: Div elements in dropdown
                    this.page.locator(`//div[contains(@class, 'option') or contains(@class, 'item')][contains(normalize-space(text()), '${optionValue}')]`),
                    // Strategy 4: Any element with the text (scoped under open popup if possible)
                    this.page.locator(`//*[@data-radix-popper-content-wrapper]//*[contains(normalize-space(text()), '${optionValue}')]`),
                    // Strategy 5: Playwright's getByText
                    this.page.getByText(optionValue, { exact: false }).first(),
                    // Strategy 6: Exact match
                    this.page.locator(`//*[normalize-space(text())='${optionValue}']`)
                ];

                for (const optionSelector of optionSelectors) {
                    try {
                        const count = await optionSelector.count();
                        if (count > 0) {
                            // Try all matching options until one is visible and clickable
                            for (let i = 0; i < count; i++) {
                                const option = optionSelector.nth(i);
                                const isVisible = await option.isVisible({ timeout: 2000 }).catch(() => false);
                                if (isVisible) {
                                    try {
                                        // Scroll option into view
                                        await option.scrollIntoViewIfNeeded();
                                        await this.page.waitForTimeout(200);
                                        await option.click({ timeout: 3000 });
                                        await this.page.waitForTimeout(300);
                                        const optionText = await option.textContent().catch(() => optionValue);
                                        console.log(`Selected ${labelText}: ${optionValue} (found as: "${optionText}")`);
                                        return true;
                                    } catch (clickErr) {
                                        if (clickErr.message.includes('intercepts pointer events') || clickErr.message.includes('element is not clickable')) {
                                            await option.scrollIntoViewIfNeeded();
                                            await this.page.waitForTimeout(200);
                                            await option.click({ force: true, timeout: 3000 });
                                            await this.page.waitForTimeout(300);
                                            const optionText = await option.textContent().catch(() => optionValue);
                                            console.log(`Selected ${labelText}: ${optionValue} with force click (found as: "${optionText}")`);
                                            return true;
                                        }
                                        continue;
                                    }
                                }
                            }
                        }
                    } catch (e) {
                        continue;
                    }
                }

                return false;
            };

            // First attempt: try to select directly from visible options
            let optionSelected = await trySelectOption();

            // If not found, try typing into the combobox (for searchable/typeahead dropdowns like Contractor)
            if (!optionSelected && (labelText.toLowerCase().includes('contractor') || role === 'combobox')) {
                console.log(`Option "${optionValue}" not found initially for ${labelText}, typing into dropdown to search...`);
                try {
                    // Try to find an input inside the open dropdown / combobox
                    const searchInputCandidates = [
                        dropdownElement.locator("input"),
                        this.page.locator("//*[@data-radix-popper-content-wrapper]//input").first(),
                        this.page.locator("//div[contains(@class, 'select') or contains(@class, 'combobox')]//input").first()
                    ];

                    let searchInput = null;
                    for (const candidate of searchInputCandidates) {
                        try {
                            const count = await candidate.count();
                            if (count > 0) {
                                const input = candidate.first();
                                const isVisible = await input.isVisible({ timeout: 2000 }).catch(() => false);
                                if (isVisible) {
                                    searchInput = input;
                                    break;
                                }
                            }
                        } catch {
                            continue;
                        }
                    }

                    if (searchInput) {
                        await searchInput.scrollIntoViewIfNeeded();
                        await this.page.waitForTimeout(200);
                        await searchInput.fill("");
                        await searchInput.type(optionValue, { delay: 50 });
                        await this.page.waitForTimeout(500); // wait for filtered options

                        optionSelected = await trySelectOption();
                    } else {
                        console.log(`No searchable input found inside ${labelText} dropdown; skipping typeahead fallback.`);
                    }
                } catch (searchErr) {
                    console.log(`Error while trying typeahead search for ${labelText}: ${searchErr.message}`);
                }
            }
            
            if (!optionSelected) {
                throw new Error(`Could not select option "${optionValue}" for ${labelText}. Dropdown may not have opened or option not found.`);
            }
        } catch (e) {
            console.error(`Error selecting ${labelText}: ${e.message}`);
            throw e;
        }
    }

    // Dedicated helper for Marital Status dropdown (button#maritalStatus)
    async selectMaritalStatus(optionValue) {
        try {
            // If page/context is already closed, avoid hard failure and log a clear message
            if (this.page.isClosed()) {
                console.error("Cannot select Marital Status: page/context is already closed.");
                return;
            }

            // Ensure the form is still visible before interacting
            await expect(this.employeeForm).toBeVisible({ timeout: 10000 });

            const dropdownButton = this.employeeForm.locator("//button[@id='maritalStatus']");
            const count = await dropdownButton.count().catch(() => 0);
            if (count === 0) {
                throw new Error("Marital Status dropdown button with id='maritalStatus' not found inside employee form");
            }

            const button = dropdownButton.first();
            await button.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(200);

            // Delegate to common selection helper
            await this._selectFromResolvedDropdownElement(button, "Marital Status", optionValue);
        } catch (e) {
            console.error(`Error selecting Marital Status: ${e.message}`);
            throw e;
        }
    }

    // Open Gender dropdown and verify all options are visible
    async verifyGenderDropdownOptions(expectedOptions) {
        try {
            // Find Gender dropdown using getByLabel
            const genderDropdown = this.page.getByLabel("Gender", { exact: false }).first();
            await expect(genderDropdown).toBeVisible({ timeout: 10000 });
            
            // Click to open dropdown
            await genderDropdown.click();
            await this.page.waitForTimeout(500); // Wait for dropdown to open
            
            // Wait for listbox to be visible
            const listbox = this.page.locator("[role='listbox']").first();
            await expect(listbox).toBeVisible({ timeout: 5000 });
            
            // Verify each expected option is visible
            const missingOptions = [];
            for (const option of expectedOptions) {
                try {
                    const optionElement = this.page.getByRole("option", { name: option, exact: false }).first();
                    const isVisible = await optionElement.isVisible({ timeout: 3000 }).catch(() => false);
                    if (!isVisible) {
                        missingOptions.push(option);
                    } else {
                        console.log(`✓ Gender option "${option}" is visible`);
                    }
                } catch (e) {
                    missingOptions.push(option);
                }
            }
            
            if (missingOptions.length > 0) {
                throw new Error(`Gender dropdown options not found: ${missingOptions.join(", ")}`);
            }
            
            console.log(`All ${expectedOptions.length} Gender options are visible`);
        } catch (e) {
            console.error(`Error verifying Gender dropdown options: ${e.message}`);
            throw e;
        }
    }

    // Get selected value from Gender dropdown
    async getSelectedGenderValue() {
        try {
            const genderDropdown = this.page.getByLabel("Gender", { exact: false }).first();
            await expect(genderDropdown).toBeVisible({ timeout: 5000 });
            
            // Get the text content of the dropdown button/combobox
            const selectedText = await genderDropdown.textContent();
            return selectedText ? selectedText.trim() : "";
        } catch (e) {
            console.error(`Error getting selected Gender value: ${e.message}`);
            throw e;
        }
    }

    // Select Gender option and verify the selected value is displayed correctly
    async selectGenderAndVerify(optionValue) {
        try {
            // Try to scroll form if it exists, but don't fail if it doesn't
            const formExists = await this.employeeForm.count().catch(() => 0);
            if (formExists > 0) {
                const isFormVisible = await this.employeeForm.isVisible({ timeout: 2000 }).catch(() => false);
                if (isFormVisible) {
                    await this.employeeForm.scrollIntoViewIfNeeded();
                    await this.page.waitForTimeout(200);
                }
            }
            
            // Scroll down a bit to ensure Gender field is visible
            for (let i = 0; i < 2; i++) {
                await this.page.keyboard.press('PageDown').catch(() => {});
                await this.page.waitForTimeout(200);
            }
            
            // Find Gender dropdown using getByLabel (same approach as verifyGenderDropdownOptions)
            const genderDropdown = this.page.getByLabel("Gender", { exact: false }).first();
            
            // Wait for it to be visible (with retry logic)
            let isVisible = false;
            for (let attempt = 0; attempt < 3; attempt++) {
                isVisible = await genderDropdown.isVisible({ timeout: 3000 }).catch(() => false);
                if (isVisible) break;
                
                // If not visible, scroll more
                await this.page.keyboard.press('PageDown').catch(() => {});
                await this.page.waitForTimeout(200);
            }
            
            if (!isVisible) {
                throw new Error("Gender dropdown not found or not visible after scrolling");
            }
            
            // Scroll into view if needed
            await genderDropdown.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(200);
            
            // Use the common selection helper to select the option
            await this._selectFromResolvedDropdownElement(genderDropdown, "Gender", optionValue);
            
            // Wait for dropdown to close after selection
            await this.page.waitForTimeout(500);
            
            // Ensure dropdown is closed (press Escape if still open)
            const listbox = this.page.locator("[role='listbox']").first();
            const isListboxVisible = await listbox.isVisible({ timeout: 1000 }).catch(() => false);
            if (isListboxVisible) {
                await this.page.keyboard.press("Escape");
                await this.page.waitForTimeout(200);
            }
            
            // Verify we're still on the Add Employee form page
            const addNewEmployeeTitle = this.page.getByText("Add New Employee", { exact: false }).first();
            const isTitleVisible = await addNewEmployeeTitle.isVisible({ timeout: 3000 }).catch(() => false);
            if (!isTitleVisible) {
                throw new Error("Add New Employee form page closed after selecting Gender option. Form may have been submitted or navigated away.");
            }
            
            // Wait a bit for the selection to update
            await this.page.waitForTimeout(300);
            
            // Verify the selected value
            const selectedValue = await this.getSelectedGenderValue();
            
            // Check if the selected value contains the option (case-insensitive)
            if (!selectedValue.toLowerCase().includes(optionValue.toLowerCase())) {
                throw new Error(`Selected Gender value "${selectedValue}" does not match expected "${optionValue}"`);
            }
            
            console.log(`✓ Verified Gender selection: "${optionValue}" is displayed as "${selectedValue}"`);
            return true;
        } catch (e) {
            console.error(`Error selecting and verifying Gender option "${optionValue}": ${e.message}`);
            throw e;
        }
    }

    // Close Gender dropdown (safely, without closing the form)
    async closeGenderDropdown() {
        try {
            // Check if dropdown is actually open first
            const listbox = this.page.locator("[role='listbox']").first();
            const isVisible = await listbox.isVisible({ timeout: 1000 }).catch(() => false);
            
            if (isVisible) {
                // Only close if dropdown is actually open
                // Try pressing Escape to close dropdown (safer than clicking outside)
                await this.page.keyboard.press("Escape");
                await this.page.waitForTimeout(200);
                
                // Verify dropdown is closed
                const stillVisible = await listbox.isVisible({ timeout: 1000 }).catch(() => false);
                if (stillVisible) {
                    // If Escape didn't work, try clicking on the Gender dropdown button itself to close it
                    const genderDropdown = this.page.getByLabel("Gender", { exact: false }).first();
                    const dropdownVisible = await genderDropdown.isVisible({ timeout: 1000 }).catch(() => false);
                    if (dropdownVisible) {
                        await genderDropdown.click();
                        await this.page.waitForTimeout(200);
                    }
                }
            }
            // If dropdown is already closed, do nothing (don't click outside which might close the form)
        } catch (e) {
            // Ignore errors when closing dropdown
            console.log(`Note: Error closing Gender dropdown: ${e.message}`);
        }
    }

    // Dedicated helper for Contractor dropdown (button#contractorId)
    async selectContractor(optionValue) {
        try {
            if (this.page.isClosed()) {
                throw new Error('Cannot select Contractor because the page/context is already closed.');
            }
            await expect(this.employeeForm).toBeVisible({ timeout: 10000 });

            // Prefer the accessible combobox (Radix/shadcn uses role="combobox" on a button)
            const comboboxByRole = this.employeeForm.getByRole('combobox', { name: /Contractor/i }).first();
            const byIdFallback = this.employeeForm.locator("//button[@id='contractorId']").first();

            let dropdownElement = comboboxByRole;
            const roleCount = await comboboxByRole.count().catch(() => 0);
            if (roleCount === 0) {
                const idCount = await byIdFallback.count().catch(() => 0);
                if (idCount === 0) {
                    throw new Error('Contractor combobox not found (by role name or #contractorId).');
                }
                dropdownElement = byIdFallback;
            }

            await dropdownElement.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(200).catch(() => {});

            await this._selectFromResolvedDropdownElement(dropdownElement, "Contractor", optionValue);
        } catch (e) {
            console.error(`Error selecting Contractor: ${e.message}`);
            throw e;
        }
    }

    // Fill textarea field by label
    async fillTextareaByLabel(labelText, value) {
        try {
            const textarea = await this.findInputByLabel(labelText);
            await expect(textarea).toBeVisible({ timeout: 5000 });
            // Scroll textarea into view before interacting
            await textarea.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(200);
            await textarea.clear();
            await textarea.fill(value);
            await this.page.waitForTimeout(300);
            console.log(`Filled ${labelText}: ${value}`);
        } catch (e) {
            console.error(`Error filling ${labelText}: ${e.message}`);
            throw e;
        }
    }

    // Fill all employee form fields from test data
    async fillEmployeeForm(testData) {
        await this.page.waitForLoadState("networkidle");
        await expect(this.employeeForm).toBeVisible({ timeout: 10000 });

        // Fill text fields
        if (testData.firstName) await this.fillFieldByLabel("First Name", testData.firstName);
        if (testData.middleName) await this.fillFieldByLabel("Middle Name", testData.middleName);
        if (testData.lastName) await this.fillFieldByLabel("Last Name", testData.lastName);
        if (testData.officialEmail) await this.fillFieldByLabel("Official Email", testData.officialEmail);
        if (testData.department) await this.fillFieldByLabel("Department", testData.department);
        if (testData.subDepartment) await this.fillFieldByLabel("Sub Department", testData.subDepartment);
        if (testData.designation) await this.fillFieldByLabel("Designation", testData.designation);
        if (testData.primaryPhone) await this.fillFieldByLabel("Primary Phone", testData.primaryPhone);
        if (testData.dateOfJoining) await this.fillDateFieldByLabel("Date of Joining", testData.dateOfJoining);
        if (testData.dateOfBirth) await this.fillDateFieldByLabel("Date of Birth", testData.dateOfBirth);
        if (testData.gender) await this.selectDropdownByLabel("Gender", testData.gender);
        if (testData.maritalStatus) await this.selectMaritalStatus(testData.maritalStatus);
        if (testData.aadharCardNumber) await this.fillFieldByLabel("Aadhar Card Number", testData.aadharCardNumber);
        if (testData.contractor) await this.selectContractor(testData.contractor);
        
        if (testData.monthlySalary) await this.fillFieldByLabel("Monthly Salary", testData.monthlySalary);
        if (testData.qualification) await this.fillFieldByLabel("Qualification", testData.qualification);
        if (testData.previousExperience) await this.fillTextareaByLabel("Previous Experience", testData.previousExperience);
        if (testData.interviewBy) await this.fillFieldByLabel("Interview By", testData.interviewBy);
        if (testData.dateOfInterview) await this.fillDateFieldByLabel("Date Of Interview", testData.dateOfInterview);
        if (testData.interviewRemark) await this.fillTextareaByLabel("Interview Remark", testData.interviewRemark);
        if (testData.headOfFunction) await this.fillFieldByLabel("Head of Function", testData.headOfFunction);
        if (testData.notes) await this.fillTextareaByLabel("Notes", testData.notes);
        console.log("All employee form fields filled successfully");
    }

    // Fill all employee form fields except First Name from test data
    async fillAllFieldsExceptFirstName(testData) {
        await this.page.waitForLoadState("networkidle");
        await expect(this.employeeForm).toBeVisible({ timeout: 10000 });

        // Fill text fields (skip First Name)
        if (testData.middleName) await this.fillFieldByLabel("Middle Name", testData.middleName);
        if (testData.lastName) await this.fillFieldByLabel("Last Name", testData.lastName);
        if (testData.officialEmail) await this.fillFieldByLabel("Official Email", testData.officialEmail);
        if (testData.department) await this.fillFieldByLabel("Department", testData.department);
        if (testData.subDepartment) await this.fillFieldByLabel("Sub Department", testData.subDepartment);
        if (testData.designation) await this.fillFieldByLabel("Designation", testData.designation);
        if (testData.primaryPhone) await this.fillFieldByLabel("Primary Phone", testData.primaryPhone);
        if (testData.dateOfJoining) await this.fillDateFieldByLabel("Date of Joining", testData.dateOfJoining);
        if (testData.dateOfBirth) await this.fillDateFieldByLabel("Date of Birth", testData.dateOfBirth);
        if (testData.gender) await this.selectDropdownByLabel("Gender", testData.gender);
        if (testData.maritalStatus) await this.selectMaritalStatus(testData.maritalStatus);
        if (testData.aadharCardNumber) await this.fillFieldByLabel("Aadhar Card Number", testData.aadharCardNumber);
        if (testData.contractor) await this.selectDropdownByLabel("Contractor", testData.contractor);
        if (testData.monthlySalary) await this.fillFieldByLabel("Monthly Salary", testData.monthlySalary);
        if (testData.qualification) await this.fillFieldByLabel("Qualification", testData.qualification);
        if (testData.previousExperience) await this.fillTextareaByLabel("Previous Experience", testData.previousExperience);
        if (testData.interviewBy) await this.fillFieldByLabel("Interview By", testData.interviewBy);
        if (testData.dateOfInterview) await this.fillDateFieldByLabel("Date Of Interview", testData.dateOfInterview);
        if (testData.interviewRemark) await this.fillTextareaByLabel("Interview Remark", testData.interviewRemark);
        if (testData.headOfFunction) await this.fillFieldByLabel("Head of Function", testData.headOfFunction);
        if (testData.notes) await this.fillTextareaByLabel("Notes", testData.notes);
        console.log("All employee form fields filled successfully (except First Name)");
    }


    // Fill all employee form fields except Department from test data
    async fillAllFieldsExceptDepartment(testData) {
        await this.page.waitForLoadState("networkidle");
        await expect(this.employeeForm).toBeVisible({ timeout: 10000 });

        // Fill text fields (skip Department)
        if (testData.firstName) await this.fillFieldByLabel("First Name", testData.firstName);
        if (testData.middleName) await this.fillFieldByLabel("Middle Name", testData.middleName);
        if (testData.lastName) await this.fillFieldByLabel("Last Name", testData.lastName);
        if (testData.officialEmail) await this.fillFieldByLabel("Official Email", testData.officialEmail);
        if (testData.subDepartment) await this.fillFieldByLabel("Sub Department", testData.subDepartment);
        if (testData.designation) await this.fillFieldByLabel("Designation", testData.designation);
        if (testData.primaryPhone) await this.fillFieldByLabel("Primary Phone", testData.primaryPhone);
        if (testData.dateOfJoining) await this.fillDateFieldByLabel("Date of Joining", testData.dateOfJoining);
        if (testData.dateOfBirth) await this.fillDateFieldByLabel("Date of Birth", testData.dateOfBirth);
        if (testData.gender) await this.selectDropdownByLabel("Gender", testData.gender);
        if (testData.maritalStatus) await this.selectMaritalStatus(testData.maritalStatus);
        if (testData.aadharCardNumber) await this.fillFieldByLabel("Aadhar Card Number", testData.aadharCardNumber);
        if (testData.contractor) await this.selectDropdownByLabel("Contractor", testData.contractor);
        if (testData.monthlySalary) await this.fillFieldByLabel("Monthly Salary", testData.monthlySalary);
        if (testData.qualification) await this.fillFieldByLabel("Qualification", testData.qualification);
        if (testData.previousExperience) await this.fillTextareaByLabel("Previous Experience", testData.previousExperience);
        if (testData.interviewBy) await this.fillFieldByLabel("Interview By", testData.interviewBy);
        if (testData.dateOfInterview) await this.fillDateFieldByLabel("Date Of Interview", testData.dateOfInterview);
        if (testData.interviewRemark) await this.fillTextareaByLabel("Interview Remark", testData.interviewRemark);
        if (testData.headOfFunction) await this.fillFieldByLabel("Head of Function", testData.headOfFunction);
        if (testData.notes) await this.fillTextareaByLabel("Notes", testData.notes);
        console.log("All employee form fields filled successfully (except Department)");
    }

    // Fill all employee form fields except Designation from test data
    async fillAllFieldsExceptDesignation(testData) {
        await this.page.waitForLoadState("networkidle");
        await expect(this.employeeForm).toBeVisible({ timeout: 10000 });

        // Fill text fields (skip Designation)
        if (testData.firstName) await this.fillFieldByLabel("First Name", testData.firstName);
        if (testData.middleName) await this.fillFieldByLabel("Middle Name", testData.middleName);
        if (testData.lastName) await this.fillFieldByLabel("Last Name", testData.lastName);
        if (testData.officialEmail) await this.fillFieldByLabel("Official Email", testData.officialEmail);
        if (testData.department) await this.fillFieldByLabel("Department", testData.department);
        if (testData.subDepartment) await this.fillFieldByLabel("Sub Department", testData.subDepartment);
        if (testData.primaryPhone) await this.fillFieldByLabel("Primary Phone", testData.primaryPhone);
        if (testData.dateOfJoining) await this.fillDateFieldByLabel("Date of Joining", testData.dateOfJoining);
        if (testData.dateOfBirth) await this.fillDateFieldByLabel("Date of Birth", testData.dateOfBirth);
        if (testData.gender) await this.selectDropdownByLabel("Gender", testData.gender);
        if (testData.maritalStatus) await this.selectMaritalStatus(testData.maritalStatus);
        if (testData.aadharCardNumber) await this.fillFieldByLabel("Aadhar Card Number", testData.aadharCardNumber);
        if (testData.contractor) await this.selectDropdownByLabel("Contractor", testData.contractor);
        if (testData.monthlySalary) await this.fillFieldByLabel("Monthly Salary", testData.monthlySalary);
        if (testData.qualification) await this.fillFieldByLabel("Qualification", testData.qualification);
        if (testData.previousExperience) await this.fillTextareaByLabel("Previous Experience", testData.previousExperience);
        if (testData.interviewBy) await this.fillFieldByLabel("Interview By", testData.interviewBy);
        if (testData.dateOfInterview) await this.fillDateFieldByLabel("Date Of Interview", testData.dateOfInterview);
        if (testData.interviewRemark) await this.fillTextareaByLabel("Interview Remark", testData.interviewRemark);
        if (testData.headOfFunction) await this.fillFieldByLabel("Head of Function", testData.headOfFunction);
        if (testData.notes) await this.fillTextareaByLabel("Notes", testData.notes);
        console.log("All employee form fields filled successfully (except Designation)");
    }

    // Fill all employee form fields except Date of Joining from test data
    async fillAllFieldsExceptDateOfJoining(testData) {
        await this.page.waitForLoadState("networkidle");
        await expect(this.employeeForm).toBeVisible({ timeout: 10000 });

        // Fill text fields (skip Date of Joining)
        if (testData.firstName) await this.fillFieldByLabel("First Name", testData.firstName);
        if (testData.middleName) await this.fillFieldByLabel("Middle Name", testData.middleName);
        if (testData.lastName) await this.fillFieldByLabel("Last Name", testData.lastName);
        if (testData.officialEmail) await this.fillFieldByLabel("Official Email", testData.officialEmail);
        if (testData.department) await this.fillFieldByLabel("Department", testData.department);
        if (testData.subDepartment) await this.fillFieldByLabel("Sub Department", testData.subDepartment);
        if (testData.designation) await this.fillFieldByLabel("Designation", testData.designation);
        if (testData.primaryPhone) await this.fillFieldByLabel("Primary Phone", testData.primaryPhone);
        if (testData.dateOfBirth) await this.fillDateFieldByLabel("Date of Birth", testData.dateOfBirth);
        if (testData.gender) await this.selectDropdownByLabel("Gender", testData.gender);
        if (testData.maritalStatus) await this.selectDropdownByLabel("Marital Status", testData.maritalStatus);
        if (testData.aadharCardNumber) await this.fillFieldByLabel("Aadhar Card Number", testData.aadharCardNumber);
        if (testData.contractor) await this.selectDropdownByLabel("Contractor", testData.contractor);
        if (testData.monthlySalary) await this.fillFieldByLabel("Monthly Salary", testData.monthlySalary);
        if (testData.qualification) await this.fillFieldByLabel("Qualification", testData.qualification);
        if (testData.previousExperience) await this.fillTextareaByLabel("Previous Experience", testData.previousExperience);
        if (testData.interviewBy) await this.fillFieldByLabel("Interview By", testData.interviewBy);
        if (testData.dateOfInterview) await this.fillDateFieldByLabel("Date Of Interview", testData.dateOfInterview);
        if (testData.interviewRemark) await this.fillTextareaByLabel("Interview Remark", testData.interviewRemark);
        if (testData.headOfFunction) await this.fillFieldByLabel("Head of Function", testData.headOfFunction);
        if (testData.notes) await this.fillTextareaByLabel("Notes", testData.notes);
        console.log("All employee form fields filled successfully (except Date of Joining)");
    }

    // Fill all employee form fields except Contractor from test data
    async fillAllFieldsExceptContractor(testData) {
        await this.page.waitForLoadState("networkidle");
        await expect(this.employeeForm).toBeVisible({ timeout: 10000 });

        // Fill text fields (skip Contractor)
        if (testData.firstName) await this.fillFieldByLabel("First Name", testData.firstName);
        if (testData.middleName) await this.fillFieldByLabel("Middle Name", testData.middleName);
        if (testData.lastName) await this.fillFieldByLabel("Last Name", testData.lastName);
        if (testData.officialEmail) await this.fillFieldByLabel("Official Email", testData.officialEmail);
        if (testData.department) await this.fillFieldByLabel("Department", testData.department);
        if (testData.subDepartment) await this.fillFieldByLabel("Sub Department", testData.subDepartment);
        if (testData.designation) await this.fillFieldByLabel("Designation", testData.designation);
        if (testData.primaryPhone) await this.fillFieldByLabel("Primary Phone", testData.primaryPhone);
        if (testData.dateOfJoining) await this.fillDateFieldByLabel("Date of Joining", testData.dateOfJoining);
        if (testData.dateOfBirth) await this.fillDateFieldByLabel("Date of Birth", testData.dateOfBirth);
        if (testData.gender) await this.selectDropdownByLabel("Gender", testData.gender);
        if (testData.maritalStatus) await this.selectDropdownByLabel("Marital Status", testData.maritalStatus);
        if (testData.aadharCardNumber) await this.fillFieldByLabel("Aadhar Card Number", testData.aadharCardNumber);
        if (testData.monthlySalary) await this.fillFieldByLabel("Monthly Salary", testData.monthlySalary);
        if (testData.qualification) await this.fillFieldByLabel("Qualification", testData.qualification);
        if (testData.previousExperience) await this.fillTextareaByLabel("Previous Experience", testData.previousExperience);
        if (testData.interviewBy) await this.fillFieldByLabel("Interview By", testData.interviewBy);
        if (testData.dateOfInterview) await this.fillDateFieldByLabel("Date Of Interview", testData.dateOfInterview);
        if (testData.interviewRemark) await this.fillTextareaByLabel("Interview Remark", testData.interviewRemark);
        if (testData.headOfFunction) await this.fillFieldByLabel("Head of Function", testData.headOfFunction);
        if (testData.notes) await this.fillTextareaByLabel("Notes", testData.notes);
        console.log("All employee form fields filled successfully (except Contractor)");
    }



    // Fill all employee form fields with less than 12 digits in Aadhaar
    async fillAllFieldsWithLessThan12DigitsInAadhaar(testData) {
        await this.page.waitForLoadState("networkidle");
        await expect(this.employeeForm).toBeVisible({ timeout: 10000 });

        
        if (testData.firstName) await this.fillFieldByLabel("First Name", testData.firstName);
        if (testData.middleName) await this.fillFieldByLabel("Middle Name", testData.middleName);
        if (testData.lastName) await this.fillFieldByLabel("Last Name", testData.lastName);
        if (testData.officialEmail) await this.fillFieldByLabel("Official Email", testData.officialEmail);
        if (testData.department) await this.fillFieldByLabel("Department", testData.department);
        if (testData.subDepartment) await this.fillFieldByLabel("Sub Department", testData.subDepartment);
        if (testData.designation) await this.fillFieldByLabel("Designation", testData.designation);
        if (testData.primaryPhone) await this.fillFieldByLabel("Primary Phone", testData.primaryPhone);
        if (testData.dateOfJoining) await this.fillDateFieldByLabel("Date of Joining", testData.dateOfJoining);
        if (testData.dateOfBirth) await this.fillDateFieldByLabel("Date of Birth", testData.dateOfBirth);
        if (testData.gender) await this.selectDropdownByLabel("Gender", testData.gender);
        if (testData.maritalStatus) await this.selectDropdownByLabel("Marital Status", testData.maritalStatus);
        if (testData.aadharCardNumber) await this.fillFieldByLabel("Aadhar Card Number", testData.aadharCardNumber);
        console.log("All employee form fields filled successfully (with less than 12 digits in Aadhaar)");
    }



















    // Click Cancel button and verify navigation back to Employees list page
    async clickCancelAndVerifyNavigation() {
        await expect(this.cancelButton).toBeVisible({ timeout: 10000 });
        await expect(this.cancelButton).toBeEnabled();
        await this.cancelButton.click();
        await this.page.waitForLoadState("networkidle");
        console.log("Clicked Cancel button");

        // Verify navigation back to Employees list page
        await this.verifyOnEmployeesPage();
        console.log("Verified navigation back to Employees list page");
    }

    // Click Add Employee button and wait for the form/dialog to actually close
    async clickAddEmployeeButtonFromFormPage() {
        await expect(this.addEmployeeSubmitButton).toBeVisible({ timeout: 10000 });
        await expect(this.addEmployeeSubmitButton).toBeEnabled();
        await this.addEmployeeSubmitButton.click();

        // Wait for any open Radix dialog/modal to close before proceeding,
        // so subsequent actions don't hit the overlay (z-50 bg-black/80) intercepting clicks.
        const openDialog = this.page.locator('[role="dialog"][data-state="open"]');
        await expect(openDialog).toHaveCount(0, { timeout: 15000 });

        await this.page.waitForLoadState("networkidle");
        console.log("Clicked Add Employee button and form closed");
    }

    // Generic search using the Employees list search input
    async searchEmployee(searchText) {
        await expect(this.searchInput).toBeVisible({ timeout: 10000 });
        await this.searchInput.click();
        await this.searchInput.fill(""); // clear any existing text
        await this.searchInput.fill(searchText);
        console.log(`Entered search text in employee search input: "${searchText}"`);

        // Wait briefly for the list to refresh/filter
        await this.page.waitForTimeout(1000);
        await this.page.waitForLoadState("networkidle");
    }

    // Helper: search by employee name
    async searchEmployeeByName(employeeName) {
        await this.searchEmployee(employeeName);
    }

    // Verify that an employee with given name is NOT present in the list
    async verifyEmployeeNotPresentByName(employeeName) {
        await this.searchEmployeeByName(employeeName);

        const matchingRows = this.employeeRows.filter({ hasText: employeeName });
        const rowCount = await matchingRows.count();

        console.log(`Employee rows found for "${employeeName}": ${rowCount}`);

        // If any matching rows exist and are visible, fail the test
        for (let i = 0; i < rowCount; i++) {
            const row = matchingRows.nth(i);
            const isVisible = await row.isVisible({ timeout: 2000 }).catch(() => false);
            if (isVisible) {
                const rowText = ((await row.textContent()) || "").trim();
                throw new Error(
                    `Employee "${employeeName}" is still visible in list after Cancel. Row text: "${rowText}"`
                );
            }
        }

        console.log(`Verified that employee "${employeeName}" is NOT present in Employees list page`);
    }

    // Click delete icon/button for a specific employee row in list
    async clickDeleteIconForEmployee(employeeName) {
        await this.searchEmployeeByName(employeeName);
        await this.page.waitForTimeout(500);

        // Locate the target row by text
        const targetRow = this.employeeRows.filter({ hasText: employeeName }).first();
        await expect(targetRow).toBeVisible({ timeout: 10000 });

        // Try robust delete button selectors within the row
        const deleteButtonCandidates = [
            targetRow.getByRole("button", { name: /delete/i }).first(),
            targetRow.locator("//button[contains(@aria-label, 'delete') or contains(@aria-label, 'Delete')]").first(),
            targetRow.locator("//button[contains(@class, 'delete')]").first(),
            // Fallback: action buttons often have multiple icons; delete is typically the last action
            targetRow.locator("//button").last()
        ];

        let clicked = false;
        for (const btn of deleteButtonCandidates) {
            try {
                const count = await btn.count();
                if (count > 0) {
                    const visible = await btn.isVisible({ timeout: 1500 }).catch(() => false);
                    if (visible) {
                        await btn.click({ timeout: 4000 });
                        clicked = true;
                        console.log(`Clicked delete icon for employee "${employeeName}"`);
                        break;
                    }
                }
            } catch {
                continue;
            }
        }

        if (!clicked) {
            throw new Error(`Could not find/click delete icon for employee "${employeeName}"`);
        }
    }


    // Verify column headers in the employees table
    async verifyEmployeesListColumnHeaders(expectedHeaders) {
        // Wait for table to be visible
        await expect(this.employeesTable).toBeVisible({ timeout: 10000 });

        // Get all table header elements - try multiple selectors for different table structures
        const headerSelectors = [
            this.employeesTable.locator("//thead//th"),
            this.employeesTable.locator("//th"),
            this.employeesTable.locator("//*[@role='columnheader']"),
            this.employeesTable.locator("//thead//tr//th"),
            this.page.locator("//table//thead//th"),
            this.page.locator("//*[@role='table']//*[@role='columnheader']")
        ];

        let headers = [];
        let headersFound = false;

        // Try to find headers using different selectors
        for (const selector of headerSelectors) {
            try {
                const count = await selector.count();
                if (count > 0) {
                    // Get all header texts
                    for (let i = 0; i < count; i++) {
                        const headerText = await selector.nth(i).textContent();
                        if (headerText && headerText.trim()) {
                            headers.push(headerText.trim());
                        }
                    }
                    if (headers.length > 0) {
                        headersFound = true;
                        break;
                    }
                }
            } catch (e) {
                continue;
            }
        }

        if (!headersFound || headers.length === 0) {
            throw new Error("Could not find employees table headers. Table structure may have changed.");
        }

        console.log(`Employees table headers found: ${headers.join(", ")}`);

        // Verify each expected header is present (case-insensitive, tolerant of minor text differences)
        const missingHeaders = [];
        for (const expectedHeader of expectedHeaders) {
            const expectedLower = expectedHeader.toLowerCase();
            const found = headers.some(header => {
                const headerLower = header.toLowerCase();
                return (
                    headerLower.includes(expectedLower) ||
                    expectedLower.includes(headerLower)
                );
            });
            if (!found) {
                missingHeaders.push(expectedHeader);
            }
        }

        if (missingHeaders.length > 0) {
            throw new Error(`Missing employees table column headers: ${missingHeaders.join(", ")}. Found headers: ${headers.join(", ")}`);
        }

        console.log(`Verified all employees table column headers are present: ${expectedHeaders.join(", ")}`);
        return true;
    }






    // Confirm delete and verify employee no longer appears in list
    async verifyEmployeeDeletedSuccessfully(employeeName) {
        // This app's confirmation modal uses a red "Remove" button.
        // If we don't click it, the overlay stays up and blocks list interactions.
        const overlay = this.page.locator("div.fixed.inset-0").first();

        const removeCandidates = [
            this.page.getByRole("button", { name: /^Remove$/i }).first(),
            this.page.locator("//button[normalize-space()='Remove']").first(),
            this.page.locator("//div[contains(@role,'dialog') or contains(@class,'modal')]//button[contains(., 'Remove')]").first(),
            // More specific fallback for the red button style
            this.page.locator("//button[contains(@class,'bg-red') and normalize-space()='Remove']").first()
        ];

        let removed = false;
        for (const btn of removeCandidates) {
            try {
                const count = await btn.count().catch(() => 0);
                if (count > 0) {
                    const visible = await btn.isVisible({ timeout: 2000 }).catch(() => false);
                    if (visible) {
                        await btn.click({ timeout: 5000 });
                        removed = true;
                        break;
                    }
                }
            } catch {
                continue;
            }
        }

        if (!removed) {
            throw new Error(`Could not find/press "Remove" in delete confirmation modal for employee "${employeeName}".`);
        }

        // Wait for overlay/modal to disappear so the search input becomes clickable
        try {
            await overlay.waitFor({ state: "hidden", timeout: 10000 });
        } catch (e) {
            // Fallback: wait a bit for UI state to settle
            await this.page.waitForTimeout(1000).catch(() => {});
        }

        await this.page.waitForLoadState("networkidle").catch(() => {});
        await this.page.waitForTimeout(500);

        // Re-search and verify employee row is not visible anymore
        await this.searchEmployeeByName(employeeName);
        const matchingRows = this.employeeRows.filter({ hasText: employeeName });
        const rowCount = await matchingRows.count();

        for (let i = 0; i < rowCount; i++) {
            const row = matchingRows.nth(i);
            const isVisible = await row.isVisible({ timeout: 1000 }).catch(() => false);
            if (isVisible) {
                const rowText = ((await row.textContent()) || "").trim();
                throw new Error(`Employee "${employeeName}" is still visible after delete. Row text: "${rowText}"`);
            }
        }

        console.log(`Verified employee "${employeeName}" is deleted successfully`);
    }
}

module.exports = { EmployeesPage };

