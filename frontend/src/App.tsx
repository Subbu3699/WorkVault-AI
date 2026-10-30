
import { useEffect, useRef, useState } from "react";
import {
  Activity,
  Bot,
  FileText,
  LayoutDashboard,
  Search,
  Send,
  ShieldCheck,
  Upload,
  Plus,
  Menu,
  Sparkles,
  RefreshCw,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";
import api from "./api";
import "./App.css";

const APP_LAYOUT_STYLES = `
/* WorkVault AI layout styles: kept with the component so the layout remains styled. */
.app-shell { display:flex; min-height:100vh; width:100%; background:#f5f6fb; color:#17213b; }
.sidebar { width:220px; flex:0 0 220px; min-height:100vh; position:sticky; top:0; height:100vh; display:flex; flex-direction:column; padding:24px 15px 18px; background:#fff; border-right:1px solid #e9eaf3; z-index:20; }
.brand { display:flex; align-items:center; gap:11px; padding:0 6px 34px; }
.brand-icon { width:42px; height:42px; display:grid; place-items:center; border-radius:13px; background:#eeeaff; color:#6c5ce7; flex-shrink:0; }
.brand h2 { margin:0; font-size:17px; font-weight:800; letter-spacing:-.5px; color:#26304b; }
.brand h2 span, .welcome-row h1 span { color:#6c5ce7; }
.brand p { margin:5px 0 0; color:#8d91a8; font-size:8px; letter-spacing:1.35px; font-weight:700; }
.nav-label { margin:8px 10px 12px; font-size:9px; letter-spacing:1.5px; color:#9699ad; font-weight:700; }
.sidebar nav { display:grid; gap:6px; }
.nav-item { width:100%; border:0; background:transparent; color:#727a96; display:flex; align-items:center; gap:12px; text-align:left; padding:13px 12px; border-radius:9px; font-size:12px; font-weight:600; }
.nav-item:hover { background:#f7f6ff; color:#6554d9; }
.nav-item.active { background:#efedff; color:#6554d9; }
.nav-new { margin-left:auto; font-size:9px; padding:4px 6px; border-radius:5px; background:#ddd7ff; color:#6554d9; }
.sidebar-bottom { margin-top:auto; }
.security-card { display:flex; align-items:flex-start; gap:10px; padding:15px 11px; border:1px solid #ece8ff; background:#f8f6ff; border-radius:10px; color:#6c5ce7; }
.security-card strong, .profile-info strong { display:block; font-size:10px; color:#303752; }
.security-card p { margin:8px 0 0; font-size:9px; line-height:1.5; color:#9699ad; }
.profile { margin-top:18px; padding:17px 4px 0; border-top:1px solid #e9eaf3; display:flex; align-items:center; gap:10px; }
.avatar,.top-avatar { display:grid; place-items:center; border-radius:50%; background:#eeeaff; color:#6c5ce7; font-weight:700; }
.avatar { width:34px; height:34px; }
.profile-info { display:grid; gap:5px; min-width:0; }
.profile-info span { font-size:9px; color:#9699ad; }
.profile-status { margin-left:auto; color:#27b889; }
.main-area { min-width:0; flex:1; }
.topbar { height:62px; background:#fff; border-bottom:1px solid #e9eaf3; display:flex; align-items:center; justify-content:space-between; padding:0 34px; position:sticky; top:0; z-index:10; }
.breadcrumbs { font-size:11px; color:#7f849d; }
.breadcrumbs span { margin:0 10px; color:#c0c3d2; }
.topbar-right { display:flex; align-items:center; gap:9px; }
.status-dot { display:inline-block; width:7px; height:7px; border-radius:50%; background:#28bd89; box-shadow:0 0 0 3px #e6f8f0; }
.system-status { font-size:10px; color:#7e849d; }
.top-avatar { width:31px; height:31px; margin-left:12px; font-size:11px; }
.page-content { max-width:1320px; padding:38px 36px 22px; margin:0 auto; }
.welcome-row { display:flex; align-items:center; justify-content:space-between; gap:24px; margin-bottom:28px; }
.eyebrow { margin:0 0 13px; font-size:9px; letter-spacing:1.5px; color:#6c5ce7; font-weight:800; }
.welcome-row h1 { margin:0; font-size:30px; line-height:1.2; letter-spacing:-1.1px; color:#202943; }
.page-description { margin:12px 0 0; color:#858ba3; font-size:12px; line-height:1.7; }
.welcome-decoration { display:grid; place-items:center; width:58px; height:58px; border:1px solid #e8e2ff; border-radius:17px; background:#f8f6ff; color:#6c5ce7; flex-shrink:0; }
.stats-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:15px; margin-bottom:18px; }
.stat-card,.panel { background:#fff; border:1px solid #e8eaf3; border-radius:12px; box-shadow:0 3px 12px rgba(34,42,75,.025); }
.stat-card { padding:18px; min-width:0; }
.stat-top { display:flex; align-items:center; justify-content:space-between; gap:10px; color:#858ba3; font-size:10px; }
.stat-icon { width:32px; height:32px; display:grid; place-items:center; border-radius:9px; background:#f0edff; color:#6c5ce7; }
.stat-icon svg { width:17px; height:17px; }
.stat-value { display:block; margin-top:18px; font-size:18px; color:#202943; }
.stat-card>p { margin:7px 0 0; font-size:10px; color:#969bb0; }
.dashboard-grid { display:grid; grid-template-columns:1.1fr .9fr; gap:17px; }
.panel { padding:20px; min-width:0; }
.panel-heading { display:flex; align-items:center; justify-content:space-between; gap:14px; margin-bottom:20px; color:#6c5ce7; }
.panel-heading h3 { margin:0; font-size:13px; color:#252e49; }
.panel-heading p { margin:7px 0 0; font-size:10px; color:#969bb0; }
.action-card { width:100%; display:flex; align-items:center; gap:12px; padding:13px; margin-top:9px; text-align:left; background:#fff; border:1px solid #ececf5; border-radius:10px; color:#7e849d; transition:background .15s,border-color .15s,transform .15s; }
.action-card:hover { border-color:#d9d1ff; background:#fcfbff; transform:translateY(-1px); }
.action-icon { display:grid; place-items:center; width:37px; height:37px; border-radius:10px; flex-shrink:0; }
.action-icon.purple { background:#f0edff; color:#6c5ce7; }
.action-icon.blue { background:#eaf3ff; color:#4d8be8; }
.action-icon.green { background:#e8faf2; color:#22a879; }
.action-card>div:nth-child(2) { flex:1; min-width:0; }
.action-card strong { display:block; color:#303752; font-size:11px; }
.action-card p { margin:5px 0 0; color:#969bb0; font-size:10px; line-height:1.5; }
.workflow { display:grid; gap:0; }
.workflow-step { display:flex; align-items:flex-start; gap:13px; padding-bottom:20px; position:relative; }
.workflow-step:not(.last):after { content:""; position:absolute; left:15px; top:34px; bottom:3px; width:1px; background:#e5e0ff; }
.step-number { display:grid; place-items:center; width:31px; height:31px; border-radius:9px; background:#f0edff; color:#6c5ce7; font-size:9px; font-weight:700; flex-shrink:0; }
.workflow-step strong { display:block; margin-top:3px; font-size:10px; color:#303752; }
.workflow-step p { margin:7px 0 0; color:#969bb0; font-size:10px; }
.local-ai-note { display:flex; align-items:center; gap:9px; padding:12px; border:1px solid #dff4e9; background:#f5fcf8; border-radius:9px; color:#269b70; font-size:10px; }
.page-footer { display:flex; justify-content:space-between; gap:14px; margin-top:28px; color:#9a9eb1; font-size:9px; }
.page-footer span:last-child { display:flex; align-items:center; gap:6px; }
.page-footer svg { color:#26ad7c; }
.tool-panel { padding:22px; }
.upload-dropzone { display:flex; flex-direction:column; align-items:center; text-align:center; padding:35px 18px; margin:8px 0 17px; border:1px dashed #d9d1ff; border-radius:12px; background:#fcfbff; }
.upload-symbol,.chat-orb { display:grid; place-items:center; width:46px; height:46px; border-radius:13px; background:#eeeaff; color:#6c5ce7; }
.upload-dropzone h3 { margin:15px 0 0; font-size:13px; color:#303752; }
.upload-dropzone p { margin:8px 0 12px; color:#858ba3; font-size:11px; line-height:1.6; }
.file-types { color:#969bb0; font-size:10px; }
.primary-button,.send-button { display:inline-flex; justify-content:center; align-items:center; gap:8px; border:0; border-radius:8px; background:#6554e8; color:white; font-weight:600; padding:10px 15px; font-size:11px; box-shadow:0 3px 8px rgba(101,84,232,.16); }
.primary-button:hover,.send-button:hover { background:#5544d5; }
.upload-button { margin:18px auto 0; justify-content:center; }
.upload-button:disabled,.primary-button:disabled,.send-button:disabled { opacity:.6; cursor:wait; }
.refresh-button { display:inline-flex; align-items:center; gap:7px; background:#fff; color:#6554d9; border:1px solid #e3defe; border-radius:7px; padding:7px 11px; font-size:10px; cursor:pointer; }
.success-message,.error-message { padding:11px 13px; border-radius:8px; font-size:11px; overflow-wrap:anywhere; line-height:1.6; }
.success-message { color:#207b59; background:#eefaf4; }
.error-message { color:#b42332; background:#fff1f2; }
.document-list-heading { display:flex; justify-content:space-between; align-items:center; gap:12px; margin:20px 0 12px; font-size:12px; color:#343b55; }
.document-list { display:grid; gap:9px; }
.document-row { display:flex; align-items:center; gap:12px; border:1px solid #eff0f6; border-radius:10px; padding:12px; min-width:0; }
.document-file-icon { display:grid; place-items:center; width:37px; height:37px; flex-shrink:0; border-radius:9px; color:#6c5ce7; background:#f0edff; }
.document-file-info { display:grid; gap:5px; flex:1; min-width:0; }
.document-file-info strong { font-size:11px; overflow-wrap:anywhere; color:#303752; }
.document-file-info span { font-size:10px; color:#9699ac; }
.document-status { font-size:10px; padding:5px 8px; border-radius:6px; background:#fff5e5; color:#a76a16; }
.document-status.processed { background:#eaf9f1; color:#27845e; }
.empty-documents { display:flex; align-items:center; gap:10px; padding:18px; border:1px solid #eff0f6; border-radius:9px; color:#9297ad; font-size:11px; }
.empty-documents svg { color:#6c5ce7; }
.hint-text { color:#9297ad; font-size:11px; line-height:1.6; }
.centered { text-align:center; }
.search-form { display:flex; align-items:center; gap:11px; padding:8px; border:1px solid #e6e7f0; border-radius:10px; color:#8b90a8; }
.search-form>svg { margin-left:7px; flex-shrink:0; }
.search-form input,.chat-input input { flex:1; min-width:0; border:0; outline:none; background:transparent; color:#26304b; font-size:12px; padding:10px 3px; }
.search-form input:focus,.chat-input input:focus { outline:none; }
.search-results,.source-list { display:grid; gap:10px; margin-top:20px; }
.result-card { border:1px solid #eff0f6; border-radius:10px; padding:14px; overflow-wrap:anywhere; }
.result-card>strong,.chat-response>strong,.source-list>strong { font-size:12px; color:#373452; }
.result-card p,.chat-response p { font-size:12px; line-height:1.75; color:#696e84; white-space:pre-wrap; overflow-wrap:anywhere; }
.result-card>span { font-size:10px; color:#9397aa; }
.chat-panel { max-width:950px; margin:0 auto; }
.chat-panel .panel-heading h3 { display:flex; align-items:center; gap:8px; }
.local-badge { display:flex; align-items:center; gap:8px; padding:7px 10px; border-radius:20px; background:#effaf5; color:#26845f; font-size:10px; }
.local-badge .status-dot { width:6px; height:6px; }
.chat-empty { display:flex; flex-direction:column; align-items:center; text-align:center; padding:30px 12px 24px; }
.chat-orb { width:56px; height:56px; border-radius:17px; }
.chat-empty h2 { margin:16px 0 0; color:#252e49; font-size:20px; }
.chat-empty>p { margin:9px 0 18px; color:#8d92a8; font-size:11px; }
.suggestion-list { display:flex; flex-wrap:wrap; justify-content:center; gap:8px; }
.suggestion-list button { display:flex; align-items:center; gap:10px; border:1px solid #e8e6f5; border-radius:8px; background:#fff; color:#6d728b; padding:9px 11px; font-size:10px; }
.suggestion-list button:hover { border-color:#d7ceff; color:#6554d9; }
.chat-response { margin:12px 0 18px; border:1px solid #e7e2ff; background:#fcfbff; border-radius:11px; padding:16px; }
.chat-response p { margin-bottom:0; }
.chat-input { display:flex; align-items:center; gap:10px; padding:7px 8px 7px 14px; border:1px solid #e5e6f0; border-radius:11px; background:#fff; }
.send-button { width:39px; height:39px; padding:0; flex-shrink:0; }
.mobile-menu,.mobile-backdrop { display:none; }
@media (max-width: 1000px) { .sidebar { width:200px; flex-basis:200px; } .page-content { padding:30px 22px 20px; } .topbar { padding:0 22px; } .welcome-row h1 { font-size:26px; } }
@media (max-width: 760px) { .sidebar { position:fixed; left:0; top:0; bottom:0; transform:translateX(-100%); transition:transform .2s ease; width:250px; height:100vh; box-shadow:none; } .sidebar.sidebar-open { transform:translateX(0); box-shadow:10px 0 30px rgba(20,25,50,.12); } .mobile-backdrop { display:block; position:fixed; inset:0; z-index:15; border:0; background:rgba(20,25,50,.28); } .mobile-menu { display:grid; place-items:center; border:1px solid #e8eaf3; background:#fff; color:#555b75; border-radius:8px; width:36px; height:36px; } .topbar { gap:12px; padding:0 15px; } .breadcrumbs { flex:1; } .system-status { display:none; } .page-content { padding:25px 15px 18px; } .welcome-row { margin-bottom:22px; } .welcome-row h1 { font-size:25px; } .welcome-decoration { display:none; } .stats-grid { grid-template-columns:1fr; } .dashboard-grid { grid-template-columns:1fr; } .page-footer { flex-direction:column; } .search-form { flex-wrap:wrap; } .search-form input { flex-basis:calc(100% - 50px); } .search-form .primary-button { width:100%; } .document-row { flex-wrap:wrap; } .document-status { margin-left:auto; } }
.auth-screen { min-height:100vh; display:grid; place-items:center; padding:24px; background:radial-gradient(circle at top right,#eeebff,transparent 38%),#f5f6fb; } .auth-card { width:min(100%,430px); background:#fff; border:1px solid #e8eaf3; border-radius:18px; padding:32px; box-shadow:0 18px 55px rgba(34,42,75,.08); } .auth-brand { display:flex; align-items:center; gap:12px; margin-bottom:28px; } .auth-card h1 { margin:0; font-size:25px; color:#202943; } .auth-card .auth-subtitle { margin:9px 0 24px; color:#858ba3; font-size:12px; line-height:1.7; } .auth-form { display:grid; gap:14px; } .auth-field { display:grid; gap:7px; color:#424a64; font-size:11px; font-weight:600; } .auth-field input { width:100%; border:1px solid #e2e4ef; border-radius:8px; padding:12px; color:#26304b; background:#fff; font:inherit; font-weight:400; outline:none; } .auth-field input:focus { border-color:#8c7cff; box-shadow:0 0 0 3px #f0edff; } .auth-submit { width:100%; min-height:42px; cursor:pointer; } .auth-switch { margin:18px 0 0; text-align:center; font-size:11px; color:#858ba3; } .auth-switch button { border:0; background:transparent; color:#6554d9; font-weight:700; cursor:pointer; }
`;

type Page = "Dashboard" | "Documents" | "AI Assistant" | "Search";

type DocumentItem = {
  id: number;
  filename: string;
  status: string;
  created_at?: string;
};

type SearchResult = {
  chunk_id: number;
  document_id: number;
  filename: string;
  chunk_index: number;
  content: string;
  similarity: number;
};

type ChatResponse = {
  question: string;
  answer: string;
  sources: SearchResult[];
};

type AuthUser = { id: number; email: string; full_name: string; is_active: boolean };

function App() {
  const [page, setPage] = useState<Page>("Dashboard");
  const [question, setQuestion] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("workvault_access_token");
    if (!token) {
      setAuthChecking(false);
      return;
    }
    api.get<AuthUser>("/auth/me")
      .then((response) => setCurrentUser(response.data))
      .catch(() => {
        localStorage.removeItem("workvault_access_token");
        setCurrentUser(null);
      })
      .finally(() => setAuthChecking(false));
  }, []);

  const navigation: { label: Page; icon: typeof LayoutDashboard }[] = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Documents", icon: FileText },
    { label: "AI Assistant", icon: Bot },
    { label: "Search", icon: Search },
  ];

  if (authChecking) {
    return <><style>{APP_LAYOUT_STYLES}</style><div className="auth-screen"><p className="hint-text">Checking your secure workspace...</p></div></>;
  }

  if (!currentUser) {
    return <><style>{APP_LAYOUT_STYLES}</style><AuthScreen onAuthenticated={setCurrentUser} /></>;
  }

  return (
    <div className="app-shell">
      <style>{APP_LAYOUT_STYLES}</style>
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><Sparkles size={23} /></div>
          <div>
            <h2>WorkVault<span> AI</span></h2>
            <p>KNOWLEDGE WORKSPACE</p>
          </div>
        </div>

        <p className="nav-label">WORKSPACE</p>
        <nav>
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${page === label ? "active" : ""}`}
              onClick={() => {
                setPage(label);
                setMenuOpen(false);
              }}
            >
              <Icon size={19} />
              <span>{label}</span>
              {label === "AI Assistant" && <span className="nav-new">AI</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="security-card">
            <ShieldCheck size={21} />
            <div>
              <strong>Private workspace</strong>
              <p>Your knowledge, organized.</p>
            </div>
          </div>
          <div className="profile">
            <div className="avatar">{(currentUser.full_name || currentUser.email).charAt(0).toUpperCase()}</div>
            <div className="profile-info">
              <strong>{currentUser.full_name}</strong>
              <span>{currentUser.email}</span>
            </div>
            <Activity size={17} className="profile-status" />
          </div>
        </div>
      </aside>

      {menuOpen && (
        <button
          className="mobile-backdrop"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <main className="main-area">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            <Menu size={21} />
          </button>
          <div className="breadcrumbs">Workspace <span>/</span> {page}</div>
          <div className="topbar-right">
            <span className="status-dot" />
            <span className="system-status">API workspace</span>
            <div className="top-avatar">{(currentUser.full_name || currentUser.email).charAt(0).toUpperCase()}</div>
            <button className="refresh-button" onClick={() => { localStorage.removeItem("workvault_access_token"); setCurrentUser(null); }} title="Sign out" aria-label="Sign out"><LogOut size={14} /> Sign out</button>
          </div>
        </header>

        <div className="page-content">
          <div className="welcome-row">
            <div>
              <p className="eyebrow">YOUR KNOWLEDGE, CONNECTED</p>
              <h1>
                {page === "Dashboard" && <>Your workspace, <span>in focus.</span></>}
                {page === "Documents" && <>Document <span>library.</span></>}
                {page === "AI Assistant" && <>Ask your <span>knowledge base.</span></>}
                {page === "Search" && <>Find what <span>matters.</span></>}
              </h1>
              <p className="page-description">
                {page === "Dashboard" && "Bring your documents together and get useful answers with AI."}
                {page === "Documents" && "Upload and organize your documents in one workspace."}
                {page === "AI Assistant" && "Ask questions and explore answers grounded in your documents."}
                {page === "Search" && "Search the meaning of your documents, not just keywords."}
              </p>
            </div>
            <div className="welcome-decoration"><Sparkles size={31} /></div>
          </div>

          {page === "Dashboard" && (
            <>
              <section className="stats-grid">
                <StatCard
                  icon={<FileText />}
                  label="Documents"
                  value="Open library"
                  note="View your uploaded files"
                />
                <StatCard
                  icon={<Search />}
                  label="Search index"
                  value="Available"
                  note="Semantic retrieval API"
                />
                <StatCard
                  icon={<Bot />}
                  label="AI assistant"
                  value="Available"
                  note="Document-based answers"
                />
              </section>

              <section className="dashboard-grid">
                <div className="panel quick-panel">
                  <div className="panel-heading">
                    <div><h3>Quick actions</h3><p>Continue your work</p></div>
                    <Sparkles size={19} />
                  </div>
                  <button className="action-card" onClick={() => setPage("Documents")}>
                    <div className="action-icon purple"><Upload size={20} /></div>
                    <div><strong>Upload documents</strong><p>Add PDF or Word files to your library.</p></div>
                    <Plus size={18} />
                  </button>
                  <button className="action-card" onClick={() => setPage("AI Assistant")}>
                    <div className="action-icon blue"><Bot size={20} /></div>
                    <div><strong>Ask WorkVault AI</strong><p>Get answers from your own documents.</p></div>
                    <Plus size={18} />
                  </button>
                  <button className="action-card" onClick={() => setPage("Search")}>
                    <div className="action-icon green"><Search size={20} /></div>
                    <div><strong>Search knowledge</strong><p>Find relevant information quickly.</p></div>
                    <Plus size={18} />
                  </button>
                </div>

                <div className="panel overview-panel">
                  <div className="panel-heading">
                    <div><h3>How WorkVault works</h3><p>From files to answers</p></div>
                    <Activity size={19} />
                  </div>
                  <div className="workflow">
                    <WorkflowStep number="01" title="Upload" description="Add PDF and DOCX files." />
                    <WorkflowStep number="02" title="Understand" description="Text is extracted and indexed." />
                    <WorkflowStep number="03" title="Discover" description="Search and ask questions with AI." last />
                  </div>
                  <div className="local-ai-note">
                    <ShieldCheck size={19} />
                    <span>AI answers use retrieved document context.</span>
                  </div>
                </div>
              </section>
            </>
          )}

          {page === "Documents" && <DocumentsPanel />}

          {page === "Search" && (
            <SearchPanel
              question={question}
              setQuestion={setQuestion}
              onAsk={() => setPage("AI Assistant")}
            />
          )}

          {page === "AI Assistant" && (
            <ChatPanel question={question} setQuestion={setQuestion} />
          )}

          <footer className="page-footer">
            <span>© 2026 WorkVault AI</span>
            <span><ShieldCheck size={14} /> Built for focused knowledge work</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

function AuthScreen({ onAuthenticated }: { onAuthenticated: (user: AuthUser) => void }) {
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submitAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (isRegister) {
        await api.post("/auth/register", { email: email.trim(), full_name: fullName.trim(), password });
      }
      const loginResponse = await api.post<{ access_token: string; token_type: string }>("/auth/login", {
        email: email.trim(),
        password,
      });
      localStorage.setItem("workvault_access_token", loginResponse.data.access_token);
      const userResponse = await api.get<AuthUser>("/auth/me");
      onAuthenticated(userResponse.data);
    } catch (err: unknown) {
      const status = getHttpStatus(err);
      const detail = getHttpDetail(err);
      setError(detail || (status === 401
        ? "Email or password is incorrect. Please try again."
        : status === 409
          ? "An account with this email already exists. Switch to sign in."
          : "Could not connect to WorkVault AI. Check that the backend is running."));
      localStorage.removeItem("workvault_access_token");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-screen">
      <section className="auth-card">
        <div className="auth-brand">
          <div className="brand-icon"><Sparkles size={23} /></div>
          <div><h2 style={{ margin: 0, color: "#26304b", fontSize: 18 }}>WorkVault <span style={{ color: "#6c5ce7" }}>AI</span></h2><p style={{ margin: "5px 0 0", color: "#8d91a8", fontSize: 9, letterSpacing: 1.3 }}>KNOWLEDGE WORKSPACE</p></div>
        </div>
        <h1>{isRegister ? "Create your workspace" : "Welcome back"}</h1>
        <p className="auth-subtitle">{isRegister ? "Create an account to keep your documents and AI answers private." : "Sign in to access your private documents and AI assistant."}</p>
        <form className="auth-form" onSubmit={submitAuth}>
          {isRegister && <label className="auth-field">Full name<input value={fullName} onChange={(event) => setFullName(event.target.value)} minLength={2} maxLength={150} autoComplete="name" required placeholder="Your full name" /></label>}
          <label className="auth-field">Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required placeholder="you@example.com" /></label>
          <label className="auth-field">Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={isRegister ? 8 : undefined} maxLength={128} autoComplete={isRegister ? "new-password" : "current-password"} required placeholder={isRegister ? "At least 8 characters" : "Enter your password"} /></label>
          {error && <p className="error-message" role="alert">{error}</p>}
          <button className="primary-button auth-submit" type="submit" disabled={busy}>{busy ? "Please wait..." : isRegister ? <><UserPlus size={16} /> Create account</> : <><LogIn size={16} /> Sign in</>}</button>
        </form>
        <p className="auth-switch">{isRegister ? "Already have an account?" : "New to WorkVault AI?"} <button type="button" onClick={() => { setIsRegister(!isRegister); setError(""); }}>{isRegister ? "Sign in" : "Create account"}</button></p>
      </section>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <div className="stat-icon">{icon}</div>
      </div>
      <strong className="stat-value">{value}</strong>
      <p>{note}</p>
    </div>
  );
}

function WorkflowStep({
  number,
  title,
  description,
  last = false,
}: {
  number: string;
  title: string;
  description: string;
  last?: boolean;
}) {
  return (
    <div className={`workflow-step ${last ? "last" : ""}`}>
      <div className="step-number">{number}</div>
      <div><strong>{title}</strong><p>{description}</p></div>
    </div>
  );
}

function DocumentsPanel() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  async function loadDocuments() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get<DocumentItem[]>("/documents");
      setDocuments(response.data);
    } catch (err: unknown) {
      const status = getHttpStatus(err);
      setError(
        status === 401
          ? "Please sign in to view your documents."
          : "Could not load documents. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDocuments();
  }, []);

  async function uploadDocument(file?: File) {
    if (!file) return;

    const lowerName = file.name.toLowerCase();

    if (!lowerName.endsWith(".pdf") && !lowerName.endsWith(".docx")) {
      setError("Only PDF and DOCX files are supported.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must not exceed 10 MB.");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/documents/upload", formData);
      setMessage(
        `${response.data.filename} uploaded and processed successfully.`
      );
      await loadDocuments();
    } catch (err: unknown) {
      const status = getHttpStatus(err);
      setError(
        status === 401
          ? "Please sign in before uploading documents."
          : "Upload failed. Check the file and backend terminal."
      );
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  return (
    <div className="panel tool-panel">
      <div className="panel-heading">
        <div>
          <h3>Your documents</h3>
          <p>PDF and DOCX files in your workspace.</p>
        </div>
        <button className="refresh-button" onClick={() => void loadDocuments()} disabled={loading}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <input
        ref={fileInput}
        type="file"
        accept=".pdf,.docx"
        hidden
        onChange={(event) => void uploadDocument(event.target.files?.[0])}
      />

      <div className="upload-dropzone">
        <div className="upload-symbol"><Upload size={25} /></div>
        <h3>Upload your knowledge</h3>
        <p>Select a PDF or Word document to add it to your workspace.</p>
        <span className="file-types">PDF · DOCX · Maximum 10 MB</span>
        <button
          type="button"
          className="primary-button upload-button"
          disabled={uploading}
          onClick={() => {
            setError("");
            fileInput.current?.click();
          }}
        >
          <Upload size={16} />
          {uploading ? "Uploading..." : "Choose document"}
        </button>
      </div>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="document-list-heading">
        <strong>Uploaded files ({documents.length})</strong>
      </div>

      {loading ? (
        <p className="hint-text">Loading documents...</p>
      ) : documents.length === 0 ? (
        <div className="empty-documents">
          <FileText size={22} />
          <span>No documents found for this account.</span>
        </div>
      ) : (
        <div className="document-list">
          {documents.map((document) => (
            <div className="document-row" key={document.id}>
              <div className="document-file-icon"><FileText size={19} /></div>
              <div className="document-file-info">
                <strong>{document.filename}</strong>
                <span>Document #{document.id}</span>
              </div>
              <span className={`document-status ${document.status === "processed" ? "processed" : ""}`}>
                {document.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SearchPanel({
  question,
  setQuestion,
  onAsk,
}: {
  question: string;
  setQuestion: (value: string) => void;
  onAsk: () => void;
}) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const response = await api.post<{ results: SearchResult[] }>("/search", {
        query: question.trim(),
        limit: 5,
      });
      setResults(response.data.results ?? []);
    } catch (err: unknown) {
      setError(
        getHttpStatus(err) === 401
          ? "Please sign in to search your documents."
          : "Search failed. Check the backend and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel tool-panel">
      <div className="panel-heading">
        <div>
          <h3>Semantic search</h3>
          <p>Find relevant passages in your uploaded documents.</p>
        </div>
        <Search size={20} />
      </div>

      <form onSubmit={runSearch} className="search-form">
        <Search size={20} />
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="What would you like to find?"
          aria-label="Search query"
        />
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"} <Send size={16} />
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {!loading && results.length === 0 && !error && (
        <p className="hint-text">Enter a question to search your document library.</p>
      )}

      {results.length > 0 && (
        <div className="search-results">
          <div className="document-list-heading">
            <strong>Search results ({results.length})</strong>
            <button className="refresh-button" onClick={onAsk}>Ask AI about this</button>
          </div>
          {results.map((result) => (
            <article className="result-card" key={result.chunk_id}>
              <strong>{result.filename}</strong>
              <p>{result.content}</p>
              <span>Chunk {result.chunk_index + 1} · Similarity {(result.similarity * 100).toFixed(1)}%</span>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function ChatPanel({
  question,
  setQuestion,
}: {
  question: string;
  setQuestion: (value: string) => void;
}) {
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendQuestion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const result = await api.post<ChatResponse>("/chat", {
        question: question.trim(),
        limit: 5,
      });
      setResponse(result.data);
    } catch (err: unknown) {
      setError(
        getHttpStatus(err) === 401
          ? "Please sign in to chat with your documents."
          : "The AI request failed. Check that the backend and local AI model are running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel chat-panel">
      <div className="panel-heading">
        <div>
          <h3><Bot size={20} /> WorkVault Assistant</h3>
          <p>Answers based on retrieved document context</p>
        </div>
        <span className="local-badge"><span className="status-dot" /> Local AI</span>
      </div>

      <div className="chat-empty">
        <div className="chat-orb"><Sparkles size={28} /></div>
        <h2>What would you like to know?</h2>
        <p>Ask a question about your uploaded documents.</p>
        <div className="suggestion-list">
          {["Summarize my document", "What are the key points?", "Find important details"].map((suggestion) => (
            <button type="button" key={suggestion} onClick={() => setQuestion(suggestion)}>
              {suggestion} <Plus size={15} />
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="hint-text centered">Searching documents and generating an answer...</p>}
      {error && <p className="error-message">{error}</p>}

      {response && (
        <div className="chat-response">
          <strong>Answer</strong>
          <p>{response.answer}</p>
          {response.sources?.length > 0 && (
            <div className="source-list">
              <strong>Sources</strong>
              {response.sources.map((source) => (
                <article className="result-card" key={source.chunk_id}>
                  <strong>{source.filename}</strong>
                  <p>{source.content}</p>
                  <span>Chunk {source.chunk_index + 1}</span>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      <form className="chat-input" onSubmit={sendQuestion}>
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask a question about your documents..."
          aria-label="Ask WorkVault AI"
        />
        <button className="send-button" type="submit" disabled={loading} aria-label="Send question">
          <Send size={19} />
        </button>
      </form>
      <p className="hint-text centered">Verify important answers against the cited source documents.</p>
    </div>
  );
}

function getHttpDetail(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { detail?: unknown } } }).response;
    const detail = response?.data?.detail;
    return typeof detail === "string" ? detail : undefined;
  }
  return undefined;
}

function getHttpStatus(error: unknown): number | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (error as { response?: { status?: number } }).response;
    return response?.status;
  }

  return undefined;
}

export default App;
