import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

// 中文注释：主题切换按钮组件
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={theme === 'light' ? '切换到暗色模式' : '切换到明亮模式'}
      title={theme === 'light' ? '暗色模式' : '明亮模式'}
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}
