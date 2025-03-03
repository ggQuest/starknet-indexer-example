import { hash } from "starknet";
import {
  combineParsers,
  parseBoolean,
  parseFelt252,
  parseU8,
  parseU16,
  parseU64,
  parseU256,
} from "./parsers";

function eventKey(name: string) {
  const h = BigInt(hash.getSelectorFromName(name));
  return `0x${h.toString(16).padStart(64, "0")}` as const;
}

export const START_GAME = eventKey("StartGame");
export const ADVENTURER_UPGRADED = eventKey("AdventurerUpgraded");

export const parseStats = combineParsers({
  strength: { index: 0, parser: parseU8 },
  dexterity: { index: 1, parser: parseU8 },
  vitality: { index: 2, parser: parseU8 },
  intelligence: { index: 3, parser: parseU8 },
  wisdom: { index: 4, parser: parseU8 },
  charisma: { index: 5, parser: parseU8 },
  luck: { index: 6, parser: parseU8 },
});

export const parseLootStatistics = combineParsers({
  id: { index: 0, parser: parseU8 },
  xp: { index: 1, parser: parseU16 },
});

export const parseLoot = combineParsers({
  id: { index: 0, parser: parseU8 },
  tier: { index: 1, parser: parseU16 },
  itemType: { index: 2, parser: parseU8 },
  slot: { index: 3, parser: parseU8 },
});

export const parseLootWithPrice = combineParsers({
  item: { index: 0, parser: parseLoot },
  price: { index: 1, parser: parseU16 },
});

export const parseEquipment = combineParsers({
  weapon: { index: 0, parser: parseLootStatistics },
  chest: { index: 1, parser: parseLootStatistics },
  head: { index: 2, parser: parseLootStatistics },
  waist: { index: 3, parser: parseLootStatistics },
  foot: { index: 4, parser: parseLootStatistics },
  hand: { index: 5, parser: parseLootStatistics },
  neck: { index: 6, parser: parseLootStatistics },
  ring: { index: 7, parser: parseLootStatistics },
});

export const parseAdventurer = combineParsers({
  health: { index: 0, parser: parseU16 },
  xp: { index: 1, parser: parseU16 },
  gold: { index: 2, parser: parseU16 },
  beastHealth: { index: 3, parser: parseU16 },
  statsUpgradesAvailable: { index: 4, parser: parseU8 },
  stats: { index: 5, parser: parseStats },
  equipment: { index: 6, parser: parseEquipment },
  battleActionCount: { index: 7, parser: parseU16 },
  mutated: { index: 8, parser: parseBoolean },
  awaitingItemSpecials: { index: 9, parser: parseBoolean },
});

export const parseAdventurerState = combineParsers({
  owner: { index: 0, parser: parseFelt252 },
  adventurerId: { index: 1, parser: parseFelt252 },
  entropy: { index: 2, parser: parseFelt252 },
  adventurer: { index: 3, parser: parseAdventurer },
});

export const parseAdventurerMetadata = combineParsers({
  birthDate: { index: 0, parser: parseU64 },
  deathDate: { index: 1, parser: parseU64 },
  adventurerEntropy: { index: 2, parser: parseU64 },
  itemSpecialsSeed: { index: 3, parser: parseU16 },
  rankAtDeath: { index: 4, parser: parseU8 },
  delayStatReveal: { index: 5, parser: parseBoolean },
});

export const parseStartGame = combineParsers({
  adventurerState: { index: 0, parser: parseAdventurerState },
  adventurerMeta: { index: 1, parser: parseAdventurerMetadata },
  name: { index: 2, parser: parseFelt252 },
  goldenTokenId: { index: 3, parser: parseU256 },
  customRenderer: { index: 4, parser: parseFelt252 },
});

export const parseBag = combineParsers({
  item1: { index: 0, parser: parseLootStatistics },
  item2: { index: 1, parser: parseLootStatistics },
  item3: { index: 2, parser: parseLootStatistics },
  item4: { index: 3, parser: parseLootStatistics },
  item5: { index: 4, parser: parseLootStatistics },
  item6: { index: 5, parser: parseLootStatistics },
  item7: { index: 6, parser: parseLootStatistics },
  item8: { index: 7, parser: parseLootStatistics },
  item9: { index: 8, parser: parseLootStatistics },
  item10: { index: 9, parser: parseLootStatistics },
  item11: { index: 10, parser: parseLootStatistics },
  item12: { index: 11, parser: parseLootStatistics },
  item13: { index: 12, parser: parseLootStatistics },
  item14: { index: 13, parser: parseLootStatistics },
  item15: { index: 14, parser: parseLootStatistics },
  mutated: { index: 15, parser: parseBoolean },
});

export const parseAdventurerStateWithBag = combineParsers({
  adventurerState: { index: 0, parser: parseAdventurerState },
  bag: { index: 1, parser: parseBag },
});

export const parseAdventurerUpgraded = combineParsers({
  adventurerStateWithBag: { index: 0, parser: parseAdventurerStateWithBag },
  strengthIncrease: { index: 1, parser: parseU8 },
  dexterityIncrease: { index: 2, parser: parseU8 },
  vitalityIncrease: { index: 3, parser: parseU8 },
  intelligenceIncrease: { index: 4, parser: parseU8 },
  wisdomIncrease: { index: 5, parser: parseU8 },
  charismaIncrease: { index: 6, parser: parseU8 },
});
