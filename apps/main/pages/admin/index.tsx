import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import { Header, Footer } from '@yoohooguru/shared'
import { OrbitronContainer, OrbitronCard, OrbitronButton } from '../../components/orbitron'

interface AgentStatus {
  status: string
  error: string | null
  lastStarted: string
}

interface CurationAgents {
  newsAgent: AgentStatus
  blogAgent: AgentStatus
  environment: string
  timestamp: string
}

interface AdminData {
  agents: {
    curation: CurationAgents;
    backup?: {
      enabled: boolean;
      lastBackup?: string;
    };
  };
  users?: {
    total: number;
    active: number;
  };
  content?: {
    articles: number;
    posts: number;
  };
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [adminKey, setAdminKey] = useState('')

  const loadAdminData = useCallback(async () => {
    try {
      setLoading(true)
      const [agentsResponse] = await Promise.all([
        fetch('/api/admin/agents-status', { credentials: 'include' })
      ])

      if (agentsResponse.ok) {
        const agentsData = await agentsResponse.json()
        setAdminData({ agents: agentsData.agents })
      }
    } catch {
      setError('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }, [])

  const checkAuthStatus = useCallback(() => {
    const authCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('yoohoo_admin='))
    
    if (authCookie && authCookie.split('=')[1] === '1') {
      setIsAuthenticated(true)
      loadAdminData()
    } else {
      setLoading(false)
    }
  }, [loadAdminData])

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key: adminKey })
      })

      if (response.ok) {
        setIsAuthenticated(true)
        loadAdminData()
        setError(null)
      } else {
        const errorData = await response.json()
        setError(errorData.error?.message || 'Invalid admin key')
      }
    } catch {
      setError('Failed to authenticate')
    }
  }

  const triggerCuration = async () => {
    try {
      const response = await fetch('/api/admin/curate', {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        alert('Content curation triggered successfully!')
        loadAdminData() // Refresh data
      } else {
        const errorData = await response.json()
        alert(`Failed to trigger curation: ${errorData.error?.message || 'Unknown error'}`)
      }
    } catch {
      alert('Failed to trigger curation')
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'agents', label: 'AI Agents', icon: '🤖' },
    { id: 'content', label: 'Content', icon: '📝' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ]

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <OrbitronCard className="p-6">
                <div className="text-2xl text-blue-400 mb-2">🤖</div>
                <div className="text-white text-lg font-bold">AI Agents</div>
                <div className="text-gray-400">
                  News: {adminData?.agents?.curation?.newsAgent?.status || 'Unknown'}
                </div>
                <div className="text-gray-400">
                  Blog: {adminData?.agents?.curation?.blogAgent?.status || 'Unknown'}
                </div>
              </OrbitronCard>

              <OrbitronCard className="p-6">
                <div className="text-2xl text-green-400 mb-2">📝</div>
                <div className="text-white text-lg font-bold">Content</div>
                <div className="text-gray-400">Active subdomains: 24</div>
                <div className="text-gray-400">News articles generated</div>
              </OrbitronCard>

              <OrbitronCard className="p-6">
                <div className="text-2xl text-purple-400 mb-2">🌍</div>
                <div className="text-white text-lg font-bold">Environment</div>
                <div className="text-gray-400">{adminData?.agents?.curation?.environment || &apos;Unknown&apos;}</div>
                <div className="text-gray-400">Production</div>
              </OrbitronCard>
            </div>

            <OrbitronCard className="p-6">
              <h3 className="text-white text-xl font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <OrbitronButton 
                  onClick={triggerCuration}
                  variant="gradient"
                  className="w-full"
                >
                  🔄 Trigger Content Curation
                </OrbitronButton>
                <OrbitronButton 
                  onClick={() => setActiveTab(&apos;agents&apos;)}
                  variant="ghost"
                  className="w-full"
                >
                  🤖 View Agent Status
                </OrbitronButton>
                <OrbitronButton 
                  onClick={() => setActiveTab(&apos;content&apos;)}
                  variant="ghost"
                  className="w-full"
                >
                  📝 Manage Content
                </OrbitronButton>
              </div>
            </OrbitronCard>
          </div>
        )

      case 'agents':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-white text-xl font-bold">AI Curation Agents</h3>
              <OrbitronButton onClick={triggerCuration} variant="gradient">
                🔄 Manual Trigger
              </OrbitronButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <OrbitronCard className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">📰</div>
                  <div>
                    <h4 className="text-white text-lg font-bold">News Curation Agent</h4>
                    <div className="text-gray-400 text-sm">Generates news articles daily</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      adminData?.agents?.curation?.newsAgent?.status === 'running' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {adminData?.agents?.curation?.newsAgent?.status || 'Unknown'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Started:</span>
                    <span className="text-white text-sm">
                      {adminData?.agents?.curation?.newsAgent?.lastStarted 
                        ? new Date(adminData.agents.curation.newsAgent.lastStarted).toLocaleString()
                        : 'Never'
                      }
                    </span>
                  </div>
                  
                  {adminData?.agents?.curation?.newsAgent?.error && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded p-3 mt-2">
                      <div className="text-red-400 text-sm font-bold">Error:</div>
                      <div className="text-red-300 text-sm">{adminData.agents.curation.newsAgent.error}</div>
                    </div>
                  )}
                </div>
              </OrbitronCard>

              <OrbitronCard className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">📝</div>
                  <div>
                    <h4 className="text-white text-lg font-bold">Blog Curation Agent</h4>
                    <div className="text-gray-400 text-sm">Generates blog posts weekly</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      adminData?.agents?.curation?.blogAgent?.status === 'running' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {adminData?.agents?.curation?.blogAgent?.status || 'Unknown'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Started:</span>
                    <span className="text-white text-sm">
                      {adminData?.agents?.curation?.blogAgent?.lastStarted 
                        ? new Date(adminData.agents.curation.blogAgent.lastStarted).toLocaleString()
                        : 'Never'
                      }
                    </span>
                  </div>
                  
                  {adminData?.agents?.curation?.blogAgent?.error && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded p-3 mt-2">
                      <div className="text-red-400 text-sm font-bold">Error:</div>
                      <div className="text-red-300 text-sm">{adminData.agents.curation.blogAgent.error}</div>
                    </div>
                  )}
                </div>
              </OrbitronCard>
            </div>

            <OrbitronCard className="p-6">
              <h4 className="text-white text-lg font-bold mb-4">Agent Schedule</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">📰 News Articles</span>
                  <span className="text-white">Twice daily (6 AM & 3 PM EST)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">📝 Blog Posts</span>
                  <span className="text-white">Weekly on Mondays (10 AM EST)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">🗂️ Content Cleanup</span>
                  <span className="text-white">Max 10 news articles per subdomain</span>
                </div>
              </div>
            </OrbitronCard>
          </div>
        )

      case 'content':
        return (
          <ContentManagement />
        )

      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-white text-xl font-bold">User Management</h3>
              <OrbitronButton variant="ghost">
                👥 View All Users
              </OrbitronButton>
            </div>

            <OrbitronCard className="p-6">
              <div className="text-center text-gray-400">
                User management functionality coming soon...
              </div>
            </OrbitronCard>
          </div>
        )

      case 'settings':
        return (
          <div className="space-y-6">
            <h3 className="text-white text-xl font-bold">Platform Settings</h3>
            
            <OrbitronCard className="p-6">
              <div className="text-center text-gray-400">
                Platform settings functionality coming soon...
              </div>
            </OrbitronCard>
          </div>
        )

      default:
        return null
    }
  }

  if (!isAuthenticated) {
    return (
      <OrbitronContainer gradient="primary">
        <Head>
          <title>Admin Login | YooHoo.Guru</title>
        </Head>
        
        <Header />
        
        <main className="flex-1 flex items-center justify-center p-8">
          <OrbitronCard className="w-full max-w-md p-8">
            <div className="text-center mb-6">
              <h1 className="text-white text-2xl font-bold mb-2">🔐 Admin Access</h1>
              <p className="text-gray-400">Enter your admin key to continue</p>
            </div>
            
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Admin Key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full p-3 bg-black/30 border border-gray-600 rounded text-white placeholder-gray-400"
                onKeyPress={(e) => e.key === &apos;Enter&apos; && handleLogin()}
              />
              
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded p-3">
                  <div className="text-red-400 text-sm">{error}</div>
                </div>
              )}
              
              <OrbitronButton 
                onClick={handleLogin}
                variant="gradient"
                className="w-full"
                disabled={!adminKey.trim()}
              >
                Access Admin Dashboard
              </OrbitronButton>
            </div>
          </OrbitronCard>
        </main>
        
        <Footer />
      </OrbitronContainer>
    )
  }

  return (
    <OrbitronContainer gradient="primary">
      <Head>
        <title>Admin Dashboard | YooHoo.Guru</title>
      </Head>
      
      <Header />
      
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold mb-2">🎯 Admin Dashboard</h1>
          <p className="text-gray-400">Manage platform content, users, and AI agents</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <OrbitronCard className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </OrbitronCard>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </main>
      
      <Footer />
    </OrbitronContainer>
  )
}

// Content Management Component
function ContentManagement() {
  const [subdomains] = useState([
    'angel', 'coach', 'heroes', 'cooking', 'music', 'fitness', 'tech', 'art',
    'design', 'writing', 'photography', 'gardening', 'crafts', 'wellness',
    'finance', 'home', 'data', 'investing', 'marketing', 'sales', 'business',
    'language', 'coding'
  ])
  const [selectedSubdomain, setSelectedSubdomain] = useState('angel')
  const [contentType, setContentType] = useState('news')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-white text-xl font-bold">Content Management</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Subdomain Selector */}
        <OrbitronCard className="p-4">
          <h4 className="text-white font-bold mb-4">Subdomains</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {subdomains.map((subdomain) => (
              <button
                key={subdomain}
                onClick={() => setSelectedSubdomain(subdomain)}
                className={`w-full text-left p-2 rounded transition-colors ${
                  selectedSubdomain === subdomain
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {subdomain}
              </button>
            ))}
          </div>
        </OrbitronCard>

        {/* Content Type Selector */}
        <OrbitronCard className="p-4">
          <h4 className="text-white font-bold mb-4">Content Type</h4>
          <div className="space-y-2">
            <button
              onClick={() => setContentType(&apos;news&apos;)}
              className={`w-full text-left p-2 rounded transition-colors ${
                contentType === 'news'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              📰 News Articles
            </button>
            <button
              onClick={() => setContentType(&apos;blog&apos;)}
              className={`w-full text-left p-2 rounded transition-colors ${
                contentType === 'blog'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              📝 Blog Posts
            </button>
          </div>
        </OrbitronCard>

        {/* Content Preview */}
        <div className="lg:col-span-2">
          <OrbitronCard className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-white font-bold">
                {contentType === 'news' ? '📰 News Articles' : '📝 Blog Posts'} - {selectedSubdomain}
              </h4>
              <OrbitronButton variant="ghost" size="sm">
                🔄 Refresh
              </OrbitronButton>
            </div>
            
            <div className="text-center text-gray-400 py-8">
              Content preview for {selectedSubdomain} {contentType} will be displayed here...
            </div>
          </OrbitronCard>
        </div>
      </div>
    </div>
  )
}