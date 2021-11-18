/*
 * Author: Sara Tran
 * -----
 * Last Modified: Thursday, 18th November 2021 9:19:52 pm
 * Modified By: Sara Tran
 */
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
