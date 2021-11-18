/*
 * Author: Sara Tran
 * -----
 * Last Modified: Thursday, 18th November 2021 9:16:19 pm
 * Modified By: Sara Tran
 */

import { GoogleBot } from "~/models";

export class GoogleBotController {
  async getAll(): Promise<GoogleBot[]> {
    return await GoogleBot.find();
  }

  async getByUsername(username: string): Promise<GoogleBot> {
    return await GoogleBot.findOneOrFail({
      username,
    });
  }
}
