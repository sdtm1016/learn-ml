import { useState, useEffect } from 'react';

// 中文注释：主题类型定义
export type Theme = 'light' | 'dark';

// 中文注释：主题管理 Hook
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // 1. 优先读取 localStorage
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    // 2. 跟随系统主题
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    // 3. 默认明亮主题
    return 'light';
  });

  // 中文注释：应用主题到 DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 中文注释：切换主题
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
}
