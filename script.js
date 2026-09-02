/* =========================================
   AMAZON DEALS JAVASCRIPT
========================================= */


/* =========================================
   STORAGE KEYS
========================================= */

const USERS_KEY = "amazonDealsUsers";

const CURRENT_USER_KEY = "amazonDealsCurrentUser";

const POPUP_KEY = "amazonDealsAuthPopupShown";

const THEME_KEY = "amazonDealsTheme";

const COLOR_KEY = "amazonDealsAccent";


/* =========================================
   GLOBAL VARIABLES
========================================= */

let selectedCategory = "all";

let selectedAccent = 0;


/* =========================================
   DOM READY
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    displayProducts();

    loadTheme();

    loadAccent();

    updateNavbar();

    setupSearch();

    setupCategories();

    setupMobileMenu();

    setupModalEvents();


    /*
       POPUP ONLY ON FIRST VISIT
    */

    if (!localStorage.getItem(POPUP_KEY)) {

        setTimeout(function () {

            openAuthModal("signup");

            localStorage.setItem(
                POPUP_KEY,
                "true"
            );

        }, 1000);

    }

});


/* =========================================
   DISPLAY PRODUCTS
========================================= */

function displayProducts() {

    const container =
        document.getElementById("products");

    const noProducts =
        document.getElementById("noProducts");


    if (!container) return;


    const searchInput =
        document.getElementById("searchInput");


    const searchText =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const filteredProducts =
        products.filter(function (product) {

            const matchesCategory =
                selectedCategory === "all" ||
                product.category === selectedCategory;


            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchText);


            return (
                matchesCategory &&
                matchesSearch
            );

        });


    if (filteredProducts.length === 0) {

        container.innerHTML = "";

        noProducts.classList.remove("hidden");

        return;

    }


    noProducts.classList.add("hidden");


    container.innerHTML =
        filteredProducts.map(function (product) {

            return `

                <article class="product-card">

                    <div class="product-image">

                        <span class="product-badge">
                            ${product.badge}
                        </span>

                        <img
                            src="${product.image}"
                            alt="${product.name}"
                            loading="lazy"
                            onerror="this.src='https://via.placeholder.com/400x300?text=Product+Image'">

                    </div>


                    <div class="product-content">

                        <div class="rating">

                            ⭐ ${product.rating}

                        </div>


                        <h3>
                            ${product.name}
                        </h3>


                        <div class="price-row">

                            <strong>
                                ${product.price}
                            </strong>

                            <del>
                                ${product.oldPrice}
                            </del>

                        </div>


                        <a
                            href="${product.link}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="deal-btn">

                            View Deal

                            <span>→</span>

                        </a>

                    </div>

                </article>

            `;

        }).join("");

}


/* =========================================
   SEARCH
========================================= */

function setupSearch() {

    const searchInput =
        document.getElementById("searchInput");


    if (!searchInput) return;


    searchInput.addEventListener(
        "input",
        function () {

            displayProducts();

        }
    );

}


/* =========================================
   CATEGORY FILTER
========================================= */

function setupCategories() {

    const buttons =
        document.querySelectorAll(
            ".category-btn"
        );


    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                buttons.forEach(function (btn) {

                    btn.classList.remove("active");

                });


                this.classList.add("active");


                selectedCategory =
                    this.dataset.category;


                displayProducts();

            }
        );

    });

}


/* =========================================
   AUTH MODAL
========================================= */

function openAuthModal(type) {

    const modal =
        document.getElementById("authModal");


    if (!modal) return;


    modal.classList.remove("hidden");

    document.body.classList.add(
        "modal-open"
    );


    switchAuth(type);

}


function closeAuthModal() {

    const modal =
        document.getElementById("authModal");


    if (!modal) return;


    modal.classList.add("hidden");

    document.body.classList.remove(
        "modal-open"
    );


    clearErrors();

}


/* =========================================
   SWITCH LOGIN / SIGNUP
========================================= */

function switchAuth(type) {

    const loginForm =
        document.getElementById("loginForm");

    const signupForm =
        document.getElementById("signupForm");


    const loginTab =
        document.getElementById("loginTab");

    const signupTab =
        document.getElementById("signupTab");


    if (type === "signup") {

        loginForm.classList.add("hidden");

        signupForm.classList.remove(
            "hidden"
        );


        loginTab.classList.remove(
            "active"
        );

        signupTab.classList.add(
            "active"
        );

    } else {

        signupForm.classList.add(
            "hidden"
        );

        loginForm.classList.remove(
            "hidden"
        );


        signupTab.classList.remove(
            "active"
        );

        loginTab.classList.add(
            "active"
        );

    }


    clearErrors();

}


/* =========================================
   GET USERS
========================================= */

function getUsers() {

    return JSON.parse(
        localStorage.getItem(
            USERS_KEY
        )
    ) || [];

}


/* =========================================
   SIGN UP
========================================= */

function handleSignup(event) {

    event.preventDefault();


    const name =
        document
            .getElementById("signupName")
            .value
            .trim();


    const email =
        document
            .getElementById("signupEmail")
            .value
            .trim()
            .toLowerCase();


    const password =
        document
            .getElementById("signupPassword")
            .value;


    const error =
        document.getElementById(
            "signupError"
        );


    if (password.length < 6) {

        error.textContent =
            "Password must be at least 6 characters.";

        return;

    }


    const users = getUsers();


    const existingUser =
        users.find(function (user) {

            return user.email === email;

        });


    if (existingUser) {

        error.textContent =
            "Account already exists. Please login.";

        return;

    }


    const newUser = {

        id: Date.now(),

        name: name,

        email: email,

        password: password

    };


    users.push(newUser);


    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );


    localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        })
    );


    document.getElementById(
        "signupForm"
    ).reset();


    closeAuthModal();

    updateNavbar();


    showToast(
        "Account created successfully! 🎉"
    );

}


/* =========================================
   LOGIN
========================================= */

function handleLogin(event) {

    event.preventDefault();


    const email =
        document
            .getElementById("loginEmail")
            .value
            .trim()
            .toLowerCase();


    const password =
        document.getElementById(
            "loginPassword"
        ).value;


    const error =
        document.getElementById(
            "loginError"
        );


    const users = getUsers();


    const user =
        users.find(function (item) {

            return (
                item.email === email &&
                item.password === password
            );

        });


    if (!user) {

        error.textContent =
            "Invalid email or password.";

        return;

    }


    localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email
        })
    );


    document.getElementById(
        "loginForm"
    ).reset();


    closeAuthModal();

    updateNavbar();


    showToast(
        "Welcome back, " +
        user.name +
        "! 👋"
    );

}


/* =========================================
   UPDATE NAVBAR
========================================= */

function updateNavbar() {

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                CURRENT_USER_KEY
            )
        );


    const navActions =
        document.querySelector(
            ".nav-actions"
        );


    if (!navActions) return;


    const existingUser =
        document.querySelector(
            ".user-area"
        );


    if (existingUser) {

        existingUser.remove();

    }


    if (currentUser) {

        const userArea =
            document.createElement("div");


        userArea.className =
            "user-area";


        userArea.innerHTML = `

            <span class="user-name">
                👤 ${currentUser.name}
            </span>

            <button
                class="logout-btn"
                onclick="logoutUser()">

                Logout

            </button>

        `;


        navActions
            .appendChild(userArea);


        const loginBtn =
            document.querySelector(
                ".nav-login"
            );

        const signupBtn =
            document.querySelector(
                ".nav-signup"
            );


        if (loginBtn)
            loginBtn.style.display =
                "none";


        if (signupBtn)
            signupBtn.style.display =
                "none";

    }

}


/* =========================================
   LOGOUT
========================================= */

function logoutUser() {

    localStorage.removeItem(
        CURRENT_USER_KEY
    );


    updateNavbar();


    const loginBtn =
        document.querySelector(
            ".nav-login"
        );

    const signupBtn =
        document.querySelector(
            ".nav-signup"
        );


    if (loginBtn)
        loginBtn.style.display =
            "block";


    if (signupBtn)
        signupBtn.style.display =
            "block";


    showToast(
        "You have been logged out."
    );

}


/* =========================================
   TOAST
========================================= */

function showToast(message) {

    const toast =
        document.getElementById("toast");


    const toastMessage =
        document.getElementById(
            "toastMessage"
        );


    toastMessage.textContent =
        message;


    toast.classList.add("show");


    setTimeout(function () {

        toast.classList.remove("show");

    }, 3000);

}


/* =========================================
   CLEAR ERRORS
========================================= */

function clearErrors() {

    const loginError =
        document.getElementById(
            "loginError"
        );

    const signupError =
        document.getElementById(
            "signupError"
        );


    if (loginError)
        loginError.textContent = "";


    if (signupError)
        signupError.textContent = "";

}


/* =========================================
   THEME
========================================= */

function loadTheme() {

    const theme =
        localStorage.getItem(
            THEME_KEY
        );


    if (theme === "dark") {

        document.body.classList.add(
            "dark"
        );

    }

}


document.getElementById(
    "themeBtn"
).addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark"
        );


        const isDark =
            document.body.classList.contains(
                "dark"
            );


        localStorage.setItem(
            THEME_KEY,
            isDark
                ? "dark"
                : "light"
        );


        this.textContent =
            isDark
                ? "☀️"
                : "🌙";

    }
);


/* =========================================
   ACCENT COLORS
========================================= */

const accentColors = [

    "#ff9900",

    "#7c3aed",

    "#2563eb",

    "#10b981",

    "#ef4444"

];


function loadAccent() {

    const saved =
        localStorage.getItem(
            COLOR_KEY
        );


    if (saved !== null) {

        selectedAccent =
            Number(saved);

    }


    applyAccent();

}


function applyAccent() {

    const color =
        accentColors[
            selectedAccent
        ];


    document.documentElement
        .style
        .setProperty(
            "--accent",
            color
        );

}


document.getElementById(
    "colorBtn"
).addEventListener(
    "click",
    function () {

        selectedAccent++;


        if (
            selectedAccent >=
            accentColors.length
        ) {

            selectedAccent = 0;

        }


        applyAccent();


        localStorage.setItem(
            COLOR_KEY,
            selectedAccent
        );


        showToast(
            "Theme color changed 🎨"
        );

    }
);


/* =========================================
   MOBILE MENU
========================================= */

function setupMobileMenu() {

    const menuBtn =
        document.getElementById(
            "menuBtn"
        );


    const mobileMenu =
        document.getElementById(
            "mobileMenu"
        );


    menuBtn.addEventListener(
        "click",
        function () {

            mobileMenu.classList.toggle(
                "show"
            );

        }
    );


    const links =
        mobileMenu.querySelectorAll(
            "a"
        );


    links.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                mobileMenu.classList.remove(
                    "show"
                );

            }
        );

    });

}


/* =========================================
   MODAL EVENTS
========================================= */

function setupModalEvents() {

    const modal =
        document.getElementById(
            "authModal"
        );


    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modal
            ) {

                closeAuthModal();

            }

        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeAuthModal();

            }

        }
    );

}