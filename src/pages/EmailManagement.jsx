import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const EmailManagement = ({ token }) => {
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  // Users data
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState({});

  // Email templates
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Email campaigns
  const [campaigns, setCampaigns] = useState([]);
  const [campaignStats, setCampaignStats] = useState({});

  // Email form
  const [emailForm, setEmailForm] = useState({
    name: '',
    subject: '',
    content: '',
    recipientType: 'newsletter_subscribers',
    customRecipients: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchTemplates();
    fetchCampaigns();
    fetchCampaignStats();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/email/users`, {
        headers: { token }
      });
      if (response.data.success) {
        setUsers(response.data.users);
        setUserStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/email/templates`, {
        headers: { token }
      });
      if (response.data.success) {
        setTemplates(response.data.templates);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/email/campaigns`, {
        headers: { token }
      });
      if (response.data.success) {
        setCampaigns(response.data.campaigns);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const fetchCampaignStats = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/email/campaigns/stats`, {
        headers: { token }
      });
      if (response.data.success) {
        setCampaignStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching campaign stats:', error);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setEmailForm(prev => ({
      ...prev,
      subject: template.subject,
      content: template.content
    }));
  };

  const sendEmailCampaign = async () => {
    if (!emailForm.name || !emailForm.subject || !emailForm.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSending(true);
    try {
      const response = await axios.post(`${backendUrl}/api/email/campaigns/send`, {
        ...emailForm,
        customRecipients: emailForm.recipientType === 'custom' 
          ? emailForm.customRecipients.split(',').map(email => email.trim())
          : []
      }, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setEmailForm({
          name: '',
          subject: '',
          content: '',
          recipientType: 'newsletter_subscribers',
          customRecipients: ''
        });
        setSelectedTemplate(null);
        fetchCampaigns();
        fetchCampaignStats();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error sending email campaign:', error);
      toast.error('Failed to send email campaign');
    } finally {
      setSending(false);
    }
  };

  const getRecipientCount = () => {
    switch (emailForm.recipientType) {
      case 'all':
        return userStats.total || 0;
      case 'newsletter_subscribers':
        return userStats.newsletterSubscribers || 0;
      case 'notifications_enabled':
        return userStats.notificationEnabled || 0;
      case 'custom':
        return emailForm.customRecipients ? emailForm.customRecipients.split(',').length : 0;
      default:
        return 0;
    }
  };

  const getUsersByPreference = (preference) => {
    if (preference === 'all') {
      return users;
    } else if (preference === 'newsletter_subscribers') {
      return users.filter(user => user.preferences?.newsletter);
    } else if (preference === 'notifications_enabled') {
      return users.filter(user => user.preferences?.notifications);
    } else if (preference === 'no_preferences') {
      return users.filter(user => !user.preferences?.newsletter && !user.preferences?.notifications);
    }
    return [];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Email Management</h1>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-8 shadow-sm">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-gray-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'campaigns'
                ? 'bg-gray-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Email Campaigns
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'templates'
                ? 'bg-gray-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Email Templates
          </button>
          <button
            onClick={() => setActiveTab('send')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'send'
                ? 'bg-gray-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Send Email
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">User Management</h2>
            
            {/* User Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900">{userStats.total || 0}</h3>
                <p className="text-gray-700">Total Users</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900">{userStats.newsletterSubscribers || 0}</h3>
                <p className="text-green-700">Newsletter Subscribers</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-900">{userStats.notificationEnabled || 0}</h3>
                <p className="text-yellow-700">Notifications Enabled</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900">{userStats.withProfilePhoto || 0}</h3>
                <p className="text-purple-700">With Profile Photo</p>
              </div>
            </div>

            {/* User Categories */}
            <div className="space-y-6">
              {/* Newsletter Subscribers */}
              <div>
                <h3 className="text-lg font-medium mb-3 text-green-700">
                  Newsletter Subscribers ({userStats.newsletterSubscribers || 0})
                </h3>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getUsersByPreference('newsletter_subscribers').map((user) => (
                      <div key={user._id} className="bg-white p-3 rounded border">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            {user.profilePhoto ? (
                              <img src={user.profilePhoto} alt="" className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <span className="text-green-600 font-semibold">{user.name?.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notification Enabled Users */}
              <div>
                <h3 className="text-lg font-medium mb-3 text-yellow-700">
                  Notifications Enabled ({userStats.notificationEnabled || 0})
                </h3>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getUsersByPreference('notifications_enabled').map((user) => (
                      <div key={user._id} className="bg-white p-3 rounded border">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                            {user.profilePhoto ? (
                              <img src={user.profilePhoto} alt="" className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <span className="text-yellow-600 font-semibold">{user.name?.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Users with No Preferences */}
              <div>
                <h3 className="text-lg font-medium mb-3 text-gray-700">
                  No Email Preferences ({getUsersByPreference('no_preferences').length})
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getUsersByPreference('no_preferences').map((user) => (
                      <div key={user._id} className="bg-white p-3 rounded border">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            {user.profilePhoto ? (
                              <img src={user.profilePhoto} alt="" className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <span className="text-gray-600 font-semibold">{user.name?.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Email Campaigns</h2>
            
            {/* Campaign Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900">{campaignStats.totalCampaigns || 0}</h3>
                <p className="text-gray-700">Total Campaigns</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900">{campaignStats.totalSent || 0}</h3>
                <p className="text-green-700">Total Sent</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-red-900">{campaignStats.totalFailed || 0}</h3>
                <p className="text-red-700">Total Failed</p>
              </div>
            </div>

            {/* Campaigns List */}
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{campaign.name}</h3>
                      <p className="text-gray-600">{campaign.subject}</p>
                      <div className="flex space-x-4 mt-2 text-sm">
                        <span className="text-gray-600">Recipients: {campaign.totalRecipients}</span>
                        <span className="text-green-600">Sent: {campaign.sentCount}</span>
                        <span className="text-red-600">Failed: {campaign.failedCount}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs ${
                        campaign.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {campaign.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(campaign.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Email Templates Tab */}
        {activeTab === 'templates' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Email Templates</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div key={template._id} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                  <p className="text-gray-600 mb-2">{template.subject}</p>
                  <p className="text-sm text-gray-500 mb-3">{template.type}</p>
                  <button
                    onClick={() => handleTemplateSelect(template)}
                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                  >
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Send Email Tab */}
        {activeTab === 'send' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Send Email Campaign</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                <input
                  type="text"
                  value={emailForm.name}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter campaign name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email subject"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Type</label>
                <select
                  value={emailForm.recipientType}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, recipientType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newsletter_subscribers">Newsletter Subscribers</option>
                  <option value="notifications_enabled">Notifications Enabled</option>
                  <option value="all">All Users</option>
                  <option value="custom">Custom Recipients</option>
                </select>
              </div>
              
              {emailForm.recipientType === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Custom Recipients (comma-separated emails)</label>
                  <input
                    type="text"
                    value={emailForm.customRecipients}
                    onChange={(e) => setEmailForm(prev => ({ ...prev, customRecipients: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="email1@example.com, email2@example.com"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML)</label>
                <textarea
                  value={emailForm.content}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, content: e.target.value }))}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email content (HTML supported)"
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800">
                  <strong>Recipients:</strong> {getRecipientCount()} users will receive this email
                </p>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={sendEmailCampaign}
                  disabled={sending}
                  className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50"
                >
                  {sending ? 'Sending...' : 'Send Campaign'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailManagement; 