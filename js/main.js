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
var gameRowsGlobal = parseInt(localStorage.getItem('rows')) || 8;
var recordsGlobal = JSON.parse(localStorage.getItem('records')) || [100000,100000,100000,100000,100000,100000,100000,100000,100000,100000,100000,100000,100000,100000];
var endScreen = document.querySelector('.endScreen');
var ballTemp = [];
var paddleTemp = [];
var globalPaused = false;
var ballInactive = true;
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
        if (endScreen.classList.contains('active')) {
            reset(true);
        }
        ballInactive = false;
        data.ball.dx = data.ball.speed;
        data.ball.dy = data.ball.speed;
        gameTimerInterval = setInterval(timerIncrement, 1000);
    };
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

    if (!globalPaused) {
        //перемещение платформы
        data.paddle.x+=data.paddle.dx;
        
        //двигаем шарик
        data.ball.x+=data.ball.dx;
        data.ball.y+=data.ball.dy;
    }

    //делаем, чтобы платформа не уезжала за границы игровой зоны

    if(data.paddle.x < data.wallSize) {
        data.paddle.x = data.wallSize;
    } else if (data.paddle.x + data.paddle.width > data.canvas.width-data.wallSize) {
        data.paddle.x = data.canvas.width - data.wallSize - data.paddle.width;
    }

    

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
        ballInactive = true;
        clearInterval(gameTimerInterval);
        console.log(ballInactive);
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
    if (score==defaultScore) {
        data.ball.y = 100000000;
        endScreenFillUp();
        openEndScreen();
        newRecord();
    }
    let scoreCalculated = `${score}/${defaultScore}`;
    scoreTitle.textContent = scoreCalculated;
}

function getTimeForm(time) {
    let timerTitleMinutes = `${Math.floor(time/60)}`;
    let timerTitleSeconds = `${time%60}`;
    timerTitleMinutes = timerTitleMinutes<10 ? '0'+timerTitleMinutes : timerTitleMinutes;
    timerTitleSeconds = timerTitleSeconds<10 ? '0'+timerTitleSeconds : timerTitleSeconds;
    return `${timerTitleMinutes}:${timerTitleSeconds}`;
}

function timerIncrement() {
    gameTimer+=1;
    timerTitle.textContent = getTimeForm(gameTimer);
}



//Сохранить параметры игры

function saveSettings() {
    localStorage.setItem('rows', gameRowsGlobal.toString());
    localStorage.setItem('records', JSON.stringify(recordsGlobal));
}

//Регуляровка рядов

let rowsUpButton = document.querySelector('img.rowsIncreaseBtn');
let rowsDownButton = document.querySelector('img.rowsDecreaseBtn');
let rowsTitle = document.querySelector('.rowsRegulation .keys span')
function rowsUp() {
    gameRowsGlobal = Math.min(data.height, gameRowsGlobal+1);
    reset(true);
}

function rowsDown() {
    gameRowsGlobal = Math.max(1, gameRowsGlobal-1);
    reset(true);
}

function rowsTitleUpdate() {
    rowsTitle.textContent = gameRowsGlobal;
}

rowsUpButton.addEventListener('click', rowsUp);
rowsDownButton.addEventListener('click', rowsDown);

//система рекордов

let recordTitle = document.querySelector('.record span');

function recordDisplay(animated) {
    recordTitle.textContent = recordsGlobal[gameRowsGlobal-1]!=100000 ? getTimeForm(recordsGlobal[gameRowsGlobal-1]) : '—';
    if (animated) {
        recordTitle.classList.add('animated');
        setTimeout(() => {
            recordTitle.classList.remove('animated');
        }, 3000);
    }
}

function newRecord() {
    if (gameTimer < recordsGlobal[gameRowsGlobal-1]) recordsGlobal[gameRowsGlobal-1] = gameTimer;
    console.log(recordsGlobal[gameRowsGlobal-1]);
}

//Экран конца игры

let endIcon = document.querySelector('img.endIcon');
let endTitle = document.querySelector('p.recordTitle');
let endDescription = document.querySelector('p.recordDescription')
function endScreenFillUp() {
    let recordRatio = (recordsGlobal[gameRowsGlobal]/gameTimer)*100;
    if (recordRatio>100 || recordsGlobal[gameRowsGlobal]==10000) {
        endIcon.src = data.recordsData.newRecord[0];
        endTitle.textContent = data.recordsData.newRecord[1];
        endDescription.textContent = data.recordsData.newRecord[2];
        endScreen.style.background = data.recordsData.newRecord[3];
        newRecord();
        recordDisplay(true);
    } else {
        if (recordRatio<75) {
            endIcon.src = data.recordsData.bad[0];
            endTitle.textContent = data.recordsData.bad[1];
            endDescription.textContent = data.recordsData.bad[2];
            endScreen.style.background = data.recordsData.bad[3];
        }
        if (recordRatio>=75 && recordRatio<90) {
            endIcon.src = data.recordsData.good[0];
            endTitle.textContent = data.recordsData.good[1];
            endDescription.textContent = data.recordsData.good[2];
            endScreen.style.background = data.recordsData.good[3];
        }
        if (recordRatio>=90 && recordRatio<=100) {
            endIcon.src = data.recordsData.great[0];
            endTitle.textContent = data.recordsData.great[1];
            endDescription.textContent = data.recordsData.great[2];
            endScreen.style.background = data.recordsData.great[3];
        }
    }
    
    
}

function openEndScreen() {
    endScreen.classList.add('active');
}

function closeEndScreen() {
    endScreen.classList.remove('active');
}

//game pause and start

function pauseGame() {
    ballTemp = [data.ball.dx, data.ball.dy];
    paddleTemp = [data.paddle.dx, data.paddle.dy];
    data.ball.dx, data.ball.dy, data.paddle.dx, data.paddle.dy = 0, 0, 0, 0;
    globalPaused = true;
    clearInterval(gameTimerInterval);
}

function startGame() {
    data.ball.dx, data.ball.dy, data.paddle.dx, data.paddle.dy = ballTemp[0], ballTemp[1], paddleTemp[0], paddleTemp[1];
    globalPaused = false;
    gameTimerInterval = setInterval(timerIncrement, 1000);
}

function gameToggle() {
    if (!ballInactive) {
        if (this.src.toString().includes('pause')) {
            pauseGame();
            this.src = this.src.replace('pause', 'start');
        } else {
            startGame();
            this.src = this.src.replace('start', 'pause');
        }
    }   
}

let pauseStartBtn =  document.querySelector('.pauseStartButton');
console.log(pauseStartBtn);
pauseStartBtn.addEventListener('click', gameToggle);

//ресет игры
function reset(restart = false) {
    closeEndScreen();
    if (restart) data.ball.y = 100000000;
    console.log(11);
    score = 0;
    gameTimer = 0;
    data.resetGame(gameRowsGlobal);
    defaultScore = data.bricks.length;
    rowsTitleUpdate();
    scoreDisplay();
    recordDisplay(false);
    timerTitle.textContent = '00:00';
}
let resetGameButton = document.querySelectorAll('.resetBtn');
resetGameButton.forEach((item) => item.addEventListener('click', reset), false);

reset();
requestAnimationFrame(loop);
window.addEventListener('beforeunload', saveSettings)