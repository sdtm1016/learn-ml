# Prefix-Tuning（前缀微调）

## 简介
Prefix-Tuning是一种参数高效微调方法，由斯坦福大学于2021年提出。通过在Transformer每一层的Attention中添加可学习的前缀向量（Prefix），仅微调这些前缀参数，而冻结预训练模型的全部权重。Prefix-Tuning特别适合生成任务，如文本摘要、机器翻译等。

## 核心原理

### 前缀向量
- 在Transformer每一层的Key和Value前添加可学习的前缀向量
- 前缀向量参与注意力计算，引导模型关注特定任务
- 仅前缀参数参与训练，模型权重完全冻结

### 注意力修改
```
原始Attention: Attention(Q, K, V)
Prefix Attention: Attention(Q, [K_prefix; K], [V_prefix; V])
```
- K_prefix, V_prefix：可学习的前缀Key和Value
- 前缀向量与原始Key/Value拼接后参与注意力计算

### 层级前缀
```
对于第l层：
Attention_l(Q_l, [P_K^l; K_l], [P_V^l; V_l])
```
- P_K^l：第l层的前缀Key
- P_V^l：第l层的前缀Value
- 每层都有独立的前缀参数

## 数学公式

### 前缀参数
```
P = {P_K^1, P_V^1, P_K^2, P_V^2, ..., P_K^L, P_V^L}
```
- L：Transformer层数
- 每层前缀维度：k × d（k为前缀长度，d为隐藏维度）

### 修改后的注意力
```
h_l = Attention(Q_l, concat(P_K^l, K_l), concat(P_V^l, V_l))
```

### 训练
```
θ_trainable = P    # 仅训练前缀参数
θ_frozen = LM参数  # 冻结预训练模型
L = TaskLoss(LM(input, P), y)
```

### 重参数化
- 训练时：将前缀参数通过MLP变换，提高训练稳定性
```
P_i = MLP(P_i')
```
- 推理时：直接使用变换后的P_i

## 关键超参数

| 参数 | 说明 | 典型值 |
|------|------|--------|
| prefix长度 | 每层前缀token数 | 10-200 |
| 前缀层数 | 插入前缀的层数 | 所有层 |
| MLP维度 | 重参数化MLP隐藏维度 | 800 |

## 医疗应用场景

### 医疗文本生成
- 医疗报告生成
- 病历摘要生成
- 临床笔记自动生成
- 医学问答生成

### 脑卒中专病数据采集
- 脑卒中病历摘要生成
- 结构化报告自动生成
- 临床信息总结
- 多种报告格式适配

### 少样本医疗任务
- 少样本医疗文本分类
- 低资源医学实体识别
- 新医疗任务快速适配

## 优势
- 可训练参数极少（<0.1%）
- 保留预训练模型全部能力
- 适合生成任务
- 层级前缀引导每层注意力
- 多任务可共享基座模型

## 局限性
- 推理时有额外开销（前缀参与计算）
- 前缀长度影响效果和效率
- 训练可能不稳定（需重参数化）
- 对NLU任务效果不如P-Tuning v2
- 前缀参数初始化策略重要

## 实现框架
- PEFT（Hugging Face）：PrefixTuning类
- OpenPrompt
- PyTorch

## 与其他PEFT方法对比

| 方法 | 插入位置 | 适用任务 | 推理开销 | 参数量 |
|------|---------|---------|---------|--------|
| LoRA | 权重矩阵 | 所有 | 无 | <1% |
| P-Tuning v1 | 输入层 | 生成 | 小 | <0.1% |
| P-Tuning v2 | 每层Attention+FFN | NLU | 中 | <0.1% |
| **Prefix-Tuning** | **每层Key/Value** | **生成** | **有** | **<0.1%** |
| Adapter | 每层FFN后 | 所有 | 有 | 1-5% |
