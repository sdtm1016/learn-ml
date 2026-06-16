# BERT-Classifier（BERT文本分类器）

## 简介
BERT-Classifier是基于BERT预训练语言模型的文本分类方案，通过在BERT编码输出之上添加分类头实现各类文本分类任务。BERT强大的双向上下文理解能力使其在文本分类任务中表现优异，成为当前最主流的文本分类方案之一。

## 模型架构
- **BERT编码器**：将输入文本转化为上下文感知的向量表示
- **[CLS]向量**：取BERT输出的[CLS] token作为整个文本的表示
- **分类头**：全连接层 + Softmax进行分类

```
输入文本 → BERT编码器 → [CLS]向量 → Dropout → 全连接层 → Softmax → 分类结果
```

## 核心原理

### BERT编码
- 输入文本经过BERT多层Transformer编码
- 每一层学习不同层次的语义特征
- [CLS] token聚合了整个序列的信息

### [CLS]向量
- [CLS]是BERT特殊添加的标记
- 在预训练的NSP任务中学习句子级表示
- 微调时作为文本分类的特征向量

### 分类头设计
- **单层全连接**：H → 隐藏层 → 输出
- **多层全连接**：增加中间隐藏层
- **Dropout**：防止过拟合

## 数学公式

### BERT编码
```
H = BERT(input_ids, attention_mask, token_type_ids)
h_cls = H[0]    # [CLS]位置的输出向量
```

### 分类
```
h = Dropout(h_cls)
logits = W · h + b
P(y|x) = Softmax(logits)
```

### 损失函数
```
L = -Σ log P(y_true|x)
```

## 常用分类头变体

| 变体 | 结构 | 适用场景 |
|------|------|----------|
| 单层分类 | Linear(d, num_classes) | 简单二分类 |
| 多层分类 | Linear(d, h) → ReLU → Linear(h, c) | 多分类 |
| 带池化 | Mean/Max pooling → Linear | 长文本 |

## 医疗应用场景

### 电子病历分类
- 病历类型自动分类（病史/诊断/体格检查/检查报告）
- 疾病严重程度分级
- 科室自动归类
- 急诊/门诊分类

### 医疗文本处理
- 医学文献主题分类
- 临床笔记编码预测（ICD编码分类）
- 医疗问答意图识别
- 药物说明书分类

### 脑卒中专病数据采集
- 病历文本类型识别
- 脑卒中相关文本筛选
- 文档段落功能分类
- 患者信息提取前置分类

### 医疗舆情
- 患者评价情感分析
- 医疗新闻分类
- 健康科普质量评估

## 优势
- 强大的上下文理解能力
- 预训练+微调范式，少量数据即可获得好效果
- 支持多种分类任务（二分类/多分类/多标签）
- 丰富的预训练模型（BERT/RoBERTa/ALBERT）
- 生态完善，工具链成熟

## 局限性
- 模型参数量大（110M-340M）
- 推理速度慢
- 对GPU显存需求高
- 最大序列长度限制（512 tokens）
- 中文场景需要中文BERT

## 实现框架
- Hugging Face Transformers：Trainer API
- PyTorch：BERTForSequenceClassification
- TensorFlow：TFBertForSequenceClassification
- PaddleNLP：中文场景优化

## 与其他模型对比

| 模型 | 准确率 | 速度 | 数据需求 | 参数量 |
|------|--------|------|---------|--------|
| TextCNN | 良好 | 最快 | 大 | 少 |
| BiLSTM-Attention | 优秀 | 中 | 大 | 中 |
| **BERT-Classifier** | **最优** | 慢 | **少** | **大** |
| Hierarchical-BERT | 最优 | 最慢 | 少 | 最大 |
| GPT-Classifier | 优秀 | 慢 | 少 | 大 |
