import React from "react";

import {
  View,
  Text,
  StyleSheet
} from "react-native";


import { COLORS } from "../constants/colors";



export default function IngredientItem({

  name,

  measure,

  index

}) {


  if(!name) {

    return null;

  }



  return (

    <View style={styles.container}>


      {/* Number */}

      <View style={styles.numberBox}>


        <Text style={styles.numberText}>

          {index + 1}

        </Text>


      </View>





      {/* Ingredient */}

      <View style={styles.content}>


        <Text

          style={styles.name}

          numberOfLines={1}

        >

          {name}


        </Text>





        {
          measure && (

            <Text style={styles.measure}>

              {measure}

            </Text>

          )
        }



      </View>



    </View>


  );

}







const styles = StyleSheet.create({



  container:{


    flexDirection:"row",


    alignItems:"center",


    backgroundColor:"#fff",


    padding:14,


    borderRadius:16,


    marginBottom:10,


    elevation:2,


    shadowColor:"#000",


    shadowOpacity:0.08,


    shadowOffset:{


      width:0,


      height:2


    },


    shadowRadius:4



  },







  numberBox:{


    width:36,


    height:36,


    borderRadius:18,


    backgroundColor:COLORS.primary,


    justifyContent:"center",


    alignItems:"center",


    marginRight:12



  },







  numberText:{


    color:"#fff",


    fontWeight:"800",


    fontSize:15



  },







  content:{


    flex:1



  },







  name:{


    fontSize:16,


    fontWeight:"700",


    color:COLORS.text



  },







  measure:{


    marginTop:4,


    fontSize:14,


    color:"#777"



  }





});