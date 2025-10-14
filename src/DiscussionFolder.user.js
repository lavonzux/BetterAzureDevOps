// ==UserScript==
// @name         評論區摺疊小工具
// @namespace    https://github.com/lavonzux/BetterAzureDevOps
// @version      v0.9.8-alpha
// @description  在畫面右下角增加一工具箱，用以摺疊Discussion區塊中的comment卡片。
// @author       Anthony.Mai
// @match        https://dev.azure.com/fubonfinance/SYS_GA/_workitems/edit*
// @icon         https://cdn.vsassets.io/content/icons/favicon.ico
// @grant        none
// ==/UserScript==

// 工具盤預設打開
const TRAY_OPEN_BY_DEFAULT = true;
// 工具盤背景顏色
const TRAY_BACKGROUND_COLOR = `#adfe`;
// 工具箱開關按鈕顏色
const TRAY_TOGGLE_COLOR = `#f9a`;
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
const SWITCH_TRANSITION_DURATION = `0.2s`;
// 開啟時背景顏色
const SWITCH_ON_BACKGROUND_COLOR = `2196F3`;
// 關閉時背景顏色
const SWITCH_OFF_BACKGROUND_COLOR = `f7581a`;



(function() {
    'use strict';
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

        /* CSS classes for my toolbox tray */
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
          grid-template-columns: repeat(8, 1fr);
          gap: 0.25rem;
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
          position: relative;
          height: 100%;
        }
        .my-tooltip .my-tooltiptext {
          visibility: hidden;
          width: 150px;
          background-color: #000c;
          color: #fff;
          text-align: center;
          border-radius: 6px;
          padding: 5px 0;
          position: absolute;
          z-index: 1;
          bottom: 150%;
          left: 50%;
          margin-left: -75px;
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
          background-color: #2196F3;
        }
        input:not(:checked) + .slider {
          background-color: #f7581a;
        }

        input:checked + .my-slider:before {
          transform: translateX(calc(var(--switch-width) - var(--switch-height)));
        }
    `;
    document.head.appendChild(style);


    let lastClickedComment = null;
    const observer = new MutationObserver((_record, observer) => {

        // Early return if the tray was already there
        const myTray = document.body.querySelector('div.my-tray');
        if (myTray) return;

        const tray = document.createElement('div');
        tray.classList.add('my-tray', 'my-tray-shrunk');
        document.body.appendChild(tray);
        if (TRAY_OPEN_BY_DEFAULT) toggleTray(tray);

        const trayToggle = document.createElement('div');
        trayToggle.classList.add('my-tray-toggle');
        trayToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleTray(event.target.parentNode);
        });
        tray.appendChild(trayToggle);

        tray.appendChild(wrapIntoTrayItem(createRefreshButton(), TRAY_ITEM_TYPE.REFRESH_DIV));
        tray.appendChild(wrapIntoTrayItem(createExpandAllButton()));
        tray.appendChild(wrapIntoTrayItem(createShrinkAllButton()));
        tray.appendChild(wrapIntoTrayItem(createExpandReactedButton()));
        tray.appendChild(wrapIntoTrayItem(createShrinkReactedButton()));
        tray.appendChild(createSearchTool());


        // [Test] Create switches
        const testSw = createSwitch((event) => {
            const checked = event.target.checked;
            switchWideLayout(checked);
        });
        const warppedSw = wrapIntoTooltip(testSw, '切換為左側寬版排版');
        const switchDiv = createSwitchDiv([warppedSw]);
        tray.appendChild(switchDiv);

    });

    // Function universally used
    function findCommentCards(type) {
        // If discussion section or comment cards are null, early return
        const discussionSection = document.querySelector('div.work-item-form-discussion div.work-item-form-collapsible-section-content');
        if (!discussionSection) return[];
        const commentCards = discussionSection.querySelectorAll('div.comment-item.displayed-comment');
        if (commentCards.length <= 0) return[];

        // Return all cards if no type specified
        if (!type) return commentCards;

        const groupByReacted = Object.groupBy(commentCards, card => card.querySelector('.reaction-statusbar-placeholder') !== null );
        if (type === 'reacted') return groupByReacted.true;
        if (type === 'notReacted') return groupByReacted.false;

        // Fallback if given type is invalid
        return commentCards;
    }

    /**
     * Find comment cards and group them into two groups by given predicate
     */
    function findCommentCardsByPredicate(groupingPredicate = (_card) => true) {
        // If discussion section or comment cards are null, early return
        const discussionSection = document.querySelector('div.work-item-form-discussion div.work-item-form-collapsible-section-content');
        if (!discussionSection) return[];
        const commentCards = discussionSection.querySelectorAll('div.comment-item.displayed-comment');
        if (commentCards.length <= 0) return[];

        return Object.groupBy(commentCards, (card) => groupingPredicate(card));
    }


    const GROUPIND_PREDICATE = Object.freeze({
        BY_STRING_IGNORE_CASE: (stringToFind) => (commentCard) => !commentCard.textContent.toLowerCase().includes(stringToFind?.trim() || ''),
        BY_REACTION_EXIST: (commentCard) => commentCard.querySelector('.reaction-statusbar-placeholder') !== null
    });

    function toggleTray(tray) {
        if (tray.classList.contains('my-tray-shrunk')) {
            tray.classList.remove('my-tray-shrunk');
            tray.classList.add('my-tray-expand');
        } else {
            tray.classList.remove('my-tray-expand');
            tray.classList.add('my-tray-shrunk');
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


    // Functions for creating my elements

    function createRefreshButton() {
        const refreshButton = createToolButtonDiv(
            '🔃 更新摺疊按鈕狀態',
            function () {
                event.stopPropagation();
                const groupByReacted = findCommentCardsByPredicate(GROUPIND_PREDICATE.BY_REACTION_EXIST);
                updateReactedCommentCards(groupByReacted.true);
                updateNotReactedCommentCards(groupByReacted.false);
            },
            '更新評論卡片中摺疊按鈕的狀態，初次載入頁面時建議等完全載入後再按'
        );
        refreshButton.classList.add('refresh');
        return refreshButton;
    }
    function createShrinkAllButton() {
        const btnDiv = createToolButtonDiv(
            '📁 全部摺疊',
            function () {
                event.stopPropagation();
                const allTrue = findCommentCardsByPredicate();
                shrinkByCondition(allTrue);
            },
            '摺疊全部評論卡片'
        );
        return btnDiv;
    }
    function createExpandAllButton() {
        const btnDiv = createToolButtonDiv(
            '📂 全部展開',
            function () {
                event.stopPropagation();
                const allFalse = findCommentCardsByPredicate(() => false);
                shrinkByCondition(allFalse);
            },
            '展開全部評論卡片'
        );
        return btnDiv;
    }
    function createShrinkReactedButton() {
        const btnDiv = createToolButtonDiv(
            '⏫ 關已回應',
            function () {
                event.stopPropagation();
                const predicate = GROUPIND_PREDICATE.BY_REACTION_EXIST;
                const groupedCommentCards = findCommentCardsByPredicate(predicate);
                shrinkByCondition(groupedCommentCards);
            },
            '摺疊已反應的評論卡'
        );
        return btnDiv;
    }
    function createExpandReactedButton() {
        const btnDiv = createToolButtonDiv(
            '⏬ 開已回應',
            function () {
                event.stopPropagation();
                const predicate = (card) => !(GROUPIND_PREDICATE.BY_REACTION_EXIST(card));
                const groupedCommentCards = findCommentCardsByPredicate(predicate);
                shrinkByCondition(groupedCommentCards);
            },
            '打開已反應的評論卡'
        );
        return btnDiv;
    }

    function createSearchTool() {
        const searchDiv = document.createElement('div');
        searchDiv.classList.add('tray-item', 'search-div');

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = '輸入欲搜尋的文字';
        searchInput.classList.add('my-search-input');
        const searchTextBoxWithTooltip = wrapIntoTooltip(
            searchInput,
            '輸入欲搜尋的文字，會展開所有包含該文字的評論，並摺疊不包含該字串的評論。'
        );

        const searchBtn = createToolButton('🔍 搜尋', function() {
            event.stopPropagation();
            const targetString = document.querySelector('div.my-tray .tray-item.search-div input.my-search-input').value;
            const predicate = GROUPIND_PREDICATE.BY_STRING_IGNORE_CASE(targetString);
            const groupedCommentCards = findCommentCardsByPredicate(predicate);
            shrinkByCondition(groupedCommentCards);
        });

        searchDiv.appendChild(searchTextBoxWithTooltip);
        searchDiv.appendChild(searchBtn);

        return searchDiv;
    }
    function createSwitchDiv(switches) {
        const switchDiv = document.createElement('div');
        switchDiv.classList.add('tray-item', 'switch-div');
        switches.forEach(sw => {
            switchDiv.appendChild(sw);
        });
        return switchDiv;
    }
    function createSwitch(switchCallback) {
        const label = document.createElement('label');
        label.classList.add('my-switch');

        const checkbox = document.createElement('input');
        checkbox.setAttribute("type", "checkbox");
        checkbox.addEventListener('change', switchCallback);

        const slider = document.createElement('div');
        slider.classList.add('my-slider');

        label.appendChild(checkbox);
        label.appendChild(slider);

        return label;
    }

    // Function for creating tool buttons
    function createToolButtonDiv(btnText, btnCallback, tooltipText) {
        return wrapIntoTooltip(
            createToolButton(btnText, btnCallback),
            tooltipText
        );
    }
    function createToolButton(text, callback) {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.type = 'button';
        btn.addEventListener('click', callback);
        btn.classList.add('my-tool-button');
        return btn;
    }
    function createCollapseButton() {
        const btnDiv = document.createElement('div');
        btnDiv.classList.add('my-expand-button-div');

        const btn = document.createElement('button');
        btn.innerText = '↕️';
        btn.classList.add('my-expand-button');
        btnDiv.appendChild(btn);

        return btnDiv;
    }
    function createReactedCollapseButton(type) {
        const btnDiv = document.createElement('div');
        btnDiv.classList.add('my-expand-button-div');

        const btn = document.createElement('button');
        if (type && type === 'reacted') {
            btn.innerText = REACTED_COLLAPSE_BTN_CONTENT;
        } else {
            btn.innerText = NOT_REACTED_COLLAPSE_BTN_CONTENT;
        }

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
        if (type) {
            trayItem.classList.add(type);
        }
        trayItem.appendChild(node);
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
    function updateReactedCommentCards(commentCards) {
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
                contentDiv.classList.add('my-shrinkable', 'my-shrunk');
                shrinkableDivs.push(contentDiv);
            }
            if (noFirstPureTextNode) shrinkableDivs.shift(); // Remove the first one if really no any pure text div

            // Append the shrink fold button
            const toggleButton = createReactedCollapseButton('reacted').cloneNode('deep');
            toggleButton.addEventListener('click', (event) => toggleButtonCallback(shrinkableDivs, event));
            node.querySelector('div.comment-item-left').appendChild(toggleButton);
        });
    };
    function updateNotReactedCommentCards(commentCards) {
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
                shrinkableDivs.push(contentDiv);
            }
            if (noFirstPureTextNode) shrinkableDivs.shift(); // Remove the first one if really no any pure text div

            // Append the shrink fold button
            const toggleButton = createReactedCollapseButton().cloneNode('deep');
            toggleButton.addEventListener('click', (event) => toggleButtonCallback(shrinkableDivs, event));
            node.querySelector('div.comment-item-left').appendChild(toggleButton);
        });
    };


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
        if (!gridContainer || !rightSection) return;

        if (setToWide) {
            document.querySelector('div.work-item-grid.first-column-wide').style.gridTemplateColumns = '5fr 2fr';
            document.querySelector('div.work-item-form-right').style.gridArea = '1/2/2/3';
        } else {
            document.querySelector('div.work-item-grid.first-column-wide').style.gridTemplateColumns = null;
            document.querySelector('div.work-item-form-right').style.gridArea = null;
        }

    }

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
