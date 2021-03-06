/*
 * Author: Sara Tran
 * -----
 * Last Modified: Thursday, 18th November 2021 9:19:58 pm
 * Modified By: Sara Tran
 */
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { TwitterAdSeenByBot } from ".";

enum TwitterBotType {
  AMERICA = "america",
  AUSTRALIA = "australia",
  UNSPECIFIED = "unspecified",
}

enum TwitterPoliticalRanking {
  LEFT = 0,
  CENTRE_LEFT = 1,
  CENTRE = 2,
  CENTRE_RIGHT = 3,
  RIGHT = 4,
  UNSPECIFIED = 5,
}

/**
 * Class to represent Twitter Bot
 */
@Entity()
export class TwitterBot extends BaseEntity {
  public static BOT_TYPE = TwitterBotType;
  public static POLITICAL_RANKING = TwitterPoliticalRanking;

  @PrimaryColumn("varchar")
  id!: string; // Same as username, not removed for compatibility reason

  @Column("varchar")
  username!: string;

  @Column("varchar", { nullable: true, select: false }) // Don't select password by default
  password!: string;

  @Column("varchar", { nullable: true, select: false })
  phone!: string;

  @Column({
    type: "enum",
    enum: TwitterBot.BOT_TYPE,
    default: TwitterBot.BOT_TYPE.UNSPECIFIED,
  })
  type!: TwitterBotType;

  @Column({
    type: "enum",
    enum: TwitterBot.POLITICAL_RANKING,
    default: TwitterBot.POLITICAL_RANKING.UNSPECIFIED,
  })
  politicalRanking!: TwitterPoliticalRanking;

  @Column("text", { array: true, default: [] })
  followedAccounts!: string[];

  @Column("text", { array: true, default: [] })
  relevantTags!: string[];

  @Column("date", { nullable: true })
  dob!: Date;

  @OneToMany(() => TwitterAdSeenByBot, (adToTag) => adToTag.bot)
  adBot?: TwitterAdSeenByBot[];
}
