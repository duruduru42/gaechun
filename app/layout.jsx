// app/layout.js
import './globals.css'; // Import Tailwind CSS globally
import ClientLayout from './client-layout';

export const metadata = {
  title: "개천용 입시 컨설팅",
  openGraph: {
    type: 'website',
    title: '개천용 입시 컨설팅',
    description: '농어촌 전형, 기회균형 전형, 고른기회 전형, 특성화고 전형 전문으로 컨설팅을 하고 있는 개천용 입시 컨설팅입니다. 정시 컨설팅과 수시 컨설팅, 생기부 컨설팅까지 모두 진행하고 있습니다.',
  },
  description: "농어촌 전형, 기회균형 전형, 고른기회 전형, 특성화고 전형 전문으로 컨설팅을 하고 있는 개천용 입시 컨설팅입니다. 정시 컨설팅과 수시 컨설팅, 생기부 컨설팅까지 모두 진행하고 있습니다.",
  keywords: '개천용입시컨설팅 농어촌전형 기회균형전형 고른기회전형 고른기회전형컨설팅 기회균형전형컨설팅 특성화고전형',
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
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
