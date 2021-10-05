import supertest from "supertest";
import { app, server } from "~/app";
import { connection } from "../../testConnection";

beforeAll(async (done) => {
  await connection.create();
  done();
});

afterAll(async (done) => {
  await connection.close();
  done();
});

test("template", async (done) => {
    done();
});