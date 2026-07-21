import {
  useEffect,
  useState
} from "react";


import {

  getFavorites,

  addFavorite,

  removeFavorite,

  isFavorite

} from "../storage/favoriteStorage";








export default function useFavorites(){



  const [favorites,setFavorites] =

    useState([]);




  const [loading,setLoading] =

    useState(true);









  // โหลด Favorite ตอนเปิดใช้งาน

  const loadFavorites = async()=>{


    try{


      setLoading(true);



      const data =

        await getFavorites();



      setFavorites(data);



    }catch(error){



      console.log(

        "Load Favorites Error:",

        error

      );



    }finally{


      setLoading(false);


    }


  };








  useEffect(()=>{


    loadFavorites();



  },[]);









  // เพิ่ม Favorite

  const add = async(recipe)=>{


    const updated =

      await addFavorite(recipe);



    setFavorites(updated);



    return updated;


  };









  // ลบ Favorite

  const remove = async(idMeal)=>{


    const updated =

      await removeFavorite(idMeal);



    setFavorites(updated);



    return updated;


  };









  // Toggle Favorite

  const toggle = async(recipe)=>{


    const favorite =

      await isFavorite(

        recipe.idMeal

      );





    if(favorite){



      return remove(

        recipe.idMeal

      );



    }else{



      return add(recipe);



    }


  };









  // เช็คสถานะ

  const checkFavorite = async(idMeal)=>{


    return await isFavorite(idMeal);


  };







  return {



    favorites,


    loading,


    add,


    remove,


    toggle,


    isFav:checkFavorite,


    refresh:loadFavorites



  };



}