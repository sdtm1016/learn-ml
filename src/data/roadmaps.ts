/**
 * 学习路径数据定义
 *
 * 支持多条学习路径，满足不同学习目标和背景的用户需求
 */

export interface RoadmapStep {
  step: string;
  title: string;
  description: string;
  algorithmName: string;
  category?: string;
}

export interface RoadmapPath {
  id: string;
  name: string;
  description: string;
  difficulty: '入门' | '进阶' | '专题';
  icon: string;
  steps: RoadmapStep[];
}

// 中文注释：基础学习路径 - 适合零基础用户
const basicPath: RoadmapPath = {
  id: 'basic',
  name: '基础入门路径',
  description: '从零开始，系统学习机器学习核心概念和经典算法',
  difficulty: '入门',
  icon: '🎓',
  steps: [
    {
      step: '01',
      title: '建立概念地图',
      description: '理解 ML / DL / NN 的层级关系，先把逻辑回归的直觉建立起来。',
      algorithmName: '逻辑回归',
      category: 'supervised'
    },
    {
      step: '02',
      title: '认识数据与特征',
      description: '学习数据、类别、时间、文本特征，用主成分分析理解特征压缩和降维的直觉。',
      algorithmName: '主成分分析',
      category: 'unsupervised'
    },
    {
      step: '03',
      title: '学原理达选型',
      description: '从回归、分类、聚类到集成学习，建立"任务匹配算法"的模型选择直觉。',
      algorithmName: '随机森林',
      category: 'supervised'
    },
    {
      step: '04',
      title: '学会评估模型',
      description: '用准确率、精确率、召回率、F1、AUC、RMSE 等指标判断模型表现。',
      algorithmName: '梯度提升树',
      category: 'supervised'
    },
    {
      step: '05',
      title: '理解正则化',
      description: '掌握 L1/L2 正则化，理解如何防止过拟合，提升模型泛化能力。',
      algorithmName: '岭回归',
      category: 'supervised'
    },
    {
      step: '06',
      title: '神经网络入门',
      description: '理解前向传播、反向传播、激活函数，搭建第一个多层感知机。',
      algorithmName: '多层感知机',
      category: 'deep-learning'
    },
    {
      step: '07',
      title: '深度学习基础',
      description: '学习卷积神经网络 CNN，理解图像特征提取的原理。',
      algorithmName: '卷积神经网络',
      category: 'deep-learning'
    },
    {
      step: '08',
      title: '进入深度学习',
      description: '理解循环神经网络和注意力机制，掌握序列建模能力，最终接触 Transformer 等前沿架构。',
      algorithmName: 'Transformer',
      category: 'deep-learning'
    }
  ]
};

// 中文注释：医疗 AI 专题路径
const medicalAIPath: RoadmapPath = {
  id: 'medical-ai',
  name: '医疗 AI 专题',
  description: '专注医疗健康领域，从生存分析到医学影像，构建医疗 AI 完整技能树',
  difficulty: '专题',
  icon: '🏥',
  steps: [
    {
      step: '01',
      title: '医疗数据基础',
      description: '理解医疗数据特点：结构化病历、影像数据、时序生理信号等。',
      algorithmName: '逻辑回归',
      category: 'supervised'
    },
    {
      step: '02',
      title: '生存分析入门',
      description: '学习 Kaplan-Meier、Cox 比例风险模型，处理删失数据。',
      algorithmName: 'K近邻',
      category: 'supervised'
    },
    {
      step: '03',
      title: '疾病预测建模',
      description: '使用决策树、随机森林进行疾病风险预测和分层。',
      algorithmName: '随机森林',
      category: 'supervised'
    },
    {
      step: '04',
      title: '医学影像分析',
      description: '应用 CNN 进行 X 光、CT、MRI 影像分类和病灶检测。',
      algorithmName: '卷积神经网络',
      category: 'deep-learning'
    },
    {
      step: '05',
      title: '电子病历挖掘',
      description: '使用 NLP 技术从非结构化病历中提取关键信息。',
      algorithmName: 'BERT',
      category: 'deep-learning'
    },
    {
      step: '06',
      title: '可解释性与伦理',
      description: '在医疗场景中，模型可解释性至关重要，学习 LIME、SHAP 等方法。',
      algorithmName: 'SHAP',
      category: 'interpretability'
    }
  ]
};

// 中文注释：NLP 专题路径
const nlpPath: RoadmapPath = {
  id: 'nlp',
  name: 'NLP 自然语言处理',
  description: '从词向量到大语言模型，系统掌握 NLP 核心技术',
  difficulty: '专题',
  icon: '📝',
  steps: [
    {
      step: '01',
      title: '文本表示基础',
      description: '学习 TF-IDF、词袋模型，理解文本如何转换为数值特征。',
      algorithmName: '朴素贝叶斯',
      category: 'supervised'
    },
    {
      step: '02',
      title: '词向量与语义',
      description: '掌握 Word2Vec、GloVe，理解词语的分布式表示。',
      algorithmName: 'Word2Vec',
      category: 'deep-learning'
    },
    {
      step: '03',
      title: '序列建模',
      description: '使用 RNN、LSTM、GRU 处理文本序列任务。',
      algorithmName: '循环神经网络',
      category: 'deep-learning'
    },
    {
      step: '04',
      title: '注意力机制',
      description: '理解 Attention 的核心思想，为 Transformer 打基础。',
      algorithmName: 'Transformer',
      category: 'deep-learning'
    },
    {
      step: '05',
      title: '预训练语言模型',
      description: '学习 BERT、GPT 等预训练模型，掌握微调技巧。',
      algorithmName: 'BERT',
      category: 'deep-learning'
    },
    {
      step: '06',
      title: '信息抽取与问答',
      description: '应用 NLP 技术进行命名实体识别、关系抽取、问答系统构建。',
      algorithmName: 'GPT',
      category: 'deep-learning'
    }
  ]
};

// 中文注释：计算机视觉专题路径
const cvPath: RoadmapPath = {
  id: 'computer-vision',
  name: '计算机视觉 CV',
  description: '从图像分类到目标检测，构建计算机视觉完整能力',
  difficulty: '专题',
  icon: '👁️',
  steps: [
    {
      step: '01',
      title: '图像分类基础',
      description: '使用传统机器学习方法进行简单图像分类。',
      algorithmName: 'K近邻',
      category: 'supervised'
    },
    {
      step: '02',
      title: '卷积神经网络',
      description: '理解卷积、池化、全连接层，搭建第一个 CNN。',
      algorithmName: '卷积神经网络',
      category: 'deep-learning'
    },
    {
      step: '03',
      title: '经典网络架构',
      description: '学习 VGG、ResNet、Inception 等经典架构设计思想。',
      algorithmName: 'ResNet',
      category: 'deep-learning'
    },
    {
      step: '04',
      title: '目标检测',
      description: '掌握 R-CNN、YOLO、SSD 等目标检测算法。',
      algorithmName: 'YOLO',
      category: 'deep-learning'
    },
    {
      step: '05',
      title: '图像分割',
      description: '学习 FCN、U-Net、Mask R-CNN 等语义分割和实例分割方法。',
      algorithmName: 'U-Net',
      category: 'deep-learning'
    },
    {
      step: '06',
      title: 'Vision Transformer',
      description: 'Transformer 在视觉领域的应用，理解 ViT、DETR 等模型。',
      algorithmName: 'Transformer',
      category: 'deep-learning'
    }
  ]
};

// 中文注释：时序分析专题路径
const timeSeriesPath: RoadmapPath = {
  id: 'time-series',
  name: '时序数据分析',
  description: '从经典统计方法到深度学习，掌握时序预测核心技术',
  difficulty: '进阶',
  icon: '📈',
  steps: [
    {
      step: '01',
      title: '时序数据基础',
      description: '理解平稳性、自相关、季节性等时序数据特性。',
      algorithmName: '线性回归',
      category: 'supervised'
    },
    {
      step: '02',
      title: '经典统计模型',
      description: '学习 AR、MA、ARIMA 等经典时序预测方法。',
      algorithmName: 'ARIMA',
      category: 'time-series'
    },
    {
      step: '03',
      title: '机器学习方法',
      description: '使用随机森林、XGBoost 等方法进行时序预测。',
      algorithmName: 'XGBoost',
      category: 'supervised'
    },
    {
      step: '04',
      title: '循环神经网络',
      description: '使用 LSTM、GRU 处理长序列依赖问题。',
      algorithmName: '循环神经网络',
      category: 'deep-learning'
    },
    {
      step: '05',
      title: 'Transformer 时序建模',
      description: '应用 Transformer 进行长序列时序预测。',
      algorithmName: 'Transformer',
      category: 'deep-learning'
    },
    {
      step: '06',
      title: '异常检测',
      description: '时序数据的异常检测和预警系统构建。',
      algorithmName: '孤立森林',
      category: 'unsupervised'
    }
  ]
};

// 中文注释：导出所有路径
export const roadmapPaths: RoadmapPath[] = [
  basicPath,
  medicalAIPath,
  nlpPath,
  cvPath,
  timeSeriesPath
];

// 中文注释：根据 ID 获取路径
export function getRoadmapById(id: string): RoadmapPath | undefined {
  return roadmapPaths.find(path => path.id === id);
}

// 中文注释：获取默认路径（基础路径）
export function getDefaultRoadmap(): RoadmapPath {
  return basicPath;
}
