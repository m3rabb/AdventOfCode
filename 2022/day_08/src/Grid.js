
class Grid {
  constructor (input) {
    if (typeof input === "string") { this._load(input) }
    else { this._init(input) }
  }

  _init (width) {
    this.width = width
    this.cells = Array(width * width).fill(null)
  }

  _load (text) {
    this.width = text.indexOf("\n")
    this.cells = text.replaceAll("\n", "").split("")
  }

  remap (action) {
    const { cells } = this

    this.cellsDo((cell, index) => {
      cells[index] = action(cell, index)
    })

    return this
  }

  doRow (direction, action, row) {
    const { cells, width } = this
    let count = 0
    let [index, increment] = (direction < 0)
      ? [(row + 1) * width - 1, -1] : [row * width, 1]
    
    while (count++ < width) {
      if (action(cells[index], index) === true) return
      index += increment
    }
  }

  doColumn (direction, action, column) {
    const { cells, width } = this
    let count = 0
    let [index, increment] = (direction < 0)
      ? [width * (width - 1) + column, -width] : [column, width]
    
    while (count++ < width) {
      if (action(cells[index], index) === true) return
      index += increment
    }
  }

  cellsDo (action) {
    this.cells.forEach(action)
  }

  // rowsDo (direction, action) {
  //   const { width } = this

  //   for (let next = 0; next < width; next++) this.doRow(direction, action, next)
  // }

  // columnsDo (direction, action) {
  //   const { width } = this

  //   for (let next = 0; next < width; next++) this.doColumn(direction, action, next)
  // }

  setCell (row, column, value) {
    const index = (row * this.width) + column

    this.cells[index] = value
    return this
  }

  getCell (row, column) {
    const index = (row * this.width) + column
    
    return this.cells[index]
  }
}

module.exports = {
  Grid,
}