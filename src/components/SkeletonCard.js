import React, {
  useEffect,
  useRef
} from "react";


import {
  View,
  Animated,
  StyleSheet
} from "react-native";



export default function SkeletonCard(){




  const opacity = useRef(

    new Animated.Value(0.3)

  ).current;






  useEffect(()=>{


    Animated.loop(


      Animated.sequence([


        Animated.timing(

          opacity,

          {

            toValue:0.8,

            duration:800,

            useNativeDriver:true

          }

        ),



        Animated.timing(

          opacity,

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



    <Animated.View


      style={[

        styles.card,


        {

          opacity

        }

      ]}


    >




      {/* Image Skeleton */}


      <View style={styles.image}/>





      {/* Text Skeleton */}


      <View style={styles.content}>


        <View style={styles.title}/>


        <View style={styles.subtitle}/>


        <View style={styles.small}/>



      </View>



    </Animated.View>


  );


}









const styles = StyleSheet.create({




  card:{


    backgroundColor:"#fff",


    borderRadius:20,


    overflow:"hidden",


    marginBottom:18,


    elevation:3


  },







  image:{


    width:"100%",


    height:180,


    backgroundColor:"#e5e5e5"



  },







  content:{


    padding:15



  },







  title:{


    width:"75%",


    height:18,


    borderRadius:10,


    backgroundColor:"#ddd",


    marginBottom:12



  },







  subtitle:{


    width:"50%",


    height:14,


    borderRadius:8,


    backgroundColor:"#ddd",


    marginBottom:10



  },







  small:{


    width:"35%",


    height:12,


    borderRadius:8,


    backgroundColor:"#ddd"



  }





});