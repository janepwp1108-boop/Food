import { StyleSheet } from "react-native";


import { COLORS } from "../constants/colors";




export const homeStyles = StyleSheet.create({



  container:{


    flex:1,


    backgroundColor:COLORS.background



  },







  scrollContent:{


    paddingBottom:30



  },







  header:{


    paddingHorizontal:20,


    paddingTop:15



  },







  searchContainer:{


    marginTop:15,


    paddingHorizontal:20



  },







  heroContainer:{


    marginTop:15



  },







  section:{


    marginTop:25,


    paddingHorizontal:20



  },







  sectionTitle:{


    fontSize:22,


    fontWeight:"800",


    color:COLORS.text,


    marginBottom:15



  },







  categoryContainer:{


    paddingLeft:20,


    marginBottom:20



  },







  categoryList:{


    flexDirection:"row"



  },







  recipeContainer:{


    paddingHorizontal:20



  },







  recipeGrid:{


    flexDirection:"column"



  },







  emptyContainer:{


    flex:1,


    justifyContent:"center",


    alignItems:"center"



  },







  loadingContainer:{


    flex:1,


    justifyContent:"center",


    alignItems:"center"



  }






});