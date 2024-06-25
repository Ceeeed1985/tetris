document.addEventListener('DOMContentLoaded', () => {

//Déclarer une variable, qui va chercher dans le document html la section ayant la classe grid
const grid = document.querySelector('.grid');

//Déclarer une variable "Square", qui va aller chercher dans le document html la section ayant la class grid section, et prendre ces informations et les mettre dans un tableau
let squares = Array.from(document.querySelectorAll('.grid section'));

//Déclarer une variable, qui va chercher dans le document html la section ayant l'id score
const scoreDisplay = document.querySelector('#score');

//Déclarer une variable, qui va chercher dans le document html la section ayant l'id start-button
const startBtn = document.querySelector('#start-button');

//Déclarer une variable de type numérique, dont le nom est width (longueur) et dont la valeur est 10
const width = 10;

//Déclarer une variable de type numérique, dont le nom est nextRandom (prochain aléatoire) et dont la valeur par défaut est 0
let nextRandom = 0;

//Déclarer une variable dont le nom est timerId, et dont la valeur par defaut est undefined
let timerId;

//Déclarer une variable de type numérique, dont le nom est score, et dont la valeur pas défaut est 0
let score = 0;


//Déclarer une variable, sous forme de tableau, dont le nom est ltetromino. Le tableau contient 4 sous-tableaux, avec les valeurs définies dans la variable width (10), chaque élément permettant de placer des éléments dans un carré, et de former la forme d'un L
const ltetromino = [
    [1, width+1, width*2+1,2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1,width*2],
    [width, width*2, width*2+1, width*2+2]
];

const ztetromino = [
    [width*2, width+1, width*2+1, width+2],
    [0, width, width+1, width*2+1],
    [width*2, width+1, width*2+1, width+2],
    [0, width, width+1, width*2+1]
];

const otetromino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
];

const ttetromino = [
    [width, 1, width+1, width+2],
    [1, width+1, width*2+1, width+2],
    [width, width+1, width*2+1, width+2],
    [width, 1, width+1, width*2+1]
];

const itetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
]


//Création d'un tableau, reprenant les 5 variables précédemment créées
const tetrominos = [ltetromino, ztetromino, otetromino, ttetromino, itetromino];

//Déclaration d'une variable de type numérique dont la valeur est 4. ?? il s'agit de la position depuis laquelle le premier bloc partira.
//Il s'agit de la position de départ sur la grille de jeu
let currentPosition = 4;

//Déclaration d'une variable de type numérique dont la valeur est 0. ?? Il s'agit sans doute de la position de base des blocs
let currentRotation = 0;

//On crée une variable "random", dont la valeur consiste à prendre le nombre d'éléments se trouvant dans le tableau tetrominos, et de le multiplier par un chiffre aléatoire de 0 à 1, et ensuite d'arrondir. Cela permet d'obtenir un élément "random" aléatoire dans le tableau
let random = Math.floor(Math.random()*tetrominos.length)
console.log(random);

//On crée une variable dont le nom est "current", et dont la valeur va reprendre une pièce aléatoire dans le tableau tetrominos et la position par défaut de currentRotation, c'est à dire sa position initiale
//En fait pour être précis, je vais chercher d'abords le premier élément du tableau tetrominos (à savoir le nom de la forme de manière aléatoire grâce à random)
//Et dans ce même tableau, la première ligne déterminée par la variable currentRotation, dont la valeur est 0 ==> l'index = 0, d'où première ligne de ce tableau
let current = tetrominos[random][currentRotation];
console.log(current);


//Création d'une fonction dont le nom est "draw"
//Fonctionnement en plusieurs étapes :
//Quand j'appelle ma fonction, cela signifie que
//Pour la variable "current", dont la valeur est maintenant connue (voir au-dessus)
//Pour chaque élément du tableau (1,11,20,21), on va appliquer la fonction suivante :
//la forme sera positionnée sur la grille square, à l'endroit positionné d'origine (currentPosition) auquel on ajouter l'index de la pièce "current"
//Et à chaque élément de current, on va appliquer la class "tetromino", définie dans le css, et qui permettra de faire ressortir la pièce d'une autre couleur
function draw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino');
    })
}

//Plus ou moins la même fonction, mais qui va retirer à chaque itération, la class "tetromino" précédemment ajoutée
//L'objectif est de faire apparaitre la forme, en appelant la fonction draw(), et puis de la faire disparaitre en appelant undraw()
function undraw(){
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino')
    })
}

// timerId = setInterval(moveDown, 1000)


// function control(e){
//     if(e.keyCode === 37) {
//         moveLeft()
//     } else if (e.keyCode === 39) {
//         moveRight ()
//     } else if (e.keyCode === 40) {
//         moveDown ()
//     } else if (e.keyCode === 38) {
//         rotate ()
//     }
// }


//on crée ici une fonction dont le nom est control, et qui a comme paramètre un évènement (e)
//lorsque sur l'évènement, correspondant à une touche du clavier (keycode) = 37, alors cela signifie que j'utilise la fonction moveLeft()
function control(e) {
    e.keyCode === 37 && moveLeft();
    e.keyCode === 38 && rotate();
    e.keyCode === 39 && moveRight();
    e.keyCode === 40 && moveDown();

}


//Lorsque l'on créer un évènement consistant à appuyer sur une touche, au moment où la touche est relâchée, la fonction "control" est appelée
//Par exemple, lorsque je clique sur la flèche de gauche(keycode === 37), au moment ou cette touche est relachée, la fonction controle est appelée
//Et quelle est la fonction correspondant à la touche 37, c'est moveLeft
document.addEventListener('keyup', control)


function moveDown(){
    undraw()
    currentPosition +=width
    draw()
    freeze()
}

function freeze(){
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        random = nextRandom
        nextRandom = Math.floor(Math.random() * tetrominos.length)
        current = tetrominos[random][currentRotation]
        currentPosition = 4
        draw()
        displayShape()
        addScore()
        gameOver()
    }
}


function moveLeft () {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

    if(!isAtLeftEdge) currentPosition -= 1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition += 1
    }
    draw()
}


function moveRight () {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)

    if(!isAtRightEdge) currentPosition += 1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -= 1
    }
    draw()
}


// ROTATION DES ELEMENTS

function rotate () {
    undraw()
    currentRotation ++
    if(currentRotation === current.length) {
        currentRotation = 0
    }
    current = tetrominos[random][currentRotation]
    draw()
}


// AFFICHER UN ECRAN AVEC LES FORMES A VENIR

const displaySquares = document.querySelectorAll('.mini-grid section')
const displayWidth = 4
let displayIndex = 0


const upNextTetromino = [
    [1, displayWidth+1, displayWidth*2+1, 2],
    [0, displayWidth, displayWidth+1, displayWidth*2],
    [0, 1, displayWidth, displayWidth+1],
    [displayWidth, 1, displayWidth+1, displayWidth+2],
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]   
]
function displayShape() {
    displaySquares.forEach(square => {
        square.classList.remove('tetromino')
    })
    upNextTetromino[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add('tetromino')
    })
}

// APPUYER SUR START / PAUSE

startBtn.addEventListener('click', () => {
    if(timerId){
        clearInterval(timerId)
        timerId = null
    } else {
        draw()
        timerId = setInterval(moveDown, 1000)
        nextRandom = Math.floor(Math.random()* tetrominos.length)
        displayShape()
    }
})

function addScore() {
    for (let i = 0; i < 199; i +=width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

        if(row.every(index => squares[index].classList.contains('taken'))){
            score+=10
            scoreDisplay.innerHTML = score
            row.forEach(index => {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetromino')
            })
            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
        }
    }
}

// GAME OVER

function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        scoreDisplay.innerHTML = 'end'
        clearInterval(timerId)
    }
}


})

