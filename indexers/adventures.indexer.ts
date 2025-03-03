import { defineIndexer } from "@apibara/indexer";
import { useLogger } from "@apibara/indexer/plugins";
import { StarknetStream } from "@apibara/starknet";
import { numberToHex } from "viem";
import { config } from "../utils/config";
import {
  ADVENTURER_UPGRADED,
  START_GAME,
  parseAdventurerUpgraded,
  parseStartGame,
} from "../utils/events";
import { type PushActionsPayload, pushActions } from "../utils/push-actions";

export default defineIndexer(StarknetStream)({
  streamUrl: "https://starknet.preview.apibara.org",
  startingCursor: {
    orderKey: config.startBlock,
  },
  filter: {
    events: [
      {
        address: config.gameAddress,
        keys: [START_GAME],
      },
      {
        address: config.gameAddress,
        keys: [ADVENTURER_UPGRADED],
      },
    ],
  },
  async transform({ block }) {
    const logger = useLogger();
    const payloads: PushActionsPayload[] = [];

    block.events.map((event) => {
      switch (event.keys[0]) {
        case START_GAME: {
          logger.log("START_GAME", "->", "ADVENTURER UPDATES");
          const { value } = parseStartGame(event.data, 0);

          const owner = numberToHex(BigInt(value.adventurerState.owner));

          payloads.push({ actions: ["Game started"], address: owner });
          break;
        }
        case ADVENTURER_UPGRADED: {
          const actions = [];
          logger.log("ADVENTURER_UPGRADED", "->", "ADVENTURER UPDATES");
          const { value } = parseAdventurerUpgraded(event.data, 0);

          const owner = numberToHex(
            BigInt(value.adventurerStateWithBag.adventurerState.owner ?? 0)
          );

          actions.push("Adventurer upgraded");

          // Some additional logic ...
          // ...
          // actions.push("Adventurer level N upgraded")
          // ...

          payloads.push({ actions, address: owner });
          break;
        }
      }
    });

    try {
      const promises = payloads.map((payload) => pushActions(payload));
      await Promise.all(promises);
    } catch (error) {
      logger.error("Failed to push actions", error);
    }
  },
});
