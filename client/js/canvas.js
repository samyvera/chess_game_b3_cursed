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
        this.animationTime = 0;
        this.canvas.width = 12 * global.scale * this.zoom;
        this.canvas.height = 12 * global.scale * this.zoom;
        parent.appendChild(this.canvas);
        this.cx.scale(this.zoom, this.zoom);
        this.cx.imageSmoothingEnabled = false;
        this.data = global.gameData;

        this.drawBackground = () => {
            this.cx.fillStyle = "#008";
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
            this.animationTime += step;
            this.drawBackground();
            this.drawGameStatus();
        };
    }
}