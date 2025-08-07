const handleRegistration = async() =>{
    const userNameInput = document.getElementById("name");
    const userName = userNameInput.value;

    const userEmailInput = document.getElementById("email");
     const userEmail = userEmailInput.value;

    const passwordInput = document.getElementById("pass");
    const password = passwordInput.value;

    const cPasswordInput = document.getElementById("cPass");
    const cPassword = cPasswordInput.value;


    if(!userName || !userEmail || !password || !cPassword){
        alert("Need all fields for registration.")
        return;
    }


    if(password != cPassword){
        alert("Password and Confirm Password not matched!");
        return;
    }

    const registrationObject = {
        userName : userName,
        userEmail : userEmail,
        userPassword : password,
    };

    try{
        const res = await fetch("http://localhost:5000/register", {
            method : "POST",
            headers : {
                "content-type" : "application/json",
            },
            body : JSON.stringify(registrationObject),
        });

        const data = await res.json();

         

        if(data.message == "Success"){
            alert(`Registration Successful! \nYour User ID is : ${data.userID} \nPlease save this for login.`);
            window.location.href = "/front_end/login.html";
        }
        else if(data.message == "Email already exist."){
            alert("The email already registered.");
        }
        else{
            alert("Registration Failed! Please try again.");
        }
        
    }
    catch(err){
        alert("Network error. Please try again!");
    }

};

