import { db } from "@/config/firebase";
import { ResponseType, UserDataType, WalletType } from "@/types";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";

export const createOrUpdateWalletData = async (
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  try {
    if (!walletData?.id) {
      walletData.amount = 0;
      walletData.totalIncome = 0;
      walletData.created = new Date();
    }

    // Add/update data to Firestore
    const walletRef = walletData?.id
      ? doc(db, "wallets", walletData?.id)
      : doc(collection(db, "wallets"));

    await setDoc(walletRef, walletData, { merge: true });

    return { success: true, data: { ...walletData, id: walletRef.id } };
  } catch (error: any) {
    console.log(`Error in updateUser: `, error);
    return { success: false, msg: error?.message };
  }
};
