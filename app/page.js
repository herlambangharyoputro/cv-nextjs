'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    full_name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    professional_summary: ''
  })
  const [editId, setEditId] = useState(null)

  // Fetch profiles saat component load
  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    setLoading(true)
    const res = await fetch('/api/profiles')
    const data = await res.json()
    setProfiles(data)
    setLoading(false)
  }

  // CREATE atau UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (editId) {
      // Update
      await fetch(`/api/profiles/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      setEditId(null)
    } else {
      // Create
      await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
    }
    
    // Reset form
    setForm({
      full_name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      professional_summary: ''
    })
    
    fetchProfiles()
  }

  // Edit - isi form dengan data yang mau diedit
  const handleEdit = (profile) => {
    setForm({
      full_name: profile.full_name,
      title: profile.title || '',
      email: profile.email || '',
      phone: profile.phone || '',
      location: profile.location || '',
      professional_summary: profile.professional_summary || ''
    })
    setEditId(profile.id)
  }

  // DELETE
  const handleDelete = async (id) => {
    if (confirm('Yakin mau hapus?')) {
      await fetch(`/api/profiles/${id}`, { method: 'DELETE' })
      fetchProfiles()
    }
  }

  // Cancel edit
  const handleCancel = () => {
    setForm({
      full_name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      professional_summary: ''
    })
    setEditId(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          CV Management System
        </h1>
        
        {/* FORM CREATE/UPDATE */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">
            {editId ? 'Edit Profile' : 'Add New Profile'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.full_name}
                onChange={(e) => setForm({...form, full_name: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Full Stack Developer"
                value={form.title}
                onChange={(e) => setForm({...form, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.phone}
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Surabaya, Indonesia"
                value={form.location}
                onChange={(e) => setForm({...form, location: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Professional Summary
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                value={form.professional_summary}
                onChange={(e) => setForm({...form, professional_summary: e.target.value})}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                {editId ? 'Update' : 'Add'} Profile
              </button>
              
              {editId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* LIST PROFILES */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Profiles List</h2>
          
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : profiles.length === 0 ? (
            <p className="text-gray-500">No profiles yet. Add one above!</p>
          ) : (
            <div className="space-y-4">
              {profiles.map((profile) => (
                <div key={profile.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {profile.full_name}
                      </h3>
                      {profile.title && (
                        <p className="text-blue-600 font-medium">{profile.title}</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(profile)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(profile.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    {profile.location && <p>📍 {profile.location}</p>}
                    {profile.email && <p>✉️ {profile.email}</p>}
                    {profile.phone && <p>📱 {profile.phone}</p>}
                  </div>

                  {profile.professional_summary && (
                    <p className="mt-3 text-gray-700 text-sm leading-relaxed">
                      {profile.professional_summary}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}