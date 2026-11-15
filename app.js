const demoGroups = [
 {id:1,type:"flight",from:"Bhubaneswar",to:"Delhi",fromCode:"BBI",toCode:"DEL",date:"2026-12-18",joined:22,target:30,indicative:6200,provider:"Airline group quote not requested",status:"Group forming"},
 {id:2,type:"bus",from:"Jharsuguda",to:"Bhubaneswar",fromCode:"JSG",toCode:"BBI",date:"2026-12-05",joined:16,target:20,indicative:650,provider:"Bus operator quote pending",status:"Group forming"},
 {id:3,type:"flight",from:"Delhi",to:"Mumbai",fromCode:"DEL",toCode:"BOM",date:"2026-12-22",joined:8,target:25,indicative:4800,provider:"Airline group quote not requested",status:"Group forming"},
 {id:4,type:"bus",from:"Kolkata",to:"Bhubaneswar",fromCode:"CCU",toCode:"BBI",date:"2026-12-10",joined:27,target:30,indicative:900,provider:"Operator quote pending",status:"Almost full"},
 {id:5,type:"bus",from:"Bhubaneswar",to:"Puri",fromCode:"BBI",toCode:"PURI",date:"2026-12-02",joined:11,target:15,indicative:300,provider:"Operator quote pending",status:"Group forming"},
 {id:6,type:"flight",from:"Mumbai",to:"Bengaluru",fromCode:"BOM",toCode:"BLR",date:"2026-12-27",joined:18,target:25,indicative:3900,provider:"Airline group quote not requested",status:"Group forming"}
];
let activeType = "all", selectedGroup = null;
const grid = document.getElementById("groupGrid");
const money = n => "₹" + Number(n).toLocaleString("en-IN");
function prettyDate(s){return new Date(s+"T12:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});}
function render(){
 let list = demoGroups.filter(g => (activeType==="all" || g.type===activeType));
 const from = document.getElementById("fromSearch").value.trim().toLowerCase();
 const to = document.getElementById("toSearch").value.trim().toLowerCase();
 const date = document.getElementById("dateSearch").value;
 if(from) list=list.filter(g=>g.from.toLowerCase().includes(from));
 if(to) list=list.filter(g=>g.to.toLowerCase().includes(to));
 if(date) list=list.filter(g=>g.date===date);
 const sort=document.getElementById("sortSelect").value;
 if(sort==="progress") list.sort((a,b)=>b.joined/b.target-a.joined/a.target);
 if(sort==="date") list.sort((a,b)=>a.date.localeCompare(b.date));
 if(sort==="type") list.sort((a,b)=>a.type.localeCompare(b.type));
 if(!list.length){grid.innerHTML='<div class="empty">No demo groups match those filters. Try another route or date.</div>';return;}
 grid.innerHTML=list.map(g=>{const pct=Math.round(g.joined/g.target*100);return `
 <article class="group-card">
  <div class="card-top"><span class="type-pill">${g.type==="flight"?"✈ FLIGHT":"▰ BUS"}</span><span class="status">${g.status}</span></div>
  <div class="route">${g.fromCode}<span>→</span>${g.toCode}</div>
  <div class="submeta">${g.from} to ${g.to}</div>
  <div class="divider"></div>
  <div class="fare-row"><div><small>Indicative demo fare</small><span class="fare">${money(g.indicative)} <em>/ person*</em></span></div><div style="text-align:right"><small>Travel date</small><b style="font-size:11px">${prettyDate(g.date)}</b></div></div>
  <div class="progress-meta"><span>${g.joined} joined</span><b>${g.target-g.joined} needed</b></div>
  <div class="progress"><span style="width:${pct}%"></span></div>
  <div class="card-bottom"><span class="date-label">${pct}% of group target</span><button class="join-button" data-join="${g.id}">Join group →</button></div>
 </article>`}).join("");
 grid.querySelectorAll("[data-join]").forEach(b=>b.addEventListener("click",()=>openJoin(Number(b.dataset.join))));
}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.style.display="block";setTimeout(()=>t.style.display="none",3200);}
function openJoin(id){selectedGroup=demoGroups.find(g=>g.id===id);document.getElementById("modalTitle").textContent="Join this journey";document.getElementById("modalRoute").textContent=`${selectedGroup.from} → ${selectedGroup.to} · ${prettyDate(selectedGroup.date)}`;document.getElementById("joinModal").classList.add("show");}
function closeJoin(){document.getElementById("joinModal").classList.remove("show");}
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");activeType=b.dataset.filter;document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x.dataset.type===activeType));render();}));
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");activeType=b.dataset.type;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x.dataset.filter===activeType));render();}));
document.getElementById("searchForm").addEventListener("submit",e=>{e.preventDefault();document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x.dataset.filter===activeType));render();document.getElementById("groups").scrollIntoView({behavior:"smooth"});});
document.getElementById("sortSelect").addEventListener("change",render);
document.getElementById("closeModal").addEventListener("click",closeJoin);
document.getElementById("joinModal").addEventListener("click",e=>{if(e.target.id==="joinModal")closeJoin();});
document.getElementById("howBtn").addEventListener("click",()=>document.getElementById("how").scrollIntoView({behavior:"smooth"}));
document.getElementById("joinForm").addEventListener("submit",e=>{e.preventDefault();if(!selectedGroup)return;const interest={groupId:selectedGroup.id,route:selectedGroup.from+" to "+selectedGroup.to,name:document.getElementById("joinName").value,email:document.getElementById("joinEmail").value,count:Number(document.getElementById("joinCount").value),createdAt:new Date().toISOString()};try{const all=JSON.parse(localStorage.getItem("seatshare_demo_interests")||"[]");all.push(interest);localStorage.setItem("seatshare_demo_interests",JSON.stringify(all));}catch(err){}closeJoin();e.target.reset();toast("Demo interest saved on this device only. No ticket or payment was created.");});

const inventoryForm = document.getElementById("inventoryForm");
const inventoryStatus = document.getElementById("inventoryStatus");
const inventoryResults = document.getElementById("inventoryResults");
inventoryForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    type: document.getElementById("inventoryType").value,
    from: document.getElementById("inventoryFrom").value.trim(),
    to: document.getElementById("inventoryTo").value.trim(),
    date: document.getElementById("inventoryDate").value
  };
  inventoryResults.innerHTML = "";
  inventoryStatus.textContent = "Checking the SeatShare inventory service…";
  inventoryStatus.className = "inventory-status";
  try {
const response = await fetch("https://seatshare-api.onrender.com/api/inventory/search", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
      inventoryStatus.textContent = data.message || "Live inventory is not configured yet. Connect an approved provider to continue.";
      inventoryStatus.className = "inventory-status warning";
      return;
    }
    const items = Array.isArray(data.results) ? data.results : [];
    if (!items.length) {
      inventoryStatus.textContent = "The provider returned no available services for this search.";
      return;
    }
    inventoryStatus.textContent = `Provider results · ${items.length} option(s). Prices and availability can change.`;
    inventoryResults.innerHTML = items.map(item => `
      <article class="inventory-card">
        <strong>${escapeHTML(item.operator || item.airline || item.name || "Travel option")}</strong>
        <span>${escapeHTML(item.departure || "Departure time not supplied")} → ${escapeHTML(item.arrival || "Arrival time not supplied")}</span>
        <b>${item.currency || "INR"} ${escapeHTML(String(item.price ?? "Price unavailable"))}</b>
        <small>${escapeHTML(item.seatsAvailable == null ? "Seat availability not supplied" : `${item.seatsAvailable} seats reported available`)}</small>
        <small>Provider reference: ${escapeHTML(item.providerReference || "Not supplied")}</small>
      </article>`).join("");
  } catch (error) {
    inventoryStatus.textContent = "Cannot reach the SeatShare backend. Start the server or check its deployment.";
    inventoryStatus.className = "inventory-status warning";
  }
});
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
render();
