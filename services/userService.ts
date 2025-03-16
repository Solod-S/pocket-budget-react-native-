import { auth, db } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

export const updateUser = async (
  uid: string,
  updateData: UserDataType
): Promise<ResponseType> => {
  try {
    // Updating data in Firestore
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, updateData);

    // Update name in Firebase Authentication
    const user = auth.currentUser;
    if (user) {
      await updateProfile(user, {
        displayName: updateData.name,
        photoURL: updateData?.image || updateData.image,
      });
    }
    return { success: true, msg: "Updated successfully" };
  } catch (error: any) {
    console.log(`Error in updateUser: `, error);
    return { success: false, msg: error?.message };
  }
};
