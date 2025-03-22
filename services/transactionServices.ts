import { db } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/types";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export const createOrUpdateTransactionData = async (
  transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
  try {
    const { id, type, walletId, amount, image } = transactionData;
    if (!amount || amount <= 0 || !walletId || !type) {
      return { success: false, msg: "Invalid transaction data" };
    }
    if (id) {
      // todo update existing transaction
    } else {
      // update wallet for new transaction
      const res = await updateWalletForNewTransaction(
        walletId!,
        Number(amount)!,
        type,
        image
      );
      if (!res.success) return res;
    }

    const transactionRef = id
      ? doc(db, "transactions", id)
      : doc(collection(db, "transactions"));
    await setDoc(transactionRef, transactionData, { merge: true });
    return {
      success: true,
      data: { ...transactionData, id: transactionRef.id },
    };
  } catch (error: any) {
    console.log(`Error in createOrUpdateTransactionData: `, error);
    return { success: false, msg: error?.message };
  }
};

const updateWalletForNewTransaction = async (
  walletId: string,
  amount: number,
  type: string,
  image: string | null
) => {
  try {
    const walletRef = doc(db, "wallets", walletId);
    const walletSnapshot = await getDoc(walletRef);

    if (!walletSnapshot.exists()) {
      console.log(`Error in updating wallet for new transaction: `);
      return { success: false, msg: "Wallet not found" };
    }

    const walletData = walletSnapshot.data() as WalletType;

    // Check if there are enough funds for the expenditure
    if (type === "expense" && walletData.amount! - amount < 0) {
      return {
        success: false,
        msg: "Selected wallet doesn't have enough balance",
      };
    }

    // 1 Wallet amount updates
    const updateType = type === "income" ? "totalIncome" : "totalExpenses";
    const updatedWalletAmount =
      type === "income"
        ? Number(walletData.amount) + amount
        : Number(walletData.amount) - amount;

    // 2 Wallet totals updates
    const updatedTotals =
      type === "income"
        ? Number(walletData.totalIncome) + amount
        : Number(walletData.totalExpenses) + amount;

    // updating process
    await updateDoc(walletRef, {
      amount: updatedWalletAmount,
      [updateType]: updatedTotals,
      image,
    });
    return { success: true };
  } catch (error: any) {
    console.log(`Error in updateWalletForNewTransaction: `, error);
    return { success: false, msg: error?.message };
  }
};

export const deleteTransactionData = async (
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
