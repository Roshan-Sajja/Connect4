function start() {
    var myGameArea = document.getElementById("gameboard");
    var ctx = myGameArea.getContext("2d");
    ctx.clearRect(0, 0, myGameArea.width, myGameArea.height);
    var whiteCircle = document.createElement("img");
    whiteCircle.src = "/gamepieces/whitecircle.png";
    whiteCircle.width = 700;
    whiteCircle.height = 600;
    var pat = ctx.createPattern(whiteCircle, 'repeat');
    ctx.rect(0, 0, 700, 600);
    ctx.fillStyle = pat;
    ctx.fill();
}