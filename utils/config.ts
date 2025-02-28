import { z } from "zod";

export const envSchema = z.object({
  GAME_ADDRESS: z
    .string()
    .regex(/^0x[a-fA-F0-9]+$/, "Invalid hex string")
    .transform((val) => val as `0x${string}`),
  START_BLOCK: z.string().transform((val) => BigInt(val)),
  API_URL: z.string(),
  GAME_SECRET: z.string(),
});

export const parsedEnv = envSchema.parse(process.env);
export const config = {
  gameAddress: parsedEnv.GAME_ADDRESS,
  startBlock: parsedEnv.START_BLOCK,
  apiUrl: parsedEnv.API_URL,
  gameSecret: parsedEnv.GAME_SECRET,
};
