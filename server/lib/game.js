var util = require('./util');
var Player = require('./player');

class Game {
    constructor() {
        this.players = [];

        this.act = () => {
            this.players.forEach(player => player.act(this));
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
                    if (this.players[0].id === player.id) {
                        player.role = "player1";
                    } else if (this.players.length > 1 && this.players[1].id === player.id) {
                        player.role = "player2";
                    }
                } else if (this.players.length > 2 && !util.is(player.id, [this.players[0].id, this.players[1].id])) {
                    player.role = "spectator";
                }
            });
        }
    }
}
module.exports = Game;