class Window {
    constructor(name, pos, size) {
        this.name = name;
        this.pos = pos;
        this.size = size;
    }
}

class OptionWindow extends Window {
    constructor(name, pos, size, options) {
        super(name, pos, size);
        this.options = options;
        this.index = 0;
    }
}

class KeyboardWindow extends OptionWindow {
    constructor(name, pos, size, options) {
        super(name, pos, size);
        this.options = options;
        this.index = 0;
        this.string = "";
    }
}

class TitleWindow extends OptionWindow {
    constructor(name, pos, size, options) {
        super(name, pos, size, options);
        this.index = 0;
    }
}

class OnlineWindow extends Window {
    constructor(name, pos, size, rooms, usersLength, menu, roomList) {
        super(name, pos, size);
        this.rooms = rooms;
        this.usersLength = usersLength;
        this.menu = menu;
        this.roomList = roomList;
    }
}

class RoomWindow extends Window {
    constructor(name, pos, size, host, menu) {
        super(name, pos, size);
        this.host = host;
        this.menu = menu;
    }
}