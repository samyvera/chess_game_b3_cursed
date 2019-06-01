class App{
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
        this.name = 'Joe';
        this.latency = null;
        this.window = null;

        this.update = keys => {
            this.controls = [
                keys.get("a"),
                keys.get("b"),
                keys.get("up"),
                keys.get("right"),
                keys.get("down"),
                keys.get("left")
            ];
            this.lastKeys = keys;

            if (this.window instanceof TitleWindow) {
                if (this.controls[0] && !this.lastControls[0] && this.window.name === 'Chess Game B3') {
                    this.window = new KeyboardWindow('Enter a nickname', new Vector2D(0, 0), new Vector2D(256, 240), [
                        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
                        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '!', '?', '.', ',', ';', ':', '"', "'", '+', '-', '*', '/', '%', '=', '&', '|',
                        '~', '#', '$', '_', '@', '`', '^', '{', '}', '(', ')', '[', ']', '<', '>', '\\', '©', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'ok'
                    ]);
                }
                if (this.window.name === 'Menu') {
                    if (this.controls[4] && !this.lastControls[4]) {
                        this.window.index++;
                        if (this.window.index >= this.window.options.length) this.window.index = 0;
                    }
                    if (this.controls[2] && !this.lastControls[2]) {
                        this.window.index--;
                        if (this.window.index < 0) this.window.index = this.window.options.length - 1;
                    }
                    if (this.controls[0] && !this.lastControls[0]) {
                        if (this.window.index === 0) {
                            
                        }
                        else if (this.window.index === 1) {
                            
                        }
                        else if (this.window.index === 2) {
                            this.window = new OnlineWindow(this.name, new Vector2D(0, 0), new Vector2D(256, 240), this.rooms, this.usersLength, 
                                new OptionWindow('Online', new Vector2D(8, 32), new Vector2D(112, 88), ['Join Room', 'Create Room', 'Quit']),
                                new OptionWindow('Rooms', new Vector2D(120, 32), new Vector2D(128, 200), this.rooms));
                        }
                    }
                }
            }
            else if (this.window instanceof KeyboardWindow) {
                var width = 13;
                if (this.controls[4] && !this.lastControls[4]) {
                    this.window.index += width;
                    if (this.window.index >= this.window.options.length) this.window.index = 0 + this.window.index % width;
                }
                if (this.controls[2] && !this.lastControls[2]) {
                    this.window.index -= width;
                    if (this.window.index < 0) this.window.index = this.window.options.length - 1 + (this.window.index + 1) % width;
                }
                if (this.controls[3] && !this.lastControls[3]) {
                    this.window.index++;
                    if (this.window.index % width === 0) this.window.index -= width;
                }
                if (this.controls[5] && !this.lastControls[5]) {
                    this.window.index--;
                    if (this.window.index % width === width - 1 || this.window.index % width === -1) this.window.index += width;
                }
                if (this.controls[0] && !this.lastControls[0]) {
                    if (this.window.index === this.window.options.length - 1) {
                        if (this.window.string.length > 0)
                            if (this.window.name === 'Enter a nickname') {
                                this.name = this.window.string;
                                this.window = new TitleWindow('Menu', new Vector2D(80, 64), new Vector2D(96, 88), ['J1 VS J2', 'J1 VS IA', 'ONLINE']);
                            }
                            else if (this.window.name === 'Enter room name') {
                                this.window = new RoomWindow(this.window.string, new Vector2D(0, 0), new Vector2D(256, 240), this.name,
                                    new OptionWindow('Online', new Vector2D(8, 32), new Vector2D(112, 88), ["I'm ready !", 'Leave room']));
                            }
                    }
                    else if (this.window.string.length < 10) this.window.string += this.window.options[this.window.index];
                    else this.window.index = this.window.options.length - 1;
                }
                if (this.controls[1] && !this.lastControls[1] && this.window.string.length > 0) {
                    this.window.string = this.window.string.substring(0, this.window.string.length - 1);
                }
            }
            else if (this.window instanceof OnlineWindow) {
                if (this.controls[4] && !this.lastControls[4]) {
                    this.window.menu.index++;
                    if (this.window.menu.index >= this.window.menu.options.length) this.window.menu.index = 0;
                }
                if (this.controls[2] && !this.lastControls[2]) {
                    this.window.menu.index--;
                    if (this.window.menu.index < 0) this.window.menu.index = this.window.menu.options.length - 1;
                }
                if (this.controls[0] && !this.lastControls[0]) {
                    if (this.window.menu.index === 0) {
                        
                    }
                    else if (this.window.menu.index === 1) {
                        this.window = new KeyboardWindow('Enter room name', new Vector2D(0, 0), new Vector2D(256, 240), [
                            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
                            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '!', '?', '.', ',', ';', ':', '"', "'", '+', '-', '*', '/', '%', '=', '&', '|',
                            '~', '#', '$', '_', '@', '`', '^', '{', '}', '(', ')', '[', ']', '<', '>', '\\', '©', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'ok'
                        ]);
                    }
                    else if (this.window.menu.index === 2) {
                        this.window = new TitleWindow('Menu', new Vector2D(80, 64),
                            new Vector2D(96, 88), ['J1 VS J2', 'J1 VS IA', 'ONLINE']);
                    }
                }
            }
            else if (this.window instanceof RoomWindow) {
                if (this.controls[4] && !this.lastControls[4]) {
                    this.window.menu.index++;
                    if (this.window.menu.index >= this.window.menu.options.length) this.window.menu.index = 0;
                }
                if (this.controls[2] && !this.lastControls[2]) {
                    this.window.menu.index--;
                    if (this.window.menu.index < 0) this.window.menu.index = this.window.menu.options.length - 1;
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
var global = new App();