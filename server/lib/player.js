var util = require('./util');
var Vector2D = require('./vector2D');
var Piece = require('./piece');

class Player {
    constructor(id, role) {
        this.id = id;
        this.role = role;
        this.pos = new Vector2D(0, 0);
        this.speed = 2;

        this.createArmy = () => {
            var army = [];
            if (this.role === "player1") {
                this.pos = new Vector2D(4 * 16 + 8, 8);
                army.push(new Piece("king", new Vector2D(4, 0), "white"));
                army.push(new Piece("queen", new Vector2D(3, 0), "white"));
                army.push(new Piece("rook", new Vector2D(0, 0), "white"));
                army.push(new Piece("rook", new Vector2D(7, 0), "white"));
                army.push(new Piece("knight", new Vector2D(1, 0), "white"));
                army.push(new Piece("knight", new Vector2D(6, 0), "white"));
                army.push(new Piece("bishop", new Vector2D(2, 0), "white"));
                army.push(new Piece("bishop", new Vector2D(5, 0), "white"));
                for (let i = 0; i < 8; i++) army.push(new Piece("pawn", new Vector2D(i, 1), "white"));
            }
            else if (this.role === "player2") {
                this.pos = new Vector2D(4 * 16 + 8, 7 * 16 + 8);
                army.push(new Piece("king", new Vector2D(4, 7), "black"));
                army.push(new Piece("queen", new Vector2D(3, 7), "black"));
                army.push(new Piece("rook", new Vector2D(0, 7), "black"));
                army.push(new Piece("rook", new Vector2D(7, 7), "black"));
                army.push(new Piece("pawn", new Vector2D(4, 4), "black"));
                army.push(new Piece("pawn", new Vector2D(5, 5), "black"));
                army.push(new Piece("knight", new Vector2D(1, 7), "black"));
                army.push(new Piece("knight", new Vector2D(6, 7), "black"));
                army.push(new Piece("bishop", new Vector2D(2, 7), "black"));
                army.push(new Piece("bishop", new Vector2D(5, 7), "black"));
                for (let i = 0; i < 8; i++) army.push(new Piece("pawn", new Vector2D(i, 6), "black"));
            }
            return army;
        }
        this.army = this.createArmy();

        this.status = null;
        this.action = null;
        this.input = null;

        this.selectedPiece = null;

        this.keys = {
            left: false,
            right: false,
            up: false,
            down: false,
            a: false,
            b: false
        };

        this.resetPlayer = (id, role) => {
            this.id = id;
            this.role = role;
            this.pos = null;
            this.speed = 2;
            
            this.army = this.createArmy();

            this.status = null;
            this.action = null;
            this.input = null;
    
            this.selectedPiece = null;
            this.possibleMoves = null;
    
            this.keys = {
                left: false,
                right: false,
                up: false,
                down: false,
                a: false,
                b: false
            };
        }

        this.moveCursor = game => {
            if (this.keys.up && this.pos.y > 8) this.pos.y -= this.speed;
            else if (this.keys.down && this.pos.y < 7 * 16 + 8) this.pos.y += this.speed;
            if (this.keys.left && this.pos.x > 8) this.pos.x -= this.speed;
            else if (this.keys.right && this.pos.x < 7 * 16 + 8) this.pos.x += this.speed;
        }

        this.select = game => {
            if (this.keys.a && this.action !== "select") {
                game.players.forEach(player => {
                    player.army.forEach(piece => {
                        if (Math.trunc(this.pos.x / 16) === piece.pos.x && Math.trunc(this.pos.y / 16) === piece.pos.y && player.role === this.role) {
                            this.action = "select";
                            piece.status = "selected";
                            this.selectedPiece = piece;
                            this.possibleMoves = this.selectedPiece.getMoves(game);
                        }
                    });
                });
            }
            else if (this.keys.b && this.action === "select") {
                this.action = null;
                this.selectedPiece.status = null;
                this.selectedPiece = null;
                this.possibleMoves = null;
            }
        }

        this.moveIdlePos = game => {
            if (this.pos.x !== this.idlePos.x || this.pos.y !== this.idlePos.y) {
                if (this.pos.x < this.idlePos.x) {
                    this.pos.x += this.speed;
                }
                else if (this.pos.x > this.idlePos.x) {
                    this.pos.x -= this.speed;
                }
                if (this.pos.y < this.idlePos.y) {
                    this.pos.y += this.speed;
                }
                else if (this.pos.y > this.idlePos.y) {
                    this.pos.y -= this.speed;
                }
            }
        }

        this.play = game => {
            this.action = this.input ? this.input : this.action;
            this.idlePos = new Vector2D(Math.trunc(this.pos.x / 16) * 16 + 8, Math.trunc(this.pos.y / 16) * 16 + 8);
            if (!this.status) {
                this.select(game);
                if (!this.action) {
                    if (this.keys.up || this.keys.left || this.keys.down || this.keys.right) {
                        this.moveCursor(game);
                    }
                    else {
                        this.moveIdlePos(game);
                    }
                }
                else if (this.action === "select") {
                    this.moveIdlePos(game);
                }
            }
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