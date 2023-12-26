
const game = (
	`
<div class="container">
	<div class="row gy-4">
		<div class="col-12 col-md-6 styleBtn">
			<button type="button" class="btn btn-dark ladButClass" id="ladder">LADDER</button> 
			<br>
			<button type="button" class="btn btn-dark quickButClass" id="ladder">QUICK PLAY</button>
			</div>
			<div class="col-12 col-md-6 inviteToGame">
					<p class="text-center invitFriend">Invite a friend to play</p>
					<input type="text" class="form-control" placeholder="Enter a username" aria-label="Username" aria-describedby="basic-addon1">
					<button type="button" class="btn btn-dark inviteButClass" id="ladder">INVITE</button>
				</div>
	</div>
</div>

<!-- BANDE D INFO -->
<br>
<br>
<br>
	<div class="container-fluid">
	  <div class="row justify-content-center align-items-center">
		<div class="col-lg-6">
		  <div class="scrolling-text-container">
		  <img src="./src/img/balle.png" alt="Scrolling Image" class="custom-image-spacing">		  </div>
		 <br> 
		 <br> 
		  </div>
		</div>
	  </div>
	</div>

	`
);

export default game;
