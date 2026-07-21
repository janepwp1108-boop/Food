import {
  shuffleArray
} from "./helpers";







// สุ่มเมนู 1 รายการ

export function getRandomRecipe(

  recipes = []

){


  if(

    !Array.isArray(recipes)

    ||

    recipes.length === 0

  ){

    return null;

  }






  const randomIndex =

    Math.floor(

      Math.random()

      *

      recipes.length

    );






  return recipes[randomIndex];



}











// สุ่มหลายรายการ

export function getRandomRecipes(

  recipes = [],

  count = 5

){



  if(

    !Array.isArray(recipes)

    ||

    recipes.length === 0

  ){

    return [];

  }







  const shuffled =

    shuffleArray(

      recipes

    );







  return shuffled.slice(

    0,

    count

  );



}











// สุ่มโดยไม่เอารายการปัจจุบัน

export function getRandomExcept(

  recipes = [],

  currentId

){



  const filtered =

    recipes.filter(

      item =>

      item.idMeal !== currentId

    );






  return getRandomRecipe(

    filtered

  );



}











// สร้าง Featured List

export function createFeaturedRecipes(

  recipes = []

){



  return getRandomRecipes(

    recipes,

    5

  );



}