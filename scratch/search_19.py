import os

settings_file = r"c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\src\views\DealsView.vue"

with open(settings_file, "r", encoding="utf-8") as f:
    content = f.read()

# Find any references to 19 that are not inside strings
import re
matches = re.finditer(r"\b19\b", content)
for m in matches:
    start = max(0, m.start() - 50)
    end = min(len(content), m.end() + 50)
    print(f"Found at index {m.start()}: ... {content[start:end].strip()} ...")
