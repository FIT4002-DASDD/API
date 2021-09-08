import {
  AfterLoad,
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TwitterAd, TwitterBot } from ".";

@Entity()
export class TwitterAdSeenByBot extends BaseEntity {
  @PrimaryGeneratedColumn()
  adSeenId?: number;

  @ManyToOne(() => TwitterAd, (ad) => ad.adBot)
  @JoinColumn({ name: "adId", referencedColumnName: "id" })
  ad?: TwitterAd;

  @Column("uuid")
  // @PrimaryColumn()
  adId!: string;

  @ManyToOne(() => TwitterBot, (bot) => bot.adBot)
  @JoinColumn({ name: "botId" })
  bot?: TwitterBot;

  @Column("uuid")
  // @PrimaryColumn()
  botId?: string;

  @Column("timestamptz", {
    default: () => "CURRENT_TIMESTAMP",
  })
  // @PrimaryColumn()
  createdAt!: Date;

  @AfterLoad()
  private setTags() {
    if (!this.ad) return;

    // Flatten join result with AdTag entity
    // Note: might be better to do this on the database side
    const adData: any = { ...this.ad };
    delete adData.id;
    Object.assign(this, adData);
    console.log(this);

    // Remove AdTag property to simplify result
    delete this.ad;
  }
}
