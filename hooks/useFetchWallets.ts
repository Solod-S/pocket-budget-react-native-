import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "@/config/firebase";

export const useFetchWallets = <T>(
  collectionName: string,
  constaints: QueryConstraint[] = []
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!collectionName) return;
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...constaints);
    const unSub = onSnapshot(
      q,
      snapshot => {
        const fetchedData = snapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() };
        }) as T[];

        setData(fetchedData);
        setLoading(false);
      },
      err => {
        console.log("Error fetching data", err), setError(err.message);
      }
    );
    return () => unSub();
  }, []);
  return { data, loading, error };
};
