const fs = require('fs');
const filePath = 'c:\\Users\\justi\\Documents\\VeecoTech\\Rakansales\\Antigravity\\RakanSales C4\\src\\views\\DealsView.vue';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update changePreviewDealOwner signature and append handleOwnerChange
content = content.replace(
  'function changePreviewDealOwner(newOwnerName) {',
  `function changePreviewDealOwner(newOwnerName: string) {`
);

const handleOwnerChangeDef = `
function handleOwnerChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  if (target) {
    changePreviewDealOwner(target.value);
  }
}
`;

// Insert handleOwnerChange right after changePreviewDealOwner
content = content.replace(
  '    selectedDealForPreview.value.avatar = getAgentAvatar(newOwnerName);\r\n  }\r\n}',
  '    selectedDealForPreview.value.avatar = getAgentAvatar(newOwnerName);\r\n  }\r\n}\n' + handleOwnerChangeDef
);
content = content.replace(
  '    selectedDealForPreview.value.avatar = getAgentAvatar(newOwnerName);\n  }\n}',
  '    selectedDealForPreview.value.avatar = getAgentAvatar(newOwnerName);\n  }\n}\n' + handleOwnerChangeDef
);

// 2. Update select tag in template to use handleOwnerChange
content = content.replace(
  '@change="changePreviewDealOwner($event.target.value)"',
  '@change="handleOwnerChange"'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Types patched successfully!");
