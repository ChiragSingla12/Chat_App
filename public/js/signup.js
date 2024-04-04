const formSubmit = document.getElementById('signup-form')
formSubmit.addEventListener('submit', signup)
const notif = document.getElementsByClassName('notif')[0];

async function signup(e) {
    try {
        e.preventDefault();

        const signupDetails = {
            name: e.target.name.value,
            email: e.target.email.value,
            phonenumber: e.target.phonenumber.value,
            password: e.target.password.value
        }
        const response = await axios.post('http://localhost:3000/user/signup', signupDetails)
        console.log(response);
        alert("Successfuly signed up");
        formSubmit.reset();
        window.location.href = "./views/login.html";

    }
    catch (err) {
        // console.log('err', err)
        if (err.response && err.response.status === 409) {
            alert('User already exists, Please Login')
            //     // document.body.innerHTML += `<div style="color:red;">User already exists, Please Login</div>`;
            // } else {
            //     document.body.innerHTML += `<div style="color:red;">${err}</div>`;
            // }
        }
    }
}
