import { useEffect } from 'react';

interface GlobalKeyboardOptions {
  onShowHelp?: () => void;
}

// 中文注释：全局快捷键 Hook，处理页面级别的键盘导航
export function useGlobalKeyboard(options: GlobalKeyboardOptions = {}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 如果焦点在输入框中，禁用全局快捷键（除了 Esc）
      const target = e.target as HTMLElement;
      const isInputFocused =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if (isInputFocused && e.key !== 'Escape') {
        return;
      }

      // 1 或 Alt+1 - 跳转到学习路线
      if (e.key === '1' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        scrollToSection('roadmap');
        return;
      }

      // 2 或 Alt+2 - 跳转到算法图谱
      if (e.key === '2' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        scrollToSection('algorithms');
        return;
      }

      // ? 或 Shift+/ - 显示快捷键帮助
      if ((e.key === '?' || (e.key === '/' && e.shiftKey)) && options.onShowHelp) {
        e.preventDefault();
        options.onShowHelp();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [options.onShowHelp]);
}

// 中文注释：平滑滚动到指定区域
function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (!element) return;

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });

  // 滚动后短暂高亮区域标题
  const title = element.querySelector('h2');
  if (title) {
    title.style.transition = 'color 0.3s ease';
    const originalColor = window.getComputedStyle(title).color;
    title.style.color = 'var(--accent)';
    setTimeout(() => {
      title.style.color = originalColor;
    }, 600);
  }
}
