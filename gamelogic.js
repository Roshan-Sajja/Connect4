let users = require("./users.json");
let game = require("./game.json");
const model = require("./businessLogic.js");
const { userExists } = require("./businessLogic");

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createGame(u1, u2) {
    if (!users.hasOwnProperty(u1.username) || !users.hasOwnProperty(u2.username)) {
        return null;
    }

    let num = getRndInteger(0, 10000);
    let newGame = {};
    newGame.gameID = num.toString();
    newGame.user1 = users[u1.username].username;
    newGame.user2 = users[u2.username].username;
    newGame.userTurn = newGame.user1;
    newGame.gameState = [];
    newGame.history = [];
    newGame.winner = null;
    newGame.active = true;

    game[num.toString()] = newGame;

    return game[num.toString];
}

function getGame(requestingUser, gameID) {
    if (!model.userExists(requestingUser)) {
        return null;
    }
    if (users[requestingUser.username].ongoingGames.includes(gameID)) {
        return game[gameID];
    } else {
        return null;
    }

}