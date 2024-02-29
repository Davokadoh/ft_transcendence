// export function user() {
// 	let user = document.getElementById('user');
// 	let searched_username = document.getElementById('searchInput');
// 	searched_username.onchange = function() {
// 		console.log("searched_username JS = ", searched_username.value);
// 		// console.log("WINDOW HREF = ", window.location.href);
// 		user.href = `/user/${searched_username.value}/`;
// 	};
// }

export function user() { //modif de claire du 26.092.24 pour regler le soucis d'image
    // let user = document.getElementById('user');
    let profilPicture = document.getElementById('profil-picture');
    let searched_username = document.getElementById('searchInput');
    searched_username.onchange = function() {
        console.log("searched_username JS = ", searched_username.value);
        // console.log("WINDOW HREF = ", window.location.href);
        // user.href = `/user/${searched_username.value}/`;
        profilPicture.href = `/user/${searchedUsername.value}/`;
    };
}