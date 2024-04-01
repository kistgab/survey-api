import { MongoHelper } from "@src/infra/db/mongodb/helpers/mongo-helper";
import { setupApp } from "@src/main/config/app";
import { config } from "dotenv";

config();
MongoHelper.connect(process.env.MONGO_URL)
  .then(() => {
    const port = process.env.PORT;
    const app = setupApp();
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch(console.error);
