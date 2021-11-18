/*
 * Author: Sara Tran
 * -----
 * Last Modified: Thursday, 18th November 2021 9:16:04 pm
 * Modified By: Sara Tran
 */

import path, { join } from "path";
import { config } from "./config";
// const result = dotenv.config();

const isCompiled = path.extname(__filename).includes("js");
// console.log([join(__dirname, "..", "migrations/**/*{.ts,.js}")]);
export = {
  type: "postgres",
  host: config.DB_HOST || "localhost",
  port: config.DB_PORT || 5432,
  username: config.DB_USERNAME || "postgres",
  password: config.DB_PASSWORD || "password",
  database: config.DB_NAME || "postgres",
  synchronize: config.DB_SYNC || false,
  logging: config.DB_LOGS || false,
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 2000,
  migrationsRun: false,
  entities: [join(__dirname, "..", "models", "**", "*.{ts,js}")],
  migrations: ["migrations/**/*{.ts,.js}"],
  // seeds: ["src/database/seeds/**/*{.ts,.js}"],
  // factories: ["src/database/factories/**/*{.ts,.js}"],
  cli: {
    entitiesDir: join(__dirname, "..", "models", "**", "*.{ts,js}"),
    migrationsDir: "migrations",
  },
} as any;
