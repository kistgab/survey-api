import * as dotenv from "dotenv";
import { MongoHelper } from "../infra/db/mongodb/helpers/mongo-helper";
import app from "./config/app";

dotenv.config();
MongoHelper.connect(process.env.MONGO_URL)
  .then(() => {
    const port = process.env.PORT;
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch(console.error);
