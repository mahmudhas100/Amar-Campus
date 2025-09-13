import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import AtAGlanceCard from '../../components/cards/AtAGlanceCard';
import ClassFeedCard from '../../components/cards/ClassFeedCard';
import GrowthHubCard from '../../components/cards/GrowthHubCard';
import EventCard from '../../components/cards/EventCard';
import { useAuth } from '../../hooks/useAuth';
import { HiOutlineViewGrid, HiOutlineCollection } from 'react-icons/hi';
import { db } from '../../firebase/firebase';
import { collection, getDocs, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import CreatePostModal from '../../components/common/CreatePostModal';

const Home = () => {
  const { searchQuery, selectedCategory } = useOutletContext();
  const { user } = useAuth();
  const displayName = user?.firstName || user?.displayName || user?.email?.split('@')[0] || 'Campus User';
  const [unifiedFeed, setUnifiedFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
  const [atAGlanceData, setAtAGlanceData] = useState({
    newNotices: 0,
    upcomingEvents: 0,
    classesToday: 0,
  });

  const handleCreatePost = () => {
    setCreatePostModalOpen(true);
  };

  const handlePostSubmit = async (postData) => {
    if (!user) {
      throw new Error('You must be logged in to create a post.');
    }
    const newPost = {
      ...postData,
      authorId: user.uid,
      authorName: displayName,
      timestamp: serverTimestamp(),
      likes: [],
      comments: 0,
    };
    await addDoc(collection(db, 'growthHubPosts'), newPost);
  };


  const currentClassFeedData = useRef([]);
  const currentGrowthHubData = useRef([]);
  const currentEventsData = useRef([]);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return 'Good morning';
    } else if (currentHour < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };

  const updateUnifiedFeed = (classData, growthData, eventsData) => {
    const combinedFeed = [...classData, ...growthData, ...eventsData];
    combinedFeed.sort((a, b) => (b.timestamp?.toDate() || b.createdAt?.toDate() || 0) - (a.timestamp?.toDate() || a.createdAt?.toDate() || 0));
    setUnifiedFeed(combinedFeed);
    setLoading(false);

    // Update At a Glance data
    const upcomingEvents = eventsData.length;
    const classesToday = 0; // Placeholder

    setAtAGlanceData({
      newNotices: classData.length,
      upcomingEvents,
      classesToday,
    });
  };

  useEffect(() => {
    console.log("useEffect: Setting up real-time listeners.");
    setLoading(true);

    const unsubscribeClassFeed = onSnapshot(collection(db, 'classFeed'), (snapshot) => {
      const classFeedData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, type: 'classFeed', timestamp: doc.data().createdAt || doc.data().timestamp }));
      updateUnifiedFeed(classFeedData, currentGrowthHubData.current, currentEventsData.current);
      currentClassFeedData.current = classFeedData;
    }, (error) => {
      console.error("Error fetching class feed:", error);
      setLoading(false);
    });

    const unsubscribeGrowthHub = onSnapshot(collection(db, 'growthHubPosts'), async (snapshot) => {
      const growthHubDataPromises = snapshot.docs.map(async doc => {
        const postData = { ...doc.data(), id: doc.id, type: 'growthHub' };
        
        // Fetch comments count for each GrowthHub post
        const commentsCollection = collection(db, 'growthHubPosts', doc.id, 'comments');
        const commentsSnapshot = await getDocs(commentsCollection);
        postData.comments = commentsSnapshot.docs.length;

        return postData;
      });
      const growthHubData = await Promise.all(growthHubDataPromises);

      // Sort GrowthHub data by timestamp (newest first)
      growthHubData.sort((a, b) => (b.timestamp?.toDate() || 0) - (a.timestamp?.toDate() || 0));
      updateUnifiedFeed(currentClassFeedData.current, growthHubData, currentEventsData.current);
      currentGrowthHubData.current = growthHubData;
    }, (error) => {
      console.error("Error fetching growth hub:", error);
      setLoading(false);
    });

    const unsubscribeEvents = onSnapshot(collection(db, 'events'), (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, type: 'event' }));
      updateUnifiedFeed(currentClassFeedData.current, currentGrowthHubData.current, eventsData);
      currentEventsData.current = eventsData;
    }, (error) => {
      console.error("Error fetching events:", error);
      setLoading(false);
    });

    return () => {
      console.log("useEffect cleanup: Unsubscribing from real-time listeners.");
      unsubscribeClassFeed();
      unsubscribeGrowthHub();
      unsubscribeEvents();
    };
  }, []);

  const filteredFeed = unifiedFeed.filter(post => {
    const searchMatch = 
      post.title?.toLowerCase().includes(searchQuery?.toLowerCase() || '') ||
      post.content?.toLowerCase().includes(searchQuery?.toLowerCase() || '') ||
      post.authorName?.toLowerCase().includes(searchQuery?.toLowerCase() || '');

    const categoryMatch = selectedCategory === 'all' || post.category === selectedCategory;

    return searchMatch && categoryMatch;
  });

  const officialNotices = filteredFeed.filter(post => post.type === 'classFeed');
  const events = filteredFeed.filter(post => post.type === 'event');
  const otherPosts = filteredFeed.filter(post => post.type !== 'classFeed' && post.type !== 'event');

  return (
    <div className="pt-16">
      <header className="p-4 sm:p-6 md:p-8 mb-4">
        <h2 className="font-sans text-3xl font-bold text-text-primary">{getGreeting()}, {displayName}</h2>
        <p className="text-text-secondary mt-1">Here's your campus briefing for today.</p>
      </header>

      <section className="p-4 sm:p-6 md:p-8 mb-10">
        <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center">
          <HiOutlineViewGrid className="mr-3 text-sky-500 w-6 h-6" />
          At a Glance
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <AtAGlanceCard title="New Notices" value={atAGlanceData.newNotices} icon="🔔" />
          <AtAGlanceCard title="Upcoming Events" value={atAGlanceData.upcomingEvents} icon="📅" />
          <AtAGlanceCard title="Classes Today" value={atAGlanceData.classesToday} icon="📚" />
        </div>
      </section>

      <section className="p-4 sm:p-6 md:p-8">
        <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center">
          <HiOutlineCollection className="mr-3 text-sky-500 w-6 h-6" />
          Unified Feed
        </h3>
        <div className="max-w-2xl mx-auto space-y-5">
            <h3 className="font-bold text-text-secondary text-sm uppercase tracking-wider">Official Notices</h3>
            <div className="bg-background-secondary p-4 rounded-2xl border border-border-primary mb-6">
            {
              loading ? (
                <Spinner />
              ) : (
                <>
                  {officialNotices.length === 0 ? (
                    <div className="text-center"><p className="text-slate-500 mb-4">No official notices yet.</p></div>
                  ) : (
                    <div className="space-y-4">
                      {officialNotices.map(post => (
                          <ClassFeedCard key={post.id} post={post} />
                      ))}
                    </div>
                  )}
                </>
              )
            }
            </div>
            <h3 className="font-bold text-text-secondary text-sm uppercase tracking-wider mt-10">Events</h3>
            {
              loading ? (
                <Spinner />
              ) : (
                <>
                  {events.length === 0 ? (
                    <div className="text-center"><p className="text-slate-500 mb-4">No upcoming events.</p></div>
                  ) : (
                    <>
                      {events.map(event => (
                          <EventCard key={event.id} event={event} />
                      ))}
                    </>
                  )}
                </>
              )
            }
            <h3 className="font-bold text-text-secondary text-sm uppercase tracking-wider mt-10">Today's Feed</h3>
            {
              loading ? (
                <Spinner />
              ) : (
                <>
                  {otherPosts.length === 0 ? (
                    <div className="text-center"><p className="text-slate-500 mb-4">No posts yet. Be the first to share!</p><Button onClick={handleCreatePost} className="glowing-button">Create Post</Button></div>
                  ) : (
                    <>
                      {otherPosts.map(post => (
                          <GrowthHubCard key={post.id} post={post} />
                      ))}
                    </>
                  )}
                </>
              )
            }
        </div>
      </section>
      <CreatePostModal 
        isOpen={isCreatePostModalOpen} 
        onClose={() => setCreatePostModalOpen(false)} 
        onSubmit={handlePostSubmit} 
      />
    </div>
  );
};

export default Home;
