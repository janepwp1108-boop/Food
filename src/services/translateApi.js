import axios from "axios";

const MAX_CHARS = 450;

// เก็บข้อความที่แปลแล้ว
const cache = new Map();

// รอเวลา
const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const translateChunk = async (
  text,
  targetLang = "th",
  retry = 2
) => {
  if (!text || text.trim() === "") return text;

  const key = `${targetLang}:${text}`;

  // เคยแปลแล้ว
  if (cache.has(key)) {
    return cache.get(key);
  }

  try {
    const response = await axios.get(
      "https://api.mymemory.translated.net/get",
      {
        params: {
          q: text,
          langpair: `en|${targetLang}`,
        },
        timeout: 10000,
      }
    );

    const translated =
      response.data?.responseData?.translatedText || text;

    cache.set(key, translated);

    return translated;
  } catch (error) {
    console.log("Translate Error:", error.message);

    if (retry > 0) {
      await sleep(600);
      return translateChunk(text, targetLang, retry - 1);
    }

    return text;
  }
};

// -----------------------------

export const translateText = async (
  text,
  targetLang = "th"
) => {
  if (!text || text.trim() === "") return text;

  // ถ้าเป็นข้อความสั้น
  if (text.length <= MAX_CHARS) {
    return await translateChunk(text, targetLang);
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
      await translateChunk(chunk, targetLang)
    );
  }

  return translated.join(" ");
};

// -----------------------------
// แปลทีละรายการ เช่น ส่วนผสม
// -----------------------------
export const translateArray = async (
  list,
  targetLang = "th"
) => {
  if (!Array.isArray(list)) return [];

  const result = [];

  for (const item of list) {
    result.push(
      await translateText(item, targetLang)
    );
  }

  return result;
};