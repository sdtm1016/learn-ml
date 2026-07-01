import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 中文注释：构建配置
// manualChunks 把体积较大的第三方库拆到独立 vendor chunk，
// 避免单个 chunk 过大、改善缓存命中与按需加载。
// 注意：excalidraw(含 mermaid-to-excalidraw)、reactflow 体积都很大，
// 且都已通过 React.lazy 懒加载，分到独立 chunk 后只在实际使用时才下载。
export default defineConfig(({ mode }) => ({
  // GitHub Pages 部署时需要设置 base 为仓库名
  // 开发环境使用 /，生产环境使用 /learn-ml/
  base: mode === 'production' ? '/learn-ml/' : '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React 运行时单独成包，变动频率低，利于长期缓存
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          // Excalidraw 及其传递依赖 mermaid-to-excalidraw 体积最大，独立分包
          if (
            id.includes('node_modules/@excalidraw/') ||
            id.includes('node_modules/excalidraw')
          ) {
            return 'vendor-excalidraw';
          }
          // React Flow 关系图库独立分包
          if (id.includes('node_modules/reactflow/')) {
            return 'vendor-reactflow';
          }
        },
      },
    },
    // excalidraw 单体即超 500KB，拆分后单 chunk 仍会超阈值；
    // 提高告警阈值避免噪声告警（拆分本身已生效，阈值仅控制提示）
    chunkSizeWarningLimit: 900,
    // 中文注释：只预加载静态入口依赖(vendor-react)，不为懒加载的 chunk
    // (excalidraw/reactflow) 生成 modulepreload——否则浏览器会在首屏就下载这些大包，
    // 架空 React.lazy 的按需加载。用函数式判断：仅预加载首屏同步引用的模块。
    modulePreload: {
      polyfill: true,
      resolveDependencies(_, deps) {
        // 只保留 vendor-react（用 'vendor-react-' 精确匹配，避免误中 vendor-reactflow）
        return deps.filter((d) => d.includes('vendor-react-'));
      },
    },
  },
}));
