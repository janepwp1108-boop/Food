import { StyleSheet } from "react-native";


import { COLORS } from "../constants/colors";




export const detailStyles = StyleSheet.create({



  container:{


    flex:1,


    backgroundColor:COLORS.background



  },







  scrollContent:{


    paddingBottom:40



  },







  imageContainer:{


    width:"100%",


    height:320,


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


    height:"45%"



  },







  backButton:{


    position:"absolute",


    top:50,


    left:20,


    width:42,


    height:42,


    borderRadius:21,


    backgroundColor:
    "rgba(255,255,255,0.85)",


    justifyContent:"center",


    alignItems:"center"



  },







  favoriteButton:{


    position:"absolute",


    top:50,


    right:20



  },







  content:{


    padding:20



  },







  title:{


    fontSize:28,


    fontWeight:"900",


    color:COLORS.text,


    marginBottom:10



  },







  infoRow:{


    flexDirection:"row",


    alignItems:"center",


    marginBottom:20



  },







  badge:{


    backgroundColor:COLORS.primary,


    paddingHorizontal:14,


    paddingVertical:6,


    borderRadius:20,


    marginRight:10



  },







  badgeText:{


    color:"#fff",


    fontWeight:"700",


    fontSize:13



  },







  area:{


    fontSize:14,


    color:"#777"



  },







  section:{


    marginTop:20



  },







  sectionTitle:{


    fontSize:22,


    fontWeight:"800",


    color:COLORS.text,


    marginBottom:15



  },







  description:{


    fontSize:15,


    color:"#555",


    lineHeight:24



  },







  statsContainer:{


    marginTop:15



  },







  ingredientContainer:{


    marginTop:10



  },







  cookingButton:{


    marginTop:25,


    backgroundColor:COLORS.primary,


    paddingVertical:15,


    borderRadius:30,


    alignItems:"center"



  },







  cookingButtonText:{


    color:"#fff",


    fontSize:16,


    fontWeight:"800"



  }





});