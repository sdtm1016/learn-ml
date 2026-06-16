# SentencePiece（句子分词）

## 简介
SentencePiece是由Google开发的一种语言无关的子词分词和反分词工具。SentencePiece将分词视为一个子词分割问题，直接在原始文本上训练，不依赖预分词器，支持BPE和Unigram两种子词算法，是T5、XLNet、ALBERT等模型的标准分词工具。

## 核心原理

### 无预分词处理
- 传统分词需要先用空格/标点分词
- SentencePiece直接在原始文本（含空格）上操作
- 将空格视为特殊字符（Unicode字符▁）处理
- 实现真正的端到端分词

### 支持的子词算法

#### BPE模式
```
训练：迭代合并最高频字符对
编码：贪心最长匹配
```

#### Unigram模式
```
训练：基于Unigram语言模型的损失最小化
编码：Viterbi算法选择最优分割
```

### Unigram模型
- 假设子词序列由Unigram语言模型生成
- 每个子词有独立的概率
- 训练时通过EM算法迭代优化词表
- 每轮迭代移除损失最小的子词

## 数学公式

### Unigram语言模型
```
P(x) = Σ_{s ∈ S(x)} Π_{t ∈ s} P(t)
```
- S(x)：词x的所有可能分词方式
- P(t)：子词t的概率

### Viterbi解码
```
encode(word) = argmax_{s ∈ S(word)} Π_{t ∈ s} P(t)
```

### EM训练
```
E步：使用当前模型计算所有子词的期望计数
M步：根据期望计数调整子词概率
裁剪：移除使损失最小的子词（保留vocab_size个）
```

### BPE训练
```
repeat:
    pair = argmax count(pair)
    merge(pair)
until vocab_size reached
```

## 关键参数

| 参数 | 说明 | 典型值 |
|------|------|--------|
| model_type | 子词算法 | bpe/unigram |
| vocab_size | 词表大小 | 32000 |
| input_sentence_size | 训练句子数 | 1000000 |
| character_coverage | 字符覆盖率 | 0.9995 |
| model_prefix | 模型文件前缀 | model |

## 医疗应用场景

### 多语言医疗文本分词
- 多语言医学文献分词
- 中文电子病历分词
- 医学混合语言文本处理

### 模型分词
- T5、XLNet等模型的标准分词
- 医疗大模型分词预处理
- 多语言医疗NLP分词

### 脑卒中专病数据采集
- 脑卒中多语言文本分词
- 中英文混合病历处理
- 医疗大模型输入预处理

## 优势
- 语言无关，支持任意语言
- 无需预分词器
- 直接在原始文本上训练
- 支持BPE和Unigram两种算法
- 编码/解码完全可逆
- 支持中文等非空格分隔语言
- 工业级实现，速度快

## 局限性
- 训练需要大量文本
- 词表固定后不易动态扩展
- 空格处理可能影响某些任务
- 对特定领域的术语可能不够优化

## 实现框架
- sentencepiece（Google官方Python/C++库）
- Hugging Face tokenizers：集成SentencePiece
- PaddleNLP：中文场景优化

## 与其他分词方法对比

| 方法 | 语言无关 | 预分词 | 可逆性 | 使用模型 |
|------|---------|--------|--------|---------|
| BPE | 否 | 需要 | 部分 | GPT |
| WordPiece | 否 | 需要 | 部分 | BERT |
| **SentencePiece** | **是** | **不需要** | **完全** | **T5/XLNet** |
| Jieba | 否 | 不需要 | 是 | 中文NLP |
| Unigram | 否 | 不需要 | 完全 | T5 |
