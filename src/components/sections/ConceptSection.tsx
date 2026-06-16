import { BrainCircuit, Cpu, Layers3 } from 'lucide-react';

// 中文注释：概念区组件，展示 ML/DL/NN 的关系和核心概念卡片
export function ConceptSection() {
  return (
    <section className="section-shell concept-band" aria-labelledby="concept-title">
      <div>
        <p className="eyebrow">先把边界讲清楚</p>
        <h2 id="concept-title">机器学习、深度学习、神经网络是什么关系？</h2>
      </div>
      <div className="concept-cards">
        <article>
          <Cpu />
          <h3>机器学习</h3>
          <p>让机器从数据中学习规律，不再完全依赖人工硬编码规则。传统算法与深度学习都属于它。</p>
        </article>
        <article>
          <Layers3 />
          <h3>深度学习</h3>
          <p>机器学习的一个分支，使用多层神经网络自动提取特征。图像、语音、NLP 任务中表现尤其突出。</p>
        </article>
        <article>
          <BrainCircuit />
          <h3>神经网络</h3>
          <p>
            深度学习的核心架构：多层连接、前向传播、反向调整权重。单层神经网络不算"深"，多层才称为深度学习。
          </p>
        </article>
      </div>
    </section>
  );
}
