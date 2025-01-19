"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from 'lucide-react'

import { cn } from "@/lib/utils"

export function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
      <div className="flex h-full flex-col">{children}</div>
    </div>
  )
}

export function SidebarHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("", className)}>{children}</div>
}

export function SidebarContent({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 overflow-auto py-2">{children}</div>
}

export function SidebarGroup({ children }: { children: React.ReactNode }) {
  return <div className="pb-4">{children}</div>
}

export function SidebarGroupLabel({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-2 text-sm font-semibold">{children}</div>
}

export function SidebarGroupContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

export function SidebarMenu({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

export function SidebarMenuItem({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

export function SidebarMenuButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "flex w-full items-center py-2 px-4 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function SidebarMenuSub({ children }: { children: React.ReactNode }) {
  return <div className="pl-4">{children}</div>
}

export function SidebarMenuSubItem({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

export function SidebarMenuSubButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "flex w-full items-center py-2 px-4 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function SidebarInset({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 overflow-auto">
      {children}
    </div>
  )
}

