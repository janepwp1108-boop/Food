import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import COLORS from "../constants/colors";
import { getFavorites, removeFavorite } from "../storage/favoriteStorage";
import FavoriteButton from "../components/FavoriteButton";
import CachedImage from "../components/CachedImage";
import LanguageToggle from "../components/LanguageToggle";
import { useLanguage } from "../context/LanguageContext";
import { translateText } from "../services/translateCache";

export default function FavoriteScreen({ navigation }) {
  const { language } = useLanguage();

  const [favorites, setFavorites] = useState([]);
  const [mealNames, setMealNames] = useState({});
  const [mealCategories, setMealCategories] = useState({});
  const [texts, setTexts] = useState({
    title: "Favorite Recipes",
    subtitle: "Your saved recipes will appear here.",
  });

  // โหลดข้อมูลใหม่ทุกครั้งที่กลับมาที่หน้านี้ (เผื่อเพิ่ง unfavorite จากหน้า Detail)
  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        const data = await getFavorites();
        setFavorites(data);
      };
      loadFavorites();
    }, [])
  );

  // แปลชื่อเมนู/หมวดหมู่ของแต่ละสูตรอาหาร
  useEffect(() => {
    const translateMeals = async () => {
      if (language === "en") {
        const names = {};
        const cats = {};
        favorites.forEach((m) => {
          names[m.idMeal] = m.strMeal;
          cats[m.idMeal] = m.strCategory;
        });
        setMealNames(names);
        setMealCategories(cats);
        return;
      }

      const names = {};
      const cats = {};
      for (const meal of favorites) {
        names[meal.idMeal] = await translateText(meal.strMeal, "th");
        cats[meal.idMeal] = await translateText(meal.strCategory, "th");
      }
      setMealNames(names);
      setMealCategories(cats);
    };
    translateMeals();
  }, [language, favorites]);

  // แปลข้อความคงที่ของหน้านี้
  useEffect(() => {
    const translateStaticTexts = async () => {
      if (language === "en") {
        setTexts({
          title: "Favorite Recipes",
          subtitle: "Your saved recipes will appear here.",
        });
        return;
      }

      const [title, subtitle] = await Promise.all([
        translateText("Favorite Recipes", "th"),
        translateText("Your saved recipes will appear here.", "th"),
      ]);

      setTexts({ title, subtitle });
    };
    translateStaticTexts();
  }, [language]);

  const handleRemove = async (idMeal) => {
    await removeFavorite(idMeal);
    setFavorites((prev) => prev.filter((item) => item.idMeal !== idMeal));
  };

  const HeaderBar = () => (
    <View style={styles.headerRow}>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.homeButtonText}>🏠</Text>
      </TouchableOpacity>

      <LanguageToggle />
    </View>
  );

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <HeaderBar />

        <Text style={styles.icon}>❤️</Text>

        <Text style={styles.title}>{texts.title}</Text>

        <Text style={styles.subtitle}>{texts.subtitle}</Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      <HeaderBar />

      <Text style={styles.headerTitle}>❤️ {texts.title}</Text>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.idMeal}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("Detail", { id: item.idMeal })
            }
          >
            <CachedImage
              source={{ uri: item.strMealThumb }}
              style={styles.cardImage}
            />

            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {mealNames[item.idMeal] || item.strMeal}
              </Text>

              <Text style={styles.cardCategory}>
                {mealCategories[item.idMeal] || item.strCategory}
              </Text>
            </View>

            <FavoriteButton
              recipe={item}
              initialFavorite={true}
              onChange={(recipe, newValue) => {
                if (!newValue) {
                  handleRemove(item.idMeal);
                }
              }}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  headerRow: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
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

  icon: {
    fontSize: 70,
  },

  title: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 15,
  },

  subtitle: {
    color: COLORS.subText,
    marginTop: 10,
    textAlign: "center",
  },

  listContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  headerTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 100,
    marginLeft: 20,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 15,
  },

  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },

  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },

  cardTitle: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 16,
  },

  cardCategory: {
    color: COLORS.subText,
    fontSize: 13,
    marginTop: 4,
  },
});