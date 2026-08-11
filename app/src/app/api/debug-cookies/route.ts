// Debug: imprimir TODO lo que el route handler ve del request
// Usa un endpoint temporal de diagnóstico
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const allHeaders: Record<string, string> = {};
  req.headers.forEach((v, k) => { allHeaders[k] = v; });

  const cookies = req.cookies.getAll();

  return NextResponse.json({
    cookieHeader: req.headers.get("cookie"),
    parsedCookies: cookies,
    nomon_mail_value: req.cookies.get("nomon_mail")?.value ?? null,
    allHeaders,
  });
}
