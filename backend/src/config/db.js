import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectMongo() {
  const connection = await mongoose.connect(env.mongoUrl, {
    tls: true,
    tlsAllowInvalidCertificates: false,
  });
  console.log(`MONGO Connected DB Host: ${connection.connection.host}`);
  return connection;
}
