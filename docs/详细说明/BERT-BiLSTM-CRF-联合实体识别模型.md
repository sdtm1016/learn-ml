# BERT-BiLSTM-CRF（联合实体识别模型）

## 简介
BERT-BiLSTM-CRF是一种融合BERT预训练语言模型、双向LSTM和条件随机场的序列标注模型，结合了BERT的深层语义理解、BiLSTM的序列特征提取和CRF的全局标签优化能力，是医疗命名实体识别的主流模型之一。

## 模型架构
- **BERT编码层**：将输入文本转化为上下文感知的词向量表示
- **BiLSTM层**：在BERT输出基础上进一步捕获双向序列特征
- **CRF层**：对标签序列进行全局最优解码，建模标签间依赖关系

```
输入文本 → BERT编码器 → BiLSTM层 → CRF层 → 标签序列
```

## 核心原理

### BERT编码
- 使用预训练BERT获取上下文感知的词向量
- 每个token输出一个融合上下文信息的向量表示
- 输出维度通常为768（BERT-base）或1024（BERT-large）

### BiLSTM特征提取
- 在BERT输出基础上进一步提取序列特征
- 前向LSTM捕获上文信息
- 后向LSTM捕获下文信息
- 双向特征拼接，增强特征表示

### CRF全局解码
- 对标签转移概率建模，捕获标签间依赖
- 使用Viterbi算法解码全局最优标签序列
- 避免非法标签组合（如I-Disease紧跟B-Symptom）

## 数学公式

### BiLSTM前向传播
```
h_t = BiLSTM(BERT_output_t)
h_t = [h_t_forward; h_t_backward]
```

### CRF打分
```
score(x, y) = Σ_i (A_{y_{i-1}, y_i} + P_{i, y_i})
```
- A：标签转移矩阵
- P：发射矩阵（BiLSTM输出）

### CRF解码
```
P(y|x) = exp(score(x,y)) / Σ_y' exp(score(x,y'))
```

## 医疗实体类型

| 实体类型 | BIO标签 | 示例 |
|----------|---------|------|
| 疾病 | B-Disease/I-Disease | 脑卒中、高血压 |
| 症状 | B-Symptom/I-Symptom | 头痛、偏瘫 |
| 药物 | B-Drug/I-Drug | 阿司匹林、氯吡格雷 |
| 检查 | B-Test/I-Test | CT、MRI |
| 手术 | B-Surgery/I-Surgery | 溶栓术 |
| 部位 | B-Body/I-Body | 大脑中动脉 |

## 医疗应用场景

### 电子病历实体识别
- 病史实体抽取
- 诊断信息提取
- 用药记录识别
- 检查项目提取

### 医学文献挖掘
- 论文实体标注
- 研究发现提取
- 疾病-基因关系

### 脑卒中专病数据采集
- 脑卒中相关实体识别
- 危险因素提取
- 治疗方案结构化

## 优势
- BERT提供强大的上下文语义理解
- BiLSTM进一步优化序列特征
- CRF保证标签序列合法性
- 准确率高（92-95%）
- 可处理复杂医疗文本

## 局限性
- 模型参数量大，训练资源需求高
- 推理速度较慢
- BiLSTM层增加训练时间
- 对超参数敏感

## 实现框架
- PyTorch + Hugging Face Transformers
- PaddlePaddle + LAC
- TensorFlow + BERT

## 与其他模型对比

| 模型 | F1分数 | 推理速度 | 参数量 |
|------|--------|----------|--------|
| BiLSTM-CRF | 85-90% | 快 | 中 |
| BERT-CRF | 90-93% | 中 | 大 |
| **BERT-BiLSTM-CRF** | **92-95%** | 慢 | 大 |
| BioBERT-CRF | 93-96% | 中 | 大 |
