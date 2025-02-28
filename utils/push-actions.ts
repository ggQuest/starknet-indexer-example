import { config } from "./config";

export type PushActionsPayload = {
  actions: string[];
  address: string;
};

export async function pushActions({ actions, address }: PushActionsPayload) {
  const url = `${config.apiUrl}/api/v2/action-dispatcher/dispatch/public`;

  const body = JSON.stringify({ actions, playerAddress: address });

  return fetch(url, {
    method: "POST",
    body,
    headers: {
      secret: config.gameSecret,
      "Content-Type": "application/json",
    },
  });
}
