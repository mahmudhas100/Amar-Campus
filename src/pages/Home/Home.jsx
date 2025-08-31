import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import AtAGlanceCard from '../../components/cards/AtAGlanceCard';
import ClassFeedCard from '../../components/cards/ClassFeedCard';
import GrowthHubCard from '../../components/cards/GrowthHubCard';
import { useAuth } from '../../hooks/useAuth';
import { HiOutlineViewGrid, HiOutlineCollection } from 'react-icons/hi';
import { db } from '../../firebase/firebase';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';

const Home = () => {
  const { searchQuery, selectedCategory } = useOutletContext();
  const { user } = useAuth();
  const displayName = user?.firstName || user?.displayName || user?.email?.split('@')[0] || 'Campus User';
  const [unifiedFeed, setUnifiedFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [atAGlanceData, setAtAGlanceData] = useState({
    newNotices: 0,
    upcomingEvents: 0,
    classesToday: 0,
  });

  const handleCreatePost = () => {
    console.log("Create Post button clicked!");
    // In a real application, you would open a modal or navigate to a new page here
  };

  const currentClassFeedData = useRef([]);
  const currentGrowthHubData = useRef([]);

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

  const updateUnifiedFeed = (classData, growthData) => {
    const combinedFeed = [...classData, ...growthData];
    combinedFeed.sort((a, b) => (b.timestamp?.toDate() || 0) - (a.timestamp?.toDate() || 0));
    setUnifiedFeed(combinedFeed);
    setLoading(false);

    // Update At a Glance data
    const upcomingEvents = growthData.filter(post => post.category === 'Events').length;
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
      const classFeedData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, type: 'classFeed' }));
      updateUnifiedFeed(classFeedData, currentGrowthHubData.current);
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
      updateUnifiedFeed(currentClassFeedData.current, growthHubData);
      currentGrowthHubData.current = growthHubData;
    }, (error) => {
      console.error("Error fetching growth hub:", error);
      setLoading(false);
    });

    return () => {
      console.log("useEffect cleanup: Unsubscribing from real-time listeners.");
      unsubscribeClassFeed();
      unsubscribeGrowthHub();
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
  const otherPosts = filteredFeed.filter(post => post.type !== 'classFeed');

  return (
    <div className="bg-slate-50 pt-16">
      <header className="p-4 sm:p-6 md:p-8 mb-4">
        <h2 className="font-sans text-3xl font-bold text-sky-900">{getGreeting()}, {displayName}</h2>
        <p className="text-slate-500 mt-1">Here's your campus briefing for today.</p>
      </header>

      <section className="p-4 sm:p-6 md:p-8 mb-10">
        <h3 className="text-xl font-bold text-sky-800 mb-4 flex items-center">
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
        <h3 className="text-xl font-bold text-sky-800 mb-4 flex items-center">
          <HiOutlineCollection className="mr-3 text-sky-500 w-6 h-6" />
          Unified Feed
        </h3>
        <div className="max-w-2xl mx-auto space-y-5">
            <h3 className="font-bold text-slate-500 text-sm uppercase tracking-wider">Official Notices</h3>
            {
              loading ? (
                <Spinner />
              ) : (
                <>
                  {officialNotices.length === 0 ? (
                    <div className="text-center"><p className="text-slate-500 mb-4">No official notices yet.</p></div>
                  ) : (
                    <>
                      {officialNotices.map(post => (
                          <ClassFeedCard key={post.id} post={post} />
                      ))}
                    </>
                  )}
                </>
              )
            }
            <h3 className="font-bold text-slate-500 text-sm uppercase tracking-wider mt-10">Today's Feed</h3>
            {
              loading ? (
                <Spinner />
              ) : (
                <>
                  {otherPosts.length === 0 ? (
                    <div className="text-center"><p className="text-slate-500 mb-4">No posts yet. Be the first to share!</p><Button onClick={handleCreatePost}>Create Post</Button></div>
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
    </div>
  );
};

export default Home;
