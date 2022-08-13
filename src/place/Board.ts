import { Color } from './../typings/enums/Color'
import { createCanvas, Canvas, SKRSContext2D } from '@napi-rs/canvas'
import { promises } from 'fs'
import { join } from 'path'
import { alphabet, canard, getRandomColor, convertUserCoordToCoord, palette } from '../utils/utils'
import { AttachmentBuilder } from 'discord.js'
import { prismaClient } from '../utils/prismaClient'

export type BoardOptions = {
    nbCols: number,
    defaultColor?: Color | null,
    boardPixel?: Color[]
}

export class Board {
    NB_COLS_BOARD: number
    NB_COLS_CANVAS: number
    CUBE_WIDTH: number
    boardPixel: Color[]
    canvas: Canvas
    ctx: SKRSContext2D
    guildBoardId: number // GuildBoard Id stored in DB

    constructor({ nbCols, defaultColor, boardPixel = [] } : BoardOptions) {
        this.NB_COLS_BOARD = nbCols // Nombre de colonne par ligne
        this.NB_COLS_CANVAS = nbCols + 1 // NB_COLS +1 pour afficher la légende (x et y)
        this.CUBE_WIDTH = 100
        this.canvas = createCanvas(this.NB_COLS_CANVAS * this.CUBE_WIDTH, this.NB_COLS_CANVAS * this.CUBE_WIDTH)
        this.ctx = this.canvas.getContext('2d')
        
        // this.boardPixel = this.NB_COLS_BOARD === 17 ? canard : !boardPixel.length ? [...new Array(this.NB_COLS_BOARD ** 2)].map((_) => getRandomColor(palette)) : boardPixel
        if (!boardPixel.length) {
            this.boardPixel = [...new Array(this.NB_COLS_BOARD ** 2)].map((_) => !defaultColor ? getRandomColor(palette) : defaultColor)
        } else {
            this.boardPixel = boardPixel
        }

        this.init()
    }

    init() {
        // Text settings
        this.ctx.fillStyle = Color.BLUE
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
        for (let i = 0; i < this.boardPixel.length; i++) {
            const pixelColor = this.boardPixel[i]

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
        if (color === Color.EMPTY) {
            this.ctx.clearRect(x * this.CUBE_WIDTH, y * this.CUBE_WIDTH, this.CUBE_WIDTH, this.CUBE_WIDTH)
        } else {
            this.ctx.fillRect(x * this.CUBE_WIDTH, y * this.CUBE_WIDTH, this.CUBE_WIDTH, this.CUBE_WIDTH)
        }
    }

    async draw(coordX: string, coordY: number, color: Color, userId: string, guildId: string) {
        const [x, y] = convertUserCoordToCoord(coordX, coordY)

        // trouve l'index du point en (x,y) dans la boardPixel
        // pour trouver l'index => index = x + 2y
        const matriceIndex = this.getOffset(x, y)
	console.log(coordX + coordY, x, y, "index: " + matriceIndex, "matrice length: " + this.boardPixel.length)
        // out of range
        if (matriceIndex > this.boardPixel.length) throw new Error('Out of range')

        // update boardPixel
        this.boardPixel[matriceIndex] = color

        // save user tile in DB
        await prismaClient.userTile.create({
            data: { userId, x, y, color, guildBoard: { connect: { guildId } } }
        })

        // update canvas
        this.updateBoard(x + 1, y + 1, color) // +1 board begin at index 1 (bc of header)
    }

    // Get index in boardPixel
    getOffset(x, y) {
        return this.NB_COLS_BOARD * y + x
    }

    async generateImage(format: 'png' = 'png') {
        const imgData = await this.canvas.encode(format)
        await promises.writeFile(join(__dirname, `canvas.${format}`), imgData)
    }

    async generateAttachmentBuilder(fileName: string) {
        return new AttachmentBuilder(await this.canvas.encode('png'), { name: fileName })
    }

}
