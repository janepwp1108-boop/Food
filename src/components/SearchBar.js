import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import COLORS from "../constants/colors";

export default function SearchBar({
  value,
  onChangeText,
  onSubmitEditing,
}) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search"
        size={22}
        color={COLORS.subText}
      />

      <TextInput
        style={styles.input}
        placeholder="Search ingredients..."
        placeholderTextColor={COLORS.subText}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flexDirection:"row",
    alignItems:"center",
    backgroundColor:COLORS.card,
    borderRadius:18,
    paddingHorizontal:15,
    height:58,
    marginVertical:20
  },

  input:{
    flex:1,
    color:COLORS.white,
    marginLeft:10,
    fontSize:16
  }
});