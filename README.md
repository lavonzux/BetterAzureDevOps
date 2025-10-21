# BetterAzureDevOps
A Tampermonkey script that makes Azure DevOps's work item page looks better. 


不小心點到描述區就改到東西了嗎?<br>
comment 太多不知道哪些做完哪些還沒嗎?<br>
想搜尋 comment 內容可是內建的搜尋不知道搜到哪裏去嗎?

讓 BetterAzureDevOps 來節省你的san值還有腕隧道症候群。

---
## Features

這個 Repo 目前包含以下三個 Script

### 評論區摺疊工具
改善評論區 (discussion) 的呈現方式，可以將每個評論區塊折疊起來節省你的螢幕空間。

### 描述編輯器上鎖工具
將描述區 (description) 鎖上，防止意外編輯，並新增一個上鎖/解鎖按鈕。

### 標題列摺疊工具
將上方不常用的 task 縮小，節省螢幕空間讓你的螢幕可以塞的下更多的工項 comment。

---
## Installation
1.  **(推薦)** 從 GreasyFork 安裝。[連結](https://greasyfork.org/zh-TW/scripts/552528)。
2. 到 releases 下載打包好的 zip 檔，在 tampermonkey 使用匯出及匯入工具進行匯入。

---
## Roadmap

#### DiscussionFolder (評論區摺疊工具)
- [x] 可開合的工具箱。
- [x] 全部開啟或關閉已反應的評論。
- [ ] 整合其他腳本到工具托盤中。
    - [ ] `DescriptionLocker (描述編輯器上鎖工具)` 
    - [ ] `HeaderFolder (標題列摺疊工具)`
- [ ] 跳到下一個展開的評論卡。

#### DescriptionLocker (描述編輯器上鎖工具)
- [ ] `DescriptionLocker (描述編輯器上鎖工具)` 基於 div 覆蓋的 DescriptionLocker (描述編輯器上鎖工具)。
- [ ] `DescriptionLocker (描述編輯器上鎖工具)` 修正會超出編輯區塊的欄寬編輯器。

#### HeaderFolder (標題列摺疊工具)
- [ ] `HeaderFolder (標題列摺疊工具)` 編輯描述的時候自動展開，以便按下儲存按鈕。

---
## Versions
- 3個工具有各自的版本號，基本上以 DiscussionFolder (評論區摺疊工具) 的版本為主。
- 全部整合到同一個工具後會正式 release 為 v1.0。

---
## Known issues
- 頁面載入時無法自動執行更新按鈕的功能
- 切換到其他功能分頁時，腳本產生的按鈕會消失
- 部分 comment 無法進行摺疊

---
## License
```
Copyright 2025 Anthony.Mai(lavonzux@gmail.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

---
## Extras
關於 tampermonkey 的安裝及使用請參考它們的 [官方文件](https://www.tampermonkey.net/)。

- [tampermonkey (chrome web store)](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=zh-TW)
- [tampermonkey (firefox add-ons)](https://addons.mozilla.org/zh-TW/firefox/addon/tampermonkey/)
