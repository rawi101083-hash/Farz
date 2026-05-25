import * as lightningcss from 'lightningcss';

const css = `
  @layer utilities {
    .box { background: red; }
  }
`;
const { code } = lightningcss.transform({
  filename: 'style.css',
  code: Buffer.from(css),
  targets: { chrome: 80 << 16 }
});
console.log(code.toString());
