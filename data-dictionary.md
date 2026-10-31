# Data dictionary / 数据字典 — GovLens synthetic scenario v1.0

> Synthetic demonstration scenario · 合成演示场景 · **no real data / 不含真实数据** · embedded in [`data.js`](data.js) · machine-readable pack in [`data/`](data/)

## Machine-readable CSV pack 机读数据包（`data/`）

| File | Rows | Content |
|---|---|---|
| `risk_register.csv` | 12 | 风险登记册：id/支柱/名称/等级/证据/监管映射 |
| `maturity_baseline.csv` | 6 | 成熟度底稿：维度/当前/底线/目标/联动任务 |
| `ai_conclusions.csv` | 8 | AI 财报结论样例：含 C4 依据链缺陷标注 |
| `remediation_plan.csv` | 10 | 整改计划：阶段/任务/起止天 |
| `milestones.csv` | 3 | 里程碑：M1 D30 / M2 D60 / M3 D90 |

All CSV files are UTF-8 with BOM (Excel-friendly) and are generated from the same constants as `data.js` — the demo pages read `data.js`, analysts read `data/`. / 演示页面读取 `data.js`，分析人员读取 `data/`，两者同源。

## Risk register 风险登记册（12 items）

| Field | Description (EN) | 说明 |
|---|---|---|
| id | R01–R12 | 风险编号 |
| pillar | Data governance / Explainability / Quality control（各 4 项） | 三支柱各 4 项 |
| level | High ×5 / Medium ×5 / Low ×2 | 高/中/低 |
| evidence | One-line audit evidence | 一句话审计证据 |
| reg | SR 11-7 · BCBS 239 · EU AI Act Art.13 · HITL · 消保 · 模型验证 | 监管/框架映射（仅作参考锚点） |

## Maturity baseline 成熟度底稿（6 dimensions）

| Field | Description | 说明 |
|---|---|---|
| dim | Data quality / Lineage & traceability / Explainability / Human oversight / Policy & audit trail / Monitoring & alerting | 数据质量/血缘溯源/可解释性/人工监督/制度留痕/监控告警 |
| cur | 1–5, baseline scenario: 2,1,2,1,2,1 (avg 1.5) | 当前自评（底稿） |
| floor | 3 (regulatory floor) | 监管底线 |
| goal | 4 (strategic goal) | 战略目标 |
| tasks | Linked remediation task id | 联动整改任务 |

## AI conclusions AI 财报结论样例（8 items）

| Field | Description | 说明 |
|---|---|---|
| id / stmt | C1–C8, one-sentence analytical conclusion | 结论 |
| conf | 0.68–0.93 (simulated confidence) | 置信度 |
| basis | 1–2 cited source documents per conclusion | 依据链 |
| rec | AI recommendation | AI 建议 |
| defect | Only C4: high confidence with thin basis — automation-bias demo point | 仅 C4：高置信低证据（演示点） |

## 90-day plan 甘特计划

| Field | Description | 说明 |
|---|---|---|
| phases | P1 Diagnose (D0–30) / P2 Pilot (D31–60) / P3 Institutionalise (D61–90) | 三阶段 |
| tasks | 10 tasks T01–T10 with start/end day and owning phase | 10 任务 |
| milestones | M1 baseline report (D30) / M2 pilot acceptance (D60) / M3 policy publication (D90) | 3 里程碑 |

## Reproduce / 复现

The scenario is deterministic — every number above is a constant in [`data.js`](data.js). Any change to sliders (maturity) or adjudication records is client-side state only (`localStorage`), never written back to the dataset.

## Disclaimer / 免责声明

Synthetic scenario for demonstration only. X-Bank and all companies (B–J) are fictional; regulatory references are public frameworks used as illustrative anchors, not legal advice. / 本场景为合成演示数据：X-Bank 及 B–J 公司均为虚构；监管映射仅作示意锚点，不构成法律意见。
