'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, MapPin, Github, Linkedin, Globe, Briefcase, GraduationCap, Award, ExternalLink, ArrowRight, Calendar, MapPinIcon } from 'lucide-react'

export default function CVPage() {
  const [profile, setProfile] = useState(null)
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [skills, setSkills] = useState([])
  const [education, setEducation] = useState([])
  const [certifications, setCertifications] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch profile
      const profileRes = await fetch('/api/profiles')
      const profileData = await profileRes.json()
      if (profileData.length > 0) {
        setProfile(profileData[0])
      }

      // Fetch experiences
      const expRes = await fetch('/api/experiences')
      const expData = await expRes.json()
      setExperiences(expData || [])
 
      // Fetch skills
      const skillsRes = await fetch('/api/skills')
      const skillsData = await skillsRes.json()
      setSkills(skillsData || [])

      // Fetch education
      const eduRes = await fetch('/api/education')
      const eduData = await eduRes.json()
      setEducation(eduData || [])
 
      // Fetch certifications
      const certRes = await fetch('/api/certifications')
      const certData = await certRes.json()
      setCertifications(certData || [])

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const calculateDuration = (startDate, endDate, isCurrent) => {
    const start = new Date(startDate)
    const end = isCurrent ? new Date() : new Date(endDate)
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    
    if (years > 0 && remainingMonths > 0) {
      return `${years} yr${years > 1 ? 's' : ''} ${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`
    } else if (years > 0) {
      return `${years} yr${years > 1 ? 's' : ''}`
    } else {
      return `${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>No Profile Found</CardTitle>
            <CardDescription>Please add a profile from the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="/admin/login">Go to Admin</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex h-16 max-w-screen-2xl items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile.photo_url} />
              <AvatarFallback className="text-xs">{profile.full_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <a href="/" className="font-bold hover:text-primary transition-colors">
              {profile.full_name}
            </a>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#about" className="transition-colors hover:text-foreground text-foreground/60">About</a>
            <a href="#experience" className="transition-colors hover:text-foreground text-foreground/60">Experience</a>
            <a href="#skills" className="transition-colors hover:text-foreground text-foreground/60">Skills</a>
            <a href="#education" className="transition-colors hover:text-foreground text-foreground/60">Education</a>
          </nav>

          <div className="flex items-center gap-2">
            {profile.github_url && (
              <Button variant="ghost" size="icon" asChild>
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            )}
            <Button size="sm" asChild>
              <a href="#contact">Contact</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container flex max-w-screen-2xl flex-col items-center gap-4 pb-8 pt-6 md:py-10">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <Avatar className="h-32 w-32 border-4 border-border">
            <AvatarImage src={profile.photo_url} alt={profile.full_name} />
            <AvatarFallback className="text-4xl">{profile.full_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
            {profile.full_name}
          </h1>
          
          {profile.title && (
            <span className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
              {profile.title}
            </span>
          )}

          {profile.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{profile.location}</span>
            </div>
          )}

          {profile.professional_summary && (
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              {profile.professional_summary}
            </p>
          )}

          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {profile.email && (
              <Button variant="default" asChild>
                <a href={`mailto:${profile.email}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Get in touch
                </a>
              </Button>
            )}
            {profile.github_url && (
              <Button variant="outline" asChild>
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
            )}
            {profile.linkedin_url && (
              <Button variant="outline" asChild>
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Experience */}
      <section id="experience" className="container max-w-screen-2xl py-8 md:py-12 lg:py-16">
        <div className="mx-auto flex max-w-[980px] flex-col items-start gap-2">
          <div className="flex items-center gap-2 mb-8">
            <Briefcase className="h-6 w-6" />
            <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
              Professional Experience
            </h2>
          </div>

          {experiences.length === 0 ? (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Work History</CardTitle>
                <CardDescription>My professional journey and key accomplishments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Work experiences will appear here</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6 w-full">
              {experiences.map((exp, index) => (
                <Card key={exp.id} className="w-full">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">{exp.position}</h3>
                        <p className="text-lg text-primary font-semibold mb-2">{exp.company_name}</p>
                        
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                          {exp.location && (
                            <div className="flex items-center gap-1">
                              <MapPinIcon className="h-3 w-3" />
                              <span>{exp.location}</span>
                            </div>
                          )}
                          {exp.employment_type && (
                            <Badge variant="outline" className="font-normal">
                              {exp.employment_type}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                          </span>
                          <span className="text-xs">
                            • {calculateDuration(exp.start_date, exp.end_date, exp.is_current)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {exp.description && (
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {exp.description}
                      </p>
                    )}

                    {exp.work_achievements && exp.work_achievements.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                          Key Achievements
                        </h4>
                        
                        {/* Group by category if exists */}
                        {exp.work_achievements.some(ach => ach.category) ? (
                          <div className="space-y-4">
                            {[...new Set(exp.work_achievements.map(ach => ach.category || 'General'))].map(category => (
                              <div key={category}>
                                {category !== 'General' && (
                                  <Badge variant="secondary" className="mb-2">{category}</Badge>
                                )}
                                <ul className="space-y-2 ml-4">
                                  {exp.work_achievements
                                    .filter(ach => (ach.category || 'General') === category)
                                    .map((ach) => (
                                      <li key={ach.id} className="text-sm leading-relaxed list-disc">
                                        {ach.achievement}
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <ul className="space-y-2 ml-4">
                            {exp.work_achievements.map((ach) => (
                              <li key={ach.id} className="text-sm leading-relaxed list-disc">
                                {ach.achievement}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    {exp.technologies_used && exp.technologies_used[0]?.technologies && (
                      <div>
                        <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">
                          Technologies Used
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies_used[0].technologies.map((tech, idx) => (
                            <Badge key={idx} variant="secondary">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Separator className="my-8" />
 
      {/* Skills */}
      <section id="skills" className="container max-w-screen-2xl py-8 md:py-12 lg:py-16">
        <div className="mx-auto flex max-w-[980px] flex-col items-start gap-2">
          <div className="flex items-center gap-2 mb-8">
            <Award className="h-6 w-6" />
            <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
              Technical Expertise
            </h2>
          </div>

          {skills.length === 0 ? (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Skills & Technologies</CardTitle>
                <CardDescription>Technologies and tools I work with</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Technical skills will appear here</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 w-full md:grid-cols-2">
              {skills.map((skillCategory) => (
                <Card key={skillCategory.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{skillCategory.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {skillCategory.skills?.map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Education */}
      <section id="education" className="container max-w-screen-2xl py-8 md:py-12 lg:py-16">
        <div className="mx-auto flex max-w-[980px] flex-col items-start gap-2">
          <div className="flex items-center gap-2 mb-8">
            <GraduationCap className="h-6 w-6" />
            <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
              Education
            </h2>
          </div>

          {education.length === 0 ? (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Academic Background</CardTitle>
                <CardDescription>My educational qualifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Education history will appear here</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6 w-full">
              {education.map((edu) => (
                <Card key={edu.id} className="w-full">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">
                          {edu.degree}{edu.field_of_study && ` in ${edu.field_of_study}`}
                        </h3>
                        <p className="text-lg text-primary font-semibold mb-2">{edu.institution}</p>
                        
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          {edu.location && <span>{edu.location}</span>}
                          <span>{edu.start_year} - {edu.end_year || 'Present'}</span>
                          {edu.gpa && <span>• GPA: {edu.gpa}</span>}
                        </div>
                      </div>
                    </div>

                    {edu.thesis_title && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-muted-foreground mb-1">Thesis:</p>
                        <p className="text-sm">{edu.thesis_title}</p>
                      </div>
                    )}

                    {edu.specialization && edu.specialization.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-muted-foreground mb-2">Specialization:</p>
                        <div className="flex flex-wrap gap-2">
                          {edu.specialization.map((spec, idx) => (
                            <Badge key={idx} variant="outline">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {edu.achievements && edu.achievements.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-2">Achievements:</p>
                        <ul className="space-y-1 ml-4">
                          {edu.achievements.map((achievement, idx) => (
                            <li key={idx} className="text-sm list-disc">
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Separator className="my-8" />
      
      {/* Certifications */}
      <section id="certifications" className="container max-w-screen-2xl py-8 md:py-12 lg:py-16">
        <div className="mx-auto flex max-w-[980px] flex-col items-start gap-2">
          <div className="flex items-center gap-2 mb-8">
            <Award className="h-6 w-6" />
            <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
              Certifications
            </h2>
          </div>

          {certifications.length === 0 ? (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Professional Certifications</CardTitle>
                <CardDescription>My certifications and awards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Certifications will appear here</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 w-full md:grid-cols-2">
              {certifications.map((cert) => (
                <Card key={cert.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold mb-1">{cert.name}</h3>
                        <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      {cert.issue_date && (
                        <div>
                          Issued: {new Date(cert.issue_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </div>
                      )}
                      
                      {cert.expiry_date && (
                        <div>
                          {new Date(cert.expiry_date) < new Date() ? (
                            <Badge variant="outline" className="text-xs">
                              Expired: {new Date(cert.expiry_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </Badge>
                          ) : (
                            <span>
                              Expires: {new Date(cert.expiry_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </span>
                          )}
                        </div>
                      )}

                      {cert.credential_id && (
                        <div className="text-xs">
                          Credential ID: {cert.credential_id}
                        </div>
                      )}
                    </div>

                    {cert.credential_url && (
                      <Button variant="link" size="sm" className="mt-3 p-0 h-auto" asChild>
                        <a href={cert.credential_url} target="_blank" rel="noopener noreferrer">
                          View Credential <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Separator className="my-8" />

      {/* Contact CTA */}
      <section id="contact" className="container max-w-screen-2xl py-8 md:py-12 lg:py-16">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
            Ready to start a project?
          </h2>
          <p className="max-w-[750px] text-lg text-muted-foreground">
            I'm available for freelance work and new opportunities.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {profile.email && (
              <Button size="lg" asChild>
                <a href={`mailto:${profile.email}`}>
                  <Mail className="mr-2 h-5 w-5" />
                  Send me an email
                </a>
              </Button>
            )}
            {profile.linkedin_url && (
              <Button size="lg" variant="outline" asChild>
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="mr-2 h-5 w-5" />
                  Connect on LinkedIn
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40">
        <div className="container mx-auto px-4 max-w-screen-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built with Next.js, Shadcn/ui, and Supabase. © {new Date().getFullYear()} {profile.full_name}
            </p>
            <div className="flex items-center gap-4">
              {profile.github_url && (
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Github className="h-5 w-5" />
                </a>
              )}
              {profile.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}