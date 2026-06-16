import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// 中文注释：vitest 配置
// 纯函数测试用 node 环境即可，无需 jsdom。@vitejs/plugin-react 仅用于 tsx 转译（若有组件测试再启用）。
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
