const sendbtn = document.getElementById('sendbtn');
const token = localStorage.getItem('token');
const inputBox = document.getElementById('comment');
const dummy = document.getElementById('dummy');
let remainingChat = []
let lastId = localStorage.getItem('lastId')


sendbtn.onclick = async () => {
    try {
        const message = inputBox.value;
        console.log(message);
        const response = await axios.post('http://localhost:3000/user/chat', { message }, { headers: { "Authorization": token } });
        console.log(response);
    }
    catch (err) {
        console.log(err);
    }
}

// window.addEventListener('DOMContentLoaded', displayChats())
window.addEventListener('DOMContentLoaded', async () => {
    dummy.innerHTML = '';
    if (localStorage.getItem('messages')) {
        remainingChat = localStorage.getItem('messages');
        remainingChat = JSON.parse(remainingChat);

        console.log(typeof remainingChat); // Log the type of remainingChat
        console.log('rem',remainingChat);
        if (remainingChat.length) {
            remainingChat.forEach(chat => {
                dummy.innerHTML += `<div class="col-8 mb-1">${chat.username} : ${chat.message}</div>`;
            })
            lastId = remainingChat[remainingChat.length - 1].id;
            console.log(lastId);
            localStorage.setItem('lastId', remainingChat[remainingChat.length - 1].id);
        }
    }
    else {
        const response = await axios.get(`http://localhost:3000/group/chats`);
        console.log('response.data==============', response.data);
        remainingChat = response.data

        if (remainingChat.length > 5) {
            const startIndex = remainingChat.length - 5;
            const lastFiveChats = remainingChat.slice(startIndex);
            remainingChat = lastFiveChats;
        }
        remainingChat.forEach(chat => {
            dummy.innerHTML += `<div class="col-8 mb-1">${chat.username} : ${chat.message}</div>`;
        });
        localStorage.setItem('messages', JSON.stringify(remainingChat));
        localStorage.setItem('lastId', remainingChat[remainingChat.length - 1].id);
    }
})

const interval = setInterval(displayChats, 1000);
clearInterval(interval);

async function displayChats() {
    lastId = localStorage.getItem('lastId')
    console.log('lastid>>>>>>>>>', lastId)
    const response = await axios.get(`http://localhost:3000/group/chats/?id=${lastId}`)
    console.log('responsenew>>>>>>>>', response.data);
    let newMsg = response.data
    newMsg.forEach(chat => {
        dummy.innerHTML += `<div class="col-8 mb-1">${chat.username} : ${chat.message}</div>`;
    });

    let remainingChat = JSON.parse(localStorage.getItem('messages')) || []
    let newArray = remainingChat.concat(newMsg)
    console.log('newarray==', newArray);
    if (newArray.length > 5) {
        const startIndex = newArray.length - 5;
        const lastFiveChats = newArray.slice(startIndex);
        newArray = lastFiveChats;
    }
    console.log('newarraylength==',newArray[newArray.length - 1].id);
    localStorage.setItem('messages', JSON.stringify(newArray));
    localStorage.setItem('lastId', newArray[newArray.length - 1].id);
}