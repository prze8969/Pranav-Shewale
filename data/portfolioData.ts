export interface QuestItem {
  id: string;
  title: string;
  role: string;
  company: string;
  location: string;
  period: string;
  type: 'work' | 'competition';
  categoryLabel?: string;
  oneLineSummary: string;
  techStack: string[];
  bulletPoints: {
    text: string;
    proofLabel?: string;
    proofUrl?: string;
  }[];
  media?: {
    type: 'video' | 'image';
    src: string;
    title: string;
    caption: string;
  }[];
  prototypeNote?: string;
  links?: { label: string; url: string; isExternalDoc?: boolean }[];
}

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  category: 'web3-systems' | 'experiments';
  oneLineSummary: string;
  description: string;
  statusNote?: string;
  highlights: string[];
  techStack: string[];
  visualPreview?: {
    type: 'video' | 'image' | 'badge';
    src?: string;
    title?: string;
    badgeText?: string;
  };
  links: {
    github?: string;
    live?: string;
    pdf?: string;
    caseStudyRequest?: boolean;
  };
}

export interface SkillNode {
  id: string;
  name: string;
  category: 'auditing' | 'systems' | 'web3' | 'graphics' | 'intelligence';
  proofPoint: {
    label: string;
    targetAnchor?: string;
    url?: string;
  };
  perks: string[];
  description: string;
  x: number;
  y: number;
}

export const CHARACTER_DATA = {
  name: "Pranav Shewale",
  handle: "prze8969",
  role: "Smart Contract Auditor & Systems Engineer",
  location: "Mumbai, India",
  email: "shewalepranav66@gmail.com",
  github: "https://github.com/prze8969",
  linkedin: "https://www.linkedin.com/in/pranav-shewale-prze8969/",
  quickBio: "Computer Engineering scholar at VESIT Mumbai concurrently pursuing B.S. Data Science at IIT Madras. Specializing in smart contract security auditing, ERC-2535/ERC-1155 RWA tokenization protocols, and low-level systems engineering.",
  vitalStats: {
    magicka: {
      label: "Smart Contract Security",
      proof: "Audited & Verified",
      detail: "Solidity · Foundry · Slither · ERC-2535 Diamond · Polygon Amoy"
    },
    health: {
      label: "Systems & Infrastructure",
      proof: "Deployed & Maintained",
      detail: "Alpine Linux Dual-Boot · RAID Server · LOQ RTX 4060 · FEBio FEA"
    },
    stamina: {
      label: "Engineering Foundations",
      proof: "Dual University Rigor",
      detail: "VESIT & IIT Madras Dual Enrolled · High Algorithmic Rigor · RWA Protocols"
    }
  },
  quickPillars: [
    { label: "Smart Contract Security", anchor: "quests" },
    { label: "Systems & Linux", anchor: "attributes" },
    { label: "Featured Projects", anchor: "relics" },
    { label: "Skill Map", anchor: "skills" }
  ],
  education: [
    {
      institution: "VESIT Mumbai (CMPN)",
      degree: "B.E. in Computer Engineering",
      score: "10 CGPA (Sem 1) · 9.86 CGPA (Sem 2)",
      status: "Currently Enrolled (Top Academic Standing)",
      highlights: "Ranked top of class; advanced data structures, computer architecture, cryptography, and OS internals."
    },
    {
      institution: "IIT Madras",
      degree: "B.S. in Data Science & Applications",
      score: "8.88 CGPA",
      status: "Foundation Level Completed",
      highlights: "Rigorous discrete mathematics, computational data processing, linear algebra, and statistical modeling."
    }
  ],
  hardwareAndSystems: [
    {
      label: "Primary Battlestation",
      value: "Lenovo LOQ — Ryzen 7 7435HS, RTX 4060, 24GB RAM",
      detail: "Configured with dual-boot Alpine Linux for frictionless headless compilation and low-overhead security auditing."
    },
    {
      label: "Home Server & Storage",
      value: "Personal Home Server with RAID Configuration",
      detail: "Fault-tolerant redundant storage array running automated cross-device sync and self-hosted archival daemons."
    },
    {
      label: "Hardware Troubleshooting",
      value: "Dell Inspiron 15-3552 Revival & Diagnostics",
      detail: "Diagnosed physical DC jack short; recovered corrupted EVM SSD read-I/O via TestDisk; patched GRUB/i915 driver bugs and NTFS UAS workarounds."
    }
  ]
};

export const QUESTS: QuestItem[] = [
  {
    id: "sovriigne-mscf",
    title: "Sovriigne — Real-World Asset (RWA) Tokenization",
    role: "Blockchain Engineer / Core Contributor",
    company: "Sovriigne",
    location: "Polygon Amoy / Remote",
    period: "2024 — Present",
    type: "work",
    categoryLabel: "Core Protocol Team",
    oneLineSummary: "Engineering & auditing the on-chain smart contract layer for fractional RWA tokenization (ERC-1155/ERC-2535) on Polygon.",
    bulletPoints: [
      {
        text: "Authored and audited Solidity smart contracts (Foundry) tokenizing real-world assets (real estate, private credit) as fractional ERC-1155 shares.",
        proofLabel: "Audit Methodology on Request"
      },
      {
        text: "Engineered on-chain compliance layer — whitelisting, sanctions enforcement, and jurisdiction gating — enforcing transfer restrictions at the EVM bytecode level."
      },
      {
        text: "Designed waterfall yield engine distributing incoming cashflows across investor tranches (senior debt vs. equity), with automatic step-in rights on default."
      },
      {
        text: "Built protocol circuit-breaker architecture enabling atomic system-wide freezing if invariant checks or anomalous volume triggers fire."
      },
      {
        text: "Engineered secondary-market atomic swap logic ensuring trustless token-for-cash settlement, lock-up vesting schedules, and price sanity boundaries."
      },
      {
        text: "Authored comprehensive Foundry test suite (unit, property-based fuzzing, invariant tests, and lifecycle simulations) ensuring mathematical safety.",
        proofLabel: "Test Docs on Request"
      },
      {
        text: "Architected isolated backend and bitfield access-control systems with React, Vite, tRPC, Supabase, PostgreSQL, and Firebase.",
        proofLabel: "Full-Stack Architecture"
      }
    ],
    prototypeNote: "Earlier prototype work: Built 'CelestialE' — an interactive luxury RWA tokenization frontend featuring Three.js/GSAP scroll animations and Firebase/Supabase authentication that served as the architectural testbed for Sovriigne.",
    techStack: ["Solidity", "Foundry", "Slither", "ERC-1155", "ERC-2535 Diamond", "Polygon Amoy", "tRPC", "PostgreSQL", "Supabase"],
    links: [
      { label: "Case Study & Architecture Docs (On Request)", url: "mailto:shewalepranav66@gmail.com?subject=Sovriigne%20RWA%20Case%20Study%20Request" }
    ]
  },
  {
    id: "bynocs-eyetwin",
    title: "Bynocs (Kanohi Eye Pvt. Ltd.) — Simulation Engineering",
    role: "Simulation & Computational Modeling Intern",
    company: "Bynocs (Kanohi Eye)",
    location: "Mumbai, India",
    period: "Internship",
    type: "work",
    categoryLabel: "Simulation Engineering",
    oneLineSummary: "Computational finite element analysis (FEA) in FEBio, parametric mesh optimization in Python (bpy), and optical ray-tracing simulations.",
    bulletPoints: [
      {
        text: "Configured boundary conditions, material properties, and bulk modulus matrices for corneal and lens tensile strength finite element analysis (FEA) under intraocular pressure in FEBio.",
        proofLabel: "FEBio Simulation Demo",
        proofUrl: "/bynocs/FEBio_adding actual physical constraints to lens.mp4"
      },
      {
        text: "Engineered algorithmic optical ray-tracing pipelines using Snell's Law through non-homogeneous refractive media with dynamic flux-based aperture dilation.",
        proofLabel: "Flux Reflex Demo",
        proofUrl: "/bynocs/Pupilary_dilation using flux method.mp4"
      },
      {
        text: "Diagnosed 3D geometric mesh fragmentation issues via Python (bpy) in Blender, restructuring topology into continuous manifold meshes for clean volumetric data mapping.",
        proofLabel: "Blender Technical Doc",
        proofUrl: "https://docs.google.com/document/d/1Kb2ZR_XcYIeRXP0kfrITNRmSPv4MB_mZFTXyNKCwJz0/edit?usp=sharing"
      },
      {
        text: "Synthesized multi-source computational models into a unified technical specification in LaTeX for cross-team Three.js/WebGL deployment.",
        proofLabel: "Technical Spec"
      }
    ],
    media: [
      {
        type: 'video',
        src: '/bynocs/FEBio_adding actual physical constraints to lens.mp4',
        title: 'FEBio Lens Physical Constraints FEA',
        caption: 'FEBio finite element analysis demonstrating physical constraint and tensile parameter testing on anatomical lens geometry.'
      },
      {
        type: 'video',
        src: '/bynocs/Pupilary_dilation using flux method.mp4',
        title: 'Pupillary Dilation via Flux Method',
        caption: 'Simulated pupillary light reflex and optical dilation responses calculated through geometric flux distribution.'
      },
      {
        type: 'video',
        src: '/bynocs/Pupilary_dilation_and_constriction.mp4',
        title: 'Pupillary Constriction & Dilation Cycle',
        caption: 'Real-time anatomical constriction/dilation cycle simulation for digital twin inspection.'
      }
    ],
    techStack: ["FEBio FEA", "Python (bpy)", "Blender", "Computational Geometry", "Three.js / WebGL", "LaTeX"],
    links: [
      { label: "Bynocs Technical Modeling Doc", url: "https://docs.google.com/document/d/1Kb2ZR_XcYIeRXP0kfrITNRmSPv4MB_mZFTXyNKCwJz0/edit?usp=sharing", isExternalDoc: true },
      { label: "FEBio FEA Demo Video", url: "/bynocs/FEBio_adding actual physical constraints to lens.mp4" }
    ]
  },
  {
    id: "hackathons-competitions",
    title: "Hackathons, CTFs & Technical Competitions",
    role: "Independent Competitor & Systems Builder",
    company: "SIH · ETHGlobal · picoCTF · Syrus",
    location: "Mumbai & Global Arenas",
    period: "2024 — 2026",
    type: "competition",
    categoryLabel: "Competitive Engineering",
    oneLineSummary: "Smart India Hackathon final solutions, RWA protocol designs, and cryptographic CTF challenges.",
    bulletPoints: [
      {
        text: "Smart India Hackathon (SIH) — Krishi Niti: Architected decentralized agricultural trade and WhatsApp-based conversational onboarding for farmers.",
        proofLabel: "Deployed App",
        proofUrl: "https://krishi-niti-theta.vercel.app/"
      },
      {
        text: "ETHGlobal Mumbai: Designed fractional Real-World Asset (RWA) tokenization protocol proposal with on-chain regulatory compliance.",
        proofLabel: "Protocol Design"
      },
      {
        text: "picoCTF Arena: Cryptanalysis and penetration testing challenges focused on RSA mathematical vulnerabilities and modular arithmetic attacks.",
        proofLabel: "picoCTF Profile",
        proofUrl: "https://github.com/prze8969"
      },
      {
        text: "Competitive Algorithmic Problem Solving: Advanced data structure implementations, graph theory, and dynamic programming under strict time constraints.",
        proofLabel: "Algorithmic Repos"
      }
    ],
    techStack: ["Solidity", "Next.js", "WhatsApp API", "RSA Cryptanalysis", "Java", "Python", "Algorithms"],
    links: [
      { label: "Krishi Niti Live Deployment", url: "https://krishi-niti-theta.vercel.app/" },
      { label: "Krishi Niti GitHub Repo", url: "https://github.com/prze8969/TeamNeuroBytes" }
    ]
  }
];

export const PROJECTS: ProjectItem[] = [
  // HERO & FLAGSHIP PROJECTS (Top Web3, Security & Systems)
  {
    id: "krishi-niti",
    title: "Krishi Niti (AgriTrace)",
    tagline: "Decentralized Agricultural Supply Chain & Direct Marketplace",
    category: "web3-systems",
    oneLineSummary: "Blockchain-backed agricultural supply chain tracking crop provenance and connecting farmers directly to buyers via WhatsApp.",
    description: "Built for Smart India Hackathon (SIH). A crop supply chain and trading platform that lets farmers sell crops at transparent fair pricing, eliminate predatory middlemen, and verify payment settlements securely with full technical documentation.",
    highlights: [
      "WhatsApp-based conversational crop listing interface designed for zero-friction rural onboarding.",
      "Production dashboard built with Next.js, Tailwind CSS, and shadcn/ui.",
      "High-contrast, robust UI structured specifically for low-literacy users on budget devices in bright direct sunlight.",
      "Blockchain-backed tracking guarantees tamper-proof trade records and settlement verification."
    ],
    techStack: ["Next.js", "Solidity", "Tailwind CSS", "shadcn/ui", "WhatsApp API", "TypeScript"],
    visualPreview: {
      type: "image",
      src: "/krishi_niti/Krishiniti-presentation.pdf",
      title: "Krishi Niti Technical Presentation",
      badgeText: "SIH Technical Overview PDF"
    },
    links: {
      live: "https://krishi-niti-theta.vercel.app/",
      github: "https://github.com/prze8969/TeamNeuroBytes",
      pdf: "/krishi_niti/Krishiniti-presentation.pdf"
    }
  },
  {
    id: "geoptimer",
    title: "GEOptimer",
    tagline: "Geo-Location Based Search & Performance Ranking Engine",
    category: "web3-systems",
    oneLineSummary: "AI-assisted GEO-based ranking engine analyzing local search visibility, keyword ranking metrics, and business visibility optimization.",
    description: "Built during Hack-AI-Thon. GEOptimer analyzes and optimizes local geographic visibility for digital businesses, parsing search footprints and localized ranking factors with real-time analytics.",
    highlights: [
      "Built with high-performance responsive web stack and interactive analytics dashboard.",
      "Provides granular visibility scoring based on geo-coordinates and localized query rankings.",
      "Deployed and verified live on Vercel with open-source GitHub repository."
    ],
    techStack: ["React", "Next.js", "Vercel", "Tailwind CSS", "Geocoding APIs", "TypeScript"],
    visualPreview: {
      type: "badge",
      badgeText: "Live Web App Deployed"
    },
    links: {
      live: "https://ge-optimer-fork-sepia.vercel.app/",
      github: "https://github.com/prze8969/GEOptimer-Hack-AI-Thon-"
    }
  },
  {
    id: "chronicles",
    title: "Chronicles",
    tagline: "Offline-First Privacy RPG Daily Journal Android App",
    category: "web3-systems",
    oneLineSummary: "Native Android RPG daily diary converting habits and journal entries into quests, XP, and character sheets with zero tracking.",
    description: "Native Android application combining private journaling with gamified RPG progression (quests, XP, levels, character sheet, achievements, habits, inventory, stats, and local backup). Designed for Google Play Store release.",
    statusNote: "In active development — private repository; architecture spec on request",
    highlights: [
      "Modern native stack: Kotlin, Jetpack Compose, Material 3, Room database, DataStore, and MVVM architecture.",
      "Strict privacy: 100% offline-first, no account required, no analytics, no external servers.",
      "Rich local persistence with encrypted export/backup capabilities."
    ],
    techStack: ["Kotlin", "Jetpack Compose", "Material 3", "Room DB", "Coroutines/Flow", "MVVM"],
    links: {
      caseStudyRequest: true
    }
  },
  {
    id: "virtual-nas",
    title: "Sanctuary Vault (Virtual NAS)",
    tagline: "Personal Multi-Device Backup & Archival Engine",
    category: "web3-systems",
    oneLineSummary: "Distributed personal storage scraping Android devices, syncing to a 4TB Seagate drive with cryptographic SHA-256 validation.",
    description: "Personal file backup and archival architecture linking multiple Android devices to a central 4TB external Seagate storage system with cryptographic validation and a web viewer.",
    statusNote: "Private internal infrastructure — architecture spec on request",
    highlights: [
      "Android companion client scans and queues photo/document assets.",
      "Laptop host service automatically detects 4TB Seagate drive mount and runs checksummed batch ingestion.",
      "Stores SHA-256 hashes for bit-rot detection and cross-device integrity verification."
    ],
    techStack: ["Python", "Android SDK", "FastAPI", "RAID", "SHA-256", "Linux"],
    links: {
      caseStudyRequest: true
    }
  },

  // OTHER EXPERIMENTS & UTILITIES TAB (Secondary)
  {
    id: "mybooks",
    title: "MyBooks Library",
    tagline: "API-Driven Universal Digital Bookshelf & Reading Hub",
    category: "experiments",
    oneLineSummary: "Digital library querying Google Books APIs with real-time search, catalog management, and personal collection tracking.",
    description: "Built for a fast-paced hackathon. Integrates Google Books APIs to provide search, volume metadata inspection, personalized bookshelves, and clean reading progress management.",
    highlights: [
      "Seamless integration with Google Books REST API for live metadata retrieval.",
      "Interactive UI with responsive catalog filtering and volume inspection.",
      "Live deployment hosted on Render with public GitHub source code."
    ],
    techStack: ["Node.js", "Express", "Google Books API", "REST", "JavaScript", "HTML/CSS"],
    visualPreview: {
      type: "badge",
      badgeText: "Live Service on Render"
    },
    links: {
      live: "https://mybooks-hackathon1.onrender.com/",
      github: "https://github.com/prze8969/MyBooks_hackathon1"
    }
  },
  {
    id: "pdf-to-excel",
    title: "PDF to Excel Converter",
    tagline: "Automated Non-Selectable Table Extraction Utility",
    category: "experiments",
    oneLineSummary: "Python utility extracting complex non-selectable tabular data from raw PDFs into structured Excel sheets.",
    description: "Automated document data processing pipeline designed to parse locked and non-selectable PDF tables, reconstructing matrix layouts and exporting clean, structured XLSX spreadsheets.",
    highlights: [
      "Extracts structured rows/columns from locked PDF reports without manual re-typing.",
      "Preserves tabular alignments and numeric data types for immediate spreadsheet analysis.",
      "Open-source Python utility hosted on GitHub."
    ],
    techStack: ["Python", "Pandas", "pdfplumber", "OpenPyXL"],
    visualPreview: {
      type: "badge",
      badgeText: "Open-Source Python Tool"
    },
    links: {
      github: "https://github.com/prze8969/pdf--excel-sheet"
    }
  },
  {
    id: "maze-solver-java",
    title: "Java Maze Solver",
    tagline: "Algorithmic Graph Traversal & Pathfinding Benchmark",
    category: "experiments",
    oneLineSummary: "Algorithmic graph solver exploring recursive backtracking, DFS, and BFS pathfinding on arbitrary labyrinth topologies.",
    description: "Interactive Java application implementing classic graph traversal and maze generation algorithms, visualizing optimal path resolution and branch exploration in real time.",
    highlights: [
      "Implements Depth-First Search (DFS) with backtracking and Breadth-First Search (BFS) shortest-path finding.",
      "Robust object-oriented architecture in pure Java.",
      "Public source code on GitHub."
    ],
    techStack: ["Java", "Graph Theory", "DFS / BFS", "Backtracking"],
    visualPreview: {
      type: "badge",
      badgeText: "Algorithmic Engine"
    },
    links: {
      github: "https://github.com/prze8969/maze-solver-java"
    }
  },
  {
    id: "hospital-management-java",
    title: "Hospital Management System",
    tagline: "Relational Desktop Management Architecture",
    category: "experiments",
    oneLineSummary: "Java desktop management system handling patient admissions, doctor scheduling, and medical records.",
    description: "Desktop management application in Java structuring patient registries, appointment scheduling, billing records, and doctor department assignments.",
    highlights: [
      "Structured relational record management with transactional CRUD operations.",
      "Role-based access control separating administrative, medical, and billing views.",
      "Available open-source on GitHub."
    ],
    techStack: ["Java", "JDBC / SQL", "System Design"],
    visualPreview: {
      type: "badge",
      badgeText: "Java System Architecture"
    },
    links: {
      github: "https://github.com/prze8969/Hospital-Management-System"
    }
  },
  {
    id: "redstone-alu",
    title: "Discrete Logic 8-Bit ALU",
    tagline: "Discrete 8-Bit Arithmetic Logic Unit from Logic Gates",
    category: "experiments",
    oneLineSummary: "Working 8-bit Arithmetic Logic Unit built entirely from discrete logic gates, repeaters, and latches in Minecraft.",
    description: "Built a functional 8-bit Arithmetic Logic Unit (ALU) entirely from discrete logic gates inside Minecraft to demonstrate hardware-level digital computation principles.",
    statusNote: "Schematics available on request",
    highlights: [
      "Implements binary addition, subtraction, AND, OR, and XOR operations.",
      "Built full-adder and carry-lookahead circuits using NOR/NAND gate primitives.",
      "Includes an interactive control bus for operand inputs."
    ],
    techStack: ["Computer Architecture", "Boolean Algebra", "Logic Design"],
    links: {
      caseStudyRequest: true
    }
  }
];

export const SKILL_CONSTELLATIONS: SkillNode[] = [
  {
    id: "smart-contract-audit",
    name: "Smart Contract Auditing",
    category: "auditing",
    proofPoint: {
      label: "Applied in: Sovriigne RWA Audit",
      targetAnchor: "quests"
    },
    perks: ["Foundry Fuzzing", "Slither Static Analysis", "ERC-2535 Diamond Proxy", "Reentrancy & Logic Guards", "Invariant Testing"],
    description: "Rigorous auditing of Solidity protocols, gas optimization, proxy security, multi-tranche yield mechanisms, and mathematical spec verification.",
    x: 25,
    y: 20
  },
  {
    id: "web3-standards",
    name: "Web3 & Token Standards",
    category: "web3",
    proofPoint: {
      label: "Applied in: Sovriigne & SIH AgriTrace",
      targetAnchor: "quests"
    },
    perks: ["ERC-1155 Multi-Token", "ERC-2535 Diamond Proxy", "ERC-20 & ERC-721", "Polygon Amoy", "Sanctions & Whitelisting"],
    description: "Architecture of permissioned tokens, fractional real-world asset security vaults, and upgradeable multi-facet diamond proxies.",
    x: 50,
    y: 15
  },
  {
    id: "systems-linux",
    name: "Systems & Linux",
    category: "systems",
    proofPoint: {
      label: "Applied in: Alpine Setup & Hardware Diagnostics",
      targetAnchor: "attributes"
    },
    perks: ["Alpine Linux Setup", "RAID Storage Config", "Hardware Diagnostics", "Kernel & Driver Patches", "POSIX Shell Scripting"],
    description: "Low-level system administration, lightweight Linux environments, fault-tolerant RAID storage, and hardware troubleshooting.",
    x: 75,
    y: 22
  },
  {
    id: "fullstack-arch",
    name: "Full-Stack Development",
    category: "web3",
    proofPoint: {
      label: "Applied in: Krishi Niti & GEOptimer",
      url: "https://krishi-niti-theta.vercel.app/"
    },
    perks: ["Next.js & React", "tRPC End-to-End Types", "PostgreSQL & Supabase", "Tailwind CSS", "Vercel / Render Deploy"],
    description: "High-performance web architecture with type-safe APIs, reactive relational databases, and high-contrast responsive layouts.",
    x: 35,
    y: 50
  },
  {
    id: "graphics-simulation",
    name: "3D Graphics & Simulation",
    category: "graphics",
    proofPoint: {
      label: "Applied in: Bynocs EyeTwin & FEBio FEA",
      targetAnchor: "quests"
    },
    perks: ["Blender Python (bpy)", "FEBio Finite Elements", "Snell's Law Optics", "Three.js / WebGL", "Pupillary Light Reflex"],
    description: "Parametric anatomical 3D modeling, corneal biomechanical tensile testing in FEBio, and optical ray tracing.",
    x: 65,
    y: 48
  },
  {
    id: "cybersecurity-crypto",
    name: "Cybersecurity & Cryptography",
    category: "auditing",
    proofPoint: {
      label: "Applied in: picoCTF & Bitfield RBAC",
      targetAnchor: "quests"
    },
    perks: ["RSA Mathematical Analysis", "picoCTF Exploits", "Bitfield RBAC Systems", "Memory Safety", "Threat Modeling"],
    description: "Cryptographic vulnerability assessment, bitfield permission hierarchies, and protocol attack surface analysis.",
    x: 20,
    y: 75
  },
  {
    id: "algorithms-speed",
    name: "Algorithms & Data Structures",
    category: "intelligence",
    proofPoint: {
      label: "Applied in: Java Maze Solver & Coursework",
      url: "https://github.com/prze8969/maze-solver-java"
    },
    perks: ["Java & Python", "Graph Theory (DFS/BFS)", "Dynamic Programming", "Asymptotic Optimization", "Discrete Mathematics"],
    description: "Strong algorithmic foundations, graph traversal algorithms, discrete math, and continuous high-performance academic rigor.",
    x: 50,
    y: 80
  },
  {
    id: "document-automation",
    name: "Data Pipelines & Automation",
    category: "systems",
    proofPoint: {
      label: "Applied in: PDF to Excel Engine",
      url: "https://github.com/prze8969/pdf--excel-sheet"
    },
    perks: ["Python Scripting", "Table Matrix Extraction", "OpenPyXL / Pandas", "Batch Processing", "REST API Ingestion"],
    description: "Automated document data processing, non-selectable table parsing, and API-driven data integration.",
    x: 80,
    y: 75
  }
];

