# P-Tuning（提示微调）

## 简介
P-Tuning（Prompt Tuning）是一种参数高效微调方法，由清华大学提出。通过在输入序列中添加可学习的连续向量（虚拟Prompt/软提示），仅微调这些Prompt参数，而冻结预训练模型的全部权重，实现高效的任务适配。

## 核心原理

### 软提示（Soft Prompt）
- 传统方法使用人工设计的离散文本作为Prompt
- P-Tuning将Prompt参数化为连续向量
- 这些向量通过反向传播自动学习最优Prompt

### 虚拟Token插入
```
[Virtual Token 1] [Virtual Token 2] ... [Virtual Token k] [输入文本]
```
- 在输入序列前插入k个可学习的虚拟token
- 这些token不是真实词汇，是连续向量空间中的点
- 仅这些虚拟token的Embedding参与训练

### 训练过程
- 冻结预训练模型的所有参数
- 仅更新虚拟token的Embedding
- 使用少量标注数据即可获得好效果

## 数学公式

### 虚拟Prompt
```
P = [p_1, p_2, ..., p_k]    # k个可学习的虚拟token
```

### 前向传播
```
h = LM([P; x])    # P为虚拟Prompt，x为输入文本
y = Head(h)
```

### 训练
```
L = TaskLoss(y, y_true)
θ_trainable = {p_1, p_2, ..., p_k}    # 仅训练虚拟Prompt
θ_frozen = LM参数（冻结）
```

## 版本演进

| 版本 | 特点 | 适用场景 |
|------|------|---------|
| P-Tuning v1 | 仅虚拟Prompt | 生成任务 |
| P-Tuning v2 | 虚拟Prompt + 前缀 | NLU任务 |
| P-Tuning v2 | 深层Prompt | 所有层插入 |

### P-Tuning v2改进
- 在Transformer每一层都插入虚拟Prompt
- 不仅在输入层，还在每层Attention和FFN前添加
- 支持NLU、序列标注、分类等任务

## 医疗应用场景

### 少样本医疗NLP
- 少量标注数据的医疗实体识别
- 低资源医疗文本分类
- 少样本医疗问答

### 脑卒中专病数据采集
- 脑卒中少样本实体抽取
- 低资源病历分类
- 新任务快速适配

### 医疗模型快速部署
- 多个医疗任务共享一个基座模型
- 切换Prompt实现任务切换
- 节省存储和部署成本

## 优势
- 可训练参数极少（<0.1%）
- 显存占用极低
- 保留预训练模型原有能力
- 支持少样本学习
- 多任务Prompt可快速切换

## 局限性
- Prompt长度需要调优
- 对复杂任务效果不如全参数微调
- Prompt初始化策略影响效果
- 深层Prompt（v2）增加显存占用
- 可解释性差

## 实现框架
- OpenPrompt：Prompt学习框架
- PEFT（Hugging Face）
- CPrompt（清华P-Tuning实现）
- PyTorch

## 与其他PEFT方法对比

| 方法 | 可训练参数 | 适用任务 | 推理开销 | 效果 |
|------|-----------|---------|---------|------|
| Full Fine-tuning | 100% | 所有 | 无 | 最好 |
| LoRA | <1% | 所有 | 无 | 好 |
| **P-Tuning v1** | **<0.1%** | **生成** | 小 | 中 |
| **P-Tuning v2** | **<0.1%** | **NLU** | 中 | 好 |
| Prefix Tuning | <0.1% | 所有 | 有 | 中 |
| Adapter | 1-5% | 所有 | 有 | 好 |
