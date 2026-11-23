/* 冷站配置四步主线（内网可用，无依赖）：步骤定义、步骤地址、步骤条、页头标签、底栏样式。
 * 四步：1 系统信息 · 2 系统拓扑（分组、设备关联、群控系统、供水关系）· 3 属性配置（按物模型类型配置设备和分组属性）· 4 测点表达式。校验与预览不在主线内：列表和第 1–4 步底栏最左侧「校验与预览 ↗」都在浏览器新标签页打开（VERIFY 页，同一配置复用同一个标签页）。
 * 规则：每步可保存，保存即生效（寻优读已保存配置）；配置首次保存后，步骤条任意一步都可直接点进；
 * 首次保存前只能停留在第 1 步。离开当前步（上一步 / 下一步 / 点步骤条）时先自动保存本步修改，保存失败则留在本步。
 * API（挂在 window.ColdStationFlow）：
 *   STEPS、LIST、VERIFY
 *   url(step,{id,mode,back,extra})->string            步骤地址（mode：edit / view；新建首次保存前不带 id）
 *   verifyUrl(id,{tab,back})->string                   校验与预览页地址（tab：preview 直接打开组态预览）
 *   stepper({current,id,store,readonly})->html          步骤条；当前步高亮，首次保存后其余步骤可点
 *   bind(root,onGo(step))                               步骤条点击，onGo 负责先保存再跳转
 *   title(store,id,readonly)->'新建冷站配置'|'编辑冷站配置'|'查看冷站配置'
 *   savedMessage(store,id)->string                      保存成功提示文案
 *   verifyTarget(id)->string / openVerify(id)           校验与预览标签页名称（coldStationVerify-<id>）/ 在该标签页打开
 *   mountVerify(footer,{store,id,readonly,beforeOpen(go)}) 第 1–4 步底栏最左侧加「校验与预览 ↗」：beforeOpen 里先保存本步，成功后调 go()
 * 底栏统一用 <footer class="csf-footer">，按钮顺序：返回列表 · 上一步 · 保存 · 下一步：下一步名称（主按钮在最右）；第 4 步最后为「完成」，回列表。
 */
(function (global) {
  'use strict';
  var STEPS = [
    { n: 1, name: '系统信息', file: '冷站配置-创建.html' },
    { n: 2, name: '系统拓扑', file: '冷站配置-创建-步骤2.html' },
    { n: 3, name: '属性配置', file: '冷站配置-创建-步骤3.html' },
    { n: 4, name: '测点表达式', file: '冷站配置-测点表达式.html' }
  ];
  var LIST = '冷站配置-列表.html', VERIFY = '冷站配置-配置校验.html';

  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function url(step, opts) {
    opts = opts || {};
    var s = STEPS[Math.max(1, Math.min(STEPS.length, Number(step) || 1)) - 1], q = new URLSearchParams();
    if (opts.id) q.set('id', opts.id);
    if (opts.mode) q.set('mode', opts.mode);
    if (opts.back) q.set('back', opts.back);
    Object.keys(opts.extra || {}).forEach(function (k) { var v = opts.extra[k]; if (v != null && v !== '') q.set(k, v); });
    var qs = q.toString();
    return s.file + (qs ? '?' + qs : '');
  }

  function verifyUrl(id, opts) {
    opts = opts || {};
    var q = new URLSearchParams();
    if (id) q.set('id', id);
    if (opts.tab) q.set('tab', opts.tab);
    if (opts.back) q.set('back', opts.back);
    var qs = q.toString();
    return VERIFY + (qs ? '?' + qs : '');
  }

  // 校验与预览：在浏览器新标签页打开，同一配置复用同一个标签页；页内按已保存配置执行，原页面保存后自动重新校验。
  function verifyTarget(id) { return 'coldStationVerify-' + id; }
  function openVerify(id) { if (!id) return null; var w = global.open(verifyUrl(id), verifyTarget(id)); if (w && w.focus) w.focus(); return w; }
  function mountVerify(footer, o) {
    o = o || {};
    if (!footer || footer.querySelector('[data-flow-verify]')) return;
    var opt = !o.readonly && o.store && typeof o.id === 'string' && o.store.isOptimizing(o.id);
    var tip = o.readonly ? '在新标签页打开校验与预览（按已保存配置）' : '先保存本步' + (opt ? '（保存即生效）' : '') + '，再在新标签页打开校验与预览';
    footer.insertAdjacentHTML('afterbegin', '<button type="button" class="btn csf-verify" data-flow-verify title="' + esc(tip) + '">校验与预览 <span aria-hidden="true">↗</span></button>');
    footer.querySelector('[data-flow-verify]').addEventListener('click', function () {
      var go = function () { var id = typeof o.id === 'function' ? o.id() : o.id; openVerify(id); };
      if (o.readonly || !o.beforeOpen) go(); else o.beforeOpen(go);
    });
  }

  function exists(store, id) { return !!(id && store && store.getEffective(id)); }

  function stepper(o) {
    var store = o.store, id = o.id, current = Number(o.current), has = exists(store, id);
    var html = STEPS.map(function (s, i) {
      var isCur = s.n === current, can = !isCur && has;
      var cls = 'csf-step' + (isCur ? ' is-current' : '');
      var tip = isCur ? '当前步骤' : can ? '进入「' + s.name + '」' + (o.readonly ? '' : '，先保存本步修改') : '先保存系统信息后可进入';
      var line = i ? '<span class="csf-line" aria-hidden="true"></span>' : '';
      return line + '<button type="button" class="' + cls + '" data-flow-step="' + s.n + '"' + (isCur ? ' aria-current="step"' : '') + (!isCur && !can ? ' disabled' : '') + ' title="' + esc(tip) + '">'
        + '<span class="csf-icon">' + s.n + '</span><span class="csf-name">' + esc(s.name) + '</span></button>';
    }).join('');
    return '<nav class="csf-steps" aria-label="冷站配置步骤">' + html + '</nav>';
  }

  function bind(root, onGo) {
    if (!root) return;
    root.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-flow-step]') : null;
      if (!b || b.disabled || b.classList.contains('is-current')) return;
      onGo(Number(b.getAttribute('data-flow-step')));
    });
  }

  function title(store, id, readonly) {
    if (readonly) return '查看冷站配置';
    return exists(store, id) ? '编辑冷站配置' : '新建冷站配置';
  }


  function savedMessage(store, id) {
    return store && id && store.isOptimizing(id) ? '已保存，下一轮寻优按新配置执行' : '已保存';
  }


  var CSS = [
    '.csf-steps{display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:6px;padding:18px 12px}',
    '.csf-step{display:inline-flex;align-items:center;gap:8px;padding:5px 10px;border:0;border-radius:8px;background:none;font:inherit;font-size:13px;color:#475569;cursor:pointer;transition:background .2s,color .2s}',
    '.csf-step:hover:not(:disabled):not(.is-current){background:#EEF4FF;color:#1E40AF}',
    '.csf-step:focus-visible{outline:2px solid #1E40AF;outline-offset:2px}',
    '.csf-step:disabled{cursor:not-allowed;opacity:.55}',
    '.csf-step.is-current{color:#1E40AF;font-weight:600;cursor:default}',
    '.csf-icon{width:24px;height:24px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;font-size:12px;font-weight:700;background:#E2E8F0;color:#64748B;border:1px solid transparent}',
    '.csf-step.is-current .csf-icon{background:#1E40AF;color:#fff}',
    '.csf-name{display:inline-flex;align-items:baseline;gap:6px;white-space:nowrap}',
    '.csf-line{width:28px;height:2px;background:#E2E8F0;flex-shrink:0}',
    '.csf-tag{display:inline-flex;align-items:center;height:22px;padding:0 8px;border-radius:999px;background:#FFF7ED;color:#C2410C;border:1px solid #FED7AA;font-size:12px;font-weight:600;white-space:nowrap}',
    '.csf-footer{position:sticky;bottom:0;z-index:100;margin:0;display:flex;align-items:center;justify-content:flex-end;gap:12px;padding:16px 120px 16px 20px;background:rgba(255,255,255,.97);border-top:1px solid #D8E1EB}',
    '.csf-footer .btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:34px;padding:0 16px;border:1px solid #D8E1EB;border-radius:8px;background:#fff;color:#0F172A;font:inherit;font-size:13px;font-weight:500;white-space:nowrap;cursor:pointer}',
    '.csf-footer .btn:hover:not(:disabled){border-color:#1E40AF;color:#1E40AF}',
    '.csf-footer .btn-primary{background:#1E40AF;border-color:#1E40AF;color:#fff}',
    '.csf-footer .btn-primary:hover:not(:disabled){background:#17358A;border-color:#17358A;color:#fff}',
    '.csf-footer .btn:disabled{opacity:.5;cursor:not-allowed}',
    '.csf-footer [hidden]{display:none!important}',
    '.csf-footer .csf-verify{margin-right:auto}',
    /* 内容较短时底栏贴在主区底部，而不是悬在内容下方 */
    '.main:has(> .csf-footer){display:flex;flex-direction:column}',
    '.main:has(> .csf-footer) > *{flex-shrink:0}',
    '.main > .csf-footer{margin-top:auto}'
  ].join('\n');

  function injectCss() {
    if (!global.document || document.getElementById('csf-style')) return;
    var el = document.createElement('style');
    el.id = 'csf-style';
    el.textContent = CSS;
    (document.head || document.documentElement).appendChild(el);
  }
  injectCss();

  global.ColdStationFlow = Object.freeze({ STEPS: STEPS, LIST: LIST, VERIFY: VERIFY, url: url, verifyUrl: verifyUrl, stepper: stepper, bind: bind, title: title, savedMessage: savedMessage, verifyTarget: verifyTarget, openVerify: openVerify, mountVerify: mountVerify });
})(window);
