/*
 * Author: Sara Tran
 * -----
 * Last Modified: Thursday, 18th November 2021 9:19:03 pm
 * Modified By: Sara Tran
 */

import { Connection, createConnection, getConnection } from "typeorm";
import ORMConfig from "~/configs/ormconfig";

export const DBConnect = async () => {
  let connection: Connection | undefined;
  try {
    connection = getConnection();
  } catch (e) {}

  try {
    if (connection) {
      if (!connection.isConnected) {
        return await connection.connect();
      }
    } else {
      return await createConnection(ORMConfig);
    }
    console.log("Database connection was successful!");
  } catch (e) {
    console.error("ERROR: Database connection failed!!", e);
    throw e;
  }
};

export const TryDBConnect = async (onError: Function, next?: Function) => {
  try {
    await DBConnect();
    if (next) {
      next();
    }
  } catch (e) {
    onError();
  }
};
