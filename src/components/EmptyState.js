import React from "react";


import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from "react-native";



import { COLORS } from "../constants/colors";





export default function EmptyState({

  icon = "🍽️",

  title = "No Data Found",

  description = "There is nothing here yet.",

  buttonText,

  onPress

}) {



  return (



    <View style={styles.container}>



      {/* Icon */}


      <View style={styles.iconBox}>


        <Text style={styles.icon}>


          {icon}


        </Text>


      </View>






      {/* Title */}


      <Text style={styles.title}>


        {title}


      </Text>







      {/* Description */}


      <Text style={styles.description}>


        {description}


      </Text>







      {
        buttonText && (


          <TouchableOpacity


            activeOpacity={0.8}


            style={styles.button}


            onPress={onPress}



          >



            <Text style={styles.buttonText}>


              {buttonText}


            </Text>



          </TouchableOpacity>


        )
      }



    </View>


  );

}









const styles = StyleSheet.create({




  container:{


    flex:1,


    justifyContent:"center",


    alignItems:"center",


    paddingHorizontal:30



  },







  iconBox:{


    width:100,


    height:100,


    borderRadius:50,


    backgroundColor:
      "rgba(255,122,0,0.15)",


    justifyContent:"center",


    alignItems:"center",


    marginBottom:20



  },







  icon:{


    fontSize:45



  },







  title:{


    fontSize:22,


    fontWeight:"800",


    color:COLORS.text,


    textAlign:"center"



  },







  description:{


    marginTop:10,


    fontSize:15,


    color:"#777",


    textAlign:"center",


    lineHeight:22



  },







  button:{


    marginTop:25,


    backgroundColor:COLORS.primary,


    paddingHorizontal:30,


    paddingVertical:12,


    borderRadius:25



  },







  buttonText:{


    color:"#fff",


    fontSize:15,


    fontWeight:"700"



  }





});