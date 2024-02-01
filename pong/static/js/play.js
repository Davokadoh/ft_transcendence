
// ANCIENNEMENT GAME.JS


$('#loadNewPageBtn').click(function() {
    $.ajax({
        url: '/game',
        type: 'GET',
        success: function(data) {
            // Remplace le contenu de la section spécifique avec le contenu de la nouvelle page
            $('#app').html(data);
            window.document.dispatchEvent(new Event("DOMContentLoaded", {
                bubbles: true,
                cancelable: true
            }));
        },
        error: function() {
            alert('Erreur lors du chargement de la nouvelle page.');
        }
    });
});