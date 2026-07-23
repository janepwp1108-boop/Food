import api from "./axiosConfig";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// เรียก API พร้อม retry อัตโนมัติถ้าล้มเหลว (เช่น เน็ตสะดุด/timeout ชั่วคราว)
// ป้องกันปัญหาที่บางเมนูโหลดไม่ขึ้นเพียงเพราะเน็ตสะดุดแค่ครั้งเดียว
const requestWithRetry = async (requestFn, retry = 2) => {
  try {
    return await requestFn();
  } catch (error) {
    if (retry > 0) {
      console.log(
        `Meal API request failed, retrying... (${retry} left):`,
        error.message
      );
      await sleep(700);
      return requestWithRetry(requestFn, retry - 1);
    }
    throw error;
  }
};

export const searchMeals = async (ingredient) => {
  const response = await requestWithRetry(() =>
    api.get(`/filter.php?i=${ingredient}`)
  );
  return response.data.meals;
};

// ค้นหาด้วยชื่อเมนูโดยตรง (ต่างจาก searchMeals ที่ค้นหาด้วยวัตถุดิบ)
export const searchMealsByName = async (name) => {
  const response = await requestWithRetry(() =>
    api.get(`/search.php?s=${name}`)
  );
  return response.data.meals;
};

export const getMealDetail = async (id) => {
  const response = await requestWithRetry(() =>
    api.get(`/lookup.php?i=${id}`)
  );
  return response.data.meals ? response.data.meals[0] : null;
};

export const getRandomMeal = async () => {
  const response = await requestWithRetry(() => api.get("/random.php"));
  return response.data.meals[0];
};

// สุ่มเมนูหลายอันพร้อมกัน (TheMealDB ไม่มี endpoint สุ่มทีละหลายอัน
// เลยต้องยิง random.php หลายครั้งพร้อมกัน แล้วกรองตัวซ้ำออก)
export const getRandomMeals = async (count = 8) => {
  const requests = Array.from({ length: count }, () => getRandomMeal());
  const results = await Promise.all(
    requests.map((p) => p.catch((error) => {
      console.log("getRandomMeals: one random pick failed:", error.message);
      return null;
    }))
  );

  const seen = new Set();
  const uniqueMeals = [];

  for (const meal of results) {
    if (meal && !seen.has(meal.idMeal)) {
      seen.add(meal.idMeal);
      uniqueMeals.push(meal);
    }
  }

  return uniqueMeals;
};

export const getCategoryMeals = async (category) => {
  const response = await requestWithRetry(() =>
    api.get(`/filter.php?c=${category}`)
  );
  return response.data.meals;
};

export const getAreaMeals = async (area) => {
  const response = await requestWithRetry(() =>
    api.get(`/filter.php?a=${area}`)
  );
  return response.data.meals;
};