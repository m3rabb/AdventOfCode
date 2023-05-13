
class FSItem {
  constructor (name) {
    this.name = name
  }
}

class File extends FSItem {
  constructor (name, size) {
    super(name)
  
    this.size = size
  }

  toString () {
    return `- ${this.name} (file, size=${this.size})`
  }

  calcSize () { return this.size }

  traverse (action) { action(this) }
}

class Directory extends FSItem {
  constructor (name = "/") {
    super(name)
  
    this.items = new Map()
  }

  calcSize () {
    let { size } = this

    if (size) return size

    size = this.itemsMap((item) => item.calcSize()).reduce((subtotal, next) => subtotal + next, 0)

    return (this.size = size)
  }

  addItems (itemsData) {
    Object.keys(itemsData).forEach((name) => {
      const size = itemsData[name]
      const item = (size === null) ? new Directory(name) : new File(name, size)
      
      this.items.set(name, item)
    })
  }

  traverse (action) {
    this.itemsDo((item) => item.traverse(action))

    action(this)
  }

  itemsDo (action) {
    this.items.forEach(action)
  }
  
  itemsMap (action) {
    const results = []
  
    this.itemsDo((item, name) => results.push(action(item, name)))
  
    return results
  }
  
  toString () {
    const preamble = `- ${this.name} (dir, size=${this.size})`
    const body = this._itemsToString()

    return `${preamble}\n${Indent(body)}`
  }

  _itemsToString () {
    return this.itemsMap((item, name) => item.toString()).join("\n")
  }

  // accept (visitor) {

  // } 
}

// class FSVisitor {
//   constructor (name) {
//     this.name = name
//   }
// }


const Indent = (text, spaces = 2) => {
  return text.split("\n").map((line) => `${" ".repeat(spaces)}${line}`).join("\n")
}


class Inspector {
  constructor (directory) {
    this.directory = directory
  }

  itemsWhere (condition) {
    const results = []

    this.directory.traverse((item) => {
      if (condition(item)) results.push(item)
    })

    return results
  }

  smallDirectories (maxSize) {
    return this.itemsWhere((item) => item.items && item.size < maxSize)
  }

  orderedDirectories () {
    return this.itemsWhere((item) => item.items).sort((a, b) => a.size - b.size)
  }

  largestDirectoryUnder (maxSize) {
    for (const directory of this.orderedDirectories()) {
      if (directory.size >= maxSize) return directory
    }
    
    return null
  }
}

module.exports = {
  File,
  Directory,
  Inspector,
}