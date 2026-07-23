import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import COLORS from "../constants/colors";
import { getFavorites } from "../storage/favoriteStorage";
import { getHistory } from "../storage/recipeHistoryStorage";
import LanguageToggle from "../components/LanguageToggle";
import { useLanguage } from "../context/LanguageContext";
import { translateText } from "../services/translateCache";

export default function ProfileScreen({ navigation }) {
  const { language } = useLanguage();

  const [favoriteCount, setFavoriteCount] = useState(0);
  const [recipeCount, setRecipeCount] = useState(0);
  const [texts, setTexts] = useState({
    name: "Gourmet Chef",
    favoritesLabel: "Favorites",
    recipesLabel: "Recipes",
  });

  useFocusEffect(
    useCallback(() => {
      const loadCount = async () => {
        const favorites = await getFavorites();
        setFavoriteCount(favorites.length);

        const history = await getHistory();
        setRecipeCount(history.length);
      };
      loadCount();
    }, [])
  );

  // แปลข้อความคงที่ของหน้านี้
  useEffect(() => {
    const translateStaticTexts = async () => {
      if (language === "en") {
        setTexts({
          name: "Gourmet Chef",
          favoritesLabel: "Favorites",
          recipesLabel: "Recipes",
        });
        return;
      }

      const [name, favoritesLabel, recipesLabel] = await Promise.all([
        translateText("Gourmet Chef", "th"),
        translateText("Favorites", "th"),
        translateText("Recipes", "th"),
      ]);

      setTexts({ name, favoritesLabel, recipesLabel });
    };
    translateStaticTexts();
  }, [language]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.homeButtonText}>🏠</Text>
        </TouchableOpacity>

        <LanguageToggle />
      </View>

      <View style={styles.avatar}>
        <Text style={styles.avatarText}>👩🏻‍🍳</Text>
      </View>

      <Text style={styles.name}>LittleChef</Text>

      <Text style={styles.email}>IT_2/2💻</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.number}>{favoriteCount}</Text>
          <Text style={styles.label}>{texts.favoritesLabel}</Text>
        </View>       
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: COLORS.background,
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: 20,
},

  headerRow: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  homeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
  },

  homeButtonText: {
    fontSize: 20,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 60,
  },

  name: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
  },

  email: {
    color: COLORS.subText,
    marginTop: 5,
  },

  statsContainer: {
  width: "100%",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginTop: 40,
},

statCard: {
  width: 140,
  backgroundColor: COLORS.card,
  padding: 20,
  borderRadius: 20,
  alignItems: "center",
},

  number: {
    color: COLORS.primary,
    fontSize: 30,
    fontWeight: "bold",
  },

  label: {
    color: COLORS.subText,
    marginTop: 8,
  },
});