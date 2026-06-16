import { useEffect, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import { Search, X } from 'lucide-react';
import { algorithms, type AlgorithmItem } from '../data/algorithms';

// 中文注释：配置 Fuse.js 模糊搜索引擎
const fuse = new Fuse(algorithms, {
  keys: ['name', 'label', 'description', 'family', 'intuition', 'plainExplanation'],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2,
});

interface SearchBarProps {
  onSelectAlgorithm: (algorithm: AlgorithmItem) => void;
}

export function SearchBar({ onSelectAlgorithm }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AlgorithmItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 中文注释：搜索逻辑，输入 2 个字符后触发
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const searchResults = fuse.search(query);
    setResults(searchResults.slice(0, 8).map((r) => r.item));
  }, [query]);

  // 中文注释：快捷键支持 Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }

      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
        setResults([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 中文注释：点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (algorithm: AlgorithmItem) => {
    onSelectAlgorithm(algorithm);
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div className="search-container" ref={containerRef}>
      <div className="search-input-wrapper">
        <Search size={18} className="search-icon" />
        <input
          ref={inputRef}
          type="search"
          className="search-input"
          placeholder="搜索算法... (Ctrl+K)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
        {query && (
          <button className="search-clear" onClick={handleClear} aria-label="清除搜索">
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="search-results">
          <div className="search-results-header">
            找到 {results.length} 个结果
          </div>
          {results.map((algorithm) => (
            <button
              key={algorithm.name}
              className="search-result-item"
              onClick={() => handleSelect(algorithm)}
            >
              <div className="search-result-main">
                <strong>{algorithm.name}</strong>
                <span className="search-result-label">{algorithm.label}</span>
              </div>
              <div className="search-result-meta">
                <span className="search-result-family">{algorithm.family}</span>
                <span className="search-result-difficulty">{algorithm.difficulty}</span>
              </div>
              <p className="search-result-desc">{algorithm.description}</p>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="search-results">
          <div className="search-no-results">
            未找到匹配的算法，试试其他关键词
          </div>
        </div>
      )}
    </div>
  );
}
