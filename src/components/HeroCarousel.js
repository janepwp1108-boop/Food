import React, {
  useEffect,
  useRef,
  useState
} from "react";

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { COLORS } from "../constants/colors";


const { width } = Dimensions.get("window");



export default function HeroCarousel({
  recipes = [],
  navigation
}) {


  const sliderRef = useRef(null);

  const [activeIndex,setActiveIndex] = useState(0);



  // Auto Slide
  useEffect(()=>{


    if(recipes.length <= 1)
      return;



    const timer = setInterval(()=>{


      let nextIndex =
        activeIndex + 1;


      if(nextIndex >= recipes.length){
        nextIndex = 0;
      }



      sliderRef.current?.scrollToIndex({

        index:nextIndex,

        animated:true

      });



      setActiveIndex(nextIndex);



    },4000);



    return ()=>clearInterval(timer);



  },[
    activeIndex,
    recipes
  ]);






  // เปลี่ยน Dot ตอนเลื่อน

  const onScrollEnd = (event)=>{


    const index =
      Math.round(
        event.nativeEvent.contentOffset.x /
        width
      );


    setActiveIndex(index);


  };






  // Card Item

  const renderItem = ({item})=>{


    return (

      <TouchableOpacity

        activeOpacity={0.9}

        style={styles.slide}

        onPress={()=>{

          navigation.navigate(
            "Detail",
            {
              mealId:item.idMeal
            }
          );

        }}

      >



        <Image

          source={{
            uri:item.strMealThumb
          }}

          style={styles.image}

        />




        <LinearGradient

          colors={[
            "transparent",
            "rgba(0,0,0,0.85)"
          ]}

          style={styles.gradient}

        />





        <View style={styles.info}>


          <Text

            style={styles.title}

            numberOfLines={2}

          >

            {item.strMeal}

          </Text>




          <View style={styles.badge}>


            <Text style={styles.badgeText}>

              {item.strCategory || "Food"}

            </Text>


          </View>



        </View>



      </TouchableOpacity>

    );


  };







  // ไม่มีข้อมูล

  if(!recipes || recipes.length===0){

    return null;

  }






  return (

    <View style={styles.container}>


      <FlatList


        ref={sliderRef}


        data={recipes}



        renderItem={renderItem}



        keyExtractor={(item)=>
          item.idMeal.toString()
        }



        horizontal



        pagingEnabled



        showsHorizontalScrollIndicator={false}



        onMomentumScrollEnd={
          onScrollEnd
        }



        getItemLayout={
          (_,index)=>({

            length:width,

            offset:width * index,

            index

          })
        }



      />






      {/* Pagination */}

      <View style={styles.pagination}>


        {
          recipes.map((item,index)=>(


            <View

              key={index}

              style={[

                styles.dot,


                activeIndex===index
                &&
                styles.activeDot


              ]}


            />

          ))
        }


      </View>




    </View>

  );


}







const styles = StyleSheet.create({



  container:{


    width:"100%",


    height:240,


    marginTop:15,


  },





  slide:{


    width:width,


    height:220,


    position:"relative",


  },





  image:{


    width:"100%",


    height:"100%",


    resizeMode:"cover"


  },





  gradient:{


    position:"absolute",


    left:0,


    right:0,


    bottom:0,


    height:"65%"


  },





  info:{


    position:"absolute",


    left:20,


    right:20,


    bottom:25


  },





  title:{


    color:"#fff",


    fontSize:24,


    fontWeight:"800"


  },





  badge:{


    backgroundColor:
      "rgba(255,255,255,0.25)",


    alignSelf:"flex-start",


    paddingHorizontal:12,


    paddingVertical:5,


    borderRadius:20,


    marginTop:10


  },





  badgeText:{


    color:"#fff",


    fontSize:13,


    fontWeight:"600"


  },





  pagination:{


    position:"absolute",


    bottom:5,


    width:"100%",


    flexDirection:"row",


    justifyContent:"center"


  },





  dot:{


    width:8,


    height:8,


    borderRadius:10,


    backgroundColor:"#ddd",


    marginHorizontal:4


  },





  activeDot:{


    width:25,


    backgroundColor:COLORS.primary


  }



});