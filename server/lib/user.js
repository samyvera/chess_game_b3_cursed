class User {
    constructor(id) {
        this.id = id;
        this.isHost = false;
        this.room = null;
    }
}
module.exports = User;