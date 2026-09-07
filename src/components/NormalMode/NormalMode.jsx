import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { portfolioData } from '../../data/portfolioData';
import './NormalMode.css';

/* ══════════════════════════════════════════════
   RETRO ANIMATIONS
   Smooth vintage feel — fades, slides, bounces
   ══════════════════════════════════════════════ */

/* Fade up — classic smooth reveal */
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
};

/* Slide in from left */
const slideLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

/* Slide in from right */
const slideRight = {
  hidden: { opacity: 0, x: 80 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

/* Scale pop — arcade coin-insert feel */
const scalePop = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1, scale: 1,
    transition: { type: 'spring', stiffness: 250, damping: 20 }
  }
};

/* Glow in — neon flicker */
const glowIn = {
  hidden: { opacity: 0, filter: 'blur(8px)' },
  visible: {
    opacity: 1, filter: 'blur(0px)',
    transition: { duration: 0.8, ease: 'easeOut' }
  }
};

/* Stagger containers */
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const staggerFast = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } }
};

/* ── Section wrapper with scroll trigger ── */
function Section({ children, className = '', id, ...rest }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.section
      ref={ref}
      id={id}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={`nm-section ${className}`}
      {...rest}
    >
      {children}
    </motion.section>
  );
}

/* ── Typewriter ── */
function Typewriter({ words }) {
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    let timeout;
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 90);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 50);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setWordIdx((wordIdx + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIdx, words]);

  return (
    <span className="nm-typewriter">
      {displayed}
      <span className="nm-cursor">▌</span>
    </span>
  );
}

/* ── Image with fallback ── */
function ProfileImage({ src, alt }) {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <div className="nm-profile-placeholder">

      </div>
    );
  }
  return <img src={src} alt={alt} className="nm-profile-img" onError={() => setError(true)} />;
}

function ProjectImage({ src, alt, accent }) {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <div className="nm-project-img-placeholder" style={{ '--project-accent': accent }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9l4-4 4 4 4-4 4 4" />
          <circle cx="8.5" cy="13.5" r="1.5" />
        </svg>
      </div>
    );
  }
  return <img src={src} alt={alt} className="nm-project-img" onError={() => setError(true)} />;
}

/* ── Skill Tag ── */
function SkillTag({ name, delay }) {
  return (
    <motion.span
      className="nm-skill-tag"
      variants={scalePop}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      transition={{ delay: delay * 0.04 }}
    >
      {name}
    </motion.span>
  );
}

/* ── Smooth scroll helper ── */
function smoothScrollTo(e, targetId) {
  e.preventDefault();
  const el = document.getElementById(targetId);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Marquee Banner — Retro Ticker ── */
function MarqueeBanner() {
  const items = ['GAME DEV', '★', 'UNITY', '★', 'C#', '★', 'BLENDER', '★', '3D ART', '★', 'PIXEL ART', '★', 'INDIE GAMES', '★', 'RETRO', '★'];
  return (
    <div className="nm-marquee">
      <div className="nm-marquee-inner">
        {[...items, ...items, ...items].map((item, i) => (
          item === '★'
            ? <span key={i} className="nm-marquee-dot">{item}</span>
            : <span key={i} className="nm-marquee-text">{item}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Section Divider — Retro dots ── */
function SectionDivider() {
  return (
    <div className="nm-divider">
      <div className="nm-divider-line" />
      <div className="nm-divider-shape" />
      <div className="nm-divider-shape" />
      <div className="nm-divider-line" />
      <div className="nm-divider-shape" />
      <div className="nm-divider-shape" />
      <div className="nm-divider-line" />
    </div>
  );
}

/* ══════════════════════════════════════
   NAV
   ══════════════════════════════════════ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`nm-nav ${scrolled ? 'nm-nav-scrolled' : ''}`}>

      <div className="nm-nav-links">
        {['About', 'Projects', 'Contact'].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} className="nm-nav-link" onClick={(e) => smoothScrollTo(e, l.toLowerCase())}>{l}</a>
        ))}
      </div>
    </nav>
  );
}

/* ══════════════════════════════════════
   HERO — Retro display with warm glow
   ══════════════════════════════════════ */
function Hero() {
  return (
    <section className="nm-hero" id="home">
      {/* Retro decorative elements */}
      <div className="nm-shape nm-shape-1" />
      <div className="nm-shape nm-shape-2" />
      <div className="nm-shape nm-shape-3" />
      <div className="nm-shape nm-shape-4" />

      <motion.div
        className="nm-hero-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.span
          className="nm-hero-greeting"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {'>'} HELLO_WORLD // I'M
        </motion.span>

        <motion.h1
          className="nm-hero-name"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {portfolioData.name}
          <span className="nm-hero-name-underline" />
        </motion.h1>

        <motion.p
          className="nm-hero-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Typewriter words={portfolioData.subtitles} />
        </motion.p>

        <motion.p
          className="nm-hero-bio"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
        >
          {portfolioData.about[0]}
        </motion.p>

        <motion.div
          className="nm-hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <a href="#projects" className="nm-btn-primary" onClick={(e) => smoothScrollTo(e, 'projects')}>View My Work ▸</a>
          <a href="#contact" className="nm-btn-ghost" onClick={(e) => smoothScrollTo(e, 'contact')}>Get In Touch</a>
        </motion.div>

        <motion.div
          className="nm-hero-socials"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
        >
          <a href={portfolioData.socials.github} target="_blank" rel="noreferrer" className="nm-social-link">
            <GithubIcon /> GitHub
          </a>
          <a href={portfolioData.socials.linkedin} target="_blank" rel="noreferrer" className="nm-social-link">
            <LinkedInIcon /> LinkedIn
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        className="nm-hero-image-wrapper"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="nm-hero-img-ring">
          <ProfileImage src={portfolioData.profileImage} alt={portfolioData.name} />
        </div>
      </motion.div>

      <motion.div
        className="nm-scroll-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span>scroll</span>
        <div className="nm-scroll-line" />
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════
   ABOUT — Staggered scroll reveals
   ══════════════════════════════════════ */
function About() {
  return (
    <Section className="nm-about-section" id="about">
      <motion.div className="nm-section-header" variants={fadeUp}>
        <span className="nm-label">01 // About</span>
        <h2 className="nm-section-title">A bit about me</h2>
      </motion.div>

      <div className="nm-about-grid">
        <motion.div className="nm-about-text-col" variants={stagger}>
          {portfolioData.about.map((para, i) => (
            <motion.p
              key={i}
              className="nm-about-para"
              variants={i % 2 === 0 ? slideLeft : slideRight}
            >
              {para}
            </motion.p>
          ))}

          <motion.div className="nm-education" variants={fadeUp}>
            {portfolioData.education.map((edu, i) => (
              <div key={i} className="nm-edu-card">
                <h4 className="nm-edu-degree">{edu.degree}</h4>
                <p className="nm-edu-inst">{edu.institution}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div className="nm-skills-col" variants={fadeUp}>
          <h3 className="nm-skills-heading">Skills & Tools</h3>
          <motion.div className="nm-skills-tags-wrap" variants={staggerFast}>
            {portfolioData.skills.map((skill, i) => (
              <SkillTag key={skill.name} name={skill.name} delay={i} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}

/* ══════════════════════════════════════
   PROJECTS — Cards with reveal animations
   ══════════════════════════════════════ */
function Projects() {
  return (
    <Section className="nm-projects-section" id="projects">
      <motion.div className="nm-section-header" variants={fadeUp}>
        <span className="nm-label">02 // Work</span>
        <h2 className="nm-section-title">Featured Projects</h2>
      </motion.div>

      <motion.div className="nm-projects-grid" variants={stagger}>
        {portfolioData.projects.map((project, i) => {
          const isPlayable = !!project.link;
          const CardWrapper = isPlayable ? 'a' : 'div';
          const wrapperProps = isPlayable
            ? { href: project.link, target: '_blank', rel: 'noreferrer', className: 'nm-project-card-link' }
            : {};

          return (
            <motion.article
              key={project.id}
              className={`nm-project-card ${isPlayable ? 'nm-project-playable' : ''}`}
              variants={fadeUp}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              style={{ '--card-accent': project.accentColor }}
            >
              <CardWrapper {...wrapperProps} style={{ textDecoration: 'none', color: 'inherit', display: 'contents' }}>
                <div className="nm-project-img-wrap">
                  <ProjectImage src={project.image} alt={project.title} accent={project.accentColor} />
                  <div className="nm-project-img-overlay" />
                  {isPlayable && (
                    <div className="nm-project-play-overlay">
                      <span className="nm-play-icon">▶</span>
                      <span className="nm-play-text">Click to Play</span>
                    </div>
                  )}
                </div>
                <div className="nm-project-body">
                  <h3 className="nm-project-title">{project.title}</h3>
                  <p className="nm-project-desc">{project.description}</p>
                  <div className="nm-project-tags">
                    {project.tags.map(tag => (
                      <span key={tag} className="nm-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </CardWrapper>
            </motion.article>
          );
        })}
      </motion.div>
    </Section>
  );
}

/* ══════════════════════════════════════
   CONTACT
   ══════════════════════════════════════ */
function Contact() {
  return (
    <Section className="nm-contact-section" id="contact">
      <motion.div className="nm-section-header" variants={fadeUp}>
        <span className="nm-label">03 // Contact</span>
        <h2 className="nm-section-title">Let's connect</h2>
      </motion.div>

      <motion.div className="nm-contact-content" variants={stagger}>
        <motion.p className="nm-contact-desc" variants={glowIn}>
          Whether you want to collaborate on a game project, jam together, or just say hello — my inbox is always open.
        </motion.p>
        <motion.a
          href={`mailto:${portfolioData.email}`}
          className="nm-btn-primary nm-contact-btn"
          variants={scalePop}
        >
          {portfolioData.email}
        </motion.a>
        <motion.div className="nm-contact-socials" variants={stagger}>
          <motion.a
            href={portfolioData.socials.github}
            target="_blank"
            rel="noreferrer"
            className="nm-social-pill"
            variants={slideLeft}
          >
            <GithubIcon /> GitHub
          </motion.a>
          <motion.a
            href={portfolioData.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="nm-social-pill"
            variants={slideRight}
          >
            <LinkedInIcon /> LinkedIn
          </motion.a>
        </motion.div>
      </motion.div>
    </Section>
  );
}

/* ── Icons ── */
function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="nm-footer">
      <p>Designed & built by <span className="nm-footer-name">Adwait More</span> · {new Date().getFullYear()}</p>
    </footer>
  );
}

/* ══════════════════════════════════════
   MAIN EXPORT
   ══════════════════════════════════════ */
const NormalMode = () => (
  <div className="nm-root">
    <Nav />
    <Hero />
    <MarqueeBanner />
    <SectionDivider />
    <About />
    <SectionDivider />
    <Projects />
    <SectionDivider />
    <Contact />
    <Footer />
  </div>
);

export default NormalMode;
