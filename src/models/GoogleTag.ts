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
import { GoogleAdTag } from ".";
import { GoogleAd } from "./GoogleAd";

/**
 * Class to represent a Tag
 */
@Entity()
@Unique("google_tag_name_constraint", ["name"])
export class GoogleTag extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column()
  name!: string;

  @OneToMany(() => GoogleAdTag, (adToTag) => adToTag.tag)
  adTags?: GoogleAdTag[];

  ads!: GoogleAd[];

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
    const tableName = GoogleTag.getRepository().metadata.tableName;

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
