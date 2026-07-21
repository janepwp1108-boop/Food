import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import COLORS from "../constants/colors";
import { searchMeals } from "../services/mealApi";
import LanguageToggle from "../components/LanguageToggle";
import { useLanguage } from "../context/LanguageContext";

export default function SearchScreen({ navigation, route }) {
  const { language } = useLanguage();

  const initialKeyword = route?.params?.keyword || "";

  const [keyword, setKeyword] = useState(initialKeyword);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (searchKeyword) => {
    const term = (searchKeyword ?? keyword).trim();

    if (term === "") return;

    setLoading(true);
    setSearched(true);

    try {
      const data = await searchMeals(term);
      setResults(data || []);
    } catch (error) {
      console.log("Search Error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialKeyword) {
      handleSearch(initialKeyword);
    }
  }, [initialKeyword]);

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Home")}
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

      {/* Search Box */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder={
            language === "th"
              ? "ค้นหาด้วยวัตถุดิบ เช่น chicken"
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
              ? "ลองค้นหาด้วยวัตถุดิบอื่น"
              : "Try searching with a different ingredient."}
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
              <Image
                source={{ uri: item.strMealThumb }}
                style={styles.cardImage}
              />

              <Text
                style={styles.cardTitle}
                numberOfLines={2}
              >
                {item.strMeal}
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