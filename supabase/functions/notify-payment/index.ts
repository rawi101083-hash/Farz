import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const NOTIFY_EMAIL = "rawi101083@gmail.com" // Changed temporarily from farz.hr.sa@gmail.com because Resend sandbox requires sending to the account owner

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { customerName, customerEmail, customerPhone, planName, price, type } = await req.json()

    if (!RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY")
    }

    const htmlContent = `
      <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #0D9488;">طلب دفع جديد 💰</h2>
        <p>مرحباً،</p>
        <p>هناك عميل جديد يحاول إتمام عملية الدفع عبر التحويل البنكي (توجيه الواتساب).</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; width: 30%;">اسم العميل</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${customerName || 'غير متوفر'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">إيميل العميل</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${customerEmail || 'غير متوفر'}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">رقم الجوال</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0; direction: ltr; text-align: right;">${customerPhone || 'غير متوفر'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">نوع الطلب</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${type === 'subscription' ? 'اشتراك باقة' : 'شراء إعلان وظيفي'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">الباقة / المنتج</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0; color: #0D9488; font-weight: bold;">${planName}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">المبلغ</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${price} ر.س</td>
          </tr>
        </table>
        
        <p style="margin-top: 30px;">
          العميل في طريقه الآن إلى محادثة الواتساب الخاصة بك! قم بالرد عليه لتأكيد التحويل وتفعيل الباقة له يدوياً من لوحة التحكم.
        </p>
        <p style="color: #64748b; font-size: 12px;">رسالة آلية من منصة فرز للتوظيف الذكي.</p>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Farz Payments <onboarding@resend.dev>', // Temporary workaround until farz.sa is verified in Resend
        to: NOTIFY_EMAIL,
        subject: `🚨 طلب دفع جديد: ${planName}`,
        html: htmlContent
      })
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(`Resend Error: ${JSON.stringify(data)}`)
    }

    return new Response(
      JSON.stringify({ success: true, message: "Email sent" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
