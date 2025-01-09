// ==UserScript==
// @name         康軒數位高手 KNSHUtility Lite
// @namespace    http://vochant.github.io/
// @version      2.3
// @description  KNSH Utility - Cracks & Features
// @author       Mirekintoc (vochant)
// @match        https://digitalmaster.knsh.com.tw/v3/pages/*/index.html*
// @match        https://digitalmaster.knsh.com.tw/ebooks/BookMain/Viewer_*/index.html*
// @icon         https://webetextbook.knsh.com.tw/Ebookvieweran4Teacher/favicon.ico
// @license      MIT
// @grant        unsafeWindow
// ==/UserScript==
// https://gist.github.com/aliyaliu368/891eef75e09494e965d291ead4a80d17?permalink_comment_id=5217645#gistcomment-5217645
(function() {
    console.log(unsafeWindow);
    // 頁面類型判定
    if (/https:\/\/digitalmaster\.knsh\.com\.tw\/v3\/pages\/[^/]+\/index\.html.*/.test(location.href)) {
        console.log("運行模式: 導覽頁");
        // 導覽頁面 - 繞過登入驗證
        unsafeWindow.__fetch = unsafeWindow.fetch;
        unsafeWindow.fetch = async function(url, opts) {
            if (/verifykeygrip/i.test(url)) { return { json: function() { return { isValid: true }; } }; }
            try {
                let rData = await unsafeWindow.__fetch(url, opts);
                let r = await rData.json();
                return { json: function() { return JSON.stringify(r).includes("errorType") ? { isValid: true } : r; } };
            } catch { return { json: function() { return { isValid: true }; } }; }
        };
    } else if (/https:\/\/digitalmaster\.knsh\.com\.tw\/ebooks\/BookMain\/Viewer_[A-Z]\/index\.html.*/.test(location.href)) {
        console.log("運行模式: 國小電子書");
        // 國小電子書頁面 - 繞過登入驗證
        unsafeWindow.SaveCommForKnshAPIOriginal = unsafeWindow.SaveCommForKnshAPI; // 備份原構造函數
        unsafeWindow.SaveCommForKnshAPI = function() {
            let obj = new SaveCommForKnshAPIOriginal ();
            obj.VerifyHasLogin = function(arg) {
                var t = senjClass.GetQueryString("shortcode");
                var n = function(t) { arg && arg.fun && arg.fun(t) };
                n({result: true});
                return true;
            };
            console.log(obj);
            return obj;
        }; // 重寫構造函數
    }
    else { console.log('運行模式未知'); }
})();
