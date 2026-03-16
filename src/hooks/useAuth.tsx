import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from "firebase/auth";

import { auth } from "@/firebase";
import { db } from "@/firebase";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "firebase/firestore";

interface SignUpData {
  name: string;
  age: number;
  phone: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;

  signUp: (data: SignUpData) => Promise<{ error: any; user?: User | null }>;
  signUpAdmin: (data: SignUpData) => Promise<{ error: any; user?: User | null }>;

  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInAdmin: (email: string, password: string) => Promise<{ error: any }>;

  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ================= USER SIGNUP =================

  const signUp = async ({ name, age, phone, email, password }: SignUpData) => {
    try {

      const result = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(result.user, {
        displayName: name
      });

      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        displayName: name,
        email,
        age,
        phone,
        role: "user",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return { error: null, user: result.user };

    } catch (error) {
      return { error };
    }
  };

  // ================= ADMIN SIGNUP =================

  const signUpAdmin = async ({ name, age, phone, email, password }: SignUpData) => {
    try {

      const result = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(result.user, {
        displayName: name
      });

      await setDoc(doc(db, "admins", result.user.uid), {
        uid: result.user.uid,
        Name: name,
        email,
        age,
        phone,
        role: "admin",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return { error: null, user: result.user };

    } catch (error) {
      return { error };
    }
  };

  // ================= USER LOGIN =================

  const signIn = async (email: string, password: string) => {
    try {

      const result = await signInWithEmailAndPassword(auth, email, password);

      const userDoc = await getDoc(doc(db, "users", result.user.uid));

      if (!userDoc.exists()) {
        return { error: { message: "User account not found" } };
      }

      return { error: null };

    } catch (error) {
      return { error };
    }
  };

  // ================= ADMIN LOGIN =================

  const signInAdmin = async (email: string, password: string) => {
    try {

      const result = await signInWithEmailAndPassword(auth, email, password);

      const adminDoc = await getDoc(doc(db, "admins", result.user.uid));

      if (!adminDoc.exists()) {
        return { error: { message: "You are not an admin" } };
      }

      return { error: null };

    } catch (error) {
      return { error };
    }
  };

  // ================= LOGOUT =================

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signUpAdmin,
        signIn,
        signInAdmin,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}