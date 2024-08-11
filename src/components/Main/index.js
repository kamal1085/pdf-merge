import Topbar from "../Topbar/index"
import './style.scss'

import * as React from 'react';

import FileInput from "../FileInput";
import { Button } from "baseui/button";

import githubIcon from '../../GitHub-Mark-64px.png'
import icon from '../../icon.svg'
import PdfView from "../PdfView";
import {useEffect, useState} from "react";
import readFileDataAsBase64 from "../../helper/read-file-as-base64";
import {PDFDocument} from "pdf-lib";
import generatePdfThumbnails from "../../helper/pdf-thumbnails-generator";
import download from "downloadjs";

// export default function Main({ handlefile, handleSave, loaded, isLoading, isSaving, pageCount }) {
export default function Main() {
    const [pdfList, setPdfList] = useState([]);
    const [workingList, setWorkingList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [srcPdfDoc, setSrcPdfDoc] = useState([])

    useEffect(() => {
        const initSave = pdfList.map((pages, i) => (i > workingList.length - 1)
            ? { id: i, pages: pages.map(p => { return { from: i, page: p.page - 1 } }), checked: true }
            : workingList[i])
        setWorkingList(initSave)
    }, [pdfList])

    const pageCount = workingList.reduce((sum, curr) => (curr.checked) ? sum + curr.pages.length : sum, 0)

    const updateList = (newSate, id) => {
        const update = workingList.map(l => (l.id === id) ? newSate : l)
        setWorkingList(update)
    }

    const updateCheck = (id) => {
        const update = workingList.map(l => (l.id === id) ? { ...l, checked: !l.checked } : l)
        setWorkingList(update)
    }

    const handlefile = async (files) => {
        setIsLoading(true)
        try {
            const thumbnailTasks = []
            const sourceFileTasks = []

            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                const doc = await readFileDataAsBase64(file)
                sourceFileTasks.push(
                    PDFDocument.load(doc)
                )
                thumbnailTasks.push(
                    generatePdfThumbnails(doc, 600)
                )
            }

            const srcFiles = await Promise.all(sourceFileTasks)
            const thumbnailsList = await Promise.all(thumbnailTasks)

            setSrcPdfDoc(srcPdfDoc.concat(srcFiles))
            setPdfList(pdfList.concat(thumbnailsList))
            setIsLoading(false)
        } catch (error) {
            console.log(error);
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        const pdfDoc = await PDFDocument.create()

        for (let i = 0; i < workingList.length; i++) {
            if (workingList[i].checked) {
                const pages = workingList[i].pages
                console.log('save', pages);
                for (let j = 0; j < pages.length; j++) {
                    const p = pages[j]
                    const [srcPage] = await pdfDoc.copyPages(srcPdfDoc[p.from], [p.page])
                    pdfDoc.addPage(srcPage)
                }
            }
        }
        const pdfBytes = await pdfDoc.save()
        download(pdfBytes, "mergedPDF.pdf", "application/pdf");
        setIsSaving(false)
    }


    // startProgress is only illustrative. Use the progress info returned
  // from your upload endpoint. This example shows how the file-uploader operates
  // if there is no progress info available.
  return (
    <div className='container'>
      {/* <Topbar>
      </Topbar> */}
      {/*<div className='github'>*/}
      {/*  <a href='https://github.com/ynynl/severless-pdf-merge'>*/}
      {/*    <img src={githubIcon} width={24} alt=''></img>*/}
      {/*  </a>*/}
      {/*</div>*/}
      <div className='content'>

        {/*<img src={icon} width={100} alt=''></img>*/}

        {/*<p>no server. fully pravite.</p>*/}

        <h1>
            Merge PDF
        </h1>
          <h3>
              Merge PDF files and combine two or more PDF Files into an original PDF layout online.
          </h3>

          {pdfList.map((f, i) => {
              return <PdfView
                  className='row'
                  key={i}
                  fileId={i}
                  file={f}
                  updateList={updateList}
                  updateCheck={updateCheck}
              />
          })}

        <FileInput handlefile={handlefile} processing={isLoading} />
        {/* <Controller /> */}
        {/*{loaded &&*/}
          {!!workingList.length &&
          <div className='button'>
            <Button
              onClick={handleSave}
              isLoading={isSaving}
            >
              Combine and Save {pageCount} Pages
              </Button>
          </div>
        }
      </div>
    </div>
  );
}