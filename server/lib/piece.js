var util = require('./util');

class Piece {
    constructor(role, pos, color) {
        this.role = role;
        this.pos = pos;
        this.color = color;
        this.status = "alive";
    }
}
module.exports = Piece;