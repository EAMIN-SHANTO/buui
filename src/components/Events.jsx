import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import.meta.env
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'university',
    organizer: '',
    date: '',
    deadline: '',
    location: '',
    registrationLink: '',
    tags: ''
  });
  const [editingEvent, setEditingEvent] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/usersp/profile`, {
        withCredentials: true
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchCurrentUser();
        await fetchEvents();
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      const params = filter !== 'all' ? { type: filter } : {};
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/events`, { 
        params,
        withCredentials: true 
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Error fetching events');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      // Append all text fields
      Object.keys(newEvent).forEach(key => {
        if (key === 'tags' && typeof newEvent[key] === 'string') {
          // Convert comma-separated tags to array
          formData.append(key, JSON.stringify(newEvent[key].split(',')));
        } else if (key !== 'image') {
          formData.append(key, newEvent[key]);
        }
      });

      // Append the image file if it exists
      if (newEvent.image) {
        formData.append('image', newEvent.image);
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/api/events`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Event created successfully');
      setShowForm(false);
      fetchEvents();
      
      // Reset form
      setNewEvent({
        title: '',
        description: '',
        type: 'university',
        organizer: '',
        date: '',
        deadline: '',
        location: '',
        registrationLink: '',
        tags: '',
        image: null
      });
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error(error.response?.data?.message || 'Error creating event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/events/${eventId}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 200) {
          toast.success('Event deleted successfully');
          // Update the local state to remove the deleted event
          setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error(error.response?.data?.message || 'Error deleting event');
      }
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      // Create update data object with basic fields
      const updateData = {
        title: editingEvent.title,
        description: editingEvent.description,
        type: editingEvent.type,
        organizer: editingEvent.organizer,
        location: editingEvent.location || '',
        registrationLink: editingEvent.registrationLink || '',
        date: editingEvent.date,
        deadline: editingEvent.deadline || null
      };

      // Handle tags
      if (typeof editingEvent.tags === 'string') {
        updateData.tags = editingEvent.tags.split(',').map(tag => tag.trim());
      } else {
        updateData.tags = editingEvent.tags;
      }

      // Append all fields to formData
      Object.keys(updateData).forEach(key => {
        if (key === 'tags') {
          formData.append('tags', JSON.stringify(updateData.tags));
        } else if (key === 'date' || key === 'deadline') {
          // Format dates properly
          const date = updateData[key] ? new Date(updateData[key]).toISOString() : null;
          formData.append(key, date);
        } else {
          formData.append(key, updateData[key] || '');
        }
      });

      // Handle image separately
      if (editingEvent.image instanceof File) {
        formData.append('image', editingEvent.image);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/events/${editingEvent._id}`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      if (response.status === 200) {
        toast.success('Event updated successfully');
        setEditingEvent(null);
        fetchEvents();
      }
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error(error.response?.data?.message || 'Error updating event');
    }
  };

  const renderFormFields = () => (
    <>
      <input
        type="text"
        placeholder="Title"
        value={newEvent.title}
        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        placeholder="Description"
        value={newEvent.description}
        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
        className="w-full p-2 border rounded h-32"
        required
      />
      <select
        value={newEvent.type}
        onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
        className="w-full p-2 border rounded"
        required
      >
        <option value="university">University Event</option>
        <option value="club">Club Event</option>
        <option value="contest">Contest</option>
        <option value="recruitment">Recruitment</option>
        <option value="achievement">Achievement</option>
      </select>
      <input
        type="text"
        placeholder="Organizer"
        value={newEvent.organizer}
        onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="datetime-local"
        value={newEvent.date}
        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="datetime-local"
        placeholder="Registration Deadline"
        value={newEvent.deadline}
        onChange={(e) => setNewEvent({ ...newEvent, deadline: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Location"
        value={newEvent.location}
        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        type="url"
        placeholder="Registration Link"
        value={newEvent.registrationLink}
        onChange={(e) => setNewEvent({ ...newEvent, registrationLink: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Tags (comma-separated)"
        value={newEvent.tags}
        onChange={(e) => setNewEvent({ ...newEvent, tags: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setNewEvent(prev => ({
              ...prev,
              image: file
            }));
          }}
          className="w-full p-2 border rounded"
        />
      </div>
    </>
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Events & Activities</h1>
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create Event
          </button>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        {['all', 'university', 'club', 'contest', 'recruitment', 'achievement'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded ${
              filter === type ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <div key={event._id} className="border rounded-lg p-4 hover:shadow-lg">
            {event.image && (
              <img
                src={`${import.meta.env.VITE_API_URL}/uploads/events/${event.image}`}
                alt={event.title}
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}
            <h3 className="text-xl font-bold mb-2">{event.title}</h3>
            <p className="text-gray-600 mb-2">{event.description}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {event.tags.map((tag, index) => (
                <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {tag}
                </span>
              ))}
            </div>
            <div className="text-sm text-gray-500">
              <p>Organizer: {event.organizer}</p>
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              {event.deadline && (
                <p>Registration Deadline: {new Date(event.deadline).toLocaleDateString()}</p>
              )}
              {event.location && <p>Location: {event.location}</p>}
            </div>
            {event.registrationLink && (
              <a
                href={event.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
              >
                Register Now
              </a>
            )}
            {(currentUser?.role === 'admin' || currentUser?.role === 'staff') && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setEditingEvent(event)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEvent(event._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Event Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create Event</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {renderFormFields()}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Edit Event</h2>
            <form onSubmit={handleUpdateEvent} className="space-y-4">
              <input
                type="text"
                value={editingEvent.title}
                onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                placeholder="Description"
                value={editingEvent.description}
                onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                className="w-full p-2 border rounded h-32"
                required
              />
              <select
                value={editingEvent.type}
                onChange={(e) => setEditingEvent({ ...editingEvent, type: e.target.value })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="university">University Event</option>
                <option value="club">Club Event</option>
                <option value="contest">Contest</option>
                <option value="recruitment">Recruitment</option>
                <option value="achievement">Achievement</option>
              </select>
              <input
                type="text"
                placeholder="Organizer"
                value={editingEvent.organizer}
                onChange={(e) => setEditingEvent({ ...editingEvent, organizer: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="datetime-local"
                value={formatDateForInput(editingEvent.date)}
                onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="datetime-local"
                placeholder="Registration Deadline"
                value={formatDateForInput(editingEvent.deadline)}
                onChange={(e) => setEditingEvent({ ...editingEvent, deadline: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Location"
                value={editingEvent.location}
                onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="url"
                placeholder="Registration Link"
                value={editingEvent.registrationLink}
                onChange={(e) => setEditingEvent({ ...editingEvent, registrationLink: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Tags (comma-separated)"
                value={editingEvent.tags}
                onChange={(e) => setEditingEvent({ ...editingEvent, tags: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setEditingEvent(prev => ({
                      ...prev,
                      image: file
                    }));
                  }}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events; 