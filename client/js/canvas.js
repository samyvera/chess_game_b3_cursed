var flipHorizontally = (context, around) => {
    context.translate(around, 0);
    context.scale(-1, 1);
    context.translate(-around, 0);
}

class CanvasDisplay {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.cx = this.canvas.getContext("2d", {
            alpha: false
        });
        this.zoom = 2;
        this.lastTime = null;
        this.status = null;
        this.animationTime = 0;
        this.canvas.width = global.width * this.zoom;
        this.canvas.height = global.height * this.zoom;
        document.getElementById("container").appendChild(this.canvas);
        this.cx.scale(this.zoom, this.zoom);
        this.cx.imageSmoothingEnabled = false;

        this.drawWindows = () => {
            var drawWindow = window => {
                this.cx.fillStyle = "#000";
                this.cx.fillRect(window.pos.x, window.pos.y, window.size.x, window.size.y);
                this.cx.fillStyle = "#fff";
                this.cx.fillRect(window.pos.x + 3, window.pos.y + 3, window.size.x - 6, 2);
                this.cx.fillRect(window.pos.x + 3, window.pos.y + window.size.y - 5, window.size.x - 6, 2);
                this.cx.fillRect(window.pos.x + 3, window.pos.y + 3, 2, window.size.y - 6);
                this.cx.fillRect(window.pos.x + window.size.x - 5, window.pos.y + 3, 2, window.size.y - 6);
                this.cx.font = "16px rcr";
                this.cx.textAlign = "left";
                this.cx.fillText(window.name, window.pos.x + 12, window.pos.y + 20);
                this.cx.fillRect(window.pos.x + 3, window.pos.y + 24 + 3, window.size.x - 6, 2);

                if (window instanceof KeyboardWindow) {
                    window.options.forEach((option, index) => {
                        if (window.index === index) {
                            this.cx.fillRect(window.pos.x + 24 + 16 *(index % 13), window.pos.y + 48 + 16 * Math.floor(index / 13), 16, 16);
                            this.cx.fillStyle = '#000';
                        }
                        else this.cx.fillStyle = "#fff";
                        this.cx.fillText(
                            option,
                            window.pos.x + 28 + 16 * (index % 13),
                            window.pos.y + 60 + 16 * Math.floor(index / 13)
                        );
                    });
                    this.cx.fillStyle = "#fff";
                    var slash = this.animationTime % 32 < 16 ? "|" : "";
                    this.cx.fillText(
                        window.string + slash,
                        window.pos.x + 128,
                        window.pos.y + 13 * 16
                    );
                }
                else if (window instanceof OnlineWindow) {
                    this.cx.textAlign = "right";
                    this.cx.fillText(
                        window.usersLength + ' players in ' + window.rooms.length + ' rooms',
                        window.pos.x + window.size.x - 12,
                        window.pos.y + 20
                    );
                    drawWindow(window.menu);
                    drawWindow(window.roomList);
                }
                else if (window instanceof OptionWindow) {
                    window.options.forEach((option, index) => {
                        if (window.index === index) {
                            this.cx.fillRect(window.pos.x + 8, window.pos.y + 32 + 16 * index, window.size.x - 16, 16);
                            this.cx.fillStyle = '#000';
                        }
                        else this.cx.fillStyle = "#fff";
                        this.cx.fillText(
                            option,
                            window.pos.x + 12,
                            window.pos.y + 44 + 16 * index
                        );
                    });
                }
                else if (window instanceof RoomWindow) {
                    window.menu.options.forEach((option, index) => {
                        if (window.menu.index === index) {
                            this.cx.fillRect(window.menu.pos.x + 8, window.menu.pos.y + 32 + 16 * index, window.menu.size.x - 16, 16);
                            this.cx.fillStyle = '#000';
                        }
                        else this.cx.fillStyle = "#fff";
                        this.cx.fillText(
                            option,
                            window.menu.pos.x + 12,
                            window.menu.pos.y + 44 + 16 * index
                        );
                    });
                }
            }
            var rootWindow = global.window;
            drawWindow(rootWindow);
        }

        // this.drawGrid = () => {
        //     for (let x = 0; x < 8 * 16; x += 16) {
        //         for (let y = 0; y < 8 * 16; y += 16) {
        //             if (x / 16 % 2 === 0 && y / 16 % 2 === 0 || x / 16 % 2 !== 0 && y / 16 % 2 !== 0) {
        //                 this.cx.fillStyle = '#088';
        //                 this.cx.fillRect(x + 1, y + 1, 14, 14);
        //                 this.cx.fillStyle = '#044';
        //                 this.cx.fillRect(x + 15, y, 1, 16);
        //                 this.cx.fillRect(x, y + 15, 16, 1);
        //                 this.cx.fillRect(x, y, 16, 1);
        //                 this.cx.fillRect(x, y, 1, 16);
        //             } else {
        //                 this.cx.fillStyle = '#044';
        //                 this.cx.fillRect(x + 1, y + 1, 14, 14);
        //                 this.cx.fillStyle = '#088';
        //                 this.cx.fillRect(x + 15, y, 1, 16);
        //                 this.cx.fillRect(x, y + 15, 16, 1);
        //                 this.cx.fillRect(x, y, 16, 1);
        //                 this.cx.fillRect(x, y, 1, 16);
        //             }
        //         }
        //     }
        // }

        // this.drawCursor = () => {
        //     var cursor = document.createElement("img");
        //     var pos = this.data.currentPlayer.pos;
        //     var turn = (this.data.currentPlayer.role === "player1" && this.data.turn % 2 === 1) || (this.data.currentPlayer.role === "player2" && this.data.turn % 2 === 0);
        //     cursor.src = "../img/2DCursor.png";
        //     var spriteY = this.data.currentPlayer.action ? 16 : 0;
        //     if (pos && turn) this.cx.drawImage(cursor, Math.floor(this.animationTime * 3) % 2 * 16, spriteY, 16, 16, pos.x - 8, pos.y - 8, 16, 16);
        // }

        // this.calculPos = pos => {
        //     return {
        //         x: pos.x * 8 + pos.z * 8,
        //         y: pos.z * 4 - pos.x * 4 - pos.y * 8
        //     };
        // }

        this.drawFrame = () => {
            this.animationTime++;
            if (global.window) this.drawWindows();
        };
    }
}