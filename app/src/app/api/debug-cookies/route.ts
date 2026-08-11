// Réplica exacta de requireMailAccess para diagnosticar
import { getCurrentUser } from "@/lib/auth";
import { esCorreoCorporativo } from "@/lib/auth-mail";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("nomon_mail")?.value;
  const debug: Record<string, unknown> = {
    step1_token_present: !!token,
    step1_token_value_prefix: token?.slice(0, 8),
  };

  if (!token) {
    return NextResponse.json({ ...debug, fail_at: "step1", error: "No hay sesión activa" }, { status: 401 });
  }

  let user = null;
  let userErr: string | null = null;
  try {
    user = await getCurrentUser(token);
  } catch (e) {
    userErr = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
  }

  debug.step2_getCurrentUser_returned = user;
  debug.step2_getCurrentUser_error = userErr;

  if (!user) {
    return NextResponse.json({ ...debug, fail_at: "step2", error: "Sesión inválida o expirada" }, { status: 401 });
  }

  if (!esCorreoCorporativo(user.email)) {
    return NextResponse.json({ ...debug, fail_at: "step3", error: "Acceso restringido al correo corporativo" }, { status: 403 });
  }

  return NextResponse.json({ ...debug, ok: true });
}
