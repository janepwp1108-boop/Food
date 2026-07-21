import { StyleSheet } from "react-native";


import { COLORS } from "../constants/colors";



export const globalStyles = StyleSheet.create({




  container:{


    flex:1,


    backgroundColor:COLORS.background


  },







  screenPadding:{


    paddingHorizontal:20,


    paddingTop:15



  },







  center:{


    flex:1,


    justifyContent:"center",


    alignItems:"center"



  },







  title:{


    fontSize:24,


    fontWeight:"800",


    color:COLORS.text



  },







  subtitle:{


    fontSize:15,


    color:"#777"



  },







  section:{


    marginTop:20,


    marginBottom:15



  },







  card:{


    backgroundColor:"#fff",


    borderRadius:20,


    elevation:3



  },







  button:{


    backgroundColor:COLORS.primary,


    paddingVertical:12,


    paddingHorizontal:25,


    borderRadius:25,


    alignItems:"center"



  },







  buttonText:{


    color:"#fff",


    fontWeight:"700",


    fontSize:15



  },







  row:{


    flexDirection:"row",


    alignItems:"center"



  }






});