const createRoom = document.getElementById("create-room");
const checkBtn = document.getElementById("check-room");
const startGame = document.getElementById("start-game");
const cancel = document.getElementById("cancel-step");
const continueGame = document.getElementById("continue-game");
const modal = document.querySelector(".modal-container");
const leaderBoard = document.getElementById("leader-board");

const URL = "http://localhost:8080/room";

let currentRoom = null;

createRoom.addEventListener("click", (e) => {
    e.preventDefault();
    createNewRoomForm(e);
});

checkBtn.addEventListener("click", (e) => {
    e.preventDefault();
    checkRoom();
});

startGame.addEventListener("click", (e) => {
    e.preventDefault();
    onStartGame();
});

continueGame.addEventListener("click", (e) => {
    e.preventDefault();
    onStartExistingGame();
});


/* API Calls */
const onStartExistingGame = async () => {
    try {
        let name = document.getElementById("name");
        let code = document.getElementById("code");

        const data = {
            code: code.value.trim(),
            player: { name: name.value.trim(), highScore: "0", isOwner: false },
            roomId: currentRoom._id
        }
        const results = await postRequest(data, `${URL}/join`);
        modal.style.display = "none";
        localStorage.setItem("leader-board", JSON.stringify(results));
        localStorage.setItem("player-info", JSON.stringify({ name: name.value.trim(), highScore: "0", isOwner: false }));
        createLeaderBoard(results);
    } catch (error) {
        console.error(error);
        alert(error);
    }
};

const checkRoom = async () => {
    try {
        let roomId = document.getElementById("roomId");
        const data = { id: roomId.value };
        const results = await postRequest(data, `${URL}/checkRoom`);
        currentRoom = results;
        document.getElementById("code-form").style.display = "block";
        document.getElementById("existing-room").style.display = "none";
    } catch (error) {
        alert("Room does not exists");
    }
};

const createNewRoomForm = (e) => {
    document.getElementById("new-room-form").style.display = "block";
    document.getElementById("existing-room").style.display = "none";
};

const onStartGame = async () => {
    try {
        let name = document.getElementById("new-name");
        let code = document.getElementById("new-code");
        const data = {
            code: code.value.trim(),
            players: [{ name: name.value.trim(), highScore: "0", isOwner: true }],
            createdBy: { name: name.value.trim(), highScore: "0", isOwner: true },
            leader: null
        }
        const results = await postRequest(data, URL);
        modal.style.display = "none";
        localStorage.setItem("leader-board", JSON.stringify(results));
        localStorage.setItem("player-info", JSON.stringify({ name: name.value.trim(), highScore: "0", isOwner: true }));
        createLeaderBoard(results);
    } catch (error) {
        alert(error)
    }
};

const updateHighScore = (score) => {
    let player = localStorage.getItem("player-info");
    player = JSON.parse(player);
    let room = localStorage.getItem("leader-board");
    room = JSON.parse(room);

    player.highScore = score;
    localStorage.setItem("player-info", JSON.stringify(player));
    let data = {
        gamePlayer: player,
        roomId: room._id
    }
    postRequest(data, `${URL}/updateHighScore`);
}

const postRequest = (data, url) => {
    return new Promise(async (resolve, reject) => {
        try {
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            let raw = JSON.stringify(data);
            let requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch(url, requestOptions);
            const result = await response.json();
            resolve(result);
        } catch (error) {
            reject(error)
        }
    })
}


const createLeaderBoard = (room) => {
    let div = document.createElement("div");
    div.classList.add("leader-board");

    let h3 = document.createElement("h3");
    h3.classList.add("board-title");
    h3.textContent = "Leader Board"
    div.appendChild(h3);

    room.players.forEach((player, i) => {
        let holder = document.createElement("div");
        holder.classList.add("holder")
        let p1 = document.createElement("span");
        let p2 = document.createElement("span");
        let p3 = document.createElement("span");
        p1.textContent = i + 1;
        p2.innerHTML = player.name;
        p3.innerHTML = player.highScore;
        holder.appendChild(p1);
        holder.appendChild(p2);
        holder.appendChild(p3);
        div.appendChild(holder)
    });

    leaderBoard.appendChild(div);
};

const bootstrapLeaderBoard = async () => {
    let leadersboard = localStorage.getItem("leader-board");
    let player = localStorage.getItem("player-info");
    if (!leadersboard) modal.style.display = "block";
    else {
        player = JSON.parse(player);
        let _leadersBoard = JSON.parse(leadersboard);
        const data = { id: _leadersBoard.roomId };
        const results = await postRequest(data, `${URL}/checkRoom`);
        let _player = results.players.find(p => p.name === player.name);
        localStorage.setItem("player-info", JSON.stringify(_player));
        createLeaderBoard(results);
    }
};

bootstrapLeaderBoard();