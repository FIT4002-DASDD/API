/*
 * Author: Sara Tran
 * -----
 * Last Modified: Thursday, 18th November 2021 9:19:27 pm
 * Modified By: Sara Tran
 */
import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { GoogleAd, GoogleTag } from ".";

/**
 * Class/join table to represent GoogleAd and GoogleTag many-to-many relationship
 */
@Entity()
export class GoogleAdTag extends BaseEntity {
  @PrimaryColumn()
  adId!: string;

  @PrimaryColumn()
  tagId!: number;

  @ManyToOne(() => GoogleAd, (ad) => ad.adTags, { primary: true })
  @JoinColumn({ name: "adId" })
  ad!: GoogleAd;

  @ManyToOne(() => GoogleTag, (tag) => tag.adTags, { primary: true })
  @JoinColumn({ name: "tagId" })
  tag!: GoogleTag;
}
