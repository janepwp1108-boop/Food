import React from "react";


import {
  View,
  Text,
  StyleSheet
} from "react-native";



import { COLORS } from "../constants/colors";





export default function StatsCard({

  icon,

  title,

  value

}) {



  if(!value){

    return null;

  }



  return (


    <View style={styles.container}>


      {/* Icon */}

      <View style={styles.iconBox}>


        <Text style={styles.icon}>


          {icon || "🍴"}


        </Text>


      </View>





      {/* Text */}

      <View style={styles.content}>


        <Text style={styles.title}>


          {title}


        </Text>





        <Text style={styles.value}>


          {value}


        </Text>



      </View>



    </View>


  );

}








const styles = StyleSheet.create({



  container:{


    flexDirection:"row",


    alignItems:"center",


    backgroundColor:"#fff",


    borderRadius:18,


    padding:14,


    marginBottom:12,


    elevation:3,


    shadowColor:"#000",


    shadowOpacity:0.08,


    shadowOffset:{


      width:0,


      height:2


    },


    shadowRadius:4



  },







  iconBox:{


    width:48,


    height:48,


    borderRadius:24,


    backgroundColor:
      "rgba(255,122,0,0.15)",


    justifyContent:"center",


    alignItems:"center",


    marginRight:14



  },







  icon:{


    fontSize:24



  },







  content:{


    flex:1



  },







  title:{


    fontSize:13,


    color:"#777",


    marginBottom:4



  },







  value:{


    fontSize:17,


    fontWeight:"800",


    color:COLORS.text



  }





});
