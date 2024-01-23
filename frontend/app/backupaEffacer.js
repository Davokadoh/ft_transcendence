
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
const darkModeImage = document.querySelector('.dark-mode-image');

function handleDarkModeChange(e) {
	console.log('dark mode  handlefunction called');
	if (e.matches) {
		// Mode sombre activé, changez l'image
		darkModeImage.src = './src/img/Pong-Chos_LOGO_NB_DarkMode.png';
	} else {
		// Mode sombre désactivé, revenez à l'image normale
		darkModeImage.src = './src/img/Pong-Chos_LOGO_NB.png';
	}
}

// Vérifiez le mode sombre lors du chargement de la page
handleDarkModeChange(darkModeMediaQuery);

// Ajoutez un écouteur pour suivre les changements de mode sombre
darkModeMediaQuery.addEventListener('change', handleDarkModeChange);

