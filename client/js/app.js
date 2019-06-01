var socket = io();

var setupSocket = socket => {
    socket.on("welcome", (usersLength, rooms) => {
        global.usersLength = usersLength;
        global.rooms = rooms;
        global.connected = true;
    });

    socket.on("updateOnline", (usersLength, rooms) => {
        global.usersLength = usersLength;
        global.rooms = rooms;
    });

    socket.on("connect_failed", () => {
        socket.close();
        global.connected = false;
    });

    socket.on("disconnect", () => {
        socket.close();
        global.connected = false;
    });
}

var trackKeys = codes => {
    var pressed = new Map();
    codes.forEach(code => pressed.set(code, false));
    var handler = event => {
        if (codes.get(event.keyCode) !== undefined) {
            pressed.set(codes.get(event.keyCode), event.type === "keydown");
            event.preventDefault();
        }
    }
    addEventListener("keydown", handler);
    addEventListener("keyup", handler);
    return pressed;
}

var keys = trackKeys(global.arrowCodes);

window.onload = () => {
    var display = new CanvasDisplay();
    global.window = new TitleWindow('Chess Game B3', new Vector2D(64, 96), new Vector2D(128, 56), ['Play now !']);
    global.startOnline = false;
    socket.emit("join", global.name);
    setupSocket(socket);
    var frame = time => {
        global.update(keys);
        display.drawFrame();
        requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
};