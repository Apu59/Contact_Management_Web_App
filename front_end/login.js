const handleLogin = async() => {
    const userIdInput = document.getElementById("userId");
    const userPassInput = document.getElementById("pass");

    const userId = userIdInput.value;
    const userPass = userPassInput.value;

   const user = {
    userID : userId,
    password : userPass,
   };

   const userInformation = await fetchUserInfo(user);
   const errorMessage = document.getElementById("errorMsg");

   if(userInformation.length == 0){
    errorMessage.classList.remove("hidden");
   }else{
    errorMessage.classList.add("hidden");
    localStorage.setItem("logedInUser", JSON.stringify(userInformation[0]));
    window.location.href = "/front_end/dashboard.html";
   }
};

const fetchUserInfo = async(userInfo) => {
    let data;
   try{
     const res = await fetch("http://localhost:5000/getUserInfo", {
        method: "POST",
        headers: {
            "content-type" : "application/json",
        },
        body: JSON.stringify(userInfo),
    });

    data = await res.json();
   }
   
   catch (err) {
    console.log("Error connecting to the serer", err);
   }
   
   finally{
    return data;
   }
};

