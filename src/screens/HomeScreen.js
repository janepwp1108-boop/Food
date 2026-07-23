import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";

import COLORS from "../constants/colors";
import CachedImage from "../components/CachedImage";
import { useEffect, useState } from "react";
import {
  getRandomMeal,
  searchMeals,
  getAreaMeals,
} from "../services/mealApi";
import LanguageToggle from "../components/LanguageToggle";
import { useLanguage } from "../context/LanguageContext";
import { translateText } from "../services/translateCache";

const AREAS = [
  { key: "Thai", label: "Thai Food", icon: "🍜" },
  { key: "Chinese", label: "Chinese Food", icon: "🥡" },
  { key: "Japanese", label: "Japanese Food", icon: "🍣" },
  
];

const DEFAULT_TEXTS = {
  greeting: "👋 Good Morning",
  title: "What would you like to cook today?",
  searchPlaceholder: "Search by ingredient, e.g. chicken, egg...",
  bannerTitle: "Today's Recommendation",
  loadingLabel: "Loading...",
  popularRecipes: "Popular Recipes",
  noRecipesFound: "No recipes found",
};

export default function HomeScreen({ navigation }) {
  const { language } = useLanguage();

  const [searchKeyword, setSearchKeyword] = useState("");

  const [recommended, setRecommended] = useState(null);
  const [popular, setPopular] = useState([]);
  const [areaMeals, setAreaMeals] = useState({});
  const [loading, setLoading] = useState(true);

  const [recommendedName, setRecommendedName] = useState("");
  const [mealNames, setMealNames] = useState({});

  const [texts, setTexts] = useState(DEFAULT_TEXTS);
  const [areaLabels, setAreaLabels] = useState(
    AREAS.reduce((acc, a) => {
      acc[a.key] = a.label;
      return acc;
    }, {})
  );

  // โหลดข้อมูลทั้งหมด: แนะนำวันนี้ + popular + แต่ละชาติอาหาร
  useEffect(() => {
    const loadData = async () => {
      try {
        const [randomMeal, popularList, ...areaResults] = await Promise.all([
          getRandomMeal(),
          searchMeals("chicken"),
          ...AREAS.map((a) => getAreaMeals(a.key)),
        ]);

        setRecommended(randomMeal || null);
        setPopular(popularList || []);

        const areaData = {};
        AREAS.forEach((a, index) => {
          // จำกัดแค่ 10 เมนูต่อชาติ กัน list ยาวเกินไป
          areaData[a.key] = (areaResults[index] || []).slice(0, 20);
        });
        setAreaMeals(areaData);
      } catch (error) {
        console.log("Error loading meals:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // แปลชื่อเมนูทั้งหมดเมื่อสลับภาษา หรือข้อมูลโหลดเสร็จ
  useEffect(() => {
    const translateAllNames = async () => {
      const allMeals = [
        ...popular,
        ...Object.values(areaMeals).flat(),
      ];

      if (language === "en") {
        setRecommendedName(recommended ? recommended.strMeal : "");
        const original = {};
        allMeals.forEach((m) => (original[m.idMeal] = m.strMeal));
        setMealNames(original);
        return;
      }

      if (recommended) {
        const translated = await translateText(recommended.strMeal, "th");
        setRecommendedName(translated);
      }

      const translatedNames = {};
      for (const meal of allMeals) {
        translatedNames[meal.idMeal] = await translateText(meal.strMeal, "th");
      }
      setMealNames(translatedNames);
    };

    translateAllNames();
  }, [language, popular, areaMeals, recommended]);

  // แปลข้อความ UI คงที่ทั้งหมดของหน้านี้ (ทุกคำทุกวรรค)
  useEffect(() => {
    const translateStaticTexts = async () => {
      if (language === "en") {
        setTexts(DEFAULT_TEXTS);
        setAreaLabels(
          AREAS.reduce((acc, a) => {
            acc[a.key] = a.label;
            return acc;
          }, {})
        );
        return;
      }

      const [
        greeting,
        title,
        searchPlaceholder,
        bannerTitle,
        loadingLabel,
        popularRecipes,
        noRecipesFound,
        ...translatedAreaLabels
      ] = await Promise.all([
        translateText(DEFAULT_TEXTS.greeting, "th"),
        translateText(DEFAULT_TEXTS.title, "th"),
        translateText(DEFAULT_TEXTS.searchPlaceholder, "th"),
        translateText(DEFAULT_TEXTS.bannerTitle, "th"),
        translateText(DEFAULT_TEXTS.loadingLabel, "th"),
        translateText(DEFAULT_TEXTS.popularRecipes, "th"),
        translateText(DEFAULT_TEXTS.noRecipesFound, "th"),
        ...AREAS.map((a) => translateText(a.label, "th")),
      ]);

      setTexts({
        greeting,
        title,
        searchPlaceholder,
        bannerTitle,
        loadingLabel,
        popularRecipes,
        noRecipesFound,
      });

      const newAreaLabels = {};
      AREAS.forEach((a, index) => {
        newAreaLabels[a.key] = translatedAreaLabels[index];
      });
      setAreaLabels(newAreaLabels);
    };

    translateStaticTexts();
  }, [language]);

  const handleSearchSubmit = () => {
    if (searchKeyword.trim() === "") return;
    navigation.navigate("Search", { keyword: searchKeyword.trim() });
    setSearchKeyword("");
  };

  const renderMealRow = (title, icon, list) => (
    <View style={styles.section} key={title}>
      <Text style={styles.sectionTitle}>
        {icon} {title}
      </Text>

      {list.length === 0 ? (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>{texts.noRecipesFound}</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 15 }}
        >
          {list.map((meal) => (
            <TouchableOpacity
              key={meal.idMeal}
              style={styles.card}
              onPress={() =>
                navigation.navigate("Detail", { id: meal.idMeal })
              }
            >
              <CachedImage
                source={{ uri: meal.strMealThumb }}
                style={styles.cardImage}
              />
              <Text style={styles.cardText} numberOfLines={1}>
                {mealNames[meal.idMeal] || meal.strMeal}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <Text style={styles.greeting}>
          {texts.greeting}
        </Text>

        <LanguageToggle />
      </View>

      <Text style={styles.title}>
        {texts.title}
      </Text>

      {/* ช่องค้นหาวัตถุดิบ */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder={texts.searchPlaceholder}
          placeholderTextColor={COLORS.subText}
          value={searchKeyword}
          onChangeText={setSearchKeyword}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
        />

        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearchSubmit}
        >
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.banner}
        onPress={() =>
          recommended &&
          navigation.navigate("Detail", { id: recommended.idMeal })
        }
      >
        <Text style={styles.bannerTitle}>
          {texts.bannerTitle}
        </Text>

        <Text style={styles.bannerFood}>
          🍝 {recommendedName || texts.loadingLabel}
        </Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 30 }}
        />
      ) : (
        <>
          {renderMealRow(texts.popularRecipes, "🔥", popular)}

          {AREAS.map((area) =>
            renderMealRow(
              areaLabels[area.key] || area.label,
              area.icon,
              areaMeals[area.key] || []
            )
          )}
        </>
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
  },

  greeting: {
    color: COLORS.subText,
    fontSize: 16,
  },

  title: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
  },

  searchBox: {
    flexDirection: "row",
    marginTop: 20,
  },

  searchInput: {
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
    fontSize: 18,
  },

  banner: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 25,
  },

  bannerTitle: {
    color: COLORS.white,
    fontSize: 15,
  },

  bannerFood: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },

  section: {
    marginTop: 30,
  },

  sectionTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "bold",
  },

  placeholder: {
    marginTop: 15,
    height: 150,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    color: COLORS.subText,
  },

  card: {
    width: 150,
    marginRight: 15,
  },

  cardImage: {
    width: 150,
    height: 150,
    borderRadius: 16,
    backgroundColor: COLORS.card,
  },

  cardText: {
    color: COLORS.white,
    marginTop: 8,
    fontWeight: "600",
  },
});