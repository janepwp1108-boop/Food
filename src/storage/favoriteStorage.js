import AsyncStorage from
"@react-native-async-storage/async-storage";



const FAVORITE_KEY = "favorite_recipes";




// ดึง Favorite ทั้งหมด

export async function getFavorites(){


  try{


    const data =
      await AsyncStorage.getItem(
        FAVORITE_KEY
      );



    return data
      ? JSON.parse(data)
      : [];



  }catch(error){


    console.log(
      "Get Favorites Error:",
      error
    );


    return [];

  }


}







// เพิ่ม Favorite

export async function addFavorite(recipe){


  try{


    const favorites =
      await getFavorites();



    const exists =
      favorites.some(

        item =>
        item.idMeal === recipe.idMeal

      );




    if(exists){

      return favorites;

    }





    const updated = [

      ...favorites,

      recipe

    ];





    await AsyncStorage.setItem(

      FAVORITE_KEY,

      JSON.stringify(updated)

    );




    return updated;



  }catch(error){


    console.log(
      "Add Favorite Error:",
      error
    );


  }


}








// ลบ Favorite

export async function removeFavorite(idMeal){


  try{


    const favorites =
      await getFavorites();




    const updated =
      favorites.filter(

        item =>
        item.idMeal !== idMeal

      );




    await AsyncStorage.setItem(

      FAVORITE_KEY,

      JSON.stringify(updated)

    );




    return updated;



  }catch(error){


    console.log(
      "Remove Favorite Error:",
      error
    );


  }


}








// เช็คว่าเป็น Favorite หรือไม่

export async function isFavorite(idMeal){


  const favorites =
    await getFavorites();



  return favorites.some(

    item =>
    item.idMeal === idMeal

  );


}