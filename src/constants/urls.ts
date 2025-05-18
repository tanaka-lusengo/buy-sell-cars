export const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';

export const SOCIAL_MEDIA_URLS = {
  phone_whatsapp: 'https://wa.me/+263773607117',
  phone_tel: 'tel:+263773607117',
  phone: '+263 77 360 7117',
  email: 'mailto:sales@buysellcars.co.zw',
  facebook: 'https://www.facebook.com/profile.php?id=61561619667231',
  instagram:
    'https://www.instagram.com/buysellcars.zw?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
};
