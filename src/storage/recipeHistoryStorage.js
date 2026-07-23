import AsyncStorage from "@react-native-async-storage/async-storage";

const HISTORY_KEY = "recipe_history";

// ดึงประวัติเมนูที่เคยดูทั้งหมด
export async function getHistory() {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log("Get History Error:", error);
    return [];
  }
}

// บันทึกเมนูที่เพิ่งเปิดดู (ไม่ซ้ำ)
export async function addHistory(recipe) {
  try {
    const history = await getHistory();

    const exists = history.some(
      (item) => item.idMeal === recipe.idMeal
    );

    if (exists) {
      return history;
    }

    const updated = [...history, recipe];

    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));

    return updated;
  } catch (error) {
    console.log("Add History Error:", error);
  }
}