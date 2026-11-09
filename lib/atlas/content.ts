// =====================================================================
//  PORTFOLIO CONTENT — the only file you need to edit.
//
//  Add anything by calling one of the add* functions inside
//  `portfolio(...)` below. Every section finds its own bulbs, ring
//  slices and label positions for however many items you add.
//
//    p.addProject({ id, title, badge, tag, body, points, note, links, stack })
//    p.addSkill({ name, body, tools: [[toolName, projectOrRoleId], ...] })
//    p.addHackathon({ event, result, detail, project: projectId })
//    p.addRole({ id, company, role, when, where, note, points, chips })
//    p.addEducation({ school, degree, years, score })
//    p.addFact({ title, text, opens: 'education' (optional) })
//    p.addChannel({ name, value, href })
// =====================================================================

export interface Project { id: string; title: string; badge: string; tag: string; body: string; points: string[]; note: string; links: [string, string][]; stack: string[] }
export interface Skill { name: string; body: string; tools: [string, string | null][] }
export interface Hackathon { event: string; result: string; detail: string; project: string }
export interface Role { id: string; company: string; role: string; when: string; where: string; note: string; points: string[]; chips: string[] }
export interface Education { school: string; degree: string; years: string; score: string }
export interface Fact { title: string; text: string; opens?: 'education' }
export interface Channel { name: string; value: string; href: string; copy: string }
export interface Profile { name: string; headline: string; bio: string }

export interface Content {
  me: Profile;
  projects: Project[];
  skills: Skill[];
  hacks: Hackathon[];
  roles: Role[];
  edu: Education[];
  facts: Fact[];
  chans: Channel[];
}

class Builder {
  c: Content = { me: { name: '', headline: '', bio: '' }, projects: [], skills: [], hacks: [], roles: [], edu: [], facts: [], chans: [] };
  setProfile(o: Profile) { this.c.me = o; }
  addProject(o: Partial<Project> & Pick<Project, 'id' | 'title' | 'badge' | 'tag' | 'body'>) { this.c.projects.push({ points: [], note: '', links: [], stack: [], ...o }); }
  addSkill(o: Skill) { this.c.skills.push(o); }
  addHackathon(o: Hackathon) { this.c.hacks.push(o); }
  addRole(o: Partial<Role> & Pick<Role, 'id' | 'company' | 'role' | 'when' | 'where'>) { this.c.roles.push({ note: '', points: [], chips: [], ...o }); }
  addEducation(o: Education) { this.c.edu.push(o); }
  addFact(o: Fact) { this.c.facts.push(o); }
  addChannel(o: { name: string; value: string; href?: string; copy?: string }) {
    const href = o.href || '';
    this.c.chans.push({ name: o.name, value: o.value, href, copy: o.copy || (href && !href.startsWith('mailto:') ? href : o.value) });
  }
}

function portfolio(fill: (p: Builder) => void): Content {
  const b = new Builder();
  fill(b);
  return b.c;
}

export const content: Content = portfolio((p) => {
  p.setProfile({
    name: 'Pranav Shewale',
    headline: 'Blockchain & full-stack engineer · Mumbai',
    bio: 'I build smart contracts, backend systems and web apps, with a focus on real-world asset tokenization, payments and verifiable evidence.',
  });

  // ---------- Projects ----------
  p.addProject({ id: 'composite', title: 'Composite', badge: '1st place · Syrus 7.0', tag: 'RWA tokenization on a permissioned Hyperledger Fabric network',
    body: 'A token should never exist on its own claim. Every asset must pass a governed, auditable lifecycle before it can be split into fractional tokens.',
    points: ['Three independent organisations with their own peers, Fabric CA identity and Raft ordering', 'Issuer, Verifier, Valuer and Compliance roles take an asset through registration, verification, valuation and approval', 'Rules live in TypeScript chaincode, so skipping a step is rejected by the network itself', 'Documents stay off-chain with SHA-256 hashes on the ledger, and an auditor view shows every identity and transaction'],
    note: 'Demo case: a ₹2.1 crore plot of land in Kharghar, taken from registration to fractional tokenization.',
    links: [['Live', 'https://composite-eta.vercel.app/'], ['GitHub', 'https://github.com/prze8969/Composite']],
    stack: ['Hyperledger Fabric', 'TypeScript chaincode', 'Fabric Gateway SDK', 'Node.js', 'Next.js'] });
  p.addProject({ id: 'proofwork', title: 'Proofwork', badge: 'ETHGlobal Mumbai 2026 · shortlisted', tag: 'Tamper-evident work evidence for fair KRA reviews and bonuses',
    body: 'Built in a team of four. I owned about 70% of the backend API and about 97% of the ingest service.',
    points: ['Ingests Telegram, WhatsApp, voice notes (Whisper, mixed Hindi and English) and GitHub events; every item is PII-redacted, SHA-256 hashed and de-duplicated', 'HMAC-verified GitHub webhooks score merged PRs, reviews and closed bugs, and trigger a USDC clawback when a PR is reverted', 'Chat evidence stays pending until a co-signer confirms it with World ID or an EIP-712 signature', 'Wrote about 125 of the 190+ tests, including a race where two identical co-sign approvals arrive at once and exactly one is recorded'],
    note: 'Scoring is deterministic: an LLM only extracts claims from a fixed KPI catalogue and never touches the score.',
    links: [['GitHub', 'https://github.com/IshanJ9/Ethglobal26']],
    stack: ['TypeScript', 'Fastify', 'PostgreSQL', 'grammY', 'Whisper', 'World ID', 'EIP-712'] });
  p.addProject({ id: 'bipter', title: 'Bipter', badge: 'Solana × MLH · DeFi track', tag: 'Buy now, pay later on Solana',
    body: 'Merchants are paid in full at checkout from a USDC liquidity pool. Buyers repay in 4 instalments, collected automatically through a capped SPL token delegation.',
    points: ['Anchor program with PDA pool, credit-profile, loan and LP accounts; credit limits grow after each repaid loan', 'Gasless checkout: a fee sponsor co-signs only allowlisted instructions and rejects any System Program transfer from the fee payer', 'Devnet: 32 program transactions with 0 failures, 19 of 19 end-to-end checks and 11 of 11 wallet-adapter checks', 'Devnet instalments cost about 0.000005 SOL in fees and confirm in a median of 0.77 s'],
    note: 'All figures are devnet measurements, not mainnet usage.',
    links: [['Live', 'https://bipter.vercel.app/'], ['GitHub', 'https://github.com/prze8969/Bipter']],
    stack: ['Anchor (Rust)', 'SPL Token', 'Next.js', 'TypeScript'] });
  p.addProject({ id: 'kisansetu', title: 'KisanSetu', badge: 'Smart India Hackathon 2026', tag: 'Agricultural marketplace with milestone escrow and AI crop grading',
    body: 'Five smart contracts deployed to Polygon Amoy, with MetaMask signing for users and web3.py relaying for sensor and AI-grade anchoring.',
    points: ['Milestone-based escrow for marketplace trades', 'AI crop-quality grading, with grades anchored on-chain', '5 contracts live on Polygon Amoy'],
    links: [['Demo', 'https://krishi-niti-theta.vercel.app/'], ['GitHub', 'https://github.com/prze8969/TeamNeuroBytes']],
    stack: ['Solidity', 'Foundry', 'FastAPI', 'Next.js', 'web3.py'] });
  p.addProject({ id: 'geoptimer', title: 'GEOptimer', badge: '2nd place · HackAIThon', tag: 'How likely are AI engines to understand and cite your site?',
    body: 'A platform that scores how likely AI engines are to understand and cite a website.',
    links: [['Live', 'https://ge-optimer-fork-sepia.vercel.app/'], ['GitHub', 'https://github.com/prze8969/GEOptimer-Hack-AI-Thon-']],
    stack: ['React', 'Next.js', 'TypeScript'] });
  p.addProject({ id: 'traceback', title: 'Traceback.ai', badge: 'AI agent', tag: 'An autonomous developer onboarding agent',
    body: 'An agent that onboards developers on its own, built with Mastra, Supabase with pgvector, Next.js and Gemini.',
    stack: ['Mastra', 'Supabase / pgvector', 'Next.js', 'Gemini'] });

  // ---------- Experience (newest first) ----------
  p.addRole({ id: 'sovriigne', company: 'Sovriigne', role: 'Founding Member & Blockchain Developer', when: 'Feb 2026 – Present', where: 'Remote',
    note: 'An early-stage RWA tokenization platform on Polygon. It is not a registered company, and the role is unpaid.',
    points: ['Wrote 6 Solidity contracts that tokenize real estate and private credit as fractional ERC-1155 shares, with tranche waterfalls, compliance gating and atomic delivery-versus-payment', 'Built a 110-test Foundry suite with fuzz and invariant tests, reaching 90% line coverage', 'Designed a bitfield role and permission system and the database schema, and audited contracts with Foundry and Slither against a spec'],
    chips: ['Solidity', 'Foundry', 'Slither', 'ERC-1155', 'Polygon'] });
  p.addRole({ id: 'bynocs', company: 'Bynocs', role: 'Software Engineering Intern', when: 'May – Aug 2026 · 3 months', where: 'Kanohi Eye Pvt. Ltd. · Mumbai',
    note: 'A 3-month internship working on EyeTwin, a digital twin of the human eye.',
    points: ['Built a parametric anatomical eye model in Blender with Python (bpy), with biometrically scaled, reusable digital-twin instances', 'Implemented pupillary light reflex mechanics and Snell’s-law ray tracing through the cornea, lens and retina', 'Attempted a finite element simulation of corneal tissue under intraocular pressure in FEBio', 'Wrote the research document and merged two LaTeX documents into one digital-twin specification'],
    chips: ['Blender', 'Python (bpy)', 'FEBio', 'LaTeX'] });

  // ---------- Skills: each tool points at the project or role id that proves it ----------
  p.addSkill({ name: 'Solidity & EVM', body: 'Smart contracts on EVM chains: fractional tokens, compliance gating, escrow and settlement.',
    tools: [['Foundry', 'sovriigne'], ['ERC-1155', 'sovriigne'], ['Slither', 'sovriigne'], ['Polygon Amoy', 'kisansetu'], ['EIP-712 signatures', 'proofwork'], ['web3.py relaying', 'kisansetu']] });
  p.addSkill({ name: 'Rust & Solana', body: 'On-chain programs on Solana with Anchor, from account design to gasless checkout.',
    tools: [['Anchor', 'bipter'], ['SPL Token delegation', 'bipter'], ['PDA account design', 'bipter'], ['Fee-sponsored transactions', 'bipter']] });
  p.addSkill({ name: 'Hyperledger Fabric', body: 'Permissioned ledgers where the rules are enforced by the network, not the UI.',
    tools: [['TypeScript chaincode', 'composite'], ['Fabric CA & Raft', 'composite'], ['Fabric Gateway SDK', 'composite'], ['Multi-org networks', 'composite']] });
  p.addSkill({ name: 'TypeScript & web', body: 'Type-safe backends and web apps.',
    tools: [['Next.js', 'composite'], ['Fastify', 'proofwork'], ['Node.js', 'composite'], ['PostgreSQL', 'proofwork'], ['tRPC', 'sovriigne'], ['React', 'geoptimer'], ['grammY', 'proofwork']] });
  p.addSkill({ name: 'Python', body: 'APIs, chain relaying, speech-to-text and 3D scripting.',
    tools: [['FastAPI', 'kisansetu'], ['web3.py', 'kisansetu'], ['Whisper', 'proofwork'], ['Blender (bpy)', 'bynocs']] });
  p.addSkill({ name: 'AI & agents', body: 'LLM features built so the model never controls the outcome.',
    tools: [['Gemini integration', 'traceback'], ['Mastra agents', 'traceback'], ['pgvector search', 'traceback'], ['LLM claim extraction', 'proofwork']] });
  p.addSkill({ name: '3D & simulation', body: 'Digital-twin modelling, optics and tissue simulation.',
    tools: [['Blender (bpy)', 'bynocs'], ['Snell’s-law ray tracing', 'bynocs'], ['Pupillary light reflex', 'bynocs'], ['FEBio', 'bynocs'], ['LaTeX specs', 'bynocs']] });
  p.addSkill({ name: 'Testing & tools', body: 'Tests that prove the maths, plus a daily setup.',
    tools: [['Fuzz & invariant tests', 'sovriigne'], ['Race-condition tests', 'proofwork'], ['HMAC webhook checks', 'proofwork'], ['Devnet end-to-end checks', 'bipter'], ['Fedora + i3wm', null], ['Docker & Git', null]] });

  // ---------- Hackathons: each one opens its project ----------
  p.addHackathon({ event: 'Syrus 7.0', result: '1st place', detail: 'PS-01: Real-World Asset Tokenization', project: 'composite' });
  p.addHackathon({ event: 'HackAIThon', result: '2nd place', detail: 'AI-engine citation scoring', project: 'geoptimer' });
  p.addHackathon({ event: 'Solana × MLH', result: 'DeFi track', detail: 'Buy now, pay later on Solana', project: 'bipter' });
  p.addHackathon({ event: 'ETHGlobal Mumbai', result: 'Shortlisted', detail: 'Shortlisted internationally, 2026', project: 'proofwork' });
  p.addHackathon({ event: 'Smart India Hackathon', result: 'SIH 2026', detail: 'Agri marketplace with escrow', project: 'kisansetu' });

  // ---------- About ----------
  p.addFact({ title: 'Education', text: '2 degrees · tap to zoom in', opens: 'education' });
  p.addFact({ title: 'Based in', text: 'Mumbai, India' });
  p.addFact({ title: 'Focus', text: 'RWA tokenization, payments and verifiable evidence' });
  p.addFact({ title: 'Competitive programming', text: 'Codeforces ~779, working toward 1600' });
  p.addEducation({ school: 'IIT Madras', degree: 'BS in Data Science and Applications', years: '2025 – present', score: 'CGPA 8.56' });
  p.addEducation({ school: 'VESIT Mumbai', degree: 'B.Tech in Computer Engineering', years: '2025 – present', score: 'CGPA 9.86' });

  // ---------- Contact: the first one gets the biggest mini-brot ----------
  p.addChannel({ name: 'Email', value: 'shewalepranav66@gmail.com', href: 'mailto:shewalepranav66@gmail.com' });
  p.addChannel({ name: 'GitHub', value: 'github.com/prze8969', href: 'https://github.com/prze8969' });
  p.addChannel({ name: 'LinkedIn', value: 'in/pranav-shewale-prze8969', href: 'https://www.linkedin.com/in/pranav-shewale-prze8969/' });
  p.addChannel({ name: 'Codeforces', value: 'shewalepranav66', href: 'https://codeforces.com/profile/shewalepranav66' });
  p.addChannel({ name: 'Location', value: 'Mumbai, India' });
});

export type Target = { p: number } | { r: number } | null;

export function target(id: string | null | undefined): Target {
  if (!id) return null;
  const p = content.projects.findIndex((x) => x.id === id);
  if (p >= 0) return { p };
  const r = content.roles.findIndex((x) => x.id === id);
  return r >= 0 ? { r } : null;
}

export function targetName(t: Target): string {
  if (!t) return 'Daily setup';
  return 'p' in t ? content.projects[t.p].title : content.roles[t.r].company;
}
