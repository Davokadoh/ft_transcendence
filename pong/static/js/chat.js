
export function chat() {

    console.log('SCRIPT CHAT IS LOADED');

    let isVisibleList = false;
    let isVisibleChat = true;
    let activeChatPanel = null;

    let contactExist = false;
    let mapConversationList = new Map();
    let mapChatHistory = new Map();
    let templateConversationHistory = document.createElement('template');
    let templateConversation = document.createElement('template');
    let contactBlocked = [];

    const dataListContact = document.querySelector("[list-contact-template]");
    const listContactContainer = document.querySelector("[list-contact-container]");
    const searchInput = document.querySelector("[data-search]");
    const contactSelect = document.querySelector("[data-contact]");
    let users = [];


    //create list contact
    //index, name, img
    fetch("https://jsonplaceholder.typicode.com/users")
        .then(response => response.json())
        .then(data => {
            console.log("fetch placeholder!");
            users = data.map(user => {
                const contact = dataListContact.content.cloneNode(true).children[0];
                const img = contact.querySelector("[data-image]");
                const name = contact.querySelector("[data-name]");
                img.src = "https://upload.chatsdumonde.com/img_global/24-comportement/_light-18718-chat-qui-vole-objet-nourriture.jpg";
                name.textContent = user.name;
                listContactContainer.append(contact);
                return { name: user.name, img: user.email, element: contact };
            });

            // Récupérer tous les éléments de contact
            const contacts = document.querySelectorAll('.contact');

            // Ajouter un gestionnaire d'événements à chaque contact
            contacts.forEach(contact => {
                contact.addEventListener('click', () => {
                    const contactName = contact.querySelector("[data-name]").textContent;
                    const img = contact.querySelector("[data-image]").src;
                    //console.log(`Clic sur le contact ${contactName}. Image source: ${img}`);
                    searchInput.value = "";

                    //visibleAllContact();
                    if (findConversation(contactName)) {
                        selectConversation(contactName, "chat");
                    } else {
                        const obj = {
                            name: contactName,
                            imgSrc: img,
                        };
                        createConversation(obj);
                        document.getElementById('panelPrincipalId').classList.toggle('hide', true);
                        document.getElementById('chatBoxId').classList.toggle('hide', false);
                        contactExist = true;
                    }
                    document.getElementById('listContact').classList.replace("visible-y", "invisible-y");
                    document.getElementById('conversationListId').classList.toggle('hide', false);
                    isVisibleList = false;
                });

            });
        });

    // Charger le contenu du fichier template.html
    fetch('/chat/chat-tmp/')
        .then(response => response.text())
        .then(htmlContent => {
            console.log("fetch chat-tmp.html!");

            // Utiliser DOMParser pour extraire le contenu de la balise template
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');

            templateConversationHistory = doc.querySelector('template[conversation-history-template]');
            templateConversation = doc.querySelector('template[conversation-template]');
            //console.log("fetch=== ", templateConversationHistory.innerHTML);
        })
        .catch(error => console.error('Erreur de chargement du template:', error));


    //click manage
    document.addEventListener("click", (e) => {
        e.stopImmediatePropagation();
        refresh_display();

        console.log("e.target***: ", e.target);
        console.log("e.curtarget***: ", e.currentTarget);



        if (e.currentTarget.getElementById("searchContact").contains(e.target))
            search_contact();
        else if (contactExist) {
            const conversations = document.querySelectorAll(".conversation");
            conversations.forEach(conversation => {
                conversation.addEventListener("click", (e) => {
                    e.stopImmediatePropagation();
                    console.log("**TIME**");
                    handle_conversation(e);
                });
            });
        }
    });

    /*------function chat----------*/

    function refresh_display() {
        //hide list contact if actif
        if (isVisibleList) {
            document.getElementById('listContact').classList.replace("visible-y", "invisible-y");
            document.getElementById('conversationListId').classList.toggle('hide', false);
            isVisibleList = false;
        }
    }

    function search_contact() {

        console.log('CLICK ON SEARCH');
        if (!isVisibleList) {
            document.getElementById('conversationListId').classList.toggle('hide', true);
            document.getElementById('listContact').classList.replace("invisible-y", "visible-y");
            isVisibleList = true;
        }

        //input flux
        searchInput.addEventListener("input", function (e) {
            const value = e.target.value;
            users.forEach(user => {
                const isVisible = user.name.toLowerCase().includes(value.toLowerCase());
                console.log(user.element);
                user.element.classList.toggle("hide", !isVisible);
            });
        });
    }

    function blockContact(contactName, bool) {
        const chatBoxElement = (activeChatPanel === contactName) ? document.getElementById('chatBoxId') : mapChatHistory.get(contactName).querySelector("#chatBoxId");
        chatBoxElement.classList.toggle("disabled", bool);
    }



    function handle_conversation(event) {

        //dropdown
        if (event.currentTarget.querySelector(".dropdown .i-down").contains(event.target)) {
            console.log("click on dropdown: ", event.target.closest(".conversation"));
            console.log("on i-down: ", event.currentTarget.querySelector(".dropdown .i-down"));
            // Adjust z-index
            zIndexDropdown(event.currentTarget);

            //close dropdown if the cursor leave
            event.currentTarget.querySelector(".dropdown, .dropdown .dropdown-menu")
                .addEventListener("mouseleave", () => {
                    closeDropdown(event.target.closest(".dropdown"));
                });
            handle_dropdown_action(event.target.closest(".conversation"));
            return;
        }
        else {
            const contactName = event.currentTarget.querySelector(".text h6").textContent;
            console.log("click on conversation: ", contactName);
            selectConversation(contactName, "chat");
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
            const contactName = myTarget.querySelector(".text h6").textContent;
            console.log("click action: ", e.target.id);
            console.log("Target: ", contactName);



            if (e.target.id === "delId") {
                myTarget.remove();
                if (activeChatPanel === contactName) {
                    document.querySelector(".conversation-history").innerHTML = "";
                    document.getElementById('panelPrincipalId').classList.toggle('hide', false);
                }
                mapChatHistory.delete(contactName);
                mapConversationList.delete(contactName);
                if (mapConversationList.size === 0)
                    activeChatPanel = null;
            } else if (e.target.id === "blockUnblockId") {
                const blockUnblockElement = e.target;
                if (blockUnblockElement.textContent === "Block contact") {
                    blockContact(contactName, true);
                    blockUnblockElement.textContent = "Unblock contact";
                    console.log("contact was blocked");
                } else {
                    blockContact(contactName, false);
                    blockUnblockElement.textContent = "Block contact";
                    console.log("contact unblocked");
                }
            }
        });
    }

    function closeDropdown(myDropdown) {
        const dropdown = new bootstrap.Dropdown(myDropdown);
        dropdown.hide();
    }

    function selectConversation(contactName) {

        console.log(`select: ${contactName}`);
        console.log(`active chat: ${activeChatPanel}`);


        const htmlactiveChatPanel = document.querySelector(".conversation-history");
        htmlactiveChatPanel.innerHTML = mapChatHistory.get(contactName).innerHTML;

        updateChatHistory(activeChatPanel);

        activeChatPanel = contactName;

        document.getElementById('panelPrincipalId').classList.toggle('hide', true);
    }


    function visibleAllContact() {
        users.forEach(user => {
            user.element.classList.toggle("hide", false);
        });
    }



    function createConversation(obj) {
        const conversationList = document.getElementById("conversationListId");
        const tpl = templateConversation.content.cloneNode(true);
        //zIndexDropdown(tpl.querySelector(".conversation"));
        //set id conversation
        tpl.querySelector(".conversation").id = obj.name;
        const name = tpl.querySelector("[data-text] h6");
        const img = tpl.querySelector("[data-image]");
        name.textContent = obj.name;
        img.src = obj.imgSrc;
        conversationList.append(tpl);
        console.log(conversationList.innerHTML);
        updateMapConversations(name.textContent, tpl);
        createChatPanel(obj);
    }

    function createChatPanel(obj) {
        if (activeChatPanel)
            updateChatHistory(activeChatPanel);

        const conversationHistory = document.querySelector(".conversation-history");
        //update chatPanel, just keep the template child
        conversationHistory.innerHTML = "";

        const tpl = templateConversationHistory.content.cloneNode(true);
        const settingsTray = tpl.querySelector(".settings-tray");
        const img = settingsTray.querySelector("[data-image]");
        const name = settingsTray.querySelector("[data-text] h6");
        img.src = obj.imgSrc;
        name.textContent = obj.name;

        conversationHistory.append(tpl);
        activeChatPanel = obj.name;
        //console.log("template: ", conversationHistory.innerHTML);
        console.log("===Create ChatPanel===");
    }

    function findConversation(name) {
        return mapConversationList.has(name);
    }

    function updateChatHistory(contactName) {
        const element = document.createElement("div");
        element.innerHTML = document.querySelector(".conversation-history").innerHTML;
        mapChatHistory.set(contactName, element);
        console.log("MAP length: ", mapChatHistory.size);
        console.log("MAP key: ", contactName);
    }

    function updateMapConversations(contactName, element) {
        mapConversationList.set(contactName, element);
        console.log("===mapChatList updated!===");
    }


    document.getElementById("camId").addEventListener("click", function () {
        console.log("Click on icon camera");
        document.getElementById("inputFileId").click();
    });

    document.getElementById("inputFileId").onchange = function (e) {
        resizeImage(e.target.files[0]);
    };

    function resizeImage(imgFile) {
        if (imgFile) {
            let reader = new FileReader();
            reader.readAsDataURL(imgFile);

            reader.onload = function (e) {
                var img = document.createElement("img");
                img.src = e.target.result;

                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");

                img.onload = function () {
                    var MAX_WIDTH = 200;
                    var MAX_HEIGHT = 200;
                    var width = img.width;
                    var height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    let newurl = canvas.toDataURL(imgFile.type, 90);
                    document.getElementById("imageUploadedId").src = newurl;
                    console.log(document.getElementById("imageUploadedId").src);
                };
            };
        }
    }

    document.getElementById("nameInputId").addEventListener("keypress", function (e) {
        if (e.key === "Enter" && e.target.value) {
            console.log("string");
            //create class channel and save it on the list channel
            //and create the channel box with
            //toggle display list
        }
    });
}





/*-------------temp ---------------*/
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
