var util = require('./util');
var Vector2D = require('./vector2D');

class Piece {
    constructor(role, pos, color) {
        this.role = role;
        this.pos = pos;
        this.color = color;
        this.status = "alive";

        this.getMoves = game => {
            var moves = [];
            if (this.role === "king") {
                for (let i = this.pos.y - 1; i <= this.pos.y + 1; i++) {
                    for (let j = this.pos.x - 1; j <= this.pos.x + 1; j++) {
                        var obstacle = false;
                        game.players.forEach(player => {
                            player.army.forEach(piece => {
                                if (piece.pos.x === j && piece.pos.y === i || i < 0 || i > 7 || j < 0 || j > 7) obstacle = true;
                            });
                        });
                        if (!obstacle) moves.push(new Vector2D(j, i));
                    }
                }
            }
            else if (this.role === "queen") {
                for (let i = this.pos.y - 7; i <= this.pos.y + 7; i++) {
                    for (let j = this.pos.x - 7; j <= this.pos.x + 7; j++) {
                        var obstacle = false;
                        game.players.forEach(player => {
                            player.army.forEach(piece => {
                                if (piece.pos.x === j && piece.pos.y === i || Math.abs(j - this.pos.x) !== Math.abs(i - this.pos.y) && (this.pos.x !== j && this.pos.y !== i) ||
                                    i < 0 || i > 7 || j < 0 || j > 7) obstacle = true;
                            });
                        });
                        if (!obstacle) moves.push(new Vector2D(j, i));
                    }
                }
            }
            else if (this.role === "rook") {
                for (let i = this.pos.y - 7; i <= this.pos.y + 7; i++) {
                    for (let j = this.pos.x - 7; j <= this.pos.x + 7; j++) {
                        var obstacle = false;
                        game.players.forEach(player => {
                            player.army.forEach(piece => {
                                if (piece.pos.x === j && piece.pos.y === i || (this.pos.x !== j && this.pos.y !== i) || i < 0 || i > 7 || j < 0 || j > 7) obstacle = true;
                            });
                        });
                        if (!obstacle) moves.push(new Vector2D(j, i));
                    }
                }
            }
            else if (this.role === "knight") {
                for (let i = this.pos.y - 2; i <= this.pos.y + 2; i++) {
                    for (let j = this.pos.x - 2; j <= this.pos.x + 2; j++) {
                        var obstacle = false;
                        game.players.forEach(player => {
                            player.army.forEach(piece => {
                                if (piece.pos.x === j && piece.pos.y === i || !(Math.abs(j - this.pos.x) === 1 && Math.abs(i - this.pos.y) === 2) &&
                                    !(Math.abs(j - this.pos.x) === 2 && Math.abs(i - this.pos.y) === 1) ||i < 0 || i > 7 || j < 0 || j > 7) obstacle = true;
                            });
                        });
                        if (!obstacle) moves.push(new Vector2D(j, i));
                    }
                }
            }
            else if (this.role === "bishop") {
                for (let i = this.pos.y - 7; i <= this.pos.y + 7; i++) {
                    for (let j = this.pos.x - 7; j <= this.pos.x + 7; j++) {
                        var obstacle = false;
                        game.players.forEach(player => {
                            player.army.forEach(piece => {
                                if (piece.pos.x === j && piece.pos.y === i || Math.abs(j - this.pos.x) !== Math.abs(i - this.pos.y) || i < 0 || i > 7 || j < 0 || j > 7) obstacle = true;
                            });
                        });
                        if (!obstacle) moves.push(new Vector2D(j, i));
                    }
                }
            }
            else if (this.role === "pawn") {
                for (let i = this.pos.y - 2; i <= this.pos.y + 2; i++) {
                    var obstacle = false;
                    game.players.forEach(player => {
                        player.army.forEach(piece => {
                            if (piece.pos.y === i && piece.pos.x === this.pos.x || this.color === "white" && (i < this.pos.y || i - this.pos.y === 2 && this.pos.y !== 1) ||
                            this.color === "black" && (i > this.pos.y || i - this.pos.y === -2 && this.pos.y !== 6) || i < 0 || i > 7) obstacle = true;
                        });
                    });
                    if (!obstacle) moves.push(new Vector2D(this.pos.x, i));
                }
            }
            return moves;
        }

        this.getAttacks = game => {
            var attacks = [];
            if (this.role === "king") {
                for (let i = this.pos.y - 1; i <= this.pos.y + 1; i++) {
                    for (let j = this.pos.x - 1; j <= this.pos.x + 1; j++) {
                        game.players.forEach(player => {
                            player.army.forEach(piece => {
                                if (piece.pos.x === j && piece.pos.y === i && this.color !== piece.color) attacks.push(new Vector2D(j, i));
                            });
                        });
                    }
                }
            }
            else if (this.role === "queen") {
                for (let i = this.pos.y - 7; i <= this.pos.y + 7; i++) {
                    for (let j = this.pos.x - 7; j <= this.pos.x + 7; j++) {
                        game.players.forEach(player => {
                            player.army.forEach(piece => {
                                if (this.color !== piece.color && piece.pos.x === j && piece.pos.y === i &&
                                    ((this.pos.x === j || this.pos.y === i) ||
                                    Math.abs(j - this.pos.x) === Math.abs(i - this.pos.y))) attacks.push(new Vector2D(j, i));
                            });
                        });
                    }
                }
            }
            else if (this.role === "rook") {
                for (let i = this.pos.y - 7; i <= this.pos.y + 7; i++) {
                    for (let j = this.pos.x - 7; j <= this.pos.x + 7; j++) {
                        game.players.forEach(player => {
                            player.army.forEach(piece => {
                                if (this.color !== piece.color && piece.pos.x === j && piece.pos.y === i &&
                                    (this.pos.x === j || this.pos.y === i)) attacks.push(new Vector2D(j, i));
                            });
                        });
                    }
                }
            }
            else if (this.role === "knight") {
                for (let i = this.pos.y - 2; i <= this.pos.y + 2; i++) {
                    for (let j = this.pos.x - 2; j <= this.pos.x + 2; j++) {
                        game.players.forEach(player => {
                            player.army.forEach(piece => {
                                if (this.color !== piece.color && piece.pos.x === j && piece.pos.y === i && ((Math.abs(j - this.pos.x) === 1 && Math.abs(i - this.pos.y) === 2) ||
                                    (Math.abs(j - this.pos.x) === 2 && Math.abs(i - this.pos.y) === 1))) attacks.push(new Vector2D(j, i));
                            });
                        });
                    }
                }
            }
            else if (this.role === "bishop") {
                for (let i = this.pos.y - 7; i <= this.pos.y + 7; i++) {
                    for (let j = this.pos.x - 7; j <= this.pos.x + 7; j++) {
                        game.players.forEach(player => {
                            player.army.forEach(piece => {
                                if (this.color !== piece.color && piece.pos.x === j && piece.pos.y === i &&
                                    Math.abs(j - this.pos.x) === Math.abs(i - this.pos.y)) attacks.push(new Vector2D(j, i));
                            });
                        });
                    }
                }
            }
            else if (this.role === "pawn") {
                for (let i = this.pos.y - 1; i <= this.pos.y + 1; i++) {
                    for (let j = this.pos.x - 1; j <= this.pos.x + 1; j++) {
                        game.players.forEach(player => {
                            player.army.forEach(piece => {
                                if (this.color !== piece.color && piece.pos.x === j && piece.pos.y === i && Math.abs(j - this.pos.x) === 1 &&
                                    (this.color === "white" && i - this.pos.y === 1 || this.color === "black" && i - this.pos.y === -1)) attacks.push(new Vector2D(j, i));
                            });
                        });
                    }
                }
            }
            return attacks;
        }
    }
}
module.exports = Piece;