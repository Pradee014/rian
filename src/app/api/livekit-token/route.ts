import { AccessToken } from "livekit-server-sdk";
import { NextResponse } from "next/server";
import { getLiveKitServerConfig } from "@/lib/livekit/config";
import { parseLiveKitTokenRequest } from "@/lib/livekit/token-request";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { roomName, participantName } = parseLiveKitTokenRequest(body);
    const config = getLiveKitServerConfig();
    const token = new AccessToken(config.apiKey, config.apiSecret, {
      identity: participantName,
      name: participantName,
    });

    token.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    return NextResponse.json({
      token: await token.toJwt(),
      url: config.url,
      roomName,
      participantName,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not create LiveKit token.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
