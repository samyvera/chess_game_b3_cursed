var global = {

    arrowCodes: new Map([
        [37, "left"],
        [38, "up"],
        [39, "right"],
        [40, "down"],
        [87, "a"],
        [88, "b"]
    ]),

    defaultPlayerName: "Joe",
    scale: 16,
    gameStart: false,
    disconnected: false,
    died: false,
    kicked: false,
    continuity: false,
    startPingTime: 0,
    reverse: false,
    gameData: {
        players: [],
        currentPlayer: null
    }
};
