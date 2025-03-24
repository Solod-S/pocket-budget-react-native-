import { auth, db } from "@/config/firebase";
import { ResponseType, UserDataType, WalletType } from "@/types";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

export const createOrUpdateWalletData = async (
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  try {
    if (!walletData?.id) {
      walletData.amount = 0;
      walletData.totalIncome = 0;
      walletData.totalExpenses = 0;
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
    deleteTransactionByWalletId(walletId);
    return { success: true, msg: "Wallet deleted successfully" };
  } catch (error: any) {
    console.log(`Error in deleteWalletData: `, error);
    return { success: false, msg: error?.message };
  }
};

export const deleteTransactionByWalletId = async (
  walletId: string
): Promise<ResponseType> => {
  try {
    let hasMoreTransaction = true;
    while (hasMoreTransaction) {
      const transactionQuery = query(
        collection(db, "transactions"),
        where("walletId", "==", walletId),
        where("uid", "==", auth.currentUser?.uid)
      );

      const transactionSnapshot = await getDocs(transactionQuery);
      if (transactionSnapshot.size === 0) {
        hasMoreTransaction = false;
        break;
      }

      const batch = writeBatch(db);
      transactionSnapshot.forEach(transactionDoc => {
        batch.delete(transactionDoc.ref);
      });

      await batch.commit();
      console.log(
        `${transactionSnapshot.size} transaction deleted in this batch`
      );
    }
    return { success: true, msg: "All transaction deleted successfully" };
  } catch (error: any) {
    console.log(`Error in deleteTransactionByWalletId: `, error);
    return { success: false, msg: error?.message };
  }
};
