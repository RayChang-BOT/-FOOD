window.HuntersFeastStorage=(()=>{
const KEY="hunters-feast-history-v1";
function getHistory(){try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch{return[]}}
function addHistory(entry){const list=[entry,...getHistory()].slice(0,6);localStorage.setItem(KEY,JSON.stringify(list));return list}
function clearHistory(){localStorage.removeItem(KEY)}
return{getHistory,addHistory,clearHistory}
})();
