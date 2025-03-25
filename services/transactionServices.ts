import { db } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/types";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { createOrUpdateWalletData } from "./walletService";
import { getLast7Days } from "@/utils/common";
import { scale } from "@/utils/styling";
import { colors } from "@/constants/theme";

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
          walletId
        );
        if (!res.success) return res;
      }
    } else {
      // update wallet for new transaction
      const res = await updateWalletForNewTransaction(
        walletId!,
        Number(amount!),
        type
        // image
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
  type: string
  // image: string | null
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
      // image,
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
  newWalletId: string
  // image: null | string
) => {
  try {
    // 1 WORK WITH OLD WALLET
    // get old wallet
    const originalWalletSnapshot = await getDoc(
      doc(db, "wallets", oldTransaction.walletId)
    );
    const originalWallet = originalWalletSnapshot.data() as WalletType;

    let newWalletSnapshot = await getDoc(doc(db, "wallets", newWalletId));
    let newWallet = newWalletSnapshot.data() as WalletType;

    const revertType =
      oldTransaction.type === "income" ? "totalIncome" : "totalExpenses";

    const revertIncomeExpense: number =
      oldTransaction.type === "income"
        ? -Number(oldTransaction.amount)
        : Number(oldTransaction.amount);

    const revertedWalletAmount =
      Number(originalWallet.amount) + revertIncomeExpense;

    const revertIncomeExpenseAmount = Math.max(
      Number(originalWallet[revertType]) - Number(oldTransaction.amount),
      0
    );

    if (newTransactionType === "expense") {
      if (
        oldTransaction.walletId === newWalletId &&
        revertedWalletAmount < newTransactionAmount
      ) {
        return {
          success: false,
          msg: "The selected wallets don't have enough balance!",
        };
      }
      if ((newWallet.amount ?? 0) < newTransactionAmount) {
        return {
          success: false,
          msg: "The selected wallets don't have enough balance",
        };
      }
    }

    await createOrUpdateWalletData({
      id: oldTransaction.walletId,
      amount: revertedWalletAmount,
      [revertType]: revertIncomeExpenseAmount,
      // image,
    });

    // 2 WORK WITH NEW WALLET
    // refetch the newallet becouse we may have just update it

    const newUpdateWalletSnapshot = await getDoc(
      doc(db, "wallets", newWalletId)
    );
    const newUpdatedWallet = newUpdateWalletSnapshot.data() as WalletType;

    const updateType =
      newTransactionType === "income" ? "totalIncome" : "totalExpenses";

    const updateTransactionAmount =
      newTransactionType === "income"
        ? Number(newTransactionAmount)
        : -Number(newTransactionAmount);

    const newWalletAmount =
      Number(newUpdatedWallet.amount ?? 0) + updateTransactionAmount;

    const newIncomeExpenseAmount = Math.max(
      Number(newUpdatedWallet[updateType]) + Number(newTransactionAmount),
      0
    );

    await createOrUpdateWalletData({
      id: newWalletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount,
      // image,
    });

    return { success: true };
  } catch (error: any) {
    console.log(`Error in revertAndUpdateWallets: `, error);
    return { success: false, msg: error.message };
  }
};

export const deleteTransactionData = async (
  transactionId: string,
  walletId: string
): Promise<ResponseType> => {
  try {
    const transactionRef = doc(db, "transactions", transactionId);
    const transactionSnapshot = await getDoc(transactionRef);
    if (!transactionSnapshot.exists()) {
      return { success: false, msg: "Transaction not found" };
    }
    const transactionData = transactionSnapshot.data() as TransactionType;

    const transactionType = transactionData?.type;
    const transactionAmount = transactionData?.amount;

    // fetch wallet to update amount, totalIncome or totalExpenses
    const walletSnapshot = await getDoc(doc(db, "wallets", walletId));
    const walletData = walletSnapshot.data() as WalletType;

    // check field to be updated based on transaction type
    const updateType =
      transactionType === "income" ? "totalIncome" : "totalExpenses";

    const newWalletAmount =
      walletData?.amount! -
      (transactionType === "income" ? transactionAmount : -transactionAmount);

    const newIncomeExpenseAmount = walletData[updateType]! - transactionAmount;

    if (transactionType == "income" && newWalletAmount < 0) {
      return {
        success: false,
        msg: `You cannot delete this transaction because it would result in a negative wallet balance.`,
      };
    }
    await createOrUpdateWalletData({
      id: walletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount,
    });

    await deleteDoc(transactionRef);
    return { success: true, msg: "Wallet deleted successfully" };
  } catch (error: any) {
    console.log(`Error in deleteWalletData: `, error);
    return { success: false, msg: error.message };
  }
};

export const fetchWeeklyChartData = async (
  uid: string
): Promise<ResponseType> => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const transactionQuery = query(
      collection(db, "transactions"),
      where("date", ">=", Timestamp.fromDate(sevenDaysAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      orderBy("date", "desc"),
      where("uid", "==", uid)
    );
    const querySnapshot = await getDocs(transactionQuery);
    const weeklyData = getLast7Days();
    const transactions: TransactionType[] = [];
    // mapping each transaction in day
    querySnapshot.forEach(doc => {
      const transaction = doc.data() as TransactionType;
      transactions.push(transaction);

      const transactionDate = (transaction.date as Timestamp)
        .toDate()
        .toISOString()
        .split("T")[0]; // as specific date

      const dayData = weeklyData.find(day => day.date === transactionDate);

      if (dayData) {
        if (transaction.type === "income") {
          dayData.income = transaction.amount;
        } else if (transaction.type == "expense") {
          dayData.expense = transaction.amount;
        }
      }
    });

    // take each day and create two entries in an array
    const stats = weeklyData.flatMap(day => [
      {
        value: day.income,
        label: day.day,
        spacing: scale(4),
        labelWidth: scale(30),
        frontColor: colors.green,
      },
      { value: day.expense, frontColor: colors.rose },
    ]);

    return { success: true, data: { stats, transactions } };
  } catch (error: any) {
    console.log(`Error in fetchWeeklyChartData: `, error);
    return { success: false, msg: error.message };
  }
};
