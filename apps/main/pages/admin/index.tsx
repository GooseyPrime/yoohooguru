import { useCallback, useEffect, useMemo, useState } from 'react'
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

interface OverviewData {
  users: {
    total: number
    heroGuruUsers: number
    active: number
    suspended: number
  }
  content: {
    totalEntries: number
    published: number
    draft: number
    subdomains: string[]
  }
  security: {
    lastAdminLogin: string
    sessionValid: boolean
    csrf: boolean
    rateLimiting: boolean
  }
  databases: {
    collections: string[]
    backupEnabled: boolean
    lastBackup: string
  }
}

interface AdminData {
  agents: {
    curation: CurationAgents
    backup?: {
      enabled: boolean
      lastBackup?: string
    }
  }
}

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  status: string
  lastActive: string
  signUp: string
  entries: number
  region: string
  heroGuru: boolean
}

interface AdminContentEntry {
  id: string
  title: string
  category: string
  subdomain: string
  status: string
  type: string
  createdAt: string
  updatedAt: string
}

interface Financials {
  currency: string
  heroGuru: {
    type: string
    donations: number
    grants: number
    expenses: number
    reserved: number
  }
  commercial: {
    type: string
    revenue: number
    refunds: number
    expenses: number
    deferred: number
  }
  ledger: {
    id: string
    label: string
    amount: number
    channel: string
    category: string
    createdAt: number
  }[]
  summary: {
    netPosition: number
    commercialNet: number
  }
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'agents', label: 'AI Agents', icon: '🤖' },
  { id: 'content', label: 'Content', icon: '📝' },
  { id: 'users', label: 'Users', icon: '👥' },
  { id: 'financials', label: 'Financials', icon: '💰' },
  { id: 'exports', label: 'Exports', icon: '📂' },
  { id: 'settings', label: 'Settings', icon: '⚙️' }
]

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [adminKey, setAdminKey] = useState('')
  const [error, setError] = useState<string | null>(null)

  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [overview, setOverview] = useState<OverviewData | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [content, setContent] = useState<AdminContentEntry[]>([])
  const [financials, setFinancials] = useState<Financials | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionMessage, setActionMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)

  const formatDate = useCallback((value?: string | number | null) => {
    if (!value) return '—'
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString()
  }, [])

  const fetchJson = useCallback(async (url: string) => {
    const response = await fetch(url, { credentials: 'include' })
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.error?.message || 'Request failed')
    }
    return response.json()
  }, [])

  const loadAdminData = useCallback(async () => {
    try {
      setLoading(true)
      const [agentsResponse, overviewResponse, usersResponse, contentResponse, financialsResponse] = await Promise.all([
        fetchJson('/api/admin/agents-status'),
        fetchJson('/api/admin/console/overview'),
        fetchJson('/api/admin/console/users'),
        fetchJson('/api/admin/console/content'),
        fetchJson('/api/admin/console/financials')
      ])

      setAdminData({ agents: agentsResponse.agents })
      setOverview(overviewResponse.data)
      setUsers(usersResponse.data)
      setContent(contentResponse.data)
      setFinancials(financialsResponse.data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }, [fetchJson])

  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/ping', { credentials: 'include' })
      if (response.ok) {
        setIsAuthenticated(true)
        await loadAdminData()
      } else {
        setIsAuthenticated(false)
      }
    } catch {
      setIsAuthenticated(false)
    } finally {
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
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ key: adminKey })
      })

      if (response.ok) {
        setIsAuthenticated(true)
        setError(null)
        await loadAdminData()
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
        setActionMessage('Content curation triggered successfully')
        await loadAdminData()
      } else {
        const errorData = await response.json()
        setActionMessage(`Failed to trigger curation: ${errorData.error?.message || 'Unknown error'}`)
      }
    } catch {
      setActionMessage('Failed to trigger curation')
    }
  }

  const handleRemoveContent = async (entry: AdminContentEntry) => {
    try {
      const response = await fetch(`/api/admin/console/content/${entry.id}/remove`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subdomain: entry.subdomain, type: entry.type })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Failed to remove content')
      }

      setContent(prev => prev.filter(item => item.id !== entry.id))
      setActionMessage('Content removed successfully')
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : 'Removal failed')
    }
  }

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users
    const term = searchTerm.toLowerCase()
    return users.filter(user =>
      (user.name || '').toLowerCase().includes(term) ||
      (user.email || '').toLowerCase().includes(term) ||
      (user.region || '').toLowerCase().includes(term)
    )
  }, [users, searchTerm])

  const renderOverview = () => {
    if (!overview) return null

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <OrbitronCard className="p-6">
            <div className="text-2xl text-blue-400 mb-2">👥</div>
            <div className="text-white text-lg font-bold">Users</div>
            <div className="text-gray-400">Total: {overview.users.total}</div>
            <div className="text-gray-400">Hero-Gurus: {overview.users.heroGuruUsers}</div>
            <div className="text-gray-400">Active: {overview.users.active}</div>
            <div className="text-gray-400">Suspended: {overview.users.suspended}</div>
          </OrbitronCard>

          <OrbitronCard className="p-6">
            <div className="text-2xl text-green-400 mb-2">📝</div>
            <div className="text-white text-lg font-bold">Content</div>
            <div className="text-gray-400">Entries: {overview.content.totalEntries}</div>
            <div className="text-gray-400">Published: {overview.content.published}</div>
            <div className="text-gray-400">Drafts: {overview.content.draft}</div>
            <div className="text-gray-400">Subdomains: {overview.content.subdomains.length}</div>
          </OrbitronCard>

          <OrbitronCard className="p-6">
            <div className="text-2xl text-purple-400 mb-2">🛡️</div>
            <div className="text-white text-lg font-bold">Security</div>
            <div className="text-gray-400">Last Admin Login: {formatDate(overview.security.lastAdminLogin)}</div>
            <div className="text-gray-400">CSRF Protection: {overview.security.csrf ? 'Enabled' : 'Disabled'}</div>
            <div className="text-gray-400">Rate Limits: {overview.security.rateLimiting ? 'Enabled' : 'Disabled'}</div>
          </OrbitronCard>
        </div>

        <OrbitronCard className="p-6">
          <h3 className="text-white text-xl font-bold mb-4">Databases & Backups</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-gray-400">Collections</div>
              <div className="text-white font-semibold">{overview.databases.collections.join(', ')}</div>
            </div>
            <div className="text-gray-400">
              Backup Enabled: {overview.databases.backupEnabled ? 'Yes' : 'No'} | Last Backup: {formatDate(overview.databases.lastBackup)}
            </div>
          </div>
        </OrbitronCard>
      </div>
    )
  }

  const renderAgents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-white text-xl font-bold">AI Curation Agents</h3>
        <OrbitronButton onClick={triggerCuration} variant="gradient">
          🔄 Manual Trigger
        </OrbitronButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AgentCard
          title="News Curation Agent"
          description="Generates news articles daily"
          status={adminData?.agents?.curation?.newsAgent}
        />
        <AgentCard
          title="Blog Curation Agent"
          description="Generates blog posts weekly"
          status={adminData?.agents?.curation?.blogAgent}
        />
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

  const renderContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-white text-xl font-bold">Content Management</h3>
        <OrbitronButton variant="ghost" onClick={loadAdminData}>
          🔄 Refresh
        </OrbitronButton>
      </div>

      <OrbitronCard className="p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-300 text-sm">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Subdomain</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {content.map(item => (
              <tr key={item.id} className="border-t border-white/5">
                <td className="px-4 py-3 text-white">{item.title}</td>
                <td className="px-4 py-3 text-gray-300">{item.category}</td>
                <td className="px-4 py-3 text-gray-300">{item.subdomain}</td>
                <td className="px-4 py-3 text-gray-300">{item.status}</td>
                <td className="px-4 py-3 text-gray-300">{formatDate(item.updatedAt)}</td>
                <td className="px-4 py-3 text-right">
                  <OrbitronButton size="sm" variant="ghost" onClick={() => handleRemoveContent(item)}>
                    🗑️ Remove
                  </OrbitronButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </OrbitronCard>
    </div>
  )

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-white text-xl font-bold">User Management</h3>
          <p className="text-gray-400">Search, review, and drill into user activity</p>
        </div>
        <input
          type="text"
          placeholder="Search users by name, email, or region"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-80 p-3 bg-black/30 border border-gray-600 rounded text-white placeholder-gray-400"
        />
      </div>

      <OrbitronCard className="p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-300 text-sm">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Region</th>
              <th className="px-4 py-3">Entries</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-t border-white/5">
                <td className="px-4 py-3 text-white">{user.name}</td>
                <td className="px-4 py-3 text-gray-300">{user.email}</td>
                <td className="px-4 py-3 text-gray-300">{user.role}</td>
                <td className="px-4 py-3 text-gray-300">{user.status}</td>
                <td className="px-4 py-3 text-gray-300">{user.region}</td>
                <td className="px-4 py-3 text-gray-300">{user.entries}</td>
                <td className="px-4 py-3 text-right">
                  <OrbitronButton size="sm" variant="ghost" onClick={() => setSelectedUser(user)}>
                    🔍 View
                  </OrbitronButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </OrbitronCard>

      {selectedUser && (
        <OrbitronCard className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-white text-lg font-bold mb-2">{selectedUser.name}</h4>
              <p className="text-gray-300">{selectedUser.email}</p>
              <p className="text-gray-400">Role: {selectedUser.role} | Region: {selectedUser.region}</p>
              <p className="text-gray-400">Entries: {selectedUser.entries} | Hero-Guru: {selectedUser.heroGuru ? 'Yes' : 'No'}</p>
              <p className="text-gray-400">Last Active: {formatDate(selectedUser.lastActive)}</p>
              <p className="text-gray-400">Signed Up: {formatDate(selectedUser.signUp)}</p>
            </div>
            <OrbitronButton size="sm" variant="ghost" onClick={() => setSelectedUser(null)}>
              ✖ Close
            </OrbitronButton>
          </div>
        </OrbitronCard>
      )}
    </div>
  )

  const renderFinancials = () => {
    if (!financials) return null

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <OrbitronCard className="p-6">
            <div className="text-2xl text-emerald-400 mb-2">🤝 Non-profit (Hero-Gurus)</div>
            <div className="text-white text-lg font-bold">Donations: {financials.heroGuru.donations.toLocaleString()}</div>
            <div className="text-gray-400">Grants: {financials.heroGuru.grants.toLocaleString()}</div>
            <div className="text-gray-400">Expenses: {financials.heroGuru.expenses.toLocaleString()}</div>
            <div className="text-gray-400">Reserved: {financials.heroGuru.reserved.toLocaleString()}</div>
            <div className="text-white font-semibold mt-2">Net Position: {financials.summary.netPosition.toLocaleString()} {financials.currency}</div>
          </OrbitronCard>

          <OrbitronCard className="p-6">
            <div className="text-2xl text-yellow-400 mb-2">💼 For-profit</div>
            <div className="text-white text-lg font-bold">Revenue: {financials.commercial.revenue.toLocaleString()}</div>
            <div className="text-gray-400">Refunds: {financials.commercial.refunds.toLocaleString()}</div>
            <div className="text-gray-400">Expenses: {financials.commercial.expenses.toLocaleString()}</div>
            <div className="text-gray-400">Deferred: {financials.commercial.deferred.toLocaleString()}</div>
            <div className="text-white font-semibold mt-2">Commercial Net: {financials.summary.commercialNet.toLocaleString()} {financials.currency}</div>
          </OrbitronCard>
        </div>

        <OrbitronCard className="p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5 text-white font-semibold">Recent Transactions</div>
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-300 text-sm">
              <tr>
                <th className="px-4 py-3">Label</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Channel</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {financials.ledger.map(entry => (
                <tr key={entry.id} className="border-t border-white/5">
                  <td className="px-4 py-3 text-white">{entry.label}</td>
                  <td className={`px-4 py-3 ${Number(entry.amount || 0) < 0 ? 'text-red-300' : 'text-emerald-300'}`}>
                    {Number(entry.amount || 0).toLocaleString()} {financials.currency}
                  </td>
                  <td className="px-4 py-3 text-gray-300">{entry.channel}</td>
                  <td className="px-4 py-3 text-gray-300">{entry.category}</td>
                  <td className="px-4 py-3 text-gray-300">{formatDate(entry.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </OrbitronCard>
      </div>
    )
  }

  const renderExports = () => (
    <div className="space-y-6">
      <h3 className="text-white text-xl font-bold">Exports & Auditing</h3>
      <OrbitronCard className="p-6 space-y-4">
        <p className="text-gray-300">Download CSV snapshots of admin-visible data for audit or finance review.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="/api/admin/console/export"
            className="inline-flex items-center justify-center px-4 py-3 rounded bg-blue-500/80 text-white font-semibold hover:bg-blue-500"
          >
            📥 Export Users CSV
          </a>
          <OrbitronButton variant="ghost" onClick={loadAdminData}>
            🔄 Refresh Data
          </OrbitronButton>
        </div>
      </OrbitronCard>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-white text-xl font-bold">Platform Settings</h3>
      <OrbitronCard className="p-6">
        <div className="text-gray-300">
          Core administrative controls are protected by the server-side admin session. Rotate the ADMIN_KEY environment variable and SESSION_SECRET regularly. Ensure backups remain enabled for database collections.
        </div>
      </OrbitronCard>
    </div>
  )

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
        return renderOverview()
      case 'agents':
        return renderAgents()
      case 'content':
        return renderContent()
      case 'users':
        return renderUsers()
      case 'financials':
        return renderFinancials()
      case 'exports':
        return renderExports()
      case 'settings':
        return renderSettings()
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
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
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
          {actionMessage && <p className="text-emerald-300 mt-2">{actionMessage}</p>}
          {error && <p className="text-red-400 mt-2">{error}</p>}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
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

          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </main>

      <Footer />
    </OrbitronContainer>
  )
}

function AgentCard({ title, description, status }: { title: string; description: string; status?: AgentStatus }) {
  return (
    <OrbitronCard className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-2xl">🤖</div>
        <div>
          <h4 className="text-white text-lg font-bold">{title}</h4>
          <div className="text-gray-400 text-sm">{description}</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-400">Status:</span>
          <span className={`px-2 py-1 rounded text-xs font-bold ${
            status?.status === 'running'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}>
            {status?.status || 'Unknown'}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Last Started:</span>
          <span className="text-white text-sm">
            {status?.lastStarted
              ? new Date(status.lastStarted).toLocaleString()
              : 'Never'}
          </span>
        </div>

        {status?.error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded p-3 mt-2">
            <div className="text-red-400 text-sm font-bold">Error:</div>
            <div className="text-red-300 text-sm">{status.error}</div>
          </div>
        )}
      </div>
    </OrbitronCard>
  )
}
