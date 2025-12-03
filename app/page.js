import { supabase } from '@/lib/supabase'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Mail, Phone, Github, Linkedin, Briefcase, GraduationCap, Award, ExternalLink, Sparkles, TrendingUp, Zap } from "lucide-react"
import VisitorCounter from '@/components/visitor-counter'

export default async function Home() {
  // Fetch all data
  const { data: profiles } = await supabase.from('profiles').select('*').limit(1)
  const { data: experiences } = await supabase
    .from('work_experiences')
    .select(`
      *,
      work_achievements (*),
      technologies_used (*)
    `)
    .order('start_date', { ascending: false })
  
  const { data: skills } = await supabase.from('skills').select('*').order('category')
  const { data: education } = await supabase.from('education').select('*').order('start_year', { ascending: false })

  const profile = profiles?.[0] || {}

  // Helper functions
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const calculateDuration = (startDate, endDate, isCurrent) => {
    const start = new Date(startDate)
    const end = isCurrent ? new Date() : new Date(endDate)
    const months = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth()
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    
    if (years > 0 && remainingMonths > 0) {
      return `${years}y ${remainingMonths}m`
    } else if (years > 0) {
      return `${years}y`
    } else {
      return `${remainingMonths}m`
    }
  }

  return (
    <div className="flex min-h-screen flex-col gradient-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 max-w-screen-2xl flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg gradient-text">{profile.full_name || 'Portfolio'}</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#about" className="transition-colors hover:text-primary text-foreground/80">About</a>
            <a href="#experience" className="transition-colors hover:text-primary text-foreground/80">Experience</a>
            <a href="#skills" className="transition-colors hover:text-primary text-foreground/80">Skills</a>
            <a href="#education" className="transition-colors hover:text-primary text-foreground/80">Education</a>
          </nav>

          <div className="flex items-center gap-2">
            {profile.github_url && (
              <Button variant="ghost" size="icon" asChild>
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            )}
            <Button size="sm" className="glow-animation" asChild>
              <a href="#contact">Contact</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container flex max-w-screen-2xl flex-col items-center gap-8 pb-8 pt-12 md:py-16">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-6 text-center">
          <Avatar className="h-40 w-40 border-4 border-primary/20 shadow-2xl ring-4 ring-primary/10 float-animation">
            <AvatarImage src={profile.photo_url} alt={profile.full_name} />
            <AvatarFallback className="text-5xl gradient-text">{profile.full_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="space-y-4">
            <h1 className="text-5xl font-bold leading-tight tracking-tighter md:text-7xl lg:leading-[1.1] text-shadow-md">
              {profile.full_name}
            </h1>
            
            {profile.title && (
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <span className="inline-flex items-center rounded-full px-6 py-2 text-lg font-semibold gradient-card">
                  {profile.title}
                </span>
                <Sparkles className="h-5 w-5 text-secondary animate-pulse" />
              </div>
            )}

            {profile.location && (
              <div className="flex items-center justify-center gap-2 text-lg text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                {profile.location}
              </div>
            )}
          </div>

          {/* Achievement Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mt-8">
            <div className="achievement-card text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <span className="text-3xl font-bold gradient-text">10+</span>
              </div>
              <p className="text-sm text-muted-foreground">Years Experience</p>
            </div>
            <div className="achievement-card text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="h-6 w-6 text-secondary" />
                <span className="text-3xl font-bold gradient-text">99-100%</span>
              </div>
              <p className="text-sm text-muted-foreground">ML Model Accuracy</p>
            </div>
            <div className="achievement-card text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="h-6 w-6 text-primary" />
                <span className="text-3xl font-bold gradient-text">15+</span>
              </div>
              <p className="text-sm text-muted-foreground">Projects Delivered</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container max-w-screen-2xl py-8 md:py-12">
        <div className="mx-auto max-w-[980px]">
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="text-2xl">About Me</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.summary && (
                <p className="text-lg leading-relaxed text-foreground/90">
                  {profile.summary}
                </p>
              )}
              
              {(profile.email || profile.phone || profile.github_url || profile.linkedin_url) && (
                <div className="flex flex-wrap gap-4 pt-4 border-t border-border/50">
                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                      <Mail className="h-4 w-4" />
                      <span className="text-foreground/80">{profile.email}</span>
                    </a>
                  )}
                  {profile.phone && (
                    <a href={`tel:${profile.phone}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                      <Phone className="h-4 w-4" />
                      <span className="text-foreground/80">{profile.phone}</span>
                    </a>
                  )}
                  {profile.github_url && (
                    <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                      <Github className="h-4 w-4" />
                      <span className="text-foreground/80">GitHub</span>
                    </a>
                  )}
                  {profile.linkedin_url && (
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                      <Linkedin className="h-4 w-4" />
                      <span className="text-foreground/80">LinkedIn</span>
                    </a>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="container max-w-screen-2xl py-8 md:py-12 lg:py-16">
        <div className="mx-auto flex max-w-[980px] flex-col items-start gap-8">
          <div className="flex items-center gap-3">
            <Briefcase className="h-7 w-7 text-primary" />
            <h2 className="text-4xl font-bold leading-tight tracking-tighter lg:leading-[1.1]">
              Professional Experience
            </h2>
          </div>

          {experiences && experiences.length > 0 ? (
            <div className="w-full space-y-6">
              {experiences.map((exp) => (
                <div key={exp.id} className="timeline-item">
                  <Card className="gradient-card">
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="space-y-2">
                          <CardTitle className="text-xl">{exp.position}</CardTitle>
                          <CardDescription className="text-base font-semibold text-primary">
                            {exp.company_name}
                          </CardDescription>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            {exp.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {exp.location}
                              </span>
                            )}
                            {exp.employment_type && (
                              <Badge variant="outline" className="text-xs">
                                {exp.employment_type}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="stat-highlight text-sm whitespace-nowrap">
                            {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : (exp.end_date ? formatDate(exp.end_date) : 'Present')}
                          </span>
                          {exp.start_date && (
                            <span className="text-xs text-muted-foreground">
                              {calculateDuration(exp.start_date, exp.end_date, exp.is_current)}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {exp.description && (
                        <p className="text-foreground/90 leading-relaxed">
                          {exp.description}
                        </p>
                      )}

                      {exp.work_achievements && exp.work_achievements.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm uppercase tracking-wide text-primary flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Key Achievements
                          </h4>
                          
                          {exp.work_achievements.some(ach => ach.category) ? (
                            <div className="space-y-4">
                              {Object.entries(
                                exp.work_achievements.reduce((acc, ach) => {
                                  const cat = ach.category || 'General'
                                  if (!acc[cat]) acc[cat] = []
                                  acc[cat].push(ach)
                                  return acc
                                }, {})
                              ).map(([category, achievements]) => (
                                <div key={category} className="space-y-2">
                                  <h5 className="font-medium text-sm text-secondary">{category}</h5>
                                  <ul className="space-y-2 ml-4">
                                    {achievements.map((ach, idx) => (
                                      <li key={idx} className="text-sm text-foreground/80 leading-relaxed flex items-start gap-2">
                                        <span className="text-primary mt-1">•</span>
                                        <span>{ach.achievement}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <ul className="space-y-2">
                              {exp.work_achievements.map((ach, idx) => (
                                <li key={idx} className="text-sm text-foreground/80 leading-relaxed flex items-start gap-2">
                                  <span className="text-primary mt-1">•</span>
                                  <span>{ach.achievement}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}

                      {exp.technologies_used && exp.technologies_used.length > 0 && (
                        <div className="space-y-2 pt-4 border-t border-border/50">
                          <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                            Technologies Used
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {exp.technologies_used.map((tech, idx) => (
                              <span key={idx} className="skill-badge">
                                {tech.technology}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <Card className="w-full gradient-card">
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">Professional experience will appear here</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="container max-w-screen-2xl py-8 md:py-12 lg:py-16">
        <div className="mx-auto flex max-w-[980px] flex-col items-start gap-8">
          <div className="flex items-center gap-3">
            <Zap className="h-7 w-7 text-secondary" />
            <h2 className="text-4xl font-bold leading-tight tracking-tighter lg:leading-[1.1]">
              Skills & Expertise
            </h2>
          </div>

          {!skills || skills.length === 0 ? (
            <Card className="w-full gradient-card">
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">Technical skills will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 w-full md:grid-cols-2">
              {skills.map((skillCategory) => (
                <Card key={skillCategory.id} className="gradient-card">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      {skillCategory.category.includes('Machine Learning') || skillCategory.category.includes('ML') || skillCategory.category.includes('AI') ? (
                        <span className="text-secondary">⚡</span>
                      ) : (
                        <span className="text-primary">◆</span>
                      )}
                      {skillCategory.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {skillCategory.skills?.map((skill, idx) => (
                        <span 
                          key={idx} 
                          className={skillCategory.category.includes('Machine Learning') || skillCategory.category.includes('ML') || skillCategory.category.includes('AI') ? 'skill-badge-ml' : 'skill-badge'}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="container max-w-screen-2xl py-8 md:py-12 lg:py-16">
        <div className="mx-auto flex max-w-[980px] flex-col items-start gap-8">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-7 w-7 text-primary" />
            <h2 className="text-4xl font-bold leading-tight tracking-tighter lg:leading-[1.1]">
              Education
            </h2>
          </div>

          {!education || education.length === 0 ? (
            <Card className="w-full gradient-card">
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">Education history will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="w-full space-y-6">
              {education.map((edu) => (
                <Card key={edu.id} className="gradient-card">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="space-y-2">
                        <CardTitle className="text-xl">{edu.degree}</CardTitle>
                        <CardDescription className="text-base font-semibold text-primary">
                          {edu.institution}
                        </CardDescription>
                        {edu.field_of_study && (
                          <p className="text-sm text-muted-foreground">{edu.field_of_study}</p>
                        )}
                        {edu.location && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {edu.location}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="stat-highlight text-sm whitespace-nowrap">
                          {edu.start_year} - {edu.end_year || 'Present'}
                        </span>
                        {edu.gpa && (
                          <Badge variant="outline" className="text-xs">
                            GPA: {edu.gpa}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {edu.thesis_title && (
                      <div>
                        <h4 className="font-semibold text-sm text-secondary mb-1">Thesis</h4>
                        <p className="text-sm text-foreground/80 italic">{edu.thesis_title}</p>
                      </div>
                    )}

                    {edu.specialization && edu.specialization.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                          Specialization
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {edu.specialization.map((spec, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {edu.achievements && edu.achievements.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                          <Award className="h-3 w-3" />
                          Achievements
                        </h4>
                        <ul className="space-y-1">
                          {edu.achievements.map((achievement, idx) => (
                            <li key={idx} className="text-sm text-foreground/80 flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{achievement}</span>
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

      {/* Contact Section */}
      <section id="contact" className="container max-w-screen-2xl py-8 md:py-12 lg:py-16">
        <div className="mx-auto flex max-w-[800px] flex-col items-center gap-6 text-center">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold leading-tight tracking-tighter lg:leading-[1.1]">
              Let's Work Together
            </h2>
            <p className="max-w-[600px] text-lg text-muted-foreground">
              I'm available for new opportunities. Let's create something amazing together.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-6">
            {profile.email && (
              <Button size="lg" className="glow-animation" asChild>
                <a href={`mailto:${profile.email}`}>
                  <Mail className="mr-2 h-5 w-5" />
                  Send me an email
                </a>
              </Button>
            )}
            {profile.linkedin_url && (
              <Button size="lg" variant="outline" className="gradient-card" asChild>
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

      <div className="section-divider" />
 
      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 max-w-screen-2xl">
          <div className="flex flex-col items-center justify-center gap-6 py-10">
            {/* Social Links */}
            <div className="flex items-center gap-6">
              {profile.github_url && (
                <a 
                  href={profile.github_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-primary transition-all hover:scale-110"
                  aria-label="GitHub"
                >
                  <Github className="h-6 w-6" />
                </a>
              )}
              {profile.linkedin_url && (
                <a 
                  href={profile.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-primary transition-all hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              )}
            </div>

            {/* Built With */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>Built with</span>
              <span className="text-primary font-medium">Next.js</span>
              <span>•</span>
              <span className="text-primary font-medium">Tailwind CSS</span>
              <span>•</span>
              <span className="text-primary font-medium">Supabase</span>
              <span>•</span>
              <span className="text-primary font-medium">Vercel</span>
            </div>

            {/* Copyright */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} <span className="text-foreground font-medium">{profile.full_name}</span>
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                All rights reserved
              </p>
            </div>

            {/* Visitor Counter */}
            <div className="pt-2">
              <VisitorCounter />
            </div>
          </div>
        </div>
      </footer>


    </div>
  )
}