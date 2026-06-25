(function(){"use strict";const d={},A="v14.3",N=I((d==null?void 0:d.VITE_P533_DATA_URL)||"/api/p533-data/"),P=(d==null?void 0:d.VITE_P533_DATA_VERSION)||A,M="p533-data",T=1,h="files",U="P1239-3 Decile Factors.txt",D="P1239-3-Decile-Factors.txt.gz",y=new Map;let g=null;function I(t){return t.endsWith("/")?t:t+"/"}function R(t){const e=t.includes("?")?"&":"?";return`${N}${t}${e}v=${encodeURIComponent(P)}`}function O(t){const e=Number(t);if(!Number.isInteger(e)||e<1||e>12)throw new Error(`p533 dataLoader: invalid month ${t} (expected 1-12)`);return String(e).padStart(2,"0")}function C(t){const e=O(t);return[{asset:`ionos${e}.bin.gz`,canonical:`ionos${e}.bin`},{asset:`COEFF${e}W.txt.gz`,canonical:`COEFF${e}W.txt`}]}function L(){return new Promise((t,e)=>{const r=indexedDB.open(M,T);r.onupgradeneeded=()=>{const n=r.result;n.objectStoreNames.contains(h)||n.createObjectStore(h)},r.onsuccess=()=>t(r.result),r.onerror=()=>e(r.error)})}function S(t){return`${P}/${t}`}async function q(t){try{const e=await L();return await new Promise((r,n)=>{const a=e.transaction(h,"readonly").objectStore(h).get(S(t));a.onsuccess=()=>r(a.result??null),a.onerror=()=>n(a.error)})}catch{return null}}async function B(t,e){try{const r=await L();await new Promise((n,o)=>{const a=r.transaction(h,"readwrite");a.objectStore(h).put(e,S(t)),a.oncomplete=n,a.onerror=()=>o(a.error)})}catch{}}async function X(t){const e=await crypto.subtle.digest("SHA-256",t);return Array.from(new Uint8Array(e)).map(r=>r.toString(16).padStart(2,"0")).join("")}async function k(){return g||(g=(async()=>{const t=await fetch(R("manifest.json"),{cache:"no-cache"});if(!t.ok)throw g=null,new Error(`p533 manifest fetch failed: ${t.status}`);return await t.json()})()),g}async function j(t){var e;try{const n=(e=(await k()).files)==null?void 0:e.find(o=>o.name===t);return(n==null?void 0:n.sha256)??null}catch{return null}}async function W(t){const r=new Response(t).body.pipeThrough(new DecompressionStream("gzip")),n=await new Response(r).arrayBuffer();return new Uint8Array(n)}async function H(t){const e=R(t),r=await fetch(e);if(!r.ok)throw new Error(`p533 fetch ${t} failed: ${r.status} ${r.statusText}`);const n=new Uint8Array(await r.arrayBuffer()),o=await j(t);if(o){const a=await X(n);if(a!==o)throw new Error(`p533 ${t}: sha256 mismatch (expected ${o}, got ${a})`)}return await W(n)}async function b(t){const e=await q(t);if(e)return e;if(y.has(t))return y.get(t);const r=H(t).then(async n=>(await B(t,n),n));y.set(t,r);try{return await r}finally{y.delete(t)}}async function z(t){const e=C(t),r=await Promise.all(e.map(n=>b(n.asset)));return e.map((n,o)=>({name:n.canonical,bytes:r[o]}))}async function G(){const t=await b(D);return{name:U,bytes:t}}const V=[1.8,3.5,7.1,10.1,14.1,18.1,21.1,24.9,28.1];function _(t){const{txLat:e,txLon:r,rxLat:n,rxLon:o,year:a,month:i,hour:s,ssn:u=100,txPower:l=100,txGain:f=0,rxGain:w=0,frequencies:m=V,manMadeNoise:p="RESIDENTIAL",requiredReliability:c=90,requiredSNR:F=15,pathName:Q="OpenHamClock"}=t;for(const x of["txLat","txLon","rxLat","rxLon","year","month"])if(!Number.isFinite(t[x]))throw new Error(`predict: params.${x} must be a finite number (got ${t[x]})`);if(!Number.isInteger(i)||i<1||i>12)throw new Error(`predict: params.month must be 1-12 (got ${i})`);const E=Number.isFinite(s)?Math.trunc(s):12,Y=E===0?24:E,v=m.map(x=>x.toFixed(3)).join(", ");return`PathName "${Q}"
PathTXName "TX"
Path.L_tx.lat ${e.toFixed(4)}
Path.L_tx.lng ${r.toFixed(4)}
TXAntFilePath "ISOTROPIC"
TXGOS ${f.toFixed(1)}
PathRXName "RX"
Path.L_rx.lat ${n.toFixed(4)}
Path.L_rx.lng ${o.toFixed(4)}
RXAntFilePath "ISOTROPIC"
RXGOS ${w.toFixed(1)}
AntennaOrientation "TX2RX"
Path.year ${a}
Path.month ${i}
Path.hour ${Y}
Path.SSN ${u}
Path.frequency ${v}
Path.txpower ${(10*Math.log10(l)).toFixed(1)}
Path.BW 3000
Path.SNRr ${F}
Path.SNRXXp ${c}
Path.ManMadeNoise "${p}"
Path.Modulation ANALOG
Path.SorL SHORTPATH
LL.lat ${n.toFixed(4)}
LL.lng ${o.toFixed(4)}
LR.lat ${n.toFixed(4)}
LR.lng ${o.toFixed(4)}
UL.lat ${n.toFixed(4)}
UL.lng ${o.toFixed(4)}
UR.lat ${n.toFixed(4)}
UR.lng ${o.toFixed(4)}
DataFilePath "/data/"
RptFilePath "/tmp/"
RptFileFormat "RPT_BMUF | RPT_PR | RPT_SNR | RPT_BCR"
`}function K(t){const e={frequencies:[]};if(!t)return e;const r=t.split(`
`),n={};for(const i of r){const s=i.match(/^Column\s+(\d+):\s*(\S+)/);s&&(n[s[2]]=parseInt(s[1],10)-1)}const o={freq:n.Frequency??2,pr:n.Pr??3,snr:n.SNR??4,bcr:n.BCR??5,bmuf:n.BMUF};let a=!1;for(const i of r){const s=i.trim();if(s.includes("Calculated Parameters")&&!s.includes("End")){a=!0;continue}if(a&&(s.includes("End Calculated")||s.startsWith("*****"))&&e.frequencies.length>0)break;if(a&&s&&!s.startsWith("*")&&!s.startsWith("-")&&!s.startsWith("Column")){const u=s.split(",").map(l=>l.trim());if(u.length>=6){const l=parseFloat(u[o.freq]),f=parseFloat(u[o.pr]),w=parseFloat(u[o.snr]),m=parseFloat(u[o.bcr]);if(Number.isFinite(l)&&l>0&&e.frequencies.push({freq:l,sdbw:f,snr:w,reliability:m}),o.bmuf!=null&&e.muf==null){const p=parseFloat(u[o.bmuf]);Number.isFinite(p)&&(e.muf=p)}}}}if(e.muf==null){const i=t.match(/(?:Operational MUF|BMUF|MUF)\s*[:=]\s*([\d.]+)/i);if(i){const s=parseFloat(i[1]);Number.isFinite(s)&&(e.muf=s)}}return e}async function Z({createModule:t,params:e,dataFiles:r,moduleOptions:n={}}){if(typeof t!="function")throw new Error("predict: createModule factory is required");if(!Array.isArray(r)||r.length===0)throw new Error("predict: dataFiles must be a non-empty array");const o=_(e);let a="",i="";const s=await t({noInitialRun:!0,noExitRuntime:!0,print:c=>{a+=c+`
`},printErr:c=>{i+=c+`
`},...n}),{FS:u}=s;u.mkdirTree("/data"),u.mkdirTree("/tmp");for(const c of r)u.writeFile(`/data/${c.name}`,c.bytes);u.writeFile("/input.txt",o);const l=Date.now();let f;try{f=s.callMain(["/input.txt","/tmp/output.txt"])}catch(c){const F=c&&c.message?c.message:String(c);throw new Error(`predict: callMain threw: ${F}
--- stderr ---
${i}`)}const w=Date.now()-l;if(f!==0)throw new Error(`predict: main() returned ${f}
--- stdout ---
${a}
--- stderr ---
${i}`);let m;try{m=new TextDecoder().decode(u.readFile("/tmp/output.txt"))}catch(c){const F=c&&c.message?c.message:String(c);throw new Error(`predict: no report file written: ${F}`)}const p=K(m);return{model:"ITU-R P.533-14",engine:"wasm-p533",elapsed:w,params:{txLat:e.txLat,txLon:e.txLon,rxLat:e.rxLat,rxLon:e.rxLon,hour:e.hour,month:e.month,year:e.year,ssn:e.ssn},...p}}let $=null;async function J(t){return $||($=import(t).then(e=>e.default).catch(e=>{throw $=null,e})),$}self.onmessage=async t=>{const{id:e,type:r,params:n,wasmUrl:o}=t.data||{};if(r!=="predict"){self.postMessage({id:e,type:"error",message:`worker: unknown message type "${r}"`});return}if(!o){self.postMessage({id:e,type:"error",message:"worker: wasmUrl is required"});return}try{const a=await J(o),[i,s]=await Promise.all([z(n.month),G()]),u=[...i,s],l=await Z({createModule:a,params:n,dataFiles:u});self.postMessage({id:e,type:"result",data:l})}catch(a){self.postMessage({id:e,type:"error",message:a&&a.message?a.message:String(a)})}}})();
