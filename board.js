const Canvas = require('@napi-rs/canvas')
const { promises } = require('fs')
const { join } = require('path')
const { matricePixel, getRandomColor, convertUserCoordToCoord, alphabet, blanc, bleu, rouge, vert, empty, jaune, noir, orange } = require('./utils')

const colors = [noir, rouge, orange, jaune, vert, bleu, blanc, empty]

class Board {
  constructor(NB_COLS_BOARD, CUBE_WIDTH) {
    this.NB_COLS_BOARD = NB_COLS_BOARD // Nombre de colonne par ligne
    this.NB_COLS_CANVAS = NB_COLS_BOARD + 1 // NB_COLS +1 pour afficher la légende (x et y)
    this.CUBE_WIDTH = CUBE_WIDTH
    // this.matricePixel = [...new Array(NB_COLS_BOARD ** 2)].map((_) => getRandomColor(colors))
    this.matricePixel = matricePixel
    this.canvas = Canvas.createCanvas(this.NB_COLS_CANVAS * this.CUBE_WIDTH, this.NB_COLS_CANVAS * this.CUBE_WIDTH)
    this.ctx = this.canvas.getContext('2d')
    this.init()
  }

  init() {
    if (this.NB_COLS_BOARD % 1 !== 0) {
      console.log(`Impossible de créer une carte car la taille de la carte est incorrecte`)
      let n = 0
      let arrWorking = []
      do {
        if (Math.sqrt(n) % 1 === 0) arrWorking.push(n)
        n++
      } while (n <= 1000)
      console.log(arrWorking)
      throw new Error('Impossible de créer une carte car la taille de la carte est incorrecte')
    }

    // Text settings
    this.ctx.fillStyle = bleu
    this.ctx.font = `${9 * (this.CUBE_WIDTH / 10)}px Impact`

    this.buildCanvasLegend()
    this.drawCanvas()
  }

  // build legend of map (A to Z on x axis and 1 to NB_COLS on y axis)
  buildCanvasLegend() {
    const X_FIRST_ELEM = 2
    const Y_FIRST_ELEM = 8
    for (let i = 0; i < this.NB_COLS_CANVAS; i++) {
      if (i > 0) {
        this.ctx.fillText(
          alphabet[i - 1],
          X_FIRST_ELEM * (this.CUBE_WIDTH / 10) + i * (10 * (this.CUBE_WIDTH / 10)),
          Y_FIRST_ELEM * (this.CUBE_WIDTH / 10)
        )
        this.ctx.fillText(i + '', X_FIRST_ELEM * (this.CUBE_WIDTH / 10), Y_FIRST_ELEM * (this.CUBE_WIDTH / 10) + i * (10 * (this.CUBE_WIDTH / 10)))
      }
    }
  }

  drawCanvas() {
    let colIndex = 1
    let rowIndex = 1
    for (let i = 0; i < this.matricePixel.length; i++) {
      const pixelColor = this.matricePixel[i]

      console.log(`${pixelColor} ${colIndex}, ${rowIndex}`)

      this.updateBoard(colIndex, rowIndex, pixelColor)

      if (colIndex === this.NB_COLS_BOARD) {
        colIndex = 1
        rowIndex++
      } else {
        colIndex++
      }
    }
  }

  updateBoard(x, y, color) {
    if (this.ctx.fillStyle !== color) this.ctx.fillStyle = color
    if (color === empty) {
      this.ctx.clearRect(x * this.CUBE_WIDTH, y * this.CUBE_WIDTH, this.CUBE_WIDTH, this.CUBE_WIDTH)
    } else {
      this.ctx.fillRect(x * this.CUBE_WIDTH, y * this.CUBE_WIDTH, this.CUBE_WIDTH, this.CUBE_WIDTH)
    }
  }

  draw(coordX, coordY, color) {
    const [x, y] = convertUserCoordToCoord(coordX, coordY)

    // trouve l'index du point en (A1) dans la matricePixel
    // pour trouver l'index => index = x + 2y
    const matriceIndex = this.getOffset(x, y)
    matricePixel[matriceIndex] = color

    // update canvas
    this.updateBoard(x + 1, y + 1, color) // +1 car le tableau commence à 1
  }

  // Get index in matricePixel
  getOffset(x, y) {
    return this.NB_COLS_BOARD * y + x
  }

  async generateImage(format = 'png') {
    const imgData = await this.canvas.encode(format)
    await promises.writeFile(join(__dirname, `canvas.${format}`), imgData)
  }
}

module.exports = {
  Board
}
