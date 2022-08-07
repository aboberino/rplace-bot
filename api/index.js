const express = require('express')
const bodyParser = require('body-parser')
const { Board } = require('./board')

const app = express()

// parse body params and attache them to req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

let board = null

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/api/place/init', (req, res) => {
  const { NB_COLS_BOARD, CUBE_WIDTH } = req.body

  if (!NB_COLS_BOARD) return res.status(400).send('Missing NB_COLS_BOARD')

  board = new Board(NB_COLS_BOARD, CUBE_WIDTH || undefined)

  res.send('Board initialised')
})

app.get('/api/place/board', async (req, res) => {
  if (!board) return res.status(400).send('Missing board')

  // get latest board
  board.drawCanvas()

  await board.generateImage()
  res.sendFile('./canvas.png', { root: __dirname })
})

app.post('/api/place/draw', async (req, res) => {
  if (!board) return res.status(400).send('Missing board')

  const { x, y, color } = req.body

  if (!x || !y || !color) {
    res.status(400).send('Missing parameters')
  }

  board.draw(x, y, color)

  await board.generateImage()

  res.sendFile('./canvas.png', { root: __dirname })
})

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
