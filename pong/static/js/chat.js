export function chat() {
	console.log("chat.js loaded!");
	// //--------handle toogle-------------
	// //let isVisibleChat = false;
	// //let isVisibleChannel = false;
	// let isVisibleList = false;
	// let mapConversationList = new Map();
	// let mapChatChannelList = new Map();
	// let mapChatHistory = new Map();
	// let activeChat = null;
	// let templateConversationHistory = document.createElement('template');
	// let templateConversationList = document.createElement('template');
	// let contactBlocked = [];
	// //const chatInst = document.querySelector(".chat");
	// //const channelInst = document.querySelector(".channel");

	// console.log('SCRIPT CHAT IS LOADED');

	// //click everywhere
	// $(document).on("click", function (event) {
	// 	if (isVisibleList) {
	// 		$('#listContact').toggleClass('visible-y');
	// 		$('#conversationListId').toggleClass('hide', false);
	// 		isVisibleList = false;
	// 	}
	// });


	// const dataListContact = document.querySelector("[list-contact-template]");
	// const listContactContainer = document.querySelector("[list-contact-container]");
	// const searchInput = document.querySelector("[data-search]");
	// const contactSelect = document.querySelector("[data-contact]");
	// let users = [];

	// //click to select contact
	// $(document).on("click", ".contact", function (e) {


	// 	console.log("click contact");
	// 	const contactName = $(this).find("[data-name]").text();
	// 	searchInput.value = "";
	// 	visibleAllContact();
	// 	if (findConversation(contactName))
	// 		selectConversation(contactName);
	// 	else {

	// 		const obj = {
	// 			name: contactName,
	// 			imgSrc: $(this).find("img").attr("src")
	// 		}
	// 		createConversation(obj);
	// 		activeChat = contactName;
	// 		$('#panelPrincipalId').toggleClass('hide', true);
	// 		$('#chatBoxId').toggleClass('hide', false);
	// 	}
	// });

	// $(document).on("click", "#menuDownLeftId", function (e) {
	// 	e.stopPropagation();
	// 	//zIndexDropdown();
	// 	const contactName = $(this).closest(".conversation").find("[data-text] h6").text();

	// 	// Check if the click occurred on Delete
	// 	if ($(e.target).is("#delId")) {

	// 		//remove conversationList, conversation history, display panel principal
	// 		$(this).closest(".conversation").remove();
	// 		if (activeChat === contactName) {
	// 			document.querySelector(".conversation-history").innerHTML = "";
	// 			$('#panelPrincipalId').toggleClass('hide', false);
	// 		}
	// 		mapChatHistory.delete(contactName);
	// 		mapConversationList.delete(contactName);
	// 		if (mapConversationList.size === 0)
	// 			activeChat = null;

	// 	} else if ($(e.target).is("#blockUnblockId")) {

	// 		if ($(this).find("#blockUnblockId").text() === "Block contact") {

	// 			blockContact(contactName, true);
	// 			$(this).find("#blockUnblockId").text("Unblock contact");
	// 			console.log("contact was blocked");

	// 			//contactBlocked.push(contactName);
	// 			// Modifier dynamiquement le placeholder avec jQuery
	// 			// $("#myInput").attr("placeholder", "Contact was blocked");
	// 			// Clicked on the dropdown but not on an element with the class "Del"
	// 			// You can put any additional logic here if needed
	// 		} else {
	// 			blockContact(contactName, false);
	// 			$(this).find("#blockUnblockId").text("Block contact");
	// 			console.log("contact unblocked");
	// 		}
	// 	}
	// });

	// function zIndexDropdown() {
	// 	console.log("function zindex!!!!!!");
	// 	var zIndexNumber = 1000;

	// 	$('#msgId').css('zIndex', zIndexNumber);

	// 	$('#msgId .dropdown .dropdown-menu').css('zIndex', zIndexNumber - 10);

	// 	zIndexNumber -= 10;
	// }

	// function blockContact(contactName, bool) {

	// 	if (activeChat === contactName)
	// 		$('#chatBoxId').toggleClass("disabled", bool);
	// 	else {
	// 		mapChatHistory.get(contactName);
	// 		mapChatHistory.get(contactName).querySelector("#chatBoxId")
	// 			.classList.toggle("disabled", bool);
	// 	}
	// }

	// $(document).on("click", ".conversation", function (e) {
	// 	const contactName = $(this).find("[data-text] h6").text();
	// 	selectConversation(contactName);
	// });

	// // click search
	// $("#searchContact").on("click", (e) => {

	// 	e.stopPropagation();
	// 	console.log('CLICK ON SEARCH');
	// 	if (!isVisibleList) {
	// 		$('#conversationListId').toggleClass('hide', true);
	// 		$('#listContact').toggleClass('visible-y');
	// 		isVisibleList = true;
	// 	}

	// 	//input flux
	// 	searchInput.addEventListener("input", (e) => {

	// 		const value = e.target.value;
	// 		users.forEach(user => {

	// 			const isVisible = user.name.toLowerCase().includes(value.toLowerCase());
	// 			console.log(user.element);
	// 			user.element.classList.toggle("hide", !isVisible);
	// 		});
	// 	});
	// })

	// function visibleAllContact() {
	// 	users.forEach(user => {
	// 		user.element.classList.toggle("hide", false);
	// 	});
	// }

	// //create list contact
	// //index, name, img
	// fetch("https://jsonplaceholder.typicode.com/users")
	// 	.then(response => response.json())
	// 	.then(data => {

	// 		users = data.map(user => {
	// 			const contact = dataListContact.content.cloneNode(true).children[0]
	// 			const img = contact.querySelector("[data-image]")
	// 			const name = contact.querySelector("[data-name]")
	// 			img.src = "https://upload.chatsdumonde.com/img_global/24-comportement/_light-18718-chat-qui-vole-objet-nourriture.jpg"
	// 			name.textContent = user.name
	// 			listContactContainer.append(contact)
	// 			return { name: user.name, img: user.email, element: contact }
	// 		})
	// 	})


	// // Charger le contenu du fichier template.html
	// fetch('src/template/conversation-history.html')
	// 	.then(response => response.text())
	// 	.then(htmlContent => {
	// 		// Utiliser DOMParser pour extraire le contenu de la balise template
	// 		const parser = new DOMParser();
	// 		const doc = parser.parseFromString(htmlContent, 'text/html');
	// 		templateConversationHistory = doc.querySelector('template[conversation-history-template]');
	// 		templateConversationList = doc.querySelector('template[conversation-template]');
	// 		//console.log("fetch=== ", templateConversationHistory.innerHTML);
	// 	})
	// 	.catch(error => console.error('Erreur de chargement du template:', error));

	// function selectConversation(contactName) {

	// 	console.log(`select: ${contactName}`);
	// 	console.log(`active chat: ${activeChat}`);

	// 	if (activeChat != contactName) {
	// 		saveChatHistory(activeChat);
	// 		const htmlActiveChat = document.querySelector(".conversation-history");
	// 		htmlActiveChat.innerHTML = mapChatHistory.get(contactName).innerHTML;
	// 		//console.log("active chat: ", mapChatHistory.get(contactName).innerHTML);
	// 		//console.log("active chat: ", htmlActiveChat.innerHTML);
	// 		activeChat = contactName;
	// 	}
	// 	$('#panelPrincipalId').toggleClass('hide', true);
	// }

	// function createConversation(obj) {

	// 	const conversationList = document.querySelector(".conversation-list");

	// 	const tpl = templateConversationList.content.cloneNode(true);
	// 	const name = tpl.querySelector("[data-text] h6");
	// 	const img = tpl.querySelector("[data-image]");
	// 	name.textContent = obj.name;
	// 	img.src = obj.imgSrc;
	// 	conversationList.append(tpl);
	// 	console.log(conversationList.innerHTML)
	// 	//tant que aucune message ne sera envoyer en enregistre pas la conversation
	// 	updateMapChat(name.textContent, tpl);
	// 	createChatPanel(obj);
	// }


	// function createChatPanel(obj) {

	// 	if (activeChat)
	// 		saveChatHistory(activeChat);

	// 	const conversationHistory = document.querySelector(".conversation-history");
	// 	//update chatPanel, just keep the template child
	// 	conversationHistory.innerHTML = "";

	// 	const tpl = templateConversationHistory.content.cloneNode(true);
	// 	const settingsTray = tpl.querySelector(".settings-tray");
	// 	const img = settingsTray.querySelector("[data-image]");
	// 	const name = settingsTray.querySelector("[data-text] h6");
	// 	img.src = obj.imgSrc;
	// 	name.textContent = obj.name;

	// 	conversationHistory.append(tpl);
	// 	saveChatHistory(obj.name);
	// 	//console.log("template: ", conversationHistory.innerHTML);
	// 	console.log("===Create ChatPanel===");
	// }

	// /*--------------toggle chat & channel-------------*/
	// let isVisibleChat = true;
	// let isVisibleChannel = false;
	// //print chat discussion
	// document.getElementById("i-chatId").addEventListener("click", () => {
	// 	console.log("CLICK ON CHAT");
	// 	if (isVisibleChannel) {
	// 		$("#channelId").removeClass("visible-x").addClass("invisible-x");
	// 		isVisibleChannel = false;
	// 	}
	// 	if (isVisibleChat)
	// 		return;
	// 	isVisibleChat = true;
	// 	$("#chatId").removeClass("invisible-x").addClass("visible-x");
	// });

	// //print channel
	// document.getElementById("i-channelId").addEventListener("click", () => {
	// 	console.log("CLICK ON CHANNEL");
	// 	if (isVisibleChat) {
	// 		$("#chatId").removeClass("visible-x").addClass("invisible-x");
	// 		isVisibleChat = false;
	// 	}
	// 	if (isVisibleChannel)
	// 		return;
	// 	$("#channelId").removeClass("invisible-x").addClass("visible-x");
	// 	isVisibleChannel = true;
	// });


	// // Function to find a conversation by name
	// function findConversation(name) {
	// 	return mapConversationList.has(name);
	// }

	// function saveChatHistory(contactName) {
	// 	const element = document.createElement("div")
	// 	element.innerHTML = document.querySelector(".conversation-history").innerHTML
	// 	mapChatHistory.set(contactName, element);
	// 	console.log("MAP lenght: ", mapChatHistory.size)
	// 	console.log("MAP key: ", contactName)

	// }

	// function updateMapChat(contactName, element) {
	// 	mapConversationList.set(contactName, element);
	// 	console.log("===mapChatList updated!===")
	// }

	// function updateMapChannel() {
	// 	mapChatChannelList.set("channel", document.querySelector(".channel-list"));
	// 	console.log("===mapChannelList updated!===")
	// }

	// /* feature msg private
	// 	list conversation:
	// 		- delete conversation
	// 		- mark as unread
	// 		- block contact
	// */
	// //function removeConversation() {}


	// /*----------------Manage Channel---------------*/

	// //handle click upload picture
	// $("#camId").on("click", () => {
	// 	console.log("Click on icon camera");
	// 	$("#inputFileId").click();
	// });

	// //Load and resize photo before insert
	// document.getElementById("inputFileId").onchange = function (e) {
	// 	resizeImage(e.target.files[0]);
	// }

	// function resizeImage(imgFile) {
	// 	if (imgFile) {
	// 		let reader = new FileReader();
	// 		reader.readAsDataURL(imgFile);

	// 		reader.onload = (e) => {
	// 			var img = document.createElement("img");
	// 			img.src = e.target.result;

	// 			// Create your canvas
	// 			var canvas = document.createElement("canvas");
	// 			var ctx = canvas.getContext("2d");

	// 			// Handle image onload event
	// 			img.onload = () => {
	// 				var MAX_WIDTH = 200;
	// 				var MAX_HEIGHT = 200;
	// 				var width = img.width;
	// 				var height = img.height;

	// 				// Add the resizing logic
	// 				if (width > height) {
	// 					if (width > MAX_WIDTH) {
	// 						height *= MAX_WIDTH / width;
	// 						width = MAX_WIDTH;
	// 					}
	// 				} else {
	// 					if (height > MAX_HEIGHT) {
	// 						width *= MAX_HEIGHT / height;
	// 						height = MAX_HEIGHT;
	// 					}
	// 				}

	// 				// Specify the resizing result
	// 				canvas.width = width;
	// 				canvas.height = height;
	// 				ctx.drawImage(img, 0, 0, width, height);

	// 				// Check if the canvas is still valid before drawing on it

	// 				let newurl = canvas.toDataURL(imgFile.type, 90);
	// 				document.getElementById("imageUploadedId").src = newurl;
	// 				console.log(document.getElementById("imageUploadedId").src);
	// 			};
	// 		};
	// 	}
	// }

	// //Handle Enter input name
	// $("#nameInputId").on("keypress", (e) => {
	// 	if (e.key === "Enter" && e.target.value) {
	// 		console.log("string");
	// 		//create class channel and save it on the list channel
	// 		//and create the channel box with
	// 		//toggle display list
	// 	}
	// });
}




/*import { xyz50 } from "culori";
import * as sock from "socket.io-client"

const socket = sock.io('http://localhost:3000');
socket.on('chat', (msg) => {
	bubbleChatReceived(msg);
});

$('')

export function handleChatEvents() {

	//createListContact();



	document.body.addEventListener('click', () => {
		console.log(isVisibleList);
		if (isVisibleList === true) {
			document.getElementById('listContact').classList.toggle('visible-y');
			isVisibleList = false;
		}
	});


		else if (isVisibleList) {
			document.querySelector('html').addEventListener('click', () => {
				console.log("im here");
				document.getElementById('listContact').classList.replace('visible-y', 'invisible-y');
			});
		}
	});





	//-------------handle message-----------------
	document.getElementById("send-id").addEventListener("click", sendMessage);
	document.getElementById("input-id").addEventListener("keypress", sendMessage);


}


function sendByMe(event) {

	const inputField = document.getElementById("input-id");
	if (event.type === "click" || event.type === "keypress" && event.key === "Enter") {
		if (inputField.value) {
			bubbleChatSent(inputField.value);
			socket.emit('chat message', inputField.value);
			//just for test
			//bubbleChatReceived(inputField.value);
			inputField.value = "";
		}
	}
}

function send(value) {

	//take class parent
	const chatPanel = document.querySelector(".chat-panel");
	if (chatPanel)
		console.log(parent);

	//chat bubble
	const chatBubble = document.createElement('div');
	chatBubble.className = 'chat-bubble chat-bubble--left';
	chatBubble.textContent = value;
	//column
	const col = document.createElement('div');
	col.className = 'col-md-3 d-flex';
	col.appendChild(chatBubble);
	//create element row
	const row = document.createElement('div');
	row.className = 'row g-0';
	row.appendChild(col);
	//append the all
	chatPanel.appendChild(row);


	scrollToBottom(document.querySelector('.row-chatPanel'));
}

function bubbleChatSent(value) {
	//take class parent
	const chatPanel = document.querySelector(".chat-panel");
	if (chatPanel)
		console.log(parent);

	//chat bubble
	const chatBubble = document.createElement('div');
	chatBubble.className = 'chat-bubble chat-bubble--blue chat-bubble--right ms-auto';
	chatBubble.textContent = value;
	//column
	const col = document.createElement('div');
	col.className = 'col-md-3 offset-md-9 d-flex';
	col.appendChild(chatBubble);
	//create element row
	const row = document.createElement('div');
	row.className = 'row g-0';
	row.appendChild(col);

	//append the all
	chatPanel.appendChild(row);


	scrollToBottom(document.querySelector('.row-chatPanel'));
}

//ever display the last msg when scroll is using
function scrollToBottom(elementTarget) {
	elementTarget.scrollTop = elementTarget.scrollHeight;
}

function updateContact(image, name) {
	const el = document.createElement('div');
	el.setAttribute('class', 'friend --onhover d-flex border-top');
	el.innerHTML = `
		<img src="${image}" alt="Friend photo" class="profile-image">
		<h6>${name}</h6>
	`;
	return el;
}

function createListContact() {
	var n = 3;
	const imageSrc = "https://upload.chatsdumonde.com/img_global/24-comportement/_light-18718-chat-qui-vole-objet-nourriture.jpg";
	const name = "Username";
	const listClass = document.getElementById('listContact');

	while (n-- > 0) {
		// Créer un nouvel élément contact
		const newContact = updateContact(imageSrc, name);
		listClass.appendChild(newContact);
		// Ajouter le nouvel élément contact après le dernier élément de la liste
		//listClass.insertAdjacentElement('beforeend', newContact);
	}
}




function showListContact() {

}*/
// export function handleChatEvents() {

// 	//handle toogle
// 	let isVisibleChat = false;
// 	let isVisibleChannel = false;
// 	const chatInst = document.querySelector(".chat");
// 	const channelInst = document.querySelector(".channel");
// 	document.getElementById("chat-id").addEventListener("click", () => {
// 		console.log("CLICK ON CHAT");
// 		if (isVisibleChannel) {
// 			channelInst.classList.remove('is-visible');
// 			isVisibleChannel = false;
// 		}
// 		if (isVisibleChat)
// 			return;
// 		chatInst.classList.toggle('is-visible');
// 		isVisibleChat = true;
// 	});

// 	document.getElementById("idChannel").addEventListener("click", () => {
// 		console.log("CLICK ON CHANNEL");
// 		if (isVisibleChat) {
// 			chatInst.classList.remove('is-visible');
// 			isVisibleChat = false;
// 		}
// 		if (isVisibleChannel)
// 			return;
// 		channelInst.classList.toggle('is-visible');
// 		isVisibleChannel = true;
// 	});

// 	//handle message
// 	document.getElementById("send-id").addEventListener("click", sendMessage);
// 	document.getElementById("input-id").addEventListener("keypress", sendMessage);
// }


// function sendMessage(event) {

// 	const inputField = document.getElementById("input-id");
// 	if (event.type === "click" || event.type === "keypress" && event.key === "Enter") {
// 		if (inputField.value) {
// 			bubbleChatSent(inputField.value);
// 			//just for test
// 			bubbleChatReceived(inputField.value);
// 			inputField.value = "";
// 		}
// 	}
// }

// function bubbleChatReceived(value) {

// 	//take class parent
// 	const chatPanel = document.querySelector(".chat-panel");
// 	if (chatPanel)
// 		console.log(parent);

// 	//chat bubble
// 	const chatBubble = document.createElement('div');
// 	chatBubble.className = 'chat-bubble chat-bubble--left';
// 	chatBubble.textContent = value;
// 	//column
// 	const col = document.createElement('div');
// 	col.className = 'col-md-3 d-flex';
// 	col.appendChild(chatBubble);
// 	//create element row
// 	const row = document.createElement('div');
// 	row.className = 'row g-0';
// 	row.appendChild(col);
// 	//append the all
// 	chatPanel.appendChild(row);


// 	scrollToBottom(document.querySelector('.row-chatPanel'));
// }

// function bubbleChatSent(value) {
// 	//take class parent
// 	const chatPanel = document.querySelector(".chat-panel");
// 	if (chatPanel)
// 		console.log(parent);

// 	//chat bubble
// 	const chatBubble = document.createElement('div');
// 	chatBubble.className = 'chat-bubble chat-bubble--blue chat-bubble--right ms-auto';
// 	chatBubble.textContent = value;
// 	//column
// 	const col = document.createElement('div');
// 	col.className = 'col-md-3 offset-md-9 d-flex';
// 	col.appendChild(chatBubble);
// 	//create element row
// 	const row = document.createElement('div');
// 	row.className = 'row g-0';
// 	row.appendChild(col);
// 	//append the all
// 	chatPanel.appendChild(row);


// 	scrollToBottom(document.querySelector('.row-chatPanel'));
// }

// //ever display the last msg when scroll is using
// function scrollToBottom(elementTarget) {
// 	elementTarget.scrollTop = elementTarget.scrollHeight;
// }
