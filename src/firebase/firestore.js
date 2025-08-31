import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from './firebase';

export const getGrowthHubPosts = async () => {
  const snapshot = await getDocs(collection(db, "growthHubPosts"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addGrowthHubPost = async (post) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  return addDoc(collection(db, "growthHubPosts"), {
    ...post,
    authorId: user.uid,
    authorName: user.displayName || user.email.split('@')[0],
    timestamp: serverTimestamp(),
    upvotes: 0,
    comments: 0,
  });
};
