import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Search, Filter, Layers, ChevronDown } from 'lucide-react';
import { algorithms, categoryLabels, type AlgorithmItem, type AlgorithmCategory } from '../data/algorithms';
import { algorithmRelations, type RelationType } from '../data/algorithmRelations';
import { computeClusterLayout } from '../utils/clusterLayout';

interface AlgorithmGraphProps {
  onSelectAlgorithm: (algorithm: AlgorithmItem) => void;
  isCompleted: (name: string) => boolean;
}

// 中文注释：关系类型的颜色和标签
const relationStyles: Record<RelationType, { color: string; label: string }> = {
  derives_from: { color: '#3b82f6', label: '派生自' },
  similar_to: { color: '#8b5cf6', label: '相似于' },
  combines: { color: '#ec4899', label: '组合' },
  improved_by: { color: '#10b981', label: '改进版' },
  used_in: { color: '#f59e0b', label: '用于' },
};

// 中文注释：医疗领域最常用的核心算法列表（精简版）
const medicalAlgorithms = new Set([
  // 经典机器学习 - 疾病风险预测
  '逻辑回归',
  '随机森林',
  'XGBoost',

  // 深度学习 - 医学影像
  'CNN',
  'U-Net',
  'Transformer',

  // 生存分析 - 预后研究
  'Cox比例风险模型',

  // NLP - 电子病历
  'BERT',

  // 聚类 - 患者分层
  'K-Means',
]);

// 中文注释：算法分类的颜色（key 必须与 algorithms.ts 的 AlgorithmCategory 取值一一对应）
// 按 categories[0]（主分类）上色，确保同一主分类的节点视觉一致、便于在图中识别家族。
const categoryColors: Record<string, string> = {
  supervised: '#3b82f6',        // 监督学习 - 蓝
  unsupervised: '#8b5cf6',      // 无监督 - 紫
  ensemble: '#06b6d4',          // 集成学习 - 青
  dimensionality: '#ec4899',    // 降维 - 粉
  anomaly: '#f43f5e',           // 异常检测 - 玫红
  'time-series': '#f59e0b',     // 时间序列 - 琥珀
  preprocessing: '#64748b',     // 数据预处理 - 灰
  evaluation: '#10b981',        // 评估解释 - 绿
  survival: '#0ea5e9',          // 生存分析 - 天蓝
  causal: '#a855f7',            // 因果推断 - 紫罗兰
  recommendation: '#14b8a6',    // 推荐系统 - 蓝绿
  reinforcement: '#22c55e',     // 强化学习 - 亮绿
  'deep-learning': '#ef4444',   // 深度学习 - 红
  nlp: '#d946ef',               // NLP - 品红
  vision: '#f97316',            // 视觉 - 橙
  graph: '#6366f1',             // 图学习 - 靛蓝
};

// 中文注释：算法主分类标签（用于侧栏孤立算法分组标题）
const categoryLabelMap: Record<string, string> = Object.fromEntries(
  categoryLabels.map((c) => [c.id, c.label])
);

// 中文注释：算法关系图组件
export function AlgorithmGraph({ onSelectAlgorithm, isCompleted }: AlgorithmGraphProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AlgorithmCategory>('all');
  const [showIsolated, setShowIsolated] = useState(false); // 侧栏孤立算法折叠状态

  // 中文注释：收集参与关系的算法名集合，用于区分"图谱节点"和"孤立算法"
  const relatedNames = useMemo(() => {
    const set = new Set<string>();
    for (const r of algorithmRelations) {
      set.add(r.source);
      set.add(r.target);
    }
    return set;
  }, []);

  // 中文注释：参与关系的算法（作为图谱节点）
  const relatedAlgorithms = useMemo(
    () => algorithms.filter((a) => relatedNames.has(a.name)),
    [relatedNames]
  );

  // 中文注释：孤立算法（无任何关系，收入侧栏列表，不进入主图）
  const isolatedAlgorithms = useMemo(
    () => algorithms.filter((a) => !relatedNames.has(a.name)),
    [relatedNames]
  );

  // 中文注释：家族聚类布局位置（仅对参与关系的算法计算）
  const layoutPositions = useMemo(() => computeClusterLayout(relatedAlgorithms), [relatedAlgorithms]);

  // 中文注释：将参与关系的算法转换为 React Flow 节点
  const initialNodes: Node[] = useMemo(() => {
    return relatedAlgorithms.map((algo) => {
      const pos = layoutPositions.get(algo.name) || { x: 0, y: 0 };
      const primaryCategory = algo.categories[0] || 'supervised';
      const isMedical = medicalAlgorithms.has(algo.name);

      return {
        id: algo.name,
        type: 'default',
        position: pos,
        data: {
          label: algo.name,
          algorithm: algo,
          isCompleted: isCompleted(algo.name),
          isMedical,
        },
        style: {
          background: isMedical
            ? `linear-gradient(135deg, ${categoryColors[primaryCategory] || '#64748b'} 0%, ${categoryColors[primaryCategory] || '#64748b'} 70%, #f59e0b 70%, #f59e0b 100%)`
            : categoryColors[primaryCategory] || '#64748b',
          color: '#fff',
          border: isCompleted(algo.name) ? '3px solid #10b981' : '1px solid rgba(255,255,255,0.2)',
          borderRadius: '8px',
          padding: '10px 16px',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: isMedical ? '0 0 12px rgba(245, 158, 11, 0.4)' : 'none',
        },
      };
    });
  }, [relatedAlgorithms, layoutPositions, isCompleted]);

  // 中文注释：将关系数据转换为 React Flow 边
  const initialEdges: Edge[] = useMemo(() => {
    return algorithmRelations.map((relation, index) => ({
      id: `edge-${index}`,
      source: relation.source,
      target: relation.target,
      type: 'smoothstep',
      animated: relation.type === 'improved_by',
      style: {
        stroke: relationStyles[relation.type].color,
        strokeWidth: (relation.strength || 0.5) * 3,
        opacity: 0.6,
      },
      // 默认隐藏边的文字标签，避免几十条标签叠成一团；hover 时由高亮逻辑处理
      label: relationStyles[relation.type].label,
      labelStyle: {
        fill: relationStyles[relation.type].color,
        fontSize: 10,
        fontWeight: 600,
      },
      labelShowBg: false,
    }));
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // 中文注释：节点点击处理
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const algo = algorithms.find((a) => a.name === node.id);
      if (algo) {
        onSelectAlgorithm(algo);
      }
    },
    [onSelectAlgorithm]
  );

  // 中文注释：搜索高亮——同时作用于主图节点和侧栏列表（通过 filteredIsolated 过滤）
  useEffect(() => {
    if (!searchTerm) {
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          style: {
            ...node.style,
            opacity: 1,
            boxShadow: 'none',
          },
        }))
      );
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    setNodes((nds) =>
      nds.map((node) => {
        const matches = node.id.toLowerCase().includes(searchLower);
        return {
          ...node,
          style: {
            ...node.style,
            opacity: matches ? 1 : 0.3,
            boxShadow: matches ? '0 0 20px rgba(54, 241, 205, 0.6)' : 'none',
          },
        };
      })
    );
  }, [searchTerm, setNodes]);

  // 中文注释：分类筛选——仅作用于主图节点（隐藏不属于该分类的节点及其无关边）
  useEffect(() => {
    if (selectedCategory === 'all') {
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          hidden: false,
        }))
      );
      return;
    }

    setNodes((nds) =>
      nds.map((node) => {
        const algo = algorithms.find((a) => a.name === node.id);
        return {
          ...node,
          hidden: !algo?.categories.includes(selectedCategory as Exclude<AlgorithmCategory, 'all'>),
        };
      })
    );
  }, [selectedCategory, setNodes]);

  // 中文注释：侧栏孤立算法——按搜索词过滤
  const filteredIsolated = useMemo(() => {
    if (!searchTerm) return isolatedAlgorithms;
    const lower = searchTerm.toLowerCase();
    return isolatedAlgorithms.filter((a) => a.name.toLowerCase().includes(lower));
  }, [isolatedAlgorithms, searchTerm]);

  // 中文注释：侧栏孤立算法——按分类分组，便于浏览
  const isolatedByCategory = useMemo(() => {
    const groups = new Map<string, AlgorithmItem[]>();
    for (const algo of filteredIsolated) {
      const cat = algo.categories[0] || 'supervised';
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat)!.push(algo);
    }
    return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredIsolated]);

  // 中文注释：侧栏点击——直接跳详情，和主图节点行为一致
  const handleIsolatedClick = useCallback(
    (algo: AlgorithmItem) => {
      onSelectAlgorithm(algo);
    },
    [onSelectAlgorithm]
  );

  return (
    <div className="algorithm-graph-container">
      {/* 中文注释：React Flow 画布 */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        connectionMode={ConnectionMode.Loose}
        fitView
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'smoothstep',
        }}
      >
        {/* 中文注释：控制面板 */}
        <Panel position="top-left" className="graph-controls">
          <div className="graph-control-group">
            <div className="graph-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="搜索算法..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="graph-filter">
              <Filter size={18} />
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value as AlgorithmCategory)}>
                {categoryLabels.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="graph-legend">
              <span className="legend-title">关系类型：</span>
              {Object.entries(relationStyles).map(([type, style]) => (
                <span key={type} className="legend-item">
                  <span className="legend-dot" style={{ background: style.color }} />
                  {style.label}
                </span>
              ))}
            </div>

            <div className="graph-legend">
              <span className="legend-title">标注：</span>
              <span className="legend-item">
                <span
                  className="legend-badge"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #3b82f6 70%, #f59e0b 70%, #f59e0b 100%)',
                    width: '32px',
                    height: '16px',
                    borderRadius: '4px',
                    display: 'inline-block'
                  }}
                />
                医疗常用
              </span>
            </div>
          </div>
        </Panel>

        <Background color="var(--line)" gap={16} />
        <Controls />
        <MiniMap
          nodeColor={(node) => (node.style?.background as string) || '#64748b'}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>

      {/* 中文注释：孤立算法侧栏——38个无关系的算法收纳在此，可折叠，点击查看详情 */}
      <aside className={`isolated-sidebar ${showIsolated ? 'open' : ''}`}>
        <button
          className="isolated-sidebar-toggle"
          onClick={() => setShowIsolated((v) => !v)}
          aria-label={showIsolated ? '收起孤立算法' : '展开孤立算法'}
        >
          <Layers size={16} />
          <span>未关联算法</span>
          <span className="isolated-count">{isolatedAlgorithms.length}</span>
          <ChevronDown size={16} className={`isolated-chevron ${showIsolated ? 'rotated' : ''}`} />
        </button>

        {showIsolated && (
          <div className="isolated-list">
            <p className="isolated-hint">这些算法暂未与其他算法建立关系，点击查看详情。</p>
            {isolatedByCategory.length === 0 && (
              <p className="isolated-empty">没有匹配的算法</p>
            )}
            {isolatedByCategory.map(([cat, items]) => (
              <div key={cat} className="isolated-group">
                <div className="isolated-group-title">
                  <span className="legend-dot" style={{ background: categoryColors[cat] || '#64748b' }} />
                  {categoryLabelMap[cat] || cat}
                </div>
                {items.map((algo) => (
                  <button
                    key={algo.name}
                    className={`isolated-item ${isCompleted(algo.name) ? 'completed' : ''} ${medicalAlgorithms.has(algo.name) ? 'medical' : ''}`}
                    onClick={() => handleIsolatedClick(algo)}
                    style={medicalAlgorithms.has(algo.name) ? {
                      background: `linear-gradient(135deg, ${categoryColors[cat] || '#64748b'} 0%, ${categoryColors[cat] || '#64748b'} 85%, #f59e0b 85%, #f59e0b 100%)`,
                      boxShadow: '0 0 8px rgba(245, 158, 11, 0.3)'
                    } : {}}
                  >
                    <span className="isolated-item-name">{algo.name}</span>
                    {isCompleted(algo.name) && <span className="isolated-item-check">✓</span>}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}
