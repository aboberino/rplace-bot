const Canvas = require('@napi-rs/canvas')
const { promises } = require('fs')
const { join } = require('path')
const { matricePixel, blanc, bleu, rouge, vert, violet, empty, jaune1, jaune2, jaune, noir, orange, orange1, orange2 } = require('./utils')

const colors = [noir, rouge, orange, jaune, vert, bleu, blanc, empty]
const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)]
}

const NB_COLS = 17 // Nombre de colonne par ligne
const NB_COLS_CANVAS = NB_COLS + 1 // NB_COLS +1 pour afficher la légende (x et y)

// let matricePixel = [...new Array(NB_COLS ** 2)].map((_) => getRandomColor())
const CUBE_WIDTH = 100

if (NB_COLS % 1 !== 0) {
  console.log(`Impossible de créer une carte car la taille de la carte est incorrecte, nbColPerRow doit être un nombre entier : ${NB_COLS}`)
  let n = 0
  let arrWorking = []
  do {
    if (Math.sqrt(n) % 1 === 0) arrWorking.push(n)
    n++
  } while (n <= 1000)
  console.log(arrWorking)
  return
}

const offset = (x, y) => NB_COLS * y + x

// build legend of map (A to Z on x axis and 1 to NB_COLS on y axis)
function buildCanvasLegend() {
  const X_FIRST_ELEM = 2
  const Y_FIRST_ELEM = 8
  for (let i = 0; i < NB_COLS_CANVAS; i++) {
    if (i > 0) {
      ctx.fillText(alphabet[i - 1], X_FIRST_ELEM * (CUBE_WIDTH / 10) + i * (10 * (CUBE_WIDTH / 10)), Y_FIRST_ELEM * (CUBE_WIDTH / 10))
      ctx.fillText(i + '', X_FIRST_ELEM * (CUBE_WIDTH / 10), Y_FIRST_ELEM * (CUBE_WIDTH / 10) + i * (10 * (CUBE_WIDTH / 10)))
    }
  }
}

function drawCanvas() {
  let colIndex = 1
  let rowIndex = 1
  for (let i = 0; i < matricePixel.length; i++) {
    const pixelColor = matricePixel[i]

    console.log(`${pixelColor} ${colIndex}, ${rowIndex}`)

    placePoint(colIndex, rowIndex, pixelColor)

    if (colIndex === NB_COLS) {
      colIndex = 1
      rowIndex++
    } else {
      colIndex++
    }
  }
}

function placePoint(x, y, color) {
  if (ctx.fillStyle !== color) ctx.fillStyle = color
  if (color === empty) {
    ctx.clearRect(x * CUBE_WIDTH, y * CUBE_WIDTH, CUBE_WIDTH, CUBE_WIDTH)
  } else {
    ctx.fillRect(x * CUBE_WIDTH, y * CUBE_WIDTH, CUBE_WIDTH, CUBE_WIDTH)
  }
}

const canvas = Canvas.createCanvas(NB_COLS_CANVAS * CUBE_WIDTH, NB_COLS_CANVAS * CUBE_WIDTH)
const ctx = canvas.getContext('2d')

// Text settings
ctx.fillStyle = bleu
ctx.font = `${9 * (CUBE_WIDTH / 10)}px Impact`

buildCanvasLegend()
drawCanvas()

// user want to place a point to (C3) = (1,1) = (0,0)
let dataFromUser = ['C', parseInt('3'), violet]
placeUserPoint(...dataFromUser)

function placeUserPoint(xUser, yUser, color) {
  const [x, y] = convertUserCoordToCoord(xUser, yUser)

  // trouve l'index du point en (A1) dans la matricePixel
  // pour trouver l'index => index = x + 2y
  let matriceIndex = offset(x, y)
  matricePixel[matriceIndex] = color

  // update canvas
  placePoint(x + 1, y + 1, color) // +1 car le tableau commence à 1
}

function convertUserCoordToCoord(x, y) {
  return [alphabet.indexOf(x), y - 1]
}

async function main() {
  const pngData = await canvas.encode('png')
  await promises.writeFile(join(__dirname, 'canvas.png'), pngData)
}

main()
