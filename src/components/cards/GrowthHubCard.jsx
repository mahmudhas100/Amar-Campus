import React, { useState, useEffect, useRef } from 'react';
import { HiOutlineThumbUp, HiOutlineChatAlt, HiOutlineShare, HiThumbUp, HiChevronDown, HiOutlineTrash, HiOutlineDotsVertical, HiChevronUp } from 'react-icons/hi';
import formatTimestamp from '../../utils/formatTimestamp';
import { db } from '../../firebase/firebase';
import { doc, updateDoc, increment, onSnapshot, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';

import { Link } from 'react-router-dom';

import CommentList from '../comments/CommentList';
import CommentForm from '../comments/CommentForm';
import CreatePostModal from '../common/CreatePostModal';

const GrowthHubCard = ({ post }) => {
  const { user } = useAuth();
  const { id, authorName = 'User', category = 'General', title = 'Post Title', snippet = '', upvotes = 0, comments = 0, timestamp, createdAt } = post || {};
  const displayTimestamp = timestamp || createdAt;
  
  const [localUpvotes, setLocalUpvotes] = useState(upvotes);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [realtimeCommentsCount, setRealtimeCommentsCount] = useState(comments);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [showFullContent, setShowFullContent] = useState(true); // New state

  const MAX_CONTENT_LENGTH = 200; // New constant

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

  const avatarUrl = `https://api.dicebear.com/8.x/initials/svg?seed=${authorName}`;

  const handleEdit = (e) => {
    e.stopPropagation();
    console.log("Edit post clicked for:", id);
    setPostToEdit(post);
    setIsEditModalOpen(true);
    setShowMenu(false);
  };

  const handleUpvote = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return; // Or show a login prompt

    const postRef = doc(db, 'growthHubPosts', id);
    const newUpvotedState = !isUpvoted;

    setIsUpvoted(newUpvotedState);
    setLocalUpvotes(localUpvotes + (newUpvotedState ? 1 : -1));

    try {
      await updateDoc(postRef, {
        upvotes: increment(newUpvotedState ? 1 : -1)
      });
    } catch (error) {
      console.error("Error updating upvote count:", error);
      // Revert optimistic UI update on error
      setIsUpvoted(!newUpvotedState);
      setLocalUpvotes(localUpvotes);
    }
  };



  useEffect(() => {
    console.log(`Setting up onSnapshot for post: ${id}`);
    const postRef = doc(db, 'growthHubPosts', id);
    const unsubscribe = onSnapshot(postRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log(`Received data for post ${id}:`, data);
        setLocalUpvotes(data.upvotes || 0);
        setRealtimeCommentsCount(data.comments || 0);
      } else {
        console.log(`Post ${id} does not exist.`);
      }
    }, (error) => {
      console.error(`Error in onSnapshot for post ${id}:`, error);
    });

    return () => {
      console.log(`Unsubscribing from onSnapshot for post: ${id}`);
      unsubscribe();
    };
  }, [id]);

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const postUrl = `${window.location.origin}/post/${id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: snippet,
          url: postUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(postUrl);
        alert('Link copied to clipboard!'); // Replace with a more elegant notification
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;

    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteDoc(doc(db, 'growthHubPosts', id));
        // Post will automatically disappear due to real-time listener in Home.jsx
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const handleSavePost = async (updatedPost) => {
    try {
      const postRef = doc(db, 'growthHubPosts', updatedPost.id);
      await updateDoc(postRef, {
        title: updatedPost.title,
        content: updatedPost.content,
        category: updatedPost.category,
      });
      setIsEditModalOpen(false);
      setPostToEdit(null);
    } catch (error) {
      console.error("Error updating post:", error);
      // Handle error, maybe show a message to the user
    }
  };

  const CardContent = ({ children }) => {
    if (commentsOpen) {
      return <div className="block">{children}</div>;
    }
    return <Link to={`/post/${id}`} className="block">{children}</Link>;
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl border border-slate-200/80">
      <CardContent>
        {/* Card Header */}
        <div className="p-4 sm:p-5 flex items-center">
          <img className="w-12 h-12 rounded-full mr-4 border-2 border-slate-200" src={avatarUrl} alt={`${authorName}'s avatar`} />
          <div className="flex-grow">
            <p className="font-bold text-slate-800">{authorName}</p>
            <p className="text-sm text-slate-500">{formatTimestamp(displayTimestamp)} · <span className="font-semibold text-sky-700">{category}</span></p>
          </div>
          {user && user.uid === post.authorId && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenu(!showMenu); }}
                className="text-slate-400 hover:text-slate-600 transition-colors duration-200 ml-4"
                title="More options"
              >
                <HiOutlineDotsVertical className="w-5 h-5" />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                  <button
                    onClick={(e) => { e.preventDefault(); handleEdit(e); }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); handleDelete(e); }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="px-4 sm:px-5 pb-4">
          <h3 className="text-xl font-bold text-sky-900 mb-2 leading-snug">{title}</h3>
          <p className="text-slate-700 text-base leading-relaxed">
            {post.content.length <= MAX_CONTENT_LENGTH || showFullContent
              ? post.content
              : `${post.content.substring(0, MAX_CONTENT_LENGTH)}...`}
          </p>
          {post.content.length > MAX_CONTENT_LENGTH && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowFullContent(!showFullContent); }}
              className="text-sky-600 hover:text-sky-800 font-semibold text-sm flex items-center mt-2"
            >
              {showFullContent ? 'Show less' : 'Read more'}
              {showFullContent ? <HiChevronUp className="w-5 h-5 ml-1" /> : <HiChevronDown className="w-5 h-5 ml-1" />}
            </button>
          )}
        </div>
      </CardContent>

      {/* Card Footer (Interaction Bar) */}
      <div className="bg-slate-50/70 px-4 sm:px-5 py-2 border-t border-slate-200/80 flex justify-around items-center">
        <button 
          onClick={handleUpvote}
          className={`flex items-center space-x-2  hover:bg-sky-100 font-medium py-2 px-3 rounded-lg transition-colors duration-200 w-full justify-center ${
            isUpvoted ? 'text-sky-600' : 'text-slate-600'
          }`}>
          {isUpvoted ? <HiThumbUp className="w-6 h-6" /> : <HiOutlineThumbUp className="w-6 h-6" />}
          <span className="text-sm">{localUpvotes} Upvotes</span>
        </button>
        <div className="h-6 border-l border-slate-200"></div>
        <button 
          onClick={() => setCommentsOpen(!commentsOpen)}
          className="flex items-center space-x-2 text-slate-600 hover:text-sky-600 hover:bg-sky-100 font-medium py-2 px-3 rounded-lg transition-colors duration-200 w-full justify-center">
          <HiOutlineChatAlt className="w-6 h-6" />
          <span className="text-sm">{realtimeCommentsCount} Comments</span>
        </button>
        <div className="h-6 border-l border-slate-200"></div>
        <button onClick={handleShare} className="flex items-center space-x-2 text-slate-600 hover:text-sky-600 hover:bg-sky-100 font-medium py-2 px-3 rounded-lg transition-colors duration-200 w-full justify-center">
          <HiOutlineShare className="w-6 h-6" />
          <span className="text-sm">Share</span>
        </button>
      </div>

      {commentsOpen && (
        <div className="p-4 sm:p-5 border-t border-slate-200/80 transition-all duration-300 ease-in-out overflow-hidden max-h-screen opacity-100">
          <CommentList postId={id} />
          <CommentForm postId={id} />
        </div>
      )}

      <CreatePostModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleSavePost}
        initialPost={postToEdit}
      />
    </div>
  );
};

export default GrowthHubCard;