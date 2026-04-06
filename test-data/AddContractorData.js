const addContractorTestData = {
    validationErrors: {
        contractorName: {
            fieldName: "Contractor Name",
            errorMessage: "Contractor name is required."
        },
        gstNumber: {
            fieldName: "GST Number",
            errorMessage: "GST number is required."
        },
        contractorAgreement: {
            fieldName: "Contractor Agreement",
            errorMessage: "Contractor Agreement is required."
        }
    },
    
    mandatoryFields: [
        {
            fieldName: "Contractor Name",
            errorMessage: "Contractor name is required."
        },
        {
            fieldName: "GST Number",
            errorMessage: "GST number is required."
        },
        {
            fieldName: "Contractor Agreement",
            errorMessage: "Contractor Agreement is required."
        }
    ],
    
    fileUpload: {
        contractorAgreementFilePath: "E:\\Abenka Projects stuffs\\Aryan VMS\\Fiels to upload\\Contract Basic Details.docx",
        expectedFileName: "Contract Basic Details.docx"
    },
    
    contractorNameValidationTest: {
        // Contractor Name is intentionally left blank
        contractorName: "",
        agreementValidFrom: "02-02-2026",
        agreementValidTo: "28-02-2026",
        gstNumber: "27WESDVFRTGBHYJ",
        panNumber: "CAQWS1111W",
        status: "Active",
        contractorAgreementFilePath: "E:\\Abenka Projects stuffs\\Aryan VMS\\Fiels to upload\\Contract Basic Details.docx",
        contactPerson: "Rakesh Singh",
        contactPhone: "1212345611",
        contactEmail: "rs@example.com",
        addressLine1: "Wakad",
        addressLine2: "",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411056",
        notes: "Added new contractor",
        expectedErrorMessage: "Contractor name is required."
    },

    DateValidationValidationTest: {
        // Date Validation error message
        contractorName: "Sai Pumps",
        agreementValidFrom: "28-03-2026",
        agreementValidTo: "11-02-2026",
        gstNumber: "27WESDVFRTGBHYJ",
        panNumber: "CAQWS1111W",
        status: "Active",
        contractorAgreementFilePath: "E:\\Abenka Projects stuffs\\Aryan VMS\\Fiels to upload\\Contract Basic Details.docx",
        contactPerson: "Rakesh Singh",
        contactPhone: "1212345611",
        contactEmail: "rs@example.com",
        addressLine1: "Wakad",
        addressLine2: "",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411056",
        notes: "Added new contractor",
        expectedErrorMessage: "Agreement Valid To cannot be earlier than Agreement Valid From."
    },

    GSTNumberValidationTest: {
        // GST Number Validation error message
        contractorName: "Sai Pumps",
        agreementValidFrom: "28-02-2026",
        agreementValidTo: "11-03-2026",
        gstNumber: "",
        panNumber: "CAQWS1111W",
        status: "Active",
        contractorAgreementFilePath: "E:\\Abenka Projects stuffs\\Aryan VMS\\Fiels to upload\\Contract Basic Details.docx",
        contactPerson: "Rakesh Singh",
        contactPhone: "1212345611",
        contactEmail: "rs@example.com",
        addressLine1: "Wakad",
        addressLine2: "",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411056",
        notes: "Added new contractor",
        expectedErrorMessage: "GST number is required."
    },

    GSTNumberValidationLessThan15DigitsTest: {
        // GST Number Validation error message when GST Number is less than 15 digits
        contractorName: "Sai Pumps",
        agreementValidFrom: "28-02-2026",
        agreementValidTo: "11-03-2026",
        gstNumber: "23WES",
        panNumber: "CAQWS1111W",
        status: "Active",
        contractorAgreementFilePath: "E:\\Abenka Projects stuffs\\Aryan VMS\\Fiels to upload\\Contract Basic Details.docx",
        contactPerson: "Rakesh Singh",
        contactPhone: "1212345611",
        contactEmail: "rs@example.com",
        addressLine1: "Wakad",
        addressLine2: "",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411056",
        notes: "Added new contractor",
        expectedErrorMessage: "GST must be 15 alphanumeric characters."
    },

    AgreementValidationTest: {
        // Agreement Validation error message when Agreement is not uploaded
        contractorName: "Sai Pumps",
        agreementValidFrom: "28-02-2026",
        agreementValidTo: "11-03-2026",
        gstNumber: "27WESDVFRTGBHYJ",
        panNumber: "CAQWS1111W",
        status: "Active",
        expectedErrorMessage: "Contractor Agreement is required."
    },

    ErrorValidationForInvalidPANNumber: {
        // Error Validation for Invalid PAN Number
        contractorName: "Sai Pumps",
        agreementValidFrom: "28-02-2026",
        agreementValidTo: "11-03-2026",
        gstNumber: "27WESDVFRTGBHYJ",
        panNumber: "12QW34567Y",
        status: "Active",
        expectedErrorMessage: "PAN must match AAAAA9999A."
    },

    ErrorValidationForLessThan10DigitsPhoneNumber: {
        // Error Validation for Less Than 10 Digits Phone Number
        contractorName: "Sai Pumps",
        gstNumber: "27WESDVFRTGBHYJ",
        status: "Active",
        contactPhone: "121234",
        expectedErrorMessage: "Phone must be 10-15 digits."
    },
    
    ErrorValidationForMoreThan15DigitsPhoneNumber: {
        // Error Validation for More Than 15 Digits Phone Number
        contractorName: "Sai Pumps",
        gstNumber: "27WESDVFRTGBHYJ",
        status: "Active",
        contactPhone: "12123456789012345",
        expectedErrorMessage: "Phone must be 10-15 digits."
    },
    
    ErrorValidationForInvalidEmailFormat: {
        // Error Validation for Invalid Email Format
        contractorName: "Sai Pumps",
        gstNumber: "27WESDVFRTGBHYJ",
        status: "Active",
        contactEmail: "rs@com",
        expectedErrorMessage: "Enter a valid email address."
    },
    
    ErrorValidationForInvalidPincodeLessThan6Digits: {
        // Error Validation for Invalid Pincode Less Than 6 Digits
        contractorName: "Sai Pumps",
        gstNumber: "27WESDVFRTGBHYJ",
        status: "Active",
        pincode: "1345",
        expectedErrorMessage: "Pincode must be 6 digits."
    },

    // Document Type dropdown options for Other Documents (Optional)
    documentTypeOptions: [
        "MSME Certificate",
        "GST Certificate",
        "PAN Card",
        "PF Registration",
        "ESIC Registration",
        "PT Registration",
        "MLWF Registration",
        "Workmen Compensation / Insurance Policy",
        "Other"
    ],

    // Contractor list page - table column headers
    contractorListPage: {
        columnHeaders: [
            "Contractor Name",
            "Contractor ID",
            "Agreement valid from",
            "Agreement valid to",
            "Contact Person",
            "Contact phone",
            "Status",
            "Projects",
            "Action"
        ],

        // Status filter dropdown on Contractors list page
        statusFilter: {
            defaultValue: "All",
            options: [
                "All",
                "Initiated",
                "Review",
                "Document Pending",
                "Approved by HR",
                "Approved by Plant Head",
                "Active",
                "Inactive",
                "Blacklisted",
                "Rejected"
            ]
        },

        // Agreement valid from filter test data on Contractors list page
        agreementValidFromFilter: {
            // UI filter date format as displayed in filter control
            filterDate: "02/02/2026"
        },

        // Agreement valid to filter test data on Contractors list page
        agreementValidToFilter: {
            // UI filter date format as displayed in filter control
            filterDate: "04/30/2026"
        }
    },

    // Test data for adding a new contractor with all fields
    addNewContractorWithAllFields: {
        contractorId: "REG-011",
        contractorName: "SAI PUMPS SOLUTIONS",
        agreementValidFrom: "02-02-2026",
        agreementValidTo: "30-04-2026",
        gstNumber: "27WESDVFRTGBHYJ",
        panNumber: "CAQWS1111W",
        status: "Active",
        contractorAgreementFilePath: "E:\\Abenka Projects stuffs\\Aryan VMS\\Fiels to upload\\Contract Basic Details.docx",
        contractorAgreementFileName: "Contract Basic Details.docx",
        // Other Documents
        documentType: "MSME Certificate",
        otherDocumentFilePath: "E:\\Abenka Projects stuffs\\Aryan VMS\\Fiels to upload\\Dummy_MSME_Certificate.pdf",
        otherDocumentFileName: "Dummy_MSME_Certificate.pdf",
        // Contact Information
        contactPerson: "Rakesh Singh",
        contactPhone: "1212345611",
        contactEmail: "rs@example.com",
        // Address
        addressLine1: "Wakad",
        addressLine2: "",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411056",
        // Notes
        notes: "Added new contractor SAI PUMPS SOLUTIONS"
    },

    // Test data for updating contractor
    updateContractorData: {
        oldContractorName: "SAI PUMPS SOLUTIONS",
        newContractorName: "New ARY PUMPS",
        oldGSTNumber: "27WESDVFRTGBHYJ",
        newGSTNumber: "34WESDVFRTGBHER",
        oldPANNumber: "CAQWS1111W",
        newPANNumber: "CAQWS1122A",
        notes: "Contractor name changed from SAI PUMPS SOLUTIONS to \"New ARY PUMPS\""
    }
};

module.exports = { addContractorTestData };
