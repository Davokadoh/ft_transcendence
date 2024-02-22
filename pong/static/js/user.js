export function user() {
	let user = document.getElementById('user');
	let searched_username = document.getElementById('searchInput');
	searched_username.onchange = function() {
		console.log("searched_username JS = ", searched_username.value);
		// console.log("WINDOW HREF = ", window.location.href);
		user.href = `/user/${searched_username.value}/`;
	};
}