# Cross-Encoder（交叉编码器）

## 简介
Cross-Encoder（交叉编码器）是一种将两个文本序列拼接后一起输入编码器进行深度交互的模型架构。与Bi-Encoder分别编码两个文本不同，Cross-Encoder通过Transformer的自注意力机制让两个文本的每个token之间进行交互，从而获得更精确的语义匹配分数。

## 模型架构
- **输入拼接**：将两个文本通过[SEP]拼接为一个输入
- **Transformer编码器**：深层token级别交互
- **分类头**：输出匹配分数

```
文本A [SEP] 文本B [SEP] → Transformer编码器 → [CLS]表示 → 分类头 → 匹配分数
```

## 核心原理

### 深层交叉注意力
- 两个文本的所有token通过自注意力层相互交互
- 每个token可以"看到"另一个文本的所有token
- 捕获细粒度的语义关联

### 全序列交互
- Self-Attention在拼接后的完整序列上操作
- Query来自文本A，Key/Value来自文本B（及A自身）
- 多层交互逐步深化语义理解

### 输入格式
```
[CLS] 文本A的token [SEP] 文本B的token [SEP]
```

## 数学公式

### 编码
```
H = Transformer(input_ids)
h_cls = H[0]
```

### 匹配分数
```
score = W · h_cls + b
```

### 对比损失
```
L = -log σ(score(A, B_positive)) - log σ(-score(A, B_negative))
```

## 与Bi-Encoder对比

| 特征 | Cross-Encoder | Bi-Encoder |
|------|--------------|------------|
| 编码方式 | 拼接后统一编码 | 分别独立编码 |
| 交互方式 | 全token交叉注意力 | 仅向量级相似度 |
| 速度 | 慢（O(N×M)对计算） | 快（预计算向量） |
| 精度 | 高 | 中 |
| 适用场景 | 精细排序/重排 | 初筛/召回 |
| 索引支持 | 不支持 | 支持（FAISS） |

## 医疗应用场景

### 实体链接
- 医学实体提及与候选实体的精细匹配
- 疾病名称与ICD-10编码的精确映射
- 药物名称与标准药物库匹配

### 语义匹配
- 病历文本相似度计算
- 临床指南与病例匹配
- 医学问答问题-答案匹配

### 脑卒中专病数据采集
- 脑卒中术语精确标准化
- 实体候选精确排序
- 医学概念消歧
- 术语-标准编码精确匹配

### 重排序
- 对Bi-Encoder召回的候选进行精排
- 搜索结果重排
- 知识库匹配重排

## 典型使用流程

```
第一步（召回）：Bi-Encoder快速检索Top-100候选
第二步（精排）：Cross-Encoder对Top-100进行精细排序
第三步（输出）：返回Top-K高精度结果
```

## 优势
- 深层语义交互，匹配精度高
- 捕获细粒度的语义关联
- 适合重排序场景
- 预训练模型直接微调

## 局限性
- 无法预计算和索引（每对需要重新计算）
- 计算复杂度高
- 不适合大规模初筛
- 推理延迟大
- 长文本拼接可能超过最大长度限制

## 实现框架
- Hugging Face Transformers：CrossEncoder
- sentence-transformers：CrossEncoder类
- PyTorch
- FlagEmbedding

## 常用模型

| 模型 | 基座 | 语言 | 适用场景 |
|------|------|------|---------|
| cross-encoder/ms-marco | BERT | 英文 | 搜索重排 |
| cross-encoder/mmarco | XLM-RoBERTa | 多语言 | 多语言搜索 |
| bge-reranker | BGE | 中英文 | 通用重排 |
| BCEmbedding | BCE | 中英文 | 中文重排 |
