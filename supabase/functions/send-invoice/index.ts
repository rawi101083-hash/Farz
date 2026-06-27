import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { PDFDocument, rgb } from 'https://esm.sh/pdf-lib'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const payload = await req.json()
    console.log("Received payload:", JSON.stringify(payload))
    // payload.record represents the row in wallet_transactions
    const record = payload.record

    // Verify it's a completed/success transaction (we only send invoice if status is completed or success)
    if (!record || (record.status !== 'completed' && record.status !== 'success')) {
      console.log("Not a completed/success transaction. Status is:", record?.status)
      return new Response(JSON.stringify({ message: 'Not a completed/success transaction, ignoring' }), { status: 200 })
    }

    // Initialize Supabase Admin Client to fetch user details safely
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 1. Fetch the wallet to get the user_id (which is the company id)
    const { data: wallet } = await supabase
      .from('wallets')
      .select('user_id')
      .eq('id', record.wallet_id)
      .single()

    if (!wallet) throw new Error('Wallet not found')

    // 2. Fetch the company info for the invoice
    const { data: company } = await supabase
      .from('companies')
      .select('company_name, contact_email, tax_number, commercial_registration')
      .eq('id', wallet.user_id)
      .single()

    if (!company) throw new Error('Company not found')

    // Fetch the primary auth email as fallback
    const { data: userData } = await supabase.auth.admin.getUserById(wallet.user_id)
    const email = company.contact_email || userData?.user?.email

    if (!email) throw new Error('Company contact email not found')

    // PDF-lib standard fonts only support WinAnsi (English/Latin). Arabic characters will throw an error.
    // We sanitize strings to ASCII for the PDF. The Arabic text will remain perfectly in the HTML Email Body.
    const sanitizeAscii = (str: string) => str.replace(/[^\x00-\x7F]/g, '').trim() || 'Customer';
    const safeCompanyName = sanitizeAscii(company.company_name);
    const safeDescription = record.description ? sanitizeAscii(record.description) : 'Subscription Payment';

    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([600, 420])

    page.drawText(`INVOICE`, { x: 50, y: 370, size: 24, color: rgb(0.05, 0.58, 0.53) }) // Primary color #0D9488
    
    // Supplier Info
    page.drawText(`From: Farz HR Platform`, { x: 50, y: 340, size: 12 })
    page.drawText(`Riyadh, Saudi Arabia | CR: 7052842361 | Phone: 0579543701`, { x: 50, y: 325, size: 10 })

    // Customer Info
    page.drawText(`To: ${safeCompanyName}`, { x: 50, y: 290, size: 14 })
    page.drawText(`Email: ${email}`, { x: 50, y: 270, size: 12 })
    page.drawText(`Customer CR: ${company.commercial_registration || 'N/A'}`, { x: 50, y: 250, size: 12 })
    
    page.drawText(`Invoice ID: ${record.id}`, { x: 50, y: 210, size: 12 })
    page.drawText(`Total Due: ${record.amount} SAR`, { x: 50, y: 190, size: 14, color: rgb(0.1, 0.7, 0.4) }) // Green amount
    page.drawText(`Issue Date: ${new Date(record.created_at).toLocaleString('en-US', { timeZone: 'Asia/Riyadh' })}`, { x: 50, y: 170, size: 12 })
    page.drawText(`Description: ${safeDescription === 'Customer' ? 'Subscription Package' : safeDescription}`, { x: 50, y: 150, size: 12 })

    // Save PDF as Base64 to attach in Resend
    const pdfBytes = await pdfDoc.save()
    // Deno base64 encoding
    const b64 = btoa(String.fromCharCode(...new Uint8Array(pdfBytes)))

    // 4. Send the Email using Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'منصة فرز <billing@farz.io>',
        to: email,
        subject: `فاتورة اشتراك - ${company.company_name}`,
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; padding: 20px;">
            <div style="text-align: center; border-bottom: 2px solid #0D9488; padding-bottom: 15px; margin-bottom: 20px;">
              <h1 style="color: #0D9488; margin: 0;">فاتورة (Invoice)</h1>
              <p style="margin: 5px 0 0 0; color: #333; font-weight: bold;">منصة فرز للموارد البشرية</p>
              <p style="margin: 0; font-size: 13px; color: #666;">الرياض، المملكة العربية السعودية | س.ت: 7052842361 | جوال: 0579543701</p>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
              <div>
                <strong>العميل:</strong> ${company.company_name}<br/>
                <strong>البريد الإلكتروني:</strong> ${email}<br/>
                <strong>المدينة:</strong> ${company.city || 'غير محدد'}<br/>
                ${company.commercial_registration ? `<strong>السجل التجاري:</strong> ${company.commercial_registration}` : ''}
              </div>
              <div style="text-align: left;">
                <strong>رقم الفاتورة:</strong> ${record.id.substring(0, 8).toUpperCase()}<br/>
                <strong>تاريخ الإصدار:</strong> ${new Date(record.created_at).toLocaleDateString('ar-SA')}<br/>
              </div>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background-color: #f8f9fa;">
                  <th style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">البيان / الباقة</th>
                  <th style="padding: 10px; border-bottom: 1px solid #ddd; text-align: left;">المبلغ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${record.description || 'اشتراك باقة / خدمات إضافية'}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: left;">${record.amount} ريال</td>
                </tr>
              </tbody>
            </table>

            <div style="text-align: left; margin-bottom: 30px;">
              <p style="margin: 5px 0;"><strong>الإجمالي المستحق للدفع:</strong> <span style="color: #0D9488; font-size: 18px; font-weight: bold;">${record.amount} ريال سعودي</span></p>
            </div>

            <div style="text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eaeaea; padding-top: 15px;">
              <p>هذه فاتورة إلكترونية تم إصدارها آلياً من نظام فرز.</p>
              <p>تجدون نسخة PDF مبسطة (باللغة الإنجليزية) في المرفقات.</p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: `invoice-${record.id.substring(0, 8)}.pdf`,
            content: b64
          }
        ]
      })
    })

    const resendData = await res.json()
    console.log("Resend response:", JSON.stringify(resendData))

    if (!res.ok) {
      throw new Error(`Resend Error: ${JSON.stringify(resendData)}`)
    }

    return new Response(JSON.stringify({ success: true, resendData }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (err: any) {
    console.error("EDGE FUNCTION ERROR:", err.message)
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
