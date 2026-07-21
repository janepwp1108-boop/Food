import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import COLORS from "../constants/colors";

export default function SectionTitle({
  title,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({

  container:{
    marginTop:25,
    marginBottom:15
  },

  title:{
    color:COLORS.white,
    fontSize:22,
    fontWeight:"bold"
  }

});