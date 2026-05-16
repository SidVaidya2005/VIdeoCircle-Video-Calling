import { env } from "./config/env.js";
import { connectMongo } from "./config/db.js";
import { createApp } from "./createApp.js";

const app = createApp();

const start = async () => {
  await connectMongo();
  app.listen(env.port, () => {
    console.log(`Listening on port ${env.port}`);
  });
};

start();
