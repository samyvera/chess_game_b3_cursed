var util = require('./util');

class Piece {
    constructor(role, pos) {
        this.role = role;
        this.pos = pos;
        this.status = "alive";
    }
}
module.exports = Piece;