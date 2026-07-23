import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import COLORS from "../constants/colors";
import { searchMeals, searchMealsByName } from "../services/mealApi";
import LanguageToggle from "../components/LanguageToggle";
import CachedImage from "../components/CachedImage";
import { useLanguage } from "../context/LanguageContext";
import { translateText } from "../services/translateCache";

// เช็คว่าข้อความมีตัวอักษรไทยอยู่หรือไม่
const containsThai = (text) => /[\u0E00-\u0E7F]/.test(text);

export default function SearchScreen({ navigation, route }) {
  const { language } = useLanguage();

  const initialKeyword = route?.params?.keyword || "";

  const [keyword, setKeyword] = useState(initialKeyword);
  const [results, setResults] = useState([]);
  const [mealNames, setMealNames] = useState({});
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  // โหมดค้นหา: "ingredient" = ค้นหาด้วยวัตถุดิบ (เดิม), "name" = ค้นหาด้วยชื่อเมนู (เพิ่มใหม่)
  const [searchMode, setSearchMode] = useState("ingredient");

  const handleSearch = async (searchKeyword) => {
    const term = (searchKeyword ?? keyword).trim();

    if (term === "") return;

    setLoading(true);
    setSearched(true);

    try {
      // ฐานข้อมูลสูตรอาหารเป็นภาษาอังกฤษ ถ้าพิมพ์มาเป็นไทยต้องแปลเป็นอังกฤษก่อนค้นหา
      let searchTerm = term;
      if (containsThai(term)) {
        try {
          const translated = await translateText(term, "en", "th");
          // filter.php ของ TheMealDB จับคู่วัตถุดิบแบบตรงตัว ปรับให้เป็นตัวพิมพ์เล็กเพื่อโอกาสจับคู่สูงขึ้น
          searchTerm = translated.trim().toLowerCase();
        } catch (translateError) {
          console.log("Translate search term error:", translateError);
          searchTerm = term;
        }
      }

      const data =
        searchMode === "name"
          ? await searchMealsByName(searchTerm)
          : await searchMeals(searchTerm);
      setResults(data || []);
    } catch (error) {
      console.log("Search Error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // สลับโหมดค้นหา แล้วเคลียร์ผลลัพธ์เก่าเพื่อไม่ให้สับสนว่าผลลัพธ์มาจากโหมดไหน
  const handleModeChange = (mode) => {
    if (mode === searchMode) return;
    setSearchMode(mode);
    setResults([]);
    setSearched(false);
  };

  // กลับหน้า Home อย่างปลอดภัย ไม่พึ่งชื่อ route ที่อาจไม่ตรงกับ navigator จริง
  const goHome = () => {
    if (navigation.canGoBack()) {
      navigation.popToTop();
    } else {
      navigation.navigate("Home");
    }
  };

  useEffect(() => {
    if (initialKeyword) {
      handleSearch(initialKeyword);
    }
  }, [initialKeyword]);

  // แปลชื่อเมนูของผลการค้นหาเมื่อผลลัพธ์เปลี่ยน หรือมีการสลับภาษา
  useEffect(() => {
    const translateResultNames = async () => {
      if (language === "en") {
        const original = {};
        results.forEach((m) => (original[m.idMeal] = m.strMeal));
        setMealNames(original);
        return;
      }

      const translated = {};
      for (const meal of results) {
        translated[meal.idMeal] = await translateText(meal.strMeal, "th");
      }
      setMealNames(translated);
    };
    translateResultNames();
  }, [language, results]);

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={goHome}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {language === "th"
            ? "🔍 ค้นหาสูตรอาหาร"
            : "🔍 Search Recipes"}
        </Text>

        <LanguageToggle />

      </View>

      {/* สลับโหมดค้นหา: วัตถุดิบ / ชื่อเมนู */}
      <View style={styles.modeRow}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            searchMode === "ingredient" && styles.modeButtonActive,
          ]}
          onPress={() => handleModeChange("ingredient")}
        >
          <Text
            style={[
              styles.modeButtonText,
              searchMode === "ingredient" && styles.modeButtonTextActive,
            ]}
          >
            {language === "th" ? "🥕 วัตถุดิบ" : "🥕 Ingredient"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeButton,
            searchMode === "name" && styles.modeButtonActive,
          ]}
          onPress={() => handleModeChange("name")}
        >
          <Text
            style={[
              styles.modeButtonText,
              searchMode === "name" && styles.modeButtonTextActive,
            ]}
          >
            {language === "th" ? "🍽️ ชื่อเมนู" : "🍽️ Meal Name"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Box */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder={
            searchMode === "name"
              ? language === "th"
                ? "ค้นหาด้วยชื่อเมนู เช่น Pad Thai หรือ ผัดไทย"
                : "Search by meal name (e.g. Pad Thai)"
              : language === "th"
              ? "ค้นหาด้วยวัตถุดิบ เช่น chicken หรือ ไก่"
              : "Search by ingredient (e.g. chicken)"
          }
          placeholderTextColor={COLORS.subText}
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={() => handleSearch()}
          returnKeyType="search"
        />

        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => handleSearch()}
        >
          <Text style={styles.searchButtonText}>
            {language === "th" ? "ค้นหา" : "Search"}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 30 }}
        />
      ) : !searched ? (
        <View style={styles.placeholder}>
          <Text style={styles.icon}>🔍</Text>

          <Text style={styles.title}>
            {language === "th"
              ? "ค้นหาสูตรอาหาร"
              : "Search Recipes"}
          </Text>

          <Text style={styles.subtitle}>
            {language === "th"
              ? "ผลการค้นหาจะแสดงที่นี่"
              : "Search results will appear here."}
          </Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.placeholder}>
          <Text style={styles.icon}>😕</Text>

          <Text style={styles.title}>
            {language === "th"
              ? "ไม่พบเมนู"
              : "No Results"}
          </Text>

          <Text style={styles.subtitle}>
            {language === "th"
              ? "ลองค้นหาด้วย" +
                (searchMode === "name" ? "ชื่อเมนูอื่น" : "วัตถุดิบอื่น")
              : `Try searching with a different ${
                  searchMode === "name" ? "name" : "ingredient"
                }.`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.idMeal}
          numColumns={2}
          contentContainerStyle={{ padding: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate("Detail", {
                  id: item.idMeal,
                })
              }
            >
              <CachedImage
                source={{ uri: item.strMealThumb }}
                style={styles.cardImage}
              />

              <Text
                style={styles.cardTitle}
                numberOfLines={2}
              >
                {mealNames[item.idMeal] || item.strMeal}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
    marginHorizontal: 20,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "bold",
  },

  headerTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "bold",
  },

  searchBox: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 20,
  },

  modeRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 4,
  },

  modeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  modeButtonActive: {
    backgroundColor: COLORS.primary,
  },

  modeButtonText: {
    color: COLORS.subText,
    fontWeight: "600",
    fontSize: 13,
  },

  modeButtonTextActive: {
    color: COLORS.white,
  },

  input: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: COLORS.white,
    fontSize: 15,
  },

  searchButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingHorizontal: 18,
    justifyContent: "center",
    marginLeft: 10,
  },

  searchButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },

  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  icon: {
    fontSize: 70,
  },

  title: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
  },

  subtitle: {
    color: COLORS.subText,
    marginTop: 10,
    textAlign: "center",
  },

  card: {
    flex: 1,
    margin: 8,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    overflow: "hidden",
  },

  cardImage: {
    width: "100%",
    height: 120,
  },

  cardTitle: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
    padding: 10,
  },
});