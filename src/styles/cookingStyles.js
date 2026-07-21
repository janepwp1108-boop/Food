import { StyleSheet } from "react-native";


import { COLORS } from "../constants/colors";





export const cookingStyles = StyleSheet.create({




  container:{


    flex:1,


    backgroundColor:COLORS.background



  },







  scrollContent:{


    paddingHorizontal:20,


    paddingBottom:40



  },







  header:{


    marginTop:20,


    marginBottom:15



  },







  title:{


    fontSize:26,


    fontWeight:"900",


    color:COLORS.text



  },







  subtitle:{


    marginTop:6,


    fontSize:15,


    color:"#777"



  },







  imageContainer:{


    width:"100%",


    height:220,


    borderRadius:25,


    overflow:"hidden",


    marginBottom:20



  },







  image:{


    width:"100%",


    height:"100%",


    resizeMode:"cover"



  },







  progressContainer:{


    backgroundColor:"#fff",


    padding:15,


    borderRadius:20,


    marginBottom:20,


    elevation:3



  },







  stepContainer:{


    marginTop:10



  },







  stepTitle:{


    fontSize:22,


    fontWeight:"800",


    color:COLORS.text,


    marginBottom:15



  },







  timerCard:{


    backgroundColor:"#fff",


    borderRadius:20,


    padding:20,


    alignItems:"center",


    marginVertical:15,


    elevation:3



  },







  timerText:{


    fontSize:40,


    fontWeight:"900",


    color:COLORS.primary



  },







  timerLabel:{


    marginTop:5,


    fontSize:14,


    color:"#777"



  },







  button:{


    backgroundColor:COLORS.primary,


    paddingVertical:15,


    borderRadius:30,


    alignItems:"center",


    marginTop:20



  },







  buttonText:{


    color:"#fff",


    fontSize:16,


    fontWeight:"800"



  },







  completedButton:{


    backgroundColor:"#2ecc71"



  }





});