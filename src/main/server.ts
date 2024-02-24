import { MongoHelper } from "@src/infra/db/mongodb/helpers/mongo-helper";
import app from "@src/main/config/app";

MongoHelper.connect(process.env.MONGO_URL)
  .then(() => {
    const port = process.env.PORT;
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch(console.error);
