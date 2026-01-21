// app/components/data/tables.ts

// Балка/двутавр: тип -> номер -> кг/м
export const BEAM_KG_PER_M: Record<string, Record<string, number>> = {
  // пример структуры (потом наполним реальными значениями):
  // "Балка/двутавр": {
  //   "10": 9.46,
  //   "12": 11.5,
  // },
};

// Швеллер: тип -> номер -> кг/м (если у тебя так же используется)
export const CHANNEL_KG_PER_M: Record<string, number> = {};

export const BEAM_TYPES: string[] = ["Балка/двутавр"];

export const BEAM_NUMBERS_BY_TYPE: Record<string, string[]> = {
  "Балка/двутавр": [],
};
