import React, {
  useEffect,
  useState
} from "react";

import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated
} from "react-native";


import COLORS from "../constants/colors";



export default function FavoriteButton({

  recipe,

  initialFavorite = false,

  onChange

}) {



  const [isFavorite,setIsFavorite] = useState(
    initialFavorite
  );



  const scaleAnim = new Animated.Value(1);






  useEffect(()=>{


    setIsFavorite(initialFavorite);


  },[initialFavorite]);








  const animateHeart = ()=>{


    Animated.sequence([


      Animated.timing(
        scaleAnim,
        {

          toValue:1.3,

          duration:100,

          useNativeDriver:true

        }
      ),



      Animated.timing(
        scaleAnim,
        {

          toValue:1,

          duration:100,

          useNativeDriver:true

        }
      )



    ]).start();



  };









  const toggleFavorite = ()=>{


    const newValue =
      !isFavorite;



    setIsFavorite(newValue);



    animateHeart();




    if(onChange){


      onChange(

        recipe,

        newValue

      );


    }



  };







  return (


    <Animated.View

      style={{

        transform:[
          {
            scale:scaleAnim
          }
        ]

      }}

    >



      <TouchableOpacity


        activeOpacity={0.7}


        style={[

          styles.button,


          isFavorite &&

          styles.activeButton


        ]}



        onPress={toggleFavorite}


      >



        <Text style={styles.icon}>


          {
            isFavorite

            ? "❤️"

            : "🤍"

          }


        </Text>



      </TouchableOpacity>



    </Animated.View>


  );


}









const styles = StyleSheet.create({




  button:{


    width:42,


    height:42,


    borderRadius:22,


    backgroundColor:
      "rgba(255,255,255,0.9)",


    justifyContent:"center",


    alignItems:"center",


    elevation:3


  },







  activeButton:{


    backgroundColor:"#ffe5e5"


  },







  icon:{


    fontSize:22


  }




});