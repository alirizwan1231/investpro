"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { stopImpersonation } from "@/lib/actions/admin"

export function ImpersonationBanner({ userName }: { userName: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function stop() {
    startTransition(async () => {
      const result = await stopImpersonation()
      if (!result.ok) {
        toast.error(result.error ?? "Could not stop account view.")
        return
      }
      router.push("/admin")
      router.refresh()
    })
  }

  return (
    <div className="border-b border-warning/30 bg-warning/10 px-4 py-2 text-warning">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 text-sm">
        <span>You are viewing {userName}&apos;s account as an administrator.</span>
        <Button size="sm" variant="outline" disabled={pending} onClick={stop}>
          Return to admin
        </Button>
      </div>
    </div>
  )
}
