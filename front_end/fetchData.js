const showLogedinUsername = () =>{
    const userName = document.getElementById("loged-username");

    let user = localStorage.getItem("logedInUser");
    if(user){
        user = JSON.parse(user);
    }

    userName.innerText = user.userName;
};

const checkLoggedInUser = () =>{
    let user = localStorage.getItem("logedInUser");
    if(user){
        user = JSON.parse(user);
    }else{
        window.location.href = "/front_end/login.html";
    }
};

const logout = () =>{
    localStorage.clear();
    checkLoggedInUser();
}


const fetchAllContacts = async() =>{

   let user = localStorage.getItem("logedInUser");
   if(user){
    user = JSON.parse(user);
   }

    try{
        const res = await fetch(`http://localhost:5000/getAllContacts?userID=${user.userID}`);
        const data = await res.json();
        showAllContacts(data);

        const totalcontactCounter = document.getElementById("totalNumber");
        totalcontactCounter.textContent = data.length;
    }
    catch (err){
        console.log("Error fetching data from server.");
    }
};


const showAllContacts = (allContacts) =>{
    const contContainer = document.getElementById("mainDataContainer");
    contContainer.innerHTML = "";

    allContacts.forEach((contact) =>{
        const contactDiv = document.createElement("div");
        contactDiv.classList.add("dataContainer");

        contactDiv.innerHTML = `
                    <div>
                        <p class="data">${contact.contactName}</p>
                    </div>
                
                    <div>
                        <p class="data">${contact.phoneNumber}</p>
                    </div>
                
                    <div>
                        <p class="data">${contact.emailAddress}</p>
                    </div>
                
                    <div>
                        <p class="data">${contact.address}</p>
                    </div>
                
                    <div>
                        <button onclick='openEditModal(${JSON.stringify(contact)})' class="action-btn"><i class="fa-solid fa-pen-to-square"></i>
                        </button>

                        <button onclick="deleteContact(${contact.contactID})" class="bin action-btn"><i class="fa-solid fa-trash"></i></i>
                        </button>
                    </div>
        `;
        contContainer.appendChild(contactDiv);
    });
}

const handleAddNewContact = async() =>{
    let user = localStorage.getItem("logedInUser");
    if(user){
        user = JSON.parse(user);
    }
    const saveContactUserID = user.userID; 
    
    const contactName = document.getElementById("contactName").value;

    const contactNumber = document.getElementById("phoneNumber").value;

    const contactMail = document.getElementById("email").value;

    const contactAddress = document.getElementById("address").value;


    if(!contactName || !contactNumber || !contactMail || !contactAddress){
        alert("Please enter all details here!");
        return;
    }

    const  contactObject = {
        userID : saveContactUserID,
        contactName : contactName,
        phoneNumber : contactNumber,
        emailAddress : contactMail,
        address : contactAddress,
    };

    try{
        const res = await fetch("http://localhost:5000/saveContact", {
            method : "POST",
            headers : {
                "content-type" : "application/json",
            },
            body : JSON.stringify(contactObject),
        });
        const data = await res.json();
    } 
    catch(err){
        console.log("Error wile sending new contact to the server... ");
    }
    finally{
        location.reload();
    }
};


const openModal = () =>{
    const modal = document.getElementById("addContactModal");
    modal.classList.remove("hidden");
}


const closeModal = () =>{
    const modal = document.getElementById("addContactModal");
    modal.classList.add("hidden");
}


const deleteContact = async (contactId) =>{
    if(confirm("Are you sure! You want to delete this contact?")){
        try{
            const res = await fetch(`http://localhost:5000/deleteContact/${contactId}`,{
                method : "DELETE"
            });
            const data = await res.json();
            if(data.success){
                fetchAllContacts();
            }
        }
        catch(err){
            console.log("Error deleting contact.");
        }
    }   
}

const searchContact = async() =>{
    const searchTerm = document.getElementById("srcBox").value;
    let user = JSON.parse(localStorage.getItem("logedInUser"));

    if(!searchTerm){
        fetchAllContacts();
        return;
    }

    try{
        const res = await fetch(`http://localhost:5000/searchContact?search=${searchTerm}&userID=${user.userID}`);
        const data = await res.json();
        showAllContacts(data);
    }
    catch(err){
        console.log("Error searching contact.");
    }
}


let editingContactId = null;

const openEditModal = (contact) =>{
    editingContactId = contact.contactID;
    document.getElementById("contactName").value = contact.contactName;
    document.getElementById("phoneNumber").value = contact.phoneNumber;
    document.getElementById("email").value = contact.emailAddress;
    document.getElementById("address").value = contact.address;
    openModal();
}


const updateContact = async () =>{
    const contactData = {
        contactID : editingContactId,
        contactName : document.getElementById("contactName").value,
        phoneNumber : document.getElementById("phoneNumber").value,
        emailAddress : document.getElementById("email").value,
        address : document.getElementById("address").value,
    };

    try{
        const res = await fetch("http://localhost:5000/updateContact",{
            method : "POST",
            headers : {
                "content-type" : "application/json",
            },
            body : JSON.stringify(contactData),
        });
        const data = await res.json();
        if(data.success){
            closeModal();
            fetchAllContacts();
        }
    }
    catch(err){
        console.log("Error updating contact.")
    }
}

fetchAllContacts();

checkLoggedInUser();

showLogedinUsername();