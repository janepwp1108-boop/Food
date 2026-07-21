import {
  useEffect,
  useState
} from "react";


import {
  searchMealsByName
} from "../services/mealApi";







export default function useSearch(){




  const [query,setQuery] =

    useState("");





  const [results,setResults] =

    useState([]);





  const [loading,setLoading] =

    useState(false);





  const [error,setError] =

    useState(null);









  const search = async(keyword)=>{


    try{


      setLoading(true);


      setError(null);





      if(!keyword || keyword.trim()===""){



        setResults([]);


        return;


      }







      const data =

        await searchMealsByName(

          keyword

        );





      setResults(

        data || []

      );





    }catch(err){



      console.log(

        "Search Error:",

        err

      );




      setError(

        "Cannot search recipes"

      );



    }finally{


      setLoading(false);


    }


  };









  // Debounce Search

  useEffect(()=>{


    const timer =

      setTimeout(()=>{


        search(query);



      },500);





    return ()=>{


      clearTimeout(timer);


    };



  },[query]);









  const clearSearch = ()=>{


    setQuery("");

    setResults([]);

    setError(null);


  };







  return {



    query,


    setQuery,


    results,


    loading,


    error,


    search,


    clearSearch



  };



}