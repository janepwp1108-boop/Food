import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/SplashScreen";
import BottomTab from "./BottomTab";
import DetailScreen from "../screens/DetailScreen";
import SearchScreen from "../screens/SearchScreen";


const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
      />

      <Stack.Screen
        name="Main"
        component={BottomTab}
      />

      <Stack.Screen
        name="Detail"
        component={DetailScreen}
      />

      <Stack.Screen
        name="Search"
        component={SearchScreen}
      />
    </Stack.Navigator>
  );
}