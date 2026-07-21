import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

import COLORS from "../constants/colors";

export default function CategoryChip({
  title,
  icon,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.icon}>
        {icon}
      </Text>

      <Text style={styles.title}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

  container:{
    backgroundColor:COLORS.card,
    borderRadius:18,
    paddingVertical:14,
    paddingHorizontal:18,
    marginRight:12,
    alignItems:"center",
    justifyContent:"center",
    minWidth:90
  },

  icon:{
    fontSize:28
  },

  title:{
    color:COLORS.white,
    marginTop:8,
    fontWeight:"600",
    fontSize:14
  }

});