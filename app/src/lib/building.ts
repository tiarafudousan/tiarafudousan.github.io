// TODO: 減価償却 （設備）

// 構造
// 鉄筋コンクリート
export const RC = "RC"
// 鉄骨 (3mm <  <= 4mm)
export const S = "S"
// 軽量鉄骨 (<= 3mm)
export const LGS = "LGS"
// 木造
export const WOOD = "WOOD"

export type BuildingType = "RC" | "S" | "LGS" | "WOOD"

// 再調達価格
export const REPLACEMENT_COSTS: { [key: string]: [number, number] } = {
  RC: [16, 20],
  S: [13, 18],
  LGS: [12, 17],
  WOOD: [10, 16],
}

// 法定耐用年数
export const LEGAL_DURATIONS: { [key: string]: number } = {
  RC: 47,
  S: 34,
  LGS: 19,
  WOOD: 22,
}

// def calc_depreciation_period(building_type, building_age):
//     """
//     減価償却年数 - 簡易計算

//     // 法定耐用年数を超過した物件の償却年数
//     max(floor(法定耐用年数 x 0.2), 2)

//     // 法定耐用年数を経過していない物件の償却年数
//     max(floor((法定耐用年数 - 築年数) + 0.2 x 築年数), 2)
//     """
//     legal_duration = LEGAL_DURATIONS[building_type]

//     if legal_duration > building_age:
//         return max(math.floor((legal_duration - building_age) + 0.2 * building_age), 2)

//     return max(math.floor(legal_duration * 0.2), 2)

export function calc_depreciation_period(
  building_type: BuildingType,
  age: number,
): number {
  // 減価償却年数 - 簡易計算
  // 法定耐用年数を超過した物件の償却年数
  // max(floor(法定耐用年数 x 0.2), 2)
  // 法定耐用年数を経過していない物件の償却年数
  // max(floor((法定耐用年数 - 築年数) + 0.2 x 築年数), 2)
  const dur = LEGAL_DURATIONS[building_type]
  if (age < dur) {
    return Math.max(Math.floor(dur - 0.8 * age), 2)
  }
  return Math.max(Math.floor(dur * 0.2), 2)
}

//  建物の積算価格
export function estimate_building_price(args: {
  type: BuildingType
  age: number
  building_area: number
}): [number, number] {
  // 建物の積算価格
  // 築年数が法定耐用年数内の物件の場合
  // 再調達価格 x 建物面積 x (法定耐用年数 - 築年数) ÷ 法定耐用年数
  // 築年数が法定耐用年数を超過した物件の場合
  // 0
  const building_type = args.type
  const age = args.age
  const building_area = args.building_area

  const legal_duration = LEGAL_DURATIONS[building_type]
  const cost = REPLACEMENT_COSTS[building_type]

  if (age < legal_duration) {
    return [
      Math.floor(
        (cost[0] * building_area * (legal_duration - age)) / legal_duration,
      ),
      Math.floor(
        (cost[1] * building_area * (legal_duration - age)) / legal_duration,
      ),
    ]
  }

  return [0, 0]
}
