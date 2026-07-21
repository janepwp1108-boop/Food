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



import {
  ASSETS
}
from "../constants/assets";





export default function SplashScreen({

  navigation

}) {



  const scale = useRef(

    new Animated.Value(0)

  ).current;



  const opacity = useRef(

    new Animated.Value(0)

  ).current;








  useEffect(()=>{



    Animated.parallel([



      Animated.spring(

        scale,

        {

          toValue:1,

          friction:5,

          useNativeDriver:true

        }

      ),



      Animated.timing(

        opacity,

        {

          toValue:1,

          duration:1000,

          useNativeDriver:true

        }

      )



    ]).start();








    const timer = setTimeout(()=>{
        navigation.replace(
            "Main"
    );
    },2500);






    return ()=>{


      clearTimeout(timer);


    };



  },[]);








  return (



    <View style={styles.container}>



      <Animated.Image


        source={ASSETS.logo}


        style={[

          styles.logo,


          {

            transform:[

              {

                scale

              }

            ],


            opacity


          }

        ]}


      />






      <Text style={styles.title}>

        Recipe Finder

      </Text>





      <Text style={styles.subtitle}>

        Discover delicious recipes

      </Text>





      <View style={styles.loading}>


        <Animated.View

          style={styles.dot}

        />

      </View>



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







  logo:{


    width:150,


    height:150,


    resizeMode:"contain"



  },







  title:{


    marginTop:20,


    fontSize:28,


    fontWeight:"900",


    color:"#ff7a00"



  },







  subtitle:{


    marginTop:8,


    fontSize:15,


    color:"#777"



  },







  loading:{


    marginTop:35,


    width:50,


    height:5,


    borderRadius:10,


    backgroundColor:"#eee",


    overflow:"hidden"



  },







  dot:{


    width:25,


    height:5,


    backgroundColor:"#ff7a00",


    borderRadius:10



  }



});