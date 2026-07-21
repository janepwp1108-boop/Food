import React from "react";

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet
} from "react-native";


import { LinearGradient } from "expo-linear-gradient";


import FavoriteButton from "./FavoriteButton";


import { COLORS } from "../constants/colors";




export default function RecipeCard({

  recipe,

  navigation,

  showFavorite = true,

  onFavoriteChange

}) {



  if(!recipe){

    return null;

  }



  const {

    idMeal,

    strMeal,

    strMealThumb,

    strCategory,

    strArea

  } = recipe;







  const openDetail = ()=>{


    navigation.navigate(

      "Detail",

      {

        mealId:idMeal

      }

    );


  };







  return (



    <TouchableOpacity


      activeOpacity={0.85}


      style={styles.card}


      onPress={openDetail}



    >



      {/* Image */}


      <View style={styles.imageContainer}>


        <Image

          source={{

            uri:strMealThumb

          }}

          style={styles.image}

        />



        <LinearGradient

          colors={[

            "transparent",

            "rgba(0,0,0,0.35)"

          ]}


          style={styles.imageOverlay}


        />



        {
          showFavorite && (

            <View style={styles.favorite}>


              <FavoriteButton

                recipe={recipe}

                onChange={
                  onFavoriteChange
                }

              />


            </View>

          )
        }



      </View>







      {/* Content */}



      <View style={styles.content}>


        <Text

          style={styles.title}

          numberOfLines={2}

        >

          {strMeal}


        </Text>





        <View style={styles.infoRow}>


          {
            strCategory && (


              <View style={styles.tag}>


                <Text style={styles.tagText}>


                  {strCategory}


                </Text>


              </View>


            )

          }





          {
            strArea && (


              <Text style={styles.area}>


                🌍 {strArea}


              </Text>


            )

          }



        </View>



      </View>



    </TouchableOpacity>


  );

}









const styles = StyleSheet.create({




  card:{


    backgroundColor:"#fff",


    borderRadius:20,


    overflow:"hidden",


    marginBottom:18,


    elevation:5,


    shadowColor:"#000",


    shadowOffset:{


      width:0,


      height:3

    },


    shadowOpacity:0.15,


    shadowRadius:5



  },






  imageContainer:{


    height:190,


    position:"relative"


  },







  image:{


    width:"100%",


    height:"100%",


    resizeMode:"cover"


  },







  imageOverlay:{


    position:"absolute",


    left:0,


    right:0,


    bottom:0,


    height:"40%"


  },







  favorite:{


    position:"absolute",


    right:12,


    top:12


  },







  content:{


    padding:15


  },







  title:{


    fontSize:18,


    fontWeight:"800",


    color:COLORS.text,


    marginBottom:10


  },







  infoRow:{


    flexDirection:"row",


    alignItems:"center",


    justifyContent:"space-between"


  },







  tag:{


    backgroundColor:COLORS.primary,


    paddingHorizontal:12,


    paddingVertical:5,


    borderRadius:20


  },







  tagText:{


    color:"#fff",


    fontSize:12,


    fontWeight:"700"


  },







  area:{


    color:"#777",


    fontSize:13


  }




});