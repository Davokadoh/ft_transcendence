document.addEventListener('DOMContentLoaded', () => {
    
    const socket = io();
    
    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const messages = document.getElementById('messages');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (input.value.trim() !== '') {
          socket.emit('chat message', input.value);
          input.value = '';
        }
      });
    } else {
      console.error("form is empty!");
    }

     socket.on('chat message', (msg) => {
      const item = document.createElement('li');
      item.textContent = msg;
      messages.appendChild(item);
      window.scrollTo(0, document.body.scrollHeight);
    });

  });