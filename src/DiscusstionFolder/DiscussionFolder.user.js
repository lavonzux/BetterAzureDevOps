// ==UserScript==
// @name         評論區摺疊工具
// @namespace    https://github.com/lavonzux/BetterAzureDevOps
// @version      0.9.10-beta
// @description  在畫面右下角增加一工具箱，用以摺疊Discussion區塊中的comment卡片。
// @author       Anthony.Mai
// @match        https://dev.azure.com/fubonfinance/SYS_GA/_workitems/edit*
// @icon         https://cdn.vsassets.io/content/icons/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/552528/%E8%A9%95%E8%AB%96%E5%8D%80%E6%91%BA%E7%96%8A%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/552528/%E8%A9%95%E8%AB%96%E5%8D%80%E6%91%BA%E7%96%8A%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

// 工具盤預設打開
const TRAY_OPEN_BY_DEFAULT = true;
// 工具盤背景顏色
const TRAY_BACKGROUND_COLOR = '#adfe';
// 工具箱開關按鈕顏色
const TRAY_TOGGLE_COLOR = '#f9a';
// 工具箱按鈕文字顏色
const TOOL_BUTTON_TEXT_COLOR = 'white';
// 工具箱按鈕背景顏色
const TOOL_BUTTON_BG_COLOR = '#0078d4';
// 工具箱按鈕背景:hover顏色
const TOOL_BUTTON_BG_HOVER_COLOR = '#005a9e';

// 未回應評論的摺疊按鈕
const NOT_REACTED_COLLAPSE_BTN_CONTENT = '🔥';
// 已回應評論的摺疊按鈕
const REACTED_COLLAPSE_BTN_CONTENT = '↕️';

// 版面控制開關相關設定
// 切換速度
const SWITCH_TRANSITION_DURATION = '0.2s';
// 開啟時背景顏色
const SWITCH_ON_BACKGROUND_COLOR = '#0078d4';
// 關閉時背景顏色
const SWITCH_OFF_BACKGROUND_COLOR = '#aaaa';

// Switch文字顏色
const SWITCH_LABEL_TEXT_COLOR = '#000';

function createStyle () {
    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            --tray-width: 28rem;
            --tray-height: 17rem;
            --corner-size: 2rem;

            /* CSS variables for the toggle switch */
            --switch-width: 4rem;
            --switch-height: 2rem;
            --switch-transition: ${SWITCH_TRANSITION_DURATION};
            --knob-gap: 4px;
        }

        /* CSS classes for my tooltray */
        .my-tray {
            background-color: ${TRAY_BACKGROUND_COLOR};
            position: absolute;
            bottom: 1rem;
            right: 1rem;

            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-auto-rows: 3rem;
            gap: 0.25rem;

            border-radius: 0 1rem 1rem 1rem;
            padding: 0.5rem;
            transition: transform ease-in-out 0.4s;
            cursor: auto;
            width: var(--tray-width);
            height: var(--tray-height);

            border: 0px solid #333;
            overflow: hidden;
            transform-origin: bottom right;
            z-index: 1;
            box-sizing: border-box;
        }

        /* Tray collapsed state */
        .my-tray.my-tray-shrunk {
            overflow: hidden;
            width: var(--corner-size);
            height: var(--corner-size);
            animation: collapse 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* Tray expanded state */
        .my-tray.my-tray-expand {
            overflow: visible;
            border-radius: 1rem 1rem 0 1rem;
            width: var(--tray-width);
            height: var(--tray-height);
            animation: expand 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* Expand animation: Y-axis first, then X-axis */
        @keyframes expand {
          0% {
            width: var(--corner-size);
            height: var(--corner-size);
          }
          50% {
            width: var(--corner-size);
            height: var(--tray-height);
          }
          100% {
            width: var(--tray-width);
            height: var(--tray-height);
          }
        }

        /* Collapse animation: X-axis first, then Y-axis */
        @keyframes collapse {
          0% {
            width: var(--tray-width);
            height: var(--tray-height);
          }
          50% {
            width: var(--corner-size);
            height: var(--tray-height);
          }
          100% {
            width: var(--corner-size);
            height: var(--corner-size);
          }
        }


        /* CSS class for General tray item */
        .my-tray .tray-item {
          transition: transform 0.2s ease-in-out 0.4s;
          transform-origin: top left;
        }
        .my-tray.my-tray-shrunk .tray-item {
          transform: scale(0);
        }

        /* CSS class for different elements in the tray */
        .my-tray .tray-item.refresh-div {
          grid-column-start: 1;
          grid-column-end: 3;
        }
        .my-tray .tray-item.search-div {
          grid-column-start: 1;
          grid-column-end: 3;
          display: grid;
          grid-template-columns: 3fr 1fr;
          gap: 0.25rem;
        }
        .my-tray .tray-item.switch-div {
          grid-column-start: 1;
          grid-column-end: 3;
          display: grid;
          grid-template-columns: repeat(3, 2fr 1fr);
          gap: 0.25rem;
          align-items: center;
          padding-right: 2rem;
        }



        .my-tool-button{
          width: 100%;
          height: 100%;
          padding: 6px 12px;
          font-size: 1rem;
          border: 0;
          border-radius: 1rem;
          color: ${TOOL_BUTTON_TEXT_COLOR};
          cursor: pointer;
          transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out 0.4s;
          transform-origin: top left;
          background-color: ${TOOL_BUTTON_BG_COLOR};
          white-space: nowrap;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
        .my-tool-button:hover {
          background-color: ${TOOL_BUTTON_BG_HOVER_COLOR};
        }

        .my-tray-shrunk .my-tool-button {
          transform: scale(0);
        }

        .my-tooltip{
          display: flex;
          align-items: center;
          justify-content: end;
          height: 100%;
        }
        .my-tooltip .my-tooltiptext {
          visibility: hidden;
          width: calc(var(--tray-width) * 0.5);
          background-color: #000c;
          color: #fff;
          text-align: center;
          border-radius: 6px;
          padding: 5px;
          position: absolute;
          z-index: 1;
          bottom: calc(var(--tray-height) + 1rem);
          left: 0;
          transform: translateX(calc(var(--tray-width) * 0.25));
        }
        .my-tooltip:hover .my-tooltiptext {
          visibility: visible;
        }

        /* CSS for the shrinking btn */
        .my-expand-button-div {
          position: sticky;
          top: 0.5rem;
          display: flex;
          justify-content: center;
        }
        .my-expand-button {
          border: none;
          background: none;
          font-size: 1.25rem;
          cursor: pointer;
        }

        /* CSS for shrinking */
        .my-shrinkable {
          transition: max-height 0.8s ease-in-out;
          max-height: 9999px;
          overflow: hidden;
        }
        .my-shrunk {
          max-height: 0px;
        }

        /* CSS for my searching tool */
        input.my-search-input {
          width: 100%;
          height: 100%;
          border: none;
          border-radius: 1rem;
          font-size: clamp(12px, 1.25rem, 24px);
          padding: 0;
          text-align: center;
        }




        .my-tray .my-tray-toggle {
            background-color: ${TRAY_TOGGLE_COLOR};
            position: absolute;
            width: var(--corner-size);
            height: var(--corner-size);
            bottom: 0;
            right: 0;
            border-radius: 0 1rem 1rem 1rem;
            cursor: pointer;
            z-index: 100;
            transition: border-radius ease-in-out 0.2s;
        }
        .my-tray-expand .my-tray-toggle {
            border-radius: 1rem 1rem 0 1rem;
        }
        .my-tray-shrunk .my-tooltip {
            transform: scale(0);
        }
        .my-tray div {
            transition: transform 0.4s ease-in-out 0.3s;
            transform-origin: top left;
        }

        .my-last-clicked {
          box-shadow: 0 0 1rem 0.5rem #009fffb0;
        }


        /* CSS for toggle switches */
        .my-switch {
          position: relative;
          display: inline-block;
          width: var(--switch-width);
          height: var(--switch-height);
        }

        .my-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .my-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: var(--switch-transition);
          border-radius: var(--switch-height);
        }

        .my-slider:before {
          position: absolute;
          content: "";
          height: calc(var(--switch-height) - 2* var(--knob-gap));
          width: calc(var(--switch-height) - 2* var(--knob-gap));
          left: var(--knob-gap);
          bottom: var(--knob-gap);
          background-color: white;
          transition: var(--switch-transition);
          border-radius: 50%;
        }

        input:checked + .my-slider {
          background-color: ${SWITCH_ON_BACKGROUND_COLOR};
        }
        input:not(:checked) + .my-slider {
          background-color: ${SWITCH_OFF_BACKGROUND_COLOR};
        }

        input:checked + .my-slider:before {
          transform: translateX(calc(var(--switch-width) - var(--switch-height)));
        }

        .my-sw-label {
          font-size: 1.1rem;
          color: ${SWITCH_LABEL_TEXT_COLOR};
          white-space: nowrap;
        }
    `;
    document.head.appendChild(style);
}

(function() {
    'use strict';
    createStyle();

    const SETTINGS = {
        trayOpened: TRAY_OPEN_BY_DEFAULT,
        layoutSwitched: false,
        taskBarSwitched: false,
        ...GM_getValue('SETTINGS')
    };


    let lastClickedComment = null;
    const observer = new MutationObserver((_record, observer) => {

        // Early return if the tray was already there
        const myTray = document.body.querySelector('div.my-tray');
        if (myTray) return;

        const tray = document.createElement('div');
        tray.classList.add('my-tray', 'my-tray-shrunk');
        document.body.appendChild(tray);
        if (SETTINGS.trayOpened) toggleTray(tray);

        tray.appendChild(createTrayToggle());

        tray.appendChild(createRefreshButton());
        tray.appendChild(createExpandAllButton());
        tray.appendChild(createShrinkAllButton());
        tray.appendChild(createExpandReactedButton());
        tray.appendChild(createShrinkReactedButton());
        tray.appendChild(createSearchTool());


        // Switch tools
        const layoutSw = createStatefulSwitch(
            'layoutSwitch',
            false,
            switchWideLayout,
            '調整排版',
            '調整排版，將左側常用的Description及Discussion放大。',
            SETTINGS.layoutSwitched
        );
        const taskBarSw = createStatefulSwitch(
            'taskBarSwitch',
            false,
            switchTaskBar,
            '縮小標題',
            '調整task bar，將不常用的元素隱藏並縮成一行。',
            SETTINGS.taskBarSwitched
        );
        const descLock = createStatefulSwitch(
            'descLock',
            true,
            toggleDescLock,
            '描述鎖定',
            '鎖定 description 的編輯器，避免不小心改動。',
            true // I want to lock the desc editor onload no matter what
        );

        tray.appendChild(wrapIntoTrayItem(
            [layoutSw.label, layoutSw.switch, taskBarSw.label, taskBarSw.switch, descLock.label, descLock.switch],
            TRAY_ITEM_TYPE.SWITCH_DIV
        ));

    });


    /**
     * Find comment cards and group them into two groups by given predicate
     */
    function findCommentCardsByPredicate(groupingPredicate = (_card) => true) {
        // If discussion section or comment cards are null, early return
        const discussionSection = document.querySelector('div.work-item-form-discussion div.work-item-form-collapsible-section-content');
        if (!discussionSection) return { true: [], false: [] };
        const commentCards = discussionSection.querySelectorAll('div.comment-item.displayed-comment');
        if (commentCards.length <= 0) return { true: [], false: [] };

        return {
            true: [],  // Make sure that returned object have 
            false: [], // both key(true/false) and value(empty array)
            ...Object.groupBy(commentCards, (card) => groupingPredicate(card))
        };
    }


    const GROUPIND_PREDICATE = Object.freeze({
        BY_STRING_IGNORE_CASE: (stringToFind) => (commentCard) => !commentCard.textContent.toLowerCase().includes(stringToFind?.trim() || ''),
        BY_REACTION_EXIST: (commentCard) => commentCard.querySelector('.reaction-statusbar-placeholder') !== null
    });

    function toggleTray(tray) {
        if (tray.classList.contains('my-tray-shrunk')) {
            tray.classList.remove('my-tray-shrunk');
            tray.classList.add('my-tray-expand');
            GM_setValue('SETTINGS', { ...SETTINGS, trayOpened: true });
        } else {
            tray.classList.remove('my-tray-expand');
            tray.classList.add('my-tray-shrunk');
            GM_setValue('SETTINGS', { ...SETTINGS, trayOpened: false });
        }
    }
    function toggleButtonCallback(controlledDivs, event) {
        lastClickedComment?.classList.remove('my-last-clicked');
        lastClickedComment = event.target.parentElement.parentElement.parentElement;
        lastClickedComment?.classList.add('my-last-clicked');

        controlledDivs.forEach(div => {
            div.classList.toggle('my-shrunk');
        });

        const card = event.target.parentElement.parentElement.parentElement;
        scrollToCommentCard(card);
    }
    function scrollToCommentCard(card) {
        const workItemContainer = document.querySelector('div.work-item-form-page-content.page-content.page-content-top');
        const offset = card.offsetTop - workItemContainer.offsetTop - 12;
        workItemContainer.scroll({top: offset, behavior: 'smooth'});
    };


    // Functions for creating each tooltray elements

    function createTrayToggle() {
        const trayToggle = document.createElement('div');
        trayToggle.classList.add('my-tray-toggle');
        trayToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleTray(event.target.parentNode);
        });
        return trayToggle;
    }
    function createRefreshButton() {
        const refreshButton = createToolButton(
            '🔃 更新摺疊按鈕狀態',
            function () {
                const groupByReacted = findCommentCardsByPredicate(GROUPIND_PREDICATE.BY_REACTION_EXIST);
                refreshCommentCards(groupByReacted.true, true);
                refreshCommentCards(groupByReacted.false, false);
            }
        );
        const inTooltip = wrapIntoTooltip(
            refreshButton, 
            '更新評論卡片中摺疊按鈕的狀態，初次載入頁面時建議等完全載入後再按'
        );
        return wrapIntoTrayItem(inTooltip, TRAY_ITEM_TYPE.REFRESH_DIV);
    }
    function createExpandAllButton() {
        const expandAllBtn = createToolButton('📂 全部展開', () => shrinkByCondition(findCommentCardsByPredicate(() => false)));
        const inTooltip = wrapIntoTooltip(expandAllBtn, '展開全部評論卡片');
        return wrapIntoTrayItem(inTooltip);
    }
    function createShrinkAllButton() {
        const shrinkAllBtn = createToolButton('📁 全部摺疊', () => shrinkByCondition(findCommentCardsByPredicate()));
        const inTooltip = wrapIntoTooltip(shrinkAllBtn, '摺疊全部評論卡片');
        return wrapIntoTrayItem(inTooltip);
    }
    function createExpandReactedButton() {
        const expandReactedBtn = createToolButton(
            '⏬ 開已回應',
            () => {
                const predicate = (card) => !(GROUPIND_PREDICATE.BY_REACTION_EXIST(card));
                shrinkByCondition(findCommentCardsByPredicate(predicate));
            }
        );
        const inTooltip = wrapIntoTooltip(expandReactedBtn, '打開已反應的評論卡');
        return wrapIntoTrayItem(inTooltip);
    }
    function createShrinkReactedButton() {
        const shrinkReactedBtn = createToolButton(
            '⏫ 關已回應',
            () => {
                const predicate = GROUPIND_PREDICATE.BY_REACTION_EXIST;
                shrinkByCondition(findCommentCardsByPredicate(predicate));
            }
        );
        const inTooltip = wrapIntoTooltip(shrinkReactedBtn, '摺疊已反應的評論卡');
        return wrapIntoTrayItem(inTooltip);
    }
    function createSearchTool() {
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = '輸入欲搜尋的文字';
        searchInput.classList.add('my-search-input');
        const searchInputInTooltip = wrapIntoTooltip(
            searchInput,
            '輸入欲搜尋的文字，會展開所有包含該文字的評論，並摺疊不包含該字串的評論。'
        );

        const searchBtn = createToolButton(
            '🔍 搜尋', 
            () => {
                const targetString = document.querySelector('div.my-tray .tray-item.search-div input.my-search-input').value;
                const predicate = GROUPIND_PREDICATE.BY_STRING_IGNORE_CASE(targetString);
                const groupedCommentCards = findCommentCardsByPredicate(predicate);
                shrinkByCondition(groupedCommentCards);
            }
        );

        return wrapIntoTrayItem([searchInputInTooltip, searchBtn], TRAY_ITEM_TYPE.SEARCH_DIV);
    }

    // Functions for creating all switch tools
    function createSwitchElement(switchId, switched, switchEventCallback) {
        const label = document.createElement('label');
        label.classList.add('my-switch');

        const checkbox = document.createElement('input');
        checkbox.setAttribute("type", "checkbox");
        checkbox.addEventListener('change', (event) => switchEventCallback(event.target.checked));
        checkbox.setAttribute('id', switchId);
        if (switched) {
            checkbox.checked = true;
            switchEventCallback(true);
        }

        const slider = document.createElement('div');
        slider.classList.add('my-slider');

        label.appendChild(checkbox);
        label.appendChild(slider);

        // expose checkbox's checked prop to parent node
        Object.defineProperty(label, 'checked', {
            set(value) {
                checkbox.checked = value;
            }
        });

        return label;
    }
    function createSwitchLabel(switchId, labelText, labelTooltip) {
        const label = document.createElement('label');
        label.innerText = labelText;
        label.classList.add('my-sw-label');
        label.setAttribute('for', switchId);
        return wrapIntoTooltip(label, labelTooltip);
    };
    /*function createLabelAndSwitchPair(switchId, switched, labelText, labelTooltip, switchCallback) {
        const label = createSwitchLabel(switchId, labelText, labelTooltip);
        const sw = createSwitchElement(switchId, switched, switchCallback);
        return [label, sw];
    }*/

    /**
     * Create a toogle switch element whose checked prop is directly associated with it's switchCallback
     * @property switchId Element ID for the switch
     * @property switchCallback The callback for the switch's onchange event, return success flag
     * @property labelText Text of the label
     * @property labelTooltip Description that pops up when pointing at the label
     * @property state The initial state that will be fed to the switchCallback
     * @property initConfig a config object setting maxTry and tryInterval for the initializer
     * @returns  An object of the switch itself, the label, and a promise that does the state initialization
     */
    function createStatefulSwitch(switchId, checkedByDefault, switchCallback, labelText, labelTooltip, state, initConfig = { maxTry: 6, tryInterval: 500 }) {
        const label = createSwitchLabel(switchId, labelText, labelTooltip);
        const sw = createSwitchElement(switchId, checkedByDefault, switchCallback);
        const initializer = !state ? null : new Promise((resolve, reject) => {
            let tryCount = 1;
            const intervalId = setInterval(() => {
                console.log(`Try: ${tryCount}`);
                const success = switchCallback(state);
                if (success) {
                    console.log(`switch success, exiting`);
                    resolve();
                    clearInterval(intervalId);
                } else if (tryCount >= initConfig.maxTry) {
                    console.log(`Try count maxed out, abort`);
                    clearInterval(intervalId);
                    reject();
                } else {
                    console.log(`Fail to switch, wait for next try`);
                    tryCount++;
                }
            }, initConfig.tryInterval);
        }).then(() => {
            sw.checked = true;
        }).catch(() => {
            sw.checked = false;
        });

        return { label: label, switch: sw, initializer: initializer };
    }

    /*function createLayoutSwitch(switched) {
        return createLabelAndSwitchPair(
            'layoutSwitch',
            switched,
            '5:2排版',
            '調整排版，將左側常用的Description及Discussion放大。',
            event => switchWideLayout(event.target.checked)
        );
    }*/

    /*function createTaskBarSwitch(switched) {
        return createLabelAndSwitchPair(
            'taskBarSwitch',
            switched,
            '縮小task',
            '調整task bar，將不常用的元素隱藏並縮成一行。',
            event => switchTaskBar(event.target.checked)
        );
    }*/

    // Function for creating tool buttons
    function createToolButton(text, callback) {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.type = 'button';
        btn.addEventListener('click', callback);
        btn.classList.add('my-tool-button');
        return btn;
    }

    // Function for create the fold/expand button in comment cards
    function createCommentCardFoldButton(reacted = true) {
        const btnDiv = document.createElement('div');
        btnDiv.classList.add('my-expand-button-div');

        const btn = document.createElement('button');
        btn.innerText = reacted ? REACTED_COLLAPSE_BTN_CONTENT : NOT_REACTED_COLLAPSE_BTN_CONTENT;
        btn.classList.add('my-expand-button');
        btnDiv.appendChild(btn);

        return btnDiv;
    }

    // Functions to wrap elements into Util elements
    function wrapIntoTooltip(node, tooltipText) {
        const tooltipDiv = document.createElement('div');
        tooltipDiv.classList.add('my-tooltip');
        tooltipDiv.appendChild(node);

        const tooltipSpan = document.createElement('span');
        tooltipSpan.innerText = tooltipText;
        tooltipSpan.classList.add('my-tooltiptext');

        tooltipDiv.appendChild(tooltipSpan);
        return tooltipDiv;
    }

    const TRAY_ITEM_TYPE = {
        REFRESH_DIV: 'refresh-div',
        SEARCH_DIV: 'search-div',
        SWITCH_DIV: 'switch-div'
    };
    function wrapIntoTrayItem(node, type) {
        const trayItem = document.createElement('div');
        trayItem.classList.add('tray-item');
        if (type) trayItem.classList.add(type);

        if (Array.isArray(node)) {
            trayItem.append(...node);
        } else {
            trayItem.appendChild(node);
        }
        return trayItem;
    }

    // Functions for finding the first pure text div
    function isPureTextElement(node) {
        return node.nodeType === Node.TEXT_NODE
            || node.nodeType === Node.ELEMENT_NODE
            && !node.querySelector('img')
            && node.innerHTML !== '<br>';
    }


    // ========== ========== ========== ========== ========== ========== ==========
    // ========== ========== === Spec of each tool button === ========== ==========
    // ========== ========== ========== ========== ========== ========== ==========

    // Functions for the UPDATE tool button
    function refreshCommentCards(commentCards = [], reacted = true){
        commentCards.forEach(node=> {
            node.querySelector('div.my-expand-button-div')?.remove(); // Remove existing button if found

            const contentDivs = node.querySelector('div.comment-content').childNodes;
            const shrinkableDivs = [];
            let noFirstPureTextNode = true;
            for (const contentDiv of contentDivs) {
                if (noFirstPureTextNode && isPureTextElement(contentDiv)) {
                    noFirstPureTextNode = false;
                    continue;
                }
                contentDiv.classList.add('my-shrinkable');
                if (reacted) contentDiv.classList.add('my-shrunk');
                shrinkableDivs.push(contentDiv);
            }

            // Remove the first one if really no any pure text div
            if (noFirstPureTextNode) {
                const theFirst = shrinkableDivs.shift();
                theFirst.classList.remove('my-shrunk', 'my-shrinkable');
            }

            // Append the fold button
            const toggleButton = createCommentCardFoldButton(reacted).cloneNode('deep');
            toggleButton.addEventListener('click', (event) => toggleButtonCallback(shrinkableDivs, event));
            node.querySelector('div.comment-item-left').appendChild(toggleButton);
        });
    }

    function shrinkByCondition(commentCardsGroupByTrueFalse) {
        for (const truthyCard of commentCardsGroupByTrueFalse.true ?? []) {
            const shrinkableDivs = truthyCard.querySelectorAll('.my-shrinkable');
            shrinkableDivs.forEach(d => d.classList.add('my-shrunk'));
        }
        for (const falsyCard of commentCardsGroupByTrueFalse.false ?? []) {
            const shrinkableDivs = falsyCard.querySelectorAll('.my-shrinkable');
            shrinkableDivs.forEach(d => d.classList.remove('my-shrunk'));
        }

    }

    function switchWideLayout(setToWide = true) {
        const gridContainer = document.querySelector('div.work-item-grid.first-column-wide');
        const rightSection = document.querySelector('div.work-item-form-right');
        if (!gridContainer || !rightSection) return false;

        if (setToWide) {
            document.querySelector('div.work-item-grid.first-column-wide').style.gridTemplateColumns = '5fr 2fr';
            document.querySelector('div.work-item-form-right').style.gridArea = '1/2/2/3';
        } else {
            document.querySelector('div.work-item-grid.first-column-wide').style.gridTemplateColumns = null;
            document.querySelector('div.work-item-form-right').style.gridArea = null;
        }
        GM_setValue('SETTINGS', { ...SETTINGS, layoutSwitched: setToWide });
        return true;
    }

    function switchTaskBar(foldTaskBar = true) {
        const workItemFormHeader = document.querySelector('div.work-item-form-header');
        if (!workItemFormHeader) return false;

        if (foldTaskBar) {
            // 1. add paddin-top-4 to the bar for symmetric padding
            workItemFormHeader.classList.add('padding-top-4');

            // 2. change flex-direction to 'row'
            workItemFormHeader.classList.remove('flex-column');
            workItemFormHeader.classList.add('flex-row');

            // 3. add flex-grow to the second child
            workItemFormHeader.children[1].classList.add('flex-grow');

            // 4. hide useless elements in the thrid child
            workItemFormHeader.childNodes[2].childNodes[1].classList.add('hidden');
            workItemFormHeader.childNodes[2].childNodes[2].classList.add('hidden');
            workItemFormHeader.childNodes[2].childNodes[3].classList.add('hidden');
        } else {
            // undo everything
            workItemFormHeader.classList.remove('padding-top-4');
            workItemFormHeader.classList.add('flex-column');
            workItemFormHeader.classList.remove('flex-row');
            workItemFormHeader.children[1].classList.remove('flex-grow');
            workItemFormHeader.childNodes[2].childNodes[1].classList.remove('hidden');
            workItemFormHeader.childNodes[2].childNodes[2].classList.remove('hidden');
            workItemFormHeader.childNodes[2].childNodes[3].classList.remove('hidden');
        }
        GM_setValue('SETTINGS', { ...SETTINGS, taskBarSwitched: foldTaskBar });
        return true;
    }

    function locked(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
    }

    function toggleDescLock(lock = true) {
        const editor = document.querySelector('div[id^="__bolt-Description"]');
        if (!editor) return false;
        if (lock) {
            //alert(`Editor is now locked........`);
            //editor.contentEditable = 'false';
            editor.addEventListener('mousedown', locked, true);
            editor.addEventListener('mouseup', locked, true);
            editor.style.cursor = 'not-allowed';
            editor.title = '編輯功能已鎖定，關閉工具盤右下的描述鎖定以解除。';
        } else {
            //alert(`Editor is UNLOCKED!!!`);
            //editor.contentEditable = 'true';
            editor.removeEventListener('mousedown', locked, true);
            editor.removeEventListener('mouseup', locked, true);
            editor.style.cursor = null;
            editor.removeAttribute('title');
        }
        return true;
    };


    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
