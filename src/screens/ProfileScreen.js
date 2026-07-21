import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import COLORS from "../constants/colors";
import { getFavorites } from "../storage/favoriteStorage";

export default function ProfileScreen() {
  const [favoriteCount, setFavoriteCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const loadCount = async () => {
        const favorites = await getFavorites();
        setFavoriteCount(favorites.length);
      };
      loadCount();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>👨‍🍳</Text>
      </View>

      <Text style={styles.name}>
        Gourmet Chef
      </Text>

      <Text style={styles.email}>
        recipehub@email.com
      </Text>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.number}>{favoriteCount}</Text>
          <Text style={styles.label}>Favorites</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.number}>0</Text>
          <Text style={styles.label}>Recipes</Text>
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
    paddingTop: 80,
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
    flexDirection: "row",
    marginTop: 40,
  },

  statCard: {
    width: 140,
    backgroundColor: COLORS.card,
    marginHorizontal: 10,
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