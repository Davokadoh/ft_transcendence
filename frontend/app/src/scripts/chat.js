
$(document).ready( ()=> {

    //--------handle toogle-------------
    //let isVisibleChat = false;
    //let isVisibleChannel = false;
    let isVisibleList = false;
    let mapChatChannelList = new Map();
    let mapChatHistory = new Map();
    let activeChat = null;
    let templateConversationHistory = document.createElement('template');
    //const chatInst = document.querySelector(".chat");
    //const channelInst = document.querySelector(".channel");

    console.log('SCRIPT CHAT IS LOADED');

    //click everywhere
    $(document).on("click", function(event) {
        if (isVisibleList) {
            $('#listContact').toggleClass('visible-y');
            $('#conversationListId').toggleClass('hide', false);
            isVisibleList = false;
        }
    });
    

    const dataListContact = document.querySelector("[list-contact-template]");
    const listContactContainer = document.querySelector("[list-contact-container]");
    const searchInput = document.querySelector("[data-search]");
    const contactSelect =  document.querySelector("[data-contact]");
    let users = [];

    //click to select contact
    $(document).on("click", ".contact", function(e) {

        console.log("click contact");
        const contactName = $(this).find("[data-name]").text();
        const existingConversation = findConversation(contactName);
        searchInput.value = "";
        if (!existingConversation) {
            if (activeChat)
                saveChatHistory(activeChat);
            const obj = {
                name: contactName,
                imgSrc: $(this).find("img").attr("src")
            }  
            createConversation(obj);
            activeChat = contactName;
            $('#panelPrincipalId').toggleClass('hide', true);
            $('#chatBoxId').toggleClass('hide', false);

        }
        else
            selectConversation(contactName);
    });

    $(document).on("click", ".conversation", function(e) {
        const contactName = $(this).find("[data-text] h6").text();
        selectConversation(contactName);
    });
    
    // click search
    $("#searchContact").on("click", (e) => {
        
        e.stopPropagation();
        console.log('CLICK ON SEARCH');
        if (!isVisibleList) {
                $('#conversationListId').toggleClass('hide', true);
                $('#listContact').toggleClass('visible-y');
                isVisibleList = true;
        }

        //input flux
        searchInput.addEventListener("input", (e) => {

            const value = e.target.value;
            users.forEach( user => {

                const isVisible = user.name.toLowerCase().includes(value);
                console.log(user.element);
                user.element.classList.toggle("hide", !isVisible);
            });
        });
    })


    //create list contact
    //index, name, img
    fetch("https://jsonplaceholder.typicode.com/users" )
        .then(response => response.json())
        .then(data => {

                users = data.map(user => {
                const contact = dataListContact.content.cloneNode(true).children[0]
                const img = contact.querySelector("[data-image]")
                const name = contact.querySelector("[data-name]")
                img.src = "https://upload.chatsdumonde.com/img_global/24-comportement/_light-18718-chat-qui-vole-objet-nourriture.jpg"
                name.textContent = user.name
                listContactContainer.append(contact)
                return { name: user.name, img: user.email, element: contact }
            })
        })


    // Charger le contenu du fichier template.html
    fetch('src/template/conversation-history.html')
    .then(response => response.text())
    .then(htmlContent => {
        // Utiliser DOMParser pour extraire le contenu de la balise template
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        templateConversationHistory = doc.querySelector('template[conversation-history-template]');
        //console.log("fetch=== ", templateConversationHistory.innerHTML);
    })
    .catch(error => console.error('Erreur de chargement du template:', error));
    
    function selectConversation(contactName) {
        if (activeChat != contactName) {
            saveChatHistory(activeChat);
            const htmlActiveChat = document.querySelector(".conversation-history");
            htmlActiveChat.innerHTML = mapChatHistory.get(contactName);
            activeChat = contactName;
        }
    }

    function createConversation(obj) {
        const conversationList = document.querySelector(".conversation-list");
        /*if (conversationList.querySelector(".conversation")) {
            console.log(conversationList.children);
        }
        else
            console.log("conversation n'existe pas")*/
        const templateConversationList = document.querySelector("[conversation-template]");
        const dataConversation = templateConversationList.content.cloneNode(true).children[0]
        const name = dataConversation.querySelector("[data-text] h6");
        const img = dataConversation.querySelector("[data-image]");
        name.textContent = obj.name;
        img.src = obj.imgSrc;
        conversationList.append(dataConversation);
        //updateMapChat();
        createChatPanel(obj);
    }

    function createChatPanel(obj) {
        
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
        //console.log("template: ", conversationHistory.innerHTML);
        console.log("===Create ChatPanel===");
    }
    //function selectConversation(name) {}

    // Function to find a conversation by name
    function findConversation(name) {
        const conversationList = document.querySelector(".conversation-list");
        const conversations = conversationList.querySelectorAll(".conversation");

        for (const conversation of conversations) {
            const conversationName = conversation.querySelector("[data-text] h6").textContent;
            if (conversationName === name)
                return conversation;
        }
        return null;
    }

    function saveChatHistory(target_name) {
        mapChatHistory.set(target_name, document.querySelector(".conversation-history").innerHTML);
    }

    function updateMapChat() {
        mapChatChannelList.set("chat", document.querySelector(".conversation-list"));
        console.log("===mapChatList updated!===")
    }
    function updateMapChannel() {
        mapChatChannelList.set("channel", document.querySelector(".channel-list"));
        console.log("===mapChannelList updated!===")
    }
});




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

    
    
    
    //print chat discussion
    document.getElementById("chat-id").addEventListener("click", () => {
        console.log("CLICK ON CHAT");
        if (isVisibleChannel) {
            channelInst.classList.remove('visible-x');
            isVisibleChannel = false;
        }
        if (isVisibleChat)
            return;
        chatInst.classList.toggle('visible-x');
        isVisibleChat = true;
    });
    
    //print channel
    document.getElementById("idChannel").addEventListener("click", () => {
        console.log("CLICK ON CHANNEL");
        if (isVisibleChat) {
            chatInst.classList.remove('is-visible');
            isVisibleChat = false;
        }
        if (isVisibleChannel)
            return;
        channelInst.classList.toggle('is-visible');
        isVisibleChannel = true;
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
