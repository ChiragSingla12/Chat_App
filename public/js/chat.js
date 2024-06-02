const sendbtn = document.getElementById('sendbtn');
const token = localStorage.getItem('token');
const inputBox = document.getElementById('comment');
const dummy = document.getElementById('dummy');
let remainingChat = []
let lastId = localStorage.getItem('lastId');
const form = document.querySelector('form');
const chatting = document.querySelector('.dummy');
const leftPanel = document.querySelector('.groupList');


async function sendMsg(grpId) {
    try {
        const message = inputBox.value;
        console.log('grpID is => ', grpId);
        const response = await axios.post(`http://localhost:3000/group/newMsg?id=${grpId}`, { message }, { headers: { "Authorization": token } });
        inputBox.value = '';
        console.log('res data is: ', response.data);
    }
    catch (err) {
        console.log('error: ', err);
    }
}

async function fetchChats(groupId, event) {
    try {
        console.log('group id =>> ', groupId);
        const response = await axios.get(`http://localhost:3000/group/grpChats/?id=${groupId}`);
        console.log(response);
        console.log('response data is => ', response.data);
        // let newMsg = Object.values(response.data);
        document.querySelector('.right').classList.remove('d-none');
        document.getElementById('grpName').textContent = event.target.parentNode.parentNode.id;
        console.log('group name:=> ', event.target.parentNode.parentNode.id);
        dummy.innerHTML = '';
        let newMsg = response.data.chats
        console.log('type of--> ', typeof newMsg);
        newMsg.forEach(chat => {
            dummy.innerHTML += `<div class="col-8 mb-1">${chat.username} : ${chat.message}</div>`;
        });
        let remainingChat = JSON.parse(localStorage.getItem('messages')) || []
        let newArray = remainingChat.concat(newMsg)
        console.log('new array is => ',newArray);
        if (newArray.length > 5) {
            const startIndex = newArray.length - 5;
            const lastFiveChats = newArray.slice(startIndex);
            newArray = lastFiveChats;
        }
        console.log(newArray[newArray.length - 1].id);
        localStorage.setItem('messages', JSON.stringify(newArray));
        localStorage.setItem('lastId', newArray[newArray.length - 1].id);
        sendbtn.setAttribute('onclick', `sendMsg(${groupId})`);
    }
    catch (err) {
        console.log('error is ', err)
    }
}


let interval;
// Start the interval
interval = setInterval(function () {
                fetchChats(lastId);
                console.log(lastId);
            }, 1000);

// To stop the interval (clear it)
clearInterval(interval);


let createGrp = document.getElementById('createGrp');
createGrp.onclick = async () => {
    try {
        const { data } = await axios.get('http://localhost:3000/user/allusers', { headers: { "Authorization": token } });
        console.log('group ids==> ', data);
        document.querySelector('.groupList').classList.toggle('d-none');
        document.querySelector('.group').classList.toggle('d-none')
        const userList = document.querySelector('#userList');

        data.forEach((user, index) => {
            userList.innerHTML += 
            `<li class="list-group-item">
            <div class="form-check">
            <input class="form-check-input" type="checkbox" name="participant" id="${user.name}" value="${user.name}">
            <label class="form-check-label" for="${user.name}">${user.name}</label>
            </div>
            </li>`;
        })
    }
    catch (err) {
        console.log(err);
    }
}

// click on cross button
const cancelBtn = document.getElementById('cancel');
cancelBtn.onclick = (e) => {
    document.querySelector('.groupList').classList.toggle('d-none');
    form.classList.toggle('d-none');
    // showGrp();
}


form.onsubmit = async (e) => {
    try {
        e.preventDefault();
        console.log('e.target-=-=> ',e.target);
        const name = e.target.name.value;
        console.log('name', name);
        const members = [];
        let list = form.querySelectorAll('input[type="checkbox"]');
        console.log('list==> ',list);
        list.forEach(item => { if (item.checked) members.push(item.value); });
        console.log('members==> ',members);
        if (!members.length) {
            alert('Please select atleast one member to proceed!');
        }
        else {
            const groupDetails = {
                name, members
            }
            console.log('groupdetails==>', groupDetails);
            const { data } = await axios.post('http://localhost:3000/group/members', groupDetails, { headers: { "Authorization": token } });
            console.log('members data', data);
            document.querySelector('.groupList').classList.toggle('d-none');
            form.classList.toggle('d-none');
            showGrp();
        }
    }
    catch (err) {
        console.log(err);
    }
}


async function showGrp() {
    try {
        const response = await axios.get('http://localhost:3000/group/allGroup', { headers: { "Authorization": token } });
        const groupData = response.data;

        console.log('groupdata=> ', groupData);
        const ul = document.getElementById('grpList');
        groupData.forEach(group => {
            console.log(group.id + ' groupid');
            ul.innerHTML += `<li class='list-group-item' id='${group.name}' onclick='fetchChats(${group.id}, event)'>
                                <div class='d-flex'>
                                    <span class='text-size ms-3 me-4'><i class='bi bi-people'></i> </span>
                                    <h3>${group.name}</h3>
                                </div>
                            </li>`;
        })
    } catch (error) {
        console.error("Error fetching group data:", error);
    }
}


document.getElementById('logoutbtn').onclick = () => {
    window.location.href = '../views/login.html';
    localStorage.removeItem('token');
}


window.addEventListener('DOMContentLoaded', async () => {
    showGrp();

    dummy.innerHTML = '';

    if (localStorage.getItem('messages')) {
        remainingChat = localStorage.getItem('messages');
        remainingChat = JSON.parse(remainingChat);

        if (remainingChat.length) {
            remainingChat.forEach(chat => {
                dummy.innerHTML += `<div class="col-8 mb-1">${chat.username} : ${chat.message}</div>`;
            });

            lastId = remainingChat[remainingChat.length - 1].id;
            console.log(lastId);
            localStorage.setItem('lastId', remainingChat[remainingChat.length - 1].id);
        }
    } else {
        try {
            const response = await axios.get(`http://localhost:3000/user/chats`);
            console.log('resdata',  response.data);
            remainingChat = response.data;

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
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    }
});