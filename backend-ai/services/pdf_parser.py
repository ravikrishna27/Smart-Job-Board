import httpx
import pdfplumber
import tempfile
import os

async def extract_text_from_pdf_url(url: str) -> str:
    """
    Downloads a PDF from a given URL and extracts its text using pdfplumber.
    """
    try:
        # Download the file
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            pdf_bytes = response.content

        # pdfplumber needs a file-like object or path, so we use a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            temp_file.write(pdf_bytes)
            temp_path = temp_file.name

        text = ""
        # Extract text
        with pdfplumber.open(temp_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"

        # Clean up
        os.remove(temp_path)
        
        return text

    except Exception as e:
        raise Exception(f"Failed to parse PDF: {str(e)}")
