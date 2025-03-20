// app/layout.js
import './globals.css'; // Import Tailwind CSS globally
import ClientLayout from './client-layout';
import Channeltalk from '@/components/channel_talk'

export const metadata = {
  title: "개천용 컨설팅",
  openGraph: {
    type: 'website',
    title: '개천용 컨설팅',
    site_name : '개천용 컨설팅',
    image : 'www.gaechundragon.co.kr/components/opengraph.png',
    description: '성적표 인증 기반 고른기회 전형 모의지원 서비스.',
  },
  description: "믿을 수 있는 고른기회 전형 전문 입시 컨설팅.",
  keywords: '',
  icons: {
    icon: "/icon.ico",
  },
  verification: {
    other: {
      'naver-site-verification': '577bbbbae74a4290a4dcbb58e770025cd09464b9',
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <ClientLayout>
          <Channeltalk/>
          {children}</ClientLayout>
      </body>
    </html>
  );
}
