const profil = (
    `
    <div class="row gy-4">
        <div class="col-md-4">
            <div class="container_stat">
                <div class="option-container">
                    <form>
                        <button type="button" id="statsBtn" class="btn bg-vert">Statistics</button> <br>
                        <button type="submit" class="btn bg-vert">Feats</button> <br>
                        <button type="submit" class="btn bg-vert">Match History</button> <br>
                        <button type="submit" class="btn bg-vert">Settings</button>
                    </form>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="container_prof">
                <div class="profil-container">
                    <form>
                        <button type="submit" class="btn bg-vert">Contact(s)</button> <br>
                        <button type="submit" class="btn bg-vert">Blocked</button> <br>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <script>
        var statsBtn = document.getElementById('statsBtn');
        var modal = document.getElementById('statsModal');

        statsBtn.addEventListener('click', function() {
            modal.style.display = 'block';
        });

        // Ajoutez une fonction pour fermer la fenêtre modale
        function statsModalClose() {
            modal.style.display = 'none';
        }

        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                statsModalClose(); // Appelez la fonction pour fermer la fenêtre modale
            }
        });
    </script>
    <div id="statsModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="statsModalClose()">&times;</span>
            <p>Informations sur le jeu...</p>
        </div>
    </div>
    `
    );

    export default profil;


/*
Photo de profil de l'intra sur le site 42lwatch :
<img tabindex="-1" alt="" src="data:image/jpeg;base64,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" aria-expanded="false" aria-haspopup="menu" id=":r2:" class="inline-block relative object-cover object-center !rounded-full w-12 h-12 rounded-lg cursor-pointer">*/
