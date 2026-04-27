type Mod = (typeof INC_MODS | typeof DEC_MODS | typeof UTILS_MODS)[number];

const INC_MODS = ["HR", "HD", "DT", "NC", "SD", "PF", "FL"] as const;
const DEC_MODS = ["EZ", "NF", "HT"] as const;
const UTILS_MODS = ["RX", "AP", "SO", "AT", "V2"] as const;
const MODS: Mod[] = [...INC_MODS, ...DEC_MODS, ...UTILS_MODS];

export { INC_MODS, DEC_MODS, UTILS_MODS, MODS };
export type { Mod };
