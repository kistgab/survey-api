import AddAccountModel from "../../../../data/models/add-account-model";
import { MongoHelper } from "../helpers/mongo-helper";
import { AccountMongoRepository } from "./account";

function createSut(): AccountMongoRepository {
  return new AccountMongoRepository();
}

describe("Account Mongo Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    await MongoHelper.getCollection("accounts").deleteMany({});
  });

  it("should return an account on success", async () => {
    const sut = createSut();
    const input: AddAccountModel = {
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    };

    const account = await sut.add(input);

    expect(account.id).toBeDefined();
    expect(account.name).toBe("any_name");
    expect(account.email).toBe("any_email@mail.com");
    expect(account.password).toBe("any_password");
  });
});
