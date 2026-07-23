import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import * as FileSystem from "expo-file-system";

// โฟลเดอร์เก็บรูปที่แคชไว้ในเครื่อง
const CACHE_DIR = `${FileSystem.cacheDirectory}meal-images/`;

// แปล URL รูปให้เป็นชื่อไฟล์ที่ปลอดภัย (ตัดอักขระแปลก ๆ ออก)
const uriToFilename = (uri) => {
  const cleaned = uri.split("?")[0];
  const name = cleaned.split("/").pop() || "image";
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
};

const ensureCacheDir = async () => {
  const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
  }
};

/**
 * CachedImage
 * ใช้แทน <Image source={{ uri }} /> ปกติได้เลย
 * - ถ้ามีเน็ต: โหลดรูปแล้วเก็บสำเนาไว้ในเครื่อง จากนั้นแสดงจากไฟล์ที่แคชไว้
 * - ถ้าไม่มีเน็ตแต่เคยโหลดรูปนี้มาก่อนแล้ว: แสดงจากไฟล์ที่แคชไว้ทันที (ออฟไลน์ได้)
 * - ถ้าไม่มีเน็ตและไม่เคยแคชไว้: จะแสดงรูปว่าง (ไม่ crash)
 */
export default function CachedImage({ source, style, ...props }) {
  const [localUri, setLocalUri] = useState(null);
  const remoteUri = source?.uri;

  useEffect(() => {
    let isActive = true;

    const loadImage = async () => {
      if (!remoteUri) return;

      try {
        await ensureCacheDir();
        const filePath = CACHE_DIR + uriToFilename(remoteUri);
        const fileInfo = await FileSystem.getInfoAsync(filePath);

        if (fileInfo.exists) {
          // มีไฟล์แคชอยู่แล้ว ใช้จากเครื่องได้เลย (เร็วกว่า และใช้ได้แม้ไม่มีเน็ต)
          if (isActive) setLocalUri(filePath);
          return;
        }

        // ยังไม่เคยแคช ลองโหลดจากเน็ตแล้วเก็บลงเครื่อง
        const result = await FileSystem.downloadAsync(remoteUri, filePath);
        if (isActive) setLocalUri(result.uri);
      } catch (error) {
        // โหลด/แคชไม่สำเร็จ (เช่น ไม่มีเน็ตและไม่เคยแคชไว้) ให้ fallback ไปใช้ remote uri ตรง ๆ
        console.log("CachedImage error:", error.message || error);
        if (isActive) setLocalUri(null);
      }
    };

    loadImage();

    return () => {
      isActive = false;
    };
  }, [remoteUri]);

  return (
    <Image
      source={localUri ? { uri: localUri } : source}
      style={style}
      {...props}
    />
  );
}