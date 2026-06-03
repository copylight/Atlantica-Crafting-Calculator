/**
 * Minimal parser for items.yml used by craftcalculator.jana4u.net (top-level "Item Name": blocks).
 * Avoids a YAML dependency at runtime.
 */
export function parseItemsYaml(text) {
  const items = {}
  const lines = text.split(/\r?\n/)
  let current = null
  let inIngredients = false

  for (const line of lines) {
    const itemHeader = line.match(/^"((?:[^"\\]|\\.)*)":\s*$/)
    if (itemHeader) {
      current = {}
      items[itemHeader[1]] = current
      inIngredients = false
      continue
    }

    if (!current) continue

    if (/^ +ingredients:\s*$/.test(line)) {
      inIngredients = true
      current.ingredients = {}
      continue
    }

    if (inIngredients) {
      const ing = line.match(/^ +"(?:([^"\\]|\\.)*)":\s*(\d+)\s*$/)
      if (ing) {
        current.ingredients[ing[1]] = Number(ing[2])
        continue
      }
      if (line.trim() === '' || /^ +[a-z_]+:/i.test(line)) {
        inIngredients = false
      } else {
        continue
      }
    }

    const prop = line.match(/^ +([a-z_]+):\s*(.*)$/i)
    if (prop) {
      inIngredients = false
      const key = prop[1]
      const raw = prop[2].trim()
      if (raw.startsWith('"') && raw.endsWith('"')) {
        current[key] = raw.slice(1, -1)
      } else if (/^-?\d+$/.test(raw)) {
        current[key] = Number(raw)
      } else if (raw === 'true' || raw === 'false') {
        current[key] = raw === 'true'
      } else {
        current[key] = raw
      }
    }
  }

  return items
}
