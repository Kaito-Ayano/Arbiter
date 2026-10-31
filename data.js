/* data.js — Arbiter 合成演示数据（非真实数据）
 * 评分底稿、风险登记册、AI 结论样例、甘特计划均为脚本化合成，用于 Deloitte Digital Camp 2026 Team G 方案演示。
 */
(function () {
  "use strict";

  const GOV = {
    meta: {
      bank: "X-Bank",
      scope: "信贷审批与财务报表分析 AI（评分卡 + LLM 财报审阅）",
      horizon: "90 天治理路线",
      version: "v1.0"
    },

    /* ---- 风险登记册：12 项（三支柱 × 4） ---- */
    risks: [
      { id: "R01", pillar: "数据治理", name: "训练数据快照与版本管理缺失", level: "高", evidence: "3 月版评分卡重训未留存数据快照，无法复现当时口径", reg: "SR 11-7 §VI" },
      { id: "R02", pillar: "数据治理", name: "指标口径不一致（总行/分行）", level: "中", evidence: "“不良率”在 3 套报表中口径不同，AI 读表存在歧义", reg: "BCBS 239" },
      { id: "R03", pillar: "数据治理", name: "外部数据源接入无准入评审", level: "中", evidence: "工商/征信 API 直连模型，无数据供应商尽调记录", reg: "监管数据准入要求" },
      { id: "R04", pillar: "数据治理", name: "数据质量监控缺位", level: "高", evidence: "空值率 7% 未告警，异常值直接进入模型特征", reg: "BCBS 239" },
      { id: "R05", pillar: "可解释性", name: "评分卡归因报告未自动化", level: "高", evidence: "审批否决无逐因子归因，监管问询需 5 人日整理", reg: "EU AI Act Art.13" },
      { id: "R06", pillar: "可解释性", name: "LLM 财报摘要无依据链标注", level: "高", evidence: "AI 结论无法定位到原始报表科目页码", reg: "EU AI Act Art.13" },
      { id: "R07", pillar: "可解释性", name: "拒贷解释话术不合规", level: "低", evidence: "模板引用内部评分区间，涉嫌泄露模型细节", reg: "消费者权益保护" },
      { id: "R08", pillar: "可解释性", name: "模型卡与版本说明缺失", level: "中", evidence: "现行模型无模型卡，适用边界仅存于邮件", reg: "SR 11-7" },
      { id: "R09", pillar: "质量控制", name: "人工复核比例无制度", level: "高", evidence: "AI 建议直接进审批流，抽样复核率 0%", reg: "人在环（HITL）要求" },
      { id: "R10", pillar: "质量控制", name: "模型性能漂移无监控告警", level: "中", evidence: "上线 8 个月未复检 KS/AUC，行业结构调整未感知", reg: "模型风险管理" },
      { id: "R11", pillar: "质量控制", name: "无极端/对抗场景测试", level: "中", evidence: "未做过行业黑天鹅、财报粉饰对抗样本测试", reg: "模型验证" },
      { id: "R12", pillar: "质量控制", name: "反馈闭环缺失", level: "低", evidence: "审批员驳回案例未回流为训练/规则素材", reg: "持续改进" }
    ],

    /* ---- 成熟度自评底稿：6 维（当前 / 监管底线 / 战略目标） ---- */
    maturity: [
      { dim: "数据质量", cur: 2, floor: 3, goal: 4, tasks: "T01" },
      { dim: "血缘与溯源", cur: 1, floor: 3, goal: 4, tasks: "T04" },
      { dim: "模型可解释性", cur: 2, floor: 3, goal: 4, tasks: "T05" },
      { dim: "人工监督", cur: 1, floor: 3, goal: 4, tasks: "T06" },
      { dim: "制度与留痕", cur: 2, floor: 3, goal: 4, tasks: "T10" },
      { dim: "监控与告警", cur: 1, floor: 3, goal: 4, tasks: "T09" }
    ],

    /* ---- 治理框架树：3 支柱 × 4 机制（叶子挂 风险项 + 甘特任务） ---- */
    framework: {
      name: "AI 治理框架",
      children: [
        {
          name: "数据治理",
          children: [
            { name: "快照与版本管理", risk: "R01", task: "T04" },
            { name: "指标口径字典", risk: "R02", task: "T03" },
            { name: "外部数据准入", risk: "R03", task: "T03" },
            { name: "数据质量监控", risk: "R04", task: "T09" }
          ]
        },
        {
          name: "结果可解释性",
          children: [
            { name: "归因报告自动化", risk: "R05", task: "T05" },
            { name: "LLM 依据链标注", risk: "R06", task: "T05" },
            { name: "拒贷解释合规", risk: "R07", task: "T08" },
            { name: "模型卡管理", risk: "R08", task: "T10" }
          ]
        },
        {
          name: "质量控制",
          children: [
            { name: "人工复核制度", risk: "R09", task: "T06" },
            { name: "性能漂移监控", risk: "R10", task: "T09" },
            { name: "极端场景测试", risk: "R11", task: "T07" },
            { name: "反馈闭环回流", risk: "R12", task: "T08" }
          ]
        }
      ]
    },

    /* ---- AI 财报结论样例：8 条（C4 = 自动化偏见演示点） ---- */
    conclusions: [
      { id: "C1", stmt: "B 公司流动比率 1.8，高于行业 75 分位，建议授信额度上调 20%", conf: 0.92, basis: ["2026Q2 资产负债表", "行业分位表 v3"], rec: "采纳并提交授信会" },
      { id: "C2", stmt: "E 公司存货周转天数由 96→74 天，营运效率改善", conf: 0.87, basis: ["2026Q1/Q2 利润表", "存货明细账"], rec: "采纳" },
      { id: "C3", stmt: "F 公司毛利率连续两季下滑 3.2pct，关注类建议维持", conf: 0.74, basis: ["2026H1 利润表"], rec: "人工复核行业周期因素" },
      { id: "C4", stmt: "D 公司经营现金流 +38%，信用风险下调一档", conf: 0.93, basis: ["2026H1 现金流量表"], rec: "采纳", defect: "依据链缺失季度分解与一次性损益剔除——高置信但证据不足（自动化偏见演示点）" },
      { id: "C5", stmt: "G 公司应收账款增速为营收 2.3 倍，回款质量存疑", conf: 0.81, basis: ["2026Q2 资产负债表", "应收账龄表"], rec: "采纳，列入季度复检" },
      { id: "C6", stmt: "H 公司存在未披露关联交易迹象", conf: 0.68, basis: ["股权结构图谱", "公告文本"], rec: "低置信，转人工核查" },
      { id: "C7", stmt: "I 公司存贷双高（货币资金 12 亿 / 短期借款 9 亿），提示资金占用风险", conf: 0.77, basis: ["2026Q2 资产负债表"], rec: "人工复核利息收入匹配性" },
      { id: "C8", stmt: "J 公司对外担保余额占净资产 47%，担保链风险高", conf: 0.85, basis: ["2026 年报附注", "担保合同台账"], rec: "采纳，下调一档" }
    ],

    /* ---- 90 天甘特：3 阶段 / 10 任务 / 3 里程碑（单位：天） ---- */
    gantt: {
      phases: [
        { name: "P1 诊断", start: 0, end: 30, color: "#6f9fd8" },
        { name: "P2 试点", start: 31, end: 60, color: "#86bc25" },
        { name: "P3 推广", start: 61, end: 90, color: "#d99b6c" }
      ],
      tasks: [
        { name: "T01 风险登记册", phase: 0, start: 0, end: 14 },
        { name: "T02 基线成熟度评估", phase: 0, start: 7, end: 21 },
        { name: "T03 监管映射矩阵", phase: 0, start: 10, end: 30 },
        { name: "T04 数据快照与血缘试点", phase: 1, start: 31, end: 52 },
        { name: "T05 归因报告自动化", phase: 1, start: 31, end: 50 },
        { name: "T06 人工复核通道上线", phase: 1, start: 40, end: 55 },
        { name: "T07 双周治理例会+对抗测试", phase: 1, start: 31, end: 60 },
        { name: "T08 全量推广与培训", phase: 2, start: 61, end: 80 },
        { name: "T09 监控告警上线", phase: 2, start: 61, end: 82 },
        { name: "T10 制度发布与内审", phase: 2, start: 75, end: 90 }
      ],
      milestones: [
        { name: "M1 基线报告", day: 30 },
        { name: "M2 试点验收", day: 60 },
        { name: "M3 制度发布", day: 90 }
      ]
    }
  };

  window.GOV_DATA = GOV;
})();