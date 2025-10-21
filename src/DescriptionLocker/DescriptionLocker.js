// ==UserScript==
// @name         DescriptionLocker
// @name:zh      描述區編輯鎖
// @namespace    https://github.com/lavonzux/BetterAzureDevOps
// @version      1.0-release
// @description  Adding a lock to the description block Azure devOps work item page.
// @description:zh 將 Azure DevOps Task 的描述區塊鎖上，並新增一個上鎖/解鎖按鈕。
// @author       Anthony.Mai
// @match        https://dev.azure.com/fubonfinance/SYS_GA/_workitems/edit*
// @icon         https://cdn.vsassets.io/content/icons/favicon.ico
// @grant        none
// @license      Apache License 2.0
// ==/UserScript==

(function() {
    'use strict';

    // Add customized style class first
    const style = document.createElement('style');
    style.innerHTML = `
    #toggle-edit-btn {
        padding: 6px 12px;
        font-size: 13px;
        border: 1px solid #ccc;
        border-radius: 4px;
        color: white;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .edit-disabled {
        background-color: #0078d4;
    }
    .edit-disabled:hover {
        background-color: #005a9e;
    }

    .edit-enabled {
        background-color: #F41;
    }
    .edit-enabled:hover {
        background-color: #F84;
    }
`;
    document.head.appendChild(style);

    function stopPropagation(event) {
        event.stopPropagation();
    }

    // Add an observer for adding the button
    const observer = new MutationObserver(() => {

        const header = document.querySelector('.work-item-form-collapsible-header[aria-controls^="__bolt-Description"]');

        if (header) {
            const editor = document.querySelector('.lean-rooster.rooster-editor');
            if (editor) {
                console.log(`Description editor is locked......`);
                editor.contentEditable = 'false';
            }
        }

        // Prevent duplicate buttons
        if (header && !document.getElementById('toggle-edit-btn')) {
            const btnDiv = document.createElement('div');
            btnDiv.classList.add('flex-row');
            btnDiv.style.height = '80%';

            const btn = document.createElement('button');
            btn.innerText = '🔓 Unlock editor';
            btn.type = 'button';
            btn.id = 'toggle-edit-btn';
            btn.classList.add('edit-disabled');

            btn.addEventListener('click', function(event) {
                event.stopPropagation();
                toggleEdit();
            });

            btnDiv.append(btn);
            header.firstChild?.after(btnDiv);

            // Stop the observer after button is added
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });


    function toggleEdit() {
        const editor = document.querySelector('.lean-rooster.rooster-editor');
        const editable = editor.contentEditable === 'true';
        const btn = document.querySelector('#toggle-edit-btn');
        if (editable) {
            btn.classList.toggle('edit-enabled');
            btn.classList.toggle('edit-disabled');
            btn.innerText = '🔓 Unlock editor';
            // alert(`Editor is now locked........`);
            editor.contentEditable = 'false';
            editor.removeEventListener('click', stopPropagation);
        } else {
            btn.classList.toggle('edit-enabled');
            btn.classList.toggle('edit-disabled');
            btn.innerText = '🔒 Lock editor';
            alert(`Editor is UNLOCKED!!!`);
            editor.contentEditable = 'true';
            editor.addEventListener('click', stopPropagation);
        }

    }
})();