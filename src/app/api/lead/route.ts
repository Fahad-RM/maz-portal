import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      company,
      location,
      service_interested,
      notes,
      billing_cycle
    } = body;

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { error: "Name and either email or phone are required." },
        { status: 400 }
      );
    }

    const cleanName = String(name).trim();
    const cleanEmail = email ? String(email).trim() : "";
    const cleanPhone = phone ? String(phone).trim() : "";
    const cleanCompany = company ? String(company).trim() : "";
    const cleanLocation = location ? String(location).trim() : "";
    const cleanService = service_interested || "Ultimate Omnichannel Suite (Yearly)";
    const cleanBilling = billing_cycle || "Yearly";
    const cleanNotes = notes ? String(notes).trim() : "";

    const fullNotes = [
      `💼 Plan Selected: ${cleanService}`,
      `💳 Billing Preference: ${cleanBilling}`,
      cleanCompany ? `🏢 Company: ${cleanCompany}` : null,
      cleanLocation ? `📍 Location: ${cleanLocation}` : null,
      cleanNotes ? `📝 Client Requirements: ${cleanNotes}` : null,
      `🌐 Source: ai.maifelz.com (Pricing Get Started Modal)`
    ]
      .filter(Boolean)
      .join("\n");

    let odooLeadId: number | null = null;
    let odooSuccess = false;

    // 1. Direct Odoo CRM JSON-RPC synchronization
    try {
      const odooRpcPayload = {
        jsonrpc: "2.0",
        method: "call",
        params: {
          name: cleanName,
          contact_name: cleanName,
          company: cleanCompany,
          partner_name: cleanCompany,
          phone: cleanPhone,
          email: cleanEmail,
          email_from: cleanEmail,
          location: cleanLocation,
          city: cleanLocation,
          service_interested: cleanService,
          notes: fullNotes
        },
        id: Date.now()
      };

      const odooRes = await fetch("https://maifelz-maifelz-maz.odoo.com/api/maz_chatbot/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(odooRpcPayload),
        cache: "no-store"
      });

      if (odooRes.ok) {
        const odooData = await odooRes.json();
        const result = odooData?.result;
        if (result?.status === "success" || result?.lead_id) {
          odooSuccess = true;
          odooLeadId = result.lead_id || null;
        }
      }
    } catch (odooErr) {
      console.error("[Lead API] Odoo direct sync error:", odooErr);
    }

    // 2. Parallel Sync to MAZ AI Backend on Render (Database & AI Scoring)
    try {
      fetch("https://maz-backend-t1hy.onrender.com/api/v1/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bot_id: "maz_maifelz_live",
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          company: cleanCompany,
          location: cleanLocation,
          service_interested: cleanService,
          notes: fullNotes
        })
      }).catch((backendErr) => {
        console.warn("[Lead API] MAZ Backend sync warning:", backendErr);
      });
    } catch (e) {
      // Non-blocking
    }

    return NextResponse.json({
      success: true,
      message: "Lead captured successfully and routed to Maifelz Technologies LLP CRM.",
      odoo_lead_id: odooLeadId,
      odoo_synced: odooSuccess
    });
  } catch (error: any) {
    console.error("[Lead API Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
