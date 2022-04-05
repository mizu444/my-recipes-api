import * as express from "express";
import * as cors from "cors";
import * as recipes from "./controllers/recipes";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Recipe } from "./entities/recipe";
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

createConnection({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "miska",
  password: "Welcome2",
  database: "Recipes",
  entities: [Recipe],
  synchronize: true,
})
  .then((db) => {
    const recipeRepository = db.getRepository(Recipe);

    app.get("/", (req, res) => {
      res.send("success");
    });

    app.get("/recipes", (req, res) => {
      recipes.getRecipes(req, res, recipeRepository);
    });

    app.post("/recipes", (req, res) => {
      recipes.createRecipe(req, res, recipeRepository);
    });

    app.put("/recipe/:id", (req, res) => {
      recipes.editRecipe(req, res, recipeRepository);
    });

    app.delete("/recipe/:id", (req, res) => {
      recipes.deleteRecipe(req, res, recipeRepository);
    });
  })
  .catch((error) => console.log(error));

app.listen(8080, () => {
  console.log("app is running on port 8080");
});
