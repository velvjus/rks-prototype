import os
import re

settings_file = r"c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\src\views\DealsView.vue"

with open(settings_file, "r", encoding="utf-8") as f:
    content = f.read()

# Match content inside const deals = ref([ ... ])
match = re.search(r"const deals = ref\(\[(.*?)\]\)", content, re.DOTALL)
if match:
    block = match.group(1)
    # Each deal is surrounded by curly braces {}
    items = re.findall(r"\{\s*(.*?)\s*\}", block, re.DOTALL)
    print(f"Total parsed items in deals: {len(items)}")
    for i, item in enumerate(items):
        title = re.search(r"title:\s*'(.*?)'", item)
        id_val = re.search(r"id:\s*(\d+)", item)
        client = re.search(r"clientName:\s*'(.*?)'", item)
        t_str = title.group(1) if title else "None"
        id_str = id_val.group(1) if id_val else "None"
        c_str = client.group(1) if client else "None"
        print(f"Deal {i+1}: ID={id_str}, Title={t_str}, Client={c_str}")
else:
    print("Could not find const deals = ref([ ... ]) block.")
