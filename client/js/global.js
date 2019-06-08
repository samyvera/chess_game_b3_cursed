class App {
    constructor() {
        this.width = 256;
        this.height = 240;

        this.arrowCodes = new Map([
            [37, "left"],
            [38, "up"],
            [39, "right"],
            [40, "down"],
            [87, "a"],
            [88, "b"]
        ]);

        this.connected = false;
        this.name = null;
        this.roomName = null;

        this.users = [];
        this.userRoomList = [];

        this.document = [new OptionWindow('Chess Game B3', new Vector2D(64, 96), new Vector2D(128, 56), ['Play now !'])];

        this.controls = null;
        this.lastControls = null;

        this.getRoomList = () => {
            var roomList = [];
            this.users.forEach(user => {
                if (!roomList.includes(user.room) && user.room) roomList.push(user.room);
            });
            return roomList;
        }

        this.update = (keys, socket) => {
            this.controls = [
                keys.get("a"),
                keys.get("b"),
                keys.get("up"),
                keys.get("right"),
                keys.get("down"),
                keys.get("left")
            ];

            var activeWindow = this.document[this.document.length - 1];

            if (activeWindow && activeWindow instanceof Window) {
                if (activeWindow instanceof OptionWindow) {
                    if (activeWindow instanceof KeyboardWindow) {
                        var width = 13;
                        if (this.controls[4] && !this.lastControls[4]) {
                            activeWindow.index += width;
                            if (activeWindow.index >= activeWindow.options.length) activeWindow.index = 0 + activeWindow.index % width;
                        }
                        if (this.controls[2] && !this.lastControls[2]) {
                            activeWindow.index -= width;
                            if (activeWindow.index < 0) activeWindow.index = activeWindow.options.length - 1 + (activeWindow.index + 1) % width;
                        }
                        if (this.controls[3] && !this.lastControls[3]) {
                            activeWindow.index++;
                            if (activeWindow.index % width === 0) activeWindow.index -= width;
                        }
                        if (this.controls[5] && !this.lastControls[5]) {
                            activeWindow.index--;
                            if (activeWindow.index % width === width - 1 || activeWindow.index % width === -1) activeWindow.index += width;
                        }
                        if (this.controls[0] && !this.lastControls[0]) {
                            if (activeWindow.index === activeWindow.options.length - 1) {
                                if (activeWindow.string.length > 0) {
                                    if (activeWindow.name === 'Enter a nickname') {
                                        this.name = activeWindow.string;
                                        this.document.push(new Window(this.name, new Vector2D(0, 0), new Vector2D(256, 240)));
                                        this.document.push(new OptionWindow('Menu', new Vector2D(80, 64), new Vector2D(96, 88), ['J1 VS J2', 'J1 VS AI', 'ONLINE']));
                                        socket.emit("join", this.name);
                                    } else if (activeWindow.name === 'Enter room name') {
                                        this.roomName = activeWindow.string;
                                        this.document.push(new Window(this.roomName, new Vector2D(0, 0), new Vector2D(256, 240)));
                                        this.document.push(new OptionWindow('Room', new Vector2D(8, 32), new Vector2D(112, 88), ["I'm ready !", 'User list', 'Leave room']));
                                        socket.emit("createRoom", this.roomName);
                                    }
                                }
                            } else if (activeWindow.string.length < 10) activeWindow.string += activeWindow.options[activeWindow.index];
                            else activeWindow.index = activeWindow.options.length - 1;
                        }
                        if (this.controls[1] && !this.lastControls[1]) {
                            if (activeWindow.string.length > 0) activeWindow.string = activeWindow.string.substring(0, activeWindow.string.length - 1);
                            else if (this.document.length > 1) this.document.splice(-1, 1);
                        }
                    } else {
                        if (this.controls[0] && !this.lastControls[0]) {
                            if (activeWindow.name === 'Chess Game B3') {
                                this.document.push(new KeyboardWindow('Enter a nickname', new Vector2D(0, 0), new Vector2D(256, 240), [
                                    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                                    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
                                    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '!', '?', '.', ',', ';', ':', '"', "'", '+', '-', '*', '/', '%', '=', '&', '|',
                                    '~', '#', '$', '_', '@', '`', '^', '{', '}', '(', ')', '[', ']', '<', '>', '\\', '©', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'ok'
                                ]));
                            }
                            else if (activeWindow.name === 'Menu') {
                                if (activeWindow.index === 0) {
                                    //J1 VS J2
                                } else if (activeWindow.index === 1) {
                                    //J1 VS AI
                                } else if (activeWindow.index === 2) {
                                    this.document.push(new Window(this.name, new Vector2D(0, 0), new Vector2D(256, 240)));
                                    this.document.push(new OptionWindow('Online', new Vector2D(8, 32), new Vector2D(112, 72), ['Join Room', 'Create Room']));
                                }
                            }
                            else if (activeWindow.name === 'Online') {
                                if (activeWindow.index === 0 && this.getRoomList().length > 0) {
                                    this.document.push(new OptionWindow('Rooms', new Vector2D(120, 32), new Vector2D(128, 200), this.getRoomList()));
                                } else if (activeWindow.index === 1) {
                                    this.document.push(new KeyboardWindow('Enter room name', new Vector2D(0, 0), new Vector2D(256, 240), [
                                        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                                        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
                                        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '!', '?', '.', ',', ';', ':', '"', "'", '+', '-', '*', '/', '%', '=', '&', '|',
                                        '~', '#', '$', '_', '@', '`', '^', '{', '}', '(', ')', '[', ']', '<', '>', '\\', '©', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'ok'
                                    ]));
                                }
                            }
                            else if (activeWindow.name === 'Rooms') {
                                if (activeWindow.index === 0) {
                                    this.roomName = activeWindow.options[activeWindow.index];
                                    this.document.push(new Window(this.roomName, new Vector2D(0, 0), new Vector2D(256, 240)));
                                    this.document.push(new OptionWindow('Room', new Vector2D(8, 32), new Vector2D(112, 88), ["I'm ready !", 'User list', 'Leave room']));
                                    socket.emit("joinRoom", this.roomName);
                                }
                            }
                            else if (activeWindow.name === 'Room') {
                                if (activeWindow.index === 0) {
                                    //READY TO PLAY
                                } else if (activeWindow.index === 1) {
                                    this.document.push(new OptionWindow('Users', new Vector2D(120, 32), new Vector2D(128, 200), this.userRoomList));
                                } else if (activeWindow.index === 2) {
                                    if (this.document.length > 3) this.document.splice(-3, 3);
                                    socket.emit("leaveRoom", this.roomName);
                                }
                            }
                        }
                        if (this.controls[1] && !this.lastControls[1]) {
                            if (activeWindow.name === 'Online') {
                                if (this.document.length > 2) this.document.splice(-2, 2);
                            } else if (activeWindow.name === 'Menu') {
                                if (this.document.length > 2) this.document.splice(-2, 2);
                            } else if (this.document.length > 1 && activeWindow.name !== 'Room') this.document.splice(-1, 1);
                        }
                        if (this.controls[4] && !this.lastControls[4]) {
                            activeWindow.index++;
                            if (activeWindow.index >= activeWindow.options.length) activeWindow.index = 0;
                        }
                        if (this.controls[2] && !this.lastControls[2]) {
                            activeWindow.index--;
                            if (activeWindow.index < 0) activeWindow.index = activeWindow.options.length - 1;
                        }
                    }
                }
            }

            this.lastControls = [
                keys.get("a"),
                keys.get("b"),
                keys.get("up"),
                keys.get("right"),
                keys.get("down"),
                keys.get("left")
            ];
        }
    }
}