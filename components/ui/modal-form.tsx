"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ModalFormProps extends React.ComponentPropsWithoutRef<typeof DialogContent> {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  footer?: React.ReactNode
  onSubmit?: (e: React.FormEvent) => void
  children: React.ReactNode
  submitLabel?: string
  cancelLabel?: string
  isPending?: boolean
}

export function ModalForm({
  open,
  onOpenChange,
  title,
  description,
  footer,
  onSubmit,
  children,
  className,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  isPending = false,
  ...props
}: ModalFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-lg", className)} {...props}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            {children}
          </div>
          <DialogFooter>
            {footer || (
              <>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  disabled={isPending}
                >
                  {cancelLabel}
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Processing..." : submitLabel}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
