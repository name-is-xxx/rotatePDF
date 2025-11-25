"use client";
import { useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";

// 外部加载
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// 未载入文件前
function FileBefore({ setUpload, setFile }: any) {
  function hadleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    // 文件选中并获取第一个文件
    if (files && files.length > 0) {
      setUpload(true);
      setFile(files[0]);
    }
  }

  return (
    <div className="bg-[#fff] h-[350px] w-[275px] relative">
      <input
        className="cursor-pointer hidden"
        type="file"
        id="input-file-upload"
        accept=".pdf"
        onChange={hadleUpload}
      />
      <label
        className="h-full flex items-center justify-center border rounded transition-all bg-white border-dashed border-stone-300"
        htmlFor="input-file-upload"
      >
        <div className="flex flex-col items-center space-y-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-[32px]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
            />
          </svg>
          <p className="pointer-events-none font-medium text-sm leading-6 pointer opacity-75">
            Click to upload or drag and drop
          </p>
        </div>
      </label>
    </div>
  );
}

export default function Index() {
  const [upload, setUpload] = useState(false);
  const [file, setFile] = useState<File>();
  const [numPages, setNumPages] = useState<number>();

  async function onDocumentLoadSuccess(pdf: any) {
    setNumPages(pdf.numPages);
    let rotemp: number[] = [];
    for (let index = 1; index <= pdf.numPages; index++) {
      await pdf.getPage(index).then((page: any) => rotemp.push(page.rotate));
    }
  }

  return (
    <main>
      <div className="bg-[#f7f5ee] flex flex-col items-center py-20 space-y-5">
        {!upload ? (
          <FileBefore setUpload={setUpload} setFile={setFile} />
        ) : (
          <>
            <button
              className="bg-blackgray text-white px-3 py-2.5 rounded min-w-fit"
              aria-label="删除此PDF并选择新的"
              role="tooltip"
              onClick={() => {
                setUpload(false);
                setFile(undefined);
                setNumPages(undefined);
              }}
            >
              删除 PDF
            </button>

            <Document
              className="flex flex-wrap justify-center"
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              {Array.from(new Array(numPages), (_, index) => (
                <div key={index} className="bg-[#fff] p-2.5 m-3">
                  <Page
                    width={200}
                    key={index + 1}
                    pageNumber={index + 1}
                    loading={<p>Please wait!</p>}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                  <div className="text-center">{index + 1}</div>
                </div>
              ))}
            </Document>
          </>
        )}
      </div>
    </main>
  );
}
