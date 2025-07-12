import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import app from './firebase';

const db = getFirestore(app);

export const getGrowthHubPosts = async () => {
  const snapshot = await getDocs(collection(db, "growthHubPosts"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addGrowthHubPost = async (post) => {
  return addDoc(collection(db, "growthHubPosts"), post);
};
