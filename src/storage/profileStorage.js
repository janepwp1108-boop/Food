import AsyncStorage from
"@react-native-async-storage/async-storage";



const PROFILE_KEY = "user_profile";








// Profile ค่าเริ่มต้น

const DEFAULT_PROFILE = {

  username:"Guest",

  email:"",

  avatar:null,

  joinedDate:null,

  preferences:{

    darkMode:false,

    notifications:true

  }

};








// ดึงข้อมูล Profile

export async function getProfile(){


  try{


    const data =

      await AsyncStorage.getItem(

        PROFILE_KEY

      );




    if(data){


      return JSON.parse(data);


    }





    return DEFAULT_PROFILE;



  }catch(error){



    console.log(

      "Get Profile Error:",

      error

    );



    return DEFAULT_PROFILE;


  }


}








// บันทึก Profile

export async function saveProfile(profile){


  try{


    await AsyncStorage.setItem(

      PROFILE_KEY,

      JSON.stringify(profile)

    );



    return profile;



  }catch(error){



    console.log(

      "Save Profile Error:",

      error

    );



    return null;


  }


}








// แก้ไขข้อมูลบางส่วน

export async function updateProfile(data){


  try{


    const currentProfile =

      await getProfile();





    const updatedProfile = {


      ...currentProfile,


      ...data


    };





    await saveProfile(

      updatedProfile

    );





    return updatedProfile;



  }catch(error){



    console.log(

      "Update Profile Error:",

      error

    );



    return null;


  }


}








// ล้างข้อมูล Profile

export async function clearProfile(){


  try{


    await AsyncStorage.removeItem(

      PROFILE_KEY

    );



    return DEFAULT_PROFILE;



  }catch(error){



    console.log(

      "Clear Profile Error:",

      error

    );


  }


}