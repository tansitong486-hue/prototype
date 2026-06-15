/**
 * 公共导航组件 —— Header + Sidebar
 * 视觉：深色顶栏（激活项与页面主按钮同色蓝）、浅色侧栏（激活项主色字+浅蓝底+左竖线）
 *
 *   <script src="components/nav.js"
 *     data-active-nav="运营管理"
 *     data-active-sidebar="机房总览">
 *   </script>
 */

(function () {
  'use strict';

  const NAV_ITEMS = ['设施监控', '运营管理', '系统管理', '数据分析', '工程配置'];

  const SIDEBAR_TREE = [
    { label: '原型导航', href: 'index.html' },
    { label: '总览看板' },
    {
      group: '能耗分析',
      open: true,
      children: ['能耗流向分析', '用能对比分析', '用能趋势预测', '用能定额考核']
    },
    {
      group: '冷站能效优化',
      open: true,
      children: ['冷站仿真对比', '冷站柔性寻优', '冷站全局寻优', '冷站长周期寻优']
    },
    {
      group: '节能效果评估',
      open: true,
      children: ['节能分析']
    },
    {
      group: '机房能效优化',
      open: true,
      children: ['机房总览', '机房柔性寻优', '机房加减机寻优', '机房智能诊断']
    },
    {
      group: '基础配置',
      open: true,
      children: ['能效视图', '能源计费配置']
    },
    {
      group: 'AI节能配置',
      open: true,
      children: ['机理模型训练', '系统仿真建模', '安全边界', '智控下发策略', '安全回退策略', '机房热力模型']
    }
  ];

  const SIDEBAR_LINKS = {
    '总览看板': '总览看板.html',
    '能耗流向分析': '能耗流向分析.html',
    '用能对比分析': '用能对比分析.html',
    '用能趋势预测': '用能趋势预测.html',
    '能效视图': '能效视图.html',
    '能源计费配置': '能源配置.html',
    '机理模型训练': '机理模型训练.html',
    '系统仿真建模': '系统仿真建模.html',
    '机房总览': '机房总览.html',
    '机房柔性寻优': '机房寻优-柔性寻优.html',
    '机房加减机寻优': '机房寻优-加减机寻优.html',
    '机房智能诊断': '机房智能诊断.html',
    '机房热力模型': '机房寻优-机房热力模型列表.html',
    '冷站柔性寻优': '冷站柔性调优.html',
    '冷站全局寻优': '冷站全局寻优.html',
    '冷站长周期寻优': '冷站长周期寻优.html',
    '安全边界': '安全边界-列表.html',
    '智控下发策略': '智控下发策略管理.html',
    '节能分析': '节能分析.html',
    '用能定额考核': '用能定额考核.html',
    '冷站仿真对比': '节能仿真对比-设定.html'
  };

  /** 侧栏条目批注/原型版本角标；与 index.html 拓扑对应节点 version 对齐（同一菜单多页时以拓扑父/主节点为准） */
  const SIDEBAR_ITEM_VERSION = {
    '总览看板': 'v1.0',
    '能耗流向分析': 'v1.0',
    '用能对比分析': 'v1.0',
    '用能趋势预测': 'v1.0',
    '能效视图': 'v1.0',
    '能源计费配置': 'v1.0',
    '机理模型训练': 'v2.3',
    '系统仿真建模': 'v2.3',
    '机房总览': 'v1.9',
    '机房柔性寻优': 'v1.7',
    '机房加减机寻优': 'v1.7',
    '机房智能诊断': 'v1.9',
    '机房热力模型': 'v1.6',
    '冷站仿真对比': 'v2.3',
    '冷站柔性寻优': 'v2.3',
    '冷站全局寻优': 'v2.3',
    '冷站长周期寻优': 'v2.3',
    '安全边界': 'v1.8',
    '智控下发策略': 'v1.0',
    '节能分析': 'v1.0'
  };

  const ICON_HOME = '<svg class="sidebar-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';
  const ICON_DASH = '<svg class="sidebar-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M4 5h16M4 12h16M4 19h16"/></svg>';
  const ICON_GRID = '<svg class="sidebar-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>';
  const ICON_CHART = '<svg class="sidebar-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>';
  const ICON_SERVER = '<svg class="sidebar-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>';
  const ICON_COOL = '<svg class="sidebar-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M12 2v20M17 5l-5 5-5-5M17 19l-5-5-5 5M2 12h20M5 7l5 5-5 5M19 7l-5 5 5 5"/></svg>';
  const ICON_LEAF = '<svg class="sidebar-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>';
  const ICON_GEAR = '<svg class="sidebar-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
  const ICON_SLIDERS = '<svg class="sidebar-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>';

  const GROUP_ICONS = {
    '能耗分析': ICON_CHART,
    '机房能效优化': ICON_SERVER,
    '冷站能效优化': ICON_COOL,
    '节能效果评估': ICON_LEAF,
    'AI节能配置': ICON_GEAR,
    '基础配置': ICON_SLIDERS
  };

  const USER = { name: '系统管理员', avatar: '管' };

  function getConfig() {
    const script = document.currentScript || document.querySelector('script[data-active-nav]');
    return {
      activeNav: script?.getAttribute('data-active-nav') || '',
      activeSidebar: script?.getAttribute('data-active-sidebar') || ''
    };
  }

  const config = getConfig();

  function injectStyles() {
    if (document.getElementById('nav-component-styles')) return;

    const style = document.createElement('style');
    style.id = 'nav-component-styles';
    style.textContent = `
      :root {
        --nav-top-bg: #2F78F6;
        --nav-top-hover: rgba(255,255,255,.12);
        /* 与页面内 .btn-primary / --primary 对齐 */
        --nav-primary: #1E40AF;
        --nav-primary-dark: #17358A;
        --nav-primary-tint: #EEF4FF;
        --nav-sidebar-surface: #FFFFFF;
        --nav-sidebar-border: #E8E8E8;
        --nav-sidebar-text: #595959;
        --nav-sidebar-text-title: #262626;
        --nav-sidebar-muted: #8C8C8C;
        --nav-body-bg: #FFFFFF;
      }

      .header {
        height: 40px;
        background: var(--nav-top-bg);
        display: flex;
        align-items: center;
        padding: 0 12px 0 18px;
        color: #fff;
        flex-shrink: 0;
        z-index: 100;
        box-shadow: 0 1px 0 rgba(13,77,170,.22);
      }
      .header-logo {
        margin-right: 28px;
        display: flex;
        align-items: center;
        height: 100%;
      }
      .header-logo img {
        height: 18px;
        width: auto;
        display: block;
      }
      .header-nav {
        display: flex;
        align-items: stretch;
        gap: 0;
        flex: 1;
        min-width: 0;
        height: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        flex-wrap: nowrap;
        scrollbar-width: thin;
        scrollbar-color: rgba(255,255,255,.25) transparent;
      }
      .header-nav::-webkit-scrollbar {
        height: 4px;
      }
      .header-nav::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,.22);
        border-radius: 2px;
      }
      .header-nav-item {
        padding: 0 18px;
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 13px;
        color: rgba(255,255,255,.88);
        transition: background .15s, color .15s;
        white-space: nowrap;
        position: relative;
        margin: 0 1px;
        border-radius: 0;
      }
      .header-nav-item:hover {
        color: #fff;
        background: var(--nav-top-hover);
      }
      .header-nav-item.active {
        color: var(--nav-primary);
        font-weight: 600;
        background: var(--nav-body-bg);
      }
      .header-nav-item.active::before {
        display: none;
      }
      .header-nav-item.active:hover {
        background: var(--nav-body-bg);
      }

      .header-tools {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 12px;
        color: rgba(255,255,255,.88);
        font-size: 12px;
      }
      .header-bell {
        position: relative;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        cursor: pointer;
        color: rgba(255,255,255,.85);
        transition: background .15s;
      }
      .header-bell:hover { background: var(--nav-top-hover); }
      .header-bell svg { width: 20px; height: 20px; }
      .header-bell-badge {
        position: absolute;
        top: 6px;
        right: 6px;
        min-width: 8px;
        height: 8px;
        padding: 0;
        border-radius: 50%;
        background: #FF4D4F;
        border: 2px solid var(--nav-top-bg);
      }
      .header-user {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: default;
      }
      .header-user-avatar {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: rgba(255,255,255,.18);
        border: 2px solid rgba(255,255,255,.12);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 700;
        color: #fff;
      }

      /* —— 侧栏 浅色 —— */
      .sidebar {
        width: 210px;
        background: var(--nav-sidebar-surface);
        overflow: hidden;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        min-height: 0;
        align-self: stretch;
        border-right: 1px solid var(--nav-sidebar-border);
        transition: width .28s cubic-bezier(.4,0,.2,1);
      }

      .sidebar-brand {
        padding: 0 16px;
        font-size: 15px;
        font-weight: 700;
        color: var(--nav-sidebar-text-title);
        line-height: 1.35;
        flex-shrink: 0;
        border-bottom: 1px solid var(--nav-sidebar-border);
        background: var(--nav-sidebar-surface);
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;
        min-height: 42px;
      }
      .sidebar-brand-mark {
        display: none;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: var(--nav-primary-tint);
        color: var(--nav-primary);
        font-size: 15px;
        font-weight: 800;
        line-height: 1;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .sidebar-brand-text {
        flex: 1;
        min-width: 0;
      }

      .sidebar-scroll {
        flex: 1;
        min-height: 0;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 8px 0 10px;
        -webkit-overflow-scrolling: touch;
      }
      .sidebar-scroll::-webkit-scrollbar { width: 5px; }
      .sidebar-scroll::-webkit-scrollbar-thumb {
        background: rgba(0,0,0,.12);
        border-radius: 3px;
      }

      .sidebar-ico {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
        opacity: .55;
      }
      .sidebar-item.active .sidebar-ico { opacity: 1; color: var(--nav-primary); }

      .sidebar-item {
        padding: 9px 12px 9px 13px;
        margin: 0 6px;
        border-radius: 6px;
        color: var(--nav-sidebar-text);
        cursor: pointer;
        font-size: 12px;
        transition: background .15s, color .15s;
        display: flex;
        align-items: center;
        gap: 10px;
        line-height: 1.45;
        text-decoration: none;
        border-left: 3px solid transparent;
      }
      .sidebar-item-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex: 1;
        min-width: 0;
      }
      .sidebar-item-text {
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .sidebar-item-ver {
        flex-shrink: 0;
        font-size: 10px;
        font-weight: 600;
        color: var(--nav-sidebar-muted);
        background: #F0F0F0;
        padding: 2px 6px;
        border-radius: 4px;
        letter-spacing: -0.02em;
      }
      .sidebar-item.active .sidebar-item-ver {
        color: var(--nav-primary);
        background: rgba(30, 64, 175, 0.14);
      }
      .sidebar-item:hover {
        background: rgba(0,0,0,.04);
        color: var(--nav-sidebar-text-title);
      }
      .sidebar-item:hover .sidebar-ico { opacity: .75; }
      .sidebar-item.active {
        color: var(--nav-primary);
        font-weight: 600;
        background: var(--nav-primary-tint);
        border-left-color: var(--nav-primary);
      }
      .sidebar-item.active:hover {
        background: rgba(30, 64, 175, 0.12);
        color: var(--nav-primary-dark);
      }

      .sidebar-group-label {
        padding: 10px 12px 10px 14px;
        margin-top: 4px;
        color: var(--nav-sidebar-text-title);
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        user-select: none;
        transition: color .15s;
      }
      .sidebar-group-label:hover { color: var(--nav-primary); }
      .sidebar-group-label:hover .sidebar-ico { opacity: 1; color: var(--nav-primary); }
      .sidebar-group-label .sidebar-group-title {
        flex: 1;
        min-width: 0;
      }
      .sidebar-group-label .sidebar-chevron {
        font-size: 10px;
        color: var(--nav-sidebar-muted);
        transition: transform .2s;
        flex-shrink: 0;
      }
      .sidebar-group-label.open .sidebar-chevron {
        transform: rotate(180deg);
      }

      .sidebar-group-children {
        padding-bottom: 4px;
      }
      .sidebar-group-children .sidebar-item {
        padding-left: 32px;
      }

      .sidebar-foot {
        flex-shrink: 0;
        border-top: 1px solid var(--nav-sidebar-border);
        padding: 8px;
        background: var(--nav-sidebar-surface);
      }
      .sidebar-collapse-btn {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 11px 14px 11px 13px;
        border: none;
        border-radius: 6px;
        background: transparent;
        color: var(--nav-sidebar-text);
        font-size: 13px;
        cursor: pointer;
        transition: background .15s, color .15s;
      }
      .sidebar-collapse-btn:hover {
        background: rgba(0,0,0,.04);
        color: var(--nav-sidebar-text-title);
      }
      .sidebar-collapse-btn svg {
        width: 16px;
        height: 16px;
        opacity: .55;
        transition: transform .28s cubic-bezier(.4,0,.2,1);
      }
      .sidebar-collapse-btn:hover svg {
        opacity: .75;
      }

      .sidebar.sidebar--collapsed {
        width: 64px !important;
      }
      .sidebar.sidebar--collapsed .sidebar-brand {
        justify-content: center;
        padding: 12px 8px;
      }
      .sidebar.sidebar--collapsed .sidebar-brand-text {
        display: none;
      }
      .sidebar.sidebar--collapsed .sidebar-brand-mark {
        display: flex;
      }
      .sidebar.sidebar--collapsed .sidebar-group-title,
      .sidebar.sidebar--collapsed .sidebar-item-text,
      .sidebar.sidebar--collapsed .sidebar-item-ver,
      .sidebar.sidebar--collapsed .sidebar-collapse-text {
        display: none;
      }
      .sidebar.sidebar--collapsed .sidebar-group-label .sidebar-chevron {
        display: none;
      }
      .sidebar.sidebar--collapsed .sidebar-group-label {
        justify-content: center;
        padding: 12px 8px;
        margin-top: 2px;
      }
      .sidebar.sidebar--collapsed .sidebar-item-row {
        display: none;
      }
      .sidebar.sidebar--collapsed .sidebar-item {
        justify-content: center;
        align-items: center;
        padding: 10px 8px;
        margin-left: 4px;
        margin-right: 4px;
        border-left-width: 0;
      }
      .sidebar.sidebar--collapsed .sidebar-item.active {
        border-left-color: transparent;
        box-shadow: inset 3px 0 0 var(--nav-primary);
      }
      .sidebar.sidebar--collapsed .sidebar-group-children .sidebar-item {
        padding-left: 8px;
        padding-right: 8px;
        min-height: 40px;
      }
      .sidebar.sidebar--collapsed .sidebar-group-children .sidebar-item::before {
        content: '';
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--nav-sidebar-muted);
        opacity: 0.55;
        flex-shrink: 0;
      }
      .sidebar.sidebar--collapsed .sidebar-group-children .sidebar-item:hover::before {
        opacity: 0.85;
        background: var(--nav-sidebar-text-title);
      }
      .sidebar.sidebar--collapsed .sidebar-group-children .sidebar-item.active {
        box-shadow: none;
      }
      .sidebar.sidebar--collapsed .sidebar-group-children .sidebar-item.active::before {
        opacity: 1;
        background: var(--nav-primary);
        box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.2);
      }
      .sidebar.sidebar--collapsed .sidebar-collapse-btn {
        justify-content: center;
        padding-left: 8px;
        padding-right: 8px;
      }
      .sidebar.sidebar--collapsed .sidebar-collapse-btn svg {
        transform: rotate(180deg);
      }

      /* 整页壳：顶栏不随页面滚动；侧栏标题/底栏固定，菜单在中间区域内部滚动；仅主内容区纵向滚动 */
      html.nav-app-shell {
        height: 100%;
      }
      html.nav-app-shell body {
        height: 100%;
        margin: 0;
        overflow: hidden;
      }
      html.nav-app-shell .layout {
        height: 100%;
        min-height: 0;
        max-height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      html.nav-app-shell .body-wrap {
        flex: 1 1 0;
        min-height: 0;
        min-width: 0;
        overflow: hidden;
        display: flex;
        align-items: stretch;
      }
      html.nav-app-shell .body-wrap > .main,
      html.nav-app-shell .body-wrap > main.main {
        flex: 1 1 0;
        min-width: 0;
        min-height: 0;
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
      }

      /* 侧栏收起时：悬停小浮窗（菜单名） */
      .nav-sidebar-tooltip {
        position: fixed;
        z-index: 11000;
        left: 0;
        top: 0;
        max-width: min(280px, calc(100vw - 24px));
        padding: 7px 11px;
        font-size: 12px;
        line-height: 1.45;
        font-weight: 500;
        color: #fff;
        background: rgba(38, 38, 38, 0.94);
        border-radius: 6px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
        pointer-events: none;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.1s ease, visibility 0.1s ease;
      }
      .nav-sidebar-tooltip.nav-sidebar-tooltip--visible {
        opacity: 1;
        visibility: visible;
      }
    `;
    document.head.appendChild(style);
  }

  function buildHeader() {
    const header = document.createElement('header');
    header.className = 'header';

    const logo = document.createElement('div');
    logo.className = 'header-logo';
    logo.innerHTML = '<img src="http://192.168.0.50:11182/page/authority/login/image/logo-login.png" alt="X-BROTHER">';

    const nav = document.createElement('nav');
    nav.className = 'header-nav';
    NAV_ITEMS.forEach(function (text) {
      const item = document.createElement('div');
      item.className = 'header-nav-item' + (text === config.activeNav ? ' active' : '');
      item.textContent = text;
      nav.appendChild(item);
    });

    const tools = document.createElement('div');
    tools.className = 'header-tools';
    tools.innerHTML =
      '<div class="header-bell" title="通知">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' +
        '<span class="header-bell-badge"></span></div>' +
      '<div class="header-user">' +
        '<div class="header-user-avatar">' + USER.avatar + '</div>' +
        '<span>' + USER.name + '</span></div>';

    header.appendChild(logo);
    header.appendChild(nav);
    header.appendChild(tools);
    return header;
  }

  function ensureNavSidebarTooltip() {
    var el = document.getElementById('nav-sidebar-tooltip');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'nav-sidebar-tooltip';
    el.className = 'nav-sidebar-tooltip';
    el.setAttribute('role', 'tooltip');
    document.body.appendChild(el);
    return el;
  }

  function hideNavSidebarTooltip() {
    var tip = document.getElementById('nav-sidebar-tooltip');
    if (!tip) return;
    tip.classList.remove('nav-sidebar-tooltip--visible');
    tip.textContent = '';
  }

  function showNavSidebarTooltip(target, text) {
    if (!text) return;
    var tip = ensureNavSidebarTooltip();
    tip.textContent = text;
    requestAnimationFrame(function () {
      var r = target.getBoundingClientRect();
      var margin = 8;
      var gap = 10;
      tip.style.whiteSpace = text.length > 20 ? 'normal' : 'nowrap';
      var tw = tip.offsetWidth;
      var th = tip.offsetHeight;
      var left = r.right + gap;
      var top = r.top + (r.height - th) / 2;
      if (left + tw > window.innerWidth - margin) {
        left = r.left - tw - gap;
      }
      left = Math.max(margin, Math.min(left, window.innerWidth - tw - margin));
      top = Math.max(margin, Math.min(top, window.innerHeight - th - margin));
      tip.style.left = left + 'px';
      tip.style.top = top + 'px';
      tip.classList.add('nav-sidebar-tooltip--visible');
    });
  }

  function bindCollapsedSidebarTooltips(aside) {
    var tip = ensureNavSidebarTooltip();
    function hide() {
      tip.classList.remove('nav-sidebar-tooltip--visible');
      tip.textContent = '';
    }
    aside.addEventListener('mouseover', function (e) {
      if (!aside.classList.contains('sidebar--collapsed')) {
        hide();
        return;
      }
      var el = e.target.closest('[data-nav-tip]');
      if (!el || !aside.contains(el)) return;
      var t = el.getAttribute('data-nav-tip');
      if (!t) return;
      showNavSidebarTooltip(el, t);
    });
    aside.addEventListener('mouseleave', hide);
    var scrollEl = aside.querySelector('.sidebar-scroll');
    if (scrollEl) scrollEl.addEventListener('scroll', hide, { passive: true });
    window.addEventListener(
      'scroll',
      function () {
        if (aside.classList.contains('sidebar--collapsed')) hide();
      },
      true
    );
  }

  function sidebarItemRowHtml(label) {
    const ver = SIDEBAR_ITEM_VERSION[label];
    const verHtml = ver
      ? '<span class="sidebar-item-ver" title="页面批注/原型版本">' + ver + '</span>'
      : '';
    return (
      '<span class="sidebar-item-row">' +
      '<span class="sidebar-item-text">' + label + '</span>' +
      verHtml +
      '</span>'
    );
  }

  function buildSidebar() {
    const aside = document.createElement('aside');
    aside.className = 'sidebar';

    const brand = document.createElement('div');
    brand.className = 'sidebar-brand';
    brand.innerHTML =
      '<span class="sidebar-brand-mark" aria-hidden="true">AI</span>' +
      '<span class="sidebar-brand-text">能效管理</span>';
    brand.setAttribute('data-nav-tip', '能效管理');
    aside.appendChild(brand);

    const scroll = document.createElement('div');
    scroll.className = 'sidebar-scroll';

    SIDEBAR_TREE.forEach(function (node) {
      if (node.group) {
        const groupLabel = document.createElement('div');
        groupLabel.className = 'sidebar-group-label' + (node.open ? ' open' : '');
        const gIcon = GROUP_ICONS[node.group] || ICON_DASH;
        groupLabel.innerHTML =
          gIcon +
          '<span class="sidebar-group-title">' + node.group + '</span>' +
          '<span class="sidebar-chevron">▼</span>';
        groupLabel.setAttribute('data-nav-tip', node.group);

        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'sidebar-group-children';
        childrenContainer.style.display = node.open ? 'block' : 'none';

        groupLabel.addEventListener('click', function () {
          node.open = !node.open;
          groupLabel.className = 'sidebar-group-label' + (node.open ? ' open' : '');
          childrenContainer.style.display = node.open ? 'block' : 'none';
        });

        (node.children || []).forEach(function (child) {
          const href = SIDEBAR_LINKS[child];
          const item = document.createElement(href ? 'a' : 'div');
          if (href) item.href = href;
          item.className = 'sidebar-item' + (child === config.activeSidebar ? ' active' : '');
          item.innerHTML = sidebarItemRowHtml(child);
          item.setAttribute('data-nav-tip', child);
          if (href) item.setAttribute('aria-label', child);
          childrenContainer.appendChild(item);
        });

        scroll.appendChild(groupLabel);
        scroll.appendChild(childrenContainer);
      } else {
        const href = node.href || SIDEBAR_LINKS[node.label];
        const item = document.createElement(href ? 'a' : 'div');
        if (href) item.href = href;
        item.className = 'sidebar-item' + (node.label === config.activeSidebar ? ' active' : '');
        let icon = ICON_DASH;
        if (node.label === '原型导航') icon = ICON_HOME;
        else if (node.label === '总览看板') icon = ICON_GRID;
        item.innerHTML = icon + sidebarItemRowHtml(node.label);
        item.setAttribute('data-nav-tip', node.label);
        if (href) item.setAttribute('aria-label', node.label);
        scroll.appendChild(item);
      }
    });

    aside.appendChild(scroll);

    const foot = document.createElement('div');
    foot.className = 'sidebar-foot';
    const collapseBtn = document.createElement('button');
    collapseBtn.type = 'button';
    collapseBtn.className = 'sidebar-collapse-btn';
    collapseBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M15 18l-6-6 6-6"/></svg>' +
      '<span class="sidebar-collapse-text">收起导航</span>';
    collapseBtn.setAttribute('data-nav-tip', '收起导航');
    collapseBtn.setAttribute('aria-label', '收起导航');
    collapseBtn.addEventListener('click', function () {
      aside.classList.toggle('sidebar--collapsed');
      const t = collapseBtn.querySelector('.sidebar-collapse-text');
      const collapsed = aside.classList.contains('sidebar--collapsed');
      if (t) t.textContent = collapsed ? '展开导航' : '收起导航';
      collapseBtn.setAttribute('data-nav-tip', collapsed ? '展开导航' : '收起导航');
      collapseBtn.setAttribute('aria-label', collapsed ? '展开导航' : '收起导航');
      hideNavSidebarTooltip();
    });
    foot.appendChild(collapseBtn);
    aside.appendChild(foot);

    bindCollapsedSidebarTooltips(aside);

    return aside;
  }

  function mount() {
    injectStyles();
    document.documentElement.classList.add('nav-app-shell');

    var headerSlot = document.getElementById('app-header');
    var sidebarSlot = document.getElementById('app-sidebar');

    if (headerSlot) {
      headerSlot.replaceWith(buildHeader());
    }
    if (sidebarSlot) {
      sidebarSlot.replaceWith(buildSidebar());
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
