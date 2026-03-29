import ClientEffects from "../components/ClientEffects";

const introHeadline =
  "I'm a first-year Computer Science student interested in AI, software engineering, and using data to solve real problems across different industries. I enjoy experimenting with models and building projects.";

const profile = {
  name: "Israel Obukonise",
  headline:
    "I’m a first-year Computer Science student interested in AI, software engineering, and how data can be used to solve real problems across different industries. I enjoy experimenting with models, building projects, and learning by doing.",
  email: "Is.obukonise@gmail.com",
  github: "https://github.com/Israelobuk",
  linkedin: "https://www.linkedin.com/in/israelobukonise/",
  cv: "/IsObukCSResume.pdf",
  location: "Ontario, Canada",
  current: "Code Ninja",
};

const heroHeadline =
  "I’m a first-year Computer Science student interested in AI, software engineering, and using data to solve real problems across different industries. I enjoy experimenting with models and building projects.";

const projects = [
  {
    name: "Black Box Explainer",
    year: "2026",
    stack: "React / Vite / Python / FastAPI / Ollama / JavaScript / CSS / Docker",
    image: "/images/blackbox-explainer.png",
    repo: "https://github.com/Israelobuk/blackbox_explainer",
    description:
      "AI answer auditing app with a React frontend and FastAPI backend that uses Ollama locally to surface weak reasoning, blind spots, and better follow-up questions.",
    points: ["Schema-validated outputs", "Evidence quote verification", "Ollama support"],
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
];

const journey = [
  {
    org: "Code Ninja",
    logo: "/images/code-ninja-logo.png",
    role: "Code Instructor",
    detail: "Teaching programming fundamentals and practical software problem-solving.",
  },
];

export default function HomePage() {
  return (
    <>
      <main className="page" id="top">
        <header className="topbar reveal">
          <div className="brand-block">
            <a className="brand" href="#top">
              {profile.name}
            </a>
            <p className="brand-subtitle">
              Computer Science at{" "}
              <a href="https://carleton.ca/" target="_blank" rel="noreferrer">
                Carleton University
              </a>
            </p>
          </div>
          <nav className="topnav">
            <a className="topnav-link" href="#journey">
              Journey
            </a>
            <a className="topnav-link" href="#projects">
              Projects
            </a>
            <a className="topnav-link" href="#contact">
              Contact
            </a>
          </nav>
        </header>

        <section className="hero reveal">
          <div className="hero-main">
            <div className="hero-copy">
              <p className="headline">{introHeadline}</p>
            </div>
            <div className="social-links">
              <a className="social-link" href={profile.github} target="_blank" rel="noreferrer">
                <span className="social-icon">GH</span>
                <span className="social-link__label">GitHub</span>
              </a>
              <a className="social-link" href={`mailto:${profile.email}`}>
                <span className="social-icon">@</span>
                <span className="social-link__label">Email</span>
              </a>
              <a className="social-link" href={profile.linkedin} target="_blank" rel="noreferrer">
                <span className="social-icon">in</span>
                <span className="social-link__label">LinkedIn</span>
              </a>
              <a className="social-link" href={profile.cv} target="_blank" rel="noreferrer">
                <span className="social-icon">CV</span>
                <span className="social-link__label">CV</span>
              </a>
            </div>
          </div>

          <aside className="hero-card reveal" data-tilt>
            <div className="hero-card__halo" aria-hidden="true" />
            <div className="profile-photo-wrap">
              <img
                className="profile-photo"
                src="/images/profile-portrait.jpg?v=20260217b"
                alt="Israel Obukonise portrait"
              />
            </div>
            <div className="hero-card__body">
              <p className="card-label">Now</p>
              <p className="card-value">Instructing at {profile.current}</p>
              <p className="card-meta">{profile.location}</p>
            </div>
          </aside>
        </section>

        <section id="journey" className="section reveal">
          <div className="section-head">
            <h2>Journey</h2>
            <p>Where I have contributed.</p>
          </div>
          <div className="timeline">
            {journey.map((item) => (
              <article key={item.org} className="timeline-item timeline-item--plain">
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
          <div className="journey-hover-art" aria-hidden="true">
            <img src="/images/journey-hover.jpg" alt="" />
          </div>
        </section>

        <section id="projects" className="section reveal">
          <div className="section-head">
            <h2>Projects</h2>
            <p>Some projects I've built.</p>
          </div>
          <div className="project-grid">
            {projects.map((project) => (
              <article key={project.name} className="project-card reveal">
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
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="section contact reveal">
          <div className="section-head">
            <h2>Contact</h2>
            <p>If you are hiring, collaborating, or building something interesting, reach out.</p>
          </div>
          <a className="btn primary" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </section>
      </main>

      <ClientEffects />
    </>
  );
}











