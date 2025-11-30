'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Pencil, Trash2, X, Save } from "lucide-react"
import { supabase } from '@/lib/supabase-auth'

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  
  const [form, setForm] = useState({
    company_name: '',
    position: '',
    location: '',
    employment_type: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    achievements: [],
    technologies: []
  })

  const [newAchievement, setNewAchievement] = useState({ achievement: '', category: '' })
  const [newTech, setNewTech] = useState('')

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('work_experiences')
      .select(`
        *,
        work_achievements (*),
        technologies_used (*)
      `)
      .order('start_date', { ascending: false })
    
    setExperiences(data || [])
    setLoading(false)
  }

  const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`
    }
  }

  const resetForm = () => {
    setForm({
      company_name: '',
      position: '',
      location: '',
      employment_type: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
      achievements: [],
      technologies: []
    })
    setEditingId(null)
    setShowForm(false)
    setNewAchievement({ achievement: '', category: '' })
    setNewTech('')
  }

  const handleEdit = (exp) => {
    setForm({
      company_name: exp.company_name || '',
      position: exp.position || '',
      location: exp.location || '',
      employment_type: exp.employment_type || '',
      start_date: exp.start_date || '',
      end_date: exp.end_date || '',
      is_current: exp.is_current || false,
      description: exp.description || '',
      achievements: exp.work_achievements || [],
      technologies: exp.technologies_used?.[0]?.technologies || []
    })
    setEditingId(exp.id)
    setShowForm(true)
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const headers = await getAuthHeaders()
      const payload = {
        ...form,
        profile_id: 1 // Adjust based on your profile
      }

      if (editingId) {
        const res = await fetch(`/api/experiences/${editingId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error('Failed to update')
        setSuccess('Experience updated successfully!')
      } else {
        const res = await fetch('/api/experiences', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error('Failed to create')
        setSuccess('Experience created successfully!')
      }
      
      resetForm()
      fetchExperiences()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this experience?')) return
    
    try {
      const headers = await getAuthHeaders()
      const res = await fetch(`/api/experiences/${id}`, {
        method: 'DELETE',
        headers
      })
      if (!res.ok) throw new Error('Failed to delete')
      setSuccess('Experience deleted successfully!')
      fetchExperiences()
    } catch (err) {
      setError(err.message)
    }
  }

  const addAchievement = () => {
    if (!newAchievement.achievement) return
    setForm({
      ...form,
      achievements: [...form.achievements, { ...newAchievement, order_position: form.achievements.length }]
    })
    setNewAchievement({ achievement: '', category: '' })
  }

  const removeAchievement = (index) => {
    setForm({
      ...form,
      achievements: form.achievements.filter((_, i) => i !== index)
    })
  }

  const addTechnology = () => {
    if (!newTech) return
    setForm({
      ...form,
      technologies: [...form.technologies, newTech]
    })
    setNewTech('')
  }

  const removeTechnology = (index) => {
    setForm({
      ...form,
      technologies: form.technologies.filter((_, i) => i !== index)
    })
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Work Experience</h2>
          <p className="text-muted-foreground">
            Manage your professional work history
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Experience
          </Button>
        )}
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

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{editingId ? 'Edit Experience' : 'Add New Experience'}</CardTitle>
                <CardDescription>
                  {editingId ? 'Update work experience details' : 'Add a new work experience'}
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    value={form.company_name}
                    onChange={(e) => setForm({...form, company_name: e.target.value})}
                    required
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    value={form.position}
                    onChange={(e) => setForm({...form, position: e.target.value})}
                    required
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

                <div className="space-y-2">
                  <Label htmlFor="employment_type">Employment Type</Label>
                  <Input
                    id="employment_type"
                    placeholder="e.g., Full-time, Freelance"
                    value={form.employment_type}
                    onChange={(e) => setForm({...form, employment_type: e.target.value})}
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm({...form, start_date: e.target.value})}
                    required
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm({...form, end_date: e.target.value})}
                    disabled={saving || form.is_current}
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_current"
                      checked={form.is_current}
                      onChange={(e) => setForm({...form, is_current: e.target.checked, end_date: e.target.checked ? '' : form.end_date})}
                      disabled={saving}
                      className="rounded"
                    />
                    <Label htmlFor="is_current" className="font-normal">Currently working here</Label>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Brief description of your role..."
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  disabled={saving}
                />
              </div>

              {/* Achievements */}
              <div className="space-y-3">
                <Label>Achievements</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Achievement description"
                    value={newAchievement.achievement}
                    onChange={(e) => setNewAchievement({...newAchievement, achievement: e.target.value})}
                    disabled={saving}
                  />
                  <Input
                    placeholder="Category (optional)"
                    value={newAchievement.category}
                    onChange={(e) => setNewAchievement({...newAchievement, category: e.target.value})}
                    disabled={saving}
                    className="w-48"
                  />
                  <Button type="button" onClick={addAchievement} disabled={saving}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {form.achievements.length > 0 && (
                  <div className="space-y-2">
                    {form.achievements.map((ach, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 border rounded">
                        <div className="flex-1">
                          <p className="text-sm">{ach.achievement}</p>
                          {ach.category && <Badge variant="outline" className="mt-1">{ach.category}</Badge>}
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeAchievement(index)}
                          disabled={saving}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Technologies */}
              <div className="space-y-3">
                <Label>Technologies Used</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Laravel, React, MySQL"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    disabled={saving}
                  />
                  <Button type="button" onClick={addTechnology} disabled={saving}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {form.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary">
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(index)}
                          disabled={saving}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  {editingId ? 'Update' : 'Create'} Experience
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} disabled={saving}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Experience List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Experiences</CardTitle>
          <CardDescription>All your work experiences</CardDescription>
        </CardHeader>
        <CardContent>
          {experiences.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No experiences yet. Add your first experience above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{exp.position}</h3>
                      <p className="text-primary">{exp.company_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {exp.location} • {exp.employment_type}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        {' - '}
                        {exp.is_current ? 'Present' : new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(exp)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(exp.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {exp.description && (
                    <p className="text-sm mb-3">{exp.description}</p>
                  )}

                  {exp.work_achievements && exp.work_achievements.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-semibold mb-2">Achievements:</p>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {exp.work_achievements.map((ach) => (
                          <li key={ach.id}>
                            {ach.achievement}
                            {ach.category && <Badge variant="outline" className="ml-2 text-xs">{ach.category}</Badge>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {exp.technologies_used && exp.technologies_used[0]?.technologies && (
                    <div className="flex flex-wrap gap-1">
                      {exp.technologies_used[0].technologies.map((tech, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}