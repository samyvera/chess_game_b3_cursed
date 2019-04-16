var debug = true;
var flipHorizontally = (context, around) => {
    context.translate(around, 0);
    context.scale(-1, 1);
    context.translate(-around, 0);
}

class CanvasDisplay {
    constructor(parent) {
        this.canvas = document.createElement('canvas');
        this.cx = this.canvas.getContext("2d", {
            alpha: false
        });
        this.zoom = 3;
        this.mode = "2d";
        this.animationTime = 0;
        this.canvas.width = 10 * global.scale * this.zoom;
        this.canvas.height = 12 * global.scale * this.zoom;
        parent.appendChild(this.canvas);
        this.cx.scale(this.zoom, this.zoom);
        this.cx.imageSmoothingEnabled = false;
        this.data = global.gameData;

        this.draw2DBackground = () => {
            for (let x = 0; x < 8 * 16; x += 16) {
                for (let y = 0; y < 8 * 16; y += 16) {
                    if (x / 16 % 2 === 0 && y / 16 % 2 === 0 || x / 16 % 2 !== 0 && y / 16 % 2 !== 0) {
                        this.cx.fillStyle = '#044';
                        this.cx.fillRect(x + 1, y + 1, 14, 14);
                        this.cx.fillStyle = '#088';
                        this.cx.fillRect(x + 15, y, 1, 16);
                        this.cx.fillRect(x, y + 15, 16, 1);
                        this.cx.fillRect(x, y, 16, 1);
                        this.cx.fillRect(x, y, 1, 16);
                    }
                    else {
                        this.cx.fillStyle = '#088';
                        this.cx.fillRect(x + 1, y + 1, 14, 14);
                        this.cx.fillStyle = '#044';
                        this.cx.fillRect(x + 15, y, 1, 16);
                        this.cx.fillRect(x, y + 15, 16, 1);
                        this.cx.fillRect(x, y, 16, 1);
                        this.cx.fillRect(x, y, 1, 16);
                    }
                }
            }
        }

        this.draw2DCursor = () => {
            var cursor = document.createElement("img");
            var pos = this.data.currentPlayer.pos;
            cursor.src = "../img/2DCursor.png";
            var spriteY = this.data.currentPlayer.action ? 16 : 0;
            if (pos) this.cx.drawImage(cursor, Math.floor(this.animationTime * 3) % 2 * 16, spriteY, 16, 16, pos.x - 8, pos.y - 8, 16, 16);
        }

        this.draw2DPiece = () => {
            this.data.players.forEach(player => {
                player.army.forEach(piece => {
                    var spritePos = null;
                    if (piece.role === "pawn") spritePos = 0;
                    else if (piece.role === "king") spritePos = 1;
                    else if (piece.role === "queen") spritePos = 2;
                    else if (piece.role === "rook") spritePos = 3;
                    else if (piece.role === "knight") spritePos = 4;
                    else if (piece.role === "bishop") spritePos = 5;
                    var spriteX = spritePos * 16;
                    var spriteY = 0;
                    var width = 16;
                    var height = 16;
                    var posX = piece.pos.x * 16;
                    var posY = piece.pos.y * 16;
                    var sprite = document.createElement("img");
                    if (player.role === "player1") {
                        sprite.src = "../img/white";
                        if (this.data.currentPlayer.role === "spectator") sprite.src = "../img/white-demi"
                        else if (global.reverse) sprite.src = "../img/white-reverse";
                    }
                    else if (player.role === "player2") {
                        sprite.src = "../img/black";
                        if (this.data.currentPlayer.role === "spectator") sprite.src = "../img/black-demi"
                        else if (global.reverse) sprite.src = "../img/black-reverse";
                    }
                    if (piece.status === "selected") {
                        height = 32;
                        if (this.data.currentPlayer.role === "player1") {
                            posY += Math.floor(this.animationTime * 3) % 2;
                        }
                        else if (this.data.currentPlayer.role === "player2") {
                            posY -= Math.floor(this.animationTime * 3) % 2;
                        }
                        else if (this.data.currentPlayer.role === "spectator") {
                            posX += Math.floor(this.animationTime * 3) % 2;
                        }
                    }
                    sprite.src += ".png";
                    this.cx.drawImage(sprite, spriteX, spriteY, width, height, posX, posY, width, height);
                });
            });
        }

        this.calculPos = pos => {
            return { x:pos.x * 8 + pos.z * 8, y:pos.z * 4 - pos.x * 4 - pos.y * 8 };
        }

        this.drawIsoBackground = () => {
            for (let z = 0; z < 8; z++) {
                for (let x = 8; x > 0; x--) {
                    var tilesSprites = document.createElement("img");
                    tilesSprites.src = "../img/grass.png";
                    var posX = this.calculPos({x:x, y:0, z:z}).x;
                    var posY = this.calculPos({x:x, y:0, z:z}).y;
                    this.cx.drawImage(tilesSprites, 0, 0, 16, 16, posX, posY, 16, 16);
                }
            }
        }

        this.drawHUD = () => {
            this.cx.fillStyle = '#000';
            this.cx.fillRect(0, 0, 10 * 16, 16);
            this.cx.fillRect(0, 0, 8, 10 * 16);
            this.cx.fillRect(9.5 * 16, 0, 8, 10 * 16);
            this.cx.fillRect(0, 16 * 10, 10 * 16, 32);

            this.cx.textAlign = "left";
            this.cx.fillStyle = "#FFFFFF";
            this.cx.font = "bold 8px sans-serif";
            if (this.data.currentPlayer && this.data.currentPlayer.role !== "spectator") {
                this.cx.fillText("You are " + this.data.currentPlayer.role, 8, 12);
                this.data.players.forEach(player => {
                    player.army.forEach(piece => {
                        if (piece.pos.x === Math.trunc(this.data.currentPlayer.pos.x / 16) && piece.pos.y === Math.trunc(this.data.currentPlayer.pos.y / 16)) {
                            this.cx.textAlign = "right";
                            var info = this.data.currentPlayer.selectedPiece ? ("[ " + this.data.currentPlayer.selectedPiece.color + " " + this.data.currentPlayer.selectedPiece.role + " ]") : piece.color + " " + piece.role;
                            this.cx.fillText(
                                info,
                                152,
                                12
                            );
                        }
                    });
                });
            }
            else if (this.data.currentPlayer) {
                var info = "You are a " + this.data.currentPlayer.role + ". Please wait";
                for (let i = 0; i < Math.floor(this.animationTime) % 4; i++) info += ".";
                this.cx.fillText(info, 8, 12);
            }
        }

        this.clearDisplay = () => {
            var gradient = this.cx.createLinearGradient(0, 0, 0, 16 * 10);
            gradient.addColorStop(0, "rgba(128, 128, 160, 1)");
            gradient.addColorStop(1, "rgba(32, 32, 64, 1)");
            this.cx.fillStyle = gradient;
            this.cx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        this.drawGameStatus = () => {
            if (global.died) {
                this.cx.fillStyle = "#333333";
                this.cx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                this.cx.textAlign = "center";
                this.cx.fillStyle = "#FFFFFF";
                this.cx.font = "bold 30px sans-serif";
                this.cx.fillText(
                    "You died!",
                    this.canvas.width / 2,
                    this.canvas.height / 2
                );
            } else if (!global.disconnected) {
                if (!global.gameStart) {
                    this.cx.fillStyle = "#333333";
                    this.cx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                    this.cx.textAlign = "center";
                    this.cx.fillStyle = "#FFFFFF";
                    this.cx.font = "bold 30px sans-serif";
                    this.cx.fillText(
                        "Game Over!",
                        this.canvas.width / 2,
                        this.canvas.height / 2
                    );
                }
            } else {
                this.cx.fillStyle = "#333333";
                this.cx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                this.cx.textAlign = "center";
                this.cx.fillStyle = "#FFFFFF";
                this.cx.font = "bold 30px sans-serif";
                if (global.kicked) {
                    this.cx.fillText(
                        "You were kicked!",
                        this.canvas.width / 2,
                        this.canvas.height / 2
                    );
                } else {
                    this.cx.fillText(
                        "Disconnected!",
                        this.canvas.width / 2,
                        this.canvas.height / 2
                    );
                }
            }
        }

        this.drawFrame = (newData, step) => {
            this.data = newData;
            this.mode = document.getElementById("mode").checked ? "iso" : "2d";
            this.animationTime += step;
            this.clearDisplay();
            if (this.data.currentPlayer) {
                if (this.mode === "2d") {
                    this.cx.translate(16, 24);
                    if (this.data.currentPlayer.role === "player1") {
                        this.cx.translate(16*4, 16*4);
                        this.cx.rotate(Math.PI);
                        this.cx.translate(-(16*4), -(16*4));
                        global.reverse = true;
                        global.arrowCodes.set(37, "right");
                        global.arrowCodes.set(38, "down");
                        global.arrowCodes.set(39, "left");
                        global.arrowCodes.set(40, "up");
                    }
                    else if (this.data.currentPlayer.role === "spectator") {
                        this.cx.translate(16*4, 16*4);
                        this.cx.rotate(-Math.PI/2);
                        this.cx.translate(-(16*4), -(16*4));
                    }
                    else {
                        global.reverse = false;
                        global.arrowCodes.set(37, "left");
                        global.arrowCodes.set(38, "up");
                        global.arrowCodes.set(39, "right");
                        global.arrowCodes.set(40, "down");
                    }
                    this.draw2DBackground();
                    this.draw2DCursor();
                    this.draw2DPiece();
                    if (this.data.currentPlayer.role === "player1") {
                        this.cx.setTransform(this.zoom, 0, 0, this.zoom, 16 * 3, 16 * 4.5);
                    }
                    else if (this.data.currentPlayer.role === "spectator") {
                        this.cx.setTransform(this.zoom, 0, 0, this.zoom, 16 * 3, 16 * 4.5);
                    }
                    this.cx.translate(-16, -24);
                } else {
                    this.cx.translate(8, 16*6);
                    this.drawIsoBackground();
                    this.cx.translate(-8, -16*6);
                }
            }
            this.drawHUD();
            this.drawGameStatus();
        };
    }
}