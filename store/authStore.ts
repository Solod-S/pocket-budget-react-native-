import { makeAutoObservable, runInAction } from "mobx";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { UserType } from "@/types";
// import Toast from "react-native-toast-message";

class AuthStore {
  user: UserType | null = null;
  isAuthenticated: boolean | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
    this.initAuthListener();
  }

  // Wrap this in an action to avoid strict mode issues
  setUser(user: UserType) {
    this.user = user;
  }

  setIsAuthenticated(isAuthenticated: boolean) {
    this.isAuthenticated = isAuthenticated;
  }

  async updateUserData(id: string) {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      runInAction(() => {
        this.user = {
          ...this.user,
          email: data.email,
          name: data.name,
          uid: data.uid,
        };
      });
    }
  }

  // Use action for state updates inside async methods
  async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; data?: FirebaseUser; message?: string }> {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const { user } = response;
      runInAction(() => {
        this.user = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || null,
          image: user.photoURL || null,
        };
        this.isAuthenticated = true;
      });
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
  }

  // Use action for state updates inside async methods
  async logout() {
    try {
      await signOut(auth);
      runInAction(() => {
        this.user = null;
        this.isAuthenticated = false;
      });
    } catch (error) {
      runInAction(() => {
        this.user = null;
        this.isAuthenticated = false;
      });
      console.log("Error logout:", error);
    }
  }

  // Use action for state updates inside async methods
  async register(email: string, password: string, name: string) {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user } = response;
      // await sendEmailVerification(user);
      await setDoc(doc(db, "users", user.uid), {
        email,
        name,
        uid: user.uid,
        lastGeneratedAt: null,
      });

      // Toast.show({
      //   type: "success",
      //   position: "top",
      //   text1: "Success",
      //   text2: "Account activation email sent",
      //   visibilityTime: 5000,
      //   autoHide: true,
      //   topOffset: 50,
      // });
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
  }

  // Use action for state updates inside async methods
  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      // Toast.show({
      //   type: "success",
      //   position: "top",
      //   text1: "Success",
      //   text2: "Password reset email sent",
      //   visibilityTime: 2000,
      //   autoHide: true,
      //   topOffset: 50,
      // });
      return { success: true };
    } catch (error: any) {
      console.log("Error in resetPassword:", error);
      // Toast.show({
      //   type: "error",
      //   position: "top",
      //   text1: "Failed",
      //   text2: error.message,
      //   visibilityTime: 2000,
      //   autoHide: true,
      //   topOffset: 50,
      // });
    }
  }

  initAuthListener(): () => void {
    this.isAuthenticated = undefined;
    const unsubscribe = onAuthStateChanged(auth, async user => {
      try {
        runInAction(() => {
          if (user) {
            this.user = {
              uid: user.uid,
              email: user.email,
              name: user.displayName || null,
              image: user.photoURL || null,
            };
            this.isAuthenticated = true;

            if (typeof this.updateUserData === "function") {
              this.updateUserData(user?.uid);
            }
          } else {
            this.user = null;
            this.isAuthenticated = false;
          }
        });
      } catch (error) {
        console.error("Error in auth state listener:", error);
        this.user = null;
        this.isAuthenticated = false;
      }
    });

    return unsubscribe;
  }
}

const authStore = new AuthStore();
export default authStore;
