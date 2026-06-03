import { calculateCraftNeeded } from '../src/utils/calculate.js'
import { getCumulativeExp } from '../src/data/expTable.js'

const currentLevel = 22
const targetLevel = 25
const cumulativeExp = 63384

// Our App logic converts cumulative to within-level before calling calculateCraftNeeded
const within = cumulativeExp - getCumulativeExp(currentLevel)
console.log('cumulative', cumulativeExp)
console.log('getCumulativeExp(currentLevel)', getCumulativeExp(currentLevel))
console.log('within-level exp used for calculation', within)

const res = calculateCraftNeeded({
  currentLevel,
  currentExp: within,
  targetLevel,
  expPerCraft: 1, // use placeholder to observe currentTotal/targetTotal; actual expPerCraft not relevant for totals
})
console.log(res)
