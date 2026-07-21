import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import HomeScreen from "../screens/HomeScreen";
import FavoriteScreen from "../screens/FavoriteScreen";
import CookingScreen from "../screens/CookingScreen";
import ProfileScreen from "../screens/ProfileScreen";

import COLORS from "../constants/colors";

const Tab = createBottomTabNavigator();

export default function BottomTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.subText,

        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
        },

        tabBarIcon: ({ color, size }) => {
          let icon = "home";

          if (route.name === "Home") icon = "home";
          if (route.name === "Favorite") icon = "heart";
          if (route.name === "Cooking") icon = "restaurant";
          if (route.name === "Profile") icon = "person";

          return (
            <Ionicons
              name={icon}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      <Tab.Screen
        name="Favorite"
        component={FavoriteScreen}
      />

      <Tab.Screen
        name="Cooking"
        component={CookingScreen}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}