import { StatusBar } from "expo-status-bar";
import AppNavigator from "./src/navigation/AppNavigator";
import { LanguageProvider } from "./src/context/LanguageContext";

export default function App() {
  return (
    <LanguageProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </LanguageProvider>
  );
}