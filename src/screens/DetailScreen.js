import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import COLORS from "../constants/colors";
import CachedImage from "../components/CachedImage";
import { getMealDetail } from "../services/mealApi";
import FavoriteButton from "../components/FavoriteButton";
import LanguageToggle from "../components/LanguageToggle";
import { getFavorites, isFavorite, addFavorite, removeFavorite } from "../storage/favoriteStorage";
import { addHistory, getHistory } from "../storage/recipeHistoryStorage";
import { useLanguage } from "../context/LanguageContext";
import { translateText } from "../services/translateCache";

export default function DetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { language } = useLanguage();

  const [meal, setMeal] = useState(null);
  const [displayMeal, setDisplayMeal] = useState(null);
  const [displayIngredients, setDisplayIngredients] = useState([]);
  const [displayArea, setDisplayArea] = useState("");
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [emptyText, setEmptyText] = useState("Enjoy Eating :3");
  const [retryToken, setRetryToken] = useState(0);
  const [errorDetail, setErrorDetail] = useState("");

  // โหลดข้อมูลเมนู: เช็คจากเครื่อง (Favorites/History) ก่อนเพื่อให้ดูออฟไลน์ได้
  // แล้วค่อยลองอัปเดตข้อมูลล่าสุดจาก API แบบ background ถ้ามีเน็ต
  useEffect(() => {
    let isActive = true;

    const loadDetail = async () => {
      setLoading(true);
      setErrorDetail("");

      // 1) เช็คว่ามีข้อมูลเต็มเก็บไว้ในเครื่องแล้วหรือยัง (จาก Favorites หรือ History)
      const [favorites, history] = await Promise.all([
        getFavorites(),
        getHistory(),
      ]);

      const cached =
        favorites.find((item) => item.idMeal === id) ||
        history.find((item) => item.idMeal === id);

      if (cached && isActive) {
        // มีข้อมูลอยู่ในเครื่องแล้ว แสดงผลได้ทันทีแม้ไม่มีเน็ต
        setMeal(cached);
        setFavorite(favorites.some((item) => item.idMeal === id));
        setLoading(false);
      }

      // 2) พยายามดึงข้อมูลล่าสุดจาก API เสมอ (ถ้ามีเน็ต) เพื่ออัปเดตให้ทันสมัยที่สุด
      try {
        const data = await getMealDetail(id);

        if (data && isActive) {
          // เซ็ตข้อมูลเมนูก่อนเลย เพราะดึงจาก API สำเร็จแล้วจริง ๆ
          setMeal(data);
          setErrorDetail("");

          // งานเสริม (เช็คว่า favorite อยู่ไหม / บันทึกลงประวัติ) แยก try/catch ต่างหาก
          // ถ้าจุดนี้พัง (เช่น storage function มีปัญหา) ต้องไม่ทำให้ข้อมูลเมนูที่โหลดสำเร็จแล้วหายไปด้วย
          try {
            setFavorite(await isFavorite(id));
          } catch (favError) {
            console.log("isFavorite error (non-fatal):", favError.message || favError);
          }

          try {
            await addHistory(data);
          } catch (historyError) {
            console.log("addHistory error (non-fatal):", historyError.message || historyError);
          }
        } else if (!cached && isActive) {
          // API ตอบกลับมาแต่ไม่มีข้อมูลเมนูนี้เลย (ไม่ใช่ error, แต่ meals เป็น null/ว่าง)
          console.log(`Meal id=${id} not found: API returned no data (meals is null/empty)`);
          setErrorDetail(`ไม่พบข้อมูลเมนู (id: ${id}) จาก API — อาจถูกลบ/ย้ายไปแล้ว`);
        }
      } catch (error) {
        console.log("Error loading meal detail (using cache if available):", error.message || error);

        // ไม่มีเน็ต/API ล่ม แต่ถ้าไม่มีข้อมูลในเครื่องเลยก็ต้องแสดงหน้า fallback
        if (!cached && isActive) {
          setMeal(null);
          setErrorDetail(`โหลดข้อมูลไม่สำเร็จ (id: ${id}) — ${error.message || "เกิดข้อผิดพลาดไม่ทราบสาเหตุ"}`);
        }
      } finally {
        if (isActive) setLoading(false);
      }
    };

    loadDetail();

    return () => {
      isActive = false;
    };
  }, [id, retryToken]);

  const handleRetry = () => {
    setMeal(null);
    setRetryToken((prev) => prev + 1);
  };

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
        setDisplayArea(meal.strArea || "");
        return;
      }

      setTranslating(true);
      try {
        const [
          translatedName,
          translatedCategory,
          translatedInstructions,
          translatedIngredientsRaw,
          translatedArea,
        ] = await Promise.all([
          translateText(meal.strMeal, "th"),
          translateText(meal.strCategory, "th"),
          translateText(meal.strInstructions, "th"),
          translateText(rawIngredients.join("\n"), "th"),
          meal.strArea ? translateText(meal.strArea, "th") : Promise.resolve(""),
        ]);

        setDisplayMeal({
          ...meal,
          strMeal: translatedName,
          strCategory: translatedCategory,
          strInstructions: translatedInstructions,
        });
        setDisplayIngredients(translatedIngredientsRaw.split("\n"));
        setDisplayArea(translatedArea);
      } catch (error) {
        console.log("Translate meal error:", error);
        setDisplayMeal(meal);
        setDisplayIngredients(rawIngredients);
        setDisplayArea(meal.strArea || "");
      } finally {
        setTranslating(false);
      }
    };

    updateLanguage();
  }, [language, meal]);

  // แปลข้อความเมื่อไม่พบข้อมูลเมนู
  useEffect(() => {
    const translateEmptyText = async () => {
      if (language === "en") {
        setEmptyText("Enjoy Eating :3");
        return;
      }
      const translated = await translateText("Enjoy Eating :3", "th");
      setEmptyText(translated);
    };
    translateEmptyText();
  }, [language]);

  const handleFavoriteChange = async (recipe, newValue) => {
    if (newValue) {
      await addFavorite(meal);
    } else {
      await removeFavorite(meal.idMeal);
    }
  };

  // ยังโหลดข้อมูล หรือมี meal แล้วแต่ยังรอแปลภาษา (displayMeal ยังไม่พร้อม) ให้โชว์ spinner ต่อเนื่อง
  // เพื่อไม่ให้จอกระพริบข้อความ fallback ระหว่างช่วงรอแปลภาษา
  if (loading || (meal && !displayMeal)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // มาถึงจุดนี้แปลว่าโหลดเสร็จแล้วแต่ไม่พบข้อมูลเมนูจริง ๆ (เช่น API error)
  if (!meal) {
    return (
      <View style={styles.loadingContainer}>
        <TouchableOpacity
          style={styles.emptyHomeButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.emptyHomeButtonText}>🏠</Text>
        </TouchableOpacity>

        <Text style={{ color: COLORS.white }}>{emptyText}</Text>

        {errorDetail ? (
          <Text style={styles.debugText}>{errorDetail}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.retryButton}
          onPress={handleRetry}
        >
          <Text style={styles.retryButtonText}>
            {language === "th" ? "ลองโหลดใหม่" : "Try Again"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backHomeButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.backHomeButtonText}>
            {language === "th" ? "กลับหน้าหลัก" : "Back to Home"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View>
        <CachedImage
          source={{ uri: meal.strMealThumb }}
          style={styles.image}
        />

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.homeButtonText}>🏠</Text>
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
          🍛 {displayArea} {displayMeal.strCategory}
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

  emptyHomeButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyHomeButtonText: {
    fontSize: 20,
  },

  retryButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },

  retryButtonText: {
    color: COLORS.white,
    fontWeight: "600",
  },

  debugText: {
    color: COLORS.subText,
    fontSize: 12,
    marginTop: 12,
    textAlign: "center",
    paddingHorizontal: 30,
  },

  backHomeButton: {
    marginTop: 14,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.card,
  },

  backHomeButtonText: {
    color: COLORS.subText,
    fontWeight: "600",
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

  homeButton: {
    position: "absolute",
    top: 20,
    left: 70,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  homeButtonText: {
    fontSize: 18,
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