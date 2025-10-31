# Change Log
版本號皆以 `DiscussionFolder` 的版本為準，其餘小工具最終都會融合到它裡面。

---

## [0.9.10-beta] 2025-10-31

---

### Added
- Implemented stateful switch
- Integrated TaskbarSwitch
- Integrated DescriptionLocker

### Changed
- Refactored functions for creating switch and label

### Fixed
- Improved some minor styling issue

## [0.9.9-beta] 2025-10-21

---

### Added
- Finalized layout switch toggle
- Added DescriptionLocker.js
- Added HeaderFolder.js

_Nots that all other scripts will eventually be merged into DiscussionFolder.js as toggle switch tools_

### Changed
- Refactored functions for better readability

### Fixed
- Refresh function failing when all comment cards are truthy / falsy for shrinking

## [0.9.7-alpha] 2025-10-09

---

### Added
- 新增排版設置開關按鈕，整合版面調整相關工具
  - 左側寬版
  - 隱藏task區塊
  - 描述區編輯鎖

## [0.9.3-beta] 2025-09-25

---

### Fixed
- 改善滾動到評論卡片的視覺效果
- 調整滾動到評論的座標，與 highlight 外框切齊

## [0.9.2-beta] 2025-09-16

---

### Fixed
- 改善在初次按下更新、工具箱展開時的視覺效果
- 調整 overflow 避免按鈕超出工具箱空間
- 按鈕文字展開時不再會換行導致按鈕高度變化
