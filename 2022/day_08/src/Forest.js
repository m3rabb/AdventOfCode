const { Grid } = require("./Grid")

class Forest {
  constructor (input) {
    this.trees = new Grid(input).remap((cell) => +cell)
  }

  visibleTrees () {
    const viewed = Array(
      this._viewTreesVia("doRow", 1),
      this._viewTreesVia("doRow", -1),
      this._viewTreesVia("doColumn", 1),
      this._viewTreesVia("doColumn", -1),
    ).flat(2)

    const uniques = new Set(viewed)
    const seen = Array.from(uniques)

    return seen.sort((a, b) => a - b)
  }

  _viewTreesVia (axis, direction) {
    const results = []
    for (let next = 0, count = this.trees.width; next < count; next++) {
      results.push(this._viewTreesViaAlong (axis, direction, next))
    }

    return results
  }

  _viewTreesViaAlong (axis, direction, next) {
    const seen = []
    let highest = -1

    this.trees[axis](direction, (tree, index) => {
      if (tree > highest) {
        highest = tree
        seen.push(id)
      }
    }, next)

    return seen
  }
}

// class Forest {
//   constructor (input) {
//     this.trees = new Grid(input).remap((cell) => +cell)
//   }

//   viewTrees () {
//     const seenTrees = new Set()
//     this._viewTreesAlong("doRow", 1, seenTrees)
//     this._viewTreesAlong("doRow", -1, seenTrees)
//     this._viewTreesAlong("doColumn", 1, seenTrees)
//     this._viewTreesAlong("doColumn", -1, seenTrees)

//     return seenTrees
//   }

//   _viewTreesAlong (axis, direction, seenTrees) {
//     for (let next = 0, count = this.trees.width; next < count; next++) {
//       this._visibleTrees (axis, direction, next, seenTrees)
//     }
//   }

//   _visibleTrees (axis, direction, next, seenTrees) {
//     let highest = -1

//     this.trees[axis](direction, (tree, id) => {
//       if (tree > highest) {
//         highest = tree
//         seenTrees.add(id)
//       }
//     }, next)
//   }
// }

module.exports = {
  Forest,
}