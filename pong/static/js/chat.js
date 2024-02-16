
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

    const chatSocket = new WebSocket(
        'ws://'
        + window.location.host
        + '/ws/chat/'
        + 'conversation'
        + '/'
    );


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
                        selectConversation(contactName);
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

            if (e.currentTarget.getElementById("send-id").contains(e.target))
                sendByMe(e);
            else {
                const conversations = document.querySelectorAll(".conversation");
                conversations.forEach(conversation => {
                    conversation.addEventListener("click", (e) => {
                        e.stopImmediatePropagation();
                        handle_conversation(e);
                    });
                });
            }
        }

    });

    //event keypress
    document.addEventListener("keypress", (e) => {
        if (e.currentTarget.getElementById("input-id").contains(e.target))
            sendByMe(e);
    });

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

    function handle_conversation(event) {

        //dropdown
        if (event.currentTarget.querySelector(".dropdown .i-down").contains(event.target)) {
            console.log("click on dropdown: ", event.target.closest(".conversation"));
            console.log("on i-down: ", event.currentTarget.querySelector(".dropdown .i-down"));

            var displayingDrop = document.getElementById("menuDownLeftId").nextElementSibling;

            //just adjust zindex when drop displaying
            if (displayingDrop.classList.contains("show"))
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
            selectConversation(contactName);
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
                if (mapConversationList.size === 0) {
                    activeChatPanel = null;
                    contactExist = false;
                }
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

    function blockContact(contactName, bool) {
        const chatBoxElement = (activeChatPanel === contactName) ? document.getElementById('chatBoxId') : mapChatHistory.get(contactName).querySelector("#chatBoxId");
        chatBoxElement.classList.toggle("disabled", bool);
    }

    function closeDropdown(myDropdown) {
        const dropdown = new bootstrap.Dropdown(myDropdown);
        dropdown.hide();
    }

    function selectConversation(contactName) {

        console.log(`select: ${contactName}`);
        console.log(`active chat: ${activeChatPanel}`);

        updateChatHistory(activeChatPanel);

        const htmlactiveChatPanel = document.querySelector(".conversation-history");
        htmlactiveChatPanel.innerHTML = mapChatHistory.get(contactName).innerHTML;

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

    //-------------handle message-----------------

    chatSocket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        console.log("===received message:===", data.message);
        //$('#chatMessages').append('<li>' + data.message + '</li>');
    };

    function sendByMe(event) {

        console.log("Click from input chat: ", event.type);
        const inputField = document.getElementById("input-id");
        if ((event.type === "click" || event.key === "Enter") && inputField.value) {

            console.log(`message sent: ${inputField.value}`);

            //test websocket
            chatSocket.send(JSON.stringify({
                'message': inputField.value
            }));

            //just for test receive and send 
            event.key === "Enter" ? createBubbleChat(inputField.value, "send") : createBubbleChat(inputField.value, "receive");
            //socket.emit('chat message', inputField.value);
            //bubbleChatReceived(inputField.value);
            inputField.value = "";
        }
    }

    function createBubbleChat(value, status) {

        console.log("BUBBLE CHAT SENT => FUNCTION");
        //take class
        const chatPanel = document.getElementById("chatPanelId");
        const element = document.createElement("div");

        if (status === "send") {
            element.className = "row g-0";
            element.innerHTML = `
        <div class="col-md-3 offset-md-9 d-flex">
            <div class="chat-bubble chat-bubble--blue chat-bubble--right ms-auto" id="msgByMeId">
                ${value}
            </div>
        </div>`;
            chatPanel.append(element);
        }
        else if (status === "receive") {
            element.className = "row g-0";
            element.innerHTML = `
                <!--msg from friend-->
                <div class="col-md-3 d-flex">
                    <div class="chat-bubble chat-bubble--left" id="msgByOtherId">
                        ${value}
                    </div>
                </div>`;
            chatPanel.append(element);
        }
        scrollUp(document.getElementById("rowChatPanel"));
    }

    function scrollUp(element) {
        if (element.scrollHeight > element.clientHeight) {
            // Définissez la valeur de scrollTop sur la hauteur totale de l'élément scrollable
            element.scrollTop = element.scrollHeight;
        }
    }
}









