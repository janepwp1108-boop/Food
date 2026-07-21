export function formatIngredient(

  ingredient,

  measure

){


  return {

    name:

      ingredient

      ?

      ingredient.trim()

      :

      "",



    measure:

      measure

      ?

      measure.trim()

      :

      ""

  };


}











// Format Ingredient หลายรายการ

export function formatIngredients(

  ingredients = []

){


  return ingredients

    .filter(

      item =>

      item.name

    )

    .map(

      item =>

      ({

        name:item.name,

        measure:item.measure

      })

    );


}











// ทำให้จำนวนอ่านง่าย

export function cleanMeasure(

  measure

){


  if(!measure){

    return "";

  }



  return measure

    .replace(

      /\s+/g,

      " "

    )

    .trim();



}









// รวมชื่อวัตถุดิบ

export function ingredientSummary(

  ingredients=[]

){


  return ingredients

    .map(

      item =>

      item.name

    )

    .join(

      ", "

    );


}