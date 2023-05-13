const fs = require("fs")


const SplitSack = (text) => {
  const midpoint = text.length / 2
  return [text.slice(0, midpoint), text.slice(midpoint)]
}

const NewSideSack = (items) => {
  const sideSack = new Map()

  items.forEach((item) => sideSack.set(item, (sideSack.get(item) ?? 0) + 1))

  return sideSack
}

const AsRucksack = (text) => {
  return SplitSack(text).map((subtext) => NewSideSack(subtext.split("")))
}

const RucksackItemOnBothSides = (rucksack) => {
  const [left, right] = rucksack
  const intersection = []

  left.forEach((count, item) => {
    if (right.has(item)) intersection.push(item)
  })

  return intersection[0]
}



const CHAR_CODE_A = 'A'.charCodeAt(0) // 65
const CHAR_CODE_a = 'a'.charCodeAt(0) // 97
const ENGLISH_LETTER_COUNT = 26

const LOWERCASE_OFFSET = CHAR_CODE_a
const UPPERCASE_OFFSET = CHAR_CODE_A - ENGLISH_LETTER_COUNT

const PriorityOf = (item) => {
  const charCode = item.charCodeAt(0)
  const offset = (charCode >= CHAR_CODE_a) ? LOWERCASE_OFFSET : UPPERCASE_OFFSET
  
  return charCode - offset + 1
}


const contents =  fs.readFileSync('2022/day_02/data/input.txt', "utf-8");
const lines = contents.split("\n")

const rucksacks = lines.map((line) => AsRucksack(line))
const mistakenItems = rucksacks.map(RucksackItemOnBothSides)
const priorities = mistakenItems.map(PriorityOf)
const answer = priorities.reduce((sum, next) => sum + next)

// console.log({ rucksacks, xyz })
console.log({ mistakenItems, priorities, answer })


const BuildRucksackTriplets = (lines) => {
  const groups = []
  const count = lines.length
  let index = 0
  let limit = 3
  let group = []

  while (index < count) {
    line = lines[index++]
    group.push(line)

    if (index === limit) {
      limit += 3
      groups.push(group)
      group = []
    }
  }
  
  return groups
}

const FindCommonItem = (triplet) => {
  const [shortest, next, last] = triplet.slice().sort()

  for (const item of shortest) {
    if (next.includes(item) && last.includes(item)) return item
  }
}

const triplets = BuildRucksackTriplets(lines)
const commons = triplets.map(FindCommonItem)
const priorities2 = commons.map(PriorityOf)
const answer2 = priorities2.reduce((sum, next) => sum + next)

console.log({ triplets, commons, priorities2, answer2 })