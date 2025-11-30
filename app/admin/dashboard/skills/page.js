'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Pencil, Trash2, X, Save, GripVertical } from "lucide-react"
import { supabase } from '@/lib/supabase-auth'

export default function SkillsPage() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  
  const [form, setForm] = useState({
    category: '',
    skills: [],
    order_position: 0
  })

  const [newSkill, setNewSkill] = useState('')

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('technical_skills')
      .select('*')
      .order('order_position', { ascending: true })
    
    setSkills(data || [])
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
      category: '',
      skills: [],
      order_position: skills.length
    })
    setEditingId(null)
    setShowForm(false)
    setNewSkill('')
  }

  const handleEdit = (skill) => {
    setForm({
      category: skill.category || '',
      skills: skill.skills || [],
      order_position: skill.order_position || 0
    })
    setEditingId(skill.id)
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
        const res = await fetch(`/api/skills/${editingId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error('Failed to update')
        setSuccess('Skill category updated successfully!')
      } else {
        const res = await fetch('/api/skills', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error('Failed to create')
        setSuccess('Skill category created successfully!')
      }
      
      resetForm()
      fetchSkills()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this skill category?')) return
    
    try {
      const headers = await getAuthHeaders()
      const res = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
        headers
      })
      if (!res.ok) throw new Error('Failed to delete')
      setSuccess('Skill category deleted successfully!')
      fetchSkills()
    } catch (err) {
      setError(err.message)
    }
  }

  const addSkill = () => {
    if (!newSkill.trim()) return
    setForm({
      ...form,
      skills: [...form.skills, newSkill.trim()]
    })
    setNewSkill('')
  }

  const removeSkill = (index) => {
    setForm({
      ...form,
      skills: form.skills.filter((_, i) => i !== index)
    })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Technical Skills</h2>
          <p className="text-muted-foreground">
            Manage your technical skills and expertise
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Skill Category
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
                <CardTitle>{editingId ? 'Edit Skill Category' : 'Add New Skill Category'}</CardTitle>
                <CardDescription>
                  {editingId ? 'Update skill category and items' : 'Add a new skill category with items'}
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category Name *</Label>
                <Input
                  id="category"
                  placeholder="e.g., Backend Development, Frontend Development"
                  value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value})}
                  required
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order_position">Display Order</Label>
                <Input
                  id="order_position"
                  type="number"
                  min="0"
                  value={form.order_position}
                  onChange={(e) => setForm({...form, order_position: parseInt(e.target.value)})}
                  disabled={saving}
                />
                <p className="text-xs text-muted-foreground">
                  Lower numbers appear first
                </p>
              </div>

              <div className="space-y-3">
                <Label>Skills *</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Laravel, PHP, MySQL"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={saving}
                  />
                  <Button type="button" onClick={addSkill} disabled={saving}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Press Enter or click + to add skill
                </p>
                
                {form.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/50">
                    {form.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          disabled={saving}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                
                {form.skills.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4 border rounded-lg border-dashed">
                    No skills added yet. Add skills above.
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={saving || form.skills.length === 0}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  {editingId ? 'Update' : 'Create'} Category
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} disabled={saving}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Skills List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Skill Categories</CardTitle>
          <CardDescription>All your technical skill categories</CardDescription>
        </CardHeader>
        <CardContent>
          {skills.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No skill categories yet. Add your first category above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-2 flex-1">
                      <GripVertical className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-bold text-lg">{skill.category}</h3>
                        <p className="text-xs text-muted-foreground">Order: {skill.order_position}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(skill)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(skill.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {skill.skills?.map((s, idx) => (
                      <Badge key={idx} variant="secondary">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}