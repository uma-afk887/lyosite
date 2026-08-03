#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generate-images.py — génération d'images en lot à partir de docs/image-prompts.csv

Lit le CSV (colonnes: fichier, format, prompt), génère chaque image via une API
image bon marché (défaut : fal.ai FLUX.1 [schnell]), la recadre au format exact
puis l'enregistre en .webp au bon endroit :
    lyophiliser-*.webp -> img/matieres/
    atelier-*.webp     -> img/atelier/
    og-cover.webp      -> img/

Reprise automatique : les fichiers déjà présents sont ignorés (relance sans
re-payer). Coût indicatif pour ~191 images en FLUX schnell : ~0,50 à 0,60 $.

USAGE
-----
    pip install fal-client pillow requests
    export FAL_KEY="votre_cle"            # https://fal.ai/dashboard/keys
    python tools/generate-images.py                 # tout le CSV
    python tools/generate-images.py --only huitre   # filtre sur le nom
    python tools/generate-images.py --limit 3       # test sur 3 images
    python tools/generate-images.py --dry-run       # liste sans générer

Changer de fournisseur : voir la fonction generate_png() plus bas
(Together AI, Replicate, ou ComfyUI local = gratuit).
"""
import argparse
import csv
import io
import os
import re
import sys
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(ROOT, "docs", "image-prompts.csv")

# --- routage fichier -> dossier de destination -----------------------------
def dest_path(fichier):
    # Certaines lignes du CSV donnent déjà un chemin (img/atelier/atelier-1.webp).
    if "/" in fichier:
        return os.path.join(ROOT, fichier)
    if fichier.startswith("lyophiliser-"):
        sub = os.path.join("img", "matieres")
    else:  # og-cover.webp et autres à la racine img/
        sub = "img"
    return os.path.join(ROOT, sub, fichier)

# --- "1200x630 (ar 1.91:1)" -> (1200, 630) ---------------------------------
def parse_size(fmt):
    m = re.search(r"(\d+)\s*x\s*(\d+)", fmt)
    return (int(m.group(1)), int(m.group(2))) if m else (1024, 1024)

# --- recadrage "cover" au format cible + export webp -----------------------
def to_webp(png_bytes, size, out_path):
    from PIL import Image
    img = Image.open(io.BytesIO(png_bytes)).convert("RGB")
    tw, th = size
    sw, sh = img.size
    scale = max(tw / sw, th / sh)
    img = img.resize((round(sw * scale), round(sh * scale)), Image.LANCZOS)
    left = (img.width - tw) // 2
    top = (img.height - th) // 2
    img = img.crop((left, top, left + tw, top + th))
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    img.save(out_path, "WEBP", quality=82, method=6)

# --- FOURNISSEUR : fal.ai FLUX.1 [schnell] ---------------------------------
# Le modèle génère au ratio le plus proche ; on recadre ensuite au pixel près.
def flux_image_size(size):
    w, h = size
    r = w / h
    if r > 1.3:   return "landscape_16_9"
    if r < 0.77:  return "portrait_16_9"
    return "landscape_4_3" if r > 1.05 else "square_hd"

def generate_png(prompt, size):
    import fal_client, requests
    result = fal_client.subscribe(
        "fal-ai/flux/schnell",
        arguments={
            "prompt": prompt,
            "image_size": flux_image_size(size),
            "num_inference_steps": 4,
            "num_images": 1,
            "enable_safety_checker": True,
        },
    )
    url = result["images"][0]["url"]
    return requests.get(url, timeout=120).content

# ---------------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", help="ne traiter que les fichiers contenant ce texte")
    ap.add_argument("--limit", type=int, default=0, help="nombre max d'images")
    ap.add_argument("--force", action="store_true", help="régénérer même si le fichier existe")
    ap.add_argument("--dry-run", action="store_true", help="lister sans générer")
    args = ap.parse_args()

    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    todo = []
    for row in rows:
        fichier = row["fichier"].strip()
        if args.only and args.only.lower() not in fichier.lower():
            continue
        out = dest_path(fichier)
        if os.path.exists(out) and not args.force:
            continue
        todo.append((fichier, parse_size(row["format"]), row["prompt"].strip(), out))
    if args.limit:
        todo = todo[: args.limit]

    print(f"{len(todo)} image(s) à générer (sur {len(rows)} lignes).")
    if args.dry_run:
        for fichier, size, _, out in todo:
            print(f"  {fichier:40s} {size[0]}x{size[1]} -> {os.path.relpath(out, ROOT)}")
        return
    if todo and "FAL_KEY" not in os.environ:
        sys.exit("Erreur : export FAL_KEY=... requis (https://fal.ai/dashboard/keys).")

    ok = err = 0
    for i, (fichier, size, prompt, out) in enumerate(todo, 1):
        try:
            print(f"[{i}/{len(todo)}] {fichier} …", flush=True)
            png = generate_png(prompt, size)
            to_webp(png, size, out)
            ok += 1
        except Exception as e:  # noqa: BLE001
            err += 1
            print(f"    ⚠️  échec : {e}", file=sys.stderr)
            time.sleep(2)
    print(f"\nTerminé : {ok} générée(s), {err} échec(s).")
    print("Relancez la commande pour reprendre les échecs (les réussites sont ignorées).")

if __name__ == "__main__":
    main()
