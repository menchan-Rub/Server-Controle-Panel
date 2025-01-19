import Link from "next/link"
import { type LucideIcon } from 'lucide-react'

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface NavItem {
  title: string
  href: string
  icon?: LucideIcon
}

interface MainNavProps {
  items: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "text-sm font-medium transition-colors hover:text-primary"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}

