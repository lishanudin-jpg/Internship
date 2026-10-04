// =========================================
// AUTHENTICATION SYSTEM
// Front-end demonstration using localStorage
// =========================================


// =========================================
// STORAGE KEYS
// =========================================

const USERS_KEY = "secureAuthUsers";

const SESSION_KEY = "secureAuthSession";


// =========================================
// GET STORED USERS
// =========================================

function getUsers() {

    const storedUsers =
        localStorage.getItem(USERS_KEY);

    if (!storedUsers) {
        return [];
    }

    try {

        const users =
            JSON.parse(storedUsers);

        return Array.isArray(users)
            ? users
            : [];

    } catch (error) {

        return [];

    }
}


// =========================================
// SAVE USERS
// =========================================

function saveUsers(users) {

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );
}


// =========================================
// SHA-256 HASHING
// =========================================

async function hashPassword(password) {

    const encoder =
        new TextEncoder();

    const data =
        encoder.encode(password);

    const hashBuffer =
        await crypto.subtle.digest(
            "SHA-256",
            data
        );

    const hashArray =
        Array.from(
            new Uint8Array(hashBuffer)
        );

    return hashArray
        .map(
            byte =>
                byte
                    .toString(16)
                    .padStart(2, "0")
        )
        .join("");
}


// =========================================
// PASSWORD VALIDATION
// =========================================

function validatePassword(password) {

    const hasMinimumLength =
        password.length >= 8;

    const hasNumber =
        /\d/.test(password);

    return {
        valid:
            hasMinimumLength &&
            hasNumber,

        hasMinimumLength,

        hasNumber
    };
}


// =========================================
// REGISTER PAGE
// =========================================

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    const usernameInput =
        document.getElementById(
            "registerUsername"
        );

    const emailInput =
        document.getElementById(
            "registerEmail"
        );

    const passwordInput =
        document.getElementById(
            "registerPassword"
        );

    const errorMessage =
        document.getElementById(
            "registerError"
        );

    const successMessage =
        document.getElementById(
            "registerSuccess"
        );

    const lengthRule =
        document.getElementById(
            "lengthRule"
        );

    const numberRule =
        document.getElementById(
            "numberRule"
        );


    // -----------------------------------------
    // LIVE PASSWORD VALIDATION
    // -----------------------------------------

    passwordInput.addEventListener(
        "input",
        function () {

            const result =
                validatePassword(
                    passwordInput.value
                );


            if (result.hasMinimumLength) {

                lengthRule.textContent =
                    "✓ At least 8 characters";

                lengthRule.classList.add(
                    "valid"
                );

            } else {

                lengthRule.textContent =
                    "✕ At least 8 characters";

                lengthRule.classList.remove(
                    "valid"
                );
            }


            if (result.hasNumber) {

                numberRule.textContent =
                    "✓ At least 1 number";

                numberRule.classList.add(
                    "valid"
                );

            } else {

                numberRule.textContent =
                    "✕ At least 1 number";

                numberRule.classList.remove(
                    "valid"
                );
            }

        }
    );


    // -----------------------------------------
    // REGISTRATION
    // -----------------------------------------

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            errorMessage.textContent = "";

            successMessage.textContent = "";


            const username =
                usernameInput.value.trim();

            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();

            const password =
                passwordInput.value;


            // Empty validation
            if (
                username === "" ||
                email === "" ||
                password === ""
            ) {

                errorMessage.textContent =
                    "Please fill in all fields.";

                return;
            }


            // Username validation
            if (username.length < 3) {

                errorMessage.textContent =
                    "Username must contain at least 3 characters.";

                return;
            }


            // Email validation
            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                errorMessage.textContent =
                    "Please enter a valid email address.";

                return;
            }


            // Password validation
            const passwordCheck =
                validatePassword(password);


            if (!passwordCheck.valid) {

                errorMessage.textContent =
                    "Password must contain at least 8 characters and 1 number.";

                return;
            }


            // Get existing users
            const users =
                getUsers();


            // Duplicate check
            const duplicate =
                users.some(
                    user =>
                        user.username.toLowerCase()
                            === username.toLowerCase()
                        ||
                        user.email.toLowerCase()
                            === email
                );


            if (duplicate) {

                errorMessage.textContent =
                    "An account with this username or email already exists.";

                return;
            }


            // Hash password
            const passwordHash =
                await hashPassword(password);


            // Create user
            const newUser = {

                id: Date.now(),

                username: username,

                email: email,

                passwordHash: passwordHash,

                createdAt:
                    new Date().toISOString()

            };


            users.push(newUser);


            saveUsers(users);


            successMessage.textContent =
                "Registration successful! Redirecting to login...";


            registerForm.reset();


            setTimeout(
                function () {

                    window.location.href =
                        "index.html";

                },
                1200
            );

        }
    );

}


// =========================================
// LOGIN PAGE
// =========================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    const identifierInput =
        document.getElementById(
            "loginIdentifier"
        );

    const passwordInput =
        document.getElementById(
            "loginPassword"
        );

    const errorMessage =
        document.getElementById(
            "loginError"
        );


    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            errorMessage.textContent = "";


            const identifier =
                identifierInput.value.trim();

            const password =
                passwordInput.value;


            // Empty validation
            if (
                identifier === "" ||
                password === ""
            ) {

                errorMessage.textContent =
                    "Please enter your username/email and password.";

                return;
            }


            // Get users
            const users =
                getUsers();


            // Hash entered password
            const passwordHash =
                await hashPassword(password);


            // Find matching user
            const user =
                users.find(
                    account =>
                        (
                            account.username
                                .toLowerCase()
                                === identifier.toLowerCase()
                            ||
                            account.email
                                .toLowerCase()
                                === identifier.toLowerCase()
                        )
                        &&
                        account.passwordHash
                            === passwordHash
                );


            // Incorrect credentials
            if (!user) {

                // Deliberately generic message.
                // It does not reveal whether username/email
                // or password was incorrect.

                errorMessage.textContent =
                    "Invalid username/email or password.";

                return;
            }


            // Create session
            const session = {

                userId: user.id,

                username: user.username,

                loginTime:
                    new Date().toISOString()

            };


            localStorage.setItem(
                SESSION_KEY,
                JSON.stringify(session)
            );


            // Redirect
            window.location.href =
                "dashboard.html";

        }
    );

}


// =========================================
// PASSWORD SHOW / HIDE
// =========================================

const showPasswordButtons =
    document.querySelectorAll(
        ".show-password"
    );


showPasswordButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            function () {

                const targetId =
                    button.dataset.target;

                const passwordField =
                    document.getElementById(
                        targetId
                    );


                if (
                    passwordField.type
                    === "password"
                ) {

                    passwordField.type =
                        "text";

                    button.textContent =
                        "Hide";

                } else {

                    passwordField.type =
                        "password";

                    button.textContent =
                        "Show";
                }

            }
        );

    }
);


// =========================================
// GET CURRENT SESSION
// =========================================

function getSession() {

    const storedSession =
        localStorage.getItem(
            SESSION_KEY
        );


    if (!storedSession) {

        return null;
    }


    try {

        return JSON.parse(
            storedSession
        );

    } catch (error) {

        return null;
    }
}


// =========================================
// PROTECTED DASHBOARD
// =========================================

const dashboardUsername =
    document.getElementById(
        "dashboardUsername"
    );


if (dashboardUsername) {

    const session =
        getSession();


    // No session = redirect
    if (!session) {

        window.location.href =
            "index.html";

    } else {

        dashboardUsername.textContent =
            session.username;

    }

}


// =========================================
// LOGOUT
// =========================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                SESSION_KEY
            );


            window.location.href =
                "index.html";

        }
    );

}