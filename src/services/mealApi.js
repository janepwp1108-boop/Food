import api from "./axiosConfig";

export const searchMeals = async (ingredient) => {
  const response = await api.get(`/filter.php?i=${ingredient}`);
  return response.data.meals;
};

export const getMealDetail = async (id) => {
  const response = await api.get(`/lookup.php?i=${id}`);
  return response.data.meals[0];
};

export const getRandomMeal = async () => {
  const response = await api.get("/random.php");
  return response.data.meals[0];
};

export const getCategoryMeals = async (category) => {
  const response = await api.get(`/filter.php?c=${category}`);
  return response.data.meals;
};

export const getAreaMeals = async (area) => {
  const response = await api.get(`/filter.php?a=${area}`);
  return response.data.meals;
};