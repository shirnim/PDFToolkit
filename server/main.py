from fastapi import FastAPI, UploadFile, File
from typing import List
import io
from pypdf import PdfReader
from pypdf import PdfWriter, PdfMerger
import zipfile


app = FastAPI()

def compare_pdfs_backend(pdf1: bytes, pdf2: bytes):
    """Placeholder function for comparing PDFs."""
    # Implement PDF comparison logic here
    print("Comparing PDFs...")
    return {"message": "PDF comparison placeholder"}

def merge_pdfs_backend(pdfs: List[bytes]):
    """Merges a list of PDF files and returns the merged PDF bytes."""
    merger = PdfMerger()
    for pdf_bytes in pdfs:
        merger.append(io.BytesIO(pdf_bytes))

    output_bytes = io.BytesIO()
    merger.write(output_bytes)
    merger.close()
    return output_bytes.getvalue()

def split_pdf_backend(pdf: bytes, split_params: dict):
    """Splits a PDF into multiple files based on split_params and returns a zip archive."""
    reader = PdfReader(io.BytesIO(pdf))
    writer = PdfWriter()
    output_zip = io.BytesIO()

    with zipfile.ZipFile(output_zip, 'w') as zf:
        if "pages" in split_params:
            pages_to_split = split_params["pages"]
            for page_info in pages_to_split:
                writer = PdfWriter() # Create a new writer for each split
                start_page = page_info.get("start", 0)
                end_page = page_info.get("end", len(reader.pages))
                for page_num in range(start_page, end_page):
                    if 0 <= page_num < len(reader.pages):
                        writer.add_page(reader.pages[page_num])

                split_pdf_bytes = io.BytesIO()
                writer.write(split_pdf_bytes)
                zf.writestr(f"split_{start_page}-{end_page}.pdf", split_pdf_bytes.getvalue())
        else:
            # Default split: split into single pages
            for i, page in enumerate(reader.pages):
                writer = PdfWriter()
                writer.add_page(page)
                split_pdf_bytes = io.BytesIO()
                writer.write(split_pdf_bytes)
                zf.writestr(f"page_{i+1}.pdf", split_pdf_bytes.getvalue())

    output_zip.seek(0)
    return output_zip.getvalue()

def summarize_text_with_api(text: str):
    """Placeholder function for summarizing text using a language model API."""
    # Replace this with actual API call to a language model
    return f"Summarization would happen here for the following text:\n\n{text[:500]}..." # Return a snippet for demonstration

def summarize_pdf_backend(pdf: bytes):
    reader = PdfReader(io.BytesIO(pdf))
    text = ""
    for page in reader.pages:
        text += page.extract_text()

    summarized_text = summarize_text_with_api(text)
    return {"summary": summarized_text}

@app.post("/compare-pdfs/")
async def compare_pdfs(pdf1: UploadFile = File(...), pdf2: UploadFile = File(...)):
    pdf1_content = await pdf1.read()
    pdf2_content = await pdf2.read()
    return compare_pdfs_backend(pdf1_content, pdf2_content)

@app.post("/merge-pdfs/")
async def merge_pdfs(pdfs: List[UploadFile] = File(...)):
    pdf_contents = [await pdf.read() for pdf in pdfs]
    merged_pdf_bytes = merge_pdfs_backend(pdf_contents)
    return merged_pdf_bytes

@app.post("/split-pdf/")
async def split_pdf(pdf: UploadFile = File(...), split_params: dict = {}): # split_params can be a JSON object in the request body
    pdf_content = await pdf.read()
    split_zip_bytes = split_pdf_backend(pdf_content, split_params)
    return split_zip_bytes


@app.post("/summarize-pdf/")
async def summarize_pdf(pdf: UploadFile = File(...)):
    pdf_content = await pdf.read()
    return summarize_pdf_backend(pdf_content)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)