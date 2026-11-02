const fs = require('fs');

const files = [
  'src/views/ContactsView.vue',
  'src/views/CompaniesView.vue',
  'src/views/DealsView.vue'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    const c = fs.readFileSync(f, 'utf8');
    const m = c.match(/hover:bg-muted[^\s"'>]*/g);
    console.log(f, Array.from(new Set(m)));
  }
});
