const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

const socket = io();

let userName = '';

const login = (e) => {
  e.preventDefault();
  if (!userNameInput.value) {
    alert('User Name must not be empty');
  } else {
    userName = userNameInput.value;
    socket.emit('userName', userName);
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
  }
};

const addMessage = (author, content) => {
  const message = document.createElement('li');
  message.classList.add('message', 'message--received');
  if (author === userName) {
    message.classList.add('message--self');
  }
  if (author === 'Chat Bot') {
    message.classList.add('message--bot');
  }
  message.innerHTML = ` <h3 class="message__author">${
    author === userName ? 'You' : author
  }</h3>
    <div class="message__content">${content}</div>
  </li>`;
  messagesList.appendChild(message);
};

const sendMessage = (e) => {
  e.preventDefault();
  if (!messageContentInput.value) {
    alert('You must write the message');
  } else {
    addMessage(userName, messageContentInput.value);
    socket.emit('message', {
      author: userName,
      content: messageContentInput.value,
    });
    messageContentInput.value = '';
  }
};

socket.on('message', ({ author, content }) => addMessage(author, content));

loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);
