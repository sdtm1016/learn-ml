# BiLSTM-Attention（双向LSTM注意力模型）

## 简介
BiLSTM-Attention是一种结合双向LSTM和注意力机制的文本分类/序列编码模型。BiLSTM捕获双向上下文信息，注意力机制自动聚焦文本中重要的部分，适用于中长文本分类、序列标注等任务。

## 模型架构
- **Embedding层**：将输入文本转换为词向量
- **BiLSTM层**：双向LSTM提取上下文特征
- **Attention层**：计算注意力权重，加权聚合特征
- **输出层**：全连接分类输出

```
输入文本 → Embedding → BiLSTM → Attention → 全连接 → Softmax
```

## 核心原理

### BiLSTM（双向LSTM）
- 前向LSTM：从左到右读取序列，捕获上文信息
- 后向LSTM：从右到左读取序列，捕获下文信息
- 双向隐藏状态拼接：h_t = [h_t_forward; h_t_backward]

### Attention机制
- 对BiLSTM输出的每个时间步特征计算注意力权重
- 权重反映该位置对最终分类的重要程度
- 加权求和得到整个序列的表示

### 注意力计算
```
u_t = tanh(W_a · h_t + b_a)        # 注意力隐藏层
α_t = softmax(u_t^T · u_w)          # 注意力权重
s = Σ_t α_t · h_t                   # 加权求和
```
- u_w：可学习的上下文向量
- α_t：第t个位置的注意力权重
- s：最终的句子表示

## 数学公式

### BiLSTM前向
```
h_t_forward = LSTM_forward(x_t, h_{t-1}_forward)
h_t_backward = LSTM_backward(x_t, h_{t+1}_backward)
h_t = [h_t_forward; h_t_backward]
```

### Attention计算
```
M = tanh(W · H)          # H为BiLSTM所有输出拼接
α = softmax(w^T · M)     # 注意力权重
r = H · α^T              # 加权求和
```

### 输出
```
h* = tanh(r)
y = Softmax(W_o · h* + b_o)
```

## 医疗应用场景

### 电子病历分类
- 病历类型自动分类（病史/诊断/体格检查/检查报告）
- 科室分类
- 疾病严重程度分级

### 医疗文本处理
- 关键信息提取（注意力权重可视化）
- 医学文献主题分类
- 临床笔记编码预测

### 脑卒中专病数据采集
- 病历段落类型识别
- 脑卒中相关文本自动筛选
- 关键信息定位（注意力高亮）

### 医疗问答
- 问题意图识别
- 答案相关性判断
- 对话分类

## 优势
- 捕获长距离依赖关系
- 注意力机制自动聚焦关键信息
- 注意力权重可解释
- 适用于中长文本
- 端到端训练

## 局限性
- 训练速度慢（序列模型）
- 无法并行计算（LSTM时序依赖）
- 对超参数敏感
- 静态词向量缺乏上下文理解
- 长序列梯度消失/爆炸风险

## 实现框架
- PyTorch：nn.LSTM + 自定义Attention
- TensorFlow/Keras：Bidirectional(LSTM) + Attention层
- Hugging Face：可配合预训练模型使用

## 与其他模型对比

| 模型 | 长文本 | 可解释性 | 速度 | 准确率 |
|------|--------|---------|------|--------|
| TextCNN | 差 | 低 | 快 | 良好 |
| **BiLSTM-Attention** | **好** | **高** | 中 | 优秀 |
| TextRNN | 中 | 低 | 中 | 良好 |
| BERT-Classifier | 好 | 中 | 慢 | 最优 |
| HAN | 最好 | 高 | 慢 | 优秀 |
