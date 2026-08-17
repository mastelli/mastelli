"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight, BarChart3, Bell, Bot, Car, ChevronRight, CircleDollarSign,
  CreditCard, FileText, Home, LayoutDashboard, LogOut, Menu, PieChart,
  Plus, Receipt, Search, Settings, Sparkles, TrendingDown, TrendingUp,
  Upload, Wallet, X, Zap
} from "lucide-react";

type View = "dashboard" | "data" | "income" | "expenses" | "fees" | "budget" | "investments" | "ai" | "subscription";

const transactions = [
  { merchant: "Mercadona", category: "Groceries", amount: -82.40, date: "17 Aug" },
  { merchant: "Salary", category: "Income", amount: 2450.00, date: "15 Aug" },
  { merchant: "Netflix", category: "Subscriptions", amount: -17.99, date: "12 Aug" },
  { merchant: "Iberdrola", category: "Utilities", amount: -64.20, date: "10 Aug" },
  { merchant: "Repsol", category: "Car", amount: -58.30, date: "08 Aug" },
  { merchant: "Digi", category: "Utilities", amount: -25.00, date: "05 Aug" }
];

const expenseData = [
  ["Groceries", 25],
  ["Subscriptions", 18],
  ["Utilities", 17],
  ["Car", 12],
  ["Restaurants", 10],
  ["Entertainment", 8],
  ["Other", 10]
];

function money(n: number) {
  return new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(n);
}

export default function MakeItRight() {
  const [view, setView] = useState<View>("dashboard");
  const [sidebar, setSidebar] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [aiMessage, setAiMessage] = useState("");

  const title = useMemo(() => ({
    dashboard: "Good evening, Alex",
    data: "My Data",
    income: "Income",
    expenses: "Expenses",
    fees: "Bank fees",
    budget: "Budget",
    investments: "Investments",
    ai: "AI Financial Assistant",
    subscription: "Subscription"
  }[view]), [view]);

  const go = (v: View) => {
    setView(v);
    setSidebar(false);
  };

  return (
    <main className="app-shell">
      <aside className={`sidebar ${sidebar ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">M</div>
          <div><strong>Make It Right</strong><span>Personal finance</span></div>
          <button className="close-mobile" onClick={() => setSidebar(false)}><X size={18}/></button>
        </div>

        <nav>
          <NavItem icon={<LayoutDashboard/>} label="Dashboard" active={view === "dashboard"} onClick={() => go("dashboard")} />
          <NavItem icon={<Wallet/>} label="My Data" active={view === "data"} onClick={() => go("data")} />
          <div className="nav-label">FINANCES</div>
          <NavItem icon={<TrendingUp/>} label="Income" active={view === "income"} onClick={() => go("income")} />
          <NavItem icon={<Receipt/>} label="Expenses" active={view === "expenses"} onClick={() => go("expenses")} />
          <NavItem icon={<CreditCard/>} label="Bank fees" active={view === "fees"} onClick={() => go("fees")} />
          <NavItem icon={<PieChart/>} label="Budget" active={view === "budget"} onClick={() => go("budget")} />
          <NavItem icon={<BarChart3/>} label="Investments" active={view === "investments"} onClick={() => go("investments")} />
          <div className="nav-label">TOOLS</div>
          <NavItem icon={<Sparkles/>} label="AI Assistant" active={view === "ai"} onClick={() => go("ai")} />
          <NavItem icon={<Zap/>} label="Subscription" active={view === "subscription"} onClick={() => go("subscription")} />
        </nav>

        <div className="sidebar-bottom">
          <NavItem icon={<Settings/>} label="Settings" onClick={() => {}} />
          <NavItem icon={<LogOut/>} label="Log out" onClick={() => {}} />
        </div>
      </aside>

      <section className="main">
        <header className="topbar">
          <button className="menu-mobile" onClick={() => setSidebar(true)}><Menu/></button>
          <div className="crumb">{title}</div>
          <div className="top-actions">
            <button className="icon-btn"><Search size={18}/></button>
            <button className="icon-btn"><Bell size={18}/><i/></button>
            <div className="avatar">A</div>
          </div>
        </header>

        {view === "dashboard" && <Dashboard go={go} />}
        {view === "data" && <DataPage onUpload={() => setShowUpload(true)} go={go} />}
        {view === "income" && <DetailPage type="income" go={go} />}
        {view === "expenses" && <ExpensesPage go={go} />}
        {view === "fees" && <DetailPage type="fees" go={go} />}
        {view === "budget" && <BudgetPage go={go} />}
        {view === "investments" && <InvestmentsPage />}
        {view === "ai" && <AIPage message={aiMessage} setMessage={setAiMessage} />}
        {view === "subscription" && <SubscriptionPage />}

        <footer>© 2026 Make It Right · Your finances, made clearer.</footer>
      </section>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </main>
  );
}

function NavItem({ icon, label, active, onClick }: {icon: React.ReactNode; label: string; active?: boolean; onClick: () => void}) {
  return <button className={`nav-item ${active ? "active" : ""}`} onClick={onClick}>{icon}<span>{label}</span>{active && <ChevronRight size={15}/>}</button>;
}

function Dashboard({go}: {go:(v:View)=>void}) {
  return <div className="content">
    <div className="hero-row">
      <div>
        <p className="eyebrow">MONDAY, AUGUST 17</p>
        <h1>Your financial overview.</h1>
        <p className="muted">Everything you need to understand your money, in one place.</p>
      </div>
      <button className="primary" onClick={() => go("ai")}><Sparkles size={17}/> Ask AI</button>
    </div>

    <div className="stats-grid">
      <Stat title="Total balance" value="€8,420.80" change="+6.4%" up />
      <Stat title="Income this month" value="€2,450.00" change="+3.2%" up />
      <Stat title="Expenses this month" value="€1,284.60" change="-8.1%" up />
      <Stat title="Investments" value="€12,640.00" change="+11.7%" up />
    </div>

    <div className="dashboard-grid">
      <section className="card chart-card">
        <div className="card-head"><div><h3>Cash flow</h3><p>Income vs. expenses · Last 6 months</p></div><button className="select">Last 6 months</button></div>
        <div className="bars">
          {[62,72,58,81,68,91,54,76,48,70,42,84].map((h,i)=><div className="bar-wrap" key={i}><div className={`bar ${i%2 ? "expense":""}`} style={{height:`${h}%`}}/><span>{["Mar","Apr","May","Jun","Jul","Aug"][Math.floor(i/2)]}</span></div>)}
        </div>
      </section>

      <section className="card ai-card">
        <div className="ai-icon"><Bot size={22}/></div>
        <p className="eyebrow">AI INSIGHT</p>
        <h3>You are spending less this month.</h3>
        <p className="muted">Your expenses are down 8.1% compared with July. Groceries are your biggest category, at €321.</p>
        <button className="text-btn" onClick={() => go("ai")}>See all insights <ArrowUpRight size={16}/></button>
      </section>
    </div>

    <div className="dashboard-grid bottom">
      <section className="card">
        <div className="card-head"><div><h3>Recent transactions</h3><p>Your latest activity</p></div><button className="text-btn" onClick={() => go("data")}>View all</button></div>
        <TransactionList />
      </section>
      <section className="card budget-preview">
        <div className="card-head"><div><h3>Monthly budget</h3><p>August 2026</p></div><button className="text-btn" onClick={() => go("budget")}>Details</button></div>
        <div className="budget-number"><strong>€1,284.60</strong><span>of €1,800</span></div>
        <div className="progress"><span style={{width:"71%"}}/></div>
        <div className="budget-foot"><span>71% used</span><span>€515.40 left</span></div>
      </section>
    </div>
  </div>
}

function Stat({title,value,change,up}:{title:string;value:string;change:string;up?:boolean}) {
  return <div className="stat card"><span>{title}</span><strong>{value}</strong><small className={up ? "positive":"negative"}>{up ? <TrendingUp size={13}/>:<TrendingDown size={13}/>} {change} <em>vs last month</em></small></div>
}

function TransactionList() {
  return <div className="transactions">{transactions.map((t,i)=><div className="transaction" key={i}>
    <div className="tx-icon">{t.category==="Income"?<TrendingUp size={16}/>:t.category==="Car"?<Car size={16}/>:<Receipt size={16}/>}</div>
    <div className="tx-info"><strong>{t.merchant}</strong><span>{t.category} · {t.date}</span></div>
    <b className={t.amount > 0 ? "positive":""}>{t.amount > 0 ? "+" : ""}{money(t.amount)}</b>
  </div>)}</div>
}

function DataPage({onUpload,go}:{onUpload:()=>void;go:(v:View)=>void}) {
  const cards = [
    ["Income","€2,450.00","8 transactions",TrendingUp,"income"],
    ["Bank fees","€12.40","4 transactions",CreditCard,"fees"],
    ["Expenses","€1,284.60","42 transactions",Receipt,"expenses"],
    ["Budget","€1,800.00","71% used",PieChart,"budget"]
  ] as const;
  return <div className="content">
    <div className="hero-row"><div><p className="eyebrow">FINANCIAL DATA</p><h1>My Data</h1><p className="muted">Manage your finances manually or let AI organize your bank statement.</p></div><button className="primary" onClick={onUpload}><Upload size={17}/> Upload statement</button></div>
    <section className="upload-banner">
      <div className="upload-circle"><Sparkles/></div>
      <div><strong>Let AI organize your finances</strong><p>Upload a PDF bank statement and Make It Right will detect, categorize and summarize your transactions.</p></div>
      <button className="secondary" onClick={onUpload}>Upload PDF</button>
    </section>
    <div className="stats-grid four">{cards.map(([name,value,sub,Icon,target])=><button className="data-card card" key={name} onClick={()=>go(target as View)}><div className="data-card-icon"><Icon size={19}/></div><span>{name}</span><strong>{value}</strong><small>{sub}</small><ChevronRight className="data-arrow" size={17}/></button>)}</div>
    <div className="section-head"><div><h2>Manual entry</h2><p className="muted">Add information without importing a statement.</p></div><button className="secondary"><Plus size={16}/> Add transaction</button></div>
    <div className="manual-grid">{["Income","Expense","Budget","Investment"].map((x,i)=><div className="card manual" key={x}><div className="manual-icon">{i===0?<TrendingUp/>:i===1?<Receipt/>:i===2?<PieChart/>:<BarChart3/>}</div><h3>Add {x}</h3><p className="muted">Create a new {x.toLowerCase()} record manually.</p><button className="text-btn">Add {x} <ArrowUpRight size={15}/></button></div>)}</div>
  </div>
}

function DetailPage({type,go}:{type:"income"|"fees";go:(v:View)=>void}) {
  const income = type==="income";
  return <div className="content">
    <div className="hero-row"><div><p className="eyebrow">{income?"INCOME":"BANK FEES"}</p><h1>{income?"Income":"Bank fees"}</h1><p className="muted">{income?"Track where your money comes from.":"Keep an eye on every bank commission."}</p></div><button className="secondary" onClick={()=>go("data")}><ChevronRight size={16}/> My Data</button></div>
    <div className="stats-grid"><Stat title={income?"Total income":"Total fees"} value={income?"€2,450.00":"€12.40"} change={income?"+3.2%":"+1.4%"} up={income}/><Stat title="Transactions" value={income?"8":"4"} change="This month"/><Stat title="Average" value={income?"€306.25":"€3.10"} change="Per transaction"/><Stat title="Last month" value={income?"€2,374":"€12.23"} change={income?"+3.2%":"+1.4%"} /></div>
    <section className="card"><div className="card-head"><div><h3>Transaction history</h3><p>August 2026</p></div><button className="secondary"><Plus size={15}/> Add</button></div><TransactionList/></section>
  </div>
}

function ExpensesPage({go}:{go:(v:View)=>void}) {
  return <div className="content">
    <div className="hero-row"><div><p className="eyebrow">EXPENSE ANALYSIS</p><h1>Expenses</h1><p className="muted">See exactly where your money goes.</p></div><button className="secondary" onClick={()=>go("data")}>Back to My Data</button></div>
    <div className="dashboard-grid">
      <section className="card donut-card"><div className="card-head"><div><h3>Spending by category</h3><p>August 2026</p></div></div><div className="donut"><div><strong>€1,284</strong><span>Total</span></div></div><div className="legend">{expenseData.map(([n,p])=><div key={n}><i/><span>{n}</span><b>{p}%</b></div>)}</div></section>
      <section className="card"><div className="card-head"><div><h3>Top spending</h3><p>Highest categories this month</p></div></div><div className="rank-list">{expenseData.slice(0,5).map(([n,p],i)=><div className="rank" key={n}><span>{i+1}</span><div><strong>{n}</strong><div className="mini-progress"><i style={{width:`${p*3}%`}}/></div></div><b>{p}%</b></div>)}</div></section>
    </div>
    <section className="card"><div className="card-head"><div><h3>Recent expenses</h3><p>AI categorized transactions</p></div><button className="secondary"><Plus size={15}/> Add expense</button></div><TransactionList/></section>
  </div>
}

function BudgetPage({go}:{go:(v:View)=>void}) {
  return <div className="content"><div className="hero-row"><div><p className="eyebrow">BUDGET</p><h1>Monthly budget</h1><p className="muted">August 2026 · €515.40 remaining</p></div><button className="primary"><Plus size={16}/> New budget</button></div>
    <section className="card budget-large"><div><p className="eyebrow">TOTAL SPENDING</p><h2>€1,284.60 <span>/ €1,800</span></h2></div><div className="progress big"><span style={{width:"71%"}}/></div><div className="budget-foot"><span>71% used</span><span>€515.40 remaining</span></div></section>
    <div className="manual-grid">{[["Groceries","€321","€400"],["Subscriptions","€231","€250"],["Utilities","€218","€220"],["Transport","€154","€200"]].map(([n,v,b])=><div className="card category-budget" key={n}><div><strong>{n}</strong><span>{v} / {b}</span></div><div className="progress"><span style={{width:n==="Utilities"?"99%":n==="Subscriptions"?"92%":n==="Groceries"?"80%":"77%"}}/></div></div>)}</div>
  </div>
}

function InvestmentsPage() {
  return <div className="content"><div className="hero-row"><div><p className="eyebrow">PORTFOLIO</p><h1>Investments</h1><p className="muted">Track your portfolio and performance.</p></div><button className="primary"><Plus size={16}/> Add investment</button></div>
    <div className="stats-grid"><Stat title="Portfolio value" value="€12,640.00" change="+11.7%" up/><Stat title="Total invested" value="€11,320.00" change="+8.4%" up/><Stat title="Total return" value="+€1,320.00" change="+11.7%" up/><Stat title="Assets" value="6" change="Tracked"/></div>
    <section className="card chart-card"><div className="card-head"><div><h3>Portfolio performance</h3><p>Last 12 months</p></div></div><div className="line-chart"><svg viewBox="0 0 700 180" preserveAspectRatio="none"><polyline points="0,145 80,132 145,140 220,110 290,118 350,83 420,95 480,70 550,79 620,42 700,20" fill="none" stroke="currentColor" strokeWidth="3"/></svg></div></section>
  </div>
}

function AIPage({message,setMessage}:{message:string;setMessage:(v:string)=>void}) {
  const suggestions = ["How can I save €200 this month?","Where am I spending the most?","Which subscriptions could I reduce?"];
  return <div className="content ai-page"><div className="hero-row"><div><p className="eyebrow">MAKE IT RIGHT AI</p><h1>Your financial copilot.</h1><p className="muted">Ask questions, understand your data and get practical suggestions.</p></div></div>
    <section className="card chat"><div className="chat-header"><div className="ai-icon"><Bot size={21}/></div><div><strong>Make It Right AI</strong><span>Analyzing your latest financial data</span></div><span className="online">Online</span></div>
      <div className="chat-body"><div className="bubble ai"><Sparkles size={15}/><span>Based on your August data, your spending is <b>8.1% lower</b> than last month. Your biggest opportunity is recurring subscriptions, where you currently spend €231/month.</span></div>{message && <div className="bubble user">{message}</div>}<div className="suggestions">{suggestions.map(s=><button key={s} onClick={()=>setMessage(s)}>{s}</button>)}</div></div>
      <div className="chat-input"><input value={message} onChange={e=>setMessage(e.target.value)} placeholder="Ask anything about your finances..." onKeyDown={e=>e.key==="Enter"&&setMessage(message)}/><button><ArrowUpRight size={17}/></button></div>
    </section>
  </div>
}

function SubscriptionPage() {
  const plans = [["Monthly","€5","per month","Flexible monthly billing"],["Annual","€25","per year","Best value for yearly access"],["Biannual","€20","per year","Early-access / promotional plan"]];
  return <div className="content"><div className="center-heading"><p className="eyebrow">MEMBERSHIP</p><h1>Choose your plan.</h1><p className="muted">Unlock the full Make It Right experience.</p></div><div className="plans">{plans.map(([name,price,period,desc],i)=><div className={`plan card ${i===1?"featured":""}`} key={name}>{i===1&&<span className="recommended">RECOMMENDED</span>}<h3>{name}</h3><p>{desc}</p><div className="price">{price}<small>{period}</small></div><ul><li>AI financial insights</li><li>Unlimited financial tracking</li><li>Budget monitoring</li><li>PDF statement analysis</li></ul><button className={i===1?"primary":"secondary"}>Choose {name}</button></div>)}</div></div>
}

function UploadModal({onClose}:{onClose:()=>void}) {
  const [uploaded,setUploaded]=useState(false);
  return <div className="modal-backdrop"><div className="modal card"><button className="modal-close" onClick={onClose}><X/></button><div className="upload-circle large"><Upload/></div><p className="eyebrow">AI IMPORT</p><h2>Upload your bank statement</h2><p className="muted">PDF files are processed to identify income, fees and expenses. This prototype simulates the AI classification step.</p>{uploaded?<div className="processing"><Sparkles/><div><strong>AI analysis complete</strong><span>126 transactions detected · 98.2% average confidence</span></div></div>:<label className="dropzone"><Upload size={25}/><strong>Drop your PDF here</strong><span>or click to browse · PDF up to 10 MB</span><input type="file" accept=".pdf" onChange={()=>setUploaded(true)}/></label>}<button className="primary full" onClick={onClose}>{uploaded?"Review classifications":"Cancel"}</button></div></div>
}
