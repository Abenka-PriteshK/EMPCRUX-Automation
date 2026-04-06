const addNewEmployeeTestData = {
    // Labels and (optional) placeholders for Add New Employee form
    formFields: [
        { label: "First Name", placeholder: "e.g., John" },
        { label: "Middle Name", placeholder: "e.g., K" },
        { label: "Last Name", placeholder: "e.g., Doe" },
        // Placeholders below are optional because actual UI text may differ slightly
        { label: "Official Email", placeholder: "e.g., firstname.lastname@company.com", checkPlaceholder: false },
        { label: "Department", placeholder: "e.g., Engineering" },
        { label: "Sub Department", placeholder: "e.g., Backend" },
        { label: "Designation", placeholder: "e.g., Software Engineer" },
        { label: "Primary Phone", placeholder: "e.g., +91 1234 567 890", checkPlaceholder: false },
        { label: "Date of Joining" },
        { label: "Status" },
        { label: "Date of Birth" },
        { label: "Gender", placeholder: "Select gender (optional)", checkPlaceholder: false },
        { label: "Marital status (optional)", placeholder: "Select marital status (optional)", checkLabel: false, checkPlaceholder: false },
        { label: "Aadhar Card Number", placeholder: "e.g., 1234 5678 9012", checkPlaceholder: false },
        { label: "Contractor", placeholder: "Select contractor", checkPlaceholder: false },
        // Documents section
        { label: "Aadhar Card" },
        { label: "Resume" },
        // Compensation & qualification
        { label: "Monthly Salary", placeholder: "e.g., 25000", checkPlaceholder: false },
        { label: "Qualification", placeholder: "e.g., B.Tech, MBA" },
        // Experience and interview
        { label: "Previous Experience", placeholder: "Brief previous work experience..." },
        { label: "Interview By" },
        { label: "Date Of Interview" },
        { label: "Interview Remarks", placeholder: "Interview remarks...", checkLabel: false, checkPlaceholder: false },
        // Reporting & notes
        { label: "Reporting Manager", placeholder: "Select reporting manager", checkPlaceholder: false },
        { label: "Head of Function", placeholder: "e.g., CTO" },
        { label: "Notes", placeholder: "Additional notes about the employee..." }
    ],

    // Test data for filling Add New Employee form and clicking Cancel
    fillFormAndCancelTest: {
        firstName: "Pritam",
        middleName: "Kumar",
        lastName: "Ahuja",
        officialEmail: "pka@exmaple.com",
        department: "Engineering",
        subDepartment: "Testing",
        designation: "QA Manager",
        primaryPhone: "2112344356",
        dateOfJoining: "04-08-2025",
        dateOfBirth: "01-11-1984",
        gender: "Male",
        maritalStatus: "Married",
        aadharCardNumber: "123412341234",
        contractor: "QA Services Ltd",
        monthlySalary: "120000",
        qualification: "B.E",
        previousExperience: "13 years of experience in Testing Field.",
        interviewBy: "HR Manager",
        dateOfInterview: "01-06-2025",
        interviewRemark: "Selected",
        headOfFunction: "Group Manager"
    },

    FirstNameValidationTest: {
        // First Name Validation error message
        firstName: "",
        middleName: "Kumar",
        lastName: "Ahuja",
        officialEmail: "pka@exmaple.com",
        department: "Engineering",
        subDepartment: "Testing",
        designation: "QA Manager",
        primaryPhone: "2112344356",
        dateOfJoining: "04-08-2025",
        dateOfBirth: "01-11-1984",
        gender: "Male",
        maritalStatus: "Married",
        aadharCardNumber: "123412341234",
        contractor: "QA Services Ltd",
        monthlySalary: "120000",
        qualification: "B.E",
        previousExperience: "13 years of experience in Testing Field.",
        interviewBy: "HR Manager",
        dateOfInterview: "01-06-2025",
        interviewRemark: "Selected",
        headOfFunction: "Group Manager",
        expectedErrorMessage: "First name is required."
    },

    DepartmentValidationTest: {
        // Department Validation error message
        firstName: "Pritam",
        middleName: "Kumar",
        lastName: "Ahuja",
        officialEmail: "pka@exmaple.com",
        department: "",
        subDepartment: "Testing",
        designation: "QA Manager",
        primaryPhone: "2112344356",
        dateOfJoining: "04-08-2025",
        dateOfBirth: "01-11-1984",
        gender: "Male",
        maritalStatus: "Married",
        aadharCardNumber: "123412341234",
        contractor: "QA Services Ltd",
        monthlySalary: "120000",
        qualification: "B.E",
        previousExperience: "13 years of experience in Testing Field.",
        interviewBy: "HR Manager",
        dateOfInterview: "01-06-2025",
        interviewRemark: "Selected",
        headOfFunction: "Group Manager",
        expectedErrorMessage: "Department is required."
    },
    
    DesignationValidationTest: {
        // Designation Validation error message
        firstName: "Pritam",
        middleName: "Kumar",
        lastName: "Ahuja",
        officialEmail: "pka@exmaple.com",
        department: "Engineering",
        subDepartment: "Testing",
        designation: "",
        primaryPhone: "2112344356",
        dateOfJoining: "04-08-2025",
        dateOfBirth: "01-11-1984",
        gender: "Male",
        maritalStatus: "Married",
        aadharCardNumber: "123412341234",
        contractor: "QA Services Ltd",
        monthlySalary: "120000",
        qualification: "B.E",
        previousExperience: "13 years of experience in Testing Field.",
        interviewBy: "HR Manager",
        dateOfInterview: "01-06-2025",
        interviewRemark: "Selected",
        headOfFunction: "Group Manager",
        expectedErrorMessage: "Designation is required."
    },

    DateOfJoiningValidationTest: {
        // Date of Joining Validation error message
        firstName: "Pritam",
        middleName: "Kumar",
        lastName: "Ahuja",
        officialEmail: "pka@exmaple.com",
        department: "Engineering",
        subDepartment: "Testing",
        designation: "QA Manager",
        primaryPhone: "2112344356",
        dateOfJoining: "",
        dateOfBirth: "01-11-1984",
        gender: "Male",
        maritalStatus: "Married",
        aadharCardNumber: "123412341234",
        contractor: "QA Services Ltd",
        monthlySalary: "120000",
        qualification: "B.E",
        previousExperience: "13 years of experience in Testing Field.",
        interviewBy: "HR Manager",
        dateOfInterview: "01-06-2025",
        interviewRemark: "Selected",
        headOfFunction: "Group Manager",
        expectedErrorMessage: "Date of joining is required."
    },

    ContractorValidationTest: {
        // Contractor Validation error message
        firstName: "Pritam",
        middleName: "Kumar",
        lastName: "Ahuja",
        officialEmail: "pka@exmaple.com",
        department: "Engineering",
        subDepartment: "Testing",
        designation: "QA Manager",
        primaryPhone: "2112344356",
        dateOfJoining: "04-08-2025",
        dateOfBirth: "01-11-1984",
        gender: "Male",
        maritalStatus: "Married",
        aadharCardNumber: "123412341234",
        contractor: "",
        monthlySalary: "120000",
        qualification: "B.E",
        previousExperience: "13 years of experience in Testing Field.",
        interviewBy: "HR Manager",
        dateOfInterview: "01-06-2025",
        interviewRemark: "Selected",
        headOfFunction: "Group Manager",
        expectedErrorMessage: "Contractor is required."
    },

    AadharValidationTest: {
        // Aadhar Validation error message
        firstName: "Pritam",
        middleName: "Kumar",
        lastName: "Ahuja",
        officialEmail: "pka@exmaple.com",
        department: "Engineering",
        subDepartment: "Testing",
        designation: "QA Manager",
        primaryPhone: "2112344356",
        dateOfJoining: "04-08-2025",
        dateOfBirth: "01-11-1984",
        gender: "Male",
        maritalStatus: "Married",
        aadharCardNumber: "1234",
        expectedErrorMessage: "Aadhaar number must be exactly 12 digits."
    },



    mandatoryFields: [
        {
            fieldName: "First Name",
            errorMessage: "First name is required."
        },
        {
            fieldName: "Department",
            errorMessage: "Department is required."
        },
        {
            fieldName: "Designation",
            errorMessage: "Designation is required."
        },
        {
            fieldName: "Date of Joining",
            errorMessage: "Date of joining is required."
        },
        {
            fieldName: "Contractor",
            errorMessage: "Contractor is required."
        }
    ],

    // Gender dropdown options for verification
    genderOptions: [
        "Male",
        "Female",
        "Other",
        "Prefer not to say"
    ],

    // Marital Status dropdown options for verification
    maritalStatusOptions: [
        "Single",
        "Married",
        "Divorced",
        "Widowed"
    ],



    // Employees list page - table column headers
    employeeListPage: {
        columnHeaders: [
            "Employee",
            "Employee ID",
            "Contractor",
            "Department",
            "Designation",
            "Status",
            "Date of Joining",
            "Manager",
            "Action"
        ],
    },

    // Complete happy-path data to add a new employee and save
    addEmployeeValidData: {
        firstName: "Mukesh",
        middleName: "Kumar",
        lastName: "Ahuja",
        officialEmail: "pka@exmaple.com",
        department: "Engineering",
        subDepartment: "Testing",
        designation: "QA Manager",
        primaryPhone: "2112344356",
        dateOfJoining: "04-08-2025",
        dateOfBirth: "01-11-1984",
        gender: "Male",
        maritalStatus: "Married",
        aadharCardNumber: "123412341234",
        contractor: "QA Services Ltd",
        monthlySalary: "120000",
        qualification: "B.E",
        previousExperience: "13 years of experience in Testing Field.",
        interviewBy: "HR Manager",
        dateOfInterview: "01-06-2025",
        interviewRemark: "Selected",
        headOfFunction: "Group Manager"
    }
};

module.exports = { addNewEmployeeTestData };

