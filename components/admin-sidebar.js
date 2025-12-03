'use client'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area" 
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  Award, 
  GraduationCap,
  FileText,
  Settings 
} from "lucide-react"

const sidebarNav = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "Profile",
    href: "/admin/dashboard/profile",
    icon: User
  },
  {
    title: "Experience",
    href: "/admin/dashboard/experience",
    icon: Briefcase
  },
  {
    title: "Skills",
    href: "/admin/dashboard/skills",
    icon: Award
  },
  {
    title: "Education",
    href: "/admin/dashboard/education",
    icon: GraduationCap
  },
  {
    title: "Certifications",
    href: "/admin/dashboard/certifications",
    icon: FileText
  } 
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="pb-12 w-64 border-r min-h-screen bg-muted/10">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mb-4 px-4">
            <h2 className="text-lg font-semibold tracking-tight">
              CV Management
            </h2>
            <p className="text-xs text-muted-foreground">
              Manage your portfolio content
            </p>
          </div>
          <div className="space-y-1">
            {sidebarNav.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    pathname === item.href && "bg-muted font-medium"
                  )}
                  asChild
                >
                  <a href={item.href}>
                    <Icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </a>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}