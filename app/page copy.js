'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogOut, User, Loader2, Pencil, Trash2, Plus, Eye } from "lucide-react"
import { supabase } from '@/lib/supabase-auth'

export default function AdminPanel() {
  const { user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()
  
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingId, setEditingId] = useState(null)
  
  const [form, setForm] = useState({
    full_name: '',
    title: '',
    email: '',
    phone: '',
    whatsapp: '',
    location: '',
    github_url: '',
    linkedin_url: '',
    website_url: '',
    professional_summary: '',
    photo_url: ''
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login')
    } else if (user) {
      fetchProfiles()
    }
  }, [user, authLoading, router])

  const fetchProfiles = async () => {
    setLoading(true)
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    setProfiles(data || [])
    setLoading(false)
  }

  const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const headers = await getAuthHeaders()
      
      if (editingId) {
        // Update
        const res = await fetch(`/api/profiles/${editingId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(form)
        })
        
        if (!res.ok) throw new Error('Failed to update')
        setSuccess('Profile updated successfully!')
        setEditingId(null)
      } else {
        // Create
        const res = await fetch('/api/profiles', {
          method: 'POST',
          headers,
          body: JSON.stringify(form)
        })
        
        if (!res.ok) throw new Error('Failed to create')
        setSuccess('Profile created successfully!')
      }
      
      resetForm()
      fetchProfiles()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (profile) => {
    setForm({
      full_name: profile.full_name || '',
      title: profile.title || '',
      email: profile.email || '',
      phone: profile.phone || '',
      whatsapp: profile.whatsapp || '',
      location: profile.location || '',
      github_url: profile.github_url || '',
      linkedin_url: profile.linkedin_url || '',
      website_url: profile.website_url || '',
      professional_summary: profile.professional_summary || '',
      photo_url: profile.photo_url || ''
    })
    setEditingId(profile.id)
    setError('')
    setSuccess('')
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this profile?')) return
    
    try {
      const headers = await getAuthHeaders()
      const res = await fetch(`/api/profiles/${id}`, {
        method: 'DELETE',
        headers
      })
      
      if (!res.ok) throw new Error('Failed to delete')
      setSuccess('Profile deleted successfully!')
      fetchProfiles()
    } catch (err) {
      setError(err.message)
    }
  }

  const resetForm = () => {
    setForm({
      full_name: '',
      title: '',
      email: '',
      phone: '',
      whatsapp: '',
      location: '',
      github_url: '',
      linkedin_url: '',
      website_url: '',
      professional_summary: '',
      photo_url: ''
    })
    setEditingId(null)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <Button variant="outline" size="sm" asChild>
              <a href="/cv">
                <Eye className="h-4 w-4 mr-2" />
                View CV
              </a>
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span className="text-muted-foreground">{user.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Alerts */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="bg-green-500/10 border-green-500/50">
              <AlertDescription className="text-green-600">{success}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Profile' : 'Create New Profile'}</CardTitle>
              <CardDescription>
                {editingId ? 'Update your profile information' : 'Add a new profile to your CV'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={form.full_name}
                      onChange={(e) => setForm({...form, full_name: e.target.value})}
                      required
                      disabled={saving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Full Stack Developer"
                      value={form.title}
                      onChange={(e) => setForm({...form, title: e.target.value})}
                      disabled={saving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                      disabled={saving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => setForm({...form, phone: e.target.value})}
                      disabled={saving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={form.whatsapp}
                      onChange={(e) => setForm({...form, whatsapp: e.target.value})}
                      disabled={saving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Surabaya, Indonesia"
                      value={form.location}
                      onChange={(e) => setForm({...form, location: e.target.value})}
                      disabled={saving}
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="github_url">GitHub URL</Label>
                    <Input
                      id="github_url"
                      type="url"
                      placeholder="https://github.com/username"
                      value={form.github_url}
                      onChange={(e) => setForm({...form, github_url: e.target.value})}
                      disabled={saving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                    <Input
                      id="linkedin_url"
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={form.linkedin_url}
                      onChange={(e) => setForm({...form, linkedin_url: e.target.value})}
                      disabled={saving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website_url">Website URL</Label>
                    <Input
                      id="website_url"
                      type="url"
                      placeholder="https://yourwebsite.com"
                      value={form.website_url}
                      onChange={(e) => setForm({...form, website_url: e.target.value})}
                      disabled={saving}
                    />
                  </div>
                </div>

                {/* Photo URL */}
                <div className="space-y-2">
                  <Label htmlFor="photo_url">Photo URL</Label>
                  <Input
                    id="photo_url"
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={form.photo_url}
                    onChange={(e) => setForm({...form, photo_url: e.target.value})}
                    disabled={saving}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload your photo to image hosting service (e.g., Imgur) and paste the URL here
                  </p>
                </div>

                {/* Professional Summary */}
                <div className="space-y-2">
                  <Label htmlFor="professional_summary">Professional Summary</Label>
                  <Textarea
                    id="professional_summary"
                    rows={6}
                    placeholder="Write a brief summary about yourself..."
                    value={form.professional_summary}
                    onChange={(e) => setForm({...form, professional_summary: e.target.value})}
                    disabled={saving}
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingId ? 'Update Profile' : 'Create Profile'}
                  </Button>
                  
                  {editingId && (
                    <Button type="button" variant="outline" onClick={resetForm} disabled={saving}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Profiles List */}
          <Card>
            <CardHeader>
              <CardTitle>Existing Profiles</CardTitle>
              <CardDescription>Manage your CV profiles</CardDescription>
            </CardHeader>
            <CardContent>
              {profiles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No profiles yet. Create your first profile above!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {profiles.map((profile) => (
                    <div key={profile.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{profile.full_name}</h3>
                        {profile.title && <p className="text-primary">{profile.title}</p>}
                        {profile.location && <p className="text-sm text-muted-foreground mt-1">{profile.location}</p>}
                        {profile.email && <p className="text-sm text-muted-foreground">{profile.email}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(profile)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(profile.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}