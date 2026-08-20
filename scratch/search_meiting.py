import os

settings_file = r"c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\src\views\DealsView.vue"

with open(settings_file, "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "Mei Ting" in line or "Acme Corp" in line:
        print(f"Line {i+1}: {line.strip()}")
