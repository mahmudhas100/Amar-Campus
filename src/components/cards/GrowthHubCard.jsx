import React, { useState, useEffect, useRef } from 'react';
import { HiOutlineThumbUp, HiOutlineChatAlt, HiOutlineShare, HiThumbUp, HiChevronDown, HiOutlineTrash, HiOutlineDotsVertical, HiChevronUp } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { doc, updateDoc, increment, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useAuth } from '../../hooks/useAuth';
import { updateEventAttendance } from '../../firebase/firestore';
import { formatTimeAgo } from '../../utils/formatTimestamp';
import CommentList from '../comments/CommentList';
import CommentForm from '../comments/CommentForm';
import CreatePostModal from '../common/CreatePostModal';

const GrowthHubCard = ({ post }) => {
  const { user } = useAuth();
  const { 
    id, 
    authorName = 'User', 
    category = 'General', 
    title = 'Post Title', 
    snippet = '', 
    upvotes = 0, 
    comments = 0, 
    timestamp, 
    createdAt, 
    goingCount = 0,
    interestedCount = 0,
    userAttendance = {}
  } = post || {};
  const displayTimestamp = timestamp || createdAt;
  
  const [localUpvotes, setLocalUpvotes] = useState(upvotes);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [realtimeCommentsCount, setRealtimeCommentsCount] = useState(comments);
  const [showMenu, setShowMenu] = useState(false);
  const [showAttendanceMenu, setShowAttendanceMenu] = useState(false);
  const [localGoingCount, setLocalGoingCount] = useState(goingCount);
  const [localInterestedCount, setLocalInterestedCount] = useState(interestedCount);
  const [userAttendanceStatus, setUserAttendanceStatus] = useState(user ? userAttendance[user.uid] : null);
  const menuRef = useRef(null);
  const attendanceMenuRef = useRef(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [showFullContent, setShowFullContent] = useState(true);

  const MAX_CONTENT_LENGTH = 200;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
      if (attendanceMenuRef.current && !attendanceMenuRef.current.contains(event.target)) {
        setShowAttendanceMenu(false);
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
    setPostToEdit(post);
    setIsEditModalOpen(true);
    setShowMenu(false);
  };

  const handleUpvote = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;

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
      setIsUpvoted(!newUpvotedState);
      setLocalUpvotes(localUpvotes);
    }
  };

  const handleAttendance = async (status) => {
    if (!user) {
      // You could add a toast notification here to prompt for login
      return;
    }

    const oldStatus = userAttendanceStatus;
    const isRemovingStatus = status === oldStatus;

    // Optimistically update UI
    setUserAttendanceStatus(isRemovingStatus ? null : status);
    if (isRemovingStatus) {
      if (status === 'going') setLocalGoingCount(prev => prev - 1);
      if (status === 'interested') setLocalInterestedCount(prev => prev - 1);
    } else {
      if (oldStatus === 'going') setLocalGoingCount(prev => prev - 1);
      if (oldStatus === 'interested') setLocalInterestedCount(prev => prev - 1);
      if (status === 'going') setLocalGoingCount(prev => prev + 1);
      if (status === 'interested') setLocalInterestedCount(prev => prev + 1);
    }

    try {
      await updateEventAttendance(id, status);
    } catch (error) {
      console.error("Error updating attendance:", error);
      // Revert optimistic updates
      setUserAttendanceStatus(oldStatus);
      if (isRemovingStatus) {
        if (status === 'going') setLocalGoingCount(prev => prev + 1);
        if (status === 'interested') setLocalInterestedCount(prev => prev + 1);
      } else {
        if (oldStatus === 'going') setLocalGoingCount(prev => prev + 1);
        if (oldStatus === 'interested') setLocalInterestedCount(prev => prev + 1);
        if (status === 'going') setLocalGoingCount(prev => prev - 1);
        if (status === 'interested') setLocalInterestedCount(prev => prev - 1);
      }
    }
    setShowAttendanceMenu(false);
  };

  useEffect(() => {
    const postRef = doc(db, 'growthHubPosts', id);
    const unsubscribe = onSnapshot(postRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setLocalUpvotes(data.upvotes || 0);
        setRealtimeCommentsCount(data.comments || 0);
        setLocalGoingCount(data.goingCount || 0);
        setLocalInterestedCount(data.interestedCount || 0);
        if (user) {
          setUserAttendanceStatus(data.userAttendance?.[user.uid] || null);
        }
      }
    });

    return () => unsubscribe();
  }, [id, user]);

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
        alert('Link copied to clipboard!');
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
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl border border-slate-200/80">
      <Link to={`/post/${id}`} className="block">
        {/* Card Header */}
        <div className="p-4 sm:p-5 flex items-center">
          <img className="w-12 h-12 rounded-full mr-4 border-2 border-slate-200" src={avatarUrl} alt={`${authorName}'s avatar`} />
          <div className="flex-grow">
            <p className="font-bold text-slate-800">{authorName}</p>
            <p className="text-sm text-slate-500">{formatTimeAgo(displayTimestamp)} · <span className="font-semibold text-sky-700">{category}</span></p>
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
                    onClick={handleEdit}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
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
      </Link>

      {/* Event Attendance - Outside the interaction bar */}
      {(category.toLowerCase() === 'events' || category.toLowerCase() === 'event') && (
        <div className="px-4 sm:px-5 pb-2 flex justify-end" onClick={(e) => e.stopPropagation()}>
          <div className="relative inline-block text-left z-50" ref={attendanceMenuRef}>
            <div>
              <button
                type="button"
                onClick={() => setShowAttendanceMenu(!showAttendanceMenu)}
                className={`flex items-center space-x-2 font-medium py-1.5 px-3 rounded-lg transition-colors duration-200 ${
                  userAttendanceStatus ? 'text-sky-600 bg-sky-50 border border-sky-200' : 'text-slate-600 hover:text-sky-600 hover:bg-sky-100 border border-slate-200'
                }`}
              >
                <span className="text-sm">{userAttendanceStatus ? `${userAttendanceStatus.charAt(0).toUpperCase() + userAttendanceStatus.slice(1)}` : 'Attend'}</span>
                <HiChevronDown className={`w-5 h-5 transition-transform ${showAttendanceMenu ? 'rotate-180' : ''}`} />
              </button>
              {showAttendanceMenu && (
                <div 
                  className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1"
                >
                  <div className="flex space-x-1">
                    <button
                      type="button"
                      onClick={() => handleAttendance('going')}
                      className={`flex flex-col items-center px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                        userAttendanceStatus === 'going' ? 'text-sky-600 bg-sky-50' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>Going</span>
                      <span className="font-medium">{localGoingCount}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAttendance('interested')}
                      className={`flex flex-col items-center px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                        userAttendanceStatus === 'interested' ? 'text-sky-600 bg-sky-50' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>Interested</span>
                      <span className="font-medium">{localInterestedCount}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Card Footer (Interaction Bar) */}
      <div className="bg-slate-50/70 px-4 sm:px-5 py-2 border-t border-slate-200/80">
        <div className="flex justify-around items-center">
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
          <button 
            onClick={handleShare} 
            className="flex items-center space-x-2 text-slate-600 hover:text-sky-600 hover:bg-sky-100 font-medium py-2 px-3 rounded-lg transition-colors duration-200 w-full justify-center">
            <HiOutlineShare className="w-6 h-6" />
            <span className="text-sm">Share</span>
          </button>
        </div>
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