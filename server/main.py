from fastapi import FastAPI, UploadFile, File, Body
from fastapi.responses import StreamingResponse, JSONResponse
from typing import List
import io
from pypdf import PdfReader, PdfWriter, PdfMerger
import zipfile
import difflib

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "PDF Toolkit API is running."}


# -------- Compare PDFs --------
def compare_pdfs_backend(pdf1: bytes, pdf2: bytes):
    reader1 = PdfReader(io.BytesIO(pdf1))
    reader2 = PdfReader(io.BytesIO(pdf2))

    text1 = "".join([page.extract_text() or "" for page in reader1.pages])
    text2 = "".join([page.extract_text() or "" for page in reader2.pages])

    diff = list(difflib.unified_diff(
        text1.splitlines(), text2.splitlines(), lineterm=""
    ))

    return {"differences": diff if diff else ["No differences found."]}


@app.post("/compare-pdfs/")
async def compare_pdfs(pdf1: UploadFile = File(...), pdf2: UploadFile = File(...)):
    pdf1_content = await pdf1.read()
    pdf2_content = await pdf2.read()
    return compare_pdfs_backend(pdf1_content, pdf2_content)


# -------- Merge PDFs --------
def merge_pdfs_backend(pdfs: List[bytes]) -> bytes:
    merger = PdfMerger()
    for pdf_bytes in pdfs:
        merger.append(io.BytesIO(pdf_bytes))
    output_bytes = io.BytesIO()
    merger.write(output_bytes)
    merger.close()
    return output_bytes.getvalue()


@app.post("/merge-pdfs/")
async def merge_pdfs(pdfs: List[UploadFile] = File(...)):
    pdf_contents = [await pdf.read() for pdf in pdfs]
    merged_pdf_bytes = merge_pdfs_backend(pdf_contents)
    return StreamingResponse(io.BytesIO(merged_pdf_bytes),
                             media_type="application/pdf",
                             headers={"Content-Disposition": "attachment; filename=merged.pdf"})


# -------- Split PDF --------
def split_pdf_backend(pdf: bytes, split_params: dict) -> bytes:
    reader = PdfReader(io.BytesIO(pdf))
    output_zip = io.BytesIO()

    with zipfile.ZipFile(output_zip, 'w') as zf:
        if "pages" in split_params:
            for page_info in split_params["pages"]:
                writer = PdfWriter()
                start = page_info.get("start", 0)
                end = page_info.get("end", len(reader.pages))
                for i in range(start, end):
                    if 0 <= i < len(reader.pages):
                        writer.add_page(reader.pages[i])
                split_io = io.BytesIO()
                writer.write(split_io)
                zf.writestr(f"split_{start+1}_to_{end}.pdf", split_io.getvalue())
        else:
            for i, page in enumerate(reader.pages):
                writer = PdfWriter()
                writer.add_page(page)
                split_io = io.BytesIO()
                writer.write(split_io)
                zf.writestr(f"page_{i+1}.pdf", split_io.getvalue())

    output_zip.seek(0)
    return output_zip.getvalue()


@app.post("/split-pdf/")
async def split_pdf(
    pdf: UploadFile = File(...),
    split_params: dict = Body(default={})
):
    pdf_content = await pdf.read()
    split_zip_bytes = split_pdf_backend(pdf_content, split_params)
    return StreamingResponse(io.BytesIO(split_zip_bytes),
                             media_type="application/zip",
                             headers={"Content-Disposition": "attachment; filename=splits.zip"})


# -------- Summarize PDF --------
def summarize_text(text: str) -> str:
    # Basic rule-based summary: first 3 sentences or 1000 characters
    import re
    sentences = re.split(r'(?<=[.!?]) +', text)
    summary = " ".join(sentences[:3])
    return summary if summary else text[:1000]


def summarize_pdf_backend(pdf: bytes):
    reader = PdfReader(io.BytesIO(pdf))
    text = "".join([page.extract_text() or "" for page in reader.pages])
    summary = summarize_text(text)
    return {"summary": summary}


@app.post("/summarize-pdf/")
async def summarize_pdf(pdf: UploadFile = File(...)):
    pdf_content = await pdf.read()
    return summarize_pdf_backend(pdf_content)
