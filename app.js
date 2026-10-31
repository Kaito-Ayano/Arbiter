/* app.js — GovLens 五页签交互：风险画像 / 雷达自评 / 框架树 / 人工裁决 / 甘特 */
(function () {
  "use strict";
  const $ = s => document.querySelector(s);
  const GOV = window.GOV_DATA;

  const state = {
    mat: GOV.maturity.map(m => ({ ...m })),
    verdicts: loadVerdicts(),
    filter: "all"
  };
  const charts = { radar: null, tree: null, gantt: null };
  const TASK_PHASE = {};
  GOV.gantt.tasks.forEach(t => { TASK_PHASE[t.name.split(" ")[0]] = GOV.gantt.phases[t.phase].name; });

  /* ================= 页签 1：风险画像 ================= */
  function renderKpi() {
    const lv = { "高": 0, "中": 0, "低": 0 };
    GOV.risks.forEach(r => lv[r.level]++);
    $("#kpi-risks").textContent = GOV.risks.length;
    $("#kpi-risks-sub").textContent = `高 ${lv["高"]} · 中 ${lv["中"]} · 低 ${lv["低"]}`;
    $("#kpi-reg").textContent = GOV.risks.filter(r => r.reg).length + "/" + GOV.risks.length;
    $("#kpi-mat").textContent = (state.mat.reduce((s, m) => s + m.cur, 0) / state.mat.length).toFixed(1);
    $("#kpi-plan").textContent = "90 天 · 3 阶段";
  }

  function renderRisks() {
    const host = $("#risk-cols");
    const pillars = [...new Set(GOV.risks.map(r => r.pillar))];
    host.innerHTML = "";
    for (const p of pillars) {
      const col = document.createElement("div");
      col.className = "risk-col";
      col.innerHTML = `<h4>${p}<span class="en">${{ "数据治理": "data governance", "可解释性": "explainability", "质量控制": "quality control" }[p] || ""}</span></h4>`;
      GOV.risks.filter(r => r.pillar === p).forEach(r => {
        const div = document.createElement("div");
        div.className = "risk-item lv-" + r.level;
        div.innerHTML =
          `<div class="head"><span class="name">${r.id} ${r.name}</span><span class="tag ${r.level === "高" ? "hit" : r.level === "中" ? "mid" : "low"}">${r.level}</span></div>` +
          `<div class="detail">${r.evidence}<br><span class="reg tag ok">${r.reg}</span></div>`;
        div.addEventListener("click", () => div.classList.toggle("open"));
        col.appendChild(div);
      });
      host.appendChild(col);
    }
  }

  /* ================= 页签 2：雷达自评 ================= */
  function ensureRadar() {
    if (charts.radar || !window.echarts) return;
    charts.radar = echarts.init($("#radarChart"));
  }
  function renderRadar() {
    if (!charts.radar) return;
    charts.radar.setOption({
      legend: { bottom: 0, textStyle: { fontSize: 11 } },
      radar: {
        indicator: state.mat.map(m => ({ name: m.dim, max: 5 })),
        splitNumber: 5, radius: "62%",
        axisName: { color: "#1c2b3a", fontSize: 12 }
      },
      series: [{
        type: "radar",
        data: [
          { value: state.mat.map(m => m.floor), name: "监管底线（3）", lineStyle: { type: "dashed", color: "#e6b450" }, itemStyle: { color: "#e6b450" }, areaStyle: { color: "rgba(230,180,80,.08)" } },
          { value: state.mat.map(m => m.goal), name: "战略目标（4）", lineStyle: { type: "dashed", color: "#9fb0c4" }, itemStyle: { color: "#9fb0c4" } },
          { value: state.mat.map(m => m.cur), name: "当前自评", lineStyle: { width: 3, color: "#86bc25" }, itemStyle: { color: "#86bc25" }, areaStyle: { color: "rgba(134,188,37,.18)" } }
        ]
      }]
    });
  }
  function renderSliders() {
    const host = $("#mat-sliders");
    host.innerHTML = "";
    state.mat.forEach((m, i) => {
      const row = document.createElement("div");
      row.className = "mat-row";
      row.innerHTML = `<span>${m.dim}</span><input type="range" min="1" max="5" step="1" value="${m.cur}"><span class="cur">${m.cur}</span>`;
      row.querySelector("input").addEventListener("input", e => {
        m.cur = +e.target.value;
        row.querySelector(".cur").textContent = m.cur;
        $("#kpi-mat").textContent = (state.mat.reduce((s, x) => s + x.cur, 0) / state.mat.length).toFixed(1);
        renderRadar();
        renderGap();
      });
      host.appendChild(row);
    });
  }
  function resetMaturity() {
    state.mat = GOV.maturity.map(m => ({ ...m }));
    renderSliders(); renderRadar(); renderGap();
    $("#kpi-mat").textContent = (state.mat.reduce((s, m) => s + m.cur, 0) / state.mat.length).toFixed(1);
  }
  function renderGap() {
    const gaps = state.mat.map(m => ({
      dim: m.dim, gf: Math.max(0, m.floor - m.cur), gg: m.goal - m.cur, tasks: m.tasks
    })).sort((a, b) => b.gf - a.gf || b.gg - a.gg);
    $("#gap-list").innerHTML = gaps.map(g =>
      `<div class="gap-item"><span><b>${g.dim}</b>　${g.tasks}</span><span>距底线 <b>${g.gf}</b> 级 · 距目标 ${g.gg} 级</span></div>`).join("");
    const top = gaps.filter(g => g.gf > 0).slice(0, 2);
    $("#gap-advice").innerHTML = top.length
      ? "优先补齐：" + top.map(g => `<b>${g.dim}</b>（距监管底线差 ${g.gf} 级 → ${TASK_PHASE[g.tasks] || "P2"} 任务 ${g.tasks}）`).join("；") +
        "。调节滑杆可模拟整改后态势——全部达标底线 3 时，风险画像中的高风险项将具备整改条件。"
      : "六维均达监管底线 3。下一步向战略目标 4 迈进：血缘溯源与监控告警自动化（P3 任务 T08–T10）。";
  }

  /* ================= 页签 3：治理框架树 ================= */
  function ensureTree() {
    if (charts.tree || !window.echarts) return;
    charts.tree = echarts.init($("#treeChart"));
    charts.tree.setOption({
      tooltip: { show: false },
      series: [{
        type: "tree", data: [GOV.framework], orient: "LR",
        left: "6%", right: "26%", top: "4%", bottom: "4%",
        symbol: "circle", symbolSize: 12,
        lineStyle: { color: "#b9c6d4" },
        label: { position: "top", fontSize: 12, color: "#16324f", fontWeight: 600 },
        leaves: { label: { position: "right", fontSize: 11, color: "#3c4c5c", fontWeight: 400 } },
        expandAndCollapse: false
      }]
    });
    charts.tree.on("click", p => {
      if (!p.data || !p.data.risk) return;
      const risk = GOV.risks.find(r => r.id === p.data.risk);
      const task = GOV.gantt.tasks.find(t => t.name.split(" ")[0] === p.data.task);
      const mat = state.mat.find(m => m.tasks === p.data.task);
      $("#tree-side").innerHTML =
        `<div class="mech">${p.data.name}</div>` +
        `<dl class="kv">
          <dt>对应风险</dt><dd>${risk ? risk.id + " " + risk.name + ` <span class="tag hit">${risk.level}</span>` : "-"}</dd>
          <dt>现状证据</dt><dd>${risk ? risk.evidence : "-"}</dd>
          <dt>相关成熟度</dt><dd>${mat ? mat.dim + " 当前 " + mat.cur + " 级（底线 " + mat.floor + "）" : "-"}</dd>
          <dt>整改任务</dt><dd>${task ? task.name + "（" + TASK_PHASE[p.data.task] + "，Day " + task.start + "–" + task.end + "）" : "-"}</dd>
        </dl>`;
    });
  }

  /* ================= 页签 4：人工裁决通道 ================= */
  const V_KEY = "govlens_verdicts_v1", OP_KEY = "govlens_operator_v1";
  function loadVerdicts() {
    try { return JSON.parse(localStorage.getItem(V_KEY) || "{}"); } catch (e) { return {}; }
  }
  function saveVerdicts() { try { localStorage.setItem(V_KEY, JSON.stringify(state.verdicts)); } catch (e) {} }
  function globalOp() { return localStorage.getItem(OP_KEY) || "risk-manager"; }
  function escHtml(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function updateCounts() {
    const c = { all: GOV.conclusions.length, pending: 0, adopted: 0, rejected: 0, evidence: 0 };
    GOV.conclusions.forEach(x => { const s = (state.verdicts[x.id] || {}).status || "pending"; c[s]++; });
    for (const k of Object.keys(c)) { const el = document.getElementById("vc-" + k); if (el) el.textContent = c[k]; }
  }
  function renderVerdicts() {
    const tb = $("#verdict-body");
    updateCounts();
    const rows = GOV.conclusions.filter(x =>
      state.filter === "all" || ((state.verdicts[x.id] || {}).status || "pending") === state.filter);
    tb.innerHTML = rows.length ? rows.map(x => {
      const r = state.verdicts[x.id] || { status: "pending", operator: "", note: "", ts: "" };
      const sel = s => `value="${s}"` + (r.status === s ? " selected" : "");
      const conf = `<span class="conf-bar">${x.conf.toFixed(2)}</span>`;
      const basis = x.basis.map(b => `<span class="basis">${escHtml(b)}</span>`).join("<br>") + (x.defect ? `<br><span class="tag hit">依据链存疑</span>` : "");
      return `<tr data-id="${x.id}" class="tr-${r.status}">
        <td class="num">${x.id}</td><td>${escHtml(x.stmt)}</td><td class="num">${conf}</td><td>${basis}</td>
        <td style="font-size:12px">${escHtml(x.rec)}</td>
        <td><select><option ${sel("pending")}>待裁决</option><option ${sel("adopted")}>采纳</option><option ${sel("rejected")}>驳回</option><option ${sel("evidence")}>需补充证据</option></select></td>
        <td><input class="r-op" type="text" value="${escHtml(r.operator || globalOp())}"></td>
        <td><input class="r-note2" type="text" value="${escHtml(r.note)}" placeholder="备注（如：缺一次性损益剔除）"></td>
        <td class="num" style="font-size:11px;color:#6b7a8c">${r.ts || "-"}</td>
      </tr>`;
    }).join("") : `<tr><td colspan="9" style="text-align:center;color:#6b7a8c">当前筛选下无记录</td></tr>`;
  }
  function setVerdict(id, patch) {
    const r = state.verdicts[id] || { status: "pending", operator: "", note: "", ts: "" };
    if (patch.status) { r.status = patch.status; if (!r.ts) r.ts = patch.ts || new Date().toLocaleString(); }
    if (patch.operator !== undefined) r.operator = patch.operator;
    if (patch.note !== undefined) r.note = patch.note;
    state.verdicts[id] = r;
    saveVerdicts();
  }
  function exportVerdicts() {
    const esc = s => `"${String(s == null ? "" : s).replace(/"/g, '""')}"`;
    const head = ["id", "ai_statement", "confidence", "basis", "ai_recommend", "verdict", "operator", "note", "reviewed_at"];
    const lines = [head.join(",")];
    for (const x of GOV.conclusions) {
      const r = state.verdicts[x.id] || { status: "pending", operator: "", note: "", ts: "" };
      lines.push([x.id, x.stmt, x.conf.toFixed(2), x.basis.join("; "), x.rec, r.status, r.operator || globalOp(), r.note, r.ts].map(esc).join(","));
    }
    const blob = new Blob(["\ufeff" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "governance_adjudication_log_" + new Date().toISOString().slice(0, 10) + ".csv";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 3000);
  }
  function bindVerdicts() {
    const op = $("#v-operator");
    op.value = globalOp();
    op.addEventListener("change", () => { try { localStorage.setItem(OP_KEY, op.value.trim() || "risk-manager"); } catch (e) {} });
    $("#btn-export-v").addEventListener("click", exportVerdicts);
    $("#btn-clear-v").addEventListener("click", () => {
      if (confirm("确定清空全部裁决记录？")) { state.verdicts = {}; saveVerdicts(); renderVerdicts(); }
    });
    $("#v-filters").addEventListener("click", e => {
      const btn = e.target.closest(".btn-f");
      if (!btn) return;
      state.filter = btn.dataset.f;
      document.querySelectorAll("#v-filters .btn-f").forEach(b => b.classList.toggle("active", b === btn));
      renderVerdicts();
    });
    $("#verdict-body").addEventListener("change", e => {
      const tr = e.target.closest("tr[data-id]");
      if (!tr || !e.target.matches("select")) return;
      setVerdict(tr.dataset.id, { status: e.target.value, ts: new Date().toLocaleString() });
      renderVerdicts();
    });
    $("#verdict-body").addEventListener("input", e => {
      const tr = e.target.closest("tr[data-id]");
      if (!tr) return;
      const patch = {};
      if (e.target.classList.contains("r-op")) patch.operator = e.target.value;
      if (e.target.classList.contains("r-note2")) patch.note = e.target.value;
      if (Object.keys(patch).length) setVerdict(tr.dataset.id, patch);
    });
  }

  /* ================= 页签 5：甘特 ================= */
  function ensureGantt() {
    if (charts.gantt || !window.echarts) return;
    const tasks = GOV.gantt.tasks;
    const names = tasks.map(t => t.name);
    const idx = new Map(names.map((n, i) => [n, i]));
    const milestoneLines = GOV.gantt.milestones.map(m => ({
      xAxis: m.day,
      lineStyle: { type: "dashed", color: "#c0392b" },
      label: { formatter: m.name + " D" + m.day, fontSize: 10, color: "#c0392b" }
    }));
    charts.gantt = echarts.init($("#ganttChart"));
    charts.gantt.setOption({
      tooltip: {
        formatter: p => {
          if (p.componentSubtype === "custom") {
            const t = tasks[p.value[0]];
            return t.name + `<br>` + GOV.gantt.phases[t.phase].name + ` · Day ` + t.start + "–" + t.end;
          }
          return p.name;
        }
      },
      grid: { left: 170, right: 40, top: 30, bottom: 40 },
      xAxis: { type: "value", min: 0, max: 90, name: "天", splitLine: { show: true, lineStyle: { color: "#eef1f6" } } },
      yAxis: { type: "category", data: names, inverse: true, axisLabel: { fontSize: 11 } },
      series: [
        {
          type: "custom",
          renderItem: (params, api) => {
            const cat = api.value(0);
            const start = api.coord([api.value(1), cat]);
            const end = api.coord([api.value(2), cat]);
            const h = api.size([0, 1])[1] * 0.45;
            return {
              type: "rect",
              shape: { x: start[0], y: start[1] - h / 2, width: Math.max(end[0] - start[0], 2), height: h, r: 4 },
              style: { fill: GOV.gantt.phases[api.value(3)].color }
            };
          },
          data: tasks.map((t, i) => ({ value: [idx.get(t.name), t.start, t.end, t.phase, t.name], name: t.name })),
          encode: { x: [1, 2], y: [0] },
          markLine: { symbol: "none", silent: true, data: milestoneLines, label: { position: "insideEndTop" } }
        }
      ]
    });
    $("#gantt-hint").textContent = `${tasks.length} 任务 · ${GOV.gantt.milestones.length} 里程碑 · 3 阶段`;
    const deliver = [
      ["P1 诊断（Day 0–30）", "摸清家底：风险登记册、基线成熟度评估、监管映射矩阵；交付 M1 基线报告（D30）。"],
      ["P2 试点（Day 31–60）", "高优机制落地：数据快照与血缘、归因报告自动化、人工复核通道；双周治理例会+对抗测试；交付 M2 试点验收（D60）。"],
      ["P3 推广（Day 61–90）", "制度化：全量推广与培训、监控告警上线、制度发布与内审；交付 M3 制度发布（D90）。"]
    ];
    const colors = GOV.gantt.phases.map(p => p.color);
    $("#phase-cards").innerHTML = deliver.map((d, i) =>
      `<div class="phase-card" style="border-top-color:${colors[i]}"><h4>${d[0]}</h4><p>${d[1]}</p></div>`).join("");
  }

  /* ================= 页签与初始化 ================= */
  function bindTabs() {
    $("#nav").addEventListener("click", e => {
      const btn = e.target.closest("button[data-page]");
      if (!btn) return;
      document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
      $("#page-" + btn.dataset.page).classList.add("active");
      document.querySelectorAll("#nav button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      if (btn.dataset.page === "radar") { ensureRadar(); renderRadar(); }
      if (btn.dataset.page === "framework") ensureTree();
      if (btn.dataset.page === "gantt") ensureGantt();
      Object.values(charts).forEach(c => c && c.resize());
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderKpi();
    renderRisks();
    renderSliders();
    renderGap();
    renderVerdicts();
    bindVerdicts();
    $("#btn-reset-mat").addEventListener("click", resetMaturity);
    bindTabs();
    window.addEventListener("resize", () => Object.values(charts).forEach(c => c && c.resize()));
  });
})();