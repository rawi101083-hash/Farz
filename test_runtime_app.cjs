const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { build } = require('esbuild');

build({
  entryPoints: ['src/App.tsx'],
  bundle: true,
  outfile: 'temp_out_app.js',
  external: ['react', 'react-dom', 'lucide-react', 'motion/react', 'recharts', 'pdfjs-dist', './lib/supabaseClient', './components/CreateJob', './components/Dashboard', './components/JobApplication', './components/ApplicantDetails', './components/SuperAdmin', './Shared'],
  format: 'cjs',
  loader: { '.tsx': 'tsx', '.ts': 'ts' }
}).then(() => {
  console.log("Esbuild App completed. Trying to require...");
  try {
    const Component = require('./temp_out_app.js').default || require('./temp_out_app.js');
    console.log("Successfully required App:", typeof Component);
  } catch(e) {
    console.error("RUNTIME ERROR:", e);
  }
}).catch(e => {
  console.error("BUILD ERROR:", e);
});
