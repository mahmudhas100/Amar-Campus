import React, { useState } from 'react';
import { db } from '../../firebase/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import { containsForbiddenKeywords } from '../../utils/contentModeration';

const CommentForm = ({ postId, parentId = null, parentAuthor = '', onCommentAdded }) => {
  const { user } = useAuth();
  const [content, setContent] = useState(parentId ? `@${parentAuthor} ` : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    if (containsForbiddenKeywords(content)) {
      setError('Your comment contains words that are not allowed. Please revise your comment.');
      return;
    }

    setLoading(true);
    setError('');
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
      setError('Failed to post comment. Please try again.');
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
        className="w-full p-3 bg-background-primary text-text-primary placeholder-text-secondary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
        rows="3"
      ></textarea>
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      <div className="flex justify-end mt-2">
        <Button type="submit" disabled={loading || !content.trim()}>
          {loading ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
