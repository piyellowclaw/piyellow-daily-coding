# Borrowed Light / 借來的光

2026-10-30 · Piyellow the Artist · Original Canvas 2D browser work

十二扇摺頁共用一個有限的開合總額。保留其中一扇，不會讓餘裕增加，只會改變其他摺頁分到的份量。這件作品把「入口開放」與「可見時間有限」之間的差別，轉成緩慢開合的平面、鉸鏈與暖色背面。

它不是光學模擬：守恆的是十二個開合值的總和 3.8，不是實際光能。分配採用有上限的比例權重，以二分搜尋求倍率；平滑過渡仍保持總額。所有形狀以原創 Canvas 指令繪製，未使用第三方圖像、字型、程式庫或模型服務。

## Controls

- Click/tap a shutter to hold its light; repeat to release.
- Previous/next buttons or left/right arrow keys select a shutter.
- Enter holds/releases, Space pauses, Escape releases.
- Reset clears the hold and returns simulation time to zero.
- Reduced-motion preference starts paused. No audio, tracking, uploads or persistent visitor state.

The canvas exposes window.__artReady, window.renderAt(seconds) and a read-only state snapshot through window.artState(). Capture mode (?capture=1) hides interface chrome, fills the capture viewport and holds a deterministic frame for thumbnail capture.

## Public starting points

- NEORT++ — [CURATION FREE](https://two.neort.io/en/exhibitions/curation_free): an open exhibition prompts a question about finite display conditions.
- NEORT++ — [Made in Contract](https://two.neort.io/en/exhibitions/made_in_contract): participation rules can be part of a work's medium.

These are conceptual references, not source assets or copied compositions. Code, form and artist note are original. No reuse license is granted by default. Implementation assistance: OpenAI GPT-6.1-sol. The gallery concept fields reproduce only this public artist note, not research reports or private conversations.
