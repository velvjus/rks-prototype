import os

views_dir = r"c:\Users\justi\Documents\VeecoTech\Rakansales\Antigravity\RakanSales C4\src\views"
phrases = ["training history", "knowledge base", "training progress", "upload"]

for filename in os.listdir(views_dir):
    if not filename.endswith(".vue"):
        continue
    filepath = os.path.join(views_dir, filename)
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read().lower()
    for phrase in phrases:
        if phrase in content:
            print(f"Found '{phrase}' in {filename}")
