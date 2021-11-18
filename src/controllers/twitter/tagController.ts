/*
 * Author: Sara Tran
 * -----
 * Last Modified: Thursday, 18th November 2021 9:17:30 pm
 * Modified By: Sara Tran
 */

import { TwitterTag } from "~/models";

export class TwitterTagController {
  async getAll(): Promise<TwitterTag[]> {
    return await TwitterTag.find();
  }

  async getById(id: number): Promise<TwitterTag> {
    return await TwitterTag.findOneOrFail({
      id,
    });
  }

  async getByName(name: string): Promise<TwitterTag> {
    return await TwitterTag.findOneOrFail({
      name,
    });
  }

  async createTag(name: string) {
    const newTag = TwitterTag.create({
      name,
    });
    return await TwitterTag.save(newTag);
  }
}
