import { getCumulativeExp } from './expTable.js'
import { parseItemsYaml } from './parseItemsYaml.js'
import { expPerBatchFromWorkload, expPerItemFromWorkload } from './craftXp.js'

export const ITEMS_YAML_URL =
  // Primary public-facing source site (uses the jana4u dataset)
  'https://craftcalculator.jana4u.net/data/items.yml'

const CACHE_KEY = 'atlantica-craft-catalog-cache-v1'

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^\w]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function makeItemId(skill, name) {
  const skillPart = slugify(skill) || 'skill'
  const namePart = slugify(name) || 'item'
  return `${skillPart}--${namePart}`
}

const SKILL_LABEL_TH = {
  Accessory: 'เครื่องประดับ',
  Action: 'แอ็กชัน',
  Armor: 'เกราะ',
  'Armor Fist': 'หมัดเกราะ',
  Arrow: 'ลูกธนู',
  Axe: 'ขวาน',
  Book: 'หนังสือ',
  Bow: 'ธนู',
  Building: 'สิ่งก่อสร้าง',
  Bullet: 'กระสุน',
  Cannon: 'ปืนใหญ่',
  Cannonball: 'ลูกปืนใหญ่',
  Charm: 'เครื่องราง',
  Crystal: 'คริสตัล',
  Fishing: 'ตกปลา',
  Food: 'อาหาร',
  Gauntlet: 'ถุงมือ',
  Gun: 'ปืน',
  Helmet: 'หมวก',
  Instrument: 'เครื่องดนตรี',
  License: 'ใบอนุญาต',
  Machine: 'เครื่องจักร',
  'Mana Stone': 'หินมานา',
  Medicine: 'ยา',
  'Music Sheet': 'โน้ตเพลง',
  Orb: 'ออร์บ',
  Pants: 'กางเกง',
  'Power Saw': 'เลื่อยไฟฟ้า',
  Scroll: 'ม้วนหนังสือ',
  Sewing: 'งานผ้า',
  Shield: 'โล่',
  Shoes: 'รองเท้า',
  Spear: 'หอก',
  Staff: 'ไม้เท้า',
  Stationery: 'เครื่องเขียน',
  Sword: 'ดาบ',
  Tool: 'เครื่องมือ',
  Whip: 'แส้',
}

function buildItem(name, data) {
  const batchSize = data.batch_size || 1
  const requiredSkillLv = data.skill_lvl ?? 0
  const nextLevel = Math.min(requiredSkillLv + 1, 180)

  const expPerBatch = expPerBatchFromWorkload(data.workload)

  return {
    id: makeItemId(data.skill, name),
    name,
    requiredSkillLv,
    expPerBatch,
    expPerCraft: expPerItemFromWorkload(data.workload, batchSize),
    workload: data.workload,
    batchSize,
    ingredients: data.ingredients ?? {},
    cumulativeExpToNextLevel: getCumulativeExp(nextLevel),
  }
}

export function transformItemsMap(itemsMap) {
  const bySkill = new Map()

  for (const [name, data] of Object.entries(itemsMap)) {
    if (!data?.ingredients || data.crafting_disabled) continue
    if (!data.skill || data.skill_lvl == null || data.workload == null) continue

    const skill = data.skill
    if (!bySkill.has(skill)) bySkill.set(skill, [])
    bySkill.get(skill).push(buildItem(name, data))
  }

  const skills = [...bySkill.keys()].sort((a, b) => a.localeCompare(b))

  const categories = skills.map((skill) => {
    const items = bySkill
      .get(skill)
      .sort(
        (a, b) =>
          a.requiredSkillLv - b.requiredSkillLv ||
          a.name.localeCompare(b.name, undefined, { numeric: true }),
      )

    return {
      id: slugify(skill),
      label: skill,
      labelTh: SKILL_LABEL_TH[skill] ?? skill,
      items,
    }
  })

  const craftableCount = categories.reduce((n, c) => n + c.items.length, 0)

  return {
    source: 'craftcalculator.jana4u.net',
    sourceUrl: 'https://craftcalculator.jana4u.net/',
    loadedAt: new Date().toISOString(),
    craftableCount,
    skills,
    categories,
  }
}

let catalogPromise = null
let catalogCache = null

function isValidCatalog(parsed) {
  return (
    parsed?.categories?.length > 0 &&
    parsed.categories.every(
      (c) => c && typeof c.id === 'string' && Array.isArray(c.items) && c.items.length > 0,
    )
  )
}

function readLocalCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!isValidCatalog(parsed)) {
      localStorage.removeItem(CACHE_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function writeLocalCache(catalog) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(catalog))
  } catch {
    /* quota or disabled */
  }
}

export async function loadCraftCatalog({ preferCache = true, forceRefresh = false } = {}) {
  if (catalogCache && !forceRefresh) return catalogCache
  if (catalogPromise && !forceRefresh) return catalogPromise

  catalogPromise = (async () => {
    if (preferCache && !forceRefresh) {
      const cached = readLocalCache()
      if (cached) {
        catalogCache = cached
        return cached
      }
    }

    const response = await fetch(ITEMS_YAML_URL)
    if (!response.ok) {
      throw new Error(`โหลดข้อมูลไม่สำเร็จ (HTTP ${response.status})`)
    }

    const yamlText = await response.text()
    const itemsMap = parseItemsYaml(yamlText)
    const catalog = transformItemsMap(itemsMap)

    if (!isValidCatalog(catalog)) {
      throw new Error('แปลงข้อมูลคราฟไม่สำเร็จ — ลองโหลดใหม่อีกครั้ง')
    }

    catalogCache = catalog
    writeLocalCache(catalog)
    return catalog
  })()

  try {
    return await catalogPromise
  } catch (err) {
    catalogPromise = null
    const cached = readLocalCache()
    if (cached) {
      catalogCache = cached
      return cached
    }
    throw err
  }
}

export function getCraftCatalog() {
  return catalogCache
}

export function getCategoryById(categoryId, catalog = catalogCache) {
  if (!catalog) return null
  return catalog.categories.find((c) => c.id === categoryId) ?? catalog.categories[0] ?? null
}

export function findItemById(categoryId, itemId, catalog = catalogCache) {
  const category = getCategoryById(categoryId, catalog)
  if (!category) return null
  return category.items.find((i) => i.id === itemId) ?? category.items[0] ?? null
}
