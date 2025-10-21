// ==UserScript==
// @name         HeaderFolder
// @name:zh      縮小標題列
// @namespace    https://github.com/lavonzux/BetterAzureDevOps
// @version      1.0.1-beta
// @description  Make the less used header foldable.
// @description:zh 為標題列的綠色狀態條新增點擊縮放標題列的功能。
// @author       Anthony.Mai
// @match        https://dev.azure.com/fubonfinance/SYS_GA/_workitems/edit/*
// @icon         https://cdn.vsassets.io/content/icons/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @license      Apache License 2.0
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        .my-decobar{}
        .my-expanded-header{
            cursor: zoom-out;
        }
        .my-folded-header{
            cursor: zoom-in;
        }
    `;
    document.head.appendChild(style);

    function toggleExcessiveHeader() {
        const header = document.querySelector('div.work-item-form-header');
        if (header.childNodes[1].style.display === '') {
            foldHeader();
        } else {
            extenseHeader();
        }
    }

    function foldHeader() {
        const header = document.querySelector('div.work-item-form-header');
        header.childNodes[1].style.display = 'none'
        header.childNodes[2].style.display = 'none';

        const foldedHeader = document.querySelector('div.work-item-form-header');
        header.addEventListener('click', extenseHeader);
        header.classList.add('my-folded-header');

        const decobar = document.querySelector('div.work-item-form-header-type-deco');
        decobar.classList.add('my-folded-header');
        decobar.classList.remove('my-expanded-header');
        console.log(GM_getValue('betterAzureDevOpsSettings'));
        GM_setValue('betterAzureDevOpsSettings', {taskbarFolded: true});
    }

    function extenseHeader() {
        const header = document.querySelector('div.work-item-form-header');

        header.childNodes[1].style.display = ''
        header.childNodes[2].style.display = '';

        const foldedHeader = document.querySelector('div.work-item-form-header');
        foldedHeader.removeEventListener('click', extenseHeader);
        foldedHeader.classList.remove('my-folded-header');

        const decobar = document.querySelector('div.work-item-form-header-type-deco');
        decobar.classList.add('my-expanded-header');
        decobar.classList.remove('my-folded-header');
        console.log(GM_getValue('betterAzureDevOpsSettings'));
        GM_setValue('betterAzureDevOpsSettings', {taskbarFolded: false});
    }

    const observer = new MutationObserver((_records, observer) => {
        const decobar = document.querySelector('div.work-item-form-header-type-deco');
        if (!decobar) return;
        if (decobar.classList.contains('my-decobar')) return;

        if (decobar && !decobar.classList.contains('my-decobar')) {
            console.log(`found the decobar!`);
            decobar.classList.add('my-decobar');
            decobar.addEventListener('click', toggleExcessiveHeader);

            console.log(GM_setValue('betterDevOpsSettings'));
            const settings = GM_getValue('betterAzureDevOpsSettings', null);
            if (settings === null || settings.taskbarFolded === true) {
                toggleExcessiveHeader();
            }

            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();