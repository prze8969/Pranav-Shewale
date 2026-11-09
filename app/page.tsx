import Atlas from '../components/atlas/Atlas';
import { content } from '../lib/atlas/content';

// The interactive atlas is the page. The hidden outline below carries the same content as plain
// HTML for search engines and screen readers.
export default function Home() {
  const c = content;
  return (
    <>
      <Atlas />
      <main className="sr-only">
        <h1>{c.me.name}</h1>
        <p>{c.me.headline}</p>
        <p>{c.me.bio}</p>
        <section>
          <h2>Projects</h2>
          {c.projects.map((p) => (
            <article key={p.id}>
              <h3>{p.title} · {p.badge}</h3>
              <p>{p.tag}. {p.body}</p>
              <ul>{p.points.map((t) => <li key={t}>{t}</li>)}</ul>
              {p.note && <p>{p.note}</p>}
              <p>Stack: {p.stack.join(', ')}</p>
              {p.links.map(([label, href]) => <a key={href} href={href}>{p.title} {label}</a>)}
            </article>
          ))}
        </section>
        <section>
          <h2>Experience</h2>
          {c.roles.map((r) => (
            <article key={r.id}>
              <h3>{r.role}, {r.company} ({r.when})</h3>
              <p>{r.note}</p>
              <ul>{r.points.map((t) => <li key={t}>{t}</li>)}</ul>
            </article>
          ))}
        </section>
        <section>
          <h2>Hackathons</h2>
          <ul>{c.hacks.map((h) => <li key={h.event}>{h.event}: {h.result} · {h.detail}</li>)}</ul>
        </section>
        <section>
          <h2>Skills</h2>
          {c.skills.map((s) => <p key={s.name}>{s.name}: {s.tools.map((t) => t[0]).join(', ')}</p>)}
        </section>
        <section>
          <h2>Education</h2>
          <ul>{c.edu.map((e) => <li key={e.school}>{e.school}, {e.degree}, {e.years}, {e.score}</li>)}</ul>
        </section>
        <section>
          <h2>Contact</h2>
          <ul>{c.chans.map((ch) => <li key={ch.name}>{ch.href ? <a href={ch.href}>{ch.name}: {ch.value}</a> : `${ch.name}: ${ch.value}`}</li>)}</ul>
        </section>
      </main>
    </>
  );
}
