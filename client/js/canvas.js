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

        this.drawGrid = () => {
            this.cx.fillStyle = '#033';
            this.cx.fillRect(0, 0, 8 * 16, 8 * 16);
            for (let x = 0; x < 8 * 16; x += 16) {
                for (let y = 0; y < 8 * 16; y += 16) {
                    this.cx.fillStyle = '#0f0';
                    this.cx.fillRect(x, y, 16, 1);
                    this.cx.fillRect(x, y + 15, 16, 1);
                    this.cx.fillRect(x, y, 1, 16);
                    this.cx.fillRect(x + 15, y, 1, 16);
                }
            }
        }

        this.calculPos = pos => {
            return { x:pos.x * 8 + pos.z * 8, y:pos.z * 4 - pos.x * 4 - pos.y * 8 };
        }

        this.drawBackground = () => {
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
            this.cx.fillText(
                this.data.currentPlayer,
                8,
                12
            );
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
            if (this.mode === "2d") {
                this.cx.translate(16, 24);
                this.drawGrid();
                this.cx.translate(-16, -24);
            } else {
                this.cx.translate(8, 16*6);
                this.drawBackground();
                this.cx.translate(-8, -16*6);
            }
            this.drawHUD();
            this.drawGameStatus();
        };
    }
}