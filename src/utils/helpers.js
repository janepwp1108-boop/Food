


// ตรวจสอบข้อมูลว่าง

export function isEmpty(value){


  if(value === null){

    return true;

  }



  if(value === undefined){

    return true;

  }



  if(
    typeof value === "string" &&
    value.trim() === ""
  ){

    return true;

  }



  if(
    Array.isArray(value) &&
    value.length === 0
  ){

    return true;

  }



  return false;


}









// ตัดข้อความยาว

export function truncateText(

  text,

  maxLength = 50

){


  if(!text){

    return "";

  }




  if(text.length <= maxLength){

    return text;

  }




  return (

    text.substring(
      0,
      maxLength
    )

    + "..."

  );


}









// หน่วงเวลา

export function delay(ms){


  return new Promise(

    resolve =>

    setTimeout(
      resolve,
      ms
    )

  );


}









// สุ่ม Array

export function shuffleArray(array){


  if(!Array.isArray(array)){

    return [];

  }



  return [

    ...array

  ].sort(

    () =>

    Math.random() - 0.5

  );


}









// แปลงตัวอักษรตัวแรกเป็นตัวใหญ่

export function capitalize(text){


  if(!text){

    return "";

  }



  return (

    text.charAt(0)
    .toUpperCase()

    +

    text.slice(1)

  );


}









// แปลงชื่ออาหารให้อ่านง่าย

export function formatMealName(name){


  if(!name){

    return "";

  }



  return name
    .trim()
    .replace(
      /\s+/g,
      " "
    );


}









// สร้าง ID เวลาเก็บข้อมูล

export function generateId(){


  return (

    Date.now()
    .toString()

    +

    Math.random()
    .toString(36)
    .substring(2)

  );


}









// ตรวจสอบ URL รูปภาพ

export function isValidImage(url){


  if(!url){

    return false;

  }



  return (

    url.startsWith(
      "http"
    )

  );


}