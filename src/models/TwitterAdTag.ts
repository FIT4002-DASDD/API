import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { TwitterAd, TwitterTag } from ".";

/**
 * Class/join table to represent TwitterAd and TwitterTag many-to-many relationship
 */
@Entity()
export class TwitterAdTag extends BaseEntity {
  @PrimaryColumn()
  adId!: string;

  @PrimaryColumn()
  tagId!: number;

  @ManyToOne(() => TwitterAd, (ad) => ad.adTags, { primary: true })
  @JoinColumn({ name: "adId" })
  ad!: TwitterAd;

  @ManyToOne(() => TwitterTag, (tag) => tag.adTags, { primary: true })
  @JoinColumn({ name: "tagId" })
  tag!: TwitterTag;
}
