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
    const response = await fetch(`https://mining.mateu.us/api/all`);
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
        const response = await fetch(`https://mining.mateu.us/api/user-shares?id=${e.id}`);
        const myJson = await response.json(); 
        const element = document.getElementById(`shares_${e.id}`);
        counts[e.id] = myJson.length;
        element.innerHTML = counts[e.id];
    });
}


const clearTable = () => {
    tableElement.innerHTML = "";
}


let tableJson = [];


const jsonDiff = (json_new, json_old) => {
    let toAdd = [];
    if(json_new.length > tableJson.length) {
        toAdd += json_new.filter((e, i) =>  {
            return i >= tableJson.length;
        });
    }
    return toAdd;
}


const getTable = async () => {
    const response = await fetch(`https://mining.mateu.us/api/all`);
    const myJson = await response.json(); 

    myJson.shares.forEach(element => {
        tableElement.innerHTML += getRowHTML(element.id, element.date)
    });
    

}

const getTableIfDiff = async () => {
    const response = await fetch(`https://mining.mateu.us/api/all`);
    const myJson = await response.json(); 
    let diffArr = jsonDiff(myJson.shares, tableJson.shares);
    diffArr.forEach(element => {
        tableElement.innerHTML += getRowHTML(element.id, element.date)
    });
        tableJson = myJson;
    

}

if(localStorage.getItem("dark-mode") == "true") {
    document.body.classList.add("dark-mode");
}


const onTick = () => {
    getShareCounts();
    getTableIfDiff();
}
clearTable();
getTable().then(
    () => {
        getUsers().then(() => {
            createCardsForUsers();
            onTick();
            setInterval(onTick, 15000);
        });

    }
)

