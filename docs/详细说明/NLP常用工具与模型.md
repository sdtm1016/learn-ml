# NLP常用工具与模型

> 本文档系统介绍NLP领域四类核心工具与模型：BERT、GPT、spaCy、HanLP，涵盖原理、架构、功能对比及医疗场景应用。

---

## 目录

1. [BERT——双向编码器表示](#一bert双向编码器表示)
2. [GPT——生成式预训练Transformer](#二gpt生成式预训练transformer)
3. [spaCy——工业级NLP流水线](#三spacy工业级nlp流水线)
4. [HanLP——中文自然语言处理工具包](#四hanlp中文自然语言处理工具包)
5. [四者对比与选型指南](#五四者对比与选型指南)
6. [医疗场景下的组合使用](#六医疗场景下的组合使用)

---

## 一、BERT——双向编码器表示

### 1.1 简介

BERT（Bidirectional Encoder Representations from Transformers）由Google于2018年提出，是基于Transformer编码器的预训练语言模型。它通过在大规模无标注语料上预训练，学习语言的深层双向表示，再通过微调适配下游任务，刷新了11项NLP基准测试。

**一句话概括**：BERT是"读懂文本"的王者——擅长理解语言含义，用于分类、标注、抽取等理解型任务。

### 1.2 核心架构

```
输入文本: "患者 既往 高血压 病史"
         ↓
  ┌──────────────────────────────┐
  │      Token Embedding         │  ← 词嵌入
  │   + Segment Embedding        │  ← 句子编号（句子A/B）
  │   + Position Embedding       │  ← 位置信息
  └──────────────────────────────┘
         ↓
  ┌──────────────────────────────┐
  │   Transformer Encoder ×12    │  ← 12层双向自注意力（Base版）
  │   (Self-Attention + FFN)     │
  └──────────────────────────────┘
         ↓
  ┌──────────┬──────────────────┐
  │ [CLS]    │ 各Token的上下文   │
  │ 句子表示  │ 语义向量表示      │
  └──────────┴──────────────────┘
         ↓
    微调适配下游任务
```

### 1.3 两大预训练任务

| 任务 | 原理 | 目的 |
|------|------|------|
| **掩码语言模型（MLM）** | 随机遮盖15%的token，让模型根据上下文预测被遮盖的词 | 学习双向上下文表示 |
| **下一句预测（NSP）** | 给定两个句子，判断后者是否是前者的下一句 | 学习句子间关系 |

MLM示例：
```
输入: "患者[MASK]现胸闷[MASK]天"
目标: [MASK]₁ = 出, [MASK]₂ = 3
```

### 1.4 模型规格

| 版本 | 参数量 | 层数 | 隐层维度 | 注意力头数 |
|------|--------|------|----------|-----------|
| BERT-Base | 1.1亿 | 12 | 768 | 12 |
| BERT-Large | 3.4亿 | 24 | 1024 | 16 |

### 1.5 主要变体

| 变体 | 改进方向 | 特点 |
|------|----------|------|
| **RoBERTa** | 优化训练策略 | 去掉NSP，更多数据，动态遮盖，性能更强 |
| **ALBERT** | 轻量化 | 参数共享，跨层参数共享，模型缩小18倍 |
| **DistilBERT** | 知识蒸馏 | 保留97%性能，体积缩小40%，速度快60% |
| **BioBERT** | 生物医学领域 | 在PubMed摘要+PMC全文上继续预训练 |
| **ClinicalBERT** | 临床文本 | 在MIMIC-III临床笔记上继续预训练 |
| **PubMedBERT** | 医学领域 | 从头在PubMed语料预训练，非通用模型迁移 |
| **Chinese-BERT** | 中文优化 | 针对中文语言特点优化 |

### 1.6 典型用法

```python
from transformers import BertTokenizer, BertModel

tokenizer = BertTokenizer.from_pretrained('bert-base-chinese')
model = BertModel.from_pretrained('bert-base-chinese')

inputs = tokenizer("患者既往高血压病史", return_tensors="pt")
outputs = model(**inputs)

# 获取句向量（[CLS]位置的输出）
sentence_embedding = outputs.last_hidden_state[:, 0, :]
# 获取每个token的上下文向量
token_embeddings = outputs.last_hidden_state
```

微调下游任务（以文本分类为例）：
```python
from transformers import BertForSequenceClassification

model = BertForSequenceClassification.from_pretrained(
    'bert-base-chinese', num_labels=10  # 如10种疾病分类
)
# 在标注数据上 fine-tune 即可
```

### 1.7 医疗应用场景

| 场景 | 用法 | 说明 |
|------|------|------|
| 电子病历实体识别 | BioBERT-CRF / ClinicalBERT-CRF | 提取症状、诊断、药物、手术等实体 |
| 临床文本分类 | BERT-Classifier | 诊断分类、病历质控、科室分流 |
| 医学问答 | BERT + 检索 | 从临床指南中抽取答案 |
| 关系抽取 | BERT + 分类头 | 药物-疾病关系、症状-诊断关系 |
| 病历相似度计算 | BERT句向量 | 相似病历检索、重复检查识别 |

### 1.8 优势与局限

| 优势 | 局限 |
|------|------|
| 双向上下文理解能力强 | 生成能力弱（编码器架构，不适合生成任务） |
| 预训练+微调范式成熟 | 计算资源需求较大（训练阶段） |
| 迁移学习效果优秀 | 最大序列长度512 token |
| 开源生态完善 | 推理速度相对较慢（相比轻量模型） |
| 医疗变体丰富 | 对中文需先分词或使用Whole Word Masking |

---

## 二、GPT——生成式预训练Transformer

### 2.1 简介

GPT（Generative Pre-trained Transformer）由OpenAI提出，是基于Transformer解码器的自回归语言模型。与BERT的"理解"定位不同，GPT定位为"生成"——根据已有文本预测下一个token，逐词生成连续文本。

**一句话概括**：GPT是"写文章"的王者——擅长生成连贯文本，用于对话、创作、摘要、报告生成等生成型任务。

### 2.2 核心架构

```
输入文本: "患者 主诉 胸 痛"
         ↓
  ┌──────────────────────────────┐
  │   Token Embedding            │
  │   + Position Embedding       │  （无Segment Embedding）
  └──────────────────────────────┘
         ↓
  ┌──────────────────────────────┐
  │   Transformer Decoder ×N     │  ← 自回归：只能看到当前及之前的token
  │   (Masked Self-Attention)    │  ← 掩码注意力，防止"偷看"未来
  └──────────────────────────────┘
         ↓
  ┌──────────────────────────────┐
  │   Linear + Softmax           │
  │   → 预测下一个token的概率分布  │
  └──────────────────────────────┘
         ↓
    自回归生成：取概率最高的词，加入输入，继续预测
```

**关键区别**：GPT使用**掩码自注意力（Masked Self-Attention）**，每个位置只能关注自身及之前的位置，天然适合从左到右的文本生成。

### 2.3 预训练目标

```
给定文本序列: w₁, w₂, ..., wₙ
目标: 最大化条件概率的对数似然

L = Σ log P(wₜ | w₁, w₂, ..., wₜ₋₁)

即：根据前面的所有词，预测下一个词
```

### 2.4 GPT家族演进

| 版本 | 发布时间 | 参数量 | 关键突破 |
|------|----------|--------|----------|
| GPT-1 | 2018.06 | 1.17亿 | 验证预训练+微调的生成式路线 |
| GPT-2 | 2019.02 | 15亿 | Zero-shot能力，"太危险"拒绝开源 |
| GPT-3 | 2020.06 | 1750亿 | Few-shot in-context learning |
| InstructGPT | 2022.01 | 1750亿 | RLHF对齐人类偏好 |
| ChatGPT (GPT-3.5) | 2022.11 | ~1750亿 | 对话能力爆发，引发全球关注 |
| GPT-4 | 2023.03 | 未公开（推测万亿级） | 多模态（文本+图像），推理能力大幅提升 |
| GPT-4o | 2024.05 | - | 实时多模态交互（语音+视觉+文本） |
| GPT-4.1 / o系列 | 2025 | - | 推理链（Chain-of-Thought）增强 |

### 2.5 GPT能力矩阵

| 能力 | 说明 | 医疗示例 |
|------|------|----------|
| 文本生成 | 生成连贯、流畅的长文本 | 生成出院小结、影像报告 |
| 对话交互 | 多轮上下文理解与回复 | 智能问诊、患者随访 |
| 知识问答 | 基于预训练知识的问答 | 医学知识咨询 |
| 翻译 | 多语言互译 | 医学文献中英翻译 |
| 摘要 | 长文本压缩为短摘要 | 病历摘要、文献摘要 |
| 代码生成 | 根据描述生成代码 | 医疗数据分析脚本 |
| 推理 | 多步骤逻辑推理 | 鉴别诊断推理 |

### 2.6 典型用法

**API调用（以OpenAI为例）**：
```python
from openai import OpenAI

client = OpenAI(api_key="your-api-key")

response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "你是一名心内科主治医师。"},
        {"role": "user", "content": "患者男，58岁，突发胸痛2小时，心电图示ST段抬高。请给出初步诊断和处理建议。"}
    ]
)
print(response.choices[0].message.content)
```

**开源模型本地部署（以LlamaIndex + vLLM为例）**：
```python
from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-2-7b-chat-hf")
model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-2-7b-chat-hf")

inputs = tokenizer("患者主诉胸痛3天", return_tensors="pt")
outputs = model.generate(**inputs, max_new_tokens=200)
print(tokenizer.decode(outputs[0]))
```

### 2.7 医疗应用场景

| 场景 | 说明 |
|------|------|
| **智能问诊/导诊** | 多轮对话采集症状，给出就诊建议 |
| **出院小结生成** | 汇总住院过程，自动生成结构化出院记录 |
| **影像报告生成** | 根据影像特征描述，生成诊断报告文本 |
| **患者教育** | 将专业医学术语转化为通俗语言 |
| **医学文献翻译** | 高质量的中英医学文献互译 |
| **鉴别诊断推理** | 基于症状/体征/检查，推理可能的诊断列表 |
| **慢病随访对话** | 生成个性化的随访问题和健康建议 |
| **临床病历质控** | 检查病历书写的完整性、规范性 |

### 2.8 医疗领域GPT变体

| 模型 | 来源 | 特点 |
|------|------|------|
| Med-PaLM 2 | Google | USMLE准确率86.5%，达专家水平 |
| 华佗（HuatuoGPT） | 中文医疗大模型 | 中文医学知识增强 |
| ChatDoctor | 开源 | 基于LLaMA微调的医疗对话模型 |
| PMC-LLaMA | 开源 | 在PMC医学语料上微调 |
| 灵医大模型 | 国内 | 面向临床场景的中文医疗大模型 |

### 2.9 优势与局限

| 优势 | 局限 |
|------|------|
| 生成能力极强，文本流畅自然 | 幻觉问题——可能生成虚假信息 |
| Few-shot / Zero-shot能力突出 | 医疗场景幻觉风险高，需RAG增强 |
| 多任务通用，无需逐个训练 | 推理成本高（API费用/算力需求） |
| 多模态扩展（GPT-4V/o） | 数据隐私风险（云端调用） |
| 生态完善（插件、API、Agent） | 最大上下文长度有限（虽有128K版本） |
| 对话能力强，用户体验好 | 领域专业性不如专用微调模型 |

---

## 三、spaCy——工业级NLP流水线

### 3.1 简介

spaCy是由Explosion AI开发的工业级NLP开源库（2015年发布），以**速度快、工程友好、生产就绪**为设计理念。它不是研究工具，而是面向实际产品开发的NLP流水线框架。

**一句话概括**：spaCy是"生产线上的NLP工人"——快速、稳定、开箱即用，适合工程部署。

### 3.2 核心设计理念

| 理念 | 说明 |
|------|------|
| **Pipeline架构** | 所有处理步骤组成流水线，数据依次流过各组件 |
| **Cython加速** | 核心代码用Cython编写，速度极快 |
| **不可变数据结构** | Doc对象一旦创建不修改，线程安全 |
| **规则+模型混合** | 支持Tokenizer规则匹配与统计模型并用 |
| **生产优先** | 模型文件小、推理快、部署方便 |

### 3.3 处理流水线

```
原始文本
  ↓
Tokenizer（分词器）       ← 规则分词，非统计模型
  ↓
Tagger（词性标注器）      ← 统计模型
  ↓
Parser（依存句法分析器）  ← 统计模型
  ↓
NER（命名实体识别器）     ← 统计模型
  ↓
Doc对象（包含所有标注结果）
  ↓
自定义组件（文本分类、自定义匹配器等）
```

### 3.4 核心功能模块

| 模块 | 功能 | 说明 |
|------|------|------|
| Tokenizer | 分词 | 基于规则，支持自定义分词规则 |
| Tagger | 词性标注 | 标注每个token的词性（名词/动词/形容词...） |
| DependencyParser | 依存句法分析 | 分析词与词之间的语法关系 |
| NER | 命名实体识别 | 识别人名、地名、组织名等实体 |
| TextCategorizer | 文本分类 | 将文本映射到预定义类别 |
| EntityLinker | 实体链接 | 将实体链接到知识库（如Wikidata） |
| Sentencizer | 分句 | 将文本切分为句子 |
| MorphAnalyzer | 形态分析 | 分析词的词法特征（时态、数、格等） |

### 3.5 支持的语言

spaCy官方支持70+语言，其中对以下语言有完整的流水线模型：

| 语言 | 模型 | 说明 |
|------|------|------|
| English | en_core_web_sm/md/lg/trf | 4种规模，trf为Transformer版 |
| Chinese | zh_core_web_sm/md/trf | 中文支持，但效果不如HanLP |
| German | de_core_news_sm/md/lg | 德语 |
| French | fr_core_news_sm/md/lg | 法语 |
| Spanish | es_core_news_sm/md/lg | 西班牙语 |
| Japanese | ja_core_news_sm/md/trf | 日语 |

### 3.6 典型用法

**基础流水线**：
```python
import spacy

# 加载英文模型
nlp = spacy.load("en_core_web_sm")

doc = nlp("Patient has a history of hypertension and diabetes mellitus.")

# 分词
for token in doc:
    print(token.text, token.pos_, token.dep_)

# 命名实体识别
for ent in doc.ents:
    print(ent.text, ent.label_)

# 依存句法可视化
from spacy import displacy
displacy.serve(doc, style="dep")
```

**自定义医疗NER组件**：
```python
from spacy.language import Language

@Language.factory("medical_ner")
class MedicalNER:
    def __init__(self, nlp, name):
        self.name = name
        # 加载医疗NER模型...

    def __call__(self, doc):
        # 在doc.ents中添加医疗实体
        return doc

# 将自定义组件加入流水线
nlp = spacy.load("en_core_web_sm")
nlp.add_pipe("medical_ner")
```

**Rule-based匹配（基于规则的匹配器）**：
```python
from spacy.matcher import Matcher

nlp = spacy.load("en_core_web_sm")
matcher = Matcher(nlp.vocab)

# 匹配"高血压"相关表述
pattern = [
    {"LOWER": {"IN": ["hypertension", "high blood pressure", "htn"]}}
]
matcher.add("HYPERTENSION", [pattern])

doc = nlp("Patient was diagnosed with hypertension last year.")
matches = matcher(doc)
for match_id, start, end in matches:
    print(doc[start:end].text)
```

### 3.7 医疗应用场景

| 场景 | 用法 | 说明 |
|------|------|------|
| 英文电子病历预处理 | NER + 依存分析 | 提取英文病历中的症状、药物、诊断 |
| 临床文本信息抽取 | 医疗NER自定义组件 | 在spaCy流水线中嵌入医疗专用NER模型 |
| 药物名称识别 | Med7模型（spaCy医疗版） | 识别药物名称、剂量、频率、给药途径 |
| 医学文献预处理 | 分句 + 分词 + 词性标注 | 为下游深度学习模型准备数据 |
| 临床文本规则匹配 | Matcher / PhraseMatcher | 基于规则匹配特定医学术语和表述 |
| 多语言病历处理 | 加载不同语言模型 | 处理不同语言的临床文本 |

**Med7——spaCy的医疗专用版**：
```python
# Med7是专为临床文本训练的spaCy模型
import medspacy

nlp = medspacy.load()
doc = nlp("Patient was given metformin 500mg twice daily for diabetes.")

for ent in doc.ents:
    print(ent.text, ent.label_)
# 输出:
# metformin   DRUG
# 500mg       DOSAGE
# twice daily FREQUENCY
# diabetes    DISEASE
```

### 3.8 优势与局限

| 优势 | 局限 |
|------|------|
| 速度极快（Cython优化） | 中文支持不如HanLP |
| API设计优雅，易于上手 | 深度学习能力有限（需外部模型） |
| 流水线架构，模块化组合 | 不适合中文分词（中文分词较弱） |
| 生产级稳定性 | 预训练模型精度不如BERT系列 |
| 自定义组件扩展方便 | 不支持GPU加速（CPU优先设计） |
| 可视化工具（displacy） | 预训练模型需额外下载 |
| 社区活跃，文档完善 | 对复杂NLP任务（如关系抽取）支持有限 |

---

## 四、HanLP——中文自然语言处理工具包

### 4.1 简介

HanLP（Han Language Processing）是由Hankcs开发的面向生产环境的中文自然语言处理工具包。从1.x版本（基于传统机器学习）演进到2.x版本（基于深度学习+Transformer），是中文NLP领域最成熟、功能最全的开源工具之一。

**一句话概括**：HanLP是"中文NLP瑞士军刀"——功能全面、中文效果好、兼顾学术与工业。

### 4.2 版本演进

| 版本 | 架构 | 核心技术 | 特点 |
|------|------|----------|------|
| HanLP 1.x | 传统ML | CRF、HMM、感知机 | 经典稳定，Java/Python接口 |
| HanLP 2.x | 深度学习 | Transformer、BERT | 精度更高，支持多任务联合模型 |

### 4.3 核心功能模块

| 功能 | 说明 | 模型方法 |
|------|------|----------|
| **中文分词** | 将中文文本切分为词语 | Transformer + 词典 + CRF |
| **词性标注** | 标注每个词的语法角色 | 联合模型（分词+词性同时预测） |
| **命名实体识别** | 识别专有名词 | Transformer-CRF |
| **依存句法分析** | 分析词与词的语法关系 | Biaffine Attention |
| **成分句法分析** | 分析句子的语法结构 | CRF Constituent Parser |
| **语义依存分析** | 分析词与词的语义关系 | Biaffine + Graph-based |
| **文本分类** | 将文本映射到预定义类别 | TextCNN / BERT |
| **情感分析** | 判断文本的情感倾向 | 基于句法+词典 / 深度学习 |
| **关键词提取** | 提取文本核心关键词 | TextRank / TF-IDF |
| **摘要生成** | 生成文本摘要 | 抽取式 + 生成式 |
| **文本聚类** | 相似文本聚类 | 句向量 + K-Means |
| **简繁转换** | 简体/繁体中文互转 | 规则 + 词典 |
| **拼音转换** | 汉字转拼音 | 规则 + 多音字消歧 |

### 4.4 架构设计

```
原始中文文本
  ↓
┌─────────────────────────────────┐
│         HanLP Pipeline          │
│                                 │
│  ┌───────────┐                  │
│  │  分词器     │  ← Transformer  │
│  │  Tokenizer │    + CRF        │
│  └─────┬─────┘                  │
│        ↓                        │
│  ┌───────────┐                  │
│  │  词性标注   │  ← 联合预测      │
│  │  POS Tagger│                  │
│  └─────┬─────┘                  │
│        ↓                        │
│  ┌───────────┐                  │
│  │  命名实体   │  ← Transformer  │
│  │  识别 NER  │    + CRF        │
│  └─────┬─────┘                  │
│        ↓                        │
│  ┌───────────┐                  │
│  │  依存句法   │  ← Biaffine    │
│  │  分析      │    Attention    │
│  └─────┬─────┘                  │
│        ↓                        │
│  ┌───────────┐                  │
│  │  自定义组件  │  ← 用户扩展     │
│  └───────────┘                  │
└─────────────────────────────────┘
  ↓
结构化输出（分词 + 词性 + 实体 + 句法）
```

### 4.5 典型用法

**基础分词与标注**：
```python
import hanlp

# 加载联合模型（分词+词性+NER同时完成）
tokenizer = hanlp.load(hanlp.pretrained.tokens.MSR_BERT_BASE)
tagger = hanlp.load(hanlp.pretrained.pos.CTB9_POS_BERT_BASE)
ner = hanlp.load(hanlp.pretrained.ner.MSRA_NER_BERT_BASE)
syntactic_parser = hanlp.load(hanlp.pretrained.dep.CTB9_DEP_BERT_BASE)

# 组建流水线
pipeline = hanlp.pipeline() \
    .append(tokenizer) \
    .append(tagger) \
    .append(ner) \
    .append(syntactic_parser)

text = "患者既往有高血压病史10年，规律服用氨氯地平控制血压。"
result = pipeline(text)
print(result)
```

**医疗文本分词（自定义词典）**：
```python
from hanlp.components.tokenizers import TransformerTokenizer

tokenizer = hanlp.load(hanlp.pretrained.tokens.MSR_BERT_BASE)

# 添加医疗自定义词典，确保医学术语不被错误切分
tokenizer.dict_force = hanlp.utils.rules.CUSTOM_DICTIONARY
tokenizer.dict_force.update([
    "冠状动脉粥样硬化性心脏病",
    "高血压病",
    "氨氯地平",
    "双下肢水肿",
    "心电图",
    "心肌梗死"
])

print(tokenizer("患者诊断为冠状动脉粥样硬化性心脏病，予氨氯地平口服。"))
# ['患者', '诊断', '为', '冠状动脉粥样硬化性心脏病', '，', '予', '氨氯地平', '口服', '。']
```

**NER识别医疗实体**：
```python
ner = hanlp.load(hanlp.pretrained.ner.MSRA_NER_BERT_BASE)

text = "北京协和医院心内科张主任治疗了一例急性心肌梗死患者"
print(ner(text))
# [('北京协和医院', 'ORG'), ('心内科', 'ORG'), ('张主任', 'PERSON'), ...]
```

### 4.6 医疗应用场景

| 场景 | 用法 | 说明 |
|------|------|------|
| 中文病历分词 | Transformer分词 + 医疗词典 | 电子病历、入院记录的中文分词 |
| 医学实体识别 | NER模型 + 医疗实体词典 | 识别疾病、症状、药物、检查等实体 |
| 病历文本依存分析 | 依存句法分析 | 理解病历中"服用→药物"、"诊断→疾病"关系 |
| 中文医学文献处理 | 全流水线 | 文献分词、词性标注、实体提取 |
| 简繁体医学文本统一 | 简繁转换 | 处理港澳台地区繁体中文病历 |
| 医疗文本拼音标注 | 拼音转换 | 医学术语拼音标注、语音辅助 |

### 4.7 优势与局限

| 优势 | 局限 |
|------|------|
| 中文处理效果业界领先 | Transformer版需要GPU |
| 功能全面（13+种NLP任务） | 大模型推理速度较慢 |
| 支持自定义词典和规则 | 对医疗领域的NER需要额外训练 |
| 2.x版本基于深度学习，精度高 | Python版本不如Java版本功能全 |
| 开源免费，社区活跃 | 预训练模型文件较大 |
| 多任务联合模型，效率高 | 不如BERT等专业模型在特定任务上的精度 |
| 学术与工业兼顾 | 英文处理能力不如spaCy |

---

## 五、四者对比与选型指南

### 5.1 核心定位对比

```
                理解型 ←────────────────→ 生成型
                  │                          │
             BERT ●                         ● GPT
            (编码器)                      (解码器)
            "读懂文本"                    "写文章"
                  │                          │
                  │    工具层                 │
                  │                          │
             spaCy ●                       ● HanLP
           (英文工业流水线)            (中文NLP瑞士军刀)
           "生产线工人"               "中文处理专家"
```

### 5.2 多维对比表

| 维度 | BERT | GPT | spaCy | HanLP |
|------|------|-----|-------|-------|
| **类型** | 预训练模型（编码器） | 预训练模型（解码器） | NLP工具库 | NLP工具库 |
| **核心能力** | 文本理解（分类/标注/抽取） | 文本生成（对话/创作/推理） | 英文NLP流水线 | 中文NLP流水线 |
| **语言** | 多语言 | 多语言 | 70+语言（英文最优） | 中文为主 |
| **模型规模** | 1亿~3.4亿 | 1亿~万亿级 | 轻量级 | 轻量~中等 |
| **使用方式** | 预训练+微调 | Prompt/API/微调 | 加载模型直接使用 | 加载模型直接使用 |
| **是否需要GPU** | 推荐GPU | 必须GPU | CPU即可 | CPU可跑（Transformer版推荐GPU） |
| **中文支持** | 好（chinese-BERT） | 好（中文Prompt） | 一般 | 优秀 |
| **训练自定义** | 微调/LoRA | 微调/LoRA/Prompt | 训练自定义组件 | 训练自定义模型 |
| **部署难度** | 中等 | 高（大模型）/ 低（API） | 低 | 低 |
| **开源** | ✅ 完全开源 | ❌ GPT-3/4闭源（有开源替代） | ✅ MIT协议 | ✅ Apache 2.0 |

### 5.3 选型决策树

```
你的任务是什么？
│
├── 文本理解任务（分类/标注/抽取）
│   ├── 中文文本 → BERT（中文微调）+ HanLP（预处理）
│   └── 英文文本 → BERT + spaCy（预处理）
│
├── 文本生成任务（对话/摘要/报告生成）
│   ├── 有API预算 → GPT-4 / GPT-4o API
│   ├── 需要私有化 → 开源LLM（LLaMA/ChatGLM）+ 医疗微调
│   └── 轻量级生成 → 小型GPT-2 + 领域微调
│
├── 中文文本预处理（分词/词性/NER）
│   ├── 追求精度 → HanLP 2.x（Transformer版）
│   ├── 追求速度 → Jieba / HanLP 1.x
│   └── 深度语义 → BERT分词器（WordPiece）
│
├── 英文文本预处理
│   ├── 生产环境 → spaCy
│   └── 学术研究 → NLTK / spaCy
│
└── 医疗NLP全流程
    ├── 预处理 → HanLP（中文）/ spaCy（英文）
    ├── 实体抽取 → BioBERT-CRF / ClinicalBERT-CRF
    ├── 关系抽取 → BERT-based RE模型
    ├── 报告生成 → 医疗GPT大模型
    └── 智能问答 → GPT + RAG + 知识图谱
```

---

## 六、医疗场景下的组合使用

### 6.1 中文病历信息抽取——最佳组合

```mermaid
graph LR
    A[原始中文病历文本] --> B[HanLP 分词+词性标注]
    B --> C[BioBERT-CRF 实体识别]
    C --> D[BERT-based 关系抽取]
    D --> E[结构化JSON输出]

    style A fill:#f9f,stroke:#333
    style B fill:#bbf,stroke:#333
    style C fill:#bfb,stroke:#333
    style D fill:#bfb,stroke:#333
    style E fill:#fbb,stroke:#333
```

### 6.2 英文临床文本处理——最佳组合

```
原始英文临床文本
  ↓ spaCy（分词+词性+依存分析）
  ↓ BioBERT-CRF（医疗NER）
  ↓ ClinicalBERT（文本分类/质控）
  ↓ GPT API（报告生成/总结）
  ↓ 结构化输出
```

### 6.3 智能问诊系统——最佳组合

```
患者输入（语音/文字）
  ↓ ASR（语音转文字，如为语音输入）
  ↓ HanLP（中文分词+实体识别）
  ↓ BERT（意图识别+槽位提取）
  ↓ 规则引擎 + 知识图谱（推理追问逻辑）
  ↓ GPT（生成自然语言回复）
  ↓ 患者看到回复 → 继续对话
```

### 6.4 医疗NLP技术组合速查表

| 场景 | 预处理 | 核心模型 | 生成（如需） |
|------|--------|----------|-------------|
| 中文病历结构化 | HanLP | BioBERT-CRF + RE模型 | — |
| 英文病历处理 | spaCy | ClinicalBERT-CRF | — |
| 智能问诊（中文） | HanLP | BERT意图识别 | GPT生成回复 |
| 医学报告生成 | — | GPT/RAG | 医疗LLM |
| 文献挖掘 | HanLP/spaCy | BERT + 关系抽取 | GPT摘要 |
| ICD智能编码 | HanLP | BERT语义匹配 | — |
| 病历质控 | HanLP | BERT分类 + 规则引擎 | GPT修改建议 |

---

## 附录：快速入门资源

| 工具/模型 | 官网/仓库 | 安装命令 |
|-----------|----------|----------|
| BERT | https://huggingface.co/docs/transformers | `pip install transformers` |
| GPT (OpenAI API) | https://platform.openai.com | `pip install openai` |
| GPT (开源替代) | https://github.com/meta-llama | `pip install transformers` |
| spaCy | https://spacy.io | `pip install spacy` |
| HanLP | https://hanlp.hankcs.com | `pip install hanlp` |
| Med7 (spaCy医疗版) | https://github.com/kormilitzin/med7 | `pip install medspacy` |
| BioBERT | https://github.com/dmis-lab/biobert | HuggingFace直接加载 |
| ClinicalBERT | https://github.com/EmilyAlsentzer/clinicalBERT | HuggingFace直接加载 |

---

*文档生成时间：2026-04-21*
