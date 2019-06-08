var global = new App();
var socket = io();

var setupSocket = socket => {
    socket.on("welcome", () => {
        global.connected = true;
    });

    socket.on("globalInfos", (data, roomData) => {
        global.users = data;
        global.userRoomList = roomData;
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
    setupSocket(socket);

    var frame = time => {
        global.update(keys, socket);
        display.drawFrame();
        requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
};