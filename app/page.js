import ClientEffects from "../components/ClientEffects";

const profile = {
  name: "Israel Obukonise",
  headline:
    "I’m a first-year Computer Science student interested in AI, software engineering, and how data can be used to solve real problems across different industries. I enjoy experimenting with models, building projects, and learning by doing.",
  email: "Is.obukonise@gmail.com",
  github: "https://github.com/Israelobuk",
  linkedin: "https://www.linkedin.com/in/israelobukonise/",
  location: "Ontario, Canada",
  current: "Code Ninja",
};

const projects = [
  {
    name: "Black Box Explainer",
    year: "2026",
    stack: "Python / Streamlit / Local LLM",
    image: "/images/blackbox-explainer.png",
    repo: "https://github.com/Israelobuk/blackbox_explainer",
    description:
      "Local-first app that explains likely reasoning paths behind model outputs using evidence claims, assumptions, uncertainty, and confidence checks.",
    points: ["Schema-validated outputs", "Evidence quote verification", "LM Studio and Ollama support"],
  },
  {
    name: "Pulseboard",
    year: "2026",
    stack: "Python / PySide6 / Windows",
    image: "/images/pulseboard.png",
    repo: "https://github.com/Israelobuk/pulseboard",
    description:
      "Desktop monitor focused on process behavior and responsive performance telemetry with smooth updates and low-latency UI rendering.",
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
          <nav>
            <a href="#journey">Journey</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        <section className="hero reveal">
          <div className="hero-main">
            <p className="headline">{profile.headline}</p>
            <div className="social-links">
              <a className="social-link" href={profile.github} target="_blank" rel="noreferrer">
                <span className="social-icon">GH</span>
                <span>GitHub</span>
              </a>
              <a className="social-link" href={`mailto:${profile.email}`}>
                <span className="social-icon">@</span>
                <span>Email</span>
              </a>
              <a className="social-link" href={profile.linkedin} target="_blank" rel="noreferrer">
                <span className="social-icon">in</span>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          <aside className="hero-card reveal" data-tilt>
            <div className="profile-photo-wrap">
              <img
                className="profile-photo"
                src="/images/profile-portrait.jpg?v=20260217b"
                alt="Israel Obukonise portrait"
              />
            </div>
            <p className="card-label">Now</p>
            <p className="card-value">Instructing at {profile.current}</p>
            <p className="card-meta">{profile.location}</p>
          </aside>
        </section>

        <section id="journey" className="section reveal">
          <div className="section-head">
            <h2>Journey</h2>
            <p>Where I have contributed.</p>
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
          <div className="journey-hover-art" aria-hidden="true">
            <img src="/images/journey-hover.jpg" alt="" />
          </div>
        </section>

        <section id="projects" className="section reveal">
          <div className="section-head">
            <h2>Projects</h2>
          </div>
          <div className="project-grid">
            {projects.map((project) => (
              <article key={project.name} className="project-card reveal">
                <a href={project.repo} target="_blank" rel="noreferrer" className="project-image-wrap">
                  <img className="project-image" src={project.image} alt={`${project.name} screenshot`} />
                </a>
                <div className="project-meta">
                  <h3>{project.name}</h3>
                  <p className="project-year">{project.year}</p>
                </div>
                <p className="desc">{project.description}</p>
                <p className="stack">{project.stack}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="section contact reveal">
          <h2>Contact</h2>
          <p>If you are hiring, collaborating, or building something interesting, reach out.</p>
          <a className="btn primary" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </section>
      </main>

      <ClientEffects />
    </>
  );
}

