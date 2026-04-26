import "dotenv/config";

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT) || 8000,
  mongoUrl: required("MONGO_URL"),
  livekit: {
    apiKey: required("LIVEKIT_API_KEY"),
    apiSecret: required("LIVEKIT_API_SECRET"),
    url: required("LIVEKIT_URL"),
  },
};
