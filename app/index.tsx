"use client";
import styles from "@/app/page.module.css";
import { lusitana } from "@/app/ui/fonts";
import { useCallback, useState } from "react";
import { pdfjs, Document, Thumbnail } from "react-pdf";
import { degrees, PDFDocument } from "pdf-lib";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function MoreChoice() {
  return (
    <>
      <a className="hover:underline p-2.5" href="https://pdf.ai/pricing">
        Pricing
      </a>
      <a
        className="hover:underline p-2.5"
        href="https://pdf.ai/chrome-extension"
      >
        Chrome extension
      </a>
      <a className="hover:underline p-2.5" href="https://pdf.ai/use-cases">
        Use cases
      </a>
      <a className="hover:underline p-2.5" href="https://pdf.ai/auth/sign-in">
        Get started →
      </a>
    </>
  );
}

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
            stroke-width="1.5"
            stroke="currentColor"
            className="w-[32px]"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
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
  const [show, setShow] = useState(false);
  const [upload, setUpload] = useState(false);
  const [file, setFile] = useState<File>();
  const [numPages, setNumPages] = useState<number>();
  const [rotate, setRotate] = useState<number[]>([]);
  const [scale, setScale] = useState<number[]>([176, 250]);
  const handleShow = useCallback(() => {
    setShow(!show);
  }, [show]);

  function onDocumentLoadSuccess({ numPages: nextNumPages }: any): void {
    setNumPages(nextNumPages);
    setRotate(Array(nextNumPages).fill(0));
  }

  function handleRotate(index: number) {
    let temp = [...rotate];
    if (index === -1) {
      temp.map((_, n) => {
        temp[n] += 90;
      });
    } else {
      if (temp[index] + 90 < 360) {
        temp[index] += 90;
      } else {
        temp[index] = 0;
      }
    }
    setRotate(temp);
  }

  function handleScale(sign: Number) {
    if (sign === 1) {
      console.log("放大");
      setScale([scale[0] + 16, scale[1] + 32]);
    }
    if (sign === -1) {
      console.log("缩小");
      setScale([scale[0] - 16, scale[1] - 32]);
    }
  }

  async function handleDownload() {
    if (file && numPages !== 0) {
      // 由于react-pdf只能看不能改，因此需利用pdf-lib对文件进行编辑保存
      // 将file（特殊的blob）转为ArrayBuffer类型，返回一个 Promise，包含 blob 二进制数据内容的ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      // 获取页面
      const pages = pdf.getPages();
      let i = 0;
      for (let page of pages) {
        page.setRotation(degrees(rotate[i]));
        i++;
      }
      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "example.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }

  return (
    <main>
      <header>
        <div className={styles.top}>
          <div className={styles.title}>
            <a href="/" className={styles.title}>
              <svg viewBox="0 0 64 36" className={styles.img}>
                <path
                  fill="black"
                  d="M41.3111 0H37.6444C30.3111 0 24.6889 4.15556 21.7556 9.28889C18.8222 3.91111 12.9556 0 5.86667 0H2.2C0.977781 0 0 0.977779 0 2.2V5.86667C0 16.1333 8.31111 24.2 18.3333 24.2H19.8V33C19.8 34.2222 20.7778 35.2 22 35.2C23.2222 35.2 24.2 34.2222 24.2 33V24.2H25.6667C35.6889 24.2 44 16.1333 44 5.86667V2.2C43.5111 0.977779 42.5333 0 41.3111 0ZM19.3111 19.5556H17.8444C10.2667 19.5556 4.15556 13.4444 4.15556 5.86667V4.4H5.62222C13.2 4.4 19.3111 10.5111 19.3111 18.0889V19.5556ZM39.1111 5.86667C39.1111 13.4444 33 19.5556 25.4222 19.5556H23.9556V18.0889C23.9556 10.5111 30.0667 4.4 37.6444 4.4H39.1111V5.86667Z"
                />
              </svg>
              PDF.ai
            </a>
          </div>
          <div className="hidden md:block">
            <MoreChoice />
          </div>
          <div className="p-2.5 flex items-center block md:hidden">
            <button onClick={handleShow}>
              <svg viewBox="0 0 16 16" className={styles.img}>
                {show ? (
                  <path d="M9.41 8l3.29-3.29c.19-.18.3-.43.3-.71a1.003 1.003 0 00-1.71-.71L8 6.59l-3.29-3.3a1.003 1.003 0 00-1.42 1.42L6.59 8 3.3 11.29c-.19.18-.3.43-.3.71a1.003 1.003 0 001.71.71L8 9.41l3.29 3.29c.18.19.43.3.71.3a1.003 1.003 0 00.71-1.71L9.41 8z" />
                ) : (
                  <path d="M1 4h14c.55 0 1-.45 1-1s-.45-1-1-1H1c-.55 0-1 .45-1 1s.45 1 1 1zm14 8H1c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1zm0-5H1c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1z" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {show && (
          <div className="block md:hidden flex flex-col p-2.5 border-t">
            <MoreChoice />
          </div>
        )}
      </header>
      <div className="bg-[#f7f5ee] flex flex-col items-center py-20 space-y-5">
        <div className="flex flex-col items-center !mb-10 space-y-5">
          <p className={`${lusitana.className} text-4xl`}>Rotate PDF Pages</p>
          <p className="max-w-lg text-center mt-5 mb-0 mx-auto">
            Simply click on a page to rotate it. You can then download your
            modified PDF.
          </p>
        </div>

        {!upload ? (
          <FileBefore setUpload={setUpload} setFile={setFile} />
        ) : (
          <>
            <div className="flex justify-center items-center space-x-3 selecto-ignore">
              <button
                className="bg-orange text-white px-3 py-2.5 rounded min-w-fit"
                aria-label="全部旋转"
                data-microtip-position="top"
                role="tooltip"
                onClick={() => handleRotate(-1)}
              >
                全部旋转
              </button>
              <button
                className="bg-blackgray text-white px-3 py-2.5 rounded min-w-fit"
                aria-label="删除此PDF并选择新的"
                data-microtip-position="top"
                role="tooltip"
                onClick={() => {
                  setUpload(false);
                  setFile(undefined);
                  setNumPages(undefined);
                }}
              >
                删除 PDF
              </button>
              <button
                className="bg-[#ff612f] shadow rounded-full p-2 flex items-center justify-center hover:scale-105 grow-0 shrink-0 disabled:opacity-50 !bg-white"
                aria-label="放大"
                data-microtip-position="top"
                role="tooltip"
                onClick={() => handleScale(1)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                  />
                </svg>
              </button>
              <button
                className="bg-[#ff612f] shadow rounded-full p-2 flex items-center justify-center hover:scale-105 grow-0 shrink-0 disabled:opacity-50 !bg-white"
                aria-label="缩小"
                data-microtip-position="top"
                role="tooltip"
                onClick={() => handleScale(-1)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
                  />
                </svg>
              </button>
            </div>
            <Document
              className="flex flex-wrap justify-center"
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              {Array.from(new Array(numPages), (_, index) => (
                <div className="bg-[#fff] p-2.5 m-3">
                  <Thumbnail
                    width={scale[0]}
                    height={scale[1]}
                    key={index + 1}
                    pageNumber={index + 1}
                    rotate={rotate[index]}
                    onClick={() => handleRotate(index)}
                  />
                  <div className="text-center">{index + 1}</div>
                </div>
              ))}
            </Document>
            <div className="flex flex-col justify-center items-center space-y-3 selecto-ignore">
              <button
                className="bg-orange text-white px-3 py-2.5 rounded min-w-fit"
                aria-label="Split and download PDF"
                data-microtip-position="top"
                role="tooltip"
                onClick={() => handleDownload()}
              >
                Download
              </button>
            </div>
          </>
        )}
      </div>
      <footer className="bg-white" aria-labelledby="footer-heading">
        <div className="mx-auto max-w-7xl px-6 pb-8 mt-8 sm:mt-12 lg:px-8 lg:mt-16 border-t border-gray-900/10 pt-16">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8">
              <img className="h-7" src="/favicon.ico" alt="PDF.ai logo" />
              <div className="text-sm leading-6 text-gray-600">
                Chat with any PDF: ask questions, get summaries, find
                information, and more.
              </div>
              <div className="flex space-x-6">
                <a
                  href="https://www.tiktok.com/@pdfai"
                  className="text-gray-400 hover:text-gray-500"
                  target="_blank"
                >
                  <span className="sr-only">TikTok</span>
                  <svg
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 2859 3333"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    className="h-6 w-6"
                    aria-hidden="true"
                    // style="width: 20px;"
                  >
                    <path d="M2081 0c55 473 319 755 778 785v532c-266 26-499-61-770-225v995c0 1264-1378 1659-1932 753-356-583-138-1606 1004-1647v561c-87 14-180 36-265 65-254 86-398 247-358 531 77 544 1075 705 992-358V1h551z"></path>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/pdfdotai/"
                  className="text-gray-400 hover:text-gray-500"
                  target="_blank"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </a>
                <a
                  href="https://twitter.com/pdfdotai"
                  className="text-gray-400 hover:text-gray-500"
                  target="_blank"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@pdfai"
                  className="text-gray-400 hover:text-gray-500"
                  target="_blank"
                >
                  <span className="sr-only">YouTube</span>
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-3 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-gray-900">
                    Products
                  </h3>
                  <ul role="list" className="mt-6 space-y-4 list-none p-0">
                    <li className="p-0 m-0">
                      <a
                        href="/use-cases"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Use cases
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="/chrome-extension"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Chrome extension
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="https://api.pdf.ai/"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        API docs
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="https://pdf.ai/pricing"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Pricing
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="https://pdf.ai/tutorials"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Video tutorials
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="https://pdf.ai/resources"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Resources
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="https://pdf.ai/blog"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Blog
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="/faq"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        FAQ
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold leading-6 text-gray-900">
                    We also built
                  </h3>
                  <ul role="list" className="mt-6 space-y-4 list-none p-0">
                    <li className="p-0 m-0">
                      <a
                        href="https://pdf.ai/tools/resume-ai-scanner"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Resume AI Scanner
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="https://pdf.ai/tools/invoice-ai-scanner"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Invoice AI Scanner
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="https://pdf.ai/tools/quiz-ai-generator"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        AI Quiz Generator
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="https://quickyai.com"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        QuickyAI
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="https://docsium.com"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Docsium
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="https://pdf.ai/gpts"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        PDF GPTs
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="https://pdfgen.com"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        PDF AI generator
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="https://pdf.ai/tools"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Other PDF tools
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold leading-6 text-gray-900">
                    Company
                  </h3>
                  <ul role="list" className="mt-6 space-y-4 list-none p-0">
                    <li className="p-0 m-0">
                      <a
                        href="/compare/chatpdf-alternative"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        PDF.ai vs ChatPDF
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="/compare/adobe-acrobat-reader-alternative"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        PDF.ai vs Acrobat Reader
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="/privacy-policy"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Legal
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="/affiliate-program"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Affiliate program 💵
                      </a>
                    </li>
                    <li className="p-0 m-0">
                      <a
                        href="/investor"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Investor
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
