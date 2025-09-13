import React, { useState, useEffect, useRef } from 'react';
import formatTimestamp from '../../utils/formatTimestamp';
import { HiOutlineThumbUp, HiThumbUp, HiOutlineReply, HiOutlineTrash, HiOutlineDotsVertical } from 'react-icons/hi';
import { db } from '../../firebase/firebase';
import { doc, updateDoc, increment, deleteDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

const Comment = ({ comment, postId, parentId = null }) => {
  console.log("Comment component received:", { comment, postId, parentId });
  const { user } = useAuth();
  const { id, authorName = 'User', content, timestamp, upvotes = 0, authorId } = comment;
  const [localUpvotes, setLocalUpvotes] = useState(upvotes);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const avatarUrl = `https://api.dicebear.com/8.x/initials/svg?seed=${authorName}`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEdit = (e) => {
    e.stopPropagation();
    console.log("Edit comment clicked for:", id);
    setIsEditing(true);
    setEditedContent(content);
    setShowMenu(false);
  };

  const handleSaveEdit = async () => {
    if (!editedContent.trim()) return; // Prevent saving empty comment

    let commentRef;
    if (parentId) {
      commentRef = doc(db, 'growthHubPosts', postId, 'comments', parentId, 'replies', id);
    } else {
      commentRef = doc(db, 'growthHubPosts', postId, 'comments', id);
    }

    try {
      await updateDoc(commentRef, {
        content: editedContent,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(content); // Revert to original content
  };

  useEffect(() => {
    let commentRef;
    if (parentId) {
      commentRef = doc(db, 'growthHubPosts', postId, 'comments', parentId, 'replies', id);
    } else {
      commentRef = doc(db, 'growthHubPosts', postId, 'comments', id);
    }

    const unsubscribe = onSnapshot(commentRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setLocalUpvotes(data.upvotes || 0);
      }
    });

    return () => unsubscribe();
  }, [id, postId, parentId]);

  const handleUpvote = async () => {
    if (!user) return; // Or show a login prompt

    const commentRef = doc(db, 'growthHubPosts', postId, 'comments', id);
    const newUpvotedState = !isUpvoted;

    setIsUpvoted(newUpvotedState);
    setLocalUpvotes(localUpvotes + (newUpvotedState ? 1 : -1));

    try {
      await updateDoc(commentRef, {
        upvotes: increment(newUpvotedState ? 1 : -1)
      });
    } catch (error) {
      console.error("Error updating comment upvote count:", error);
      // Revert optimistic UI update on error
      setIsUpvoted(!newUpvotedState);
      setLocalUpvotes(localUpvotes);
    }
  };

  const handleDelete = async () => {
    if (!user || user.uid !== authorId) return; // Only author can delete

    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        // Delete the comment document
        let commentRef;
        if (parentId) {
          commentRef = doc(db, 'growthHubPosts', postId, 'comments', parentId, 'replies', id);
        } else {
          commentRef = doc(db, 'growthHubPosts', postId, 'comments', id);
        }
        console.log("Attempting to delete comment at path:", commentRef.path);
        const docSnap = await getDoc(commentRef);
        if (docSnap.exists()) {
          console.log("Document exists, proceeding with deletion.");
          await deleteDoc(commentRef);
        } else {
          console.log("Document does not exist at path:", commentRef.path);
        }

        // Decrement comment count in parent (post or comment)
        if (parentId) {
          const parentCommentRef = doc(db, 'growthHubPosts', postId, 'comments', parentId);
          await updateDoc(parentCommentRef, {
            comments: increment(-1)
          });
        } else {
          const postRef = doc(db, 'growthHubPosts', postId);
          await updateDoc(postRef, {
            comments: increment(-1)
          });
        }
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  const isAuthor = user && user.uid === authorId;

  return (
    <div className="flex items-start space-x-4 py-4 comment">
      <img src={avatarUrl} alt={`${authorName}'s avatar`} className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <div className="bg-background-primary rounded-lg p-3">
          {isEditing ? (
            <div className="flex flex-col">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-2 bg-background-secondary border border-border-primary rounded-lg mb-2 text-text-primary focus:ring-accent focus:border-accent"
                rows="3"
              ></textarea>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleCancelEdit}
                  className="py-1 px-3 text-text-secondary font-semibold hover:bg-background-primary rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="py-1 px-3 bg-accent text-background-primary font-bold rounded-lg hover:bg-accent-hover transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="font-semibold text-text-primary">{authorName}</p>
              <p className="text-text-secondary">{content}</p>
            </>
          )}
          <div className="flex items-center mt-2">
            <button 
              onClick={handleUpvote}
              className={`flex items-center space-x-1 text-sm font-medium py-1 px-2 rounded-lg transition-colors duration-200 ${
                isUpvoted ? 'text-accent' : 'text-text-secondary hover:text-accent hover:bg-accent/10'
              }`}>
              {isUpvoted ? <HiThumbUp className="w-4 h-4" /> : <HiOutlineThumbUp className="w-4 h-4" />}
              <span>{localUpvotes}</span>
            </button>
            <button 
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center space-x-1 text-sm font-medium py-1 px-2 rounded-lg transition-colors duration-200 text-text-secondary hover:text-accent hover:bg-accent/10 ml-2">
              <HiOutlineReply className="w-4 h-4" />
              <span>Reply</span>
            </button>
            {isAuthor && (
              <div className="relative ml-auto" ref={menuRef}>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                  className="text-text-secondary hover:text-text-primary transition-colors duration-200 ml-2"
                  title="More options"
                >
                  <HiOutlineDotsVertical className="w-4 h-4" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-32 bg-background-secondary rounded-md shadow-lg z-10 border border-border-primary">
                    <button
                      onClick={handleEdit}
                      className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-background-primary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-text-secondary mt-1">{formatTimestamp(timestamp)}</p>
        {showReplyForm && (
          <div className="mt-4">
            <CommentForm 
              postId={postId} 
              parentId={id} 
              parentAuthor={authorName} 
              onCommentAdded={() => setShowReplyForm(false)} // Close form after reply
            />
          </div>
        )}
        <div className="replies">
          <CommentList postId={postId} parentId={id} />
        </div>
      </div>
    </div>
  );
};

export default Comment;
