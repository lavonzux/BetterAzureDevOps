# BetterAzureDevOps
A Tampermonkey script that makes Azure DevOps's work item page looks better. 


不小心點到描述區就改到東西了嗎?<br>
comment 太多不知道哪些做完哪些還沒嗎?<br>
想搜尋 comment 內容可是內建的搜尋不知道搜到哪裏去嗎?

讓 BetterAzureDevOps 來節省你的san值還有腕隧道症候群。

## Features

這個 Repo 目前包含以下三個 Script

### 評論區摺疊小工具
改善評論區 (discuss) 的呈現方式，可以將每個評論區塊折疊起來節省你的螢幕空間。

### 描述區編輯鎖
將描述區 (description) 鎖上，防止意外編輯，並新增一個上鎖/解鎖按鈕。

### 縮小標題列
將上方不常用的 task 縮小，節省螢幕空間讓你的螢幕可以塞的下落落長的調整工項 comment。


## Installation

1. 從 GreasFork 安裝。
2. 到 releases 下載打包好的 zip 檔，在 tampermonkey 使用匯出及匯入工具進行匯入。


## Roadmap

- [ ] 整合所有工具，版面配置開關放到工具托盤中。
- [x] `評論區摺疊小工具` 可開合的工具箱。
- [x] `評論區摺疊小工具` 統一開啟或關閉已反應的評論。
- [ ] `縮小標題列` 編輯描述的時候自動展開，以便按下儲存按鈕。

## Versions

目前3小工具有各自的版本號，全部整合到同一個工具後會正式 release 為 v1.0。


## Known issues

- 由於 Azure DevOps 是用前端框架寫的，許多元素會即時動態的渲染，因此尚無法做到頁面載入時自動執行更新按鈕的功能，切換畫面時，腳本的部分功能、按鈕可能會消失。

## Extras

關於 tampermonkey 的安裝及使用請參考它們的 [官方文件](https://www.tampermonkey.net/)。

- [tampermonkey (chrome web store)](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=zh-TW)
- [tampermonkey (firefox add-ons)](https://addons.mozilla.org/zh-TW/firefox/addon/tampermonkey/)
