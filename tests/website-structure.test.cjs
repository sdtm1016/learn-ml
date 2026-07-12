const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

// 中文注释：递归读取目录下所有文件内容（样式已拆分到 src/styles/*.css 多文件，需聚合读取）
function readDir(relativeDir, ext) {
  const dir = path.join(root, relativeDir);
  if (!fs.existsSync(dir)) return '';
  const result = [];
  function walk(d) {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (!ext || entry.name.endsWith(ext)) {
        result.push(fs.readFileSync(full, 'utf8'));
      }
    }
  }
  walk(dir);
  return result.join('\n');
}

// ============================================================
// 测试意图：本项目是一个 React + TS + Vite 的机器学习算法学习网站。
// 这些断言保护"网站骨架与核心教学契约"不被无意破坏：
//   1) 技术栈与构建配置完整
//   2) 算法详情页保留通俗原理/医疗示例/手绘图解等教学字段
//   3) Excalidraw 手绘图集成保持可用
//   4) 关键导航与交互入口存在
// 若断言失败，说明重构时遗漏了某个教学契约或核心入口，需复核而非删除断言。
// ============================================================

// ---- 1. 技术栈与配置骨架 ----
assert(exists('package.json'), 'package.json should exist');
assert(exists('vite.config.ts'), 'vite.config.ts should exist');
assert(exists('tsconfig.json'), 'tsconfig.json should exist');
assert(exists('src/main.tsx'), 'src/main.tsx should exist');
assert(exists('src/App.tsx'), 'src/App.tsx should exist');
assert(exists('src/styles.css'), 'src/styles.css should exist');
assert(exists('src/data/algorithms.ts'), 'src/data/algorithms.ts should exist');
assert(exists('src/data/excalidrawScenes.ts'), 'src/data/excalidrawScenes.ts should exist');
assert(exists('src/components/SketchModal.tsx'), 'src/components/SketchModal.tsx should exist');

const pkg = JSON.parse(read('package.json'));
const deps = { ...pkg.dependencies, ...pkg.devDependencies };

['@vitejs/plugin-react', 'vite', 'typescript', 'react', 'react-dom', '@excalidraw/excalidraw'].forEach(
  (name) => {
    assert(deps[name], `package.json should include ${name}`);
  }
);

assert(pkg.scripts?.build, 'package.json should define build script');
assert(pkg.scripts?.dev, 'package.json should define dev script');
assert(pkg.scripts?.['test:structure'], 'package.json should define test:structure script');

// ---- 2. 关键源文件读取 ----
const app = read('src/App.tsx');
const stylesMain = read('src/styles.css');
const allStyles = stylesMain + '\n' + readDir('src/styles', '.css'); // 含拆分的子样式文件
// algorithms 数据已拆分到 src/data/algorithms/ 目录，聚合读取整个模块用于数据契约断言
const algorithmData = read('src/data/algorithms.ts') + '\n' + readDir('src/data/algorithms', '.ts');
const sceneData = exists('src/data/excalidrawScenes.ts') ? read('src/data/excalidrawScenes.ts') : '';
const sketchModal = exists('src/components/SketchModal.tsx') ? read('src/components/SketchModal.tsx') : '';
const algorithmDetail = exists('src/components/sections/AlgorithmSection/AlgorithmDetail.tsx')
  ? read('src/components/sections/AlgorithmSection/AlgorithmDetail.tsx')
  : '';

// ---- 3. App.tsx 顶层状态与交互入口（这些状态确实由 App 持有） ----
['selectedAlgorithm', 'openAlgorithm', 'sketchScene'].forEach((text) => {
  assert(app.includes(text), `src/App.tsx should include ${text}`);
});

// ---- 4. 教学字段契约：算法详情必须呈现通俗原理/示例/为什么选它 ----
// 意图：保护"算法详情页的四大教学板块"——这是产品核心价值，迁移文件时不能丢。
assert(algorithmDetail.includes('通俗原理'), 'AlgorithmDetail should render 通俗原理 section');
assert(algorithmDetail.includes('医疗场景示例'), 'AlgorithmDetail should render 医疗场景示例 section');
assert(algorithmDetail.includes('其他场景示例'), 'AlgorithmDetail should render 其他场景示例 section');
assert(algorithmDetail.includes('为什么选它'), 'AlgorithmDetail should render 为什么选它 section');
assert(algorithmDetail.includes('查看手绘图解'), 'AlgorithmDetail should offer 查看手绘图解 entry');

// ---- 5. 导航与内容板块入口（分布在 Header/Hero，聚合校验） ----
// 意图：保证首页导航词与学习路径入口完整，重构时不被误删。
const navSource = readDir('src/components', '.tsx');
['机器学习入门', '学习路线', '算法图谱', '建模流程', '应用方向'].forEach((text) => {
  assert(navSource.includes(text), `components should include nav term ${text}`);
});

// ---- 6. 样式契约：算法详情与手绘弹窗的核心布局类必须存在 ----
// 意图：这些类是详情页与手绘弹窗的视觉骨架，样式拆分后仍须保留。
['.algorithm-atlas', '.algorithm-detail', '.algorithm-detail-grid', '.example-card', '.principle-card'].forEach(
  (cls) => {
    assert(allStyles.includes(cls), `styles should include ${cls}`);
  }
);
['.sketch-modal', '.sketch-modal__panel', '@media'].forEach((cls) => {
  assert(allStyles.includes(cls), `styles should include ${cls}`);
});

// ---- 7. 反契约：不应把原始 Markdown 当作主内容渲染（早期架构已弃用） ----
assert(!app.includes('ReactMarkdown'), 'src/App.tsx should not render raw Markdown documents as the main content');
assert(!stylesMain.includes('.markdown-reader'), 'src/styles.css should not keep Markdown reader styles as page structure');

// ---- 8. 算法数据规模：至少 30 个算法，保证内容体量 ----
// 意图：数据已拆分到 algorithms/ 目录，聚合统计所有数据文件的 name 字段数量。
const algorithmMatches = algorithmData.match(/name: '/g) || [];
assert(algorithmMatches.length >= 30, 'algorithms module should define at least 30 algorithms');

// ---- 9. 算法类型与叙事字段：数据模型契约 ----
// 意图：保护数据模型契约，类型定义在 algorithms/types.ts，聚合入口在 algorithms/index.ts。
[
  'export type AlgorithmCategory',
  'export type AlgorithmItem',
  'export const algorithms',
  'plainExplanation',
  'medicalExample',
  'fallbackExample',
  'whyItFits',
].forEach((text) => {
  assert(algorithmData.includes(text), `algorithms module should include ${text}`);
});

// ---- 10. Excalidraw 手绘场景资源契约：核心算法必须有手绘图解 ----
[
  'import.meta.glob',
  '逻辑回归-手绘涂鸦风格.excalidraw',
  '随机森林-手绘涂鸦风格.excalidraw',
  '主成分分析PCA-手绘涂鸦风格.excalidraw',
  'K近邻KNN-手绘涂鸦风格.excalidraw',
  'XGBoost-手绘涂鸦风格.excalidraw',
].forEach((text) => {
  assert(sceneData.includes(text), `excalidrawScenes.ts should include ${text}`);
});

// ---- 11. SketchModal 集成契约：懒加载 + 只读预览 ----
['@excalidraw/excalidraw', 'Excalidraw', 'initialData', 'viewModeEnabled', 'onClose'].forEach((text) => {
  assert(sketchModal.includes(text), `SketchModal should include ${text}`);
});
// 意图：Excalidraw 体积大，必须懒加载，否则拖垮首屏。
assert(sketchModal.includes('lazy('), 'SketchModal should lazy-load Excalidraw');

// ---- 12. 梯度提升三连模块骨架契约 ----
// 意图：保护这个可视化教学模块的入口和核心结构不被无意删除。
assert(exists('src/components/sections/BoostingTrilogySection/index.tsx'), 'BoostingTrilogySection should exist');
const boostingSource = readDir('src/components/sections/BoostingTrilogySection', '.tsx');
['BoostingTrilogySection', 'EvolutionTimeline', 'useAutoPlay'].forEach((text) => {
  assert(boostingSource.includes(text), `BoostingTrilogySection should include ${text}`);
});
// Header 含锚点
const headerSource = read('src/components/layout/Header.tsx');
assert(headerSource.includes('#boosting-trilogy'), 'Header should link to #boosting-trilogy');
// App 挂载了 section
assert(app.includes('BoostingTrilogySection'), 'App should mount BoostingTrilogySection');
// CSS 含关键类
const boostingStyles = read('src/styles/boosting-trilogy.css');
['.bt-section', '.bt-timeline', '.bt-stepper', '@media'].forEach((cls) => {
  assert(boostingStyles.includes(cls), `boosting-trilogy.css should include ${cls}`);
});
// 数据契约：三个 demo 文件存在
['gbdt', 'xgboost', 'lightgbm'].forEach((id) => {
  assert(exists(`src/data/boostingTrilogy/${id}.ts`), `boostingTrilogy/${id}.ts should exist`);
});

console.log('React website structure checks passed.');
