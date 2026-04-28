import React, { useEffect, useMemo, useRef, useState } from "react";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const AUTH_TOKEN_KEY = "bbe_auth_token";
const TRIAL_ID_KEY = "bbe_trial_id";
const TRIAL_USED_KEY = "bbe_trial_used";
const TABS = [
  { key: "answer", label: "Answer" },
  { key: "black_box_explanation", label: "Why The Model Said It" },
  { key: "evidence", label: "Supporting Context" },
  { key: "risks", label: "Gaps & Next Questions" },
];

function ResultTabs({ result }) {
  const [activeTab, setActiveTab] = useState("answer");

  const content = useMemo(() => {
    if (activeTab === "answer") {
      return (
        <div className="answer-tab-shell">
          <div className="section-block">
            <div className="metric-label">Answer</div>
            <div className="metric-body">{result.audit_verdict || result.answer || "No answer was returned."}</div>
          </div>
        </div>
      );
    }

    if (activeTab === "black_box_explanation") {
      return (
        <div className="section-block">
          <div className="metric-label">Why the model likely landed on this answer</div>
          <div className="metric-body">{result.black_box_explanation || "No model-behavior explanation was returned."}</div>
        </div>
      );
    }

    if (activeTab === "evidence") {
      return (
        <div className="evidence-list">
          {(result.evidence_claims || []).length ? (
            (result.evidence_claims || []).map((claim, index) => (
              <div key={`${claim.quote}-${index}`} className="evidence-card">
                <div className="evidence-title">{claim.claim || "Evidence"}</div>
                <blockquote>{claim.quote || "No quote extracted."}</blockquote>
                {claim.matched_context && claim.matched_context !== claim.quote ? (
                  <div className="metric-caption">Closest source support: "{claim.matched_context}"</div>
                ) : null}
                {claim.support_reason ? <div className="metric-caption">{claim.support_reason}</div> : null}
              </div>
            ))
          ) : (
            <div className="metric-caption">No evidence claims were returned.</div>
          )}
        </div>
      );
    }

    return (
      <div className="risk-grid">
        <div className="risk-column">
          <h4>Assumptions the answer depends on</h4>
          <ul>{(result.assumptions || []).map((item, index) => <li key={`a-${index}`}>{item}</li>)}</ul>

          <h4>Where the answer may still be weak</h4>
          <ul>{(result.uncertainty || []).map((item, index) => <li key={`u-${index}`}>{item}</li>)}</ul>
        </div>
        <div className="risk-column">
          <h4>Questions to ask next</h4>
          <ul>{(result.followups || []).map((item, index) => <li key={`f-${index}`}>{item}</li>)}</ul>

          <h4>Why the app scored it this way</h4>
          <p className="metric-body">{result.confidence_reason || "No confidence explanation returned."}</p>
        </div>
      </div>
    );
  }, [activeTab, result]);

  return (
    <div className="tabs-shell">
      <div className="tabs-row">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`tab-pill ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-panel">{content}</div>
    </div>
  );
}

function autoGrowTextarea(element) {
  if (!element) return;
  element.style.height = "auto";
  element.style.height = `${element.scrollHeight}px`;
}

function AuthModal({
  mode,
  setMode,
  authForm,
  setAuthForm,
  authLoading,
  authError,
  onSubmit,
}) {
  return (
    <div className="auth-modal-backdrop">
      <section className="auth-modal">
        <div className="auth-modal-head">
          <h2>{mode === "signup" ? "Create your BLOEX account" : "Sign in to BLOEX"}</h2>
          <p>{mode === "signup" ? "Use a username, email, and password to start auditing." : "Log in with your username or email and password."}</p>
        </div>
        <div className="auth-mode-row">
          <button type="button" className={`auth-mode-btn ${mode === "login" ? "active" : ""}`} onClick={() => setMode("login")}>
            Login
          </button>
          <button type="button" className={`auth-mode-btn ${mode === "signup" ? "active" : ""}`} onClick={() => setMode("signup")}>
            Sign up
          </button>
        </div>
        <form className="auth-form" onSubmit={onSubmit}>
          {mode === "signup" ? (
            <label>
              <span>Username</span>
              <input
                value={authForm.username}
                onChange={(event) => setAuthForm((current) => ({ ...current, username: event.target.value }))}
                placeholder="Choose a username"
                autoComplete="username"
              />
            </label>
          ) : null}
          <label>
            <span>{mode === "signup" ? "Email" : "Username or email"}</span>
            <input
              value={authForm.identifier}
              onChange={(event) => setAuthForm((current) => ({ ...current, identifier: event.target.value }))}
              placeholder={mode === "signup" ? "you@example.com" : "username or email"}
              autoComplete="username"
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={authForm.password}
              onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))}
              placeholder="At least 8 characters"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
          </label>
          {authError ? <div className="auth-error">{authError}</div> : null}
          <button className="primary-button auth-submit" type="submit" disabled={authLoading}>
            {authLoading ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>
      </section>
    </div>
  );
}

function ChatPanel({ ready, selectedModel, question, modelAnswer, context, authToken }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const draftRef = useRef(null);

  useEffect(() => {
    autoGrowTextarea(draftRef.current);
  }, [draft]);

  async function sendFollowup(event) {
    event.preventDefault();
    const cleaned = draft.trim();
    if (!cleaned || !ready || !authToken) return;

    setLoading(true);
    setMessages((current) => [...current, { role: "user", content: cleaned }]);
    setDraft("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/followup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          question,
          model_answer: modelAnswer,
          context,
          followup: cleaned,
          model: selectedModel,
        }),
      });
      const payload = await readJsonResponse(response);
      if (!response.ok) {
        throw new Error(payload.detail || "Follow-up request failed.");
      }
      setMessages((current) => [...current, { role: "assistant", content: payload.reply }]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: error instanceof Error ? error.message : "Follow-up request failed." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel-shell">
      <div className="section-title-row">
        <h2>Pressure-test this answer</h2>
        {messages.length ? (
          <button className="ghost-button" type="button" onClick={() => setMessages([])}>
            Clear chat
          </button>
        ) : null}
      </div>
      <p className="results-subtitle compact">
        Ask the explainer to challenge one claim, rewrite a weak sentence, or explain why a source snippet does or does not support the answer.
      </p>
      <div className="chat-stack">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`chat-bubble ${message.role}`}>
            {message.content}
          </div>
        ))}
      </div>
      <form className="chat-form" onSubmit={sendFollowup}>
        <textarea
          ref={draftRef}
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            autoGrowTextarea(event.target);
          }}
          placeholder="Ask the explainer to check a claim, rewrite a sentence, or suggest a stronger follow-up..."
          rows={3}
          style={{ resize: "none", overflow: "hidden" }}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          data-gramm="false"
          data-gramm_editor="false"
          data-enable-grammarly="false"
          data-lt-active="false"
        />
        <button className="primary-button" type="submit" disabled={!ready || loading || !authToken}>
          {loading ? "Thinking..." : "Send"}
        </button>
      </form>
    </section>
  );
}

async function readJsonResponse(response) {
  const rawText = await response.text();
  let payload = {};
  if (rawText.trim()) {
    try {
      payload = JSON.parse(rawText);
    } catch {
      payload = { detail: rawText.trim() };
    }
  }
  return payload;
}

function TitlePage({ onStart, showAuthModal, authModal }) {
  return (
    <section className={`title-fullscreen ${showAuthModal ? "home-blur" : ""}`}>
      <div className="ml-atmosphere" aria-hidden="true">
        <div className="ml-gradient-flow" />
        <div className="ml-nebula n1" />
        <div className="ml-nebula n2" />
        <div className="ml-corner-slash beam-a" />
        <div className="ml-vignette" />
        <div className="ml-light-ray ray-a" />
        <div className="ml-light-ray ray-b" />
      </div>
      <header className="ml-topbar">
        <div className="ml-logo">
          <span className="ml-logo-mark" aria-hidden="true" />
          <span>BLOEX</span>
        </div>
        <button className="ml-enter" type="button" onClick={onStart}>
          Launch
        </button>
      </header>
      <div className="ml-hero-shell">
        <div className="ml-copy-column">
          <p className="ml-kicker ml-kicker-slash">BLACK BOX EXPLAINER</p>
          <p className="ml-subcopy ml-subcopy-slash">
            Audit generated answers against evidence, surface weak claims, and ship responses with a clear reliability score.
          </p>
        </div>
      </div>
      {authModal}
    </section>
  );
}

export default function App() {
  const [view, setView] = useState("home");
  const [question, setQuestion] = useState("");
  const [modelAnswer, setModelAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeModel, setActiveModel] = useState("tinyllama:latest");
  const [status, setStatus] = useState({ ok: false, status: "Checking backend..." });
  const [error, setError] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [authUser, setAuthUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authForm, setAuthForm] = useState({ username: "", identifier: "", password: "" });
  const [trialId, setTrialId] = useState("");
  const [trialUsed, setTrialUsed] = useState(false);
  const modelAnswerRef = useRef(null);

  useEffect(() => {
    autoGrowTextarea(modelAnswerRef.current);
  }, [modelAnswer]);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_TOKEN_KEY);
    if (stored) {
      setAuthToken(stored);
    }
    const existingTrialId = localStorage.getItem(TRIAL_ID_KEY);
    if (existingTrialId) {
      setTrialId(existingTrialId);
    } else {
      const generated = `trial-${Math.random().toString(36).slice(2)}-${Date.now()}`;
      localStorage.setItem(TRIAL_ID_KEY, generated);
      setTrialId(generated);
    }
    setTrialUsed(localStorage.getItem(TRIAL_USED_KEY) === "1");
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      try {
        const healthResponse = await fetch(`${API_BASE_URL}/api/health`);
        const health = await readJsonResponse(healthResponse);
        if (cancelled) return;
        if (health.selectedModel) {
          setActiveModel(health.selectedModel);
        }
        setStatus({
          ok: Boolean(health.ok),
          status: health.status || "Backend unavailable.",
        });
      } catch {
        if (cancelled) return;
        setStatus({ ok: false, status: "Backend is waking up or unreachable right now." });
      }
    }
    bootstrap();
    const timer = window.setInterval(bootstrap, 15000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadMe() {
      if (!authToken) {
        setAuthUser(null);
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const payload = await readJsonResponse(response);
        if (cancelled) return;
        if (!response.ok) {
          throw new Error(payload.detail || "Session expired.");
        }
        setAuthUser(payload);
      } catch {
        if (cancelled) return;
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setAuthToken("");
        setAuthUser(null);
      }
    }
    loadMe();
    return () => {
      cancelled = true;
    };
  }, [authToken]);

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setAuthError("");
    const identifier = authForm.identifier.trim();
    const username = authForm.username.trim();
    const password = authForm.password;
    if (!identifier || !password || (authMode === "signup" && !username)) {
      setAuthError("Fill in all required fields.");
      return;
    }
    setAuthLoading(true);
    try {
      if (authMode === "signup") {
        const signupResponse = await fetch(`${API_BASE_URL}/api/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email: identifier, password }),
        });
        const signupPayload = await readJsonResponse(signupResponse);
        if (!signupResponse.ok) {
          throw new Error(signupPayload.detail || "Sign up failed.");
        }
      }
      const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const loginPayload = await readJsonResponse(loginResponse);
      if (!loginResponse.ok) {
        throw new Error(loginPayload.detail || "Login failed.");
      }
      const token = loginPayload.access_token;
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      setAuthToken(token);
      setAuthError("");
      setAuthForm({ username: "", identifier: "", password: "" });
      setView("evaluate");
    } catch (authRunError) {
      setAuthError(authRunError instanceof Error ? authRunError.message : "Authentication failed.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleExplain(event) {
    event.preventDefault();
    setError("");
    if (!question.trim()) {
      setError("The original question is required.");
      return;
    }
    if (!modelAnswer.trim()) {
      setError("The model answer is required.");
      return;
    }
    setLoading(true);
    try {
      const headers = { "Content-Type": "application/json" };
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      } else if (trialId) {
        headers["X-Trial-Id"] = trialId;
      }
      const response = await fetch(`${API_BASE_URL}/api/explain`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          question: question.trim(),
          model_answer: modelAnswer,
          model: activeModel,
        }),
      });
      const payload = await readJsonResponse(response);
      if (!response.ok) {
        if (!authToken && response.status === 401) {
          setTrialUsed(true);
          localStorage.setItem(TRIAL_USED_KEY, "1");
          setAuthError("Your free trial run is complete. Sign up or log in to continue.");
          setView("home");
        }
        throw new Error(payload.detail || "Failed to run the auditor.");
      }
      if (!authToken) {
        setTrialUsed(true);
        localStorage.setItem(TRIAL_USED_KEY, "1");
      }
      setResult(payload);
      if (payload.selected_model) {
        setActiveModel(payload.selected_model);
      }
      setStatus({ ok: true, status: "Backend responded successfully." });
    } catch (runError) {
      const message = runError instanceof Error ? runError.message : "Failed to run the auditor.";
      setError(message);
      setStatus({ ok: false, status: message });
    } finally {
      setLoading(false);
    }
  }

  function openEvaluateView() {
    setView("evaluate");
  }

  function openHomeView() {
    setView("home");
  }

  const showAuthModal = !authUser && trialUsed;

  if (view === "home") {
    return (
      <TitlePage
        onStart={openEvaluateView}
        showAuthModal={showAuthModal}
        authModal={
          showAuthModal ? (
            <AuthModal
              mode={authMode}
              setMode={setAuthMode}
              authForm={authForm}
              setAuthForm={setAuthForm}
              authLoading={authLoading}
              authError={authError}
              onSubmit={handleAuthSubmit}
            />
          ) : null
        }
      />
    );
  }

  return (
    <div className="page-shell audit-page">
      <div className="audit-homepage-bg" aria-hidden="true">
        <div className="ml-vignette" />
        <div className="ml-light-ray ray-a" />
        <div className="ml-light-ray ray-b" />
      </div>
      <div className="audit-workspace">
        <div className="workspace-nav">
          <button className="audit-home-logo" type="button" onClick={openHomeView} aria-label="Back to home">
            <span className="audit-home-mark" aria-hidden="true" />
            <span>BLOEX</span>
          </button>
        </div>
        <section className="panel-shell audit-form-panel">
          <form onSubmit={handleExplain} className="input-form">
            <div className="audit-chat-header">
              <div>
                <h2>Run an audit</h2>
                <p>Paste the original question and model answer to analyze.</p>
              </div>
            </div>
            <div className="audit-chat-thread">
              <div className="audit-input-grid">
                <label className="audit-field-card">
                  <span>Original question</span>
                  <input
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    placeholder="What was the user asking the model to answer?"
                    autoComplete="off"
                  />
                </label>
                <label className="audit-field-card large">
                  <span>LLM answer to analyze</span>
                  <textarea
                    ref={modelAnswerRef}
                    value={modelAnswer}
                    onChange={(event) => {
                      setModelAnswer(event.target.value);
                      autoGrowTextarea(event.target);
                    }}
                    placeholder="Paste the exact answer the LLM gave you..."
                    rows={7}
                    style={{ resize: "none", overflow: "hidden" }}
                  />
                </label>
              </div>
            </div>
            {error ? <div className="status-banner warn">{error}</div> : null}
            <div className="audit-composer-bar">
              <span>{status.status}</span>
              <button className="primary-button" type="submit" disabled={loading}>
                {loading ? "Explaining..." : "Explain"}
              </button>
            </div>
          </form>
        </section>

        {result ? (
          <>
            <section className="results-header">
              <h2>Result</h2>
              <p className="results-subtitle">
                This workspace is for understanding the answer, what the model likely relied on, and where its reasoning may still be shaky.
              </p>
            </section>
            {result.fallback_mode ? (
              <section className="fallback-notice">
                <div className="fallback-icon" aria-hidden="true">!</div>
                <div>
                  <strong>Fallback review is showing</strong>
                  <p>{result.fallback_error || "The model did not return a full generation, so BLOEX used a lightweight local review."}</p>
                </div>
              </section>
            ) : null}
            <section className="panel-shell">
              <ResultTabs result={result} />
            </section>
            <ChatPanel
              ready={status.ok}
              selectedModel={activeModel}
              question={question}
              modelAnswer={modelAnswer}
              context=""
              authToken={authToken}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
