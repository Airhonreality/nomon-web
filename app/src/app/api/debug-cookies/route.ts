// Devuelve exactamente lo que requireMailAccess vería
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("nomon_mail")?.value;
  return NextResponse.json({
    step: "before-require-mail-access",
    token_present: !!token,
    token_value: token,
    token_length: token?.length ?? 0,
    all_cookie_names: req.cookies.getAll().map(c => c.name),
    url: req.url,
    method: req.method,
  });
}
