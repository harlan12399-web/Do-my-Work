export interface SampleWorksheet {
  id: string;
  title: string;
  subject: string;
  subtitle: string;
  dataUrl: string;
}

// Function to generate crisp SVG worksheet data URLs with lined paper look
function createSampleWorksheetSvg(title: string, subject: string, questions: string[]): string {
  const width = 800;
  const height = 1050;

  const lines = questions
    .map((q, idx) => {
      const y = 240 + idx * 160;
      return `
        <g transform="translate(60, ${y})">
          <text x="0" y="0" font-family="Georgia, serif" font-size="19" font-weight="bold" fill="#1e293b">${q}</text>
          <!-- Answer line -->
          <text x="0" y="55" font-family="system-ui, sans-serif" font-size="14" fill="#64748b" letter-spacing="1">ANSWER:</text>
          <line x1="85" y1="58" x2="680" y2="58" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="3 3"/>
          <text x="0" y="105" font-family="system-ui, sans-serif" font-size="13" fill="#94a3b8">Working / Steps:</text>
          <line x1="120" y1="108" x2="680" y2="108" stroke="#cbd5e1" stroke-width="1"/>
        </g>
      `;
    })
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="#fcfbf7"/>
    <!-- Subtle margin lines -->
    <line x1="45" y1="0" x2="45" y2="${height}" stroke="#fca5a5" stroke-width="1.5" opacity="0.6"/>
    <!-- Top header rule -->
    <rect x="0" y="0" width="${width}" height="140" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
    
    <text x="60" y="48" font-family="Georgia, serif" font-size="26" font-weight="bold" fill="#0f172a">${title}</text>
    <text x="60" y="78" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#ff7a3d" letter-spacing="2">${subject.toUpperCase()}</text>
    
    <!-- Student Header Fields -->
    <text x="60" y="115" font-family="system-ui, sans-serif" font-size="13" fill="#64748b">Student Name: _______________________</text>
    <text x="420" y="115" font-family="system-ui, sans-serif" font-size="13" fill="#64748b">Date: _________________</text>
    <text x="660" y="115" font-family="system-ui, sans-serif" font-size="13" fill="#64748b">Score: ___ / 100</text>

    <!-- Watermark / Seal -->
    <circle cx="710" cy="65" r="32" fill="none" stroke="#e2e8f0" stroke-width="1.5"/>
    <text x="710" y="62" font-family="Georgia, serif" font-size="9" text-anchor="middle" fill="#94a3b8" letter-spacing="1">ACADEMIC</text>
    <text x="710" y="74" font-family="Georgia, serif" font-size="9" text-anchor="middle" fill="#94a3b8" letter-spacing="1">WORKSHEET</text>

    ${lines}

    <!-- Footer -->
    <line x1="60" y1="990" x2="740" y2="990" stroke="#e2e8f0" stroke-width="1"/>
    <text x="60" y="1015" font-family="system-ui, sans-serif" font-size="11" fill="#94a3b8">Do My Work · AI Academic Verification · Page 1 of 1</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_WORKSHEETS: SampleWorksheet[] = [
  {
    id: 'math-algebra',
    title: 'Algebra II: Quadratics & Linear Systems',
    subject: 'Mathematics',
    subtitle: 'Equations, Factoring & Roots',
    dataUrl: createSampleWorksheetSvg(
      'Algebra II — Quadratic Equations & Systems',
      'Mathematics Dept · Period 3',
      [
        '1. Solve for x: 3x² - 12x + 9 = 0 by factoring.',
        '2. Find the vertex and axis of symmetry for f(x) = 2(x - 4)² + 7.',
        '3. Solve the simultaneous system: 2x + 3y = 19 and 5x - y = 5.',
        '4. Evaluate log₂(64) + log₃(81) - ln(e⁵).'
      ]
    ),
  },
  {
    id: 'science-biology',
    title: 'Cellular Respiration & Genetics',
    subject: 'Biology',
    subtitle: 'Organelles, ATP Cycle & Punnett Squares',
    dataUrl: createSampleWorksheetSvg(
      'Cellular Biology & Mendelian Genetics',
      'Science Dept · Advanced Biology',
      [
        '1. State the net yield of ATP produced during aerobic cellular respiration per glucose molecule.',
        '2. Identify the organelle responsible for protein synthesis and packaging for export.',
        '3. In pea plants, Tall (T) is dominant to Short (t). Cross two heterozygous parents (Tt x Tt). What is the phenotypic ratio?',
        '4. Explain the primary distinction between transcription and translation during gene expression.'
      ]
    ),
  },
  {
    id: 'history-world',
    title: 'Modern World History: The Industrial Revolution',
    subject: 'Social Studies',
    subtitle: 'Urbanization, Steam Power & Labor Movements',
    dataUrl: createSampleWorksheetSvg(
      'Modern World History — Industrial Transformation',
      'Humanities Dept · Unit 4 Exam Review',
      [
        '1. Name James Watt’s key technological innovation in 1776 and describe how it transformed factory production.',
        '2. Define the Enclosure Acts in Britain and their direct effect on rural-to-urban migration.',
        '3. Which primary 19th-century legislative acts first regulated child labor hours in British textile mills?',
        '4. Compare and contrast Adam Smith’s free-market capitalism with Karl Marx’s critique in Das Kapital.'
      ]
    ),
  },
];
