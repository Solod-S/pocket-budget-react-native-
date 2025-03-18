import { db } from "@/config/firebase";
import { ResponseType, UserDataType, WalletType } from "@/types";
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export const createOrUpdateWalletData = async (
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  try {
    if (!walletData?.id) {
      walletData.amount = 0;
      walletData.totalIncome = 0;
      walletData.created = new Date();
    }
    if (!("image" in walletData) || !walletData.image) {
      walletData.image = null;
    }

    // Add/update data to Firestore
    const walletRef = walletData?.id
      ? doc(db, "wallets", walletData?.id)
      : doc(collection(db, "wallets"));

    await setDoc(walletRef, walletData, { merge: true });

    return { success: true, data: { ...walletData, id: walletRef.id } };
  } catch (error: any) {
    console.log(`Error in createOrUpdateWalletData: `, error);
    return { success: false, msg: error?.message };
  }
};

export const deleteWalletData = async (
  walletId: string
): Promise<ResponseType> => {
  try {
    const walletRef = doc(db, "wallets", walletId);
    await deleteDoc(walletRef);
    // todo delete all transaction related to this wallet
    return { success: true, msg: "Wallet deleted successfully" };
  } catch (error: any) {
    console.log(`Error in deleteWalletData: `, error);
    return { success: false, msg: error?.message };
  }
};
