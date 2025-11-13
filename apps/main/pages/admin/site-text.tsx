import { useState, useEffect } from 'react'
import { OrbitronCard, OrbitronButton } from '../../components/orbitron'

interface SiteText {
  id: string
  page: string
  section: string
  key: string
  value: string
  subdomain?: string
  type: 'heading' | 'paragraph' | 'button' | 'meta' | 'other'
}

export default function SiteTextManager() {
  const [texts, setTexts] = useState<SiteText[]>([])
  const [filteredTexts, setFilteredTexts] = useState<SiteText[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPage, setSelectedPage] = useState('all')
  const [selectedSubdomain, setSelectedSubdomain] = useState('all')
  const [editingText, setEditingText] = useState<SiteText | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Simulate site text data - in real implementation, this would come from your CMS/database
  useEffect(() => {
    // This would be an API call to get all site texts
    const mockTexts: SiteText[] = [
      {
        id: '1',
        page: 'homepage',
        section: 'hero',
        key: 'main_heading',
        value: 'Connect. Learn. Grow Together.',
        type: 'heading'
      },
      {
        id: '2',
        page: 'homepage',
        section: 'hero',
        key: 'subtitle',
        value: 'The ultimate skill-sharing community where everyone teaches and everyone learns.',
        type: 'paragraph'
      },
      {
        id: '3',
        page: 'angel',
        section: 'hero',
        key: 'title',
        value: "Angel's List - Local Services & Small Jobs",
        subdomain: 'angel',
        type: 'heading'
      },
      {
        id: '4',
        page: 'coach',
        section: 'hero',
        key: 'title',
        value: 'Coach Guru - Skill Swap & Structured Learning',
        subdomain: 'coach',
        type: 'heading'
      },
      {
        id: '5',
        page: 'heroes',
        section: 'hero',
        key: 'title',
        value: "Hero Guru's - Community Heroes & Local Support",
        subdomain: 'heroes',
        type: 'heading'
      },
      {
        id: '6',
        page: 'fitness',
        section: 'hero',
        key: 'description',
        value: 'Get fit with personal training, yoga, strength training, and nutrition coaching from certified professionals.',
        subdomain: 'fitness',
        type: 'paragraph'
      },
      {
        id: '7',
        page: 'tech',
        section: 'cta',
        key: 'button_text',
        value: 'Start Learning Tech',
        subdomain: 'tech',
        type: 'button'
      },
      {
        id: '8',
        page: 'cooking',
        section: 'features',
        key: 'feature_1',
        value: 'Learn from expert chefs and master culinary techniques',
        subdomain: 'cooking',
        type: 'paragraph'
      }
    ]

    setTexts(mockTexts)
    setFilteredTexts(mockTexts)
    setLoading(false)
  }, [])

  // Filter texts based on search and selection
  useEffect(() => {
    let filtered = texts

    if (searchTerm) {
      filtered = filtered.filter(text => 
        text.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
        text.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        text.page.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedPage !== 'all') {
      filtered = filtered.filter(text => text.page === selectedPage)
    }

    if (selectedSubdomain !== 'all') {
      filtered = filtered.filter(text => text.subdomain === selectedSubdomain)
    }

    setFilteredTexts(filtered)
  }, [texts, searchTerm, selectedPage, selectedSubdomain])

  const handleEdit = (text: SiteText) => {
    setEditingText({ ...text })
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!editingText) return

    try {
      // In real implementation, this would be an API call to update the text
      // await fetch(`/api/admin/site-text/${editingText.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(editingText)
      // })

      // Update local state
      setTexts(texts.map(text => 
        text.id === editingText.id ? editingText : text
      ))

      setIsEditing(false)
      setEditingText(null)
      alert('Text updated successfully!')
    } catch {
      alert('Failed to update text')
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingText(null)
  }

  const getUniquePages = () => {
    const pages = [...new Set(texts.map(text => text.page))]
    return pages.sort()
  }

  const getUniqueSubdomains = () => {
    const subdomains = [...new Set(texts.filter(text => text.subdomain).map(text => text.subdomain!))]
    return subdomains.sort()
  }

  const exportToCSV = () => {
    const csvContent = [
      ['Page', 'Section', 'Key', 'Value', 'Subdomain', 'Type'],
      ...filteredTexts.map(text => [
        text.page,
        text.section,
        text.key,
        `"${text.value.replace(/"/g, '""')}"`, // Escape quotes in CSV
        text.subdomain || '',
        text.type
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'yoohoo-site-texts.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-white text-xl font-bold">Site Text Manager</h3>
        <OrbitronButton onClick={exportToCSV} variant="ghost">
          📊 Export CSV
        </OrbitronButton>
      </div>

      {/* Filters */}
      <OrbitronCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Search</label>
            <input
              type="text"
              placeholder="Search texts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 bg-black/30 border border-gray-600 rounded text-white placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Page</label>
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="w-full p-2 bg-black/30 border border-gray-600 rounded text-white"
            >
              <option value="all">All Pages</option>
              {getUniquePages().map(page => (
                <option key={page} value={page}>{page}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Subdomain</label>
            <select
              value={selectedSubdomain}
              onChange={(e) => setSelectedSubdomain(e.target.value)}
              className="w-full p-2 bg-black/30 border border-gray-600 rounded text-white"
            >
              <option value="all">All Subdomains</option>
              {getUniqueSubdomains().map(subdomain => (
                <option key={subdomain} value={subdomain}>{subdomain}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <OrbitronButton 
              onClick={() => {
                setSearchTerm('')
                setSelectedPage('all')
                setSelectedSubdomain('all')
              }}
              variant="ghost"
              className="w-full"
            >
              Clear Filters
            </OrbitronButton>
          </div>
        </div>
      </OrbitronCard>

      {/* Results Summary */}
      <div className="text-gray-400 text-sm">
        Showing {filteredTexts.length} of {texts.length} texts
      </div>

      {/* Text List */}
      <div className="space-y-4">
        {filteredTexts.map((text) => (
          <OrbitronCard key={text.id} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-start">
              <div>
                <div className="text-gray-400 text-xs mb-1">PAGE</div>
                <div className="text-white font-medium">{text.page}</div>
                {text.subdomain && (
                  <div className="text-blue-400 text-xs">({text.subdomain})</div>
                )}
              </div>

              <div>
                <div className="text-gray-400 text-xs mb-1">SECTION</div>
                <div className="text-white">{text.section}</div>
              </div>

              <div>
                <div className="text-gray-400 text-xs mb-1">KEY</div>
                <div className="text-white font-mono text-sm">{text.key}</div>
              </div>

              <div className="lg:col-span-2">
                <div className="text-gray-400 text-xs mb-1">VALUE</div>
                <div className="text-white break-words">
                  {text.value.length > 100 ? `${text.value.substring(0, 100)}...` : text.value}
                </div>
              </div>

              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  text.type === 'heading' ? 'bg-blue-500/20 text-blue-400' :
                  text.type === 'paragraph' ? 'bg-green-500/20 text-green-400' :
                  text.type === 'button' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {text.type}
                </span>
                <OrbitronButton 
                  onClick={() => handleEdit(text)}
                  variant="ghost"
                  size="sm"
                >
                  ✏️ Edit
                </OrbitronButton>
              </div>
            </div>
          </OrbitronCard>
        ))}
      </div>

      {/* Edit Modal */}
      {isEditing && editingText && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <OrbitronCard className="w-full max-w-2xl p-6">
            <h4 className="text-white text-lg font-bold mb-4">Edit Site Text</h4>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Page</label>
                  <input
                    type="text"
                    value={editingText.page}
                    onChange={(e) => setEditingText({...editingText, page: e.target.value})}
                    className="w-full p-2 bg-black/30 border border-gray-600 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Section</label>
                  <input
                    type="text"
                    value={editingText.section}
                    onChange={(e) => setEditingText({...editingText, section: e.target.value})}
                    className="w-full p-2 bg-black/30 border border-gray-600 rounded text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Key</label>
                  <input
                    type="text"
                    value={editingText.key}
                    onChange={(e) => setEditingText({...editingText, key: e.target.value})}
                    className="w-full p-2 bg-black/30 border border-gray-600 rounded text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Type</label>
                  <select
                    value={editingText.type}
                    onChange={(e) => setEditingText({...editingText, type: e.target.value as 'heading' | 'paragraph' | 'button' | 'meta' | 'other'})}
                    className="w-full p-2 bg-black/30 border border-gray-600 rounded text-white"
                  >
                    <option value="heading">Heading</option>
                    <option value="paragraph">Paragraph</option>
                    <option value="button">Button</option>
                    <option value="meta">Meta</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {editingText.subdomain && (
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Subdomain</label>
                  <input
                    type="text"
                    value={editingText.subdomain}
                    onChange={(e) => setEditingText({...editingText, subdomain: e.target.value})}
                    className="w-full p-2 bg-black/30 border border-gray-600 rounded text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-400 text-sm mb-2">Value</label>
                <textarea
                  value={editingText.value}
                  onChange={(e) => setEditingText({...editingText, value: e.target.value})}
                  rows={4}
                  className="w-full p-2 bg-black/30 border border-gray-600 rounded text-white resize-vertical"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <OrbitronButton onClick={handleSave} variant="gradient">
                💾 Save Changes
              </OrbitronButton>
              <OrbitronButton onClick={handleCancel} variant="ghost">
                ❌ Cancel
              </OrbitronButton>
            </div>
          </OrbitronCard>
        </div>
      )}
    </div>
  )
}