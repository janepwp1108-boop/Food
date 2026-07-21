import AsyncStorage from
"@react-native-async-storage/async-storage";



const HISTORY_KEY = "recipe_history";


// จำนวนรายการสูงสุดที่เก็บ

const MAX_HISTORY = 20;







// ดึง History ทั้งหมด

export async function getHistory(){


  try{


    const data =
      await AsyncStorage.getItem(
        HISTORY_KEY
      );



    return data

      ? JSON.parse(data)

      : [];



  }catch(error){


    console.log(
      "Get History Error:",
      error
    );



    return [];


  }


}








// เพิ่มเมนูที่เปิดดู

export async function addHistory(recipe){


  try{


    let history =
      await getHistory();





    // ลบตัวเก่าก่อน
    // เพื่อไม่ให้ซ้ำ

    history =
      history.filter(

        item =>
        item.idMeal !== recipe.idMeal

      );





    // เพิ่มรายการใหม่ไว้บนสุด

    history.unshift(recipe);






    // จำกัดจำนวนข้อมูล

    if(history.length > MAX_HISTORY){


      history =
        history.slice(
          0,
          MAX_HISTORY
        );


    }







    await AsyncStorage.setItem(

      HISTORY_KEY,

      JSON.stringify(history)

    );




    return history;



  }catch(error){



    console.log(

      "Add History Error:",

      error

    );



    return [];

  }


}








// ลบ History ทั้งหมด

export async function clearHistory(){


  try{


    await AsyncStorage.removeItem(

      HISTORY_KEY

    );



    return [];



  }catch(error){



    console.log(

      "Clear History Error:",

      error

    );


  }


}







// ลบ History รายการเดียว

export async function removeHistory(idMeal){


  try{


    const history =
      await getHistory();




    const updated =
      history.filter(

        item =>

        item.idMeal !== idMeal

      );




    await AsyncStorage.setItem(

      HISTORY_KEY,

      JSON.stringify(updated)

    );




    return updated;



  }catch(error){


    console.log(

      "Remove History Error:",

      error

    );



    return [];

  }


}