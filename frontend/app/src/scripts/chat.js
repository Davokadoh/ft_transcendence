import { xyz50 } from "culori";
import * as sock from "socket.io-client"

const socket = sock.io('http://localhost:3000');
socket.on('chat', (msg) => {
    bubbleChatReceived(msg);
});



export function handleChatEvents() {
    
    //createListContact();
    
    /*--------handle toogle-------------*/
    let isVisibleChat = false;
    let isVisibleChannel = false;
    let isVisibleList = false;
    const chatInst = document.querySelector(".chat");
    const channelInst = document.querySelector(".channel");

    /*
    //print list contact
    chatInst.querySelector('#search').addEventListener("click", () => {
        if (isVisibleList === false) {
            document.getElementById('listContact').classList.toggle('visible-y');
            //document.getElementById('msgId').classList.replace('visible-x', 'invisible-x');
            isVisibleList = true;
        }

        else if (isVisibleList) {
            document.querySelector('html').addEventListener('click', () => {
                console.log("im here");
                document.getElementById('listContact').classList.replace('visible-y', 'invisible-y');
            });
        }
    });
    */
    
    
    

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

    /*-------------handle message-----------------*/
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



/*
function showListContact() {

}*/
