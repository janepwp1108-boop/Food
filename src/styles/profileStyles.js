import { StyleSheet } from "react-native";


import { COLORS } from "../constants/colors";





export const profileStyles = StyleSheet.create({




  container:{


    flex:1,


    backgroundColor:COLORS.background



  },







  scrollContent:{


    paddingHorizontal:20,


    paddingBottom:40



  },







  header:{


    alignItems:"center",


    marginTop:30,


    marginBottom:25



  },







  avatar:{


    width:120,


    height:120,


    borderRadius:60,


    backgroundColor:"#eee",


    justifyContent:"center",


    alignItems:"center",


    marginBottom:15



  },







  avatarImage:{


    width:"100%",


    height:"100%",


    borderRadius:60



  },







  avatarText:{


    fontSize:45



  },







  username:{


    fontSize:24,


    fontWeight:"900",


    color:COLORS.text



  },







  email:{


    marginTop:5,


    fontSize:14,


    color:"#777"



  },







  section:{


    marginTop:20



  },







  sectionTitle:{


    fontSize:20,


    fontWeight:"800",


    color:COLORS.text,


    marginBottom:12



  },







  card:{


    backgroundColor:"#fff",


    borderRadius:20,


    padding:16,


    marginBottom:12,


    elevation:3



  },







  row:{


    flexDirection:"row",


    alignItems:"center",


    justifyContent:"space-between"



  },







  rowLeft:{


    flexDirection:"row",


    alignItems:"center"



  },







  icon:{


    fontSize:24,


    marginRight:12



  },







  label:{


    fontSize:16,


    fontWeight:"600",


    color:COLORS.text



  },







  value:{


    fontSize:14,


    color:"#777"



  },







  logoutButton:{


    marginTop:30,


    backgroundColor:"#ff4d4d",


    paddingVertical:15,


    borderRadius:30,


    alignItems:"center"



  },







  logoutText:{


    color:"#fff",


    fontSize:16,


    fontWeight:"800"



  }





});