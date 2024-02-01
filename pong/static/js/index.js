// index.js update

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

    window.logout_user = function() {
        console.log('index.js fonction logout_user lu ok');
        fetch("accounts/logout/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCookie('csrftoken'),
            },
        })
        .then(response => {
            if (response.ok) {
                // Redirige vers la page de connexion après la déconnexion
                // window.location.href = "/accounts/login/";
                window.location.href = "/accounts/logout/";
            } else {
                console.error('Erreur lors de la déconnexion');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la déconnexion :', error);
        });
    };
});
