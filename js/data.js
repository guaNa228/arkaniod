export const canvas = document.getElementById('game');
export const context = canvas.getContext('2d');

export const recordsData = {
    'bad': ['assets/icons/results/bad.png', 'BAD ONE', 'So bad! You are trash', 'rgba(247, 35, 35, .7)'],
    'good': ['assets/icons/results/good.png', 'NICE ONE', 'It is okay, but not enough', 'rgba(221, 231, 28, .7)'],
    'great': ['assets/icons/results/great.png', 'GREAT TRY', 'It is great, but you did not beat your record', 'rgba(46, 238, 48, .7)'],
    'newRecord': ['assets/icons/results/record.png', 'WOW', 'You have beaten your record in this mode, but there is no limit to perfection', 'rgba(16, 14, 238, .7)']
}

//export const maxK = [500, 50, ]

const level = [
    ['P','P','P','P','P','P','P','P','P','P','P','P','P','P'],
    ['P','P','P','P','P','P','P','P','P','P','P','P','P','P'],
    ['B','B','B','B','B','B','B','B','B','B','B','B','B','B'],
    ['B','B','B','B','B','B','B','B','B','B','B','B','B','B'],
    ['C','C','C','C','C','C','C','C','C','C','C','C','C','C'],
    ['C','C','C','C','C','C','C','C','C','C','C','C','C','C'],
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
    'P': 'purple',
    'B': 'blue',
    'C': 'cyan',
    'R': 'red',
    'O': 'orange',
    'G': 'green',
    'Y': 'yellow',
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

export let height = level.length;
export let width = level[height - 1].length; 

let colorCodeTemp;

export function resetGame(rows) {
    bricks = [];
    for (let row = level.length - rows; row < level.length; row++) {
        for (let column = 0; column < level[row].length; column++) {
    
            colorCodeTemp = level[row][column];
    
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


