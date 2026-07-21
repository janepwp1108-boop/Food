import {
  formatIngredient
} from "./formatIngredient";






export function getIngredients(

  meal

){


  if(!meal){

    return [];

  }





  const ingredients = [];





  for(
    let i = 1;
    i <= 20;
    i++
  ){



    const ingredient =

      meal[
        `strIngredient${i}`
      ];



    const measure =

      meal[
        `strMeasure${i}`
      ];






    if(

      ingredient &&

      ingredient.trim() !== ""

    ){



      ingredients.push(

        formatIngredient(

          ingredient,

          measure

        )

      );



    }


  }






  return ingredients;



}











// นับจำนวนวัตถุดิบ

export function countIngredients(

  meal

){


  return getIngredients(

    meal

  ).length;



}











// เช็คว่ามีวัตถุดิบหรือไม่

export function hasIngredients(

  meal

){


  return (

    getIngredients(meal)

      .length > 0

  );


}