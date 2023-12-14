// script.js

// var statsBtn = document.getElementById('statsBtn');
// var modal = document.getElementById('statsModal');

// statsBtn.addEventListener('click', function() {
//     modal.style.display = 'block';
// });

// function statsModalClose() {
//     modal.style.display = 'none';
// }

// window.addEventListener('click', function(event) {
//     if (event.target === modal) {
//         statsModalClose();
//     }
// });

$('#myModal').on('shown.bs.modal', function () {
	$('#myInput').trigger('focus')
  })
