import {
  AfterLoad,
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  getConnection,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { TwitterAdTag } from ".";
import { TwitterAd } from "./TwitterAd";

@Entity()
@Unique("twitter_tag_name_constraint", ["name"])
export class TwitterTag extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  // If tag is not user-generated but is predefined, should use enum instead
  @Column()
  name!: string;

  @OneToMany(() => TwitterAdTag, (adToTag) => adToTag.tag)
  adTags?: TwitterAdTag[];

  ads!: TwitterAd[];

  @AfterLoad()
  private setAds() {
    // Flatten join result with AdTag entity
    // Note: might be better to do this on the database side
    if (!this.adTags) return;
    this.ads = this.adTags.map((adTag) => adTag.ad);

    // Remove AdTag property to simplify result
    delete this.adTags;
    return;
  }

  @BeforeInsert()
  private async checkAndSyncIdSequence() {
    /**
     * Resync id sequence
     * Note:
     * - Id sequence goes out-of-sync when we manually import tag data that also contains id
     * - This can be disable in production if we do not manually import tag data to potentially give a very small performance boost
     * - Potential problem with concurrent tag inserting from multiple concurrent transactions?
     */
    const tableName = TwitterTag.getRepository().metadata.tableName;
    const res = await getConnection().manager.query(
      `
      SELECT SETVAL(
        (SELECT PG_GET_SERIAL_SEQUENCE('"${tableName}"', 'id')),
        GREATEST(NEXTVAL(PG_GET_SERIAL_SEQUENCE('"${tableName}"', 'id'))-1, (SELECT (MAX("id")) FROM "${tableName}"), 1)
      );
      `
    );
  }
}
