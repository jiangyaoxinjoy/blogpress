const __vite__fileDeps=["assets/chunks/index-B7R-03qP.rwFbp1-3.js","assets/chunks/namespace-BzafXSza.D48SLZaH.js","assets/chunks/index-DPELaqHR.B9yhFX-f.js","assets/chunks/DC.Loader-DVLiKROI.bdwaIapM.js","assets/chunks/DC.Billboard-PmQQ7euw.ChfjaA3c.js","assets/chunks/DC.Pulgins.Loader-DSh-y5Xd.CFhRFpa_.js"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
import{a5 as o}from"./framework.D9UbSEwM.js";const n="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkODY3ZTZhNC1mOTY2LTRhNTctYjlhYy1iMjY2OGM4MWNlMTQiLCJpZCI6MTI0MTgwLCJpYXQiOjE3MTk1NDA1MzR9.lpurU9QpT6MeJVK3lEXaWClfYuqb5xNZG6MV7yoJkVM";let d={},_=!1,e={Http:void 0,Version:"0.3.1",Config:{}};const r=async()=>o(()=>import("https://www.unpkg.com/cesium@1.118.2/Build/Cesium/index.js"),[]).then(i=>{window.CESIUM_BASE_URL="https://www.unpkg.com/cesium@1.118.2/Build/Cesium/",i.Ion.defaultAccessToken=n,d.Cesium=i});e.noConflict=(i="DC")=>{delete window[i],window[i]=window.DC};e.getNamespace=()=>d;e.init=i=>{o(()=>import("./log-BLuEpJCZ.B0yXoFAB.js"),[]),delete window.DC,window.DC=e,d.mapv=window.mapv||void 0,delete window.mapv,e.ready(i)};e.ready=i=>{try{_?i&&i():r().then(()=>{Promise.all([o(()=>import("./index-B7R-03qP.rwFbp1-3.js"),__vite__mapDeps([0,1])),o(()=>import("./index-DPELaqHR.B9yhFX-f.js"),__vite__mapDeps([2,1])),o(()=>import("./DC.Loader-DVLiKROI.bdwaIapM.js"),__vite__mapDeps([3,1,4])),o(()=>import("./DC.Pulgins.Loader-DSh-y5Xd.CFhRFpa_.js"),__vite__mapDeps([5,1,4]))]).then(()=>{delete window.Cesium,i&&i(),_=!0}).catch(t=>{console.log("🚀 ~ import ~ err:",t)})})}catch(t){delete window.Cesium,_=!1,console.log("🚀 ~ e:",t)}};export{e as i};
