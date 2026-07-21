import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useLanguage } from "../context/LanguageContext";
import COLORS from "../constants/colors";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <TouchableOpacity style={styles.button} onPress={toggleLanguage}>
      <Text style={styles.text}>
        {language === "en" ? "🇹🇭 ไทย" : "🇬🇧 EN"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  text: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
  },
});