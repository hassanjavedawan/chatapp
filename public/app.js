let welcome = document.getElementById('welcome');
let loginArea = document.getElementById('loginArea');
let registerArea = document.getElementById('regis');
let error_massage = document.getElementById('errorMassage');

//
let agree = () => {
  loginArea.style.display = 'block';
}

// 
let registerFild = () => {
  loginArea.style.display = 'none';
  registerArea.style.display = 'block';
  error_massage.style.display = 'none'

}
let loginFild = () => {
  error_massage.style.display = 'none'
  loginArea.style.display = 'block';
  registerArea.style.display = 'none';
}
//

let email = document.getElementById('email');
let password = document.getElementById('password');
let chatArea = document.getElementById('chatArea');
let logo = document.getElementById('logo');
let madeBy = document.getElementById('made-by');
let fullName = document.getElementById('fullName');
let modal = document.getElementById('modalArea');
let senderName;
let register = () => {
  firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
    .then(function (result) {
      senderName = email.value;
      firebase.database().ref('user info').push().set({
        "Email": senderName,
        "fullName": fullName.value

      })
      welcome.style.display = 'none';
      chatArea.style.display = 'block';
      registerArea.style.display = 'none';
      madeBy.style.display = 'none'
      error_massage.style.display = 'none';
      logo.style.display = 'none';
      modal.innerHTML = `<h4 class="modelSkip">Welcome  ${fullName.value}</h4>`;


      email.value = "";
      password.value = "";

    })
    .catch(function (error) {
      error_massage.style.display = "block"
      error_massage.innerHTML = error.message;
    });
}

// 
let loginEmail = document.getElementById('login_email');
let LoginPassword = document.getElementById('login_password');
let logout = document.getElementById('logout');

let login = () => {
  firebase.auth().signInWithEmailAndPassword(loginEmail.value, LoginPassword.value)
    .then(function (result) {
      senderName = loginEmail.value;
      welcome.style.display = 'none';
      logout.style.display = 'block';
      chatArea.style.display = 'block';
      loginArea.style.display = 'none'
      registerArea.style.display = 'none';
      madeBy.style.display = 'none'
      error_massage.style.display = 'none';
      logo.style.display = 'none';
      modal.innerHTML = `<h4 class="modelSkip">Welcome back to Chat Now</h4>`;
      loginEmail.value = "";
      LoginPassword.value = "";

    })
    .catch(function (error) {
      console.log(error.message);
      error_massage.style.display = "block";
      error_massage.innerHTML = error.message;

    });
}

let logOut = () => {
  firebase.auth().signOut();
  welcome.style.display = 'block';
  chatArea.style.display = "none";
  loginArea.style.display = "block";
  logo.style.display = "block";
  madeBy.style.display = "block";
  logout.style.display = 'none';
  window.location.reload();
}



//

let messages = document.getElementById('messages');
let myMessages = document.getElementById('myMessage');


let send = () => {
  let chackMessage = myMessages.value.split(' ').join('');
  if (chackMessage === "") {
    alert("Please Enter your messege!");
    return false;
  } else {
    let key = firebase.database().ref("user message").push().key;
    let myData = {
      key: key,
      fullName: fullName.value,
      sender: senderName,
      message: myMessages.value
    }
    firebase.database().ref("user message/" + key).set(myData)

    myMessages.value = "";
    messages.scrollTop = messages.scrollHeight;
    return false
  }
}
var tone = document.getElementById("tone");

let playAudio = () => { tone.play(); }


// // ///////////////////////
let displayName = document.getElementById('displayName');
firebase.database().ref("user message").on('child_added', function (data) {
  if (data.val().sender == senderName) {
    messages.innerHTML += `<li class="me" id="message-${data.val().key}">
        <p class="profileName">Me: </p>
          ${data.val().message}
       
<button type="button" class="delbtn" id="${data.val().key}" onclick="deleteItem(this)">Delete</button>

     </li>`
 
    displayName.innerHTML = data.val().sender;

  }
  else {
    messages.innerHTML += `<li class="other" >
    <p class="profileName">Messege is sent By: ${data.val().sender} </p>
     ${data.val().message}</li>`
     playAudio();
    displayName.innerHTML = data.val().sender;
  }
  messages.scrollTop = messages.scrollHeight;

})
//

let deleteItem = (del) => {
  firebase.database().ref('user message').child(del.id).remove()
  del.parentNode.remove();
};

//
firebase.database().ref('user message').on("child_removed", function (data) {
  document.getElementById(`message-${data.val().key}`).innerHTML = "This message has been deleted";
});

