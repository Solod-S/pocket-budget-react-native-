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
import { createOrUpdateWalletData } from "./walletService";

export const createOrUpdateTransactionData = async (
  transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
  try {
    const { id, type, walletId, amount, image } = transactionData;

    if (!amount || amount <= 0 || !walletId || !type) {
      return { success: false, msg: "Invalid transaction data" };
    }

    if (id) {
      const oldTransactionSnapshot = await getDoc(doc(db, "transactions", id));
      const oldTransaction = oldTransactionSnapshot.data() as TransactionType;
      const shouldRevertOriginal =
        oldTransaction?.type != type ||
        oldTransaction?.amount != amount ||
        oldTransaction?.walletId != walletId;
      if (shouldRevertOriginal) {
        let res = await revertAndUpdateWallets(
          oldTransaction,
          Number(amount),
          type,
          walletId,
          image
        );
        if (!res.success) return res;
      }
    } else {
      // update wallet for new transaction
      const res = await updateWalletForNewTransaction(
        walletId!,
        Number(amount!),
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
const revertAndUpdateWallets = async (
  oldTransaction: TransactionType,
  newTransactionAmount: number,
  newTransactionType: string,
  newWalletId: string,
  image: null | string
) => {
  try {
    // 1 WORK WITH OLD WALLET
    // get old wallet
    const originalWalletRef = doc(db, "wallets", oldTransaction?.walletId);
    const originalWalletSnapshot = await getDoc(originalWalletRef);
    const originalWallet = originalWalletSnapshot.data() as WalletType;

    // get new wallet
    const newWalletRef = doc(db, "wallets", newWalletId);
    const newWalletSnapshot = await getDoc(newWalletRef);
    let newWallet = newWalletSnapshot.data() as WalletType;

    const revertType =
      oldTransaction?.type === "income" ? "totalIncome" : "totalExpenses";

    const revertIncomeExpense: number =
      oldTransaction.type === "income"
        ? -Number(oldTransaction?.amount)
        : Number(oldTransaction?.amount);

    const revertedWalletAmount =
      Number(originalWallet?.amount) + revertIncomeExpense;
    //wallet amount, after the transaction is removed
    const revertIncomeExpenseAmount =
      Number(originalWallet[revertType]) - Number(oldTransaction?.amount);

    if (newTransactionType === "expense") {
      // if user tries to convert income to expense on the same wallet
      // or if the user tries to increase the expense amount and don't have enough balance
      if (
        oldTransaction?.walletId === newWalletId &&
        revertedWalletAmount < newTransactionAmount
      ) {
        return {
          success: false,
          msg: "The selected wallets don't have enough balance!",
        };
      }

      // if user tries to add expense from a new wallet but the don't have enough balance
      if (newWallet.amount! < newTransactionAmount)
        return {
          success: false,
          msg: "The selected wallets don't have enough balance",
        };
    }

    await createOrUpdateWalletData({
      id: oldTransaction.walletId,
      amount: revertedWalletAmount,
      [revertType]: revertIncomeExpenseAmount,
      image,
    });

    // updateWalletForNewTransaction

    // 2 WORK WITH NEW WALLET

    // refetch the newallet becouse we may have just update it

    const updatedWalletSnapshot = await getDoc(doc(db, "wallets", newWalletId));
    newWallet = updatedWalletSnapshot.data() as WalletType;

    const updateType =
      newTransactionType === "income" ? "totalIncome" : "totalExpenses";

    const updateTransactionAmount: number =
      newTransactionType === "income"
        ? Number(newTransactionAmount)
        : -Number(newTransactionAmount);
    console.log(`updateTransactionAmount`, updateTransactionAmount);
    const newWalletAmount = Number(newWallet?.amount) + updateTransactionAmount;

    const newIncomeExpenseAmount =
      Number(newWallet[updateType]) + Number(updateTransactionAmount);

    await createOrUpdateWalletData({
      id: newWalletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount,
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
