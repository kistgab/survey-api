import { Collection } from "mongodb";
import AddAccountModel from "../../../../data/models/add-account-model";
import { MongoHelper } from "../helpers/mongo-helper";
import { AccountMongoRepository } from "./account-mongo-repository";

function createSut(): AccountMongoRepository {
  return new AccountMongoRepository();
}

describe("Account Mongo Repository", () => {
  let accountCollection: Collection;
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  describe("add", () => {
    it("should return an account on add success", async () => {
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

  describe("findByEmail", () => {
    it("should return an account on findByEmail success", async () => {
      await accountCollection.insertOne({
        email: "any_email@mail.com",
        name: "any_name",
        password: "any_password",
      });
      const sut = createSut();

      const account = await sut.findByEmail("any_email@mail.com");

      expect(account?.id).toBeDefined();
      expect(account?.name).toBe("any_name");
      expect(account?.email).toBe("any_email@mail.com");
      expect(account?.password).toBe("any_password");
    });

    it("should return null on findByEmail fail", async () => {
      const sut = createSut();

      const account = await sut.findByEmail("any_email@mail.com");

      expect(account).toBeNull();
    });
  });

  describe("updateAccessToken", () => {
    it("should update the account accessToken on updateAccessToken success", async () => {
      const sut = createSut();
      const res = await accountCollection.insertOne({
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
      });
      const fakeAccount = await accountCollection.findOne({ _id: res.insertedId });
      expect(fakeAccount?.accessToken).toBeUndefined();

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await sut.updateAccessToken(fakeAccount!._id.toString(), "any_token");

      const account = await accountCollection.findOne({ _id: fakeAccount?._id });
      expect(account).toBeTruthy();
      expect(account?.accessToken).toBe("any_token");
    });
  });

  describe("findByToken", () => {
    it("should return an account on findByToken success (without role)", async () => {
      await accountCollection.insertOne({
        email: "any_email@mail.com",
        name: "any_name",
        password: "any_password",
        accessToken: "any_token",
      });
      const sut = createSut();

      const account = await sut.findByToken("any_token");

      expect(account?.id).toBeDefined();
      expect(account?.name).toBe("any_name");
      expect(account?.email).toBe("any_email@mail.com");
      expect(account?.password).toBe("any_password");
    });

    it("should return an account on findByToken success (with role)", async () => {
      await accountCollection.insertOne({
        email: "any_email@mail.com",
        name: "any_name",
        password: "any_password",
        accessToken: "any_token",
        role: "any_role",
      });
      const sut = createSut();

      const account = await sut.findByToken("any_token", "any_role");

      expect(account?.id).toBeDefined();
      expect(account?.name).toBe("any_name");
      expect(account?.email).toBe("any_email@mail.com");
      expect(account?.password).toBe("any_password");
    });

    it("should return an account on findByToken success (with admin role)", async () => {
      await accountCollection.insertOne({
        email: "any_email@mail.com",
        name: "any_name",
        password: "any_password",
        accessToken: "any_token",
        role: "admin",
      });
      const sut = createSut();

      const account = await sut.findByToken("any_token", "admin");

      expect(account?.id).toBeDefined();
      expect(account?.name).toBe("any_name");
      expect(account?.email).toBe("any_email@mail.com");
      expect(account?.password).toBe("any_password");
    });

    it("should return null on findByToken success (with invalid role)", async () => {
      await accountCollection.insertOne({
        email: "any_email@mail.com",
        name: "any_name",
        password: "any_password",
        accessToken: "any_token",
      });
      const sut = createSut();

      const account = await sut.findByToken("any_token", "admin");

      expect(account).toBeNull();
    });

    it("should return an account on findByToken success (if user is admin)", async () => {
      await accountCollection.insertOne({
        email: "any_email@mail.com",
        name: "any_name",
        password: "any_password",
        accessToken: "any_token",
        role: "admin",
      });
      const sut = createSut();

      const account = await sut.findByToken("any_token");

      expect(account?.id).toBeDefined();
      expect(account?.name).toBe("any_name");
      expect(account?.email).toBe("any_email@mail.com");
      expect(account?.password).toBe("any_password");
    });

    it("should return null on findByToken fail", async () => {
      const sut = createSut();

      const account = await sut.findByToken("any_token");

      expect(account).toBeNull();
    });
  });
});
