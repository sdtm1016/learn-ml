import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X } from 'lucide-react';

interface MedicalAlgorithmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MedicalAlgorithmModal({ isOpen, onClose }: MedicalAlgorithmModalProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // 加载 Markdown 文档，使用 BASE_URL 确保在 GitHub Pages 上路径正确
      const docPath = `${import.meta.env.BASE_URL}docs/医疗AI核心算法详解.md`;
      fetch(docPath)
        .then((res) => res.text())
        .then((text) => {
          setContent(text);
          setLoading(false);
        })
        .catch((err) => {
          console.error('加载文档失败:', err);
          setContent('# 加载失败\n\n无法加载医疗AI核心算法详解文档。');
          setLoading(false);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content medical-doc-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="medical-doc-title"
      >
        {/* 头部 */}
        <div className="modal-header">
          <h2 id="medical-doc-title" className="modal-title">
            🏥 医疗AI核心算法详解
          </h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="关闭医疗算法文档"
          >
            <X size={24} />
          </button>
        </div>

        {/* 文档内容 */}
        <div className="modal-body markdown-content">
          {loading ? (
            <div className="loading-spinner">加载中...</div>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}
