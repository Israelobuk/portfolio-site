"use client";

import { useEffect, useState } from "react";
import { Easing, interpolate } from "remotion";

const introHeadline =
  "I'm a first-year Computer Science student interested in AI, data science, and software engineering, and using data to solve real problems across different industries. I enjoy experimenting with models and building projects.";

const profile = {
  name: "Israel Obukonise",
  role: "Computer Science Student",
  email: "Is.obukonise@gmail.com",
  github: "https://github.com/Israelobuk",
  linkedin: "https://www.linkedin.com/in/israelobukonise/",
  cv: "/IsObukCSResume.pdf",
  location: "Ontario, Canada",
  current: "Code Ninja",
};

const sectionNames = ["Overview", "Projects", "Role", "Contact"];
const stats = [
  { label: "Projects", value: "04" },
  { label: "Core Stacks", value: "04" },
  { label: "Refresh Loop", value: "120ms" },
  { label: "Current", value: "Code Ninja" },
];

const projects = [
  {
    name: "Latch",
    year: "2026",
    stack: "Electron / React / TypeScript / SQLite / OAuth",
    image: "/images/latch.png",
    repo: "https://github.com/Israelobuk/Latch",
    description:
      "Desktop inbox workspace that connects Gmail and Outlook, prioritizes what needs action, and gives fast thread-level workflow controls.",
    points: ["Unified inbox triage", "Mailbox state filters", "Desktop-first workflow"],
  },
  {
    name: "Pulseboard",
    year: "2026",
    stack: "Python / PostgreSQL / SQL / R / PySide6",
    image: "/images/pulseboard.png",
    repo: "https://github.com/Israelobuk/pulseboard",
    description:
      "Desktop performance dashboard built with Python, PostgreSQL, SQL, R, and PySide6 for live telemetry, process tracking, and historical analysis.",
    points: ["Real-time process insights", "Low-latency refresh behavior", "Desktop-first dashboard"],
  },
  {
    name: "NewsUTD",
    year: "2026",
    stack: "Python / WebSockets / PostgreSQL / pandas / Pydantic / Ollama",
    image: "/images/newsutd.png",
    repo: "https://github.com/Israelobuk/market-signal-monitor",
    description:
      "Market signal monitor that tracks narrative shifts from live headlines and macro commentary, then surfaces data-backed themes before broader market reaction.",
    points: ["Real-time signal streaming", "Theme and score tracking", "Data-first market workflow"],
  },
];

const mapNodes = [
  {
    id: "overview",
    label: "Overview",
    title: "System Overview",
    detail: "Mission-focused CS builder shipping projects across software engineering and data systems.",
    x: 50,
    y: 18,
    section: 0,
  },
  {
    id: "projects",
    label: "Projects",
    title: "Project Nodes",
    detail: "Latch, Pulseboard, and NewsUTD are active nodes focused on software systems and data-science execution.",
    x: 78,
    y: 30,
    section: 1,
  },
  {
    id: "experience",
    label: "Experience",
    title: "Execution Layer",
    detail: "Teaching at Code Ninja while continuously building and iterating production-ready portfolio systems.",
    x: 68,
    y: 80,
    section: 2,
  },
  {
    id: "current",
    label: "Current Build",
    title: "Live Focus",
    detail: "Current focus is software engineering execution and data science workflows for production-ready projects.",
    x: 32,
    y: 82,
  },
  {
    id: "resume",
    label: "Resume",
    title: "Credential Packet",
    detail: "Open the current resume for role-ready details on background, technical stack, and project execution.",
    x: 18,
    y: 56,
    href: profile.cv,
    linkLabel: "Open Resume",
  },
  {
    id: "contact",
    label: "Contact",
    title: "Contact Channel",
    detail: "Primary channel is email, supported by LinkedIn for faster collaboration and follow-up.",
    x: 22,
    y: 30,
    section: 3,
  },
];

const electronPackets = Array.from({ length: 28 }, (_, index) => ({
  id: `electron-${index}`,
  angle: (index * 29 + (index % 3) * 17) % 360,
  radius: 44 + (index % 8) * 16,
  duration: 3.4 + (index % 7) * 0.58,
  delay: -(index * 0.41),
  size: 2 + (index % 3),
  blinkDuration: 1.1 + (index % 6) * 0.34,
  blinkDelay: -(index * 0.23),
}));

const ghostNodes = Array.from({ length: 14 }, (_, index) => ({
  id: `ghost-${index}`,
  angle: (index * 26 + 13) % 360,
  radius: 58 + (index % 7) * 20,
  size: 4 + (index % 3) * 2,
  duration: 5.2 + (index % 6) * 0.78,
  delay: -(index * 0.57),
  pulse: 1.4 + (index % 5) * 0.31,
}));

const REMOTION_FPS = 30;

const nodePages = {
  overview: {
    title: "Overview",
    subtitle: "Global profile snapshot",
    body:
      "I build practical software with a product and analytics mindset. This portfolio is designed as a systems map so visitors can navigate capabilities like data nodes.",
    bullets: ["Computer Science student", "Software engineering + data science focus", "System design and implementation"],
    actions: [{ type: "section", section: 1, label: "Go To Projects" }],
  },
  projects: {
    title: "Projects",
    subtitle: "Shipped build nodes",
    body:
      "Core portfolio projects focus on real workflows: inbox operations, telemetry dashboards, and applied data products with measurable outcomes.",
    bullets: ["Latch desktop inbox", "Pulseboard analytics dashboard", "NewsUTD market signal monitor"],
    actions: [{ type: "section", section: 1, label: "Open Projects Section" }],
  },
  experience: {
    title: "Experience",
    subtitle: "Current execution role",
    body: "Teaching and mentoring while building software has improved both delivery speed and technical communication.",
    bullets: ["Code Ninja instructor", "Mentorship and explanation", "Applied project workflows"],
    actions: [{ type: "section", section: 2, label: "Open Role Section" }],
  },
  current: {
    title: "Current Build",
    subtitle: "What I am building now",
    body:
      "Current efforts focus on software engineering quality, data science rigor, and stronger end-to-end project delivery.",
    bullets: ["Production-grade software systems", "Applied data science pipelines", "Testing, reliability, and performance"],
    actions: [{ type: "section", section: 0, label: "Back To Overview" }],
  },
  resume: {
    title: "Resume",
    subtitle: "Credential and work summary",
    body: "Use the resume for quick review of education, technical capabilities, and project impact.",
    bullets: ["Role-ready summary", "Skills and experience", "Project highlights"],
    actions: [{ type: "href", href: profile.cv, label: "Open Resume PDF" }],
  },
  contact: {
    title: "Contact",
    subtitle: "Collaboration channel",
    body: "Best way to reach me is email, with LinkedIn available for follow-up and project context.",
    bullets: ["Primary: email", "LinkedIn networking", "Fast follow-up channel"],
    actions: [
      { type: "mailto", email: profile.email, label: "Send Email" },
      { type: "section", section: 3, label: "Open Contact Section" },
    ],
  },
};

const journey = [
  {
    org: "Code Ninja",
    logo: "/images/code-ninja-logo.png",
    role: "Code Instructor",
    detail: "Teaching programming fundamentals and practical software problem-solving.",
  },
];

function panelClass(index, activeIndex) {
  const delta = index - activeIndex;
  const distance = Math.abs(delta);
  const base = "journey-panel";

  if (delta === 0) return `${base} is-active`;
  if (delta < 0) return `${base} is-before${distance > 1 ? " is-far" : ""}`;
  return `${base} is-after${distance > 1 ? " is-far" : ""}`;
}

function panelStyle(index, activeIndex, panelCount) {
  const delta = index - activeIndex;
  return {
    "--panel-offset": delta,
    zIndex: panelCount - Math.abs(delta),
  };
}

export default function HomePage() {
  const [activeSection, setActiveSection] = useState(0);
  const [activeNodeId, setActiveNodeId] = useState("overview");
  const [focusedNodeId, setFocusedNodeId] = useState(null);
  const [travelDirection, setTravelDirection] = useState(1);
  const [isTraveling, setIsTraveling] = useState(false);
  const [remotionFrame, setRemotionFrame] = useState(0);
  const activeNode = mapNodes.find((node) => node.id === activeNodeId) || mapNodes[0];
  const focusedNode = mapNodes.find((node) => node.id === focusedNodeId) || null;
  const focusedPage = focusedNode ? nodePages[focusedNode.id] : null;

  const goToSection = (target) => {
    setActiveSection((current) => {
      const resolved = typeof target === "function" ? target(current) : target;
      const next = Math.max(0, Math.min(sectionNames.length - 1, resolved));
      if (next === current) return current;
      setTravelDirection(next > current ? 1 : -1);
      setIsTraveling(true);
      return next;
    });
  };

  const moveSection = (delta) => {
    goToSection((current) => current + delta);
  };

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "ArrowRight") moveSection(1);
      if (event.key === "ArrowLeft") moveSection(-1);
      if (event.key === "Escape") setFocusedNodeId(null);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (activeSection !== 0) {
      setFocusedNodeId(null);
    }
  }, [activeSection]);

  useEffect(() => {
    if (!isTraveling) return undefined;
    const timeoutId = window.setTimeout(() => setIsTraveling(false), 860);
    return () => window.clearTimeout(timeoutId);
  }, [isTraveling, activeSection]);

  useEffect(() => {
    let rafId = 0;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsedSeconds = (now - startTime) / 1000;
      setRemotionFrame(elapsedSeconds * REMOTION_FPS);
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  const handleViewportMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty("--tilt-y", `${x * 9}deg`);
    event.currentTarget.style.setProperty("--tilt-x", `${-y * 7}deg`);
  };

  const handleViewportLeave = (event) => {
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
  };

  const openNodePage = (node) => {
    setActiveNodeId(node.id);
    setFocusedNodeId(node.id);
  };

  const openNodeFromQuickRail = (node) => {
    if (activeSection !== 0) {
      goToSection(0);
    }
    setActiveNodeId(node.id);
    setFocusedNodeId((current) => {
      if (activeSection === 0 && current === node.id) {
        return null;
      }
      return node.id;
    });
  };

  const renderNodeAction = (action) => {
    if (action.type === "section") {
      return (
        <button key={`${action.type}-${action.label}`} type="button" className="journey-btn" onClick={() => goToSection(action.section)}>
          {action.label}
        </button>
      );
    }
    if (action.type === "mailto") {
      return (
        <a key={`${action.type}-${action.label}`} className="journey-btn" href={`mailto:${action.email}`}>
          {action.label}
        </a>
      );
    }
    return (
      <a key={`${action.type}-${action.label}`} className="journey-btn" href={action.href} target="_blank" rel="noreferrer">
        {action.label}
      </a>
    );
  };

  const renderNodePageBody = () => {
    if (!focusedNode || !focusedPage) return null;

    if (focusedNode.id === "projects") {
      return (
        <div className="node-mini-projects">
          {projects.map((project) => (
            <article key={`mini-${project.name}`} className="node-mini-project">
              <a href={project.repo} target="_blank" rel="noreferrer" className="node-mini-project__image-wrap">
                <img className="node-mini-project__image" src={project.image} alt={`${project.name} screenshot`} />
              </a>
              <div className="node-mini-project__body">
                <div className="node-mini-project__meta">
                  <h4>{project.name}</h4>
                  <span>{project.year}</span>
                </div>
                <p>{project.description}</p>
                <p className="node-mini-project__stack">{project.stack}</p>
              </div>
            </article>
          ))}
        </div>
      );
    }

    if (focusedNode.id === "experience") {
      return (
        <div className="node-role-strip" aria-label="Experience roles">
          {journey.map((item) => (
            <article key={`node-role-${item.org}`} className="node-role-card">
              <div className="node-role-card__logo-wrap" aria-hidden="true">
                <img className="node-role-card__logo" src={item.logo} alt="" />
              </div>
              <div className="node-role-card__body">
                <h4>{item.org}</h4>
                <p>{item.role}</p>
              </div>
            </article>
          ))}
        </div>
      );
    }

    return (
      <>
        <p className="node-page__body">{focusedPage.body}</p>
        <ul className="node-page__list">
          {focusedPage.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </>
    );
  };

  return (
    <main className="page" id="top">
      <header className="topbar">
        <div className="brand-block">
          <a className="brand" href="#top">
            {profile.name}
          </a>
          <p className="brand-subtitle">{profile.role}</p>
        </div>

        <div className="header-meta">TABLE: PORTFOLIO_RECORDS</div>

        <div className="node-quick-rail" aria-label="Orbital shortcuts">
          <p className="node-quick-rail__label">Orbital Shortcuts</p>
          <div className="node-quick-rail__list">
            {mapNodes.map((node) => (
              <button
                key={`quick-${node.id}`}
                type="button"
                className={`node-quick-btn${activeNodeId === node.id ? " is-active" : ""}`}
                onClick={() => openNodeFromQuickRail(node)}
              >
                {node.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section
        className={`journey-viewport${isTraveling ? " is-traveling" : ""}`}
        aria-live="polite"
        style={{ "--travel-dir": travelDirection }}
        onMouseMove={handleViewportMove}
        onMouseLeave={handleViewportLeave}
      >
        <div className="journey-scene">
          {Array.from({ length: 7 }).map((_, index) => (
            <span key={`h-${index}`} className="scene-line scene-line--h" style={{ "--line-i": index }} />
          ))}
          {Array.from({ length: 7 }).map((_, index) => (
            <span key={`v-${index}`} className="scene-line scene-line--v" style={{ "--line-i": index }} />
          ))}
          <span className="scene-frame scene-frame--a" />
          <span className="scene-frame scene-frame--b" />
          <span className="scene-frame scene-frame--c" />
          <span className="scene-line scene-line--a" />
          <span className="scene-line scene-line--b" />
          <span className="scene-line scene-line--c" />
          <span className="scene-line scene-line--d" />
          <span className="scene-line scene-line--e" />
        </div>

        <article className={panelClass(0, activeSection)} style={panelStyle(0, activeSection, sectionNames.length)}>
          <p className="panel-label">ROW 01 | OVERVIEW</p>
          <div className="hero-grid">
            <div className="command-panel">
              <div className="command-panel__head">
                <div className="profile-photo-wrap profile-photo-wrap--compact">
                  <img className="profile-photo" src="/images/profile-portrait.jpg?v=20260217b" alt="Israel Obukonise portrait" />
                </div>
                <div>
                  <p className="command-kicker">GLOBAL SYSTEMS MAP</p>
                  <h2 className="command-title">{profile.name}</h2>
                  <p className="command-sub">{introHeadline}</p>
                </div>
              </div>

              <div className="node-card">
                <p className="node-label">NODE | {activeNode.label.toUpperCase()}</p>
                <h3>{activeNode.title}</h3>
                <p>{activeNode.detail}</p>
                <div className="node-actions">
                  {activeNode.href && (
                    <a href={activeNode.href} target="_blank" rel="noreferrer" className="journey-btn">
                      {activeNode.linkLabel || "Open Link"}
                    </a>
                  )}
                  {(activeNode.id === "overview" || activeNode.id === "projects") && (
                    <a className="journey-btn" href={profile.github} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  )}
                </div>
              </div>

              <div className="stats-table">
                {stats.map((item) => (
                  <div className="stats-row" key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <aside
              className={`systems-map${focusedNode ? " is-zoomed is-focus-locked" : ""}`}
              aria-label="Interactive systems map"
              style={focusedNode ? { "--focus-x": `${focusedNode.x}%`, "--focus-y": `${focusedNode.y}%` } : undefined}
            >
              <div className="map-stage">
                <div className="map-orbit" aria-hidden={focusedNode ? "true" : undefined}>
                  <div className="map-orbit-spin">
                    <div className="electron-cloud" aria-hidden="true">
                      {electronPackets.map((packet) => (
                        <span
                          key={packet.id}
                          className="electron-packet"
                          style={{
                            "--electron-angle": `${packet.angle}deg`,
                            "--electron-radius": `${packet.radius}px`,
                            "--electron-duration": `${packet.duration}s`,
                            "--electron-delay": `${packet.delay}s`,
                            "--electron-size": `${packet.size}px`,
                            "--electron-blink-duration": `${packet.blinkDuration}s`,
                            "--electron-blink-delay": `${packet.blinkDelay}s`,
                          }}
                        />
                      ))}
                    </div>
                    <div className="ghost-node-cloud" aria-hidden="true">
                      {ghostNodes.map((node) => (
                        <span
                          key={node.id}
                          className="map-ghost-node"
                          style={{
                            "--ghost-angle": `${node.angle}deg`,
                            "--ghost-radius": `${node.radius}px`,
                            "--ghost-size": `${node.size}px`,
                            "--ghost-duration": `${node.duration}s`,
                            "--ghost-delay": `${node.delay}s`,
                            "--ghost-pulse-duration": `${node.pulse}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="map-node-layer">
                    {mapNodes.map((node, index) => {
                      const nodeCount = mapNodes.length || 1;
                      const sharedOrbitDurationFrames = 20 * REMOTION_FPS;
                      const sharedOrbitFrame = remotionFrame % sharedOrbitDurationFrames;
                      const sharedOrbitDeg = interpolate(sharedOrbitFrame, [0, sharedOrbitDurationFrames], [0, 360], {
                        easing: Easing.linear,
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      });
                      const slotDeg = (index / nodeCount) * 360;
                      const elasticWave = Math.sin((remotionFrame + index * 17) / 23) + 0.26 * Math.sin((remotionFrame + index * 11) / 9);
                      const elasticDeg = elasticWave * (3.2 + (index % 3) * 0.7);
                      const baseRadiusX = 194 + (index % 2 === 0 ? 10 : -10);
                      const baseRadiusY = 154 + (index % 2 === 0 ? 8 : -8);
                      const elasticRadiusX = baseRadiusX + Math.sin((remotionFrame + index * 15) / 19) * (8 + (index % 3) * 1.2);
                      const elasticRadiusY = baseRadiusY + Math.cos((remotionFrame + index * 12) / 21) * (7 + (index % 2) * 1.5);
                      const angleRad = ((slotDeg + sharedOrbitDeg + elasticDeg) * Math.PI) / 180;
                      const orbitX = Math.cos(angleRad) * elasticRadiusX;
                      const orbitY = Math.sin(angleRad) * elasticRadiusY;
                      const tiltDeg = interpolate(Math.sin((remotionFrame + index * 9) / 30), [-1, 1], [-2.6, 2.6], {
                        easing: Easing.inOut(Easing.ease),
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      });
                      const scaleNudge = interpolate(Math.sin((remotionFrame + index * 11) / 28), [-1, 1], [0.98, 1.03], {
                        easing: Easing.inOut(Easing.ease),
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      });

                      return (
                        <button
                          key={node.id}
                          type="button"
                          className={`map-node${activeNodeId === node.id ? " is-active" : ""}`}
                          style={{
                            "--node-x": `${orbitX.toFixed(2)}px`,
                            "--node-y": `${orbitY.toFixed(2)}px`,
                            "--node-tilt": `${tiltDeg.toFixed(2)}deg`,
                            "--node-scale": scaleNudge.toFixed(3),
                          }}
                          onClick={() => openNodePage(node)}
                        >
                          <span className="map-node__inner">
                            <span className="map-node__dot" />
                            <span className="map-node__label">{node.label}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="map-globe" aria-hidden="true">
                  <span className="globe-ring globe-ring--a" />
                  <span className="globe-ring globe-ring--b" />
                  <span className="globe-ring globe-ring--c" />
                  <span className="globe-lat globe-lat--a" />
                  <span className="globe-lat globe-lat--b" />
                  <span className="globe-lon globe-lon--a" />
                  <span className="globe-lon globe-lon--b" />
                  <span className="globe-core" />
                </div>
              </div>

              {focusedNode && focusedPage && (
                <div className="node-page-shell" role="dialog" aria-modal="true" aria-label={`${focusedPage.title} page`}>
                  <button type="button" className="node-page-backdrop" onClick={() => setFocusedNodeId(null)} aria-label="Close node page" />
                  <article className="node-page">
                    <p className="node-page__kicker">NODE PAGE</p>
                    <h3>{focusedPage.title}</h3>
                    <p className="node-page__sub">{focusedPage.subtitle}</p>
                    {renderNodePageBody()}
                    <div className="node-page__actions">
                      {focusedPage.actions.map((action) => renderNodeAction(action))}
                      <button type="button" className="journey-btn journey-btn--main" onClick={() => setFocusedNodeId(null)}>
                        Back To Globe
                      </button>
                    </div>
                  </article>
                </div>
              )}
            </aside>
          </div>
        </article>

        <article className={panelClass(1, activeSection)} style={panelStyle(1, activeSection, sectionNames.length)}>
          <p className="panel-label">ROW 02 | PROJECTS</p>
          <div className="section-head">
            <h2>Projects</h2>
            <p>Some projects I have built.</p>
          </div>
          <div className="project-grid">
            {projects.map((project) => (
              <article key={project.name} className="project-card">
                <a href={project.repo} target="_blank" rel="noreferrer" className="project-image-wrap">
                  <img className="project-image" src={project.image} alt={`${project.name} screenshot`} />
                </a>
                <div className="project-card__body">
                  <div className="project-meta">
                    <h3>{project.name}</h3>
                    <p className="project-year">{project.year}</p>
                  </div>
                  <p className="desc">{project.description}</p>
                  <p className="stack">{project.stack}</p>
                  <ul className="project-points">
                    {project.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className={panelClass(2, activeSection)} style={panelStyle(2, activeSection, sectionNames.length)}>
          <p className="panel-label">ROW 03 | CURRENT ROLE</p>
          <div className="section-head">
            <h2>Current Role</h2>
            <p>Where I am contributing right now.</p>
          </div>
          <div className="timeline">
            {journey.map((item) => (
              <article key={item.org} className="timeline-item">
                <div className="timeline-logo-wrap" aria-hidden="true">
                  <img className="timeline-logo" src={item.logo} alt="" />
                </div>
                <div className="timeline-content">
                  <h3>{item.org}</h3>
                  <p className="timeline-role">{item.role}</p>
                  <p className="timeline-detail">{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className={panelClass(3, activeSection)} style={panelStyle(3, activeSection, sectionNames.length)}>
          <p className="panel-label">ROW 04 | CONTACT</p>
          <div className="contact-shell">
            <h2>Contact</h2>
            <p>If you are hiring, collaborating, or building something interesting, reach out.</p>
            <div className="contact-links">
              <a className="btn primary" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </article>
      </section>

    </main>
  );
}
