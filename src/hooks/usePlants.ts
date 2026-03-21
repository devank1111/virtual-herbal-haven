import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  hindiName: string;
  description: string;
  image: string;
  category: string[];
}

export function usePlants() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "plants"));
        const plantsData: Plant[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Plant[];
        setPlants(plantsData);
      } catch (err) {
        setError("Plants fetch karne mein error aaya");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  return { plants, loading, error };
}