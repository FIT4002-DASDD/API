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
import { AdTag } from ".";
import { Ad } from "./Ad";

@Entity()
@Unique("tag_name_constraint", ["name"])
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  // If tag is not user-generated but is predefined, should use enum instead
  @Column()
  name!: string;

  @OneToMany(() => AdTag, (adToTag) => adToTag.tag)
  adTags?: AdTag[];

  ads!: Ad[];

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

    const res = await getConnection().manager.query(
      `
      SELECT SETVAL(
        (SELECT PG_GET_SERIAL_SEQUENCE('"tag"', 'id')),
        GREATEST(NEXTVAL(PG_GET_SERIAL_SEQUENCE('"tag"', 'id'))-1, (SELECT (MAX("id")) FROM "tag"))
      );
      `
    );
  }
}
