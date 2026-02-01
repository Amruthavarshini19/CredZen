import { useState, useEffect } from 'react';
import { Settings, User, Bell, Lock, Palette, Mail, Phone } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { Button } from '@/app/components/ui/button';

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
}

interface NotificationSettings {
  paymentReminders: boolean;
  learningProgress: boolean;
  cardRecommendations: boolean;
  utilizationAlerts: boolean;
}

const PROFILE_STORAGE_KEY = 'credzen_profile';
const NOTIFICATIONS_STORAGE_KEY = 'credzen_notifications';

export function SettingsPage() {
  const [profile, setProfile] = useState<ProfileData>({
    fullName: '',
    email: '',
    phone: '',
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    paymentReminders: true,
    learningProgress: true,
    cardRecommendations: false,
    utilizationAlerts: true,
  });

  const [saveMessage, setSaveMessage] = useState('');

  // Load profile data on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
    const savedNotifications = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);

    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }

    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  }, []);

  const handleProfileChange = (field: keyof ProfileData, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveProfile = () => {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    setSaveMessage('Profile saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleSaveNotifications = () => {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    setSaveMessage('Notification settings saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-purple-900/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Settings
          </h1>
        </div>
        <p className="text-lg text-gray-300">
          Manage your account preferences and settings
        </p>
      </div>

      {/* Profile Settings */}
      <div className="bg-purple-900/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Profile Information</h2>
        </div>
        {saveMessage && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm">
            {saveMessage}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName" className="text-gray-200">Full Name</Label>
            <Input
              id="fullName"
              value={profile.fullName}
              onChange={(e) => handleProfileChange('fullName', e.target.value)}
              className="bg-black/30 border-purple-500/50 text-white"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="text-gray-200">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  className="bg-black/30 border-purple-500/50 text-white pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone" className="text-gray-200">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  className="bg-black/30 border-purple-500/50 text-white pl-10"
                />
              </div>
            </div>
          </div>
          <Button
            onClick={handleSaveProfile}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
            Save Changes
          </Button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-purple-900/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Notifications</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-purple-500/20 rounded-xl border border-purple-400/30">
            <div>
              <p className="font-medium text-white">Payment Reminders</p>
              <p className="text-sm text-gray-300">Get notified before payment due dates</p>
            </div>
            <Switch
              checked={notifications.paymentReminders}
              onCheckedChange={(value) => handleNotificationChange('paymentReminders', value)}
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-purple-500/20 rounded-xl border border-purple-400/30">
            <div>
              <p className="font-medium text-white">Learning Progress</p>
              <p className="text-sm text-gray-300">Updates on your learning achievements</p>
            </div>
            <Switch
              checked={notifications.learningProgress}
              onCheckedChange={(value) => handleNotificationChange('learningProgress', value)}
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-purple-500/20 rounded-xl border border-purple-400/30">
            <div>
              <p className="font-medium text-white">Card Recommendations</p>
              <p className="text-sm text-gray-300">New card suggestions based on your profile</p>
            </div>
            <Switch
              checked={notifications.cardRecommendations}
              onCheckedChange={(value) => handleNotificationChange('cardRecommendations', value)}
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-purple-500/20 rounded-xl border border-purple-400/30">
            <div>
              <p className="font-medium text-white">Utilization Alerts</p>
              <p className="text-sm text-gray-300">Alerts when utilization exceeds 30%</p>
            </div>
            <Switch
              checked={notifications.utilizationAlerts}
              onCheckedChange={(value) => handleNotificationChange('utilizationAlerts', value)}
            />
          </div>
          <Button
            onClick={handleSaveNotifications}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white w-full">
            Save Notification Settings
          </Button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-purple-900/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Security</h2>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="currentPassword" className="text-gray-200">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="••••••••"
              className="bg-black/30 border-purple-500/50 text-white placeholder:text-gray-500"
            />
          </div>
          <div>
            <Label htmlFor="newPassword" className="text-gray-200">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              className="bg-black/30 border-purple-500/50 text-white placeholder:text-gray-500"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="text-gray-200">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="bg-black/30 border-purple-500/50 text-white placeholder:text-gray-500"
            />
          </div>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
            Update Password
          </Button>
        </div>

        <div className="mt-6 p-4 bg-purple-500/20 rounded-xl border border-purple-400/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Two-Factor Authentication</p>
              <p className="text-sm text-gray-300">Add an extra layer of security</p>
            </div>
            <Button variant="outline" className="border-2 border-purple-400 hover:bg-purple-500/20 text-white">
              Enable
            </Button>
          </div>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="bg-purple-900/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
        <div className="flex items-center gap-2 mb-6">
          <Palette className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Appearance</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-purple-500/20 rounded-xl border border-purple-400/30">
            <div>
              <p className="font-medium text-white">Dark Mode</p>
              <p className="text-sm text-gray-300">Currently enabled</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30">
            <p className="text-sm text-gray-200 mb-3">
              <strong className="text-white">Current Theme:</strong> Dark Purple Gradient
            </p>
            <div className="flex gap-2">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white shadow-lg" />
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-900 to-purple-900" />
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-900/30 backdrop-blur-sm rounded-2xl p-6 border border-red-500/30">
        <h2 className="text-xl font-semibold text-red-400 mb-4">Danger Zone</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-red-500/20 rounded-xl border border-red-400/30">
            <div>
              <p className="font-medium text-white">Reset App Data</p>
              <p className="text-sm text-gray-300">Clear all saved cards, activities, and settings</p>
            </div>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Reset
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-red-500/20 rounded-xl border border-red-400/30">
            <div>
              <p className="font-medium text-white">Delete Account</p>
              <p className="text-sm text-gray-300">Permanently delete your account and all data</p>
            </div>
            <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
