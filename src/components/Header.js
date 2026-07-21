import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import COLORS from "../constants/colors";

export default function Header() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>
          👋 Welcome Back
        </Text>

        <Text style={styles.title}>
          Gourmet Recipe Hub
        </Text>
      </View>

      <View style={styles.avatar}>
        <Ionicons
          name="person"
          size={28}
          color={COLORS.white}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    marginTop:50,
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:20
  },

  greeting:{
    color:COLORS.subText,
    fontSize:16
  },

  title:{
    color:COLORS.white,
    fontSize:26,
    fontWeight:"bold",
    marginTop:5
  },

  avatar:{
    width:55,
    height:55,
    borderRadius:30,
    backgroundColor:COLORS.primary,
    justifyContent:"center",
    alignItems:"center"
  }
});