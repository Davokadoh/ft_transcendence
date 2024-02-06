// index.js update

// < !--SCRIPT BOUTON NB / COLOR-- >

    document.addEventListener('DOMContentLoaded', function () {
        console.log('night mode function called');
        const toggleSwitch = document.getElementById('toggle-switch');

        toggleSwitch.addEventListener('change', function () {
            document.body.classList.toggle('night-mode', toggleSwitch.checked);
        });
    });


// < !--SCRIPT BOUTON MENU-- >
    function toggleNavbar() {
        console.log('Toggle Navbar function called');

        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarNav = document.querySelector('#navbarNav');

        // Vérifie si le menu est ouvert
        const isOpen = navbarNav.classList.contains('show');

        // Si le menu est ouvert, retire la classe active du bouton
        if (isOpen) {
            navbarToggler.classList.remove('active');
        } else {
            // Si le menu est fermé, ajoute la classe active au bouton
            navbarToggler.classList.add('active');
        }
    }
// Fonction pour récupérer le jeton CSRF depuis les cookies
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('index.js lu ok');


    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        console.log('index.js fonction getCookies lu ok');
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // window.addEventListener('click', function (logout_user) {
    // 	if (logout_user.target === logout_user) {
    // 		logout_user();
    // 	}

    window.logout_user = function () {
        console.log('index.js fonction logout_user lu ok');
        fetch("http://localhost:8000/accounts/logout/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCookie('csrftoken'),
            },
        })
            .then(response => {
                if (response.ok) {
                    // Redirige vers la page de connexion après la déconnexion
                    window.location.href = "/accounts/login/";
                    // window.location.href = "/accounts/logout/";
                } else {
                    console.error('Erreur lors de la déconnexion');
                }
            })
            .catch(error => {
                console.error('Erreur lors de la déconnexion :', error);
            });
    };
});
