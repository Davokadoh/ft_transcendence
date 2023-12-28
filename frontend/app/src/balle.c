/* BANDE D'INFO  IMAGE REBOND*/
.container-info {
	/* marge sous la bande */
	margin-bottom: 0px;
}
.container-fluid {
	/* marge sous la bande */
	margin-bottom: 0px;
}
.scrolling-image-container {
	white-space: nowrap;
	animation: scrollText 30s linear infinite;
	/* Ajuster la durée selon préférences */
}

.custom-image-spacing {
	width: 15%;
	height: auto;
}

@keyframes scrollText {
	from {
		transform: translateX(150%);
	}

	to {
		transform: translateX(-150%);
	}
}

.scrolling-image-container {
	overflow: hidden;
	position: relative;
	margin-bottom: 0px;
  }

  .custom-image-spacing {
	animation: bounce 2s infinite;
  }

  @keyframes bounce {
	0% {
	  transform: translateY(0) rotate(0deg);
	}
	40% {
	  transform: translateY(-50px);
	}
	60% {
	  transform: translateY(-20px);
	}
	100% {
	  transform: translateY(0) ranslateX(-100%) rotate(-360deg);

	}
  }

  /* @keyframes bounce {
	0%, 20%, 50%, 80%, 100% {
	  transform: translateY(0);
	}
	40% {
	  transform: translateY(-50px);
	}
	60% {
	  transform: translateY(-20px);
	}
  } */