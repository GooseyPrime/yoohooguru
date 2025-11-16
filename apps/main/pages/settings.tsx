import { GetServerSideProps } from 'next';
import { getSession, useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import Seo from '../components/Seo';
import Navigation from '../components/ui/Navigation';
// import Link from 'next/link'; // Unused import

export default function Settings() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const tabs = [
    { id: 'account', label: 'Account', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy & Security', icon: '🔒' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
  ];

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Placeholder for save settings logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo
        title="Settings | YooHoo.Guru"
        description="Manage your YooHoo.Guru account settings"
        url="https://www.yoohoo.guru/settings"
      />

      <Navigation />

      <main className="min-h-screen section-padding">
        <div className="container-custom max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Settings
            </h1>
            <p className="text-xl text-white-80">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 rounded-2xl space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 text-left ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 text-white'
                        : 'text-white-80 hover:bg-white-10'
                    }`}
                  >
                    <span className="text-2xl">{tab.icon}</span>
                    <span className="font-semibold">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="glass-card p-8 rounded-2xl">
                {message && (
                  <div
                    className={`mb-6 p-4 rounded-xl ${
                      message.type === 'success'
                        ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                        : 'bg-red-500/20 border border-red-500/30 text-red-400'
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                {activeTab === 'account' && (
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white mb-6">Account Settings</h2>
                    <form onSubmit={handleSaveSettings} className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                          Display Name
                        </label>
                        <input
                          type="text"
                          defaultValue={session?.user?.name || ''}
                          className="input-premium w-full"
                          placeholder="Your name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          defaultValue={session?.user?.email || ''}
                          className="input-premium w-full"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                          Bio
                        </label>
                        <textarea
                          className="input-premium w-full min-h-[120px]"
                          placeholder="Tell us about yourself..."
                        />
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-white-10">
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-glow-emerald disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                        </button>

                        <button
                          type="button"
                          onClick={() => signOut()}
                          className="text-red-400 hover:text-red-300 font-semibold transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white mb-6">Notification Preferences</h2>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 glass-effect rounded-xl">
                        <div>
                          <div className="text-white font-semibold mb-1">Email Notifications</div>
                          <div className="text-sm text-white-60">Receive email updates about your activity</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-white-20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 glass-effect rounded-xl">
                        <div>
                          <div className="text-white font-semibold mb-1">Push Notifications</div>
                          <div className="text-sm text-white-60">Receive push notifications on your devices</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-white-20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 glass-effect rounded-xl">
                        <div>
                          <div className="text-white font-semibold mb-1">Marketing Emails</div>
                          <div className="text-sm text-white-60">Receive emails about new features and promotions</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-white-20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white mb-6">Privacy & Security</h2>
                    <div className="space-y-6">
                      <div className="p-6 glass-effect rounded-xl">
                        <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                        <form className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-white mb-2">
                              Current Password
                            </label>
                            <input
                              type="password"
                              className="input-premium w-full"
                              placeholder="••••••••"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-white mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              className="input-premium w-full"
                              placeholder="••••••••"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-white mb-2">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              className="input-premium w-full"
                              placeholder="••••••••"
                            />
                          </div>
                          <button
                            type="submit"
                            className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
                          >
                            Update Password
                          </button>
                        </form>
                      </div>

                      <div className="p-6 glass-effect rounded-xl">
                        <h3 className="text-lg font-semibold text-white mb-2">Two-Factor Authentication</h3>
                        <p className="text-sm text-white-60 mb-4">
                          Add an extra layer of security to your account
                        </p>
                        <button className="px-6 py-2 glass-button text-white font-semibold rounded-xl hover:bg-white-20 transition-all duration-300">
                          Enable 2FA
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white mb-6">User Preferences</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                          Language
                        </label>
                        <select className="input-premium w-full">
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                          Timezone
                        </label>
                        <select className="input-premium w-full">
                          <option value="America/New_York">Eastern Time (ET)</option>
                          <option value="America/Chicago">Central Time (CT)</option>
                          <option value="America/Denver">Mountain Time (MT)</option>
                          <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                          Default Role
                        </label>
                        <select className="input-premium w-full">
                          <option value="gunu">Gunu (Learner)</option>
                          <option value="guru">Guru (Teacher)</option>
                          <option value="angel">Angel (Service Provider)</option>
                          <option value="hero">Hero (Volunteer)</option>
                        </select>
                      </div>

                      <button
                        onClick={handleSaveSettings}
                        disabled={loading}
                        className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-glow-emerald disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Saving...' : 'Save Preferences'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
