const formSubmit = document.getElementById('login-form')
formSubmit.addEventListener('submit', login)
const notif = document.getElementsByClassName('notif')[0];

async function login(e) {
    e.preventDefault();

    const loginDetails = {
        email: e.target.email.value,
        password: e.target.password.value
    };

    try {
        const res = await axios.post('http://localhost:3000/user/login', loginDetails);
        if (response.status === 200) {
            alert(response.data.message);
            console.log(response.data);
            localStorage.setItem('token', response.data.token)
        }
    } catch (err) {
        console.log('error', err)
    }
}