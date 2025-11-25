export const calculateInternalHeatSinks = (engineRating: number): number => {
  if (!engineRating || engineRating <= 0) {
    return 0
  }
  return Math.max(0, Math.floor(engineRating / 25))
}

export const calculateInternalHeatSinksForEngine = (
  engineRating: number,
  _engineType?: string,
): number => calculateInternalHeatSinks(engineRating)

