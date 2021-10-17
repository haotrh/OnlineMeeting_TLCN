(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const socket = io("http://localhost:8080");
const form = document.querySelector('form');
const messages = document.querySelector('#messages');
const message = document.querySelector('#message');

fetch('http://localhost:8080/api/chat/load',{
        method: 'POST',
        credentials: 'include',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': ''
        },
        body: JSON.stringify({
            "code" : "admin",
            "password" : ""
        })
    })
    .then(res => res.json())
    .then(createMessages)
    .catch(err => {
        console.log(err)
    })

function createMessage(msg) {
    console.log(msg)
    const li = document.createElement('li');
    li.textContent =`${msg.message},${msg.username},${msg.createdAt}`
    messages.append(li);
}

function createMessages(msgs) {
    console.log(msgs)
    // const msgdata = JSON.parse(msgs.data)
    msgs.forEach(createMessage);
} 

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = JSON.stringify({
        code: 'admin',
        message: document.querySelector('#message').value,
        username: document.querySelector('#username').value
    })
    socket.emit('send message', msg)

    // e.target.reset();
});

socket.on('load message', msgs => {
    console.log(msgs)
    message.innerHTML = "";
    createMessages(msgs);
});

},{}]},{},[1]);
