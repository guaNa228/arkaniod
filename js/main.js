import * as data from "./data.js";
import collide from "./objectsIntersection.js";

//переменные игры
//let records = localStorage.getItem('records') || {};
let paddleSpeedIncreesingCoef = 1.03;
let ballSpeedIncreesingCoef = 1.05;
let k = 0;
let score = 0;
let defaultScore;
let gameTimer = 0;
var gameTimerInterval;
let gameRowsGlobal = parseInt(localStorage.getItem('rows')) || 8;
console.log(gameRowsGlobal);
//нажатие на клавиши
document.addEventListener("keydown", function(e) {
    if (e.which==37) {
        data.paddle.dx = -3*(paddleSpeedIncreesingCoef**k);
    }

    else if(e.which==39) {
        data.paddle.dx = 3*(paddleSpeedIncreesingCoef**k);
    }

    else if(data.ball.dx==0 && data.ball.dy==0 && e.which==32) {
        data.ball.dx = data.ball.speed;
        data.ball.dy = data.ball.speed;
        gameTimerInterval = setInterval(timerIncrement, 1000);
    }

    console.log(data.paddle.dx);
});

document.addEventListener("keyup", function(e) {
    if (e.which==37 || e.which==39) {
        data.paddle.dx = 0;
    }
});

//отрисовка игры

function loop() {
    requestAnimationFrame(loop);

    data.context.clearRect(0, 0, data.canvas.width, data.canvas.height);

    //перемещение платформы
    data.paddle.x+=data.paddle.dx;
    
    //делаем, чтобы платформа не уезжала за границы игровой зоны

    if(data.paddle.x < data.wallSize) {
        data.paddle.x = data.wallSize;
    } else if (data.paddle.x + data.paddle.width > data.canvas.width-data.wallSize) {
        data.paddle.x = data.canvas.width - data.wallSize - data.paddle.width;
    }

    //двигаем шарик
    data.ball.x+=data.ball.dx;
    data.ball.y+=data.ball.dy;

    //проверяем, чтобы шарик не уезжал за границы платформы

    if (data.ball.x <= data.wallSize) {
        data.ball.x = data.wallSize;
        data.ball.dx *= -1;
    }
    else if (data.ball.x >= data.canvas.width-data.wallSize) {
        data.ball.x = data.canvas.width-data.wallSize-data.ball.width;
        data.ball.dx *= -1;
    }

    if (data.ball.y < data.wallSize) {
        data.ball.y = data.wallSize;
        data.ball.dy *= -1;
    }

    if (data.ball.y > data.canvas.height) {
        data.ball.x = 12+Math.random()*376;
        data.ball.y = 210+Math.random()*40;
        data.ball.dx = 0;
        data.ball.dy = 0;
        k = 0;
        clearInterval(gameTimerInterval);
    }

    //пересечение с платформой

    if (collide(data.paddle, data.ball)) {
        data.ball.dy*=-1;
        data.ball.y = data.paddle.y - data.ball.height;
    }

    //пересечение с крипичиком

    let tempBrick;

    for (let i = 0; i<data.bricks.length; i++) {

        tempBrick = data.bricks[i];

        if (collide(tempBrick, data.ball)) {

            data.bricks.splice(i, 1);

            if (k<=30) {
                if (data.ball.y+data.ball.height-data.ball.speed <= tempBrick.y ||
                    data.ball.y >= tempBrick.y + tempBrick.height - data.ball.speed) {
                        data.ball.dy *= -ballSpeedIncreesingCoef;
                        k+=1;
                } else {
                    data.ball.dx *= -ballSpeedIncreesingCoef;
                    k+=1;
                }
            } else {
                if (data.ball.y+data.ball.height-data.ball.speed <= tempBrick.y ||
                    data.ball.y >= tempBrick.y + tempBrick.height - data.ball.speed) {
                        data.ball.dy*=-1;
                } else {
                    data.ball.dx*=-1;
                }
            }
            //console.log(data.ball.dx, data.ball.dy);
            score+=1;
            scoreDisplay();
            break;

        }
    }

    //отрисовка рамок

    data.context.fillStyle = 'lightgrey';
    data.context.fillRect(0, 0, data.canvas.width, data.wallSize);

    data.context.fillRect(0, 0, data.wallSize, data.canvas.height);

    data.context.fillRect(data.canvas.width-data.wallSize, 0, data.wallSize, data.canvas.height);

    // отрисовка шарика, если он двигается

    if (data.ball.dx || data.ball.dy) {
        data.context.fillRect(data.ball.x, data.ball.y, data.ball.width, data.ball.height);
    }

    data.bricks.forEach(function(brick) {
        data.context.fillStyle = brick.color;
        data.context.fillRect(brick.x, brick.y, brick.width, brick.height);
    });

    // отрисовка платформы
    data.context.fillStyle = 'cyan';
    data.context.fillRect(data.paddle.x, data.paddle.y, data.paddle.width, data.paddle.height);

}

//счёт и таймер отрисовка

let scoreTitle = document.querySelector('.scoreTitle span');
let timerTitle = document.querySelector('.timeTitle span')
function scoreDisplay() {
    let scoreCalculated = `${score}/${defaultScore}`;
    scoreTitle.textContent = scoreCalculated;
}

function timerIncrement() {
    gameTimer+=1;
    let timerTitleMinutes = `${Math.floor(gameTimer/60)}`;
    let timerTitleSeconds = `${gameTimer%60}`;
    timerTitleMinutes = timerTitleMinutes<10 ? '0'+timerTitleMinutes : timerTitleMinutes;
    timerTitleSeconds = timerTitleSeconds<10 ? '0'+timerTitleSeconds : timerTitleSeconds;
    timerTitle.textContent = `${timerTitleMinutes}:${timerTitleSeconds}`;
}

//Сохранить параметры игры

function saveSettings() {
    localStorage.setItem('rows', gameRowsGlobal.toString());
}

//Регуляровка рядов

let rowsUpButton = document.querySelector('img.rowsIncreaseBtn');
let rowsDownButton = document.querySelector('img.rowsDecreaseBtn');
let rowsTitle = document.querySelector('.rowsRegulation .keys span')
function rowsUp() {
    gameRowsGlobal = Math.min(data.height, gameRowsGlobal+1);
    reset();
}

function rowsDown() {
    gameRowsGlobal = Math.max(1, gameRowsGlobal-1);
    reset();
}

function rowsTitleUpdate() {
    rowsTitle.textContent = gameRowsGlobal;
}

rowsUpButton.addEventListener('click', rowsUp);
rowsDownButton.addEventListener('click', rowsDown);

//система рекордов




//ресет игры
function reset() {
    data.ball.y = data.canvas.height+15;
    score = 0;
    gameTimer = 0;
    data.resetGame(gameRowsGlobal);
    defaultScore = data.bricks.length;
    rowsTitleUpdate();
    scoreDisplay();
    timerTitle.textContent = '00:00';
}
let resetGameButton = document.querySelector('.resetBtn');
resetGameButton.addEventListener('click', reset);

reset();
requestAnimationFrame(loop);
window.addEventListener('beforeunload', saveSettings)