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

export default function EducationPage() {
  const [education, setEducation] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  
  const [form, setForm] = useState({
    institution: '',
    degree: '',
    field_of_study: '',
    location: '',
    start_year: '',
    end_year: '',
    gpa: '',
    thesis_title: '',
    specialization: [],
    achievements: []
  })

  const [newSpecialization, setNewSpecialization] = useState('')
  const [newAchievement, setNewAchievement] = useState('')

  useEffect(() => {
    fetchEducation()
  }, [])

  const fetchEducation = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('education')
      .select('*')
      .order('start_year', { ascending: false })
    
    setEducation(data || [])
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
      institution: '',
      degree: '',
      field_of_study: '',
      location: '',
      start_year: '',
      end_year: '',
      gpa: '',
      thesis_title: '',
      specialization: [],
      achievements: []
    })
    setEditingId(null)
    setShowForm(false)
    setNewSpecialization('')
    setNewAchievement('')
  }

  const handleEdit = (edu) => {
    setForm({
      institution: edu.institution || '',
      degree: edu.degree || '',
      field_of_study: edu.field_of_study || '',
      location: edu.location || '',
      start_year: edu.start_year || '',
      end_year: edu.end_year || '',
      gpa: edu.gpa || '',
      thesis_title: edu.thesis_title || '',
      specialization: edu.specialization || [],
      achievements: edu.achievements || []
    })
    setEditingId(edu.id)
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
      
      // Get profile ID dynamically
      const { data: profileData } = await supabase.from('profiles').select('id').limit(1).single()
      if (!profileData) {
        throw new Error('Profile not found. Please create a profile first.')
      }

      const payload = {
        ...form,
        profile_id: profileData.id,
        gpa: form.gpa ? parseFloat(form.gpa) : null,
        start_year: form.start_year ? parseInt(form.start_year) : null,
        end_year: form.end_year ? parseInt(form.end_year) : null
      }

      if (editingId) {
        const res = await fetch(`/api/education/${editingId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to update')
        setSuccess('Education updated successfully!')
      } else {
        const res = await fetch('/api/education', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to create')
        setSuccess('Education created successfully!')
      }
      
      resetForm()
      fetchEducation()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this education?')) return
    
    try {
      const headers = await getAuthHeaders()
      const res = await fetch(`/api/education/${id}`, {
        method: 'DELETE',
        headers
      })
      if (!res.ok) throw new Error('Failed to delete')
      setSuccess('Education deleted successfully!')
      fetchEducation()
    } catch (err) {
      setError(err.message)
    }
  }

  const addSpecialization = () => {
    if (!newSpecialization.trim()) return
    setForm({
      ...form,
      specialization: [...form.specialization, newSpecialization.trim()]
    })
    setNewSpecialization('')
  }

  const removeSpecialization = (index) => {
    setForm({
      ...form,
      specialization: form.specialization.filter((_, i) => i !== index)
    })
  }

  const addAchievement = () => {
    if (!newAchievement.trim()) return
    setForm({
      ...form,
      achievements: [...form.achievements, newAchievement.trim()]
    })
    setNewAchievement('')
  }

  const removeAchievement = (index) => {
    setForm({
      ...form,
      achievements: form.achievements.filter((_, i) => i !== index)
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
          <h2 className="text-3xl font-bold tracking-tight">Education</h2>
          <p className="text-muted-foreground">
            Manage your academic background and qualifications
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Education
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
                <CardTitle>{editingId ? 'Edit Education' : 'Add New Education'}</CardTitle>
                <CardDescription>
                  {editingId ? 'Update education details' : 'Add a new education record'}
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
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="institution">Institution *</Label>
                  <Input
                    id="institution"
                    placeholder="e.g., Institut Teknologi Sepuluh Nopember"
                    value={form.institution}
                    onChange={(e) => setForm({...form, institution: e.target.value})}
                    required
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="degree">Degree *</Label>
                  <Input
                    id="degree"
                    placeholder="e.g., Bachelor, Master, PhD"
                    value={form.degree}
                    onChange={(e) => setForm({...form, degree: e.target.value})}
                    required
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="field_of_study">Field of Study</Label>
                  <Input
                    id="field_of_study"
                    placeholder="e.g., Computer Science"
                    value={form.field_of_study}
                    onChange={(e) => setForm({...form, field_of_study: e.target.value})}
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
                  <Label htmlFor="gpa">GPA</Label>
                  <Input
                    id="gpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    placeholder="e.g., 3.75"
                    value={form.gpa}
                    onChange={(e) => setForm({...form, gpa: e.target.value})}
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start_year">Start Year *</Label>
                  <Input
                    id="start_year"
                    type="number"
                    min="1900"
                    max="2100"
                    placeholder="e.g., 2018"
                    value={form.start_year}
                    onChange={(e) => setForm({...form, start_year: e.target.value})}
                    required
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_year">End Year</Label>
                  <Input
                    id="end_year"
                    type="number"
                    min="1900"
                    max="2100"
                    placeholder="e.g., 2022"
                    value={form.end_year}
                    onChange={(e) => setForm({...form, end_year: e.target.value})}
                    disabled={saving}
                  />
                </div>
              </div>

              {/* Thesis */}
              <div className="space-y-2">
                <Label htmlFor="thesis_title">Thesis/Dissertation Title</Label>
                <Input
                  id="thesis_title"
                  placeholder="Title of your thesis or final project"
                  value={form.thesis_title}
                  onChange={(e) => setForm({...form, thesis_title: e.target.value})}
                  disabled={saving}
                />
              </div>

              {/* Specialization */}
              <div className="space-y-3">
                <Label>Specialization/Focus Areas</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Machine Learning, Web Development"
                    value={newSpecialization}
                    onChange={(e) => setNewSpecialization(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
                    disabled={saving}
                  />
                  <Button type="button" onClick={addSpecialization} disabled={saving}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {form.specialization.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.specialization.map((spec, index) => (
                      <Badge key={index} variant="secondary">
                        {spec}
                        <button
                          type="button"
                          onClick={() => removeSpecialization(index)}
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

              {/* Achievements */}
              <div className="space-y-3">
                <Label>Achievements/Publications</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Dean's List, Published Paper"
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                    disabled={saving}
                  />
                  <Button type="button" onClick={addAchievement} disabled={saving}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {form.achievements.length > 0 && (
                  <div className="space-y-2">
                    {form.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded">
                        <span className="flex-1 text-sm">{achievement}</span>
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

              {/* Submit */}
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  {editingId ? 'Update' : 'Create'} Education
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} disabled={saving}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Education List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Education</CardTitle>
          <CardDescription>All your academic records</CardDescription>
        </CardHeader>
        <CardContent>
          {education.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No education records yet. Add your first one above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{edu.degree} in {edu.field_of_study}</h3>
                      <p className="text-primary font-semibold">{edu.institution}</p>
                      <p className="text-sm text-muted-foreground">
                        {edu.location} • {edu.start_year} - {edu.end_year || 'Present'}
                      </p>
                      {edu.gpa && <p className="text-sm text-muted-foreground">GPA: {edu.gpa}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(edu)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(edu.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {edu.thesis_title && (
                    <p className="text-sm mb-2">
                      <span className="font-semibold">Thesis:</span> {edu.thesis_title}
                    </p>
                  )}

                  {edu.specialization && edu.specialization.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-semibold mb-1">Specialization:</p>
                      <div className="flex flex-wrap gap-1">
                        {edu.specialization.map((spec, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {edu.achievements && edu.achievements.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-1">Achievements:</p>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {edu.achievements.map((achievement, idx) => (
                          <li key={idx}>{achievement}</li>
                        ))}
                      </ul>
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