import React from "react";

import {
  View,
  Text,
  StyleSheet
} from "react-native";


import { COLORS } from "../constants/colors";



export default function StepCard({

  stepNumber,

  description,

  completed = false

}) {



  if(!description){

    return null;

  }




  return (


    <View

      style={[

        styles.container,


        completed && styles.completed

      ]}


    >



      {/* Step Number */}


      <View

        style={[

          styles.numberBox,


          completed && styles.completedNumber

        ]}


      >



        <Text style={styles.numberText}>


          {
            completed

            ? "✓"

            : stepNumber

          }


        </Text>


      </View>







      {/* Detail */}


      <View style={styles.content}>


        <Text

          style={[

            styles.title,


            completed && styles.completedText

          ]}


        >


          Step {stepNumber}


        </Text>





        <Text

          style={[

            styles.description,


            completed && styles.completedText

          ]}


        >


          {description}


        </Text>



      </View>



    </View>


  );


}







const styles = StyleSheet.create({



  container:{


    flexDirection:"row",


    backgroundColor:"#fff",


    padding:16,


    borderRadius:18,


    marginBottom:14,


    elevation:3,


    shadowColor:"#000",


    shadowOpacity:0.08,


    shadowOffset:{


      width:0,


      height:2


    },


    shadowRadius:4



  },







  completed:{


    opacity:0.65,


    backgroundColor:"#f1f8f3"


  },







  numberBox:{


    width:42,


    height:42,


    borderRadius:21,


    backgroundColor:COLORS.primary,


    justifyContent:"center",


    alignItems:"center",


    marginRight:14



  },







  completedNumber:{


    backgroundColor:"#2ecc71"


  },







  numberText:{


    color:"#fff",


    fontSize:17,


    fontWeight:"800"



  },







  content:{


    flex:1



  },







  title:{


    fontSize:15,


    fontWeight:"800",


    color:COLORS.primary,


    marginBottom:6



  },







  description:{


    fontSize:15,


    color:COLORS.text,


    lineHeight:22



  },







  completedText:{


    textDecorationLine:"line-through"


  }





});