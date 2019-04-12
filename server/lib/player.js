var util = require('./util');

class Player {
    constructor(id, role) {
        this.id = id;
        this.role = role;

        this.status = null;
        this.action = null;
        this.input = null;

        this.keys = {
            left: false,
            right: false,
            up: false,
            down: false,
            a: false,
            b: false
        };

        this.play = game => {

        }

        this.spectate = game => {

        }

        this.act = game => {
            util.is(this.role, ["player1", "player2"]) ? this.play(game) : this.spectate(game);
            this.input = null;
        }
    }
}
module.exports = Player;