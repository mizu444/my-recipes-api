import { Request, Response } from "express";
import { Not, Repository } from "typeorm";
import { Recipe } from "../entities/recipe";

const getRecipes = async (
  req: Request,
  res: Response,
  recipeRepository: Repository<Recipe>
) => {
  const recipes = await recipeRepository.find();
  res.status(200).json({ recipes });
};

const editRecipe = async (req, res, recipeRepository: Repository<Recipe>) => {
  console.log('serus')
  const { title, ingredients, directions, image } = req.body;
  const recipeId = req.params.id;
  if (recipeId === undefined) {
    return res.status(400).json({ message: "Invalid Recipe ID" });
  }
  console.log('serus')

  const recipe = await recipeRepository.findOne({ where: { id: recipeId } });
  if (!recipe) {
    return res.status(404).json({ message: "Not Found" });
  }

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }
  const recipes = await recipeRepository.find({ where: { title, id: Not(recipeId)} });
  if (recipes.length) {
    return res.status(400).json({ message: "Title is not unique" });
  }

  if (!ingredients) {
    return res
      .status(400)
      .json({ message: "At least one ingredient is required" });
  }
  if (!directions) {
    return res.status(400).json({ message: "Directions are required" });
  }

  recipe.title = title;
  recipe.ingredients = ingredients
    .split(",")
    .map((ingredient) => ingredient.trim())
    .filter((ingredient) => !!ingredient);
  recipe.image = image;
  recipe.directions = directions;
  const saveRecipe = await recipeRepository.save(recipe);

  res.status(200).json({
    updated: saveRecipe,
  });
};

const createRecipe = async (req, res, recipeRepository: Repository<Recipe>) => {
  const { title, ingredients, directions, image } = req.body;
  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }
  const recipes = await recipeRepository.find({ where: { title } });
  if (recipes.length) {
    return res.status(400).json({ message: "Title is not unique" });
  }
  if (!ingredients) {
    return res
      .status(400)
      .json({ message: "At least one ingredient is required" });
  }
  if (!directions) {
    return res.status(400).json({ message: "Directions are required" });
  }

  const newRecipe = recipeRepository.create();
  newRecipe.title = title;
  newRecipe.ingredients = ingredients
    .split(",")
    .map((ingredient) => ingredient.trim())
    .filter((ingredient) => !!ingredient);
  newRecipe.image = image;
  newRecipe.directions = directions;
  const saveRecipe = await recipeRepository.save(newRecipe);

  res.status(200).json({
    created: saveRecipe,
  });
};

const deleteRecipe = async (
  req: Request,
  res: Response,
  recipeRepository: Repository<Recipe>
) => {
  const id = Number.parseInt(req.params.id);

  const recipe = await recipeRepository.findOne({ where: { id } });
  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }
  await recipeRepository.delete(id);
  res.status(200).json({
    message: "Recipe deleted",
  });
};

export { getRecipes, editRecipe, createRecipe, deleteRecipe };
