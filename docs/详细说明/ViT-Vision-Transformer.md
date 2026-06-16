# ViT（Vision Transformer）

## 简介
ViT（Vision Transformer）由Google在2020年提出，首次将Transformer架构成功应用于计算机视觉任务，开创了视觉Transformer的研究热潮。

## 核心原理
- **图像分块（Patch Embedding）**：将图像分割成固定大小的patch
- **位置编码**：保留patch的空间位置信息
- **Transformer编码器**：处理patch序列
- **分类头**：输出最终预测结果

## 主要变体
- DeiT：数据高效训练
- Swin Transformer：层级结构
- PVT：金字塔ViT
- MAE ViT：掩码自编码器

## 医疗应用场景

### 病理切片分析
- 全切片图像（WSI）分析
- 宫颈癌筛查
- 乳腺癌分级
- 前列腺癌诊断

### 医学影像分类
- 多标签疾病分类
- 病灶检测
- 影像质量评估

### 多实例学习
- 病理图像MIL
- 弱监督学习
- 多尺度特征融合

## 优势
- 全局建模能力强
- 可扩展性好
- 预训练迁移效果好
- 适合大规模数据

## 局限性
- 对小数据集效果有限
- 计算复杂度高
- 对局部细节捕获不如CNN
- 需要大量训练数据
