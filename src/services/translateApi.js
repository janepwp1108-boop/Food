import axios from "axios";

const MAX_CHARS = 450;

// ใส่อีเมลของคุณตรงนี้ (อีเมลอะไรก็ได้ ไม่ต้องยืนยันตัวตน) เพื่อให้ MyMemory
// เพิ่มโควต้าฟรีจาก ~5,000 คำ/วัน เป็น ~50,000 คำ/วัน (ลดโอกาสเจอ "โควต้าหมด" ได้เยอะ)
// ดูรายละเอียดเพิ่มเติม: https://mymemory.translated.net/doc/spec.php
const TRANSLATE_EMAIL = "janepwp1108@gmail.com";

// เก็บข้อความที่แปลแล้ว
const cache = new Map();

// รอเวลา
const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// MyMemory (API ฟรีที่ใช้อยู่) มีโควต้าจำกัดต่อวันสำหรับผู้ใช้ที่ไม่ได้ลงทะเบียน
// เมื่อโควต้าหมด มันจะไม่ error แต่จะตอบ 200 กลับมาพร้อมข้อความเตือนแทนคำแปลจริง เช่น
// "MYMEMORY WARNING: YOU USED ALL AVAILABLE FREE TRANSLATIONS FOR TODAY..."
// ถ้าไม่เช็คตรงนี้ โค้ดจะเข้าใจผิดว่าแปลสำเร็จ แล้วเก็บข้อความเตือนนั้นแทนคำแปลไทยไปเลย
const isQuotaWarning = (text) => {
  if (!text) return false;
  const upper = text.toUpperCase();
  return (
    upper.includes("MYMEMORY WARNING") ||
    upper.includes("QUOTA") ||
    upper.includes("YOU USED ALL AVAILABLE FREE TRANSLATIONS")
  );
};

const translateChunk = async (
  text,
  targetLang = "th",
  sourceLang = "en",
  retry = 2
) => {
  if (!text || text.trim() === "") return text;

  const key = `${sourceLang}:${targetLang}:${text}`;

  // เคยแปลแล้ว (และไม่ใช่ข้อความเตือนโควต้า)
  if (cache.has(key)) {
    return cache.get(key);
  }

  try {
    const response = await axios.get(
      "https://api.mymemory.translated.net/get",
      {
        params: {
          q: text,
          langpair: `${sourceLang}|${targetLang}`,
          de: TRANSLATE_EMAIL,
        },
        timeout: 10000,
      }
    );

    const translated =
      response.data?.responseData?.translatedText || text;

    // โควต้าหมด -> ถือว่าแปลไม่สำเร็จ อย่าเก็บลงแคช ให้ retry หรือ fallback เป็นข้อความเดิม
    if (isQuotaWarning(translated)) {
      console.log("Translate quota exceeded, falling back to original text");

      if (retry > 0) {
        await sleep(800);
        return translateChunk(text, targetLang, sourceLang, retry - 1);
      }

      // retry หมดแล้วก็ยังติดโควต้า คืนข้อความเดิมไปก่อน (ไม่เก็บแคช เผื่อพรุ่งนี้โควต้าคืนแล้วจะได้แปลใหม่)
      return text;
    }

    cache.set(key, translated);

    return translated;
  } catch (error) {
    console.log("Translate Error:", error.message);

    if (retry > 0) {
      await sleep(600);
      return translateChunk(text, targetLang, sourceLang, retry - 1);
    }

    return text;
  }
};

// -----------------------------
// text: ข้อความที่ต้องการแปล
// targetLang: ภาษาปลายทาง (default "th")
// sourceLang: ภาษาต้นทาง (default "en" เพื่อให้เข้ากันได้กับโค้ดเดิมที่เรียกใช้อยู่แล้ว)
// -----------------------------
export const translateText = async (
  text,
  targetLang = "th",
  sourceLang = "en"
) => {
  if (!text || text.trim() === "") return text;

  // ถ้าเป็นข้อความสั้น
  if (text.length <= MAX_CHARS) {
    return await translateChunk(text, targetLang, sourceLang);
  }

  // ถ้าเป็นข้อความยาว แบ่งเป็นประโยค
  const sentences = text.split(/(?<=[.!?])\s+/);

  let current = "";
  const chunks = [];

  for (const sentence of sentences) {
    if (
      (current + sentence).length >
      MAX_CHARS
    ) {
      chunks.push(current);
      current = sentence;
    } else {
      current +=
        (current ? " " : "") + sentence;
    }
  }

  if (current) {
    chunks.push(current);
  }

  const translated = [];

  for (const chunk of chunks) {
    translated.push(
      await translateChunk(chunk, targetLang, sourceLang)
    );
  }

  return translated.join(" ");
};

// -----------------------------
// แปลทีละรายการ เช่น ส่วนผสม
// -----------------------------
export const translateArray = async (
  list,
  targetLang = "th",
  sourceLang = "en"
) => {
  if (!Array.isArray(list)) return [];

  const result = [];

  for (const item of list) {
    result.push(
      await translateText(item, targetLang, sourceLang)
    );
  }

  return result;
};