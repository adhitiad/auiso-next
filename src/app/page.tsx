import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

const locales = ['en', 'id', 'th', 'vi', 'ja', 'zh', 'my', 'ru', 'ko'];

const countryToLocale: Record<string, string> = {
  'ID': 'id',
  'TH': 'th',
  'VN': 'vi',
  'JP': 'ja',
  'CN': 'zh',
  'TW': 'zh',
  'MM': 'my',
  'RU': 'ru',
  'KR': 'ko',
};

export default async function RootPage() {
  const headersList = await headers();
  const country = headersList.get('x-vercel-ip-country') || headersList.get('cf-ipcountry') || '';
  
  let targetLocale = 'en'; // default
  
  if (country && countryToLocale[country]) {
    targetLocale = countryToLocale[country];
  } else {
    // fallback to accept-language
    const acceptLanguage = headersList.get('accept-language');
    if (acceptLanguage) {
      const preferredLanguage = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
      if (locales.includes(preferredLanguage)) {
        targetLocale = preferredLanguage;
      }
    }
  }

  redirect(`/${targetLocale}`);
}
