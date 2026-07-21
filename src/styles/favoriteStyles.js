import { StyleSheet } from "react-native";


import { COLORS } from "../constants/colors";





export const favoriteStyles = StyleSheet.create({




  container:{


    flex:1,


    backgroundColor:COLORS.background



  },







  header:{


    paddingHorizontal:20,


    paddingTop:20,


    paddingBottom:10



  },







  title:{


    fontSize:28,


    fontWeight:"900",


    color:COLORS.text



  },







  subtitle:{


    marginTop:5,


    fontSize:15,


    color:"#777"



  },







  listContainer:{


    paddingHorizontal:20,


    paddingBottom:40



  },







  cardContainer:{


    marginBottom:15



  },







  emptyContainer:{


    flex:1,


    justifyContent:"center",


    alignItems:"center",


    paddingHorizontal:30



  },







  emptyIcon:{


    fontSize:60,


    marginBottom:15



  },







  emptyTitle:{


    fontSize:22,


    fontWeight:"800",


    color:COLORS.text,


    textAlign:"center"



  },







  emptyText:{


    marginTop:10,


    fontSize:15,


    color:"#777",


    textAlign:"center",


    lineHeight:22



  },







  clearButton:{


    marginTop:15,


    alignSelf:"flex-end",


    paddingHorizontal:15,


    paddingVertical:8,


    borderRadius:20,


    backgroundColor:"#ffe5e5"



  },







  clearButtonText:{


    color:"#e74c3c",


    fontWeight:"700"



  },







  loadingContainer:{


    flex:1,


    justifyContent:"center",


    alignItems:"center"



  }





}); 