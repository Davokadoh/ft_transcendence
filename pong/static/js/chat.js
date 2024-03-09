import socket from './index.js';

export function chat() {

	/*fetch('test/create', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			// Ajoutez d'autres en-têtes si nécessaire, comme les jetons CSRF
		},
		body: JSON.stringify({}),
	})
		.then(response => response.json())
		.then(data => {
			console.log('Utilisateur créé avec succès:', data);
			// Faites ce que vous devez faire avec les données de l'utilisateur créé
		})
		.catch(error => console.error('Erreur lors de la création de l\'utilisateur:', error));
	*/

	console.log('SCRIPT CHAT IS LOADED');

	let isVisibleList = false;
	let isVisibleChat = true;
	let conversationExist = false;

	let activeChatPanel = null;

	let mapConversationList = new Map();
	let mapChatHistory = new Map();

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
					fetchListConversation()
						.then(() => {
							console.log("==conversations list loaded!==");
							console.log("maConver : ", mapConversationList.size);
							mapConversationList.forEach((value, key) => {
								document.getElementById("conversationListId").append(value);
								document.getElementById("conversationListId").lastElementChild.addEventListener("click", handle_conversation);

							});
							mapChatHistory.forEach((value, key) => {
								console.log("**mapChatHistory value**: ", value);
							});
						})
						.catch(error => {
							console.error('request error: Fetch chat/conversations/', error);
						});
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
			// let tpl = templateConversationHistory.content.cloneNode(true);
			// const statusLog = contact.querySelector(["data-status"]).value
			// let statusIndicator = tpl.querySelector(".status-indicator");
			// statusIndicator.textContent = contact.status;
			// statusIndicator.setAttribute('data-status', contact.status);
			//console.log(`Clic sur le contact ${contactName}. Image source: ${img}`);
			searchInput.value = "";

			// // Modify the status indicator color based on status
			// if (contact.status === 'online') {
			// 	statusIndicator.classList.add('online');
			// } else if (contact.status === 'offline') {
			// 	statusIndicator.classList.add('offline');
			// } else if (contact.status === 'playing') {
			// 	statusIndicator.classList.add('playing');
			// } else if (contact.status === '') {
			// 	statusIndicator.classList.add('empty');
			// }

			//visibleAllContact();
			console.log("find conversation result:  ", findConversation(contactId));
			if (findConversation(contactId)) {
				selectConversation(contactId);

			} else {
				const obj = {
					id: contactId,
					name: contactName,
					imgSrc: img,
					// status: statusIndicator,
				};
				createConversation(obj);
				createChatPanel(obj);
			}
			document.getElementById('listContact').classList.replace("visible-y", "invisible-y");
			document.getElementById('conversationListId').classList.toggle('hide', false);
			isVisibleList = false;
		});
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
				mapChatHistory.delete(conversationId);
				mapConversationList.delete(conversationId);
				if (mapConversationList.size === 0) {
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
		const chatBoxElement = (activeChatPanel === contactId) ? document.getElementById('chatBoxId') : mapChatHistory.get(contactId).querySelector("#chatBoxId");
		chatBoxElement.classList.toggle("disabled", bool);
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
			document.querySelector(".conversation-history").innerHTML = "";
			document.querySelector(".conversation-history").append(mapChatHistory.get(contactId));

			console.log(mapChatHistory.get(contactId));
			document.querySelector(".conversation-history").addEventListener("click", handle_click_history);
			document.getElementById("input-id").addEventListener("keypress", sendByMe);


			document.getElementById('panelPrincipalId').classList.toggle('hide', true);
			document.getElementById('chatBoxId').classList.toggle('hide', false);


			activeChatPanel = contactId;
			conversationExist = true;
		}
	}


	function visibleAllContact() {
		users.forEach(user => {
			user.element.classList.toggle("hide", false);
		});
	}

	function createConversation(obj) {
		// if none message sent by the activechatpanel erase it
		if (!mapConversationList.has(activeChatPanel))
			document.getElementById("conversationListId").innerHTML = "";
		document.getElementById("conversationListId").append(setTemplate("conversationList", obj));
		console.log("== createConversation list: ==", document.getElementById("conversationListId").lastElementChild);

		// when click on conversation
		document.getElementById("conversationListId").lastElementChild.addEventListener("click", handle_conversation);

	}

	function setTemplate(type, obj) {

		//const element = document.createElement("div");

		if (type === "chatHistory") {
			// take template and set the value
			let tpl = templateConversationHistory.content.cloneNode(true);
			let settingsTray = tpl.querySelector(".settings-tray");
			let img = settingsTray.querySelector("[data-image]");
			settingsTray.querySelector("[data-text]").id = obj.id;
			let name = settingsTray.querySelector("[data-text] h6");
			let chatBox = tpl.querySelector("#chatBoxId");
			img.src = obj.imgSrc;
			name.textContent = obj.name;
			if (usersBlocked.find(user => user.username === obj.id))
				chatBox.classList.toggle("disabled", true);
			else
				chatBox.classList.toggle("disabled", false);
			//element.append(tpl);
			return tpl;
		}
		else if (type === "conversationList") {
			//take template
			let tpl = templateConversation.content.cloneNode(true);
			//set value
			tpl.querySelector(".conversation").id = obj.id;
			let name = tpl.querySelector("[data-text] h6");
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
			statusIndicator = obj.status;
			// // Set the status indicator @Verena Status
			// let statusIndicator = tpl.querySelector(".status-indicator");
			// statusIndicator.textContent = user.status;
			// statusIndicator.setAttribute('data-status', user.status);

			// // Modify the status indicator color based on status
			// if (user.status === 'online') {
			// 	statusIndicator.classList.add('online');
			// } else if (user.status === 'offline') {
			// 	statusIndicator.classList.add('offline');
			// } else if (user.status === 'playing') {
			// 	statusIndicator.classList.add('playing');
			// } else if (user.status === '') {
			// 	statusIndicator.classList.add('empty');
			// }
			return tpl;
		}
	}

	function createChatPanel(obj) {

		console.log("===createChatPanel FUNCTION===: ", obj.id);
		const contactName = obj.name;
		const contactId = obj.id;
		if (activeChatPanel != obj.id) {

			document.querySelector(".conversation-history").innerHTML = "";
			document.querySelector(".conversation-history").append(setTemplate("chatHistory", obj));

			document.querySelector(".conversation-history").addEventListener("click", handle_click_history);
			document.getElementById("input-id").addEventListener("keypress", sendByMe);


			document.getElementById('panelPrincipalId').classList.toggle('hide', true);
			document.getElementById('chatBoxId').classList.toggle('hide', false);

			activeChatPanel = obj.id;
			conversationExist = true;

		}
	}

	function handle_click_history(event) {

		console.log("==handle_click_history==:  ", event.target);

		if (event.target.classList.contains("profile-image")) {
			console.log("click img contact");
			document.getElementById("contactProfil").classList.toggle("invisible-y");
		}
		else if (event.target.classList.contains("invitation") || event.target.classList.contains("i-send"))
			sendByMe(event);
	}

	function findConversation(name) {
		console.log("name: ", name);
		console.log("findconverasation contain name: ", mapConversationList.has(name));

		return mapConversationList.has(name);
	}

	function updateChatHistory(contactId) {
		const element = document.createElement("div");
		element.innerHTML = document.querySelector(".conversation-history").innerHTML;
		mapChatHistory.set(contactId, element);
		console.log("MAP length: ", mapChatHistory.size);
		console.log("MAP key: ", contactId);
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

		if (document.querySelector(`.conversation-list #${conversation_id}`)) {
			const element = document.querySelector(`.conversation-list #${conversation_id}`);
			element.querySelector(".text h6").textContent = conversation_name;
			element.querySelector("#textMuted").innerText = shortText;
			element.querySelector("#timeMsg").innerText = data.timestamp;
			mapConversationList.set(conversation_id, element);
			//update map
		}
		else if (mapConversationList.has(conversation_id)) {
			mapConversationList.get(conversation_id).querySelector("#textMuted").innerText = shortText;
			mapConversationList.get(conversation_id).querySelector("#timeMsg").innerText = data.timestamp;
		}

		console.log("===mapConversationsList updated!===");
	}

	//-------------handle message-----------------
	socket.onmessage = function (event) {
		const data = JSON.parse(event.data);
		console.log("===received message:===", data);

		parse_msg(data);
	};

	function parse_msg(data) {
		let userId = document.getElementById("userId").textContent;
		console.log(`parse_map: sender: ${data.sender}; userId: ${userId}`)
		if (data.sender == userId) {
			message_sent(data);
		}
		else
			message_receive(data);
	}
	// socket.onopen = function (e) {
	//     console.log('WebSocket connection opened: ', e);
	//     socket.send(JSON.stringify({ 'message': 'Hello from Page 2!' }));
	// };

	function message_receive(data) {
		console.log("==message_receive FUNCTION==");

		/*if (data.type == "tournament_alert") {
			showToast();
			return;
		}*/

		const element = document.createElement("div");

		element.className = "row g-0";
		if (data.type == "chat_message") {
			element.innerHTML = `
			<!--msg from friend-->
			<div class="col-md-3 d-flex">
				<div class="chat-bubble chat-bubble--left" id="msgByOtherId">
					${data.message}
				</div>
			</div>`;
			console.log("active chat dans message_receive: ", activeChatPanel);
		}
		else if (data.type == "game_invitation") {
			if (data.message == "#invitation") {
				console.log("receive id: ", data.id);

				element.innerHTML = `
				<!--msg from friend-->
				<div class="col-md-12 d-flex">
					<div class="chat-invitation chat-invitation--receive mx-auto" id="${data.id}">
						<div class="text">Invitation to Play</div>
						<div id="btnGroup" class="btn-group btn-grouo-sm d-flex align-items-center" role="group" aria-label="Basic example" style="width: 100%;">
							<button type="button" class="btn btn-secondary accept-btn" id="accept">✔</button>
							<button type="button" class="btn btn-secondary decline-btn" id="decline">✖</button>
						</div>
					</div>
				</div>`;
				element.querySelector("#accept").addEventListener("click", sendResponseInvitation);
				element.querySelector("#decline").addEventListener("click", sendResponseInvitation);

			}
			else if (data.message == "#accept" || data.message == "#decline") {
				let msg = (data.message == "#accept") ? "Invitation has been accepted" : "Invitation was declined";
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
				updateChatHistory(activeChatPanel);
				if (data.type == "game_invitation" && data.message == "#accept") {
					//#redirection
					window.location.href = `/lobby`;
				}
			}
			else {


				mapChatHistory.get(data.sender).querySelector("[data-text] h6").textContent = data.sender_nickname;
				mapChatHistory.get(data.sender).querySelector("#chatPanelId").append(element);
				//document.getElementById(data.sender).classList.toggle("read-on", true);

			}
			updateConversations(data, "receive");
		}
		else {

			//test take img by list friends
			let takeImg = document.querySelector(`.list-contact #${data.sender} .profile-image`).getAttribute("src");
			takeImg = takeImg ? takeImg : "";
			console.log("takeImg: ", takeImg);
			const obj = {
				id: data.sender,
				name: data.sender_nickname,
				imgSrc: takeImg,
				//time msg
				// few line of the last message
			};
			createConversation(obj);
			//document.getElementById(data.sender).classList.toggle("read-on", true);
			updateConversations(data, "receive");
			mapConversationList.set(data.sender, setTemplate("conversationList", obj));
			mapChatHistory.set(data.sender, setTemplate("chatHistory", obj));
			mapChatHistory.get(data.sender).querySelector("#chatPanelId").append(element);

			console.log("****conversationList SIZE*****: ", mapConversationList.size);
			console.log("****conversationList*****: ", mapConversationList.get(data.sender));
			console.log("****conversationHistory field panel*****: ", mapChatHistory.get(data.sender).querySelector("#chatPanelId"));
			conversationExist = true;
		}
	}

	function message_sent(data) {

		console.log("==message_sent FUNCTION==");

		//take class
		const element = document.createElement("div");

		element.className = "row g-0";

		if (data.type == "chat_message") {
			element.innerHTML = `
			<div class="col-md-3 offset-md-9 d-flex">
				<div class="chat-bubble chat-bubble--blue chat-bubble--right ms-auto" id="msgByMeId">
					${data.message}
				</div>
			</div>`;
		}
		else if (data.type == "game_invitation") {
			let msg;
			if (data.message == "#invitation")
				msg = "Invitation has been sent";
			else if (data.message == "#accept" || data.message == "#decline")
				msg = (data.message == "#accept") ? "Invitation accepted" : "Invitation declined";
			element.innerHTML = `
				<!--msg from friend-->
				<div class="col-md-12 d-flex">
					<div class="chat-invitation mx-auto" id="${data.id}">
						<small class="text">${msg}</small>
					</div>
				</div>`;
		}


		if (activeChatPanel) {
			document.getElementById("chatPanelId").append(element);
			scrollUp(document.getElementById("rowChatPanel"));
			//delete invitation after decision 
			if (data.type == "game_invitation" && data.message == "#accept" || data.message == "#decline") {
				document.getElementById(`${data.id}`).remove();
				//#redirection
				if (data.message == "#accept")
					window.location.href = `/lobby`;
			}
			updateChatHistory(activeChatPanel);
		}
		else {
			if (findConversation(data.target)) {

				let panel = mapChatHistory.get(data.target).querySelector("#chatPanelId");
				//delete invitation after decision 
				if (data.type == "game_invitation" && data.message == "#accept" || data.message == "#decline") {
					console.log("sent id: ", data.id);
					console.log("sent element: ", panel.innerHTML);

					let myEl = panel.querySelector(`#${data.id}`);
					let parent = myEl.parentElement;
					parent.remove();
				}
				panel.append(element);
			}
		}
		updateConversations(data, "sent");
		console.log("active chat dans message_sent: ", activeChatPanel);
	}

	function sendByMe(event) {
		console.log("Click from input chat: ", event.type);

		const inputField = document.getElementById("input-id");


		if (event.target.classList.contains("invitation")) {
			console.log("Invitation have sent");
			socket.send(JSON.stringify({
				'type': 'game_invitation',
				'id': "id" + Math.random().toString(16).slice(2),
				'target': activeChatPanel, //nickname target
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
		let id_tmp = event.currentTarget.closest(".chat-invitation--receive").id;
		console.log(`Click on ${decision}`);
		socket.send(JSON.stringify({
			'type': 'game_invitation',
			'id': id_tmp,
			'target': activeChatPanel, //nickname target
			'message': decision
		}));
	}

	function scrollUp(element) {
		if (element.scrollHeight > element.clientHeight) {
			// Définissez la valeur de scrollTop sur la hauteur totale de l'élément scrollable
			element.scrollTop = element.scrollHeight;
		}
	}

	function formatageTime(timeJson) {


		var heures = new Date(timeJson).getHours();
		var minutes = new Date(timeJson).getMinutes();

		return heures.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
	}

	function handle_input_steam() {

		console.log("Handle input stream Function");
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

	function showToast() {
		const toastElement = document.getElementById('liveToast');
		toastElement.querySelector('.toast-body').textContent = "You are expected for the pong tournament";

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

	async function fetchListConversation() {

		return new Promise(async (resolve, reject) => {
			try {
				const response = await fetch("/chat/conversations/", {
					//method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					},
				});

				if (!response.ok)
					throw new Error('fetch chat/conversations : ERROR');

				const data = await response.json();

				console.log('Response server _data_ : conversations List : ', data.conversations);

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
					//load conversation
					let takeImg = document.querySelector(`.list-contact #${conversation.id} .profile-image`).getAttribute("src");
					takeImg = takeImg ? takeImg : "";
					console.log(`takeImg: ${takeImg}`);

					const obj = {
						"id": conversation.id,
						"name": conversation.name,
						"imgSrc": takeImg,
						// "status": conversation.statusIndicator,
						"status": statusClass
						// modification Verena
					}
					//console.log("status indicator = ", statusIndicator);
					//createConversation(obj);
					//var state = conversation.unread;

					mapConversationList.set(conversation.id, setTemplate("conversationList", obj));
					//mapConversationList.get(conversation.name).classList.toggle("read-on", !state);
					mapChatHistory.set(conversation.id, setTemplate("chatHistory", obj));
					//document.getElementById("conversationListId").append(setTemplate("conversationList", obj));

					conversation.messages.forEach(message => {

						//load the messages within conversation
						message.timestamp = formatageTime(message.timestamp);
						parse_msg(message);
						console.log("dans fetch sender: ", message.sender_nickname);
						console.log("dans fetch target: ", message.target_nickname);
						console.log("dans fetch message: ", message.message);

					});
				});
				resolve();

			} catch (error) {
				reject();
			}
		});
	}

	function manageFriend(action, target) {

		fetch(`manageFriendChat/${action}/${target}/`, {
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
				console.log(data.message);
			})
			.catch(error => {
				// Le traitement des erreurs ici
				console.error('Request fetch Error:', error);
			});
	}
}