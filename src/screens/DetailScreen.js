import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import COLORS from "../constants/colors";
import { getMealDetail } from "../services/mealApi";
import FavoriteButton from "../components/FavoriteButton";
import LanguageToggle from "../components/LanguageToggle";
import { isFavorite, addFavorite, removeFavorite } from "../storage/favoriteStorage";
import { addToHistory } from "../storage/recipeHistoryStorage";
import { useLanguage } from "../context/LanguageContext";
import { translateText } from "../services/translateApi";

export default function DetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { language } = useLanguage();

  const [meal, setMeal] = useState(null);
  const [displayMeal, setDisplayMeal] = useState(null);
  const [displayIngredients, setDisplayIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [favorite, setFavorite] = useState(false);

  // โหลดข้อมูลเมนูจาก API
  useEffect(() => {
    const loadDetail = async () => {
      try {
        const data = await getMealDetail(id);
        setMeal(data);

        const fav = await isFavorite(id);
        setFavorite(fav);

        await addToHistory(data);
      } catch (error) {
        console.log("Error loading meal detail:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [id]);

  // ดึงรายการส่วนผสมแบบ raw (ภาษาอังกฤษเสมอ)
  const getRawIngredients = (mealData) => {
    if (!mealData) return [];
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = mealData[`strIngredient${i}`];
      const measure = mealData[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== "") {
        ingredients.push(`${measure} ${ingredient}`);
      }
    }
    return ingredients;
  };

  // แปลภาษาเมื่อ meal โหลดเสร็จ หรือมีการสลับภาษา
  useEffect(() => {
    if (!meal) return;

    const updateLanguage = async () => {
      const rawIngredients = getRawIngredients(meal);

      if (language === "en") {
        setDisplayMeal(meal);
        setDisplayIngredients(rawIngredients);
        return;
      }

      setTranslating(true);
      try {
        const [translatedName, translatedCategory, translatedInstructions, translatedIngredientsRaw] =
          await Promise.all([
            translateText(meal.strMeal, "th"),
            translateText(meal.strCategory, "th"),
            translateText(meal.strInstructions, "th"),
            translateText(rawIngredients.join("\n"), "th"),
          ]);

        setDisplayMeal({
          ...meal,
          strMeal: translatedName,
          strCategory: translatedCategory,
          strInstructions: translatedInstructions,
        });
        setDisplayIngredients(translatedIngredientsRaw.split("\n"));
      } catch (error) {
        console.log("Translate meal error:", error);
        setDisplayMeal(meal);
        setDisplayIngredients(rawIngredients);
      } finally {
        setTranslating(false);
      }
    };

    updateLanguage();
  }, [language, meal]);

  const handleFavoriteChange = async (recipe, newValue) => {
    if (newValue) {
      await addFavorite(meal);
    } else {
      await removeFavorite(meal.idMeal);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!meal || !displayMeal) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: COLORS.white }}> Enjoy Eating :3</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View>
        <Image
          source={{ uri: meal.strMealThumb }}
          style={styles.image}
        />

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.languageButtonWrapper}>
          <LanguageToggle />
        </View>

        <View style={styles.favoriteButtonWrapper}>
          <FavoriteButton
            recipe={meal}
            initialFavorite={favorite}
            onChange={handleFavoriteChange}
          />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          {displayMeal.strMeal}
        </Text>

        <Text style={styles.category}>
          🍛 {meal.strArea} {displayMeal.strCategory}
        </Text>

        {translating && (
          <View style={styles.translatingRow}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.translatingText}>กำลังแปล...</Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.heading}>
            {language === "th" ? "ส่วนผสม" : "Ingredients"}
          </Text>

          {displayIngredients.map((item, index) => (
            <Text key={index} style={styles.item}>
              • {item}
            </Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>
            {language === "th" ? "วิธีทำ" : "Instructions"}
          </Text>

          <Text style={styles.description}>
            {displayMeal.strInstructions}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: 260,
  },

  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  backButtonText: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "bold",
  },

  languageButtonWrapper: {
    position: "absolute",
    top: 20,
    right: 80,
  },

  favoriteButtonWrapper: {
    position: "absolute",
    top: 20,
    right: 20,
  },

  content: {
    padding: 20,
  },

  title: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: "bold",
  },

  category: {
    color: COLORS.primary,
    marginTop: 8,
    fontSize: 16,
  },

  translatingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  translatingText: {
    color: COLORS.subText,
    marginLeft: 8,
    fontSize: 13,
  },

  card: {
    backgroundColor: COLORS.card,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
  },

  heading: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  item: {
    color: COLORS.subText,
    marginVertical: 5,
    fontSize: 15,
  },

  description: {
    color: COLORS.subText,
    lineHeight: 24,
  },
});