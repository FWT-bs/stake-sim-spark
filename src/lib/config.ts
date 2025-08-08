export const HOUSE_EDGE = 0.07; // 7%

export function calculatePayout(winProbability: number, houseEdge: number = HOUSE_EDGE): number {
  return (1 / winProbability) * (1 - houseEdge);
}


