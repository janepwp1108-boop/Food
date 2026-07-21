import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import COLORS from "../constants/colors";
import { getFavorites, removeFavorite } from "../storage/favoriteStorage";
import FavoriteButton from "../components/FavoriteButton";

export default function FavoriteScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);

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

  const handleRemove = async (idMeal) => {
    await removeFavorite(idMeal);
    setFavorites((prev) => prev.filter((item) => item.idMeal !== idMeal));
  };

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.icon}>❤️</Text>

        <Text style={styles.title}>
          Favorite Recipes
        </Text>

        <Text style={styles.subtitle}>
          Your saved recipes will appear here.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      <Text style={styles.headerTitle}>
        ❤️ Favorite Recipes
      </Text>

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
            <Image
              source={{ uri: item.strMealThumb }}
              style={styles.cardImage}
            />

            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.strMeal}
              </Text>

              <Text style={styles.cardCategory}>
                {item.strCategory}
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
    marginTop: 50,
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