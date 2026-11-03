import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '页面未找到',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold">页面未找到</h1>
      <p className="text-[var(--text-color-secondary)]">这个地址不存在或已失效。</p>
      <Link href="/" className="underline text-[var(--accent-color)]">
        返回首页
      </Link>
    </div>
  );
}
