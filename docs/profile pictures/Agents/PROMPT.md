# Malaysian Agent Profile Picture Generation Prompt

## Overview
This folder contains AI-generated professional headshot profile pictures of diverse Malaysian personas, intended for use as agent/user avatars in the RakanSales CRM application.

## Style Reference
- **Look**: LinkedIn-style professional headshots
- **Lighting**: Clean studio lighting, even exposure
- **Backgrounds**: Neutral — light grey, soft white, or warm gradient
- **Crop**: Head and shoulders (portrait, roughly 1:1 square ratio)
- **Attire**: Business casual to business formal
- **Ethnicities**: Diverse Malaysian — Malay, Chinese, Indian

---

## Generation Prompt (3×3 Grid — Single Image)

Use this prompt to regenerate or create new batches of 9 profile pictures at once:

```
A 3x3 grid of 9 professional headshot portrait photos of Malaysian people, evenly spaced with thin white dividers between each cell. Each cell contains ONE person's professional headshot cropped to head and shoulders.

Diversity of subjects:
- Cell 1 (top-left): Young Malay male, late 20s, neat black hair, wearing a navy blue shirt, confident smile, neutral light grey background
- Cell 2 (top-center): Chinese Malaysian female, early 30s, straight black hair with light highlights, wearing a white blouse, warm smile, soft gradient light background
- Cell 3 (top-right): Indian Malaysian male, mid 30s, short dark hair, well-trimmed beard, wearing a charcoal grey blazer, professional look, light warm background
- Cell 4 (middle-left): Malay female, late 20s, wearing a pastel pink hijab, bright eyes, warm smile, wearing a teal blouse, clean white background
- Cell 5 (middle-center): Chinese Malaysian male, early 40s, glasses, short salt-and-pepper hair, wearing a light blue business shirt, neutral background
- Cell 6 (middle-right): Indian Malaysian female, late 20s, wavy dark hair, wearing a maroon blazer, confident professional expression, soft grey background
- Cell 7 (bottom-left): Malay male, late 30s, short neat hair, wearing a white formal shirt with a dark tie, slight smile, light gradient background
- Cell 8 (bottom-center): Chinese Malaysian female, mid 30s, shoulder-length hair, wearing a dark green blazer, bright smile, neutral grey background
- Cell 9 (bottom-right): Malay female, early 30s, wearing a cream-colored hijab, professional smile, wearing a soft coral blouse, clean light background

Style: Professional LinkedIn-style headshots, studio lighting, high quality photography, clean neutral backgrounds per cell, each subject well-lit and sharp, photorealistic. The grid is exactly 3 columns by 3 rows, each cell same size. No text labels on the image.
```

---

## Crop Instructions
After generating the 1024x1024 grid image, use the following Python snippet to auto-crop and save the 9 individual profile pictures:

```python
from PIL import Image
import os

grid_path = "path/to/grid_image.png"
output_dir = "path/to/Agents/"

names = [
    "agent_01_malay_male_young",
    "agent_02_chinese_female_young",
    "agent_03_indian_male_mid",
    "agent_04_malay_female_hijab_pink",
    "agent_05_chinese_male_glasses",
    "agent_06_indian_female_young",
    "agent_07_malay_male_formal",
    "agent_08_chinese_female_mid",
    "agent_09_malay_female_hijab_cream",
]

img = Image.open(grid_path)
w, h = img.size
cell_w = w // 3
cell_h = h // 3

for idx, name in enumerate(names):
    row = idx // 3
    col = idx % 3
    left = col * cell_w
    upper = row * cell_h
    right = left + cell_w
    lower = upper + cell_h
    cell = img.crop((left, upper, right, lower))
    cell.save(os.path.join(output_dir, f"{name}.png"), "PNG")

print("Done!")
```

---

## Files in this Folder

| File | Description |
|------|-------------|
| `agent_01_malay_male_young.png` | Young Malay male, navy blue shirt, grey bg |
| `agent_02_chinese_female_young.png` | Chinese Malaysian female, white blouse, gradient bg |
| `agent_03_indian_male_mid.png` | Indian Malaysian male, grey blazer, warm bg |
| `agent_04_malay_female_hijab_pink.png` | Malay female, pastel pink hijab, teal blouse |
| `agent_05_chinese_male_glasses.png` | Chinese Malaysian male, glasses, light blue shirt |
| `agent_06_indian_female_young.png` | Indian Malaysian female, maroon blazer |
| `agent_07_malay_male_formal.png` | Malay male, white shirt + dark tie |
| `agent_08_chinese_female_mid.png` | Chinese Malaysian female, dark green blazer |
| `agent_09_malay_female_hijab_cream.png` | Malay female, cream hijab, coral blouse |
