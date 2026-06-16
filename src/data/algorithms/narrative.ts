// 中文注释：叙事字段生成逻辑
// 根据算法的分类与事实信息，自动拼装通俗原理/医疗示例/其他示例/为什么选它四个教学字段。
import type { BaseAlgorithmItem, NarrativeFields } from './types';

function joinList(items: string[]) {
  return items.join('、');
}

function categoryExampleContext(algorithm: BaseAlgorithmItem) {
  const categories = new Set(algorithm.categories);

  if (categories.has('vision')) {
    return {
      medical: '把它放到胸片、CT 或眼底照片里想象：医生先标出肺结节、出血区域或病灶边界，模型训练时反复观察这些影像，把边缘、纹理、形状和上下文组合成判断线索。上线后，它不是替医生下最终诊断，而是把可疑区域高亮出来，让医生优先复核。',
      fallback: '换成工业质检也一样：相机拍下零件表面，模型学习划痕、缺口、污染点的视觉模式，生产线上先自动圈出风险区域，再由质检员确认。',
    };
  }

  if (categories.has('nlp')) {
    return {
      medical: '把它放到电子病历里想象：一份入院记录里有主诉、既往史、检查结果和用药信息，模型会从文字上下文里识别疾病、症状、药品和时间关系。它像一个很细心的病历助手，先把长文本整理成结构化线索，再交给医生或质控人员复核。',
      fallback: '换成客服工单，它会阅读用户描述，判断问题类型、情绪强度和需要转给哪个团队，帮助客服系统更快分流。',
    };
  }

  if (categories.has('preprocessing')) {
    return {
      medical: '把它放到电子病历缺失值里想象：有些患者漏填了体重、某次检验没做、随访时间没记录。模型会先根据相似患者和变量关系补一个合理值，让后续风险预测不会因为“空白格太多”而直接失真。',
      fallback: '换成电商数据清洗，它会根据相似用户、相近商品或统计关系补齐缺失价格、品类或浏览记录，避免训练集被大量空值拖垮。',
    };
  }

  if (categories.has('evaluation')) {
    return {
      medical: '把它放到临床风险告知里想象：模型已经给出“30% 风险”，但医生真正关心的是这句话能不能被信任。校准和解释工具会告诉医生这个概率准不准、哪些指标把风险推高了，帮助医生把模型结果转成能沟通、能复核的判断。',
      fallback: '换成信贷审批，它会告诉风控人员“为什么判高风险”、概率是不是可信，而不只是给一个冷冰冰的分数。',
    };
  }

  if (categories.has('time-series')) {
    return {
      medical: '把它放到 ICU 监护数据里想象：心率、血压、血氧像一条条随时间变化的曲线。模型会观察过去几小时的波动节奏，判断未来一段时间是否可能出现恶化趋势，提前给医护一个预警窗口。',
      fallback: '换成门店客流预测，它会根据过去每天、每周和节假日的变化，估计明天哪个时段更忙，方便排班和备货。',
    };
  }

  if (categories.has('survival')) {
    return {
      medical: '把它放到随访队列里想象：不是只问“会不会发生并发症”，而是同时问“什么时候发生”。模型会把每个患者的随访时间、删失情况和终点事件一起考虑，帮助医生判断哪些人更需要提前干预。',
      fallback: '换成设备寿命分析，它会研究机器运行多久后可能故障，并利用尚未坏掉的机器记录来改进预测。',
    };
  }

  if (categories.has('causal')) {
    return {
      medical: '把它放到真实世界随访里想象：一个患者接受强化随访，另一个没接受，看起来结果不同，但这中间可能夹着年龄、病情、合并症等混杂因素。因果方法会先尽量让两组“站在同一起跑线”，再估计干预到底有没有真正带来改善。',
      fallback: '换成营销活动评估，它会尽量把参与活动的人和没参与的人配平，再判断促销是不是真的提升了转化。',
    };
  }

  if (categories.has('recommendation')) {
    return {
      medical: '把它放到随访管理里想象：不同患者有不同疾病、检查结果、复诊记录和健康教育阅读行为。模型会找到相似患者常用的随访路径或科普材料，给医生一个候选清单，再由医生判断是否适合当前患者。',
      fallback: '换成视频平台，它会根据相似用户和相似内容的互动，把你可能感兴趣的视频排到更靠前的位置。',
    };
  }

  if (categories.has('reinforcement')) {
    return {
      medical: '把它放到康复训练计划里想象：系统每次给患者安排一个训练强度，观察疼痛评分、完成度和恢复指标，再调整下一次训练。它关注的不是单次预测，而是连续多步决策后总体恢复是否更好。',
      fallback: '换成机器人走迷宫，它每走一步都会得到奖励或惩罚，久而久之学会哪条路线更快到终点。',
    };
  }

  if (categories.has('anomaly')) {
    return {
      medical: '把它放到检验数据质控里想象：大多数患者的某些指标组合会落在常见范围内，模型先学习“正常模式”的边界。当某份检验结果组合很少见时，它会提示可能存在采样、录入、仪器或真实病情异常，需要人工复核。',
      fallback: '换成支付风控，它会把和平时消费习惯差异很大的交易挑出来，例如地点、金额、时间组合都很反常的订单。',
    };
  }

  if (categories.has('unsupervised') || categories.has('dimensionality')) {
    return {
      medical: '把它放到患者分群里想象：手里没有明确标签，只有年龄、检查指标、用药和就诊记录。模型会按相似性把患者自动分组，帮助研究人员发现“代谢异常型”“炎症活跃型”等可能亚群，再进一步做医学解释。',
      fallback: '换成客户运营，它会把消费频率、价格偏好和浏览行为相近的人分成几类，方便制定不同触达策略。',
    };
  }

  if (categories.has('ensemble')) {
    return {
      medical: '把它放到再入院风险预测里想象：单个模型可能只抓住年龄、既往病史或检验指标中的一部分线索，集成模型会让多棵树或多个模型一起投票，综合判断患者出院后短期再入院风险。',
      fallback: '换成贷款审批，它会综合许多弱规则，最终给出更稳定的风险评分，减少某一条规则误判带来的影响。',
    };
  }

  if (categories.has('graph')) {
    return {
      medical: '把它放到药物相互作用网络里想象：药物、疾病、基因和不良反应都是节点，它们之间的关系是边。模型会沿着关系传递信息，推断某个药物组合是否可能带来新的风险线索。',
      fallback: '换成社交网络，它会根据朋友关系、共同兴趣和传播路径判断谁可能认识谁、哪条内容可能扩散。',
    };
  }

  return {
    medical: '把它放到临床风险预测里想象：每个患者都有年龄、症状、检验指标、既往病史等特征，模型学习这些特征和结局之间的关系。之后遇到新患者时，它会给出风险分数，帮助医生决定是否需要更密切观察或进一步检查。',
    fallback: '换成房价预测或客户流失预测，它会根据历史样本学习哪些因素更重要，再对新样本给出数值或类别判断。',
  };
}

// 中文注释：导出供 index.ts 聚合时调用，为每个算法生成四个教学叙事字段
export function buildNarrative(algorithm: BaseAlgorithmItem): NarrativeFields {
  const context = categoryExampleContext(algorithm);
  const useCases = joinList(algorithm.whenToUse);
  const strengths = joinList(algorithm.strengths);

  return {
    plainExplanation:
      algorithm.name +
      ' 可以先理解成一种“把经验变成规则”的方法：' +
      algorithm.intuition +
      ' 训练阶段，它反复比较自己的判断和真实答案或数据结构之间的差距；使用阶段，它把学到的规律应用到新样本上。初学时不要先背公式，先记住它在问什么问题、依赖什么数据、输出什么结果。',
    medicalExample:
      context.medical +
      ' 在这个场景里，' +
      algorithm.name +
      ' 的输入通常来自病历、影像、检验或监测数据，输出则服务于风险提示、分组、检索或辅助决策。它尤其适合：' +
      useCases +
      '。注意它只能提供学习和辅助分析思路，不能替代医生诊断。',
    fallbackExample:
      context.fallback +
      ' 这个例子和医疗场景的共同点是：都先把对象表示成特征，再让模型从历史模式里学会相似、差异、趋势或决策边界。',
    whyItFits:
      '选择 ' +
      algorithm.name +
      ' 时，核心理由是它的能力和任务形态匹配：' +
      algorithm.description +
      ' 它的优势在于' +
      strengths +
      '；同时要记住边界条件，' +
      algorithm.limitations.join('、') +
      '。落地时先用小样本验证指标，再决定是否进入更复杂的调参和部署。',
  };
}
