# API for Sending Actions in the Game

## Introduction

This document explains how game developers can use the API to send confirmed game events.

Developers need to implement an indexer (in this example, Apibara) that tracks events in the game and sends corresponding requests to the API.

## Obtaining the API Key (secret)

To authenticate API requests, a secret is required, which is unique for each game. You can obtain it by contacting us.

## Providing a List of Actions

Developers must provide a predefined list of possible actions that will be tracked and sent to the API. These actions must represent events that have already occurred, such as:

- `"Zombie killed"`
- `"Iron Mined"`
- `"Match Won"`

Only actions from the provided list will be accepted by the system.

## Request Format

The API accepts POST requests to the following URL:

```curl
POST $API_URL/api/v2/action-dispatcher/dispatch/public
```

#### Request Body (JSON):

```json
{
  "actions": ["Zombie killed", "Iron Mined"],
  "playerAddress": "0x123456789abcdef"
}
```

#### Headers:

```json
{
  "secret": "GAME_UNIQUE_SECRET",
  "Content-Type": "application/json"
}
```

#### API Response:

**Success**: `{ "status": "success" }`

**Error**: Returns `400`

---

**_Example of request code is in `utils/push-actions.ts`_**

---

## Example of Apibara Indexer Code

Below is an example of an Apibara indexer that tracks events and sends them to the API.

### Code Explanation

#### 1. Filtering Events

Example indexer listens to two types of events:

- **START_GAME**: Triggers when a game starts.
- **ADVENTURER_UPGRADED**: Triggers when an adventurer is upgraded.

```typescript
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
```

#### 2. Processing Events and Sending Actions

Each event is processed, and the corresponding action is pushed to the API.

- `START_GAME` maps to the action `"Game started"`.
- `ADVENTURER_UPGRADED` maps to the action `"Adventurer upgraded"`.

```typescript
block.events.map((event) => {
  switch (event.keys[0]) {
    case START_GAME: {
      const { value } = parseStartGame(event.data, 0);
      const owner = numberToHex(BigInt(value.adventurerState.owner));
      payloads.push({ actions: ["Game started"], address: owner });
      break;
    }
    case ADVENTURER_UPGRADED: {
      const { value } = parseAdventurerUpgraded(event.data, 0);
      const owner = numberToHex(
        BigInt(value.adventurerStateWithBag.adventurerState.owner ?? 0)
      );
      payloads.push({ actions: ["Adventurer upgraded"], address: owner });
      break;
    }
  }
});
```

#### 3. Sending Actions to API

The collected actions are sent to the API using `pushActions`.

```typescript
try {
  const promises = payloads.map((payload) => pushActions(payload));
  await Promise.all(promises);
} catch (error) {
  logger.error("Failed to push actions", error);
}
```

---

**_Example of indexing code coult be found at `indexers/adventurers.indexrer.ts`_**

---
