const React = require('react');
const ReactDOMServer = require('react-dom/server');

// Using Vite/Esbuild to transpile TSX to JS on the fly is tricky.
// Let's use `esbuild` directly to bundle CreateJob.tsx and try to catch any obvious errors.
const { build } = require('esbuild');

build({
  entryPoints: ['src/components/CreateJob.tsx'],
  bundle: true,
  outfile: 'temp_out.js',
  external: ['react', 'react-dom', 'lucide-react', 'motion/react', 'recharts', 'pdfjs-dist', '../lib/supabaseClient'],
  format: 'cjs',
  loader: { '.tsx': 'tsx', '.ts': 'ts' }
}).then(() => {
  console.log("Esbuild completed. Trying to require...");
  try {
    const Component = require('./temp_out.js').default || require('./temp_out.js');
    console.log("Successfully required CreateJob:", typeof Component);
  } catch(e) {
    console.error("RUNTIME ERROR:", e);
  }
}).catch(e => {
  console.error("BUILD ERROR:", e);
});
