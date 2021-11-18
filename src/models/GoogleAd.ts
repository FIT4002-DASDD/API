/*
 * Author: Sara Tran
 * -----
 * Last Modified: Thursday, 18th November 2021 9:19:22 pm
 * Modified By: Sara Tran
 */

import {
  AfterLoad,
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GoogleAdTag, GoogleBot } from ".";
import { GoogleTag } from "./GoogleTag";

/**
 * Class to represent a Google Ad
 */
@Entity()
export class GoogleAd extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => GoogleBot, (bot) => bot.ads)
  @JoinColumn({ name: "botId" })
  bot?: GoogleBot;

  @Column("uuid")
  botId?: string;

  @Column("timestamptz", {
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;

  @Column("varchar", { nullable: true })
  image?: string;

  @Column("varchar", { nullable: true })
  headline?: string;

  @Column("varchar", { nullable: true })
  html?: string;

  @Column("varchar", { nullable: true })
  adLink?: string;

  @Column("boolean", { nullable: true })
  loggedIn?: boolean;

  @Column("varchar", { nullable: true })
  seenOn?: string;

  @OneToMany(() => GoogleAdTag, (adToTag) => adToTag.ad)
  adTags?: GoogleAdTag[];

  tags?: GoogleTag[];

  @AfterLoad()
  private setTags() {
    if (!this.adTags) return;

    // Flatten join result with AdTag entity
    // Note: might be better to do this on the database side
    this.tags = this.adTags.map((adTag) => adTag.tag);

    // Remove AdTag property to simplify result
    delete this.adTags;
  }
}
