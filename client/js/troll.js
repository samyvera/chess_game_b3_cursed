//title scroll

var title = document.title;
setInterval(() => {
    title = title.slice(1) + title.slice(0, 1);
    document.title = title;
    window.status = title;
}, 200);

//mouse stalker

var mx = -200;
var my = -200;

for (let i = 1; i <= 8; i++) {
    var img = document.createElement('img');
    img.src = "img/star.gif";
    img.style.position = "fixed";
    img.id = "ms" + i;
    document.body.appendChild(img);
}

var i = [
    [0, 0, ms1],
    [0, 0, ms2],
    [0, 0, ms3],
    [0, 0, ms4],
    [0, 0, ms5],
    [0, 0, ms6],
    [0, 0, ms7],
    [0, 0, ms8]
];


if ("ontouchstart" in window) {
    i.forEach(pos => pos[2].style.position = "absolute");
    document.addEventListener("touchstart", event => {
        mx = event.changedTouches[0].pageX + 10;
        my = event.changedTouches[0].pageY + 10;
    }, false);
    document.addEventListener("touchmove", event => {
        mx = event.changedTouches[0].pageX + 10;
        my = event.changedTouches[0].pageY + 10;
    }, false);
    document.addEventListener("touchend", event => {
        mx = event.changedTouches[0].pageX + 10;
        my = event.changedTouches[0].pageY + 10;
    }, false);
} else {
    document.addEventListener("mousemove", event => {
        mx = event.clientX + 10;
        my = event.clientY + 10;
    }, false);
}

var mousestalker = () => {
    i.forEach((pos, index) => {
        pos[0] = (mx + 10 * index + (10 + 10 * index) * pos[0]) / (10 + 10 * index + 1);
        pos[1] = (my + 10 * index + (10 + 10 * index) * pos[1]) / (10 + 10 * index + 1);
        pos[2].style.left = pos[0] + "px";
        pos[2].style.top = pos[1] + "px";
    });
    setTimeout(mousestalker, 10);
}
mousestalker();