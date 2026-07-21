import React, {
  useEffect,
  useRef
} from "react";


import {
  View,
  Text,
  Animated,
  StyleSheet
} from "react-native";


import { COLORS } from "../constants/colors";





export default function ProgressBar({

  progress = 0,

  label = "Cooking Progress"

}) {



  const animatedWidth = useRef(
    new Animated.Value(0)
  ).current;





  useEffect(()=>{


    Animated.timing(

      animatedWidth,

      {

        toValue:progress,

        duration:500,

        useNativeDriver:false

      }

    ).start();



  },[progress]);







  const widthInterpolation =
    animatedWidth.interpolate({

      inputRange:[
        0,
        100
      ],

      outputRange:[
        "0%",
        "100%"
      ]

    });







  return (

    <View style={styles.container}>



      <View style={styles.header}>


        <Text style={styles.label}>

          {label}

        </Text>



        <Text style={styles.percent}>

          {Math.round(progress)}%

        </Text>



      </View>





      <View style={styles.background}>


        <Animated.View

          style={[

            styles.progress,


            {

              width:
              widthInterpolation

            }

          ]}


        />


      </View>



    </View>

  );


}







const styles = StyleSheet.create({



  container:{


    width:"100%",


    marginVertical:15



  },







  header:{


    flexDirection:"row",


    justifyContent:"space-between",


    marginBottom:8



  },







  label:{


    fontSize:15,


    fontWeight:"700",


    color:COLORS.text



  },







  percent:{


    fontSize:15,


    fontWeight:"800",


    color:COLORS.primary



  },







  background:{


    width:"100%",


    height:12,


    backgroundColor:"#e8e8e8",


    borderRadius:10,


    overflow:"hidden"



  },







  progress:{


    height:"100%",


    backgroundColor:COLORS.primary,


    borderRadius:10



  }





});