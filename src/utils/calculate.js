import { getCumulativeExp, MAX_SKILL_LEVEL } from '../data/expTable.js'

export const ERROR_CODES = {
  NEGATIVE: 'NEGATIVE',
  INVALID_NUMBER: 'INVALID_NUMBER',
  LEVEL_RANGE: 'LEVEL_RANGE',
  TARGET_TOO_LOW: 'TARGET_TOO_LOW',
  NO_EXP_PER_CRAFT: 'NO_EXP_PER_CRAFT',
  ALREADY_AT_TARGET: 'ALREADY_AT_TARGET',
}

export function parseNonNegativeInt(value, fieldLabel) {
  if (value === '' || value === null || value === undefined) {
    return { ok: false, code: ERROR_CODES.INVALID_NUMBER, message: `กรุณากรอก${fieldLabel}` }
  }
  const num = Number(value)
  if (!Number.isFinite(num) || !Number.isInteger(num)) {
    return { ok: false, code: ERROR_CODES.INVALID_NUMBER, message: `${fieldLabel}ต้องเป็นจำนวนเต็ม` }
  }
  if (num < 0) {
    return { ok: false, code: ERROR_CODES.NEGATIVE, message: `${fieldLabel}ห้ามติดลบ` }
  }
  return { ok: true, value: num }
}

/**
 * @param {{
 *   currentLevel: number,
 *   currentExp: number,
 *   targetLevel: number,
 *   expPerBatch: number,
 *   batchSize?: number,
 * }} params
 */
export function calculateCraftNeeded({
  currentLevel,
  currentExp,
  targetLevel,
  expPerCraft,
  batchSize = 1,
}) {
  if (currentLevel < 1 || currentLevel > MAX_SKILL_LEVEL) {
    return {
      ok: false,
      code: ERROR_CODES.LEVEL_RANGE,
      message: `เลเวลสกิลปัจจุบันต้องอยู่ระหว่าง 1–${MAX_SKILL_LEVEL}`,
    }
  }
  if (targetLevel < 1 || targetLevel > MAX_SKILL_LEVEL) {
    return {
      ok: false,
      code: ERROR_CODES.LEVEL_RANGE,
      message: `เลเวลเป้าหมายต้องอยู่ระหว่าง 1–${MAX_SKILL_LEVEL}`,
    }
  }
  if (targetLevel <= currentLevel) {
    return {
      ok: false,
      code: ERROR_CODES.TARGET_TOO_LOW,
      message:
        currentLevel === targetLevel
          ? 'เลเวลปัจจุบันเท่ากับเป้าหมายแล้ว — ไม่ต้องคราฟเพิ่ม'
          : 'เลเวลปัจจุบันสูงกว่าเป้าหมาย — ลองตั้งเป้าหมายให้สูงขึ้น',
    }
  }
  if (!expPerCraft || expPerCraft <= 0) {
    return {
      ok: false,
      code: ERROR_CODES.NO_EXP_PER_CRAFT,
      message: 'ไอเทมที่เลือกไม่มีค่า EXP ต่อครั้งกดคราฟ',
    }
  }

  /**const currentTotal = getCumulativeExp(currentLevel) + currentExp สูตรเดิม**/
  const currentTotal = currentExp > 0 ? currentExp : getCumulativeExp(currentLevel)
  const targetTotal = getCumulativeExp(targetLevel)
  const expNeeded = targetTotal - currentTotal

  if (expNeeded <= 0) {
    return {
      ok: false,
      code: ERROR_CODES.ALREADY_AT_TARGET,
      message: 'EXP ปัจจุบันเพียงพอถึงเป้าหมายแล้ว — ไม่ต้องคราฟเพิ่ม',
    }
  }

  const safeBatch = Math.max(1, batchSize)
  /** จำนวนคราฟที่ต้องทำตามสูตรก่อนหน้า */
  const craftActionsNeeded = Math.ceil(expNeeded / expPerCraft)
  /** const itemsProduced = craftActionsNeeded สูตรเดิม*/
  const itemsProduced = craftActionsNeeded * safeBatch
  const expPerBatch = expPerCraft * safeBatch
  const expGainedTotal = craftActionsNeeded * expPerCraft

  return {
    ok: true,
    expNeeded,
    craftActionsNeeded,
    itemsProduced,
    expGainedTotal,
    batchSize: safeBatch,
    expPerBatch,
    expPerItem: expPerCraft,
    currentTotal,
    targetTotal,
  }
}

export function formatNumber(n) {
  return new Intl.NumberFormat('th-TH').format(n)
}
