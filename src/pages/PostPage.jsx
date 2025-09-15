import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import CommentList from '../components/comments/CommentList';
import CommentForm from '../components/comments/CommentForm';
import Spinner from '../components/common/Spinner';
import formatTimestamp from '../utils/formatTimestamp';

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const postRef = doc(db, 'growthHubPosts', postId);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          setPost({ ...postSnap.data(), id: postSnap.id });
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><Spinner /></div>;
  }

  if (!post) {
    return <div className="text-center p-8">Post not found</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-slate-100 pt-16">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200/80">
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-sky-900 mb-3 leading-tight">{post.title}</h1>
            <div className="flex items-center text-sm text-slate-500 mb-6">
              <span>By {post.authorName || 'Anonymous'}</span>
              <span className="mx-2">•</span>
              <span>{formatTimestamp(post.timestamp)}</span>
            </div>
            <div className="prose prose-lg max-w-none text-slate-800 leading-relaxed">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </div>
        </div>
        
        <div className="mt-8 comment-thread">
          <h2 className="text-2xl font-bold text-sky-800 mb-4">Comments</h2>
          <CommentForm postId={postId} />
          <CommentList postId={postId} />
        </div>
      </div>
    </div>
  );
};

export default PostPage;
