import AsyncStorage from "@react-native-async-storage/async-storage";
import { translateText as translateTextApi } from "./translateApi";

const CACHE_PREFIX = "translateCache:";

// แฮชข้อความ+ภาษาให้เป็น key สั้น ๆ สำหรับเก็บใน AsyncStorage
// (ข้อความบางอย่าง เช่น strInstructions อาจยาวมาก ไม่เหมาะเอามาใช้เป็น key ตรง ๆ)
const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
};

const buildCacheKey = (text, targetLang, sourceLang) => {
  const raw = `${sourceLang || "auto"}|${targetLang}|${text}`;
  return `${CACHE_PREFIX}${hashString(raw)}:${raw.length}`;
};

/**
 * translateText (พร้อมแคช)
 * ใช้แทน translateText จาก translateApi ได้เลย ซิกเนเจอร์เหมือนเดิมทุกอย่าง
 * - ถ้าเคยแปลข้อความนี้ (ด้วยภาษาต้นทาง/ปลายทางเดียวกัน) มาก่อน จะอ่านจากเครื่องทันที ไม่เรียก API ซ้ำ
 *   ทำให้ข้อความที่เคยแปลแล้วโชว์เป็นภาษาไทยได้แม้ไม่มีเน็ต
 * - ถ้ายังไม่เคยแปล จะเรียก API ตามปกติ แล้วเก็บผลลัพธ์ไว้ใช้ครั้งต่อไป
 */
export const translateText = async (text, targetLang, sourceLang) => {
  if (!text) return text;

  const cacheKey = buildCacheKey(text, targetLang, sourceLang);

  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached !== null) {
      return cached;
    }
  } catch (error) {
    console.log("Translate cache read error:", error.message || error);
  }

  // ไม่มีในแคช (หรืออ่านแคชพลาด) ต้องเรียก API จริง ถ้าไม่มีเน็ตตรงนี้จะ throw
  // ให้โค้ดที่เรียกใช้ (ในแต่ละหน้าจอ) catch แล้ว fallback เป็นข้อความเดิมตามที่ทำอยู่แล้ว
  const translated = await translateTextApi(text, targetLang, sourceLang);

  // ถ้าแปลไม่สำเร็จจริง ๆ (เช่น โควต้าหมด/ไม่มีเน็ต) translateApi จะคืนข้อความเดิมกลับมา (translated === text)
  // ห้ามเก็บลงแคช ไม่งั้นจะแปลผิดค้างตลอดไปแม้โควต้าจะกลับมาใช้ได้แล้วก็ตาม
  if (translated === text) {
    return translated;
  }

  try {
    await AsyncStorage.setItem(cacheKey, translated);
  } catch (error) {
    console.log("Translate cache write error:", error.message || error);
  }

  return translated;
};