const fs = require("fs")

const { Directory, Inspector } = require("./fsitems")

const InputAsSessions = (lines) => {
  const sessions = []
  let session

  lines.forEach((line) => {
    if (line[0] === "$") {
      session = []
      sessions.push(session)
    }
    
    session.push(line)
  })

  return sessions
}

const SessionsAsCommands = (sessions) => {
  return sessions.map((session) => {
    const [input, ...outputs] = session
    const [prompt, operator, operand] = input.split(/\s+/)

    switch (operator) {
      case "cd" : return { operator, operand }
      case "ls" : return { operator, items: ParseDirectoryItems(outputs) }
      default: return null
    }
  })
}

const ParseDirectoryItems = (lines) => {
  const data = {}

  lines.forEach((line) => {
    const [value, name] = line.split(/\s+/)

    data[name] = (value === "dir") ? null : +value
  })

  return data
}

const BuildFileSystem = (commands) => {
  const state = { fs: new Directory(), path: [] }

  commands.forEach((command) => {
    ApplyCommand(state, command)
    // console.log({ state })
  })

  return state.fs
}

const ApplyCommand = (state, command) => {
  switch (command.operator) {
    case "cd" : return ChangeDirectory(state, command.operand)
    case "ls" : return AddItems(state, command.items)
  }
}

const ChangeDirectory = (state, operand) => {
  switch (operand) {
    case "/" : return SetToRoot(state)
    case ".." : return SetToParent(state)
    default: return SetToSubDirectory(state, operand)
  }
}

const SetToRoot = ({ path }) => { path.length = 0 }

const SetToParent = ({ path }) => { path.pop() }

const SetToSubDirectory = ({ path }, subDirectoryName) => { path.push(subDirectoryName) }


const CurrentDirectory = ({ fs, path }) => {
  return path.reduce((directory, name) => directory.items.get(name), fs)
}

const AddItems = (state, itemsData) => {
  CurrentDirectory(state).addItems(itemsData)
}

const text =  fs.readFileSync('2022/day_07/data/input.txt', "utf-8");
const lines = text.split("\n")

const sessions = InputAsSessions(lines)

const commands = SessionsAsCommands(sessions)

const fileSystem = BuildFileSystem(commands)
const size = fileSystem.calcSize()

const inspector = new Inspector(fileSystem)
const items = inspector.smallDirectories(100000)
const total = items.reduce((subtotal, item) => subtotal + item.size, 0)

const ordered = inspector.orderedDirectories()

const TOTAL_SIZE = 70_000_000
const UPDATE_SIZE = 30_000_000

const remainingSize = TOTAL_SIZE - fileSystem.size
const neededSize = UPDATE_SIZE - remainingSize

const dir = inspector.largestDirectoryUnder(neededSize)

// console.log({ sessions })
// console.log(JSON.stringify(commands, null, 2))
// console.log({ size, fileSystem })
console.log(fileSystem.toString())
console.log({ items })
console.log({ total })
console.log({ size: fileSystem.size, ordered, remainingSize, neededSize, dir })