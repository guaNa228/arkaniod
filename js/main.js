import * as data from "./data.js";
import collide from "./objectsIntersection.js";

//нажатие на клавиши
document.addEventListener("keydown", function(e) {
    if (e.which==37) {
        data.paddle.dx = -3;
    }

    else if(e.which==39) {
        data.paddle.dx = 3;
    }

    else if(data.ball.dx==0 && data.ball.dy==0 && e.which==32) {
        data.ball.dx = data.ball.speed;
        data.ball.dy = data.ball.speed;
    }
});

document.addEventListener("keyup", function(e) {
    if (e.which==37 || e.which==39) {
        console.log(1);
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

    //проверяем, чтобы шарик не уезжал за границы карты

    if (data.ball.x < data.wallSize) {
        data.ball.x = data.wallSize;
        data.ball.dx *= -1;
    }
    else if (data.ball.x > data.canvas.width-data.wallSize) {
        data.ball.x = data.canvas.width-data.wallSize-data.ball.width;
        data.ball.dx *= -1;
    }

    if (data.ball.y < data.wallSize) {
        data.ball.y = data.wallSize;
        data.ball.dy *= -1;
    }

    if (data.ball.y > data.canvas.height) {
        data.ball.x = 130;
        data.ball.y = 260;
        data.ball.dx = 0;
        data.ball.dy = 0;
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


            if (data.ball.y+data.ball.height-data.ball.speed <= tempBrick.y ||
                data.ball.y >= tempBrick.y + tempBrick.height - data.ball.speed) {
                    data.ball.dy *= -1;
            } else {
                data.ball.dx *= -1;
            }

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

requestAnimationFrame(loop);