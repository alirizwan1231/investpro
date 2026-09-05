import { cookies } from "next/headers"
import { createAdminClient } from "@/lib/supabase/admin"

const COOKIE_NAME = "investpro_admin_impersonation"

type Context = { adminId: string; targetId: string; createdAt: number }

export async function getImpersonationContext() {
  const value = (await cookies()).get(COOKIE_NAME)?.value
  if (!value) return null

  try {
    const context = JSON.parse(value) as Context
    if (!context.adminId || !context.targetId || Date.now() - context.createdAt > 30 * 60 * 1000) return null

    const admin = createAdminClient()
    const [{ data: adminProfile }, { data: targetProfile }] = await Promise.all([
      admin.from("profiles").select("id, role").eq("id", context.adminId).single(),
      admin.from("profiles").select("id, name, username, role, is_blocked").eq("id", context.targetId).single(),
    ])
    if (adminProfile?.role !== "admin" || !targetProfile || targetProfile.role === "admin" || targetProfile.is_blocked) return null

    return { adminId: context.adminId, targetId: context.targetId, targetName: targetProfile.name || targetProfile.username || "user" }
  } catch {
    return null
  }
}
