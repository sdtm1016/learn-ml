import { SearchBar } from '../SearchBar';
import { ThemeToggle } from '../ThemeToggle';
import { Github } from 'lucide-react';
import type { AlgorithmItem } from '../../data/algorithms';

interface HeaderProps {
  onSelectAlgorithm: (algo: AlgorithmItem) => void;
  onOpenMedicalDoc?: () => void;
}

// 中文注释：网站头部组件，包含品牌标识、搜索栏、主题切换和导航链接
export function Header({ onSelectAlgorithm, onOpenMedicalDoc }: HeaderProps) {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="返回首页">
        <span className="brand-mark">ML</span>
        <span>Learn Matrix</span>
      </a>
      <SearchBar onSelectAlgorithm={onSelectAlgorithm} />
      <div className="header-actions">
        <a
          className="github-link"
          href="https://github.com/sdtm1016/learn-ml"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="查看源代码"
          title="GitHub 源代码"
        >
          <Github size={20} />
        </a>
        <ThemeToggle />
      </div>
      <nav className="nav-links" aria-label="主导航">
        <a href="#roadmap">学习路线</a>
        <a href="#algorithms">算法图谱</a>
        <button
          className="nav-link-button"
          onClick={onOpenMedicalDoc}
          aria-label="查看医疗AI核心算法详解"
        >
          🏥 医疗算法
        </button>
        {/* 暂时隐藏：建模流程和应用方向功能待实现 */}
        {/* <a href="#workflow">建模流程</a> */}
        {/* <a href="#applications">应用方向</a> */}
      </nav>
    </header>
  );
}
