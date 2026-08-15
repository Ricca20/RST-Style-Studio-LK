'use client';

import { useState, useEffect } from 'react';
import { Bell, CheckCircle, Trash2, FileText, Info, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearConfirm, setClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const [broadcastConfirm, setBroadcastConfirm] = useState(false);
  const [broadcastData, setBroadcastData] = useState({ title: '', message: '', type: 'SYSTEM' });

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/admin/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.data || []);
      }
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/notifications/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(broadcastData)
      });
      if (res.ok) {
        toast.success('Notification broadcasted successfully');
        setBroadcastConfirm(false);
        setBroadcastData({ title: '', message: '', type: 'SYSTEM' });
        fetchNotifications();
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to broadcast');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true })
      });
      if (res.ok) {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        toast.success('All marked as read');
      }
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const markAsRead = async (id, isRead, link) => {
    if (isRead && !link) return;
    
    if (!isRead) {
      try {
        await fetch('/api/admin/notifications', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
      } catch (error) {
        console.error('Failed to mark read:', error);
      }
    }

    if (link) {
      window.location.href = link;
    }
  };

  const clearAll = async () => {
    setIsClearing(true);
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'DELETE'
      });
      if (res.ok) {
        setNotifications([]);
        toast.success('Notification history cleared');
        setClearConfirm(false);
      } else {
        throw new Error('Failed to clear notifications');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsClearing(false);
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'QUOTATION': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'TEAM': return <Info className="w-5 h-5 text-purple-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <Bell className="w-8 h-8 text-blue-600" /> Notifications
          </h1>
          <p className="text-gray-500 mt-1">Review alerts, quotation requests, and system updates.</p>
        </div>
        
        <div className="flex gap-3 flex-wrap">
          <button 
            onClick={() => setBroadcastConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-sm font-medium hover:bg-indigo-100 transition"
          >
            <Bell className="w-4 h-4" />
            Broadcast
          </button>
          <button 
            onClick={markAllAsRead}
            disabled={loading || notifications.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition"
          >
            <CheckCircle className="w-4 h-4 text-blue-600" />
            Mark all as read
          </button>
          <button 
            onClick={() => setClearConfirm(true)}
            disabled={loading || notifications.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-100 rounded-lg text-sm font-medium hover:bg-red-100 disabled:opacity-50 transition"
          >
            <Trash2 className="w-4 h-4" />
            Clear history
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
            <p>Loading your notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-gray-400">
            <Bell className="w-16 h-16 text-gray-200 mb-4" />
            <p className="text-lg font-medium text-gray-900">You\'re all caught up!</p>
            <p className="text-sm">There are no notifications to show right now.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                onClick={() => markAsRead(notification.id, notification.isRead, notification.link)}
                className={`p-5 flex gap-4 transition ${notification.link ? 'cursor-pointer hover:bg-gray-50' : ''} ${!notification.isRead ? 'bg-blue-50/20' : ''}`}
              >
                <div className="mt-1 flex-shrink-0 bg-gray-50 p-2 rounded-full border">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <p className={`text-base ${!notification.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                      {notification.title}
                    </p>
                    <span className="text-xs font-medium text-gray-400 whitespace-nowrap bg-gray-100 px-2 py-1 rounded-full">
                      {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                </div>
                {!notification.isRead && (
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-2 shadow-sm shadow-blue-200"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={clearConfirm}
        onClose={() => setClearConfirm(false)}
        onConfirm={clearAll}
        title="Clear Notification History"
        description="Are you sure you want to permanently delete your entire notification history? This action cannot be undone."
        confirmText="Yes, Clear History"
        isLoading={isClearing}
      />

      {broadcastConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Broadcast Notification</h2>
            <form onSubmit={handleBroadcast} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  required 
                  value={broadcastData.title}
                  onChange={(e) => setBroadcastData({...broadcastData, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. System Maintenance"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea 
                  required 
                  value={broadcastData.message}
                  onChange={(e) => setBroadcastData({...broadcastData, message: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  placeholder="Detailed message..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select 
                  value={broadcastData.type}
                  onChange={(e) => setBroadcastData({...broadcastData, type: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="SYSTEM">System Alert</option>
                  <option value="TEAM">Team Update</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <button 
                  type="button" 
                  onClick={() => setBroadcastConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
