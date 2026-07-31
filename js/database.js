window.HFDatabase=(()=>{
  let data={};
  let editing=null;

  const $=id=>document.getElementById(id);
  const clone=value=>JSON.parse(JSON.stringify(value));

  function flatten(){
    const rows=[];
    for(const [region,cuisines] of Object.entries(data)){
      for(const [cuisine,dishes] of Object.entries(cuisines)){
        dishes.forEach((dish,index)=>rows.push({region,cuisine,index,...dish}));
      }
    }
    return rows;
  }

  function persist(){
    window.HFStorage.setCustomData(data);
    document.dispatchEvent(new CustomEvent("hf-database-updated",{detail:clone(data)}));
  }

  function buildOptions(){
    const regions=[...new Set(flatten().map(x=>x.region))].sort();
    const cuisines=[...new Set(flatten().map(x=>x.cuisine))].sort();
    $("regionOptions").innerHTML=regions.map(x=>`<option value="${escapeHtml(x)}"></option>`).join("");
    $("cuisineOptions").innerHTML=cuisines.map(x=>`<option value="${escapeHtml(x)}"></option>`).join("");
  }

  function escapeHtml(value){
    return String(value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[ch]));
  }

  function render(){
    const q=$("databaseSearch").value.trim().toLowerCase();
    const rows=flatten().filter(x=>`${x.region} ${x.cuisine} ${x.name}`.toLowerCase().includes(q));
    $("databaseCount").textContent=`共 ${rows.length} 道料理`;
    $("databaseList").innerHTML=rows.length?rows.map(row=>`
      <article class="database-card">
        <div class="database-card-main">
          <strong>${escapeHtml(row.name)}</strong>
          <span>${escapeHtml(row.region)}・${escapeHtml(row.cuisine)}・${escapeHtml(row.price)}</span>
          <div class="database-tags">
            ${(row.tags||[]).map(tag=>`<span>${escapeHtml(tag)}</span>`).join("")}
            ${row.spicy?'<span>辣味</span>':""}
            ${row.soup?'<span>湯類</span>':""}
            ${row.vegetarian?'<span>素食</span>':""}
          </div>
        </div>
        <div class="database-actions">
          <button data-action="edit" data-region="${escapeHtml(row.region)}" data-cuisine="${escapeHtml(row.cuisine)}" data-index="${row.index}">編輯</button>
          <button class="delete" data-action="delete" data-region="${escapeHtml(row.region)}" data-cuisine="${escapeHtml(row.cuisine)}" data-index="${row.index}">刪除</button>
        </div>
      </article>`).join(""):'<p class="empty">沒有符合的料理</p>';
    buildOptions();
  }

  function resetForm(){
    editing=null;
    $("editorTitle").textContent="新增料理";
    $("cancelEditButton").hidden=true;
    $("editorRegion").value="";
    $("editorCuisine").value="";
    $("editorDish").value="";
    $("editorPrice").value="平價";
    $("editorTags").value="";
    $("editorSpicy").checked=false;
    $("editorSoup").checked=false;
    $("editorVegetarian").checked=false;
  }

  function readForm(){
    const region=$("editorRegion").value.trim();
    const cuisine=$("editorCuisine").value.trim();
    const name=$("editorDish").value.trim();
    const price=$("editorPrice").value;
    const tags=$("editorTags").value.split(",").map(x=>x.trim()).filter(Boolean);
    return{
      region,cuisine,
      dish:{name,price,tags,spicy:$("editorSpicy").checked,soup:$("editorSoup").checked,vegetarian:$("editorVegetarian").checked}
    };
  }

  function save(){
    const {region,cuisine,dish}=readForm();
    if(!region||!cuisine||!dish.name){
      alert("請至少填寫地區、菜系與料理名稱。");
      return;
    }

    if(editing){
      const oldList=data[editing.region]?.[editing.cuisine];
      if(oldList)oldList.splice(editing.index,1);
      cleanup(editing.region,editing.cuisine);
    }

    data[region]??={};
    data[region][cuisine]??=[];
    data[region][cuisine].push(dish);
    persist();
    render();
    resetForm();
  }

  function cleanup(region,cuisine){
    if(data[region]?.[cuisine]?.length===0)delete data[region][cuisine];
    if(data[region]&&Object.keys(data[region]).length===0)delete data[region];
  }

  function edit(region,cuisine,index){
    const dish=data[region]?.[cuisine]?.[index];
    if(!dish)return;
    editing={region,cuisine,index};
    $("editorTitle").textContent=`編輯：${dish.name}`;
    $("cancelEditButton").hidden=false;
    $("editorRegion").value=region;
    $("editorCuisine").value=cuisine;
    $("editorDish").value=dish.name;
    $("editorPrice").value=dish.price||"平價";
    $("editorTags").value=(dish.tags||[]).join(", ");
    $("editorSpicy").checked=Boolean(dish.spicy);
    $("editorSoup").checked=Boolean(dish.soup);
    $("editorVegetarian").checked=Boolean(dish.vegetarian);
    window.scrollTo({top:$("view-database").offsetTop,behavior:"smooth"});
  }

  function remove(region,cuisine,index){
    const dish=data[region]?.[cuisine]?.[index];
    if(!dish)return;
    if(!confirm(`確定刪除「${dish.name}」？`))return;
    data[region][cuisine].splice(index,1);
    cleanup(region,cuisine);
    persist();
    render();
    if(editing)resetForm();
  }

  function init(initialData){
    data=clone(initialData);
    render();
  }

  $("saveDishButton").addEventListener("click",save);
  $("cancelEditButton").addEventListener("click",resetForm);
  $("databaseSearch").addEventListener("input",render);
  $("databaseList").addEventListener("click",event=>{
    const button=event.target.closest("button[data-action]");
    if(!button)return;
    const region=button.dataset.region;
    const cuisine=button.dataset.cuisine;
    const index=Number(button.dataset.index);
    button.dataset.action==="edit"?edit(region,cuisine,index):remove(region,cuisine,index);
  });

  return{init,getData:()=>clone(data),resetForm};
})();
