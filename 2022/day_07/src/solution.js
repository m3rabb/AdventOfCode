const fs = require("fs");

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
      case "ls" : return { operator, contents: ParseDirectoryContents(outputs) }
      default: return null
    }
  })
}

const ParseDirectoryContents = (lines) => {
  const contents = {}

  lines.forEach((line) => {
    const [value, name] = line.split(/\s+/)

    contents[name] = (value === "dir") ? {} : +value
  })

  return contents
}

const BuildFileSystem = (commands) => {
  const state = { fs: {}, path: [] }

  commands.forEach((command) => ApplyCommand(state, command))

  return state.fs
}

const ApplyCommand = (state, command) => {
  switch (command.operator) {
    case "cd" : return ChangeDirectory(state, command.operand)
    case "ls" : return AddContents(state, command.contents)
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

const AddContents = (state, contents) => {
  const directory = CurrentDirectory(state)
  
  DoContents(contents, (value, name) => { directory[name] = value })
}

const CurrentDirectory = ({ fs, path }) => path.reduce((directory, name) => directory[name], fs)

const DoContents = (contents, action) => {
  Object.keys(contents).forEach((name) => action(contents[name], name))
}

const MapContents = (contents, action) => {
  const results = []

  DoContents(contents, (value, name) => results.push(action(value, name)))
  
  return results
}

const FileSystemAsString = (fs) => DirectoryAsString("/", fs, 0)

const DirectoryAsString = (name, contents, depth) => {
  return `${Indent(depth)}- ${name} (dir)\n${ContentsAsString(contents, depth + 1)}`
}

const ContentsAsString = (contents, depth) => {
  const lines = MapContents(contents, (value, name) => {
    const Converter = (typeof value === "number") ? FileAsString : DirectoryAsString
    
    return `${Converter(name, value, depth)}`
  })

  return lines.join("\n")
}

const FileAsString = (name, size, depth) => `${Indent(depth)}- ${name} (file, size=${size})`

const Indent = (depth) => `${" ".repeat(depth * 2)}`


const contents =  fs.readFileSync('2022/day_07/data/sample_input.txt', "utf-8");
const lines = contents.split("\n")

const sessions = InputAsSessions(lines)
console.log({ sessions })

const commands = SessionsAsCommands(sessions)
const fileSystem = BuildFileSystem(commands)

// console.log(JSON.stringify(commands, null, 2))
console.log(JSON.stringify(fileSystem, null, 2))
console.log(FileSystemAsString(fileSystem))