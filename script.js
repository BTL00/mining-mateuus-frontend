const getRowHTML = (user, time) => {
    return `<tr><td scope=\"row\">${user}</td><td>${time}</td></tr><tr>`;
}
const getCardHTML = (id, username, ) => {
    return `<div class="col-md-6"> <div class="card mt-3 " id="shares-card-${id}">
    <div class="card-header">
        ${username}
    </div>
    <div class="card-body">
        <h4 class="card-title" id="shares_${id}"></h4>
        total szerów
    </div>
    <div class="card-footer text-muted">
        <a href="javascript:updateTitle(${id})">wyświetlaj w tytule</a>
    </div>
</div></div>`;
}

const toggleMode = () => {
    const element = document.body;
    element.classList.toggle("dark-mode");
    let darkModeCookieValue = element.classList.contains("dark-mode");
    localStorage.setItem("dark-mode", darkModeCookieValue);
  }
  

const updateTitleOnce = (id) => {
    let all = 0;
    counts.forEach((item,index) => {
            all += item;
    });
    document.title = `${counts[id]}/${all} - kopalnia` ;
    
}

const updateTitle  = (id) => {    
    updateTitleOnce(id);
    setInterval(updateTitleOnce, 5000, id);
}

const testJsonAll = `{"users":[{"id":1,"name":"Mateusz"},{"id":2,"name":"Piotr"}],"shares":[]}`;
const testJsonUserShares = `[]`;

let userListElement = document.getElementById("user-list");
let tableElement = document.getElementById("table-body-shares");

let users = [];
let counts = [];

const getUsers = async () => {
    const response = await fetch(`https://mining.mateu.us/all`);
    const myJson = await response.json(); 
    users = myJson.users;
}

const createCardsForUsers = () => {
    users.forEach((user) => {
        userListElement.innerHTML += getCardHTML(user.id, user.name);
    });
}

const getShareCounts = async () => {
    users.forEach(async e => {
        const response = await fetch(`https://mining.mateu.us//user-shares?id=${e.id}`);
        const myJson = await response.json(); 
        const element = document.getElementById(`shares_${e.id}`);
        counts[e.id] = myJson.length;
        element.innerHTML = counts[e.id];
    });
}


const clearTable = () => {
    tableElement.innerHTML = "";
}

const getTable = async () => {
    const response = await fetch(`https://mining.mateu.us/all`);
    const myJson = await response.json(); 
    myJson.shares.forEach(element => {
        tableElement.innerHTML += getRowHTML(element.id, element.date)
    });
}

if(localStorage.getItem("dark-mode") == "true") {
    document.body.classList.add("dark-mode");
}


const onTick = () => {
    getShareCounts();
    clearTable();
    getTable();
}

getUsers().then(() => {
    createCardsForUsers();
    onTick();
    setInterval(onTick, 15000);
});



