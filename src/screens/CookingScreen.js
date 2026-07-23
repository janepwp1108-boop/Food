import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import COLORS from "../constants/colors";
import { getRandomMeals } from "../services/mealApi";
import LanguageToggle from "../components/LanguageToggle";
import CachedImage from "../components/CachedImage";
import { useLanguage } from "../context/LanguageContext";
import { translateText } from "../services/translateCache";

const RECOMMEND_COUNT = 8;

export default function CookingScreen({ navigation }) {
  const { language } = useLanguage();

  const [recommended, setRecommended] = useState([]);
  const [mealNames, setMealNames] = useState({});
  const [mealCategories, setMealCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [texts, setTexts] = useState({
    title: "Cooking Mode",
    subtitle: "Here's what you could cook today.",
    shuffle: "🔀 Shuffle",
  });

  // สุ่มเมนูแนะนำใหม่ ทุกครั้งที่เปิดเข้ามาที่หน้านี้
  const loadRecommended = useCallback(async () => {
    setLoading(true);
    try {
      const meals = await getRandomMeals(RECOMMEND_COUNT);
      setRecommended(meals);
    } catch (error) {
      console.log("Load random recommendations error:", error.message || error);
      setRecommended([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRecommended();
    }, [loadRecommended])
  );

  // แปลชื่อเมนู/หมวดหมู่ของแต่ละสูตรอาหาร
  React.useEffect(() => {
    const translateMeals = async () => {
      if (language === "en") {
        const names = {};
        const cats = {};
        recommended.forEach((m) => {
          names[m.idMeal] = m.strMeal;
          cats[m.idMeal] = m.strCategory;
        });
        setMealNames(names);
        setMealCategories(cats);
        return;
      }

      const names = {};
      const cats = {};
      for (const meal of recommended) {
        names[meal.idMeal] = await translateText(meal.strMeal, "th");
        cats[meal.idMeal] = await translateText(meal.strCategory, "th");
      }
      setMealNames(names);
      setMealCategories(cats);
    };
    translateMeals();
  }, [language, recommended]);

  // แปลข้อความคงที่ของหน้านี้
  React.useEffect(() => {
    const translateStaticTexts = async () => {
      if (language === "en") {
        setTexts({
          title: "Cooking Mode",
          subtitle: "Here's what you could cook today.",
          shuffle: "🔀 Shuffle",
        });
        return;
      }

      const [title, subtitle, shuffle] = await Promise.all([
        translateText("Cooking Mode", "th"),
        translateText("Here's what you could cook today.", "th"),
        translateText("Shuffle", "th"),
      ]);

      setTexts({ title, subtitle, shuffle: `🔀 ${shuffle}` });
    };
    translateStaticTexts();
  }, [language]);

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

  return (
    <View style={styles.listContainer}>
      <HeaderBar />

      <Text style={styles.headerIcon}>👨‍🍳</Text>

      <Text style={styles.headerTitle}>{texts.title}</Text>

      <Text style={styles.headerSubtitle}>{texts.subtitle}</Text>

      <TouchableOpacity
        style={styles.shuffleButton}
        onPress={loadRecommended}
        disabled={loading}
      >
        <Text style={styles.shuffleButtonText}>{texts.shuffle}</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 30 }}
        />
      ) : (
        <FlatList
          data={recommended}
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

              <Text style={styles.arrow}>▶️</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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

  listContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  headerIcon: {
    fontSize: 40,
    textAlign: "center",
    marginTop: 100,
  },

  headerTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },

  headerSubtitle: {
    color: COLORS.subText,
    textAlign: "center",
    marginTop: 5,
  },

  shuffleButton: {
    alignSelf: "center",
    marginTop: 15,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  shuffleButtonText: {
    color: COLORS.white,
    fontWeight: "600",
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

  arrow: {
    fontSize: 16,
  },
});