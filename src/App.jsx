import { useState, useRef } from "react";

// ─── Sample seed jobs (from pre-existing employers) ──────────────────────────
const SEED_JOBS = [
  { id:"sj1", empId:"seed", empName:"Amina Hassan", title:"House Cleaning", desc:"Experienced cleaner needed for a spacious 4-bedroom house in Mikocheni. All cleaning supplies provided. Work hours: 8am–4pm. Friendly household.", loc:"Mikocheni, Dar es Salaam", pay:"TSh 25,000/day", cat:"Cleaning", posted:"Jun 5, 2026", img:null, status:"open" },
  { id:"sj2", empId:"seed", empName:"Robert Mwangi", title:"Night Security Guard", desc:"Reliable security guard for gated residential compound. 6PM–6AM shift. Uniform and meals provided. Must be honest and alert.", loc:"Oyster Bay, Dar es Salaam", pay:"TSh 40,000/night", cat:"Security", posted:"Jun 7, 2026", img:null, status:"open" },
  { id:"sj3", empId:"seed", empName:"Sarah Kimani", title:"Nanny & Childcare", desc:"Loving, experienced nanny for two young children (ages 3 and 5). Mon–Fri, 7am–5pm. Must be patient and trustworthy.", loc:"Masaki, Dar es Salaam", pay:"TSh 350,000/month", cat:"Childcare", posted:"Jun 7, 2026", img:null, status:"open" },
  { id:"sj4", empId:"seed", empName:"Joseph Tarimo", title:"Construction Laborer", desc:"General laborers needed for new residential project. Heavy lifting involved. Safety boots and hard hats provided. 6 days/week.", loc:"Mbagala, Dar es Salaam", pay:"TSh 22,000/day", cat:"Construction", posted:"Jun 8, 2026", img:null, status:"open" },
  { id:"sj5", empId:"seed", empName:"Grace Mushi", title:"Family Cook", desc:"Home cook needed for a family of 6. Lunch and dinner preparation. Comfortable kitchen. Own recipes welcome.", loc:"Sinza, Dar es Salaam", pay:"TSh 280,000/month", cat:"Cooking", posted:"Jun 8, 2026", img:null, status:"open" },
  { id:"sj6", empId:"seed", empName:"David Lyimo", title:"Driver / Chauffeur", desc:"Personal driver needed. Must have a clean driving licence (Class C). Flexible hours. Car provided. Punctuality is essential.", loc:"Upanga, Dar es Salaam", pay:"TSh 400,000/month", cat:"Driving", posted:"Jun 8, 2026", img:null, status:"open" },
];

const CATICONS = { Cleaning:"🧹", Security:"🔒", Childcare:"👶", Construction:"🏗️", Cooking:"👨‍🍳", Gardening:"🌿", Driving:"🚗", Painting:"🎨", Plumbing:"🪛", Other:"💼" };
const ALL_CATS = ["Cleaning","Security","Childcare","Construction","Cooking","Gardening","Driving","Painting","Plumbing","Other"];
const EDU_OPTS = ["No formal education","Primary school","Secondary (O-Level)","Secondary (A-Level)","Certificate / Diploma","Bachelor's Degree","Masters / Postgraduate"];
const PROG_STEPS = ["Confirmed","Arrived","Inspection","Completed"];

// ─── UI Helpers ───────────────────────────────────────────────────────────────
const Btn = ({ onClick, children, v="primary", cls="", disabled=false }) => {
  const s = { primary:"bg-teal-700 text-white hover:bg-teal-800", secondary:"bg-amber-400 text-amber-900 hover:bg-amber-500", outline:"border-2 border-teal-700 text-teal-700 hover:bg-teal-50", ghost:"text-teal-700 hover:bg-teal-50", red:"bg-red-500 text-white hover:bg-red-600" };
  return <button onClick={onClick} disabled={disabled} className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50 ${s[v]||s.primary} ${cls}`}>{children}</button>;
};

const Field = ({ label, value, onChange, type="text", ph="", req=false, rows=0 }) => (
  <div className="mb-4">
    <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">{label}{req && <span className="text-red-500 ml-1">*</span>}</label>
    {rows > 0
      ? <textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows} placeholder={ph} className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 transition-colors" />
      : <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={ph} className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 transition-colors" />
    }
  </div>
);

const Sel = ({ label, value, onChange, opts, req=false }) => (
  <div className="mb-4">
    <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">{label}{req && <span className="text-red-500 ml-1">*</span>}</label>
    <select value={value} onChange={e=>onChange(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 bg-white transition-colors">
      <option value="">— Select —</option>
      {opts.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const Bar = ({ title, onBack, right }) => (
  <div className="bg-teal-800 text-white px-4 py-3 flex items-center gap-3 sticky top-0 z-10 shadow">
    {onBack && <button onClick={onBack} className="text-xl font-bold leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-teal-700">←</button>}
    <h1 className="flex-1 font-black text-base">{title}</h1>
    {right}
  </div>
);

const Chip = ({ text, color="teal" }) => {
  const c = { teal:"bg-teal-100 text-teal-800", amber:"bg-amber-100 text-amber-800", green:"bg-green-100 text-green-800", red:"bg-red-100 text-red-800", gray:"bg-gray-100 text-gray-600" };
  return <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap ${c[color]||c.teal}`}>{text}</span>;
};

const ProgressTrack = ({ step }) => {
  const idx = PROG_STEPS.indexOf(step);
  return (
    <div className="flex items-start gap-0 my-4">
      {PROG_STEPS.map((s, i) => (
        <div key={s} className="flex-1 flex flex-col items-center relative">
          {i < PROG_STEPS.length - 1 && (
            <div className={`absolute top-3.5 left-1/2 w-full h-0.5 ${i < idx ? "bg-teal-600" : "bg-gray-200"}`} />
          )}
          <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${i < idx ? "bg-teal-600 text-white" : i === idx ? "bg-teal-700 text-white ring-4 ring-teal-200" : "bg-gray-200 text-gray-400"}`}>
            {i < idx ? "✓" : i+1}
          </div>
          <span className={`text-xs mt-1 text-center leading-tight font-semibold ${i <= idx ? "text-teal-700" : "text-gray-400"}`}>{s}</span>
        </div>
      ))}
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [uType, setUType] = useState(null);
  const [user, setUser] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [jobs, setJobs] = useState(SEED_JOBS);
  const [apps, setApps] = useState([]);
  const [msgs, setMsgs] = useState([]);
  const [selJob, setSelJob] = useState(null);

  const go = (s) => { setScreen(s); window.scrollTo(0,0); };
  const ping = (m) => setMsgs(p=>[...p,{ id:Date.now(), text:m, at:new Date().toLocaleTimeString() }]);

  const p = { go, uType, setUType, user, setUser, workers, setWorkers, employers, setEmployers, jobs, setJobs, apps, setApps, ping, selJob, setSelJob, msgs };

  const screens = {
    landing:          <Landing {...p} />,
    auth:             <Auth {...p} />,
    "worker-profile": <WorkerProf {...p} />,
    "worker-feed":    <WorkerFeed {...p} />,
    "worker-job":     <WorkerJob {...p} />,
    "emp-profile":    <EmpProf {...p} />,
    "emp-dash":       <EmpDash {...p} />,
    "admin":          <AdminView {...p} />,
  };
  return <div className="max-w-md mx-auto min-h-screen font-sans">{screens[screen] || <Landing {...p}/>}</div>;
}

// ─── 1. LANDING ───────────────────────────────────────────────────────────────
function Landing({ go, setUType }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-900 to-teal-700 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🤝</div>
          <h1 className="text-4xl font-black text-white tracking-tight">KaziLink</h1>
          <p className="text-teal-200 mt-2 text-sm font-medium">Tanzania's trusted worker–employer platform</p>
          <div className="mt-3 flex items-center justify-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="text-teal-300 text-xs">Dar es Salaam • Trusted Middleman Service</span>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <button onClick={() => { setUType("worker"); go("auth"); }}
            className="w-full bg-white rounded-2xl p-6 text-left shadow-xl hover:shadow-2xl transition-all active:scale-95 group">
            <div className="text-4xl mb-3">👷</div>
            <h2 className="text-xl font-black text-teal-900">I'm Looking for Work</h2>
            <p className="text-sm text-gray-500 mt-1">Browse jobs posted by employers near you</p>
            <div className="mt-4 inline-flex items-center gap-2 bg-teal-700 text-white text-sm font-bold px-4 py-2 rounded-xl group-hover:bg-teal-800 transition-colors">
              Sign In as Worker →
            </div>
          </button>

          <button onClick={() => { setUType("employer"); go("auth"); }}
            className="w-full bg-amber-400 rounded-2xl p-6 text-left shadow-xl hover:shadow-2xl transition-all active:scale-95 group">
            <div className="text-4xl mb-3">🏢</div>
            <h2 className="text-xl font-black text-amber-900">I'm Hiring Workers</h2>
            <p className="text-sm text-amber-800 mt-1">Post jobs and find reliable workers quickly</p>
            <div className="mt-4 inline-flex items-center gap-2 bg-amber-600 text-white text-sm font-bold px-4 py-2 rounded-xl group-hover:bg-amber-700 transition-colors">
              Sign In as Employer →
            </div>
          </button>
        </div>

        <p className="text-teal-400 text-xs mt-10 text-center">
          Questions? Contact us: <span className="text-teal-200 font-semibold">+255 700 000 000</span>
        </p>
      </div>
    </div>
  );
}

// ─── 2. AUTH ──────────────────────────────────────────────────────────────────
function Auth({ go, uType, user, setUser, workers, setWorkers, employers, setEmployers }) {
  const [mode, setMode] = useState("signup");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const [conf, setConf] = useState("");
  const [err, setErr] = useState("");
  const isW = uType === "worker";

  const doSignup = () => {
    setErr("");
    if (!phone || !pass) return setErr("Please enter phone and password.");
    if (pass !== conf) return setErr("Passwords do not match.");
    if ((isW ? workers : employers).find(u => u.phone === phone)) return setErr("Account already exists. Please sign in.");
    const u = { id:`${uType}-${Date.now()}`, phone, pass, type:uType, profileDone:false };
    if (isW) setWorkers(p=>[...p,u]); else setEmployers(p=>[...p,u]);
    setUser(u);
    go(isW ? "worker-profile" : "emp-profile");
  };

  const doSignin = () => {
    setErr("");
    const list = isW ? workers : employers;
    const u = list.find(x => x.phone===phone && x.pass===pass);
    if (!u) return setErr("Phone number or password is incorrect.");
    setUser(u);
    go(isW ? (u.profileDone?"worker-feed":"worker-profile") : (u.profileDone?"emp-dash":"emp-profile"));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className={`${isW?"bg-teal-800":"bg-amber-500"} px-6 pt-10 pb-16`}>
        <button onClick={() => go("landing")} className="text-white text-2xl mb-6 block font-bold">←</button>
        <div className="text-5xl mb-3">{isW?"👷":"🏢"}</div>
        <h1 className="text-2xl font-black text-white">{isW?"Worker Account":"Employer Account"}</h1>
        <p className="text-sm text-white opacity-75 mt-1">{mode==="signup"?"Create your free account":"Welcome back to KaziLink"}</p>
      </div>

      <div className="bg-white rounded-t-3xl -mt-6 flex-1 px-6 pt-8 pb-10">
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-2xl">
          {[["signup","Sign Up"],["signin","Sign In"]].map(([k,l]) => (
            <button key={k} onClick={() => setMode(k)} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode===k?"bg-white shadow text-teal-900":"text-gray-400"}`}>{l}</button>
          ))}
        </div>

        {err && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-3 py-2.5 mb-4 font-medium">⚠️ {err}</div>}

        <Field label="Phone Number" value={phone} onChange={setPhone} type="tel" ph="e.g. 0712 345 678" req />
        <Field label="Password" value={pass} onChange={setPass} type="password" req />
        {mode==="signup" && <Field label="Confirm Password" value={conf} onChange={setConf} type="password" req />}

        <Btn onClick={mode==="signup"?doSignup:doSignin} cls="w-full py-3 text-base mt-1">
          {mode==="signup"?"Create Account →":"Sign In →"}
        </Btn>

        <p className="text-center text-xs text-gray-400 mt-5 leading-relaxed">
          By creating an account you agree to KaziLink's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

// ─── 3. WORKER PROFILE ───────────────────────────────────────────────────────
function WorkerProf({ go, user, setUser, workers, setWorkers }) {
  const [f, setF] = useState({ nin:"", firstName:"", middleName:"", surname:"", residence:"", age:"", gender:"", education:"", marital:"" });
  const [photos, setPhotos] = useState([null, null, null]);
  const [done, setDone] = useState(false);
  const refs = [useRef(), useRef(), useRef()];
  const set = (k,v) => setF(p=>({...p,[k]:v}));

  const handlePic = (i, e) => {
    const file = e.target.files[0]; if(!file) return;
    const r = new FileReader();
    r.onload = () => setPhotos(p=>{ const n=[...p]; n[i]=r.result; return n; });
    r.readAsDataURL(file);
  };

  const save = () => {
    if (!f.firstName || !f.surname || !f.nin) return alert("Please fill in at least NIN, First Name, and Surname.");
    const updated = { ...user, ...f, photos, profileDone:true };
    setUser(updated);
    setWorkers(p => p.map(w => w.id===user.id ? updated : w));
    setDone(true);
    setTimeout(() => go("worker-feed"), 900);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Bar title="Complete Your Profile" onBack={() => go("landing")} />
      <div className="px-4 py-5 pb-24 space-y-4 max-w-lg mx-auto">

        <div className="bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 text-sm text-teal-800 font-medium">
          📋 Please complete all details. Your profile is visible to employers — honesty builds trust.
        </div>

        {/* Identity */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">🪪 Identity</p>
          <Field label="National Identity Number (NIN)" value={f.nin} onChange={v=>set("nin",v)} ph="Enter your NIN" req />
        </div>

        {/* Full Name */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">👤 Full Name</p>
          <Field label="First Name" value={f.firstName} onChange={v=>set("firstName",v)} req />
          <Field label="Middle Name" value={f.middleName} onChange={v=>set("middleName",v)} ph="Optional" />
          <Field label="Surname / Last Name" value={f.surname} onChange={v=>set("surname",v)} req />
        </div>

        {/* Personal Details */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">📍 Personal Details</p>
          <Field label="Place of Residence" value={f.residence} onChange={v=>set("residence",v)} ph="e.g. Kinondoni, Dar es Salaam" req />
          <Field label="Age" value={f.age} onChange={v=>set("age",v)} type="number" ph="e.g. 28" req />
          <Sel label="Gender" value={f.gender} onChange={v=>set("gender",v)} opts={["Male","Female","Prefer not to say"]} req />
          <Sel label="Highest Education Level" value={f.education} onChange={v=>set("education",v)} opts={EDU_OPTS} req />
          <Sel label="Marital Status" value={f.marital} onChange={v=>set("marital",v)} opts={["Single","Married","Divorced","Widowed"]} />
        </div>

        {/* Photos */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">📸 Profile Photos</p>
          <p className="text-xs text-gray-500 mb-3">Upload 3 photos that employers will see on your profile. Clear face photos work best.</p>
          <div className="grid grid-cols-3 gap-3">
            {[0,1,2].map(i => (
              <div key={i}>
                <div onClick={() => refs[i].current.click()}
                  className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-teal-400 transition-colors overflow-hidden bg-gray-50">
                  {photos[i]
                    ? <img src={photos[i]} className="w-full h-full object-cover" alt={`Photo ${i+1}`} />
                    : <><span className="text-3xl">📷</span><span className="text-xs text-gray-400 mt-1">Photo {i+1}</span></>
                  }
                </div>
                <input ref={refs[i]} type="file" accept="image/*" className="hidden" onChange={e=>handlePic(i,e)} />
              </div>
            ))}
          </div>
        </div>

        <Btn onClick={save} cls="w-full py-3.5 text-base" disabled={done}>
          {done ? "✅ Saved! Loading jobs..." : "Save Profile & Browse Jobs →"}
        </Btn>
      </div>
    </div>
  );
}

// ─── 4. WORKER FEED ──────────────────────────────────────────────────────────
function WorkerFeed({ go, user, jobs, apps, setSelJob }) {
  const [cat, setCat] = useState("All");
  const cats = ["All", ...ALL_CATS];
  const myApps = apps.filter(a => a.wId===user?.id);
  const visible = cat==="All" ? jobs : jobs.filter(j=>j.cat===cat);
  const appMap = Object.fromEntries(myApps.map(a=>[a.jId, a.status]));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-teal-800 px-4 pt-8 pb-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-white font-black text-xl tracking-tight">KaziLink</h1>
            <p className="text-teal-200 text-xs">Karibu, {user?.firstName||"Worker"} 👋</p>
          </div>
          <button onClick={() => go("worker-profile")}
            className="w-10 h-10 rounded-full bg-teal-600 border-2 border-teal-400 flex items-center justify-center text-xl overflow-hidden">
            {user?.photos?.[0] ? <img src={user.photos[0]} className="w-full h-full object-cover" /> : "👷"}
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1">
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${cat===c?"bg-amber-400 text-amber-900":"bg-teal-600 text-teal-100 hover:bg-teal-500"}`}>
              {c==="All" ? "🔍 All" : `${CATICONS[c]||"💼"} ${c}`}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 pb-24">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-gray-600">{visible.length} job{visible.length!==1?"s":""} available</p>
          {myApps.length > 0 && <Chip text={`${myApps.length} applied`} color="teal" />}
        </div>

        {visible.map(job => {
          const st = appMap[job.id];
          return (
            <div key={job.id} onClick={() => { setSelJob(job.id); go("worker-job"); }}
              className="bg-white rounded-2xl p-4 mb-3 shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-98 border border-gray-100">
              {job.img && <img src={job.img} className="w-full h-32 object-cover rounded-xl mb-3" alt="Job" />}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-lg">{CATICONS[job.cat]||"💼"}</span>
                    <h3 className="font-black text-gray-900 truncate">{job.title}</h3>
                  </div>
                  <p className="text-xs text-gray-500 font-semibold">{job.empName}</p>
                </div>
                {st && <Chip text={st==="pending"?"Applied ⏳":st==="confirmed"?"Confirmed ✓":st} color={st==="confirmed"?"green":"amber"} />}
              </div>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{job.desc}</p>
              <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                <span>📍 {job.loc}</span>
                <span className="font-black text-teal-700 text-sm">{job.pay}</span>
              </div>
              <p className="text-xs text-gray-300 mt-1.5">Posted {job.posted}</p>
            </div>
          );
        })}
        {visible.length===0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">🔍</div>
            <p className="font-bold">No jobs in this category yet</p>
            <p className="text-sm mt-1">Check back soon or try a different category</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 flex px-4 py-2 z-10">
        <NavItem icon="🏠" label="Feed" active />
        <NavItem icon="📋" label="My Jobs" onClick={() => {}} />
        <NavItem icon="👷" label="Profile" onClick={() => go("worker-profile")} />
      </div>
    </div>
  );
}

// ─── 5. WORKER JOB DETAIL ────────────────────────────────────────────────────
function WorkerJob({ go, selJob, jobs, apps, setApps, user, ping }) {
  const job = jobs.find(j => j.id === selJob);
  if (!job) return <div className="p-8 text-center text-gray-400">Job not found. <button onClick={()=>go("worker-feed")} className="text-teal-600 font-bold">← Back</button></div>;

  const myApp = apps.find(a => a.jId===job.id && a.wId===user?.id);
  const st = myApp?.status;
  const prog = myApp?.progress;

  const doApply = () => {
    const a = { id:`app-${Date.now()}`, jId:job.id, wId:user.id, wName:`${user.firstName||""} ${user.surname||""}`.trim(), eId:job.empId, status:"pending", progress:null, appliedAt:new Date().toLocaleString() };
    setApps(p=>[...p,a]);
    ping(`NEW APPLICATION: Worker "${a.wName}" applied for "${job.title}" by ${job.empName}. Please await employer confirmation.`);
  };

  const doArrival = () => {
    setApps(p=>p.map(a=>a.id===myApp.id?{...a,progress:"Arrived",arrivedAt:new Date().toLocaleTimeString()}:a));
    ping(`ARRIVAL CONFIRMED: Worker "${myApp.wName}" has arrived at location for "${job.title}". Employer: ${job.empName}.`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Bar title="Job Details" onBack={() => go("worker-feed")} />
      <div className="px-4 pt-4 pb-24 max-w-lg mx-auto">

        {/* Job Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          {job.img && <img src={job.img} className="w-full h-44 object-cover rounded-xl mb-4" alt="Job" />}
          <div className="flex items-start gap-3 mb-4">
            <div className="text-5xl">{CATICONS[job.cat]||"💼"}</div>
            <div>
              <h1 className="font-black text-gray-900 text-xl leading-tight">{job.title}</h1>
              <p className="text-sm font-bold text-teal-700 mt-0.5">{job.empName}</p>
              <p className="text-xs text-gray-400">📍 {job.loc}</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl px-4 py-3 mb-4">
            <p className="text-xs text-teal-600 font-bold uppercase tracking-wide">Pay / Salary</p>
            <p className="text-2xl font-black text-teal-900">{job.pay}</p>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{job.desc}</p>
          <p className="text-xs text-gray-300 mt-3">Posted: {job.posted}</p>
        </div>

        {/* Action sections */}
        {!st && (
          <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
            <h2 className="font-black text-gray-900 mb-2">Ready for this job?</h2>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">Tap the button below to apply. Your profile will be sent to the employer for review. Our team at KaziLink will be notified to assist.</p>
            <Btn onClick={doApply} cls="w-full py-3.5 text-base">✅ I'm Ready — Apply for This Job</Btn>
          </div>
        )}

        {st==="pending" && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-4">
            <div className="text-3xl mb-2">⏳</div>
            <h2 className="font-black text-amber-900">Application Submitted!</h2>
            <p className="text-sm text-amber-800 mt-2 leading-relaxed">Your application has been sent to <strong>{job.empName}</strong>. Waiting for the employer to review and confirm you.</p>
            <p className="text-xs text-amber-600 mt-2 font-medium">✅ KaziLink team has been notified and will follow up with you.</p>
          </div>
        )}

        {(st==="confirmed") && (
          <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
            <h2 className="font-black text-green-800 mb-1">🎉 You Are Confirmed!</h2>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">The employer has confirmed you. KaziLink will contact you with full details of the job location and start time.</p>
            <ProgressTrack step={prog||"Confirmed"} />

            {!prog || prog==="Confirmed" ? (
              <div className="mt-4">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-3 text-sm text-blue-800">
                  📍 When you physically arrive at the job location, tap the button below to confirm your arrival.
                </div>
                <Btn onClick={doArrival} v="secondary" cls="w-full py-3 text-base">📍 I Have Arrived at the Workplace</Btn>
              </div>
            ) : null}

            {prog==="Arrived" && (
              <div className="mt-3 bg-green-50 rounded-xl p-3 text-sm text-green-700 font-medium">
                ✅ Arrival confirmed at {myApp.arrivedAt}. The employer has been notified. Begin your work.
              </div>
            )}
            {prog==="Inspection" && (
              <div className="mt-3 bg-blue-50 rounded-xl p-3 text-sm text-blue-700 font-medium">
                🔍 Employer is currently inspecting your work. Please await feedback.
              </div>
            )}
            {prog==="Completed" && (
              <div className="mt-3 bg-green-50 rounded-xl p-3 text-sm text-green-800 font-bold text-center">
                🎉 Job Complete! Well done. KaziLink will process your payment. Thank you!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 6. EMPLOYER PROFILE ─────────────────────────────────────────────────────
function EmpProf({ go, user, setUser, employers, setEmployers }) {
  const [f, setF] = useState({ nin:"", firstName:"", middleName:"", surname:"", residence:"", age:"", gender:"", education:"", marital:"", company:"" });
  const [done, setDone] = useState(false);
  const set = (k,v) => setF(p=>({...p,[k]:v}));

  const save = () => {
    if (!f.firstName || !f.surname || !f.nin) return alert("Please fill in NIN, First Name, and Surname.");
    const upd = { ...user, ...f, profileDone:true };
    setUser(upd);
    setEmployers(p=>p.map(e=>e.id===user.id?upd:e));
    setDone(true);
    setTimeout(() => go("emp-dash"), 900);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-amber-500 text-white px-4 py-3 flex items-center gap-3 sticky top-0 z-10 shadow">
        <button onClick={() => go("landing")} className="text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-amber-400">←</button>
        <h1 className="flex-1 font-black text-base">Employer Profile</h1>
      </div>

      <div className="px-4 py-5 pb-24 space-y-4 max-w-lg mx-auto">
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-900 font-medium">
          🏢 Your profile details help workers trust your job postings. All information is verified by KaziLink.
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">🪪 Identity</p>
          <Field label="National Identity Number (NIN)" value={f.nin} onChange={v=>set("nin",v)} ph="Enter your NIN" req />
          <Field label="Company / Business Name" value={f.company} onChange={v=>set("company",v)} ph="Leave blank if individual employer" />
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">👤 Full Name</p>
          <Field label="First Name" value={f.firstName} onChange={v=>set("firstName",v)} req />
          <Field label="Middle Name" value={f.middleName} onChange={v=>set("middleName",v)} ph="Optional" />
          <Field label="Surname / Last Name" value={f.surname} onChange={v=>set("surname",v)} req />
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">📍 Personal Details</p>
          <Field label="Place of Residence" value={f.residence} onChange={v=>set("residence",v)} ph="e.g. Oyster Bay, Dar es Salaam" req />
          <Field label="Age" value={f.age} onChange={v=>set("age",v)} type="number" ph="e.g. 45" />
          <Sel label="Gender" value={f.gender} onChange={v=>set("gender",v)} opts={["Male","Female","Prefer not to say"]} />
          <Sel label="Highest Education Level" value={f.education} onChange={v=>set("education",v)} opts={EDU_OPTS} />
          <Sel label="Marital Status" value={f.marital} onChange={v=>set("marital",v)} opts={["Single","Married","Divorced","Widowed"]} />
        </div>

        <button onClick={save} disabled={done}
          className="w-full py-3.5 rounded-xl font-bold text-base bg-amber-400 text-amber-900 hover:bg-amber-500 transition-all active:scale-95 disabled:opacity-50">
          {done ? "✅ Saved! Loading Dashboard..." : "Save Profile & Post Jobs →"}
        </button>
      </div>
    </div>
  );
}

// ─── 7. EMPLOYER DASHBOARD ───────────────────────────────────────────────────
function EmpDash({ go, user, jobs, setJobs, apps, setApps, ping, workers }) {
  const [tab, setTab] = useState("post");
  const [f, setF] = useState({ title:"", desc:"", loc:"", pay:"", cat:"Cleaning" });
  const [jImg, setJImg] = useState(null);
  const iRef = useRef();
  const setFld = (k,v) => setF(p=>({...p,[k]:v}));

  const myJobs = jobs.filter(j => j.empId===user?.id);
  const myApps = apps.filter(a => myJobs.some(j=>j.id===a.jId));

  const postJob = () => {
    if (!f.title||!f.desc||!f.loc||!f.pay) return alert("Please fill in all job fields.");
    const j = { id:`j-${Date.now()}`, empId:user.id, empName:`${user.firstName} ${user.surname}`, ...f, posted:"Today", img:jImg, status:"open" };
    setJobs(p=>[j,...p]);
    setF({ title:"", desc:"", loc:"", pay:"", cat:"Cleaning" });
    setJImg(null);
    setTab("jobs");
  };

  const confirmWorker = (appId) => {
    const a = apps.find(x=>x.id===appId);
    setApps(p=>p.map(x=>x.id===appId?{...x,status:"confirmed",progress:"Confirmed"}:x));
    ping(`MIDDLEMAN ALERT 🔔: Employer "${user.firstName} ${user.surname}" (${user.phone}) confirmed worker "${a.wName}" for job. Please contact both parties to finalise arrangements.`);
  };

  const advanceProgress = (appId, step) => {
    setApps(p=>p.map(a=>a.id===appId?{...a,progress:step}:a));
    const a = apps.find(x=>x.id===appId);
    if (step==="Completed") ping(`JOB COMPLETE ✅: Worker "${a.wName}" has completed work for "${user.firstName}". Please process payment and close this job.`);
  };

  const setRating = (appId, r) => setApps(p=>p.map(a=>a.id===appId?{...a,rating:r}:a));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-amber-500 px-4 pt-8 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white font-black text-xl">KaziLink</h1>
            <p className="text-amber-100 text-xs">Employer: {user?.firstName||"—"} {user?.company?`• ${user.company}`:""}</p>
          </div>
          <button onClick={() => go("emp-profile")} className="w-10 h-10 rounded-full bg-amber-400 border-2 border-amber-300 flex items-center justify-center text-xl">🏢</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        {[["post","📝","Post Job"],["jobs","💼","My Jobs"],["track","📊","Track"]].map(([k,ic,l]) => (
          <button key={k} onClick={() => setTab(k)} className={`flex-1 flex flex-col items-center py-3 text-xs font-bold transition-all ${tab===k?"text-amber-600 border-b-2 border-amber-500":"text-gray-400"}`}>
            <span className="text-lg">{ic}</span>{l}
          </button>
        ))}
      </div>

      <div className="px-4 pt-4 pb-24 max-w-lg mx-auto">

        {/* ── POST JOB ── */}
        {tab==="post" && (
          <div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-sm text-amber-900 font-medium">
              📢 Post a job below. Workers in your area will be able to view and apply.
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm space-y-0">
              <Field label="Job Title" value={f.title} onChange={v=>setFld("title",v)} ph="e.g. House Cleaning, Night Guard, Cook" req />
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Category <span className="text-red-500">*</span></label>
                <select value={f.cat} onChange={e=>setFld("cat",e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-white">
                  {ALL_CATS.map(c=><option key={c} value={c}>{CATICONS[c]||"💼"} {c}</option>)}
                </select>
              </div>
              <Field label="Job Description" value={f.desc} onChange={v=>setFld("desc",v)} ph="Describe duties, working hours, requirements..." req rows={4} />
              <Field label="Location" value={f.loc} onChange={v=>setFld("loc",v)} ph="e.g. Mikocheni, Dar es Salaam" req />
              <Field label="Pay / Salary Offered" value={f.pay} onChange={v=>setFld("pay",v)} ph="e.g. TSh 25,000/day or TSh 400,000/month" req />

              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Job Image (optional)</label>
                <div onClick={() => iRef.current.click()} className="border-2 border-dashed border-gray-300 rounded-xl p-5 flex flex-col items-center cursor-pointer hover:border-amber-400 overflow-hidden transition-colors">
                  {jImg ? <img src={jImg} className="max-h-36 rounded-xl" alt="Job" /> : <><span className="text-4xl">🖼️</span><p className="text-sm text-gray-400 mt-1">Tap to add a photo of the job</p></>}
                </div>
                <input ref={iRef} type="file" accept="image/*" className="hidden" onChange={e=>{const fl=e.target.files[0];if(fl){const r=new FileReader();r.onload=()=>setJImg(r.result);r.readAsDataURL(fl);}}} />
              </div>

              <button onClick={postJob} className="w-full py-3.5 rounded-xl font-bold text-base bg-amber-400 text-amber-900 hover:bg-amber-500 transition-all active:scale-95">
                📢 Post This Job
              </button>
            </div>
          </div>
        )}

        {/* ── MY JOBS ── */}
        {tab==="jobs" && (
          <div>
            <p className="text-sm font-bold text-gray-600 mb-3">Your posted jobs & applicants</p>
            {myJobs.length===0 && (
              <div className="text-center py-16 text-gray-400">
                <div className="text-5xl mb-3">📭</div>
                <p className="font-bold">No jobs posted yet</p>
                <p className="text-sm mt-1">Tap "Post Job" to create your first listing</p>
              </div>
            )}
            {myJobs.map(job => {
              const jApps = apps.filter(a=>a.jId===job.id);
              return (
                <div key={job.id} className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{CATICONS[job.cat]||"💼"}</span>
                    <div>
                      <h3 className="font-black text-gray-900">{job.title}</h3>
                      <p className="text-xs text-gray-400">📍 {job.loc} · {job.pay}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    {jApps.length===0 && <p className="text-xs text-gray-400 italic py-2 pl-1">No applicants yet — share your job link to get more reach.</p>}
                    {jApps.map(a => (
                      <div key={a.id} className="border border-gray-100 rounded-xl p-3 mt-2 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-bold text-sm text-gray-900">👷 {a.wName}</p>
                            <p className="text-xs text-gray-400">Applied: {a.appliedAt}</p>
                          </div>
                          <Chip text={a.status==="confirmed"?"Confirmed ✓":"Pending"} color={a.status==="confirmed"?"green":"amber"} />
                        </div>
                        {a.status!=="confirmed" && (
                          <Btn onClick={() => confirmWorker(a.id)} cls="w-full py-2 text-xs">✅ Confirm This Worker</Btn>
                        )}
                        {a.status==="confirmed" && (
                          <p className="text-xs text-green-700 font-semibold mt-1">✅ KaziLink team notified. They will link you together.</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── TRACK ── */}
        {tab==="track" && (
          <div>
            <p className="text-sm font-bold text-gray-600 mb-3">Track confirmed workers</p>
            {myApps.filter(a=>a.status==="confirmed").length===0 && (
              <div className="text-center py-16 text-gray-400">
                <div className="text-5xl mb-3">📊</div>
                <p className="font-bold">No active workers yet</p>
                <p className="text-sm mt-1">Confirmed workers will appear here for tracking</p>
              </div>
            )}
            {myApps.filter(a=>a.status==="confirmed").map(a => {
              const job = jobs.find(j=>j.id===a.jId);
              const prog = a.progress||"Confirmed";
              const stepIdx = PROG_STEPS.indexOf(prog);
              const next = PROG_STEPS[stepIdx+1];

              return (
                <div key={a.id} className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
                  <h3 className="font-black text-gray-900">{job?.title}</h3>
                  <p className="text-sm font-bold text-teal-700">👷 {a.wName}</p>
                  <ProgressTrack step={prog} />

                  {prog==="Confirmed" && (
                    <div className="bg-amber-50 rounded-xl p-3 text-sm text-amber-800 font-medium">
                      ⏳ Waiting for worker to confirm arrival at your location.
                    </div>
                  )}

                  {prog==="Arrived" && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2 font-medium">✅ Worker has arrived. When you are ready to inspect the work:</p>
                      <Btn onClick={() => advanceProgress(a.id,"Inspection")} v="outline" cls="w-full py-2.5 text-sm">🔍 Begin Work Inspection</Btn>
                    </div>
                  )}

                  {prog==="Inspection" && (
                    <div>
                      <p className="text-xs text-gray-600 mb-2 font-medium">Rate the quality of work done:</p>
                      <div className="flex gap-1 mb-3">
                        {[1,2,3,4,5].map(s => (
                          <button key={s} onClick={() => setRating(a.id,s)} className={`text-2xl transition-all hover:scale-110 ${(a.rating||0)>=s?"opacity-100":"opacity-25"}`}>⭐</button>
                        ))}
                        {a.rating && <span className="ml-2 text-sm text-gray-600 font-bold self-center">{a.rating}/5</span>}
                      </div>
                      <Btn onClick={() => advanceProgress(a.id,"Completed")} cls="w-full py-2.5 text-sm">
                        ✅ Confirm Work Completed & Release Worker
                      </Btn>
                    </div>
                  )}

                  {prog==="Completed" && (
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                      <p className="text-green-800 font-black text-base">🎉 Job Completed!</p>
                      {a.rating && <p className="text-sm text-green-700 mt-1">Your rating: {"⭐".repeat(a.rating)}</p>}
                      <p className="text-xs text-green-600 mt-1">KaziLink team has been notified to process payment.</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 flex px-4 py-2 z-10">
        <NavItem icon="📝" label="Post" active={tab==="post"} onClick={() => setTab("post")} amber />
        <NavItem icon="💼" label="Jobs" active={tab==="jobs"} onClick={() => setTab("jobs")} amber />
        <NavItem icon="📊" label="Track" active={tab==="track"} onClick={() => setTab("track")} amber />
        <NavItem icon="🏢" label="Profile" onClick={() => go("emp-profile")} amber />
      </div>
    </div>
  );
}

// ─── 8. ADMIN / MIDDLEMAN VIEW ────────────────────────────────────────────────
function AdminView({ go, msgs }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => go("landing")} className="text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700">←</button>
        <h1 className="flex-1 font-black">KaziLink Admin — Middleman Inbox</h1>
      </div>
      <div className="px-4 py-4 pb-10 max-w-lg mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-sm text-blue-800 font-medium">
          🔔 This is your private inbox. All notifications about confirmed jobs, arrivals, and completions appear here.
        </div>
        {msgs.length===0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">📬</div>
            <p className="font-bold">No messages yet</p>
            <p className="text-sm mt-1">Notifications will appear here when workers apply, employers confirm, or jobs are completed.</p>
          </div>
        )}
        {[...msgs].reverse().map(m => (
          <div key={m.id} className="bg-white rounded-2xl p-4 mb-3 shadow-sm border-l-4 border-teal-500">
            <p className="text-xs text-gray-400 font-semibold mb-1">🕐 {m.at}</p>
            <p className="text-sm text-gray-800 leading-relaxed">{m.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Shared Nav Item ──────────────────────────────────────────────────────────
function NavItem({ icon, label, active=false, onClick, amber=false }) {
  const ac = amber ? "text-amber-600" : "text-teal-700";
  return (
    <button onClick={onClick} className={`flex-1 flex flex-col items-center py-1 transition-colors ${active ? ac : "text-gray-400"}`}>
      <span className="text-xl">{icon}</span>
      <span className="text-xs font-semibold mt-0.5">{label}</span>
    </button>
  );
}
