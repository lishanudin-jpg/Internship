/* =========================================================
   F LISHANUDIN PORTFOLIO
   JAVASCRIPT
   ========================================================= */


/* =========================
   PAGE LOADER
========================= */

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    setTimeout(() => {

        loader.classList.add("hidden");

    }, 700);

});


/* =========================
   ELEMENTS
========================= */

const navbar = document.getElementById("navbar");

const menuToggle =
    document.getElementById("menuToggle");

const navMenu =
    document.getElementById("navMenu");

const navLinks =
    document.querySelectorAll(".nav-link");

const backToTop =
    document.getElementById("backToTop");

const typingText =
    document.getElementById("typingText");

const currentYear =
    document.getElementById("currentYear");


/* =========================
   CURRENT YEAR
========================= */

currentYear.textContent =
    new Date().getFullYear();


/* =========================
   MOBILE NAVIGATION
========================= */

menuToggle.addEventListener("click", () => {

    menuToggle.classList.toggle("active");

    navMenu.classList.toggle("open");

    document.body.classList.toggle("no-scroll");

});


/* Close mobile menu */

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        menuToggle.classList.remove("active");

        navMenu.classList.remove("open");

        document.body.classList.remove("no-scroll");

    });

});


/* =========================
   NAVBAR SCROLL EFFECT
========================= */

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

});


/* =========================
   TYPING EFFECT
========================= */

const roles = [
    "AI/ML Enthusiast",
    "Python Developer",
    "Data Analyst",
    "Machine Learning Learner",
    "Problem Solver"
];


let roleIndex = 0;

let characterIndex = 0;

let deleting = false;


function typeRole() {

    const currentRole =
        roles[roleIndex];


    if (!deleting) {

        typingText.textContent =
            currentRole.substring(
                0,
                characterIndex + 1
            );

        characterIndex++;


        if (characterIndex === currentRole.length) {

            deleting = true;

            setTimeout(typeRole, 1600);

            return;

        }

    } else {

        typingText.textContent =
            currentRole.substring(
                0,
                characterIndex - 1
            );

        characterIndex--;


        if (characterIndex === 0) {

            deleting = false;

            roleIndex++;

            if (roleIndex >= roles.length) {
                roleIndex = 0;
            }

        }

    }


    const speed =
        deleting ? 50 : 90;


    setTimeout(typeRole, speed);

}


typeRole();


/* =========================
   SCROLL REVEAL
========================= */

const revealElements =
    document.querySelectorAll(".reveal");


const revealObserver =
    new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach(element => {

    revealObserver.observe(element);

});


/* =========================
   SKILL BAR ANIMATION
========================= */

const skillCategories =
    document.querySelectorAll(".skill-category");


const skillObserver =
    new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.25
        }
    );


skillCategories.forEach(category => {

    skillObserver.observe(category);

});


/* =========================
   ACTIVE NAVIGATION
========================= */

const sections =
    document.querySelectorAll("section[id]");


function updateActiveNavigation() {

    const scrollPosition =
        window.scrollY + 150;


    sections.forEach(section => {

        const sectionTop =
            section.offsetTop;

        const sectionHeight =
            section.offsetHeight;

        const sectionId =
            section.getAttribute("id");


        if (
            scrollPosition >= sectionTop &&
            scrollPosition <
                sectionTop + sectionHeight
        ) {

            navLinks.forEach(link => {

                link.classList.remove("active");

            });


            const activeLink =
                document.querySelector(
                    `.nav-link[href="#${sectionId}"]`
                );


            if (activeLink) {

                activeLink.classList.add("active");

            }

        }

    });

}


window.addEventListener(
    "scroll",
    updateActiveNavigation
);


/* =========================
   BACK TO TOP
========================= */

window.addEventListener("scroll", () => {

    if (window.scrollY > 600) {

        backToTop.classList.add("show");

    } else {

        backToTop.classList.remove("show");

    }

});


backToTop.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});


/* =========================
   CONTACT FORM
========================= */

const contactForm =
    document.getElementById("contactForm");

const formStatus =
    document.getElementById("formStatus");


contactForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const message =
            document.getElementById("message").value.trim();


        if (!name || !email || !message) {

            formStatus.textContent =
                "Please fill in all fields.";

            formStatus.style.color =
                "#ff7d7d";

            return;

        }


        formStatus.textContent =
            `Thanks ${name}! Your message has been received.`;


        formStatus.style.color =
            "#5ce6a4";


        contactForm.reset();


        setTimeout(() => {

            formStatus.textContent = "";

        }, 5000);

    }
);


/* =========================
   SMOOTH INTERNAL LINKS
========================= */

document.querySelectorAll(
    'a[href^="#"]'
).forEach(link => {

    link.addEventListener(
        "click",
        function(event) {

            const targetId =
                this.getAttribute("href");


            if (
                targetId === "#" ||
                !document.querySelector(targetId)
            ) {
                return;
            }


            event.preventDefault();


            const target =
                document.querySelector(targetId);


            const navbarHeight =
                navbar.offsetHeight;


            const targetPosition =
                target.offsetTop -
                navbarHeight;


            window.scrollTo({

                top: targetPosition,

                behavior: "smooth"

            });

        }
    );

});


/* =========================
   PROFILE CARD MOUSE EFFECT
========================= */

const profileCard =
    document.querySelector(".profile-card");


const heroProfile =
    document.querySelector(".hero-profile");


if (profileCard && heroProfile) {

    heroProfile.addEventListener(
        "mousemove",
        (event) => {

            if (window.innerWidth < 900) {
                return;
            }


            const rect =
                heroProfile.getBoundingClientRect();


            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;


            const centerX =
                rect.width / 2;

            const centerY =
                rect.height / 2;


            const rotateX =
                (y - centerY) / 35;

            const rotateY =
                (centerX - x) / 35;


            profileCard.style.transform =
                `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        }
    );


    heroProfile.addEventListener(
        "mouseleave",
        () => {

            profileCard.style.transform =
                "rotate(2deg)";

        }
    );

}


/* =========================
   PROJECT CARD TILT
========================= */

const projectCards =
    document.querySelectorAll(".project-card");


projectCards.forEach(card => {

    card.addEventListener(
        "mousemove",
        event => {

            if (window.innerWidth < 900) {
                return;
            }


            const rect =
                card.getBoundingClientRect();


            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;


            const centerX =
                rect.width / 2;

            const centerY =
                rect.height / 2;


            const rotateX =
                (y - centerY) / 30;

            const rotateY =
                (centerX - x) / 30;


            card.style.transform =
                `perspective(700px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-5px)`;

        }
    );


    card.addEventListener(
        "mouseleave",
        () => {

            card.style.transform =
                "";

        }
    );

});


/* =========================
   ESC KEY CLOSES MENU
========================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            menuToggle.classList.remove("active");

            navMenu.classList.remove("open");

            document.body.classList.remove("no-scroll");

        }

    }
);