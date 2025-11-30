'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Pencil, Trash2, X, Save, ExternalLink, Award } from "lucide-react"
import { supabase } from '@/lib/supabase-auth'

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  
  const [form, setForm] = useState({
    name: '',
    issuer: '',
    issue_date: '',
    expiry_date: '',
    credential_id: '',
    credential_url: ''
  })

  useEffect(() => {
    fetchCertifications()
  }, [])

  const fetchCertifications = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('certifications')
      .select('*')
      .order('issue_date', { ascending: false })
    
    setCertifications(data || [])
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
      name: '',
      issuer: '',
      issue_date: '',
      expiry_date: '',
      credential_id: '',
      credential_url: ''
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (cert) => {
    setForm({
      name: cert.name || '',
      issuer: cert.issuer || '',
      issue_date: cert.issue_date || '',
      expiry_date: cert.expiry_date || '',
      credential_id: cert.credential_id || '',
      credential_url: cert.credential_url || ''
    })
    setEditingId(cert.id)
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
        profile_id: 1
      }

      if (editingId) {
        const res = await fetch(`/api/certifications/${editingId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error('Failed to update')
        setSuccess('Certification updated successfully!')
      } else {
        const res = await fetch('/api/certifications', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error('Failed to create')
        setSuccess('Certification created successfully!')
      }
      
      resetForm()
      fetchCertifications()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this certification?')) return
    
    try {
      const headers = await getAuthHeaders()
      const res = await fetch(`/api/certifications/${id}`, {
        method: 'DELETE',
        headers
      })
      if (!res.ok) throw new Error('Failed to delete')
      setSuccess('Certification deleted successfully!')
      fetchCertifications()
    } catch (err) {
      setError(err.message)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false
    return new Date(expiryDate) < new Date()
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
          <h2 className="text-3xl font-bold tracking-tight">Certifications</h2>
          <p className="text-muted-foreground">
            Manage your professional certifications and awards
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Certification
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
                <CardTitle>{editingId ? 'Edit Certification' : 'Add New Certification'}</CardTitle>
                <CardDescription>
                  {editingId ? 'Update certification details' : 'Add a new certification'}
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="name">Certification Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., AWS Certified Solutions Architect"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    required
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issuer">Issuing Organization *</Label>
                  <Input
                    id="issuer"
                    placeholder="e.g., Amazon Web Services"
                    value={form.issuer}
                    onChange={(e) => setForm({...form, issuer: e.target.value})}
                    required
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issue_date">Issue Date</Label>
                  <Input
                    id="issue_date"
                    type="date"
                    value={form.issue_date}
                    onChange={(e) => setForm({...form, issue_date: e.target.value})}
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiry_date">Expiry Date</Label>
                  <Input
                    id="expiry_date"
                    type="date"
                    value={form.expiry_date}
                    onChange={(e) => setForm({...form, expiry_date: e.target.value})}
                    disabled={saving}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty if it doesn't expire
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credential_id">Credential ID</Label>
                  <Input
                    id="credential_id"
                    placeholder="Certificate ID or number"
                    value={form.credential_id}
                    onChange={(e) => setForm({...form, credential_id: e.target.value})}
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="credential_url">Credential URL</Label>
                <Input
                  id="credential_url"
                  type="url"
                  placeholder="https://..."
                  value={form.credential_url}
                  onChange={(e) => setForm({...form, credential_url: e.target.value})}
                  disabled={saving}
                />
                <p className="text-xs text-muted-foreground">
                  Link to verify the certification
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  {editingId ? 'Update' : 'Create'} Certification
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} disabled={saving}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Certifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Certifications</CardTitle>
          <CardDescription>All your professional certifications</CardDescription>
        </CardHeader>
        <CardContent>
          {certifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No certifications yet. Add your first one above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {certifications.map((cert) => (
                <div key={cert.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-start gap-2 mb-1">
                        <Award className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h3 className="font-bold text-lg">{cert.name}</h3>
                          <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
                        {cert.issue_date && (
                          <span>Issued: {formatDate(cert.issue_date)}</span>
                        )}
                        {cert.expiry_date && (
                          <Badge variant={isExpired(cert.expiry_date) ? "destructive" : "outline"} className="text-xs">
                            {isExpired(cert.expiry_date) ? 'Expired' : 'Expires'}: {formatDate(cert.expiry_date)}
                          </Badge>
                        )}
                        {!cert.expiry_date && cert.issue_date && (
                          <Badge variant="outline" className="text-xs">No Expiration</Badge>
                        )}
                      </div>

                      {cert.credential_id && (
                        <p className="text-xs text-muted-foreground mt-2">
                          ID: {cert.credential_id}
                        </p>
                      )}

                      {cert.credential_url && (
                        <a 
                          href={cert.credential_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                        >
                          View Credential <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(cert)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(cert.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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