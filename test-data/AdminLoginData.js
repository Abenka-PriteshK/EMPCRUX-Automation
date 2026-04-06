const { test } = require("@playwright/test");
const { LoginPage } = require("../pageobjects/LoginPage");
const { getCredentials } = require("../config/env.config");

// Get credentials from environment variables or use defaults
const credentials = getCredentials();

const loginTestData = {
    valid: [
        {
            title: "Valid Admin Login",
            role: "ADMIN",
            username: credentials.admin.username,
            password: credentials.admin.password,
            expectedUrl: "/dashboard"
        }

    ],

    invalid: [
        {
            title: "Invalid email + valid password",
            username: "wrong@email.com",
            password: "password123",
            errorMessage: "Invalid email or password"
        },
        {
            title: "Valid email + invalid password",
            username: "admin@aryanpumps.com",
            password: "wrongPassword",
            errorMessage: "Invalid email or password"
        },
        {
            title: "Invalid email format",
            username: "admin@com",
            password: "password123",
            errorMessage: "Please enter a valid email address"
        },
        {
            title: "Blank username and password",
            username: "",
            password: "",
            emailErrorMessage: "Email is required",
            passwordErrorMessage: "Password is required"
        },
    ]
};

module.exports = { loginTestData };
