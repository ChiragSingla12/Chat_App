const formSubmit = document.getElementById('login-form')
formSubmit.addEventListener('submit', login)

async function login(e) {
    e.preventDefault();

    const loginDetails = {
        email: e.target.email.value,
        password: e.target.password.value
    };

    try {
        const response = await axios.post('http://localhost:3000/user/login', loginDetails);
        // console.log(response.data);
        if (response.status === 200) {
            alert(response.data.message);
            console.log(response.data);
            localStorage.setItem('token', response.data.token);
            window.location.href = "/views/chat.html";
        }
    } catch (err) {
        console.log('json error is ', JSON.stringify(err));
        document.body.innerHTML += `<div style="color:red;">${err.message} <div>`;
    }
}