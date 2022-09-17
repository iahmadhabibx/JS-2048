const createRoom = document.getElementById("create-room");
const checkBtn = document.getElementById("check-room");
const startGame = document.getElementById("start-game");
const continueGame = document.getElementById("continue-game");

const URL = "http://localhost:8080";
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

const onStartExistingGame = async () => {
   try {
    let name = document.getElementById("name");
    let code = document.getElementById("code");

    const data = {
        code: code.value.trim(),
        player: { name: name.trim(), highScore: "0", isOwner: true },
        roomId: currentRoom._id
    }

    const results = await postRequest(data, `${URL}/join`); 
   } catch (error) {
       alert("Error while joining the room")
   }
};

const checkRoom = async () => {
    try {
        let roomId = document.getElementById("roomId");
        const data = { id: roomId }
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

        const results = await postRequest(data, `${URL}/room`);
    } catch (error) {
        console.log(error);
        alert("Error while starting the game, please try again")
    }
};

const postRequest = (data, url) => {
    return new Promise((resolve, reject) => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify(data);

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(url, requestOptions).then(response => response.text())
            .then(result => resolve(result))
            .catch(error => reject(error));
    })
}