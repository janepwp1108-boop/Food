export const CATEGORIES = [


  {
    id: "all",

    name: "All",

    icon: "🍽️"

  },


  {
    id: "beef",

    name: "Beef",

    icon: "🥩"

  },


  {
    id: "chicken",

    name: "Chicken",

    icon: "🍗"

  },


  {
    id: "dessert",

    name: "Dessert",

    icon: "🍰"

  },


  {
    id: "lamb",

    name: "Lamb",

    icon: "🍖"

  },


  {
    id: "miscellaneous",

    name: "Misc",

    icon: "🍱"

  },


  {
    id: "pasta",

    name: "Pasta",

    icon: "🍝"

  },


  {
    id: "pork",

    name: "Pork",

    icon: "🥓"

  },


  {
    id: "seafood",

    name: "Seafood",

    icon: "🦐"

  },


  {
    id: "side",

    name: "Side",

    icon: "🥗"

  },


  {
    id: "starter",

    name: "Starter",

    icon: "🥣"

  },


  {
    id: "vegan",

    name: "Vegan",

    icon: "🌱"

  },


  {
    id: "vegetarian",

    name: "Vegetarian",

    icon: "🥦"

  },


  {
    id: "breakfast",

    name: "Breakfast",

    icon: "🍳"

  },


  {
    id: "goat",

    name: "Goat",

    icon: "🐐"

  }


];









// หา Category จากชื่อ API

export function getCategoryName(id){


  const category =

    CATEGORIES.find(

      item =>

      item.id === id.toLowerCase()

    );



  return category

    ? category.name

    : id;



}









// หา Icon Category

export function getCategoryIcon(id){


  const category =

    CATEGORIES.find(

      item =>

      item.id === id.toLowerCase()

    );



  return category

    ? category.icon

    : "🍽️";


}