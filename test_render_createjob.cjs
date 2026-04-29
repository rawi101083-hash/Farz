const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { build } = require('esbuild');
const path = require('path');

build({
  entryPoints: ['src/components/CreateJob.tsx'],
  bundle: true,
  outfile: 'temp_out_render.cjs',
  external: ['react', 'react-dom', 'lucide-react', 'motion/react', 'recharts', 'pdfjs-dist', '../lib/supabaseClient', '../Shared'],
  format: 'cjs',
  loader: { '.tsx': 'tsx', '.ts': 'ts' }
}).then(() => {
  // Mock Shared mock module
  const Module = require('module');
  const originalRequire = Module.prototype.require;
  Module.prototype.require = function(modName) {
    if (modName === '../Shared') {
      return {
        LogoIcon: () => React.createElement('div', null, 'LogoIcon'),
      };
    }
    if (modName === '../lib/supabaseClient') {
       return { supabase: {} };
    }
    return originalRequire.apply(this, arguments);
  };

  try {
    const CreateJob = require('./temp_out_render.cjs').default || require('./temp_out_render.cjs');
    const props = {
      isOpen: true,
      onClose: () => {},
      onSave: () => {},
      userProfile: { entityType: 'company' },
      isDarkMode: false,
    };
    const html = ReactDOMServer.renderToStaticMarkup(React.createElement(CreateJob.CreateJob || CreateJob, props));
    console.log("Rendered successfully. Length:", html.length);
  } catch(e) {
    console.error("REACT RENDER ERROR:", e);
  }
}).catch(e => {
  console.error("BUILD ERROR:", e);
});
