import PyPDF2

def read_pdf(file_path):
    try:
        with open('pdf_output.txt', 'w', encoding='utf-8') as out_file:
            with open(file_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                for page_num in range(len(reader.pages)):
                    page = reader.pages[page_num]
                    out_file.write(f"--- Page {page_num + 1} ---\n")
                    text = page.extract_text()
                    out_file.write(text if text else "")
                    out_file.write("\n")
    except Exception as e:
        print(f"Error reading PDF: {e}")

read_pdf('thamkhao.pdf')
