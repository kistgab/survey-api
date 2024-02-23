import { MongoHelper } from "@src/infra/db/mongodb/helpers/mongo-helper";
import LogMongoRepository from "@src/infra/db/mongodb/log/log-mongo-repository";
import { Collection } from "mongodb";

function createSut(): LogMongoRepository {
  return new LogMongoRepository();
}

describe("Log Mongo Repository", () => {
  let errorCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    errorCollection = MongoHelper.getCollection("errors");
    await errorCollection.deleteMany({});
  });

  it("should create the error log on success", async () => {
    const sut = createSut();

    await sut.logError("any_error");

    expect(await errorCollection.countDocuments()).toBe(1);
  });
});
