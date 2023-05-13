const fs = require("fs")

const { Forest } = require("./Forest")

const text =  fs.readFileSync('2022/day_08/data/input.txt', "utf-8")

const forest = new Forest(text)
const seen = forest.visibleTrees()
const count = seen.length

console.log({ forest, seen, count })