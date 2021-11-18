/*
 * Author: Sara Tran
 * -----
 * Last Modified: Thursday, 18th November 2021 9:19:31 pm
 * Modified By: Sara Tran
 */
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GoogleAd } from ".";

/**
 * Class to represent a Google Bot
 */
@Entity()
export class GoogleBot extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar")
  username!: string;

  @Column("timestamptz")
  dob!: Date;

  @Column("varchar")
  gender!: string;

  @Column("varchar")
  fName!: string;

  @Column("varchar")
  lName!: string;

  /** Other search terms category. See Google bots info spreadsheet */
  @Column("int")
  otherTermsCategory!: number;

  @Column("varchar")
  password!: string;

  /** bot location latitude */
  @Column("float")
  locLat!: number;

  /** bot location longitude */
  @Column("float")
  locLong!: number;

  @Column("varchar")
  type!: string;

  /**
   * politicalRanking is an integer within the range [0, 4]
   * - 0: Left
   * - 1: Centre-Left
   * - 2: Centre
   * - 3: Centre-Right
   * - 4: Right
   */
  @Column("int")
  politicalRanking!: number;

  @OneToMany(() => GoogleAd, (ad) => ad.bot)
  ads!: GoogleAd[];
}
