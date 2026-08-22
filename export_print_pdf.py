#!/usr/bin/env python3
"""Create a print PDF from a DesignerSass template and image placements.

The browser prototype still opens the native print dialog. This helper is the
native-PDF path for the later desktop wrapper: it keeps the original template
page, removes TEMPLATE/INFO artwork from the jewel templates, keeps SCHNITT,
and paints placed images above it.
"""

import argparse
import base64
import json
import re
import os
from io import BytesIO
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from pypdf.generic import DecodedStreamObject, NameObject
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas


ROOT = Path(os.environ.get("DESIGNERSASS_ROOT", Path(__file__).resolve().parent))
TEMPLATES = {
    "front": (ROOT / "assets/JEWEL CASE template FRONT.pdf", (720, 509)),
    "back": (ROOT / "assets/JEWEL CASE template BACK.pdf", (420, 594)),
    "cd": (ROOT / "assets/CD DISC PRINT.pdf", (420, 591)),
}


def cut_only_page(template_path: Path):
    reader = PdfReader(str(template_path))
    page = reader.pages[0]
    if template_path.name == "CD DISC PRINT.pdf":
        return reader, page
    content = page.get_contents().get_data().decode("latin1")
    start = content.find("/CS1 CS 1  SCN")
    end = content.find("BT", start)
    if start < 0 or end < 0:
        raise ValueError(f"SCHNITT-Farbebene nicht gefunden: {template_path}")
    stream = DecodedStreamObject()
    stream.set_data(content[start:end].encode("latin1"))
    page[NameObject("/Contents")] = stream
    return reader, page


def image_overlay(template_key: str, placements: list[dict], output: BytesIO):
    template_path, canvas_size = TEMPLATES[template_key]
    source = PdfReader(str(template_path)).pages[0]
    page_width = float(source.mediabox.width)
    page_height = float(source.mediabox.height)
    canvas_width, canvas_height = canvas_size
    sx = page_width / canvas_width
    sy = page_height / canvas_height
    pdf = canvas.Canvas(output, pagesize=(page_width, page_height))
    for item in placements:
        source = item.get("data") or item.get("path")
        if not source:
            raise ValueError("Bildplatzierung ohne data oder path")
        image_source = source
        if source.startswith("data:"):
            encoded = re.sub(r"^data:[^;]+;base64,", "", source)
            image_source = BytesIO(base64.b64decode(encoded))
        else:
            path = Path(source)
            if not path.is_absolute():
                path = ROOT / path
            image_source = str(path)
        width = float(item["width"]) * sx
        height = float(item["height"]) * sy
        left = float(item["left"]) * sx
        top = float(item["top"]) * sy
        angle = float(item.get("rotation", 0))
        center_x = left + width / 2
        center_y = page_height - (top + height / 2)
        pdf.saveState()
        pdf.translate(center_x, center_y)
        pdf.rotate(-angle)
        pdf.drawImage(ImageReader(image_source), -width / 2, -height / 2, width=width, height=height, mask="auto")
        pdf.restoreState()
    pdf.showPage()
    pdf.save()


def export_pdf(template_key: str, placements_path: Path, output_path: Path):
    if template_key not in TEMPLATES:
        raise ValueError(f"Unbekannte Vorlage: {template_key}")
    template_path, _ = TEMPLATES[template_key]
    placements = json.loads(placements_path.read_text(encoding="utf-8"))
    reader, page = cut_only_page(template_path)
    overlay = BytesIO()
    image_overlay(template_key, placements, overlay)
    overlay.seek(0)
    overlay_page = PdfReader(overlay).pages[0]
    page.merge_page(overlay_page)
    writer = PdfWriter()
    writer.add_page(page)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("wb") as stream:
        writer.write(stream)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("template", choices=sorted(TEMPLATES))
    parser.add_argument("placements", type=Path, help="JSON-Datei mit Bildplatzierungen")
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    export_pdf(args.template, args.placements, args.output)


if __name__ == "__main__":
    main()
