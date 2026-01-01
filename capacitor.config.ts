import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kvideo.app',
  appName: 'KVideo',
  webDir: 'out', // Next.js 静态导出输出目录
  server: {
    androidScheme: 'https'
  }
};

export default config;
