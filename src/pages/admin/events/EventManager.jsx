import React, { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiChevronDown, HiCalendar } from 'react-icons/hi';
import { collection, addDoc, Timestamp, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { useAuth } from '../../../hooks/useAuth';
import formatTime12Hour from '../../../utils/formatTime12Hour';

const EventManager = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, 'events'));
      const eventsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setEvents(eventsData);
    };
    fetchEvents();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!title || !date) return;

    try {
      await addDoc(collection(db, 'events'), {
        title,
        description,
        date,
        time,
        location,
        authorId: user.uid,
        authorName: user.displayName,
        createdAt: Timestamp.now(),
      });
      resetForm();
      setShowModal(false);
      // Refetch events
      const querySnapshot = await getDocs(collection(db, 'events'));
      const eventsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setEvents(eventsData);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    if (!title || !date || !time) return;

    try {
      const eventRef = doc(db, 'events', currentEvent.id);
      await updateDoc(eventRef, {
        title,
        description,
        date,
        time,
        location,
      });
      resetForm();
      setShowModal(false);
      // Refetch events
      const querySnapshot = await getDocs(collection(db, 'events'));
      const eventsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setEvents(eventsData);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteDoc(doc(db, 'events', id));
        setEvents(events.filter(event => event.id !== id));
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const openModalToCreate = () => {
    setIsEditing(false);
    resetForm();
    setShowModal(true);
  };

  const openModalToEdit = (event) => {
    setIsEditing(true);
    setCurrentEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setDate(event.date);
    setTime(event.time);
    setLocation(event.location);
    setShowModal(true);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setLocation('');
    setCurrentEvent(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-sky-900 mb-1">Event Manager</h1>
          <p className="text-white-600 text-xl">Create and manage campus events</p>
        </div>
        <button
          onClick={openModalToCreate}
          className="flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-all duration-200 shadow-sm hover:shadow"
        >
          <HiOutlinePlus className="w-5 h-5 mr-2" />
          Create Event
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-xl">
            <h2 className="text-xl font-bold text-sky-900 mb-4">{isEditing ? 'Edit Event' : 'Create New Event'}</h2>
            <form onSubmit={isEditing ? handleUpdateEvent : handleCreateEvent}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black" placeholder="e.g. Annual Sports Day" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                  <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-black" placeholder="e.g. Main Campus Ground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg h-32 text-black" placeholder="e.g. Join us for a day of fun and friendly competition." />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700">
                  {isEditing ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Time</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {events.map((event) => (
              <tr key={event.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{event.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{event.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{formatTime12Hour(event.time)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{event.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openModalToEdit(event)} className="text-sky-600 hover:text-sky-900 mr-4"><HiOutlinePencil className="w-5 h-5" /></button>
                  <button onClick={() => handleDeleteEvent(event.id)} className="text-red-600 hover:text-red-900"><HiOutlineTrash className="w-5 h-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventManager;
