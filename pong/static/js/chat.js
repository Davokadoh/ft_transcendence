export function handleChatEvents() {
    
    //handle toogle
    let isVisibleChat = false;
    let isVisibleChannel = false;
    const chatInst = document.querySelector(".chat");
    const channelInst = document.querySelector(".channel");
    document.getElementById("chat-id").addEventListener("click", () => {
        console.log("CLICK ON CHAT");
        if (isVisibleChannel) {
            channelInst.classList.remove('is-visible');
            isVisibleChannel = false;
        }
        if (isVisibleChat)
            return;
        chatInst.classList.toggle('is-visible');
        isVisibleChat = true;
    });
    
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

    //handle message
    document.getElementById("send-id").addEventListener("click", sendMessage);
    document.getElementById("input-id").addEventListener("keypress", sendMessage);
}


function sendMessage(event) {
    
    const inputField = document.getElementById("input-id");
    if (event.type === "click" || event.type === "keypress" && event.key === "Enter") {
        if (inputField.value) {
            bubbleChatSent(inputField.value);
            //just for test
            bubbleChatReceived(inputField.value);
            inputField.value = "";
        }
    }
}

function bubbleChatReceived(value) {
    
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