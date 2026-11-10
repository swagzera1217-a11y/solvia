import fs from 'node:fs';
import path from 'node:path';
const SOL='So11111111111111111111111111111111111111112';
let cached=null, cachedAt=0, inflight=null;
async function json(url,options={}){const r=await fetch(url,{...options,signal:AbortSignal.timeout(10000)});if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json();}
export async function collectMarketData(){
 const symbols=['SOL','BTC','ETH','XRP','BNB','DOGE'];
 const offset=symbols.length*2;
 const jobs=symbols.flatMap(symbol=>[
  json(`https://data-api.binance.vision/api/v3/ticker/24hr?symbol=${symbol}USDT`),
  json(`https://data-api.binance.vision/api/v3/klines?symbol=${symbol}USDT&interval=1d&limit=30`)
 ]);
 jobs.push(json('https://data-api.binance.vision/api/v3/trades?symbol=SOLUSDT&limit=12'));
 jobs.push(json(`https://api.dexscreener.com/token-pairs/v1/solana/${SOL}`));
 jobs.push(json('https://api.mainnet-beta.solana.com',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'getSlot',params:[{commitment:'confirmed'}]})}));
 const results=await Promise.allSettled(jobs);
 const val=i=>results[i].status==='fulfilled'?results[i].value:null;
 const markets=symbols.map((symbol,i)=>{const t=val(i*2),k=val(i*2+1);return {symbol,price:t?Number(t.lastPrice):null,change:t?Number(t.priceChangePercent):null,high:t?Number(t.highPrice):null,low:t?Number(t.lowPrice):null,volume:t?Number(t.quoteVolume):null,sourceTime:t?.closeTime||null,candles:Array.isArray(k)?k.map(c=>({time:c[0],open:Number(c[1]),high:Number(c[2]),low:Number(c[3]),close:Number(c[4]),volume:Number(c[5])})):[]};});
 const pairs=val(offset+1);
 const pools=Array.isArray(pairs)?pairs.filter(p=>p.chainId==='solana'&&p.liquidity?.usd>10000&&p.priceUsd).sort((a,b)=>(b.volume?.h24||0)-(a.volume?.h24||0)).slice(0,12).map(p=>({id:p.pairAddress,url:p.url,dex:p.dexId,base:p.baseToken,quote:p.quoteToken,price:Number(p.priceUsd),change:p.priceChange?.h24??null,liquidity:p.liquidity?.usd??null,volume:p.volume?.h24??null,buys:p.txns?.h24?.buys??0,sells:p.txns?.h24?.sells??0,image:p.info?.imageUrl||null})):[];
 const tape=Array.isArray(val(offset))?val(offset).map(t=>({id:t.id,time:t.time,price:Number(t.price),quantity:Number(t.qty),side:t.isBuyerMaker?'Sell':'Buy'})).reverse():[];
 const network=val(offset+2);
 if(!markets.some(m=>m.price)&&!pools.length)throw new Error('Public market sources unavailable');
 return {asOf:new Date().toISOString(),snapshot:false,markets,pools,tape,network:{name:'Solana mainnet',slot:network?.result??null},sources:{prices:'Binance public market data (USDT reference)',pools:'DexScreener · Solana',network:'Solana public mainnet RPC'},errors:results.map((r,i)=>r.status==='rejected'?{source:i,message:'Source temporarily unavailable'}:null).filter(Boolean)};
}
function snapshot(){for(const file of [path.join(process.cwd(),'data','snapshot.json'),new URL('../data/snapshot.json',import.meta.url)]){try{const data=JSON.parse(fs.readFileSync(file,'utf8'));return {...data,snapshot:true};}catch{}}return {asOf:null,snapshot:true,markets:[],pools:[],tape:[],network:{slot:null},errors:[{message:'Market data unavailable. Try refresh.'}]};}
export async function getMarketData(){if(cached&&Date.now()-cachedAt<20000)return cached;if(!inflight)inflight=collectMarketData().then(d=>{cached=d;cachedAt=Date.now();return d;}).catch(()=>cached?{...cached,snapshot:true}:snapshot()).finally(()=>inflight=null);return inflight;}
export default async function handler(req,res){if(req.method!=='GET'){res.statusCode=405;res.end('Method not allowed');return;}res.setHeader('content-type','application/json');res.setHeader('Cache-Control','s-maxage=20, stale-while-revalidate=40');res.end(JSON.stringify(await getMarketData()));}
