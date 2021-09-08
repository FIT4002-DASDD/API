import {
  AfterLoad,
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { TwitterAdSeenByBot, TwitterAdTag, TwitterTag } from ".";

interface ITwitterAd {
  adId?: string;
  promoterHandle?: string;
  content?: string;
  officialLink?: string;
  tweetLink?: string;
  tags?: TwitterTag[];
}

export enum TwitterAdType {
  UNSPECIFIED = "AD_TYPE_UNSPECIFIED",
  TWEET = "AD_TYPE_TWEET",
  FOLLOW = "AD_TYPE_FOLLOW",
}

@Entity()
@Unique("unique_tweet_link", ["tweetLink"])
export class TwitterAd extends BaseEntity implements ITwitterAd {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar")
  promoterHandle?: string;

  @Column("varchar", { nullable: true })
  content?: string;

  @Column("varchar", { nullable: true })
  officialLink?: string;

  @Column("varchar", { nullable: true })
  tweetLink?: string;

  @Column("varchar", { nullable: true })
  image?: string;

  @OneToMany(() => TwitterAdTag, (adToTag) => adToTag.ad)
  adTags?: TwitterAdTag[];

  tags?: TwitterTag[];

  @OneToMany(() => TwitterAdSeenByBot, (adToTag) => adToTag.ad)
  adBot?: TwitterAdSeenByBot[];

  @Column({
    type: "enum",
    enum: TwitterAdType,
    default: TwitterAdType.UNSPECIFIED,
  })
  adType?: TwitterAdType;

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
