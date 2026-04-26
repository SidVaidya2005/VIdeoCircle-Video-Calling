import { AccessToken } from "livekit-server-sdk";
import { env } from "../../config/env.js";

const TOKEN_TTL = "1h";

export async function generateLiveKitToken({ room, username }) {
  const at = new AccessToken(env.livekit.apiKey, env.livekit.apiSecret, {
    identity: `${username}-${globalThis.crypto.randomUUID()}`,
    name: username,
    ttl: TOKEN_TTL,
  });

  at.addGrant({
    room,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    roomCreate: true,
  });

  const token = await at.toJwt();
  return { token, url: env.livekit.url };
}
