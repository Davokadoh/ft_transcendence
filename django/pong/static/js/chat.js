import { socket } from './index.js';
import { router } from './router.js';

export function chat() {

	console.log('SCRIPT CHAT IS LOADED');

	let isVisibleList = false;
	let isVisibleChat = true;
	let conversationExist = false;

	let activeChatPanel = null;

	let templateConversationHistory = document.createElement("template");
	let templateConversation = document.createElement("template");
	let templateContactList = document.createElement("template");

	const searchInput = document.querySelector("[data-search]");
	const conversationList = document.getElementById("conversationListId");
	const conversationHistory = document.querySelector(".conversation-history");
	const contactSelect = document.querySelector("[data-contact]");

	let usersBlocked = [];


	

	fetchUsersBlocked();

	fetchTemplate()
		.then(() => {

			// create list contact directly
			createListContact()
				.then(() => {
					console.log("List contacts loaded: ", document.getElementById('listContact').innerHTML);

					// load list conversations
					fetchListConversation();
				})
				.catch(error => {
					console.error('Creation list contact failed :', error);
				});
		})
		.catch(error => {
			console.error('fetch template failed :', error);
		});

	//click manage 
	document.addEventListener("click", (e) => {
		//e.stopImmediatePropagation();

		console.log("e.target***: ", e.target);
		console.log("e.curtarget***: ", e.currentTarget);
		console.log("activeChatPanel by listener click: ", activeChatPanel);

		if (e.currentTarget.id != "searchContactId")
			refresh_display();
		/*if (e.currentTarget.getElementById("searchContact").contains(e.target))
			search_contact();*/
	});

	// click on search
	document.getElementById("searchContactId").addEventListener("click", search_contact);

	function refresh_display() {
		//hide list contact if actif
		if (isVisibleList) {
			document.getElementById('listContact').classList.replace("visible-y", "invisible-y");
			document.getElementById('conversationListId').classList.toggle('hide', false);
			isVisibleList = false;
		}
	}

	function search_contact(event) {

		console.log('CLICK ON SEARCH');
		console.log("isVisibleList: ", isVisibleList);

		if (isVisibleList === false) {
			createListContact()
				.then(() => {
					document.getElementById('conversationListId').classList.toggle('hide', true);
					document.getElementById('listContact').classList.replace("invisible-y", "visible-y");
					isVisibleList = true;
				})
				.catch(error => {
					console.error('Erreur lors de la création de la liste de contacts :', error);
				});
		}
	}


	function handle_click_contact(contact) {

		contact.addEventListener('click', () => {

			console.log("CLICK on CONTACT");
			const contactId = contact.id;
			const contactName = contact.querySelector("[data-name]").textContent;
			const img = contact.querySelector("[data-image]").src;

			searchInput.value = "";

			//visibleAllContact();
			console.log("find conversation result:  ", findConversation(contactId));
			if (findConversation(contactId)) {
				selectConversation(contactId);

			} else {
				const obj = {
					id: contactId,
					name: contactName,
					imgSrc: img,
				};
				// create first conv && chatPanel
				document.getElementById('panelPrincipalId').classList.toggle('hide', true);
				createConversationByContact(obj);
				//document.getElementById('conversationListId').classList.toggle('hide', false);
			}


			console.log("Contact name: ", contactName);
			document.getElementById('conversationListId').classList.toggle('hide', false);
			document.getElementById('listContact').classList.replace("visible-y", "invisible-y");
			
			isVisibleList = false;
		});
	}

	function createConversationByContact(obj) {
	
		//document.getElementById("conversationListId").innerHTML = "";
		let tpl = templateConversation.content.cloneNode(true);
		//set value
		tpl.querySelector(".conversation").id = obj.id;
		let name = tpl.querySelector("[data-text] h6");
		tpl.querySelector(".conversation").setAttribute("data-nickname", obj.name);
		let img = tpl.querySelector("[data-image]");
		let blockUnblock = tpl.querySelector("#blockUnblockId");
		let statusIndicator = tpl.querySelector(".status-indicator");
		// Vérifie si l'utilisateur est bloqué
		if (usersBlocked.find(user => user.username === obj.id))
			blockUnblock.innerText = "Unblock contact";
		else
			blockUnblock.innerText = "Block contact";
		// Défini le nom et l'image
		name.textContent = obj.name;
		img.src = obj.imgSrc;
		//statusIndicator = data.status;
		document.getElementById("conversationListId").append(tpl);
		document.getElementById("conversationListId").lastElementChild.addEventListener("click", handle_conversation);
		console.log("== createConversationBycontact list: ==", document.getElementById("conversationListId").lastElementChild);
		
		//load chatPanel
		let chatPanel = document.getElementById("conversationHistoryId");
		chatPanel.innerHTML = "";
		chatPanel.append(setTplHistory(obj.id));
		if (!conversationExist)
			conversationExist = true;

		//update activechatPanel
		activeChatPanel = obj.id;
		handle_click_history();
	}

	function handle_conversation(event) {

		//icon dropdown
		if (event.target.classList.contains("i-down")) {

			console.log("click icon dropdown");
			var displayingDrop = event.target.nextElementSibling;

			//just adjust zindex when drop displaying
			if (displayingDrop.classList.contains("show"))
				zIndexDropdown(event.currentTarget);

			//close dropdown if the cursor leave
			event.target.closest(".conversation").querySelector(".dropdown, .dropdown .dropdown-menu")
				.addEventListener("mouseleave", () => {
					console.log("**mouse leave**");
					closeDropdown(event.target.closest(".dropdown"));
				});

			//dropdown action
			handle_dropdown_action(event.target.closest(".conversation"));
		}
		else {

			const contactId = event.currentTarget.id;
			console.log("click on conversation: ", contactId);
			// if the target is not dropdown
			selectConversation(contactId);
		}
	}

	function zIndexDropdown(curtarget) {

		console.log("function zindex!!!!!!");
		const drop = curtarget.querySelector(".dropdown .dropdown-menu");
		const placement = drop.getAttribute('data-popper-placement');
		const conversations = document.querySelectorAll(".conversation");

		let index = 1000;
		if (placement.includes("bottom")) {
			console.log("_________down___________");
			conversations.forEach(conversation => {

				conversation.style.zIndex = index;
				conversation.querySelector(".dropdown .dropdown-menu").style.zIndex = index--;
			});
		}
		else if (placement.includes("top")) {
			console.log("_________top___________");
			conversations.forEach(conversation => {
				conversation.style.zIndex = index;
				conversation.querySelector(".dropdown .dropdown-menu").style.zIndex = index++;
			});
		}
	}

	function handle_dropdown_action(myTarget) {

		myTarget.querySelector(".dropdown .dropdown-menu").addEventListener("click", function (e) {
			e.stopImmediatePropagation();
			const conversationId = myTarget.id;
			console.log("click action: ", e.target.id);
			console.log("Target: ", conversationId);



			if (e.target.id === "delId") {
				socket.send(JSON.stringify({
					'type': 'manage_conversation',
					'action': '#remove',
					'target': conversationId,
				}));
				myTarget.remove();
				if (activeChatPanel === conversationId) {
					document.querySelector(".conversation-history").innerHTML = "";
					document.getElementById('panelPrincipalId').classList.toggle('hide', false);
					activeChatPanel = null;
				}
				if (document.getElementById("conversationListId").innerHTML === "") {
					activeChatPanel = null;
					conversationExist = false;
				}
			} else if (e.target.id === "blockUnblockId") {
				const blockUnblockElement = e.target;
				if (blockUnblockElement.textContent === "Block contact") {
					blockContact(conversationId, true);
					blockUnblockElement.textContent = "Unblock contact";
					manageFriend("block", conversationId);
					console.log("contact was blocked");
				} else {
					blockContact(conversationId, false);
					blockUnblockElement.textContent = "Block contact";
					manageFriend("unblock", conversationId);
					console.log("contact unblocked");
				}
			}
		});
	}

	function blockContact(contactId, bool) {
		if (activeChatPanel === contactId) {
			const chatBoxElement = document.getElementById('chatBoxId');
			chatBoxElement.classList.toggle("disabled", bool);
		}
	}

	function closeDropdown(myDropdown) {
		const dropdown = new bootstrap.Dropdown(myDropdown);
		dropdown.hide();
	}

	function selectConversation(contactId) {

		console.log("==selectConversation FUNCTION==");

		console.log(`select: ${contactId}`);
		console.log(`active chat: ${activeChatPanel}`);

		if (activeChatPanel != contactId) {
			
			document.getElementById('panelPrincipalId').classList.toggle('hide', true);

			document.querySelector(`.conversation-history`).innerHTML = "";
			document.querySelector(`.conversation-history`).append(setTplHistory(contactId));
			activeChatPanel = contactId;
			
			//test res
			console.log("select conversation: ", document.querySelector(`.conversation-history`).innerHTML);
			
			//load messages
			fetchMessages(contactId);
			handle_click_history();
			//document.getElementById('chatBoxId').classList.toggle('hide', false);
			if (!conversationExist)
				conversationExist = true;
		}
	}


	function visibleAllContact() {
		users.forEach(user => {
			user.element.classList.toggle("hide", false);
		});
	}

	

	function setTplHistory(conversationId) {

		//const element = document.createElement("div");
		let conversation = document.querySelector(`.conversation-list #${conversationId}`);
		console.log("conversation within setTplHist: ", conversation);
		
		let tpl = templateConversationHistory.content.cloneNode(true);
		let settingsTray = tpl.querySelector(".settings-tray");
		let img = settingsTray.querySelector("[data-image]");
		settingsTray.querySelector("[data-text]").id = conversationId;
		let name = settingsTray.querySelector("[data-text] h6");
		let chatBox = tpl.querySelector("#chatBoxId");
		img.src = conversation.querySelector("[data-image]").src;
		name.textContent = conversation.querySelector("[data-text] h6").textContent;
		
		if (usersBlocked.find(user => user.username === conversationId))
			chatBox.classList.toggle("disabled", true);
		else
			chatBox.classList.toggle("disabled", false);
		
		//element.append(tpl);
		return tpl;
	}
	
	function setTplConversation(data) {

		//const element = document.createElement("div");

		//take img from contact list
		console.log("setTplConv data: ", data);
		console.log("setTplConv list contact: ", document.querySelector(`.list-contact`));
		console.log("setTplConv sender: ", data.sender);

		//console.log("setTplConv list contact: ", document.querySelector(`.list-contact #${data.sender}`));

		let userId = document.getElementById("userId").textContent;
		let target = (data.sender == userId) ? data.target : data.sender;
		let target_nickname = (data.sender == userId) ? data.target_nickname : data.sender_nickname;
		let takeImg = "";

		const targetElement = document.querySelector(`.list-contact #${target}`);
		if (targetElement) {
			const profileImage = targetElement.querySelector(".profile-image");
			if (profileImage) {
				takeImg = profileImage.getAttribute("src");
			}
		}
		
		console.log("takeImg: ", takeImg);
			
		let tpl = templateConversation.content.cloneNode(true);
		//set value
		tpl.querySelector(".conversation").id = target;
		let name = tpl.querySelector("[data-text] h6");
		tpl.querySelector(".conversation").setAttribute("data-nickname", target_nickname);
		let img = tpl.querySelector("[data-image]");
		let blockUnblock = tpl.querySelector("#blockUnblockId");
		let statusIndicator = tpl.querySelector(".status-indicator");
		// Vérifie si l'utilisateur est bloqué
		if (usersBlocked.find(user => user.username === target))
			blockUnblock.innerText = "Unblock contact";
		else
			blockUnblock.innerText = "Block contact";
		// Défini le nom et l'image
		name.textContent = target_nickname;
		img.src = takeImg;
		statusIndicator = data.status;
		return tpl;
	}

	function handle_click_history() {

		console.log("==handle_click_history==");

		let conversation = document.querySelector(`.conversation-list #${activeChatPanel}`);
		let nickname = conversation.getAttribute("data-nickname");


		document.getElementById("contactImgProfil").addEventListener("click", () => {
			console.log("click img contact");
			//handle_click_contact(event.target.parentElement);
			document.getElementById("contactProfil").classList.toggle("invisible-y");
		});

		document.getElementById('checkProfil').addEventListener('click', function () {

			console.log("click on checkProfilButton");
			if (nickname) {
				console.log(`Check profile: ${nickname}`);
				redirectToUserProfile(nickname);
			}
			else
				console.log(`Empty Nickname: from checkProfilButton`);
		});

		document.getElementById("removeFriend").addEventListener("click", () => {
			console.log("remove with active panel: ", activeChatPanel);
			manageFriend("remove", activeChatPanel);
		});

		document.getElementById("unblockFriend").addEventListener("click", () => {
			console.log(`click on blockUnblock contact: ${activeChatPanel}`);
			let convBtnBlockUnblock = document.querySelector(`.conversation-list #${activeChatPanel}`);
			convBtnBlockUnblock = convBtnBlockUnblock.querySelector("#blockUnblockId").textContent = "Block contact";
			blockContact(activeChatPanel, false);
			manageFriend("unblock", activeChatPanel);
		});

		document.getElementById("invitation").addEventListener("click", sendByMe);
		document.getElementById("input-id").addEventListener("keypress", sendByMe);
		document.getElementById("send-id").addEventListener("click", sendByMe);
	}

	function redirectToUserProfile(nickname) {
		if (nickname)
			checkProfil.href = `/user/${nickname}/`;
		checkProfil.setAttribute("data-link", `/user/${nickname}/`);
		return;

	}

	function findConversation(username) {
		console.log("name: ", username);
		let conversation = document.querySelector(`.conversation-list #${username}`);
		return conversation ? true : false;
	}

	function updateConversations(data, type) {
		
		var msg = data.message;
		var shortText = msg.length < 21 ? msg : msg.substring(0, 20) + ' ...';
		var conversation_id = "";
		var conversation_name = "";
		if (type == "receive") {
			conversation_id = data.sender;
			conversation_name = data.sender_nickname;
		}
		else if (type == "sent") {
			conversation_id = data.target;
			conversation_name = data.target_nickname;
		}

		const element = document.querySelector(`.conversation-list #${conversation_id}`);
		element.querySelector(".text h6").textContent = conversation_name;
		element.querySelector("#textMuted").innerText = shortText;
		element.querySelector("#timeMsg").innerText = data.timestamp;
		
		console.log("===mapConversationsList updated!===");
	}

	//-------------handle message-----------------
	socket.onmessage = function (event) {
		const data = JSON.parse(event.data);
		console.log("===socket onmessage:===", data);

		if (data.type == "alert_tournament" || data.type == "game_invitation" || data.type == "chat_message")
			parse_msg(data, "socket");
	};

	function parse_msg(data, from) {
		let userId = document.getElementById("userId").textContent;
		console.log(`parse_map: sender: ${data.sender}; userId: ${userId}`)
		if (data.sender == userId) {
			message_sent(data, from);
		}
		else
			message_receive(data, from);
	}

	function message_receive(data, from) {
		console.log("==message_receive FUNCTION==");

		if (data.type == "alert_tournament") {
			showToast(data);
			return;
		}

		const element = document.createElement("div");

		element.className = "row g-0";
		if (data.type == "chat_message") {
			element.innerHTML = `
			<!--msg from friend-->
			<div class="col-md-3 d-flex">
				<div class="chat-bubble chat-bubble--left" id="msgByOtherId">
					${data.message.replaceAll("<", "&lt;").replaceAll(">", "&gt;")}
				</div>
			</div>`;
			console.log("active chat dans message_receive: ", activeChatPanel);
		}
		else if (data.type == "game_invitation") {
			if (data.message.includes("#invitation")) {

				let gameId = (data.message.split(' ').length === 2) ? data.message.split(' ')[1] : "";
				console.log(`invitation id: ${data.id}\ngameId: ${gameId}`);

				element.innerHTML = `
				<!--msg from friend-->
				<div class="col-md-12 d-flex">
					<div class="chat-invitation chat-invitation--receive mx-auto" id="${data.id}">
						<span class="gameId hide">${gameId}</span>
						<div class="text">Invitation to Play</div>
						<div id="btnGroup" class="btn-group btn-grouo-sm d-flex align-items-center" role="group" aria-label="Basic example" style="width: 100%;">
							<button type="button" class="btn btn-secondary accept-btn t-bc" id="accept">✔</button>
							<button type="button" class="btn btn-secondary decline-btn t-bc" id="decline">✖</button>
						</div>
					</div>
				</div>`;
				element.querySelector("#accept").addEventListener("click", sendResponseInvitation);
				element.querySelector("#decline").addEventListener("click", sendResponseInvitation);

			}
			else if (data.message.includes("#accept") || data.message.includes("#decline")) {

				let msg = (data.message.includes("#accept")) ? "Invitation has been accepted" : "Invitation was declined";
				element.innerHTML = `
				<!--msg from friend-->
				<div class="col-md-12 d-flex">
					<div class="chat-invitation mx-auto" id="msgByOtherId">
						<small class="text">${msg}</small>
					</div>
				</div>`;
			}
		}

		if (findConversation(data.sender)) {
			
			if (data.sender == activeChatPanel) {
				document.querySelector(".conversation-history [data-text] h6").textContent = data.sender_nickname;
				document.getElementById("chatPanelId").append(element);
				scrollUp(document.getElementById("rowChatPanel"));
				//updateChatHistory(activeChatPanel);
			}
			
			//#redirection
			if (from == "socket" && data.type == "game_invitation"
				&& data.message.includes("#accept")) {
				const gameId = parseInt(data.message.split(' ')[1]);
				history.pushState(null, null, `/remote/${gameId}/`);
				router();
			}
		}
		else {

				//test take img by list friends
				document.getElementById("conversationListId").append(setTplConversation(data));
				document.getElementById("conversationListId").lastElementChild.addEventListener("click", handle_conversation);
		}
		updateConversations(data, "receive");
		conversationExist = true;
	}

	function message_sent(data, from) {

		console.log("==message_sent FUNCTION==");

		//take class
		const element = document.createElement("div");

		element.className = "row g-0";

		if (data.type == "chat_message") {
			element.innerHTML = `
			<div class="col-md-3 offset-md-9 d-flex">
				<div class="chat-bubble chat-bubble--blue chat-bubble--right ms-auto" id="msgByMeId">
					${data.message.replaceAll("<", "&lt;").replaceAll(">", "&gt;")}
				</div>
			</div>`;
		}
		else if (data.type == "game_invitation") {
			let msg;
			let bgClass; // Variable pour la classe CSS du fond

			if (data.message.includes("#invitation")) {
				msg = "Invitation has been sent";
				bgClass = "bgBleu"; // Pas de classe spécifique pour le fond
			} else if (data.message.includes("#accept")) {
				msg = "Invitation accepted";
				bgClass = "bgVert"; // Fond vert pour l'invitation acceptée
			} else if (data.message.includes("#decline")) {
				msg = "Invitation declined";
				bgClass = "bgViolet"; // Fond violet pour l'invitation refusée
			}

			element.innerHTML = `
				<div class="col-md-12 d-flex">
					<div class="chat-invitation mx-auto ${bgClass}" id="${data.id}">
						<small class="text t-bc">${msg}</small>
					</div>
				</div>`;
		}


		if (activeChatPanel) {
			document.getElementById("chatPanelId").append(element);
			scrollUp(document.getElementById("rowChatPanel"));
			//delete invitation after decision 
			if (data.type == "game_invitation" && data.message.includes("#accept") || data.message.includes("#decline")) {
				let invitationClass = document.getElementById(`${data.id}`);
				//#redirection
				if (from == "socket" && data.message.includes("#accept")) {
					const gameId = invitationClass.querySelector(".gameId").innerText;
					history.pushState(null, null, `/remote/${gameId}/`);
					router();
				}
				invitationClass.remove();
			}
			//updateChatHistory(activeChatPanel);
		}
		updateConversations(data, "sent");
		console.log("active chat dans message_sent: ", activeChatPanel);
	}

	function sendByMe(event) {
		console.log("from sendByme event type: ", event.type);

		const inputField = document.getElementById("input-id");


		if (event.target.classList.contains("invitation")) {
			console.log("Invitation have sent");
			socket.send(JSON.stringify({
				'type': 'game_invitation',
				'id': "id" + Math.random().toString(16).slice(2),
				'target': activeChatPanel, //username target
				'message': "#invitation"
			}));
		}
		else if ((event.type === "click" || event.key === "Enter") && inputField.value) {
			console.log(`message sent: ${inputField.value}`);

			//test websocket/*
			socket.send(JSON.stringify({
				'type': 'chat_message',
				'target': activeChatPanel, //nickname target
				'message': inputField.value
			}));

			//just for test receive and send 
			inputField.value = "";
		}
	}

	function sendResponseInvitation(event) {
		let decision;

		decision = (event.target.classList.contains("accept-btn")) ? "#accept" : "#decline";
		let id_tmp = event.currentTarget.closest(".chat-invitation--receive");
		let gameId = id_tmp.querySelector(".gameId").innerText;
		console.log(`Click on ${decision}: GameId: ${gameId}`);

		socket.send(JSON.stringify({
			'type': 'game_invitation',
			'id': id_tmp.id,
			'target': activeChatPanel, //username target
			'message': decision + ` ${gameId}`
		}));
	}

	function scrollUp(element) {
		if (element.scrollHeight > element.clientHeight) {
			element.scrollTop = element.scrollHeight;
		}
	}

	function formatageTime(timeJson) {


		var heures = new Date(timeJson).getHours();
		var minutes = new Date(timeJson).getMinutes();

		return heures.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
	}

	function handle_input_steam() {

		console.log("==Handle input stream Function==");
		const contacts = document.querySelectorAll('.contact');

		searchInput.addEventListener("input", function (e) {
			const value = e.target.value;
			contacts.forEach(user => {
				const name = user.querySelector("[data-name]").textContent;
				const isVisible = name.toLowerCase().includes(value.toLowerCase());
				user.classList.toggle("hide", !isVisible);
			});
		});
	}

	function showToast(data) {
		console.log("==showToast function==");
		const toastElement = document.getElementById("liveToast");
		toastElement.querySelector(".toast-header .time").innerText = data.timestamp;
		toastElement.querySelector(".toast-body").textContent = data.message;

		const toast = new bootstrap.Toast(toastElement);
		toast.show();
	}

	async function fetchTemplate() {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await fetch('/chat/chat-tmp/');

				if (!response.ok)
					throw new Error('fetch chat/template : ERROR');

				const htmlContent = await response.text();
				const parser = new DOMParser();
				const doc = parser.parseFromString(htmlContent, 'text/html');
				templateContactList = doc.querySelector('template[list-contact-template]');
				templateConversationHistory = doc.querySelector('template[conversation-history-template]');
				templateConversation = doc.querySelector('template[conversation-template]');
				resolve();
				console.log("fetch chat-tmp.html!");
			} catch (error) {
				reject(error);
				console.error('Erreur de chargement du template:', error);
			}
		});
	}

	function createListContact() {

		return new Promise((resolve, reject) => {

			console.log("==createListContact FUNCTION==");
			fetch("getList/friends", {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
			})
				.then(response => {
					if (!response.ok) {
						throw new Error('fetch getList/friends : ERROR');
					}
					return response.json();
				})
				.then(data => {

					console.log('Response server _data_ : users/list : ', data.friend_list);
					// clear contact list on document
					document.getElementById("listContact").innerHTML = "";
					// var myNickname = document.getElementById("id_nickname").value;
					data.friend_list.map(user => {
						// if (myNickname != user.nickname) {
						//take template
						var tpl = templateContactList.content.cloneNode(true);
						tpl.querySelector("[contact-container]").id = `${user.username}`;
						tpl.querySelector("[data-image]").src = user.profil_picture;
						tpl.querySelector("[data-name]").textContent = user.nickname;
						tpl.querySelector("[data-full-name]").textContent = user.nickname;



						// Set the status indicator @Verena Status
						let statusIndicator = tpl.querySelector(".status-indicator");
						statusIndicator.textContent = user.status;
						statusIndicator.setAttribute('data-status', user.status);

						// Modify the status indicator color based on status
						if (user.status === 'online') {
							statusIndicator.classList.add('online');
						} else if (user.status === 'offline') {
							statusIndicator.classList.add('offline');
						} else if (user.status === 'playing') {
							statusIndicator.classList.add('playing');
						} else if (user.status === '') {
							statusIndicator.classList.add('empty');
						}
						//insert contact 
						document.getElementById("listContact").append(tpl);
						handle_click_contact(document.getElementById("listContact").lastElementChild);
						// }
					});
					console.log("listContact in doc:  ", document.getElementById("listContact").innerHTML);
					let userListResponse = document.getElementById("listContact").innerHTML;
					//no friend to chat
					if (userListResponse.length === 0) {
						showAlert("If you don't have any friends, take a curly and go to the profile page to find some.");
					}
					//Listen event about search
					handle_input_steam();
					resolve();

				})
				.catch(error => {
					console.error('request error: Fetch', error);
					reject(error);
				});
		});
	}


	function fetchUsersBlocked() {
		console.log("==fetch users_blocked==");

		fetch("getList/blocked", {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
		})
			.then(response => {
				if (!response.ok)
					throw new Error('fetch getList/blocked : ERROR');

				return response.json();
			})
			.then(data => {
				usersBlocked = data.users_blocked.map(user => { return user; });
				console.log('Response server _data_ : blocked/list : ', usersBlocked);
				//if (usersBlocked.find(user => user.nickname == "PongChoRabbit"))
				//	console.log("target was blocked");
			})
			.catch(error => {
				console.error(error);
			});
	}

	function fetchListConversation() {

		const response = fetch("conversations/", {
			headers: {
				'Content-Type': 'application/json'
			},
		}).then(response => {
			
			if (!response.ok)
				throw new Error('fetch chat/conversations : ERROR');
			return response.json();
		}).then(data => {
			console.log('Response server _data_ : conversations List : ', data.conversations);

			if (data.conversations.length === 0) {
				console.log("Aucune conversation à afficher.");
				return ;
			}

			data.conversations.forEach(conversation => {
				let statusClass = '';
				if (conversation.status === 'online') {
					statusClass = 'online';
				} else if (conversation.status === 'offline') {
					statusClass = 'offline';
				} else if (conversation.status === 'playing') {
					statusClass = 'playing';
				} else if (conversation.status === '') {
					statusClass = 'empty';
				}
				let message;
				for (message of conversation.messages);
				console.log("data conversations forEah sender", message.sender);
				document.getElementById("conversationListId").append(setTplConversation(message));
				document.getElementById("conversationListId").lastElementChild.addEventListener("click", handle_conversation);
				message.timestamp = formatageTime(message.timestamp);
				let userId = document.getElementById("userId").textContent;
				(message.sender == userId) ? updateConversations(message, "sent") : updateConversations(message, "receive");
				
			});
		}).catch(error => {
			console.error('Error:', error);
		});
	}
	

	function fetchMessages(username) {
		
		fetch(`conversation/${username}/`)
			.then(response => {
				if (!response.ok) {
					throw new Error(`Erreur HTTP! Statut: ${response.status}`);
				}
				return response.json();
			})
			.then(data => {
				console.log("data from fetchMessages :", data);
				displayMessages(data.conversation.messages, username);
			})
			.catch(error => {
				console.error('Erreur lors de la récupération de la conversation:', error);
			});
	
	}

	function displayMessages(messages, username) {
		
		//const chatHistory = document.querySelector(`.conversation-history #${username}`);
		console.log("=== display messages==");
		messages.forEach(message => {
			message.timestamp = formatageTime(message.timestamp);
			parse_msg(message, "fetch");
			//console.log("from display messages: ", message.message);
		});
		//update conversation time stamp et text-mutes here
	}

	function manageFriend(action, target) {

		let contact = document.querySelector(`.conversation-list #${target}`);
		let nickname = contact.querySelector("[data-text] h6").textContent;
		fetch(`manageFriend/${action}/${nickname}/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(response.status);
				}
				return response.json();
			})
			.then(data => {
				// test
				console.log("Show alert: ", data.message);
				showAlert(data.message);
			})
			.catch(error => {
				// Le traitement des erreurs ici
				console.error('Request fetch Error:', error);
			});
	}

	let user = document.getElementById('user');

	// Fonction pour creer et afficher une alerte personnalisée
	function showAlert(message) {

		// Crée un élément semi-transparent pour recouvrir la page
		var overlay = document.createElement('div');
		overlay.className = 'overlay-alert';
		document.body.appendChild(overlay);

		// Crée un élément d'alerte
		var alertElement = document.createElement('div');
		alertElement.className = 'custom-alert';

		// Crée un élément pour le titre
		var titleElement = document.createElement('div');
		titleElement.className = 'alert-title';
		titleElement.textContent = 'Alert information';

		// Crée un bouton de fermeture
		var closeButton = document.createElement('button');
		closeButton.textContent = 'X';
		closeButton.className = 'close-button';
		closeButton.onclick = function () {
			document.body.removeChild(overlay);
			document.body.removeChild(alertElement);
		};

		// Crée un élément pour le message
		var messageContainer = document.createElement('div');
		messageContainer.className = 'message-container';

		// Ajoute le texte du message à l'élément de message
		var messageElement = document.createElement('div');
		messageElement.textContent = message;

		// Ajoute les éléments au DOM
		titleElement.appendChild(closeButton);
		alertElement.appendChild(titleElement);
		messageContainer.appendChild(messageElement);
		alertElement.appendChild(messageContainer);
		document.body.appendChild(alertElement);
		document.body.appendChild(overlay);
	}
}
