import path from "path";
import { DBConnect } from "~/helpers/dbConnection";

const main = async () => {
  const connection = await DBConnect();
  // Import bots_postgres.csv
  const botFilePath = path.resolve("C:/Users/public/bots_postgres.csv");
  /**
   * https://stackoverflow.com/questions/13947327/to-ignore-duplicate-keys-during-copy-from-in-postgresql
   *
   * tmp_table to copy and ignore duplicate entry
   *
   * Potential problem(s):
   * - implicit connescence with column names and schema and is not type safe
   * - order of columns needs to match with order in csv file
   * - any error will terminate the import
   */
  await connection?.manager.query(
    `
		CREATE TEMP TABLE tmp_table 
		ON COMMIT DROP
		AS
		SELECT * 
		FROM google_bot
		WITH NO DATA;

		COPY tmp_table("id", "username", "dob", "gender", "fName", "lName", "otherTermsCategory", "password", "locLat", "locLong", "type", "politicalRanking")
		FROM '${botFilePath}'
		DELIMITER ','
		CSV HEADER;

		INSERT INTO google_bot
		SELECT *
		FROM tmp_table
		ON CONFLICT DO NOTHING;
		`
  );

  const adFilePath = path.resolve("C:/Users/public/ads_postgres.csv");

  await connection?.manager.query(
    `
		CREATE TEMP TABLE tmp_table 
		ON COMMIT DROP
		AS
		SELECT * 
		FROM google_ad
		WITH NO DATA;

		COPY tmp_table("id", "botId", "createdAt", "image", "headline", "html", "adLink", "loggedIn", "seenOn")
		FROM '${adFilePath}'
		DELIMITER ','
		CSV HEADER;

		INSERT INTO google_ad
		SELECT *
		FROM tmp_table
		ON CONFLICT DO NOTHING;
		`
  );

  const tagFilePath = path.resolve("C:/Users/public/tag_postgres.csv");

  await connection?.manager.query(
    `
		CREATE TEMP TABLE tmp_table 
		ON COMMIT DROP
		AS
		SELECT * 
		FROM google_tag
		WITH NO DATA;

		COPY tmp_table("id", "name")
		FROM '${tagFilePath}'
		DELIMITER ',';

		INSERT INTO google_tag
		SELECT *
		FROM tmp_table
		ON CONFLICT DO NOTHING;
		`
  );

  const adTagFilePath = path.resolve("C:/Users/public/ad_tag_postgres.csv");

  await connection?.manager.query(
    `
		CREATE TEMP TABLE tmp_table 
		ON COMMIT DROP
		AS
		SELECT * 
		FROM google_ad_tag
		WITH NO DATA;

		COPY tmp_table("tagId", "adId")
		FROM '${adTagFilePath}'
		DELIMITER ','
    CSV HEADER;

		INSERT INTO google_ad_tag
		SELECT *
		FROM tmp_table
		ON CONFLICT DO NOTHING;
		`
  );

  console.log("done");
  await connection?.close();
};
main();
