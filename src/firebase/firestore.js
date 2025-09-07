import { 
  collection, 
  getDocs, 
  addDoc, 
  serverTimestamp,
  doc,
  getDoc,
  writeBatch,
  arrayUnion,
  arrayRemove,
  increment,
  deleteField
} from "firebase/firestore";
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
    goingCount: 0,
    interestedCount: 0,
    attendees: {
      going: [],
      interested: []
    },
    userAttendance: {} // track individual user attendance status
  });
};

// Function to update user's attendance status
export const updateEventAttendance = async (postId, newStatus, previousStatus = null) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const postRef = doc(db, "growthHubPosts", postId);
  const postDoc = await getDoc(postRef);
  
  if (!postDoc.exists()) {
    throw new Error("Post not found");
  }

  const batch = writeBatch(db);
  const data = postDoc.data();
  const currentUserStatus = data.userAttendance?.[user.uid];

  // If clicking the same status again, remove the status
  if (currentUserStatus === newStatus) {
    // Remove attendance
    batch.update(postRef, {
      [`userAttendance.${user.uid}`]: deleteField(),
      [`${newStatus}Count`]: increment(-1),
      [`attendees.${newStatus}`]: arrayRemove(user.uid)
    });
  } else {
    // Update to new status
    const updates = {
      [`userAttendance.${user.uid}`]: newStatus,
      [`${newStatus}Count`]: increment(1),
      [`attendees.${newStatus}`]: arrayUnion(user.uid)
    };

    // If user had a previous status, remove it
    if (currentUserStatus) {
      updates[`${currentUserStatus}Count`] = increment(-1);
      updates[`attendees.${currentUserStatus}`] = arrayRemove(user.uid);
    }

    batch.update(postRef, updates);
  }

  await batch.commit();
};

// Function to get user's attendance status for a post
export const getUserAttendanceStatus = async (postId) => {
  const user = auth.currentUser;
  if (!user) return null;

  const attendanceRef = doc(db, `users/${user.uid}/attendance/${postId}`);
  const attendanceDoc = await getDoc(attendanceRef);

  return attendanceDoc.exists() ? attendanceDoc.data().status : null;
};
