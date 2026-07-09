(function () {
  'use strict';

  if (window.IntegrityAlert) return;

  var LABEL_RE = /含异常\s*[\/／]\s*缺失/;
  var TRIGGER_SELECTOR = '.integrity-tag, .detail-integrity, .tag-warn, [data-integrity-alert]';
  var ENERGY_LABELS = {
    elec: '电',
    electricity: '电',
    water: '水',
    cooling: '冷量',
    cool: '冷量',
    gas: '燃气'
  };

  var mask;
  var lastTrigger = null;
  var observerScheduled = false;

  function textOf(el) {
    return (el && el.textContent ? el.textContent : '').replace(/\s+/g, '');
  }

  function isIntegrityTrigger(el) {
    if (!el || el.nodeType !== 1) return false;
    if (el.hasAttribute('data-integrity-alert')) return true;
    if (el.matches('.integrity-tag, .detail-integrity') && LABEL_RE.test(textOf(el))) return true;
    if (el.matches('.tag-warn') && LABEL_RE.test(textOf(el))) return true;
    return false;
  }

  function closestTrigger(target) {
    var el = target && target.closest ? target.closest(TRIGGER_SELECTOR) : null;
    return isIntegrityTrigger(el) ? el : null;
  }

  function injectStyles() {
    if (document.getElementById('integrity-alert-shared-styles')) return;
    var style = document.createElement('style');
    style.id = 'integrity-alert-shared-styles';
    style.textContent = [
      '.integrity-alert-trigger{cursor:pointer!important;transition:background .18s,border-color .18s,color .18s,box-shadow .18s!important;}',
      '.integrity-alert-trigger:hover{background:#FFEDD5!important;border-color:#FB923C!important;color:#C2410C!important;}',
      '.integrity-alert-trigger:focus-visible{outline:2px solid rgba(249,115,22,.32);outline-offset:2px;}',
      '.integrity-alert-trigger::after{content:"›";font-weight:800;margin-left:4px;}',
      '.integrity-alert-shared-mask{position:fixed;inset:0;z-index:10080;background:rgba(15,23,42,.42);display:flex;align-items:center;justify-content:center;padding:18px;}',
      '.integrity-alert-shared-mask[hidden]{display:none!important;}',
      '.integrity-alert-shared-mask .settings-panel{width:min(660px,calc(100vw - 48px));max-height:82vh;background:#fff;border-radius:8px;box-shadow:0 20px 60px rgba(15,23,42,.22);display:flex;flex-direction:column;overflow:hidden;font-family:"Microsoft YaHei",Arial,sans-serif;color:#001833;}',
      '.integrity-alert-shared-mask .settings-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:14px 18px;border-bottom:1px solid #E5EAF0;background:#fff;}',
      '.integrity-alert-shared-mask .settings-title{font-size:16px;font-weight:800;color:#001833;}',
      '.integrity-alert-shared-mask .settings-sub{font-size:12px;color:#8B98A8;margin-top:4px;line-height:1.6;}',
      '.integrity-alert-shared-mask .settings-close{width:28px;height:28px;border:0;border-radius:6px;background:#fff;color:#8B98A8;font-size:20px;line-height:1;cursor:pointer;}',
      '.integrity-alert-shared-mask .settings-close:hover{background:#F1F5F9;color:#001833;}',
      '.integrity-alert-shared-mask .settings-body{flex:1;overflow-y:auto;padding:8px 18px 16px;}',
      '.integrity-alert-shared-mask .meter-summary{display:flex;flex-wrap:wrap;gap:8px 22px;padding:10px 12px;margin-bottom:12px;background:#FFF7ED;border:1px solid #FDBA74;border-radius:10px;font-size:12px;color:#9A3412;}',
      '.integrity-alert-shared-mask .meter-summary b{font-weight:800;}',
      '.integrity-alert-shared-mask .meter-table{width:100%;border-collapse:collapse;font-size:12px;}',
      '.integrity-alert-shared-mask .meter-table th{text-align:left;font-weight:600;color:#8B98A8;padding:7px 8px;border-bottom:1px solid #E5EAF0;font-size:11px;white-space:nowrap;}',
      '.integrity-alert-shared-mask .meter-table td{padding:9px 8px;border-bottom:1px solid #F1F5F9;color:#667485;}',
      '.integrity-alert-shared-mask .meter-table th:last-child,.integrity-alert-shared-mask .meter-table td:last-child{text-align:right;white-space:nowrap;}',
      '.integrity-alert-shared-mask .meter-table tr:last-child td{border-bottom:none;}',
      '.integrity-alert-shared-mask .meter-table tbody tr:hover{background:#F4F9FF;}',
      '.integrity-alert-shared-mask .meter-name{font-weight:700;color:#001833;white-space:nowrap;}',
      '.integrity-alert-shared-mask .meter-loc{color:#8B98A8;font-size:11px;}',
      '.integrity-alert-shared-mask .meter-num-warn{color:#C2410C;font-weight:700;}',
      '.integrity-alert-shared-mask .meter-state{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;padding:1px 8px;border-radius:999px;white-space:nowrap;}',
      '.integrity-alert-shared-mask .meter-state.warn{color:#C2410C;background:#FFF7ED;border:1px solid #FDBA74;}',
      '.integrity-alert-shared-mask .meter-state.ok{color:#047857;background:#ECFDF5;border:1px solid #A7F3D0;}',
      '.integrity-alert-shared-mask .meter-action{display:inline-flex;align-items:center;justify-content:center;min-width:44px;height:24px;padding:0 10px;border-radius:999px;border:1px solid #BFDBFE;background:#EFF6FF;color:#1D4ED8;font-size:12px;font-weight:700;text-decoration:none;white-space:nowrap;transition:background .18s,border-color .18s,color .18s;}',
      '.integrity-alert-shared-mask .meter-action:hover{background:#DBEAFE;border-color:#93C5FD;color:#1E40AF;}',
      '.integrity-alert-shared-mask .meter-action:focus-visible{outline:2px solid rgba(0,122,255,.28);outline-offset:2px;}',
      '.integrity-alert-shared-mask .meter-foot{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:12px;flex-wrap:wrap;}',
      '.integrity-alert-shared-mask .integ-note{font-size:11px;color:#8B98A8;}'
    ].join('');
    document.head.appendChild(style);
  }

  function ensureDialog() {
    if (mask) return mask;
    mask = document.createElement('div');
    mask.className = 'settings-mask integrity-alert-shared-mask';
    mask.hidden = true;
    mask.innerHTML =
      '<div class="settings-panel meter-panel" role="dialog" aria-modal="true" aria-label="数据完整性表具清单">' +
        '<div class="settings-head">' +
          '<div><div class="settings-title" id="sharedMeterTitle">数据完整性</div><div class="settings-sub" id="sharedMeterSub">—</div></div>' +
          '<button type="button" class="settings-close" id="sharedMeterClose" aria-label="关闭">×</button>' +
        '</div>' +
        '<div class="settings-body">' +
          '<div class="meter-summary" id="sharedMeterSummary"></div>' +
          '<table class="meter-table">' +
            '<thead><tr><th>计量表具</th><th>安装位置</th><th>缺失槽</th><th>坏值槽</th><th>人工修正</th><th>状态</th><th>操作</th></tr></thead>' +
            '<tbody id="sharedMeterRows"></tbody>' +
          '</table>' +
          '<div class="meter-foot"><span class="integ-note">完整率 = 有效半小时槽 ÷ 应有半小时槽 × 100%；坏值/缺失不参与聚合，汇总结果可能偏低</span></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(mask);
    mask.addEventListener('click', function (event) {
      if (event.target === mask || event.target.closest('#sharedMeterClose')) closeDialog();
    });
    document.addEventListener('keydown', function (event) {
      if (!mask.hidden && event.key === 'Escape') closeDialog();
    });
    return mask;
  }

  function readNumber(el, name, fallback) {
    var value = el.getAttribute('data-' + name);
    if (value == null || value === '') return fallback;
    var n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function firstText(selectors, scope) {
    for (var i = 0; i < selectors.length; i += 1) {
      var el = (scope || document).querySelector(selectors[i]);
      if (el && el.textContent && el.textContent.trim()) return el.textContent.trim();
    }
    return '';
  }

  function valueText(selector) {
    var el = document.querySelector(selector);
    return el && el.value ? el.value : '';
  }

  function selectedText(selector) {
    var el = document.querySelector(selector);
    if (!el || !el.selectedOptions || !el.selectedOptions.length) return '';
    return el.selectedOptions[0].textContent.trim();
  }

  function resolveContext(trigger) {
    var row = trigger.closest('tr');
    var rowName = row && row.cells && row.cells.length ? row.cells[0].textContent.trim().replace(/\s+/g, ' ') : '';
    var card = trigger.closest('.energy-item, .eff-tile, .dash-card, .section-card, .page-card, .summary-card');
    var cardName = firstText(['.energy-name', '.eff-tile-name', '.card-title', '.section-title', '.summary-label'], card);
    var energyKey = trigger.getAttribute('data-energy') || trigger.getAttribute('data-integrity-energy') || '';
    var energy = trigger.getAttribute('data-integrity-label') ||
      ENERGY_LABELS[energyKey] ||
      energyKey ||
      selectedText('#cmpEnergy') ||
      selectedText('#filterEnergy') ||
      selectedText('#efEnergy') ||
      selectedText('#energyType') ||
      firstText(['#energyTabs button.active', '.dash-subbar-tabs[aria-label="能源类型"] button.active']);
    var objectName = trigger.getAttribute('data-integrity-object') || rowName || cardName || document.title || '当前对象';
    var period = trigger.getAttribute('data-integrity-period') ||
      firstText(['#datePillLabel', '.dash-date-pill span', '.date-pill span', '.period-label']) ||
      valueText('input[type="month"]') ||
      valueText('input[type="date"]') ||
      '当前统计区间';
    return {
      objectName: objectName,
      energy: energy,
      period: period,
      missing: readNumber(trigger, 'integrity-missing', 6),
      bad: readNumber(trigger, 'integrity-bad', 2),
      fixed: readNumber(trigger, 'integrity-fixed', 0)
    };
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function detailUrl(ctx, meterName) {
    var url = '能耗管理-表具明细.html?object=' + encodeURIComponent(ctx.objectName) +
      '&range=' + encodeURIComponent(ctx.period);
    if (ctx.energy) url += '&energy=' + encodeURIComponent(ctx.energy);
    if (meterName) url += '&meter=' + encodeURIComponent(meterName);
    return url;
  }

  function demoRows(ctx) {
    var base = ctx.energy ? ctx.energy : '能耗';
    return [
      { name: ctx.objectName + ' · ' + base + '总表', loc: '对象汇总节点', missing: ctx.missing, bad: ctx.bad, fixed: ctx.fixed },
      { name: ctx.objectName + ' · 支路表具', loc: '叶子计量点', missing: Math.max(0, Math.floor(ctx.missing / 2)), bad: Math.max(0, ctx.bad - 1), fixed: 0 }
    ];
  }

  function openFallbackDialog(trigger) {
    injectStyles();
    ensureDialog();
    lastTrigger = trigger;
    var ctx = resolveContext(trigger);
    var label = ctx.energy || '当前能源';
    document.getElementById('sharedMeterTitle').textContent = '数据完整性 · ' + label;
    document.getElementById('sharedMeterSub').textContent =
      '对象「' + ctx.objectName + '」 · 统计区间 ' + ctx.period + ' · 沿计量拓扑覆盖 ' + demoRows(ctx).length + ' 块叶子表具';
    document.getElementById('sharedMeterSummary').innerHTML =
      '<span>完整率 <b>' + (ctx.missing || ctx.bad ? '96.8%' : '100%') + '</b></span>' +
      '<span>缺失槽 <b>' + ctx.missing + '</b></span>' +
      '<span>坏值槽 <b>' + ctx.bad + '</b></span>' +
      '<span>人工修正 <b>' + ctx.fixed + '</b></span>';
    document.getElementById('sharedMeterRows').innerHTML = demoRows(ctx).map(function (row) {
      var warn = row.missing > 0 || row.bad > 0;
      return '<tr>' +
        '<td class="meter-name">' + escapeHtml(row.name) + '</td>' +
        '<td class="meter-loc">' + escapeHtml(row.loc) + '</td>' +
        '<td>' + (row.missing > 0 ? '<span class="meter-num-warn">' + row.missing + '</span>' : row.missing) + '</td>' +
        '<td>' + (row.bad > 0 ? '<span class="meter-num-warn">' + row.bad + '</span>' : row.bad) + '</td>' +
        '<td>' + row.fixed + '</td>' +
        '<td><span class="meter-state ' + (warn ? 'warn' : 'ok') + '">' + (warn ? '异常' : '正常') + '</span></td>' +
        '<td><a class="meter-action" href="' + detailUrl(ctx, row.name) + '" title="查看「' + escapeHtml(row.name) + '」表具能耗明细">查看</a></td>' +
      '</tr>';
    }).join('');
    mask.hidden = false;
    var closeBtn = document.getElementById('sharedMeterClose');
    if (closeBtn) closeBtn.focus();
  }

  function closeDialog() {
    if (!mask) return;
    mask.hidden = true;
    if (lastTrigger && typeof lastTrigger.focus === 'function') lastTrigger.focus();
  }

  function enhanceTrigger(el) {
    if (!isIntegrityTrigger(el)) return;
    if (el.getAttribute('data-integrity-native') === 'true') return;
    el.classList.add('integrity-alert-trigger');
    if (el.tagName === 'BUTTON') {
      if (!el.getAttribute('type')) el.setAttribute('type', 'button');
    } else if (el.tagName !== 'A') {
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
    }
    el.setAttribute('aria-label', '查看数据完整性表具清单');
    if (el.getAttribute('title') && !el.getAttribute('data-integrity-note')) {
      el.setAttribute('data-integrity-note', el.getAttribute('title'));
      el.removeAttribute('title');
    }
  }

  function enhanceAll(root) {
    injectStyles();
    (root || document).querySelectorAll(TRIGGER_SELECTOR).forEach(enhanceTrigger);
  }

  function scheduleEnhance() {
    if (observerScheduled) return;
    observerScheduled = true;
    window.requestAnimationFrame(function () {
      observerScheduled = false;
      enhanceAll(document);
    });
  }

  function open(trigger) {
    openFallbackDialog(trigger);
  }

  function init() {
    enhanceAll(document);
    document.addEventListener('click', function (event) {
      var trigger = closestTrigger(event.target);
      if (!trigger) return;
      if (trigger.getAttribute('data-integrity-native') === 'true') return;
      event.preventDefault();
      event.stopPropagation();
      open(trigger);
    }, true);
    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      var trigger = closestTrigger(event.target);
      if (!trigger) return;
      if (trigger.getAttribute('data-integrity-native') === 'true') return;
      event.preventDefault();
      open(trigger);
    });
    if (window.MutationObserver) {
      new MutationObserver(scheduleEnhance).observe(document.body, { childList: true, subtree: true });
    }
  }

  window.IntegrityAlert = {
    enhance: enhanceAll,
    open: open,
    close: closeDialog
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
