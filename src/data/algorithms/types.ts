// 中文注释：算法类型定义与分类标签
// 本文件是 algorithms 数据模块的类型契约来源，被所有数据文件、narrative、index 共用。

export type AlgorithmCategory =
  | 'all'
  | 'supervised'
  | 'unsupervised'
  | 'ensemble'
  | 'dimensionality'
  | 'anomaly'
  | 'time-series'
  | 'preprocessing'
  | 'evaluation'
  | 'survival'
  | 'causal'
  | 'recommendation'
  | 'reinforcement'
  | 'deep-learning'
  | 'nlp'
  | 'vision'
  | 'graph';

export type AlgorithmItem = {
  name: string;
  label: string;
  family: string;
  difficulty: '入门' | '进阶' | '高级';
  categories: Exclude<AlgorithmCategory, 'all'>[];
  description: string;
  intuition: string;
  whenToUse: string[];
  strengths: string[];
  limitations: string[];
  metrics: string;
  plainExplanation: string;
  medicalExample: string;
  fallbackExample: string;
  whyItFits: string;
  relatedDocumentId?: string;
  codeExamples?: {
    colab?: string;
    kaggle?: string;
    github?: string;
  };
};

// 中文注释：叙事字段——由 buildNarrative 自动生成，不在数据文件中手填
export type NarrativeFields = Pick<
  AlgorithmItem,
  'plainExplanation' | 'medicalExample' | 'fallbackExample' | 'whyItFits'
>;

// 中文注释：基础条目——数据文件填写的事实信息(不含叙事字段)
export type BaseAlgorithmItem = Omit<AlgorithmItem, keyof NarrativeFields>;

export const categoryLabels: Array<{ id: AlgorithmCategory; label: string }> = [
  { id: 'all', label: '全部' },
  { id: 'supervised', label: '监督学习' },
  { id: 'unsupervised', label: '无监督' },
  { id: 'ensemble', label: '集成学习' },
  { id: 'dimensionality', label: '降维' },
  { id: 'anomaly', label: '异常检测' },
  { id: 'time-series', label: '时间序列' },
  { id: 'preprocessing', label: '数据预处理' },
  { id: 'evaluation', label: '评估解释' },
  { id: 'survival', label: '生存分析' },
  { id: 'causal', label: '因果推断' },
  { id: 'recommendation', label: '推荐系统' },
  { id: 'reinforcement', label: '强化学习' },
  { id: 'deep-learning', label: '深度学习' },
  { id: 'nlp', label: 'NLP' },
  { id: 'vision', label: '视觉' },
  { id: 'graph', label: '图学习' },
];
