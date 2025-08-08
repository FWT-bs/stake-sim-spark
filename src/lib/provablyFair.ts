import CryptoJS from "crypto-js";

export type SeedBundle = {
  serverSeed: string; // revealed after round
  serverSeedHash: string; // committed before round
  clientSeed: string;
  nonce: number; // increments per user per round
};

export function generateServerSeed(): string {
  return CryptoJS.lib.WordArray.random(32).toString();
}

export function hashServerSeed(serverSeed: string): string {
  return CryptoJS.SHA256(serverSeed).toString();
}

export function hmacSHA256(serverSeed: string, message: string): string {
  return CryptoJS.HmacSHA256(message, serverSeed).toString();
}

export function outcomeFromHashBits(hash: string, bits: number): number {
  const chars = Math.ceil(bits / 4);
  const slice = hash.slice(0, chars);
  const value = parseInt(slice, 16);
  return value;
}

// Game helpers
export function coinflipOutcome(hash: string): "Heads" | "Tails" {
  const v = outcomeFromHashBits(hash, 8);
  return v % 2 === 0 ? "Heads" : "Tails";
}

export function crashMultiplier(hash: string, houseEdge = 0.01): number {
  // Use Bustabit-like method: take ~52 bits, compute 1 / (1 - r), remove small mass at 1.00x
  const H = BigInt("0x" + hash.slice(0, 13)); // 52 bits approx
  const MAX = BigInt(1) << BigInt(52);
  const threshold = BigInt(Math.floor(Number(MAX) * houseEdge));
  if (H < threshold) return 1.0;
  const r = Number(H) / Number(MAX);
  const m = 1 / (1 - r);
  return Math.max(1, m);
}

export function minesIsBomb(hash: string, tileIndex: number, totalTiles: number, mines: number): boolean {
  // Deterministic selection: hash + tileIndex decides if a given tile is bomb by threshold
  const subHash = CryptoJS.SHA256(hash + ":" + tileIndex).toString();
  const v = outcomeFromHashBits(subHash, 16);
  const p = mines / totalTiles;
  const threshold = Math.floor(p * 65536);
  return v % 65536 < threshold;
}


