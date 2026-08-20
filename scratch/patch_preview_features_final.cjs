const fs = require('fs');
const filePath = 'c:\\Users\\justi\\Documents\\VeecoTech\\Rakansales\\Antigravity\\RakanSales C4\\src\\views\\DealsView.vue';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add computed stage index to help color stages up to current index
const computedIndexDefinition = `
const currentStageIndex = computed(() => {
  if (!selectedDealForPreview.value) return -1;
  const stage = selectedDealForPreview.value.stage;
  if (stage === 'New') return 0;
  if (stage === 'Acknowledged') return 1;
  if (stage === 'Qualifying') return 2;
  if (stage === 'Proposal / Quotation') return 3;
  if (stage === 'Follow Up') return 4;
  if (stage === 'Lost') return 4;
  return -1;
});
`;

// Insert currentStageIndex right before markPreviewDealWon
content = content.replace(
  'function markPreviewDealWon() {',
  computedIndexDefinition + '\nfunction markPreviewDealWon() {'
);

// 2. Add changePreviewDealOwner function after markPreviewDealLost
const changeOwnerFunction = `
function changePreviewDealOwner(newOwnerName) {
  if (selectedDealForPreview.value) {
    selectedDealForPreview.value.owner = newOwnerName;
    selectedDealForPreview.value.avatar = getAgentAvatar(newOwnerName);
  }
}
`;

content = content.replace(
  'function markPreviewDealLost() {\r\n  if (selectedDealForPreview.value) {\r\n    selectedDealForPreview.value.stage = \'Lost\'\r\n  }\r\n}',
  'function markPreviewDealLost() {\r\n  if (selectedDealForPreview.value) {\r\n    selectedDealForPreview.value.stage = \'Lost\'\r\n  }\r\n}\n' + changeOwnerFunction
);

content = content.replace(
  'function markPreviewDealLost() {\n  if (selectedDealForPreview.value) {\n    selectedDealForPreview.value.stage = \'Lost\'\n  }\n}',
  'function markPreviewDealLost() {\n  if (selectedDealForPreview.value) {\n    selectedDealForPreview.value.stage = \'Lost\'\n  }\n}\n' + changeOwnerFunction
);

// 3. Update Action Buttons in header (use filled green and red buttons)
// Target button Won:
content = content.replace(
  `                <button
                  @click="markPreviewDealWon"
                  :class="[
                    'inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg border transition-all duration-150 cursor-pointer',
                    selectedDealForPreview.stage === 'Follow Up'
                      ? 'bg-[#23B750] text-white border-[#23B750] shadow-sm'
                      : 'bg-white text-[#23B750] border-[#23B750]/40 hover:bg-[#23B750]/5 hover:border-[#23B750]'
                  ]"
                >`,
  `                <button
                  @click="markPreviewDealWon"
                  :class="[
                    'inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg border transition-all duration-150 cursor-pointer shadow-sm',
                    selectedDealForPreview.stage === 'Follow Up'
                      ? 'bg-[#23B750] text-white border-[#23B750] opacity-80 cursor-not-allowed'
                      : 'bg-[#23B750] text-white border-[#23B750] hover:bg-[#1a8c3d] hover:border-[#1a8c3d]'
                  ]"
                  :disabled="selectedDealForPreview.stage === 'Follow Up'"
                >`
);

content = content.replace(
  `                <button\r
                  @click="markPreviewDealWon"\r
                  :class="[\r
                    'inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg border transition-all duration-150 cursor-pointer',\r
                    selectedDealForPreview.stage === 'Follow Up'\r
                      ? 'bg-[#23B750] text-white border-[#23B750] shadow-sm'\r
                      : 'bg-white text-[#23B750] border-[#23B750]/40 hover:bg-[#23B750]/5 hover:border-[#23B750]'\r
                  ]"\r
                >`,
  `                <button
                  @click="markPreviewDealWon"
                  :class="[
                    'inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg border transition-all duration-150 cursor-pointer shadow-sm',
                    selectedDealForPreview.stage === 'Follow Up'
                      ? 'bg-[#23B750] text-white border-[#23B750] opacity-80 cursor-not-allowed'
                      : 'bg-[#23B750] text-white border-[#23B750] hover:bg-[#1a8c3d] hover:border-[#1a8c3d]'
                  ]"
                  :disabled="selectedDealForPreview.stage === 'Follow Up'"
                >`
);

// Also change label text: "Mark as Won" -> "Won" / "Mark as Won"
content = content.replace(
  '                  <Trophy class="w-3.5 h-3.5" />\n                  Mark as Won',
  '                  <Trophy class="w-3.5 h-3.5" />\n                  {{ selectedDealForPreview.stage === \'Follow Up\' ? \'Won\' : \'Mark as Won\' }}'
);
content = content.replace(
  '                  <Trophy class="w-3.5 h-3.5" />\r\n                  Mark as Won',
  '                  <Trophy class="w-3.5 h-3.5" />\n                  {{ selectedDealForPreview.stage === \'Follow Up\' ? \'Won\' : \'Mark as Won\' }}'
);

// Target button Lost:
content = content.replace(
  `                <button
                  @click="markPreviewDealLost"
                  :class="[
                    'inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg border transition-all duration-150 cursor-pointer',
                    selectedDealForPreview.stage === 'Lost'
                      ? 'bg-red-500 text-white border-red-500 shadow-sm'
                      : 'bg-white text-red-500 border-red-300 hover:bg-red-50 hover:border-red-400'
                  ]"
                >`,
  `                <button
                  @click="markPreviewDealLost"
                  :class="[
                    'inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg border transition-all duration-150 cursor-pointer shadow-sm',
                    selectedDealForPreview.stage === 'Lost'
                      ? 'bg-red-500 text-white border-red-500 opacity-80 cursor-not-allowed'
                      : 'bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600'
                  ]"
                  :disabled="selectedDealForPreview.stage === 'Lost'"
                >`
);

content = content.replace(
  `                <button\r
                  @click="markPreviewDealLost"\r
                  :class="[\r
                    'inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg border transition-all duration-150 cursor-pointer',\r
                    selectedDealForPreview.stage === 'Lost'\r
                      ? 'bg-red-500 text-white border-red-500 shadow-sm'\r
                      : 'bg-white text-red-500 border-red-300 hover:bg-red-50 hover:border-red-400'\r
                  ]"\r
                >`,
  `                <button
                  @click="markPreviewDealLost"
                  :class="[
                    'inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg border transition-all duration-150 cursor-pointer shadow-sm',
                    selectedDealForPreview.stage === 'Lost'
                      ? 'bg-red-500 text-white border-red-500 opacity-80 cursor-not-allowed'
                      : 'bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600'
                  ]"
                  :disabled="selectedDealForPreview.stage === 'Lost'"
                >`
);

content = content.replace(
  '                  <XCircle class="w-3.5 h-3.5" />\n                  Mark as Lost',
  '                  <XCircle class="w-3.5 h-3.5" />\n                  {{ selectedDealForPreview.stage === \'Lost\' ? \'Lost\' : \'Mark as Lost\' }}'
);
content = content.replace(
  '                  <XCircle class="w-3.5 h-3.5" />\r\n                  Mark as Lost',
  '                  <XCircle class="w-3.5 h-3.5" />\n                  {{ selectedDealForPreview.stage === \'Lost\' ? \'Lost\' : \'Mark as Lost\' }}'
);

// 4. Update Chevron Progress Bar to correspond to selectedDealForPreview.stage
const chevronsRegex = /<!-- ── CHEVRON PIPELINE BAR ─────────────────────────── -->[\s\S]+?<!-- ── TWO-COLUMN BODY/;
const newChevrons = `<!-- ── CHEVRON PIPELINE BAR ─────────────────────────── -->
          <div class="flex-shrink-0 overflow-x-auto bg-white px-5 pb-3 sm:px-8">
            <div class="flex min-w-[700px] select-none items-stretch gap-0.5">
              <!-- New Deal -->
              <div :class="['clip-chevron min-w-[130px] flex-1 py-1.5 text-center text-[10px] font-bold transition-all duration-200',
                currentStageIndex >= 0 ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700']">
                New Deal / 3days
              </div>
              <!-- Acknowledge -->
              <div :class="['clip-chevron min-w-[110px] flex-1 py-1.5 text-center text-[10px] font-bold transition-all duration-200',
                currentStageIndex >= 1 ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700']">
                Acknowledge
              </div>
              <!-- Qualifying -->
              <div :class="['clip-chevron min-w-[110px] flex-1 py-1.5 text-center text-[10px] font-bold transition-all duration-200',
                currentStageIndex >= 2 ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700']">
                Qualifying
              </div>
              <!-- Follow Up -->
              <div :class="['clip-chevron min-w-[110px] flex-1 py-1.5 text-center text-[10px] font-bold transition-all duration-200',
                currentStageIndex >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500']">
                Follow Up
              </div>
              <!-- Results -->
              <div :class="['clip-chevron min-w-[90px] flex-1 py-1.5 text-center text-[10px] font-bold transition-all duration-200',
                currentStageIndex >= 4 ? (selectedDealForPreview.stage === 'Lost' ? 'bg-red-500 text-white' : 'bg-[#23B750] text-white') : 'bg-gray-200 text-gray-500']">
                Results
              </div>
            </div>
          </div>

          <!-- ── TWO-COLUMN BODY`;

content = content.replace(chevronsRegex, newChevrons);

// 5. Replace plain text Sales Owner with dropdown select
const ownerDivRegex = /<div class="truncate text-xs font-bold text-slate-800">\{\{\s*selectedDealForPreview\.owner\s*\}\}<\/div>/;
const ownerDivReplacement = `<select
                        :value="selectedDealForPreview.owner"
                        @change="changePreviewDealOwner($event.target.value)"
                        class="cursor-pointer border-none bg-transparent p-0 text-xs font-bold text-slate-800 focus:outline-none focus:ring-0 focus:border-none focus:text-[#168638] focus:underline"
                        aria-label="Change sales owner"
                      >
                        <option
                          v-for="agent in uniqueAgents.filter(a => a !== 'Everyone')"
                          :key="agent"
                          :value="agent"
                        >
                          {{ agent }}
                        </option>
                      </select>`;

content = content.replace(ownerDivRegex, ownerDivReplacement);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Patched preview features successfully!");
