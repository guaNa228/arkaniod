export const canvas = document.getElementById('game');
export const context = canvas.getContext('2d');


const level1 = [
    [],
    [],
    [],
    [],
    [],
    [],
    ['R','R','R','R','R','R','R','R','R','R','R','R','R','R'],
    ['R','R','R','R','R','R','R','R','R','R','R','R','R','R'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y'],
    ['Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y']
];

const colorMap = {
    'R': 'red',
    'O': 'orange',
    'G': 'green',
    'Y': 'yellow'
};

//расстояние между кирпичиками
const brickGap = 2;
// размеры каждого кирпича
const brickWidth = 25;
const brickHeight = 12;

//размер игровой рамки
export const wallSize = 12;

//Шарик для игры
export const ball = {
    // стартовые координаты шарика
    x: 12+Math.random()*376,
    y: 210+Math.random()*40,
    // высота и ширина шарика
    width: 5,
    height: 5,
  
    // скорость шарика по обеим координатам
    speed: 2,
  
    // на старте шарик пока никуда не смещается
    dx: 0,
    dy: 0
};

//платформа, которой управляет игрок
export const paddle = {
    // ставим её внизу по центру поля
    x: canvas.width / 2 - brickWidth / 2,
    y: 440,
    // делаем её размером с кирпич
    width: brickWidth,
    height: brickHeight,
  
    // пока платформа никуда не движется, поэтому направление движения равно нулю
    dx: 0
  };

//игровой массив с оставшимися кирпичами
export let bricks;

export let height = level1.length;
export let width = level1[height - 1].length; 

let colorCodeTemp;

export function resetGame() {
    bricks = [];
    for (let row = 0; row < level1.length; row++) {
        for (let column = 0; column < level1[row].length; column++) {
    
            colorCodeTemp = level1[row][column];
    
            bricks.push({
                x: wallSize + (brickWidth + brickGap)*column,
                y: wallSize + (brickHeight + brickGap) * row,
                width: brickWidth,
                height: brickHeight,
                color: colorMap[colorCodeTemp]
            });
    
        }
    }

    console.log(bricks);
    
}


