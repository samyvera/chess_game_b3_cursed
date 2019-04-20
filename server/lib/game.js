var util = require('./util');
var Vector2D = require('./vector2D');
var Player = require('./player');

class Game {
    constructor() {
        this.turn = 1;
        this.players = [];
        this.grid = Array.from(Array(8), () => new Array(8));

        this.act = () => {
            if (this.players.length > 1) this.players.forEach(player => player.act(this));
        }

        this.createNewPlayer = socket => {
            var role;
            if (this.players.length === 0) role = "player1";
            else if (this.players.length === 1) role = "player2";
            else role = "spectator";
            return new Player(socket.id, role);
        }

        this.updatePlayers = playerRole => {
            this.players.forEach(player => {
                if (util.is(playerRole, ["player1", "player2"])) {
                    if (this.players[0].id === player.id) player = player.resetPlayer(player.id, "player1");
                    else if (this.players.length > 1 && this.players[1].id === player.id) player = player.resetPlayer(player.id, "player2");
                    this.turn = 1;
                }
                else if (this.players.length > 2 && !util.is(player.id, [this.players[0].id, this.players[1].id])) player = player.resetPlayer(player.id, "spectator");
            });
        }
    }
}
module.exports = Game;