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
import { getFavorites } from "../storage/favoriteStorage";

export default function CookingScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        const data = await getFavorites();
        setFavorites(data);
      };
      loadFavorites();
    }, [])
  );

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.icon}>👨‍🍳</Text>

        <Text style={styles.title}>
          Cooking Mode
        </Text>

        <Text style={styles.subtitle}>
          Choose a recipe to start cooking.
        </Text>

        <Text style={styles.hint}>
          Save recipes to Favorites first, then they'll show up here.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      <Text style={styles.headerIcon}>👨‍🍳</Text>

      <Text style={styles.headerTitle}>
        Cooking Mode
      </Text>

      <Text style={styles.headerSubtitle}>
        Choose a recipe to start cooking.
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

            <Text style={styles.arrow}>▶️</Text>
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

  hint: {
    color: COLORS.subText,
    marginTop: 20,
    textAlign: "center",
    fontSize: 13,
    opacity: 0.7,
  },

  listContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  headerIcon: {
    fontSize: 40,
    textAlign: "center",
    marginTop: 50,
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