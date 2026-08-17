"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight, BarChart3, Bell, Bot, Car, ChevronRight, CreditCard,
  FileText, LayoutDashboard, LogOut, Menu, PieChart, Plus, Receipt,
  Search, Settings, Sparkles, TrendingDown, TrendingUp, Upload, Wallet, X
} from "lucide-react";

type View = "dashboard"|"data"|"income"|"expenses"|"fees"|"budget"|"investments"|"ai"|"subscription";
type Tx = { id:number; merchant:string; category:string; amount:number; date:string; kind:"income"|"expense"|"fee" };

const categories = ["Groceries","Subscriptions","Utilities","Car","Restaurants","Entertainment","Shopping","Housing","Other"];

function money(n:number){ return new Intl.NumberFormat("en-IE",{style:"currency",currency:"EUR"}).format(n); }

export default function MakeItRight(){
  const [view,setView]=useState<View>("dashboard");
  const [sidebar,setSidebar]=useState(false);
  const [showAdd,setShowAdd]=useState(false);
  const [showUpload,setShowUpload]=useState(false);
  const [transactions,setTransactions]=useState<Tx[]>([]);
  const [aiMessage,setAiMessage]=useState("");

  const income=transactions.filter(t=>t.kind==="income").reduce((s,t)=>s+t.amount,0);
  const expenses=transactions.filter(t=>t.kind==="expense").reduce((s,t)=>s+Math.abs(t.amount),0);
  const fees=transactions.filter(t=>t.kind==="fee").reduce((s,t)=>s+Math.abs(t.amount),0);
  const balance=income-expenses-fees;
  const budget=1800;
  const investments=0;

  const go=(v:View)=>{setView(v);setSidebar(false)};

  const title=useMemo(()=>({
    dashboard:"Dashboard",data:"My Data",income:"Income",expenses:"Expenses",fees:"Bank fees",
    budget:"Budget",investments:"Investments",ai:"AI Financial Assistant",subscription:"Subscription"
  }[view]),[view]);

  return <main className="app-shell">
    <aside className={`sidebar ${sidebar?"open":""}`}>
      <div className="brand"><div className="brand-mark">M</div><div><strong>Make It Right</strong><span>Personal finance</span></div><button className="close-mobile" onClick={()=>setSidebar(false)}><X size={18}/></button></div>
      <nav>
        <Nav icon={<LayoutDashboard/>} label="Dashboard" active={view==="dashboard"} onClick={()=>go("dashboard")}/>
        <Nav icon={<Wallet/>} label="My Data" active={view==="data"} onClick={()=>go("data")}/>
        <div className="nav-label">FINANCES</div>
        <Nav icon={<TrendingUp/>} label="Income" active={view==="income"} onClick={()=>go("income")}/>
        <Nav icon={<Receipt/>} label="Expenses" active={view==="expenses"} onClick={()=>go("expenses")}/>
        <Nav icon={<CreditCard/>} label="Bank fees" active={view==="fees"} onClick={()=>go("fees")}/>
        <Nav icon={<PieChart/>} label="Budget" active={view==="budget"} onClick={()=>go("budget")}/>
        <Nav icon={<BarChart3/>} label="Investments" active={view==="investments"} onClick={()=>go("investments")}/>
        <div className="nav-label">TOOLS</div>
        <Nav icon={<Sparkles/>} label="AI Assistant" active={view==="ai"} onClick={()=>go("ai")}/>
        <Nav icon={<ZapIcon/>} label="Subscription" active={view==="subscription"} onClick={()=>go("subscription")}/>
      </nav>
      <div className="sidebar-bottom"><Nav icon={<Settings/>} label="Settings" onClick={()=>{}}/><Nav icon={<LogOut/>} label="Log out" onClick={()=>{}}/></div>
    </aside>

    <section className="main">
      <header className="topbar"><button className="menu-mobile" onClick={()=>setSidebar(true)}><Menu/></button><div className="crumb">{title}</div><div className="top-actions"><button className="icon-btn"><Search size={18}/></button><button className="icon-btn"><Bell size={18}/><i/></button><div className="avatar">A</div></div></header>

      {view==="dashboard" && <Dashboard income={income} expenses={expenses} balance={balance} investments={investments} budget={budget} go={go}/>}
      {view==="data" && <DataPage transactions={transactions} onAdd={()=>setShowAdd(true)} onUpload={()=>setShowUpload(true)} go={go}/>}
      {view==="income" && <TransactionPage title="Income" kind="income" transactions={transactions} onAdd={()=>setShowAdd(true)} onDelete={id=>setTransactions(x=>x.filter(t=>t.id!==id))}/>}
      {view==="fees" && <TransactionPage title="Bank fees" kind="fee" transactions={transactions} onAdd={()=>setShowAdd(true)} onDelete={id=>setTransactions(x=>x.filter(t=>t.id!==id))}/>}
      {view==="expenses" && <Expenses transactions={transactions} onAdd={()=>setShowAdd(true)} onDelete={id=>setTransactions(x=>x.filter(t=>t.id!==id))}/>}
      {view==="budget" && <BudgetPage budget={budget} expenses={expenses}/>}
      {view==="investments" && <Investments/>}
      {view==="ai" && <AIPage message={aiMessage} setMessage={setAiMessage} income={income} expenses={expenses}/>}
      {view==="subscription" && <Subscription/>}
      <footer>© 2026 Make It Right · Your finances, made clearer.</footer>
    </section>

    {showAdd && <AddModal onClose={()=>setShowAdd(false)} onSave={t=>{setTransactions(x=>[t,...x]);setShowAdd(false)}}/>}
    {showUpload && <UploadModal onClose={()=>setShowUpload(false)} />}
  </main>
}

function Nav({icon,label,active,onClick}:{icon:React.ReactNode;label:string;active?:boolean;onClick:()=>void}){return <button className={`nav-item ${active?"active":""}`} onClick={onClick}>{icon}<span>{label}</span>{active&&<ChevronRight size={15}/>}</button>}
function ZapIcon(){return <Sparkles/>}

function Dashboard({income,expenses,balance,investments,budget,go}:{income:number;expenses:number;balance:number;investments:number;budget:number;go:(v:View)=>void}){
 return <div className="content">
  <div className="hero-row"><div><p className="eyebrow">YOUR FINANCES</p><h1>Financial overview.</h1><p className="muted">Your account is ready. Start by adding your first transaction.</p></div><button className="primary" onClick={()=>go("data")}><Plus size={17}/> Add data</button></div>
  <div className="stats-grid">
   <Stat title="Total balance" value={money(balance)} change="No data yet"/>
   <Stat title="Income this month" value={money(income)} change={income?"Updated":"Add income"}/>
   <Stat title="Expenses this month" value={money(expenses)} change={expenses?"Updated":"Add expenses"}/>
   <Stat title="Investments" value={money(investments)} change="No investments"/>
  </div>
  <div className="dashboard-grid">
   <section className="card empty-card"><div className="empty-icon"><BarChart3/></div><h3>No financial activity yet</h3><p className="muted">Add income, expenses or upload a bank statement to see your financial trends here.</p><button className="secondary" onClick={()=>go("data")}><Plus size={15}/> Add your first transaction</button></section>
   <section className="card ai-card"><div className="ai-icon"><Bot size={22}/></div><p className="eyebrow">AI INSIGHT</p><h3>Your financial assistant is ready.</h3><p className="muted">Once you add data, AI will analyze your spending and suggest ways to improve your finances.</p><button className="text-btn" onClick={()=>go("ai")}>Open AI Assistant <ArrowUpRight size={16}/></button></section>
  </div>
  <div className="dashboard-grid bottom">
   <section className="card"><div className="card-head"><div><h3>Recent transactions</h3><p>Nothing has been added yet.</p></div><button className="text-btn" onClick={()=>go("data")}>Add transaction</button></div><Empty/></section>
   <section className="card budget-preview"><div className="card-head"><div><h3>Monthly budget</h3><p>August 2026</p></div><button className="text-btn" onClick={()=>go("budget")}>Details</button></div><div className="budget-number"><strong>{money(expenses)}</strong><span>of {money(budget)}</span></div><div className="progress"><span style={{width:`${Math.min(expenses/budget*100,100)}%`}}/></div><div className="budget-foot"><span>{budget?Math.round(expenses/budget*100):0}% used</span><span>{money(Math.max(budget-expenses,0))} left</span></div></section>
  </div>
 </div>
}

function Stat({title,value,change}:{title:string;value:string;change:string}){return <div className="stat card"><span>{title}</span><strong>{value}</strong><small>{change}</small></div>}
function Empty(){return <div className="empty-list"><FileText size={22}/><span>No transactions yet</span></div>}

function DataPage({transactions,onAdd,onUpload,go}:{transactions:Tx[];onAdd:()=>void;onUpload:()=>void;go:(v:View)=>void}){
 const counts={income:transactions.filter(t=>t.kind==="income").length,expense:transactions.filter(t=>t.kind==="expense").length,fee:transactions.filter(t=>t.kind==="fee").length};
 const cards=[["Income","income",TrendingUp],["Bank fees","fees",CreditCard],["Expenses","expenses",Receipt],["Budget","budget",PieChart]] as const;
 return <div className="content"><div className="hero-row"><div><p className="eyebrow">FINANCIAL DATA</p><h1>My Data</h1><p className="muted">Everything starts at zero. Add your own information whenever you are ready.</p></div><button className="primary" onClick={onUpload}><Upload size={17}/> Upload statement</button></div>
  <section className="upload-banner"><div className="upload-circle"><Sparkles/></div><div><strong>Let AI organize your finances</strong><p>Upload a PDF bank statement and Make It Right will detect and categorize transactions.</p></div><button className="secondary" onClick={onUpload}>Upload PDF</button></section>
  <div className="stats-grid four">{cards.map(([name,target,Icon])=><button className="data-card card" key={name} onClick={()=>go(target as View)}><div className="data-card-icon"><Icon size={19}/></div><span>{name}</span><strong>{name==="Budget"?"€1,800.00":name==="Income"?money(transactions.filter(t=>t.kind==="income").reduce((s,t)=>s+t.amount,0)):name==="Expenses"?money(transactions.filter(t=>t.kind==="expense").reduce((s,t)=>s+Math.abs(t.amount),0)):money(transactions.filter(t=>t.kind==="fee").reduce((s,t)=>s+Math.abs(t.amount),0))}</strong><small>{name==="Budget"?"0% used":`${counts[target as keyof typeof counts]??0} transactions`}</small><ChevronRight className="data-arrow" size={17}/></button>)}</div>
  <div className="section-head"><div><h2>Manual entry</h2><p className="muted">Add information yourself.</p></div><button className="secondary" onClick={onAdd}><Plus size={16}/> Add transaction</button></div>
  <div className="manual-grid">{["Income","Expense","Budget","Investment"].map((x,i)=><div className="card manual" key={x}><div className="manual-icon">{i===0?<TrendingUp/>:i===1?<Receipt/>:i===2?<PieChart/>:<BarChart3/>}</div><h3>Add {x}</h3><p className="muted">Create a new {x.toLowerCase()} record.</p><button className="text-btn" onClick={x==="Budget"?()=>go("budget"):x==="Investment"?()=>go("investments"):onAdd}>Add {x} <ArrowUpRight size={15}/></button></div>)}</div>
 </div>
}

function TransactionPage({title,kind,transactions,onAdd,onDelete}:{title:string;kind:"income"|"fee";transactions:Tx[];onAdd:()=>void;onDelete:(id:number)=>void}){
 const list=transactions.filter(t=>t.kind===kind);
 const total=list.reduce((s,t)=>s+Math.abs(t.amount),0);
 return <div className="content"><div className="hero-row"><div><p className="eyebrow">{title.toUpperCase()}</p><h1>{title}</h1><p className="muted">Manage your {title.toLowerCase()} manually.</p></div><button className="primary" onClick={onAdd}><Plus size={16}/> Add {kind==="income"?"income":"fee"}</button></div>
 <div className="stats-grid"><Stat title={kind==="income"?"Total income":"Total fees"} value={money(total)} change={list.length?`${list.length} transactions`:"€0.00 · No data"}/><Stat title="This month" value={money(total)} change="Current total"/><Stat title="Average" value={money(list.length?total/list.length:0)} change="Per transaction"/><Stat title="Status" value={list.length?"Active":"Empty"} change={list.length?"Data added":"Ready for input"}/></div>
 <section className="card"><div className="card-head"><div><h3>Transaction history</h3><p>{list.length?"Your added transactions":"No transactions yet."}</p></div><button className="secondary" onClick={onAdd}><Plus size={15}/> Add</button></div>{list.length?<div className="transactions">{list.map(t=><Row key={t.id} t={t} onDelete={()=>onDelete(t.id)}/>)}</div>:<Empty/>}</section></div>
}

function Expenses({transactions,onAdd,onDelete}:{transactions:Tx[];onAdd:()=>void;onDelete:(id:number)=>void}){
 const list=transactions.filter(t=>t.kind==="expense"); const total=list.reduce((s,t)=>s+Math.abs(t.amount),0);
 const byCat=categories.map(c=>[c,list.filter(t=>t.category===c).reduce((s,t)=>s+Math.abs(t.amount),0)] as const).filter(x=>x[1]>0);
 return <div className="content"><div className="hero-row"><div><p className="eyebrow">EXPENSE ANALYSIS</p><h1>Expenses</h1><p className="muted">See exactly where your money goes.</p></div><button className="primary" onClick={onAdd}><Plus size={16}/> Add expense</button></div>
 <div className="dashboard-grid"><section className="card donut-card"><div className="card-head"><div><h3>Spending by category</h3><p>{money(total)} total</p></div></div>{total===0?<Empty/>:<><div className="donut"><div><strong>{money(total)}</strong><span>Total</span></div></div><div className="legend">{byCat.map(([n,v])=><div key={n}><i/><span>{n}</span><b>{Math.round(v/total*100)}%</b></div>)}</div></>}</section>
 <section className="card"><div className="card-head"><div><h3>Recent expenses</h3><p>{list.length?"AI-ready transaction list":"No expenses yet."}</p></div><button className="secondary" onClick={onAdd}><Plus size={15}/> Add</button></div>{list.length?<div className="transactions">{list.map(t=><Row key={t.id} t={t} onDelete={()=>onDelete(t.id)}/>)}</div>:<Empty/>}</section></div></div>
}

function Row({t,onDelete}:{t:Tx;onDelete:()=>void}){return <div className="transaction"><div className="tx-icon">{t.kind==="income"?<TrendingUp size={16}/>:t.kind==="fee"?<CreditCard size={16}/>:t.category==="Car"?<Car size={16}/>:<Receipt size={16}/>}</div><div className="tx-info"><strong>{t.merchant}</strong><span>{t.category} · {t.date}</span></div><b className={t.kind==="income"?"positive":""}>{t.kind==="income"?"+":"-"}{money(Math.abs(t.amount))}</b><button className="delete-btn" onClick={onDelete} title="Delete"><X size={14}/></button></div>}

function BudgetPage({budget,expenses}:{budget:number;expenses:number}){return <div className="content"><div className="hero-row"><div><p className="eyebrow">BUDGET</p><h1>Monthly budget</h1><p className="muted">Your starting budget is €1,800. You can change it anytime.</p></div><button className="secondary"><Plus size={15}/> Edit budget</button></div><section className="card budget-large"><p className="eyebrow">SPENDING</p><h2>{money(expenses)} <span>/ {money(budget)}</span></h2><div className="progress big"><span style={{width:`${Math.min(expenses/budget*100,100)}%`}}/></div><div className="budget-foot"><span>{Math.round(expenses/budget*100)}% used</span><span>{money(Math.max(budget-expenses,0))} remaining</span></div></section><div className="manual-grid">{categories.slice(0,4).map(n=><div className="card category-budget" key={n}><div><strong>{n}</strong><span>€0.00 / €0.00</span></div><div className="progress"><span style={{width:"0%"}}/></div></div>)}</div></div>}

function Investments(){return <div className="content"><div className="hero-row"><div><p className="eyebrow">PORTFOLIO</p><h1>Investments</h1><p className="muted">Your investment portfolio starts empty.</p></div><button className="primary"><Plus size={16}/> Add investment</button></div><div className="stats-grid"><Stat title="Portfolio value" value="€0.00" change="No investments"/><Stat title="Total invested" value="€0.00" change="No investments"/><Stat title="Total return" value="€0.00" change="No investments"/><Stat title="Assets" value="0" change="Ready for input"/></div><section className="card empty-card"><div className="empty-icon"><BarChart3/></div><h3>No investments yet</h3><p className="muted">Add your first investment when you are ready.</p></section></div>}

function AIPage({message,setMessage,income,expenses}:{message:string;setMessage:(v:string)=>void;income:number;expenses:number}){return <div className="content ai-page"><div className="hero-row"><div><p className="eyebrow">MAKE IT RIGHT AI</p><h1>Your financial copilot.</h1><p className="muted">AI suggestions will become personalized as you add data.</p></div></div><section className="card chat"><div className="chat-header"><div className="ai-icon"><Bot size={21}/></div><div><strong>Make It Right AI</strong><span>{income||expenses?"Analyzing your data":"Waiting for your first financial data"}</span></div><span className="online">Ready</span></div><div className="chat-body"><div className="bubble ai"><Sparkles size={15}/><span>{income||expenses?`You currently have ${money(income)} in income and ${money(expenses)} in expenses.`:"Add transactions or upload a bank statement and I’ll be able to analyze your finances."}</span></div>{message&&<div className="bubble user">{message}</div>}<div className="suggestions">{["How can I save money?","Where am I spending the most?","Analyze my subscriptions"].map(s=><button key={s} onClick={()=>setMessage(s)}>{s}</button>)}</div></div><div className="chat-input"><input value={message} onChange={e=>setMessage(e.target.value)} placeholder="Ask anything about your finances..."/><button><ArrowUpRight size={17}/></button></div></section></div>}

function Subscription(){return <div className="content"><div className="center-heading"><p className="eyebrow">MEMBERSHIP</p><h1>Choose your plan.</h1><p className="muted">Unlock the full Make It Right experience.</p></div><div className="plans">{[["Monthly","€5","per month"],["Annual","€25","per year"],["Biannual","€20","per year"]].map(([n,p,per],i)=><div className={`plan card ${i===1?"featured":""}`} key={n}>{i===1&&<span className="recommended">RECOMMENDED</span>}<h3>{n}</h3><p>Full access to Make It Right.</p><div className="price">{p}<small>{per}</small></div><ul><li>AI financial insights</li><li>Financial tracking</li><li>Budget monitoring</li><li>PDF analysis</li></ul><button className={i===1?"primary":"secondary"}>Choose {n}</button></div>)}</div></div>}

function AddModal({onClose,onSave}:{onClose:()=>void;onSave:(t:Tx)=>void}){
 const [kind,setKind]=useState<"income"|"expense"|"fee">("expense"); const [merchant,setMerchant]=useState(""); const [amount,setAmount]=useState(""); const [category,setCategory]=useState("Groceries");
 const save=()=>{const n=Number(amount.replace(",","."));if(!merchant.trim()||!n||n<0)return;onSave({id:Date.now(),merchant:merchant.trim(),amount:kind==="income"?n:-n,category:kind==="fee"?"Bank fees":category,date:new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short"}),kind})};
 return <div className="modal-backdrop"><div className="modal card"><button className="modal-close" onClick={onClose}><X/></button><p className="eyebrow">MANUAL ENTRY</p><h2>Add transaction</h2><div className="type-tabs">{(["income","expense","fee"] as const).map(k=><button className={kind===k?"selected":""} onClick={()=>setKind(k)} key={k}>{k==="income"?"Income":k==="expense"?"Expense":"Bank fee"}</button>)}</div><label>Merchant / description<input value={merchant} onChange={e=>setMerchant(e.target.value)} placeholder="e.g. Mercadona"/></label><label>Amount (€)<input type="number" min="0" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0.00"/></label>{kind==="expense"&&<label>Category<select value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select></label>}<div className="modal-actions"><button className="secondary" onClick={onClose}>Cancel</button><button className="primary" onClick={save}>Save transaction</button></div></div></div>
}

function UploadModal({onClose}:{onClose:()=>void}){const [file,setFile]=useState<File|null>(null);return <div className="modal-backdrop"><div className="modal card"><button className="modal-close" onClick={onClose}><X/></button><div className="upload-circle large"><Upload/></div><p className="eyebrow">AI IMPORT</p><h2>Upload your bank statement</h2><p className="muted">Select a PDF. The real AI processing API can be connected next.</p><label className="dropzone"><Upload size={25}/><strong>{file?file.name:"Drop your PDF here"}</strong><span>{file?"File selected":"or click to browse · PDF"}</span><input type="file" accept=".pdf" onChange={e=>setFile(e.target.files?.[0]??null)}/></label><div className="modal-actions"><button className="secondary" onClick={onClose}>Cancel</button><button className="primary" disabled={!file} onClick={onClose}>Start AI analysis</button></div></div></div>}
