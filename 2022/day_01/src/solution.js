const fs = require("fs")

const contents =  fs.readFileSync('2022/day_01/data/input.txt', "utf-8");
const lines = contents.split("\n")

const elves = []
let subtotal = 0
let index = 1

lines.forEach((line) => {
  if (line.length) {
    subtotal += +line
  }
  else {
    elves.push({ id: index++, calories: subtotal })
    subtotal = 0
  }
})

elves.sort((a, b) => b.calories - a.calories)

// console.log({ elves })
console.log("Most calories", elves[0])

const topElves = elves.slice(0, 3)
const topCalories = topElves.reduce((sum, elf) => sum + elf.calories, 0)

console.log({ topElves, topCalories })