import React, {
  useEffect,
  useRef
} from "react";


import {
  View,
  Text,
  ActivityIndicator,
  Animated,
  StyleSheet
} from "react-native";



import { COLORS } from "../constants/colors";





export default function LoadingView({

  text = "Loading..."

}) {



  const fadeAnim = useRef(
    new Animated.Value(0)
  ).current;





  useEffect(()=>{


    Animated.loop(


      Animated.sequence([


        Animated.timing(

          fadeAnim,

          {

            toValue:1,

            duration:800,

            useNativeDriver:true

          }

        ),



        Animated.timing(

          fadeAnim,

          {

            toValue:0.3,

            duration:800,

            useNativeDriver:true

          }

        )


      ])


    ).start();



  },[]);







  return (


    <View style={styles.container}>


      <Animated.View

        style={{

          opacity:fadeAnim

        }}


      >



        <ActivityIndicator


          size="large"


          color={COLORS.primary}


        />



      </Animated.View>






      <Text style={styles.text}>


        {text}


      </Text>



    </View>


  );

}








const styles = StyleSheet.create({



  container:{


    flex:1,


    justifyContent:"center",


    alignItems:"center",


    backgroundColor:"#fff"


  },







  text:{


    marginTop:15,


    fontSize:16,


    color:COLORS.text,


    fontWeight:"600"



  }





});