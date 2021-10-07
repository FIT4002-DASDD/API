import { createDatabase } from "pg-god";
import {
  Connection,
  createConnection,
  DeepPartial,
  getConnection,
} from "typeorm";
import ORMConfig from "~/configs/ormconfig";
import { GoogleAd, GoogleAdTag, GoogleBot, GoogleTag } from "~/models";
import {
  TwitterAd,
  TwitterAdTag,
  TwitterBot,
  TwitterTag,
  TwitterAdSeenByBot,
} from "~/models";
const env = process.env;
if (env.NODE_ENV !== "test") {
  console.error("Test utilities only available in testing mode");
}

const connection = {
  async create() {
    // await createConnection();

    await createDatabase(
      { databaseName: ORMConfig.database },
      {
        user: ORMConfig.username,
        port: ORMConfig.port,
        host: ORMConfig.host,
        password:
          typeof ORMConfig.password === "undefined"
            ? undefined
            : typeof ORMConfig.password === "string"
            ? ORMConfig.password
            : await ORMConfig.password(),
      }
    );

    let connection: Connection | undefined;
    try {
      connection = getConnection();
    } catch (e) {}

    try {
      if (connection) {
        if (!connection.isConnected) {
          connection = await connection.connect();
        }
      }
      connection = await createConnection({ ...ORMConfig, dropSchema: true });
      return connection;
    } catch (e) {
      throw e;
    }
  },

  async close() {
    const connection = getConnection();
    // await connection.dropDatabase();
    await connection.close();
  },

  async clear() {
    const connection = getConnection();
    const entities = connection.entityMetadatas;
    for (const entity of entities) {
      const repository = connection.getRepository(entity.name);
      await repository.query(`TRUNCATE ${entity.tableName} CASCADE`);
    }
  },
};

export { connection };
