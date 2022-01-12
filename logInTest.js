function init ()
{   console.log("hello");
    let button = document.getElementById("loginSubmit");
    let usernameBox = document.getElementById("usernameBox");
    let passwordBox = document.getElementById("passwordBox");
    button.onclick = loginInfoTest;
    console.log("check");
    }

function loginInfoTest(){
    console.log("yoooo");
    let usernameBox = document.getElementById("usernameBox");
    let passwordBox = document.getElementById("passwordBox");
    if(usernameBox.value.length == 0 || passwordBox.value.length == 0){
        let div = document.getElementById("loginErrorMsg");
        div.innerHTML = "You have not entered your username and/or password";
    }
}