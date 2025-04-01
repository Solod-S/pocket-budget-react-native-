import { create } from "zustand";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  User as FirebaseUser,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { UserType } from "@/types";
import { delay } from "@/utils/delay";

interface AuthState {
  user: UserType | null;
  isAuthenticated: boolean | undefined;
  setUser: (user: UserType | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  updateUserData: (id: string) => Promise<void>;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; data?: FirebaseUser; message?: string }>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    language: string
  ) => Promise<{ success: boolean; data?: FirebaseUser; message?: string }>;
  resetPassword: (
    email: string
  ) => Promise<{ success: boolean; message?: string }>;
  initAuthListener: () => () => void;
}

const useAuthStore = create<AuthState>(set => ({
  user: null,
  isAuthenticated: undefined,

  setUser: user => set({ user }),
  setIsAuthenticated: isAuthenticated => set({ isAuthenticated }),

  updateUserData: async id => {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      set({
        user: {
          email: data.email,
          name: data.name,
          uid: data.uid,
          image: data.image,
          language: data?.language || "en",
          currency: data?.currency || "$",
        },
        isAuthenticated: true,
      });
    }
  },

  login: async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const { user } = response;
      return { success: true, data: user };
    } catch (error: any) {
      console.error("Error login:", error);
      let msg = error.message || "An error occurred";
      if (msg.includes("invalid-email")) msg = "Invalid email";
      if (msg.includes("auth/invalid-credential"))
        msg = "Invalid email or password";
      return {
        success: false,
        message: msg.replace(/Firebase.*auth\//, "").replace(/-/g, " "),
      };
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error("Error logout:", error);
      set({ user: null, isAuthenticated: false });
    }
  },

  register: async (email, password, name, language) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user } = response;

      await updateProfile(user, {
        displayName: name,
      });

      await setDoc(doc(db, "users", user.uid), {
        email,
        name,
        uid: user.uid,
        language: language || "en",
        currency: "$",
        lastGeneratedAt: null,
      });
      return { success: true, data: user };
    } catch (error: any) {
      console.log("Error register:", error);
      let msg = error.message;
      if (msg.includes("invalid-email")) msg = "Invalid email";
      if (msg.includes("email-already-in-use")) msg = "Email already in use";
      return {
        success: false,
        message: msg
          .replace("FirebaseError: ", "")
          .replace("Firebase: ", "")
          .replace("auth/", "")
          .replace(/-/g, " "),
      };
    }
  },

  resetPassword: async email => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      console.log("Error in resetPassword:", error);
      let msg = error.message;
      if (msg.includes("invalid-email")) msg = "Invalid email";
      return {
        success: false,
        message: msg
          .replace("FirebaseError: ", "")
          .replace("Firebase: ", "")
          .replace("auth/", "")
          .replace(/-/g, " "),
      };
    }
  },
  initAuthListener: () => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        await delay();
        await useAuthStore.getState().updateUserData(user.uid);
      } else {
        set({ user: null, isAuthenticated: false });
      }
    });
    return unsubscribe;
  },
}));

export default useAuthStore;
