/* Interactive product walkthrough. All actions remain local to this demonstration. */
(() => {
  const main=document.querySelector('.crm-main'), board=document.getElementById('crm-board');
  const view=document.getElementById('crm-view'), benefit=document.getElementById('crm-benefit');
  if(!main||!board||!view)return;
  const tabs=[...document.querySelectorAll('[data-crm-view]')];
  const panel=main.closest('.crm-window'),sticky=main.closest('.crm-sticky');
  const keepReady=()=>{if(sticky.classList.contains('is-interactive'))sticky.dataset.exploring='true';};
  panel.addEventListener('pointerdown',keepReady);panel.addEventListener('focusin',keepReady);
  const copy={
    pipeline:'Uma oportunidade, um responsável e um próximo passo. Nada fica perdido entre etapas.',
    leads:'Encontra o contexto de cada oportunidade e acompanha a próxima ação num único lugar.',
    agents:'Prepara qualificação, seguimento e reativação com revisão humana antes de qualquer envio.',
    metrics:'Vê a distribuição real desta demonstração e identifica onde o processo precisa de atenção.',
    quality:'Transforma critérios de qualidade em acompanhamento consistente da equipa.'
  };
  let current='pipeline',stage=0,agentTimer;
  const stageNav=document.createElement('div');stageNav.className='crm-stage-nav';stageNav.setAttribute('aria-label','Etapas do pipeline');
  board.before(stageNav);
  const columns=()=>[...board.querySelectorAll('.crm-column')];
  const records=()=>columns().flatMap((col,index)=>[...col.querySelectorAll('.crm-card')].map(card=>({card,index,title:card.querySelector('strong').textContent,context:card.querySelector('p').textContent,status:card.querySelector('span').textContent,stage:col.querySelector('header span').textContent})));
  const escape=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function updateStages(){
    stageNav.replaceChildren();
    columns().forEach((col,index)=>{
      const button=document.createElement('button');button.type='button';button.textContent=`${index+1} · ${col.querySelector('header span').textContent}`;
      button.setAttribute('aria-pressed',String(index===stage));button.addEventListener('click',()=>{stage=index;updateStages();});
      stageNav.append(button);col.classList.toggle('is-selected-stage',index===stage);
    });
  }
  function renderLeads(){
    view.innerHTML='<div class="crm-view-heading"><h3>Contexto antes do contacto.</h3><p>Pesquisa uma oportunidade e consulta o seu estado no processo.</p></div><label class="crm-search">Pesquisar oportunidades<input type="search" placeholder="Nome, contexto ou etapa" autocomplete="off"></label><div class="crm-leads-list" role="list"></div><p class="crm-view-status" role="status"></p>';
    const input=view.querySelector('input'),list=view.querySelector('.crm-leads-list'),status=view.querySelector('[role="status"]');
    const filter=()=>{
      const query=input.value.trim().toLocaleLowerCase('pt-PT');const found=records().filter(item=>`${item.title} ${item.context} ${item.stage}`.toLocaleLowerCase('pt-PT').includes(query));
      list.replaceChildren();
      found.forEach(item=>{const row=document.createElement('article');row.setAttribute('role','listitem');row.innerHTML=`<div><strong>${escape(item.title)}</strong><p>${escape(item.context)}</p></div><span>${escape(item.stage)}</span><button type="button">Ver no pipeline ↗</button>`;row.querySelector('button').addEventListener('click',()=>{stage=item.index;select('pipeline');item.card.focus({preventScroll:true});});list.append(row);});
      status.textContent=found.length?`${found.length} oportunidades nesta demonstração.`:'Nenhuma oportunidade corresponde à pesquisa.';
    };input.addEventListener('input',filter);filter();
  }
  function renderAgents(){
    view.innerHTML='<div class="crm-view-heading"><h3>Automação com direção humana.</h3><p>Escolhe uma tarefa para experimentar a preparação de uma ação. Nenhuma mensagem é enviada.</p></div><div class="crm-agent-grid"><button type="button" data-agent="qualify"><span>01 / QUALIFICAÇÃO</span><strong>Preparar a primeira conversa</strong><p>Critérios, contexto e perguntas relevantes para o comercial.</p></button><button type="button" data-agent="followup"><span>02 / SEGUIMENTO</span><strong>Recuperar uma oportunidade</strong><p>Próxima ação e rascunho de contacto sujeitos a aprovação.</p></button></div><div class="crm-agent-result" role="status"><span>À tua escolha</span><p>O agente prepara. A equipa revê e decide.</p></div>';
    view.querySelectorAll('[data-agent]').forEach(button=>button.addEventListener('click',()=>{
      clearTimeout(agentTimer);view.querySelectorAll('[data-agent]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      const result=view.querySelector('.crm-agent-result');result.textContent='A preparar o exemplo…';
      agentTimer=setTimeout(()=>{
        if(current!=='agents')return;
        const item=records()[0];
        result.innerHTML=button.dataset.agent==='qualify'?`<span>PRONTO PARA REVISÃO</span><strong>${escape(item?.title||'Oportunidade')}</strong><p>Confirmar necessidade, prazo de decisão e intervenientes. Registar o próximo passo e atribuir um responsável antes da reunião.</p><small>Simulação local. Sem chamadas, IA externa ou envio de dados.</small>`:'<span>RASCUNHO · NÃO ENVIADO</span><strong>Seguimento com contexto</strong><p>“Olá, retomamos a nossa conversa para confirmar se esta continua a ser uma prioridade. Qual seria o melhor próximo passo para si?”</p><small>A equipa revê destinatário, contexto e consentimento antes de qualquer ativação real.</small>';
      },650);
    }));
  }
  function renderMetrics(){
    const cols=columns(),counts=cols.map(col=>col.querySelectorAll('.crm-card').length),total=counts.reduce((n,c)=>n+c,0);
    view.innerHTML=`<div class="crm-view-heading"><h3>O processo, visível.</h3><p>Estes valores acompanham as oportunidades que moves nesta demonstração.</p></div><div class="crm-metrics-summary"><div><span>Oportunidades</span><strong>${total}</strong></div><div><span>Em fases intermédias</span><strong>${counts.slice(1,-1).reduce((n,c)=>n+c,0)}</strong></div><div><span>Última etapa</span><strong>${counts.at(-1)}</strong></div></div><div class="crm-funnel">${cols.map((col,i)=>`<div><span>${escape(col.querySelector('header span').textContent)}</span><meter min="0" max="${Math.max(1,total)}" value="${counts[i]}" aria-label="Oportunidades na etapa ${i+1}">${counts[i]}</meter><b>${counts[i]}</b></div>`).join('')}</div><p class="crm-view-status">Leitura da distribuição, não uma promessa de resultados. No produto, os indicadores são definidos com a tua operação.</p>`;
  }
  function renderQuality(){
    view.innerHTML='<div class="crm-view-heading"><h3>Qualidade que se pode acompanhar.</h3><p>Exemplo de revisão de uma conversa comercial. Assinala os critérios observados.</p></div><div class="crm-quality"><label><input type="checkbox"> A necessidade e a prioridade ficaram claras.</label><label><input type="checkbox"> Foram identificados os intervenientes na decisão.</label><label><input type="checkbox"> O próximo passo tem responsável e data.</label><label><input type="checkbox"> O contexto ficou registado no CRM.</label></div><div class="crm-quality-result" role="status"><strong>0 de 4 critérios</strong><p>Começa a revisão para identificar o que precisa de acompanhamento.</p></div>';
    view.querySelectorAll('input').forEach(input=>input.addEventListener('change',()=>{const n=view.querySelectorAll('input:checked').length;view.querySelector('.crm-quality-result strong').textContent=`${n} de 4 critérios`;view.querySelector('.crm-quality-result p').textContent=n===4?'Revisão completa neste exemplo. O próximo passo está definido.':'Usa os critérios em falta para orientar feedback e preparação.';}));
  }
  function select(name){
    if(!Object.hasOwn(copy,name))return;
    current=name;main.dataset.view=name;benefit.textContent=copy[name];
    main.scrollTop=0;
    tabs.forEach(button=>{const active=button.dataset.crmView===name;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));});
    view.hidden=name==='pipeline';board.hidden=name!=='pipeline';stageNav.hidden=name!=='pipeline';
    document.querySelector('.crm-bottom').hidden=name!=='pipeline';
    clearTimeout(agentTimer);
    if(name==='leads')renderLeads();if(name==='agents')renderAgents();if(name==='metrics')renderMetrics();if(name==='quality')renderQuality();
    updateStages();
  }
  tabs.forEach(button=>button.addEventListener('click',()=>select(button.dataset.crmView)));
  document.addEventListener('honor:crm-updated',()=>{updateStages();if(current==='metrics')renderMetrics();});
  document.querySelectorAll('[data-sector]').forEach(button=>button.addEventListener('click',()=>{stage=0;select(current);}));
  select('pipeline');
})();
