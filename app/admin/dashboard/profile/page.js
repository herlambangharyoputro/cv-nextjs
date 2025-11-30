'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save } from "lucide-react"
import { supabase } from '@/lib/supabase-auth'

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
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
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    const { data } = await supabase.from('profiles').select('*').limit(1).single()
    if (data) {
      setProfile(data)
      setForm({
        full_name: data.full_name || '',
        title: data.title || '',
        email: data.email || '',
        phone: data.phone || '',
        whatsapp: data.whatsapp || '',
        location: data.location || '',
        github_url: data.github_url || '',
        linkedin_url: data.linkedin_url || '',
        website_url: data.website_url || '',
        professional_summary: data.professional_summary || '',
        photo_url: data.photo_url || ''
      })
    }
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
      
      if (profile) {
        // Update existing
        const res = await fetch(`/api/profiles/${profile.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(form)
        })
        if (!res.ok) throw new Error('Failed to update')
        setSuccess('Profile updated successfully!')
      } else {
        // Create new
        const res = await fetch('/api/profiles', {
          method: 'POST',
          headers,
          body: JSON.stringify(form)
        })
        if (!res.ok) throw new Error('Failed to create')
        setSuccess('Profile created successfully!')
      }
      
      fetchProfile()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">
          Manage your personal information and professional summary
        </p>
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle>{profile ? 'Edit Profile' : 'Create Profile'}</CardTitle>
          <CardDescription>
            {profile ? 'Update your profile information' : 'Add your profile information'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={form.website_url}
                  onChange={(e) => setForm({...form, website_url: e.target.value})}
                  disabled={saving}
                />
              </div>
            </div>

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
                Upload your photo to an image hosting service and paste the URL here
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="professional_summary">Professional Summary</Label>
              <Textarea
                id="professional_summary"
                rows={8}
                placeholder="Write a brief summary about yourself..."
                value={form.professional_summary}
                onChange={(e) => setForm({...form, professional_summary: e.target.value})}
                disabled={saving}
              />
            </div>

            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {profile ? 'Update Profile' : 'Create Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}