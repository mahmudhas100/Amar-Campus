import React, { useState } from 'react';
import { db } from '../../firebase/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';

const CommentForm = ({ postId, parentId = null, parentAuthor = '', onCommentAdded }) => {
  const { user } = useAuth();
  const [content, setContent] = useState(parentId ? `@${parentAuthor} ` : '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setLoading(true);
    try {
      let commentsCollectionRef;
      if (parentId) {
        commentsCollectionRef = collection(db, 'growthHubPosts', postId, 'comments', parentId, 'replies');
      } else {
        commentsCollectionRef = collection(db, 'growthHubPosts', postId, 'comments');
      }
      console.log("Attempting to add comment/reply at path:", commentsCollectionRef.path, "with postId:", postId, "and parentId:", parentId);
      await addDoc(commentsCollectionRef, {
        authorName: (user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` : user.displayName || user.email.split('@')[0],
        authorId: user.uid,
        content,
        timestamp: serverTimestamp(),
        upvotes: 0,
      });
      setContent(parentId ? `@${parentAuthor} ` : '');
      if (onCommentAdded) {
        onCommentAdded();
      }

      // Only increment comment count on the main post if it's a top-level comment
      if (!parentId) {
        const postRef = doc(db, 'growthHubPosts', postId);
        await updateDoc(postRef, {
          comments: increment(1)
        });
      }

    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className="w-full p-2 border rounded-lg"
        rows="3"
      ></textarea>
      <div className="flex justify-end mt-2">
        <Button type="submit" disabled={loading || !content.trim()}>
          {loading ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
