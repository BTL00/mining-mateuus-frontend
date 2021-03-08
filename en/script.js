const createCardHTML = (id, username,) => {
    return `<div class="col-md-6"> <div class="card mt-3 " id="shares-card-${id}">
    <div class="card-header">
        ${username}
    </div>
    <div class="card-body">
        <h4 class="card-title" id="shares_${id}">-</h4>
        total shares
    </div>
</div></div>`;
}

const toggleMode = () => {
    const element = document.body;
    element.classList.toggle("dark-mode");
    const darkModeCookieValue = element.classList.contains("dark-mode");
    localStorage.setItem("dark-mode", darkModeCookieValue);
}

const getUsers = async (users, errorDiv) => {
    return fetch('https://mining.mateu.us/api/users').then(response => {
        errorDiv.classList.add('d-none')
        return response.json()
    }).catch(err => {
        errorDiv.classList.remove('d-none')
        return users
    })
}

const createCardsForUsers = (users, userListDiv) => {
    userListDiv.innerHTML = ''
    users.forEach((user) => {
        userListDiv.innerHTML += createCardHTML(user.id, user.name);
    });
}

const updateShareCounts = async (users) => {
    users.forEach(async user => {
        const element = document.getElementById(`shares_${user.id}`)
        element.innerHTML = (await fetch(`https://mining.mateu.us/api/share-count?id=${user.id}`).then(response => response.json()))
    })
}

if (localStorage.getItem("dark-mode") == "true") {
    document.body.classList.add("dark-mode");
}

const sameUsers = (a, b) => {
    if (a.length != b.length) {
        return false
    }
    for (let i = 0; i < a.length; i++) {
        if (!(a[i].id == b[i].id && a[i].name == b[i].name)) {
            return false
        }
    }
    return true
}

window.onload = () => {
    const updateStats = async (users, errorDiv, userListDiv) => {
        let newUsers = await getUsers(users, errorDiv)
        if (!sameUsers(users, newUsers)) {
            users = newUsers
            createCardsForUsers(users, userListDiv)
        }
        await updateShareCounts(users, errorDiv)
        setTimeout(updateStats, 2500, users, errorDiv, userListDiv)
    }

    updateStats([], document.getElementById('net-error'), document.getElementById("user-list"))
}
