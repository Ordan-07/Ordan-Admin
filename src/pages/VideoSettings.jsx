import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const VideoSettings = ({ token }) => {
  const [settings, setSettings] = useState({
    videoUrl: '',
    title: '',
    description: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const fetchVideoSettings = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/video/video-settings`);
      if (response.data.success) {
        setSettings(response.data.settings);
        setPreviewUrl(response.data.settings.videoUrl);
      }
    } catch (error) {
      console.log('Error fetching video settings:', error);
      toast.error('Failed to load video settings');
    }
  };

  const updateVideoSettings = async () => {
    if (!settings.videoUrl.trim()) {
      toast.error('Please enter a video URL');
      return;
    }

    if (!settings.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!settings.description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/video/update-video-settings`,
        settings,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success('Video settings updated successfully!');
        setPreviewUrl(settings.videoUrl);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log('Error updating video settings:', error);
      toast.error('Failed to update video settings');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setSettings(prev => ({ ...prev, videoUrl: url }));
    
    // Auto-convert regular YouTube URL to embed URL
    if (url.includes('youtube.com/watch?v=') || url.includes('youtu.be/')) {
      const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      if (videoIdMatch) {
        const embedUrl = `https://www.youtube.com/embed/${videoIdMatch[1]}`;
        setSettings(prev => ({ ...prev, videoUrl: embedUrl }));
        setPreviewUrl(embedUrl);
      }
    } else if (url.includes('youtube.com/embed/')) {
      setPreviewUrl(url);
    }
  };

  useEffect(() => {
    fetchVideoSettings();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Video Settings</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Video URL</label>
              <input
                type="url"
                value={settings.videoUrl}
                onChange={handleUrlChange}
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter YouTube embed URL or regular YouTube URL (will be auto-converted)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={settings.title}
                onChange={(e) => setSettings(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Video title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={settings.description}
                onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Video description"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={settings.isActive}
                onChange={(e) => setSettings(prev => ({ ...prev, isActive: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="isActive" className="text-sm font-medium">
                Show video on home page
              </label>
            </div>

            <button
              onClick={updateVideoSettings}
              disabled={loading}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Video Settings'}
            </button>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preview</h3>
            
            {settings.isActive ? (
              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50 border-b">
                  <h4 className="font-medium">{settings.title || 'Video Title'}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {settings.description || 'Video description will appear here'}
                  </p>
                </div>
                
                {previewUrl ? (
                  <div className="relative pb-[56.25%] h-0">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={previewUrl}
                      title="Video Preview"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    Enter a video URL to see preview
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 border rounded-lg">
                Video is currently hidden from the home page
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Instructions</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Enter YouTube embed URL or regular YouTube URL</li>
                <li>• Regular URLs will be automatically converted to embed format</li>
                <li>• The video will appear on the home page below the FAQ section</li>
                <li>• Uncheck "Show video" to hide it from the home page</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSettings; 