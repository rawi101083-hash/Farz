import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { companyName, companyEmail, companyPhone, createdDate } = await req.json()

    if (!companyName || !companyEmail) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 400 
      })
    }

    const htmlBody = `
      <div dir="rtl" style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; padding: 20px;">
        <h2 style="color: #0D9488; text-align: center; margin-bottom: 20px;">تسجيل شركة جديدة 🎉</h2>
        
        <p>مرحباً،</p>
        <p>هناك شركة جديدة انضمت للتو إلى منصة فرز، بانتظار التفعيل من قبل الإدارة:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 20px;">
          <tbody>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f8f9fa; font-weight: bold; width: 35%;">اسم الشركة:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${companyName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f8f9fa; font-weight: bold;">البريد الإلكتروني:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${companyEmail}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f8f9fa; font-weight: bold;">رقم الجوال:</td>
              <td style="padding: 10px; border: 1px solid #ddd;" dir="ltr">${companyPhone || 'غير متوفر'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f8f9fa; font-weight: bold;">وقت التسجيل:</td>
              <td style="padding: 10px; border: 1px solid #ddd;" dir="ltr">${createdDate || new Date().toLocaleString('ar-SA')}</td>
            </tr>
          </tbody>
        </table>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://farz.io/?step=superAdmin" style="background-color: #0D9488; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">الانتقال للوحة التحكم للتفعيل</a>
        </div>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'نظام إشعارات فرز <notifications@farz.io>',
        to: 'farz.hr.sa@gmail.com',
        subject: `تسجيل جديد: شركة ${companyName}`,
        html: htmlBody
      })
    })

    const resendData = await res.json()

    if (!res.ok) {
      throw new Error(`Resend Error: ${JSON.stringify(resendData)}`)
    }

    return new Response(JSON.stringify({ success: true, resendData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (err: any) {
    console.error("EDGE FUNCTION ERROR:", err.message)
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
