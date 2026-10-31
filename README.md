# Arbiter — X-Bank AI governance diagnostic workbench

**Deloitte Digital Camp 2026 · Team G · Data governance, explainability and quality control for AI-assisted financial analysis**

> **Live demo (GitHub Pages):** <https://kaito-ayano.github.io/arbiter/>
> 双击 `index.html` 亦可在本地运行（图表需联网加载 ECharts CDN）。

## What it is

An interactive governance diagnostic for a fictional commercial bank (**X-Bank**) that uses AI in credit approval and financial-statement analysis. Built directly on the Team G pre-round proposal — *Research on Data Governance, Explainability and Quality Control in AI-assisted Financial Analysis* — it turns a three-pillar governance framework into a working workbench: diagnose → pilot → institutionalise, inside a 90-day route.

> 把初赛方案的“数据治理 · 结果可解释性 · 质量控制”三支柱框架，落成一个可交互的诊断工作台：先诊断家底，再试点机制，最后制度化推广。

## Features (five tabs)

| Tab | Description |
|---|---|
| **Risk profile** | 12 governance risks (3 pillars × 4), each with evidence and a regulatory mapping (SR 11-7 · BCBS 239 · EU AI Act Art.13 · HITL) |
| **Maturity radar** | Six-dimension self-assessment (sliders, 1–5) vs regulatory floor (3) vs strategic goal (4), with gap analysis and priority advice |
| **Governance framework** | Three-layer tree: 3 pillars → 12 mechanisms → deliverables; clicking a leaf links its risk, current maturity and remediation task |
| **Human adjudication** | 8 AI conclusions on financial statements, triaged one by one (adopt / reject / request evidence) with operator, note, local persistence and CSV export |
| **90-day Gantt** | 3 phases · 10 tasks · 3 milestones (custom ECharts gantt), phase cards with deliverables |

## Demonstration beats

1. **Risk profile** — 12 risks, high 5 / medium 5 / low 2, regulatory mapping 12/12;
2. **Radar** — average maturity 1.5; drag “血缘与溯源” or “人工监督” from 1 to 3 and watch the gap analysis reorder;
3. **Framework tree** — click “归因报告自动化” to see risk R05, current maturity and task T05 in one view;
4. **Adjudication** — C4 carries the highest confidence (0.93) but a one-line basis: adjudicate “request evidence” with a note to demonstrate defence against automation bias;
5. **Gantt** — milestones M1 baseline (D30), M2 pilot acceptance (D60), M3 policy publication (D90).

## Data & ethics

All figures are **synthetic** and bundled in [`data.js`](data.js) (no external calls, no real bank data, no personal data). A machine-readable dataset pack lives in [`data/`](data/) — five CSV files (risk register, maturity baseline, AI conclusions, remediation plan, milestones) generated from the same constants, UTF-8 with BOM. The risk register, maturity scores, sample conclusions and the 90-day plan are scripted scenarios for demonstration; every page carries the footer “合成演示数据，非真实数据”. Regulatory mappings cite public frameworks (SR 11-7, BCBS 239, EU AI Act) as *reference anchors only*, not legal advice.

## Run locally

Double-click `index.html`, or serve the folder: `python -m http.server 8000` → `http://localhost:8000/`.

## Stack

HTML + vanilla JavaScript + ECharts 5 (CDN: radar / tree / custom gantt) + Blob-based CSV export; no backend, no build step.

## Deploy to GitHub Pages

Repository **Settings → Pages → Deploy from a branch → `main` / `(root)` → Save**.

## Licence

MIT © 2026 Liu Jixian — see [LICENSE](LICENSE).

---

## 中文摘要

**Arbiter** 是德勤数字化精英挑战赛 Team G 赛道（初赛方案《AI辅助财务分析中的数据治理、结果可解释性与质量控制研究》的落地演示）：面向虚构银行 X-Bank 的信贷审批与财报分析 AI，提供风险画像（12 项治理风险+监管映射）、成熟度自评雷达（6 维滑杆联动缺口分析）、治理框架树（3 支柱×12 机制）、人工裁决通道（8 条 AI 结论逐条留痕，可导出 CSV）与 90 天三阶段甘特。全部数据为脚本化合成，无任何真实数据。

## Русский (кратко)

**Arbiter** — интерактивный стенд корпоративного ИИ-управления (Deloitte Digital Camp 2026, трек G): диагностика рисков, радиус зрелости, дерево механизмов, канал человеческих вердиктов с аудиторским следом и 90-дневный план внедрения. Все данные синтетические.
