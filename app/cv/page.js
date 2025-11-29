'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, MapPin, Github, Linkedin, Globe, Briefcase, GraduationCap, Award, ExternalLink, ArrowRight } from 'lucide-react'

export default function CVPage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profiles')
      const data = await res.json()
      if (data.length > 0) {
        setProfile(data[0])
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
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
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">

        {/* Header - FIXED */}
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

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Work History</CardTitle>
              <CardDescription>
                My professional journey and key accomplishments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p className="mb-2">Work experiences will appear here</p>
                <p className="text-sm">Add experiences from the admin dashboard</p>
                <Button variant="link" asChild className="mt-4">
                  <a href="/">
                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
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

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Skills & Technologies</CardTitle>
              <CardDescription>
                Technologies and tools I work with
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p className="mb-2">Technical skills will appear here</p>
                <p className="text-sm">Add skills from the admin dashboard</p>
                <Button variant="link" asChild className="mt-4">
                  <a href="/">
                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Education */}
      <section id="education" className="container max-w-screen-2xl py-8 md:py-12 lg:py-16">
        <div className="mx-auto flex max-w-[980px] flex-col items-start gap-2">
          <div className="flex items-center gap-2 mb-8">
            <GraduationCap className="h-6 w-6" />
            <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
              Education
            </h2>
          </div>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Academic Background</CardTitle>
              <CardDescription>
                My educational qualifications and achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p className="mb-2">Education history will appear here</p>
                <p className="text-sm">Add education from the admin dashboard</p>
                <Button variant="link" asChild className="mt-4">
                  <a href="/">
                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
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
            I'm available for freelance work and new opportunities. Let's discuss how I can help bring your ideas to life.
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

      {/* Footer - FIXED */}
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
                {profile.website_url && (
                <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Globe className="h-5 w-5" />
                </a>
                )}
            </div>
            </div>
        </div>
        </footer>
    </div>
  )
}