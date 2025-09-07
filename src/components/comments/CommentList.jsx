import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import Comment from './Comment';
import Spinner from '../common/Spinner';

const CommentList = ({ postId, parentId = null }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let commentsCollectionRef;
    if (parentId) {
      commentsCollectionRef = collection(db, 'growthHubPosts', postId, 'comments', parentId, 'replies');
    } else {
      commentsCollectionRef = collection(db, 'growthHubPosts', postId, 'comments');
    }
    
    const q = query(commentsCollectionRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      console.log("Comments data received in CommentList:", commentsData);
      setComments(commentsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [postId, parentId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={`mt-6 ${parentId ? 'pl-8' : ''}`}>
      {comments.length === 0 ? (
        <p className="text-slate-500">No comments yet.</p>
      ) : (
        comments.map(comment => <Comment key={comment.id} comment={comment} postId={postId} parentId={parentId} />)
      )}
    </div>
  );
};

export default CommentList;
