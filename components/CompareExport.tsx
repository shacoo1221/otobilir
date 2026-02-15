 "use client"

import * as React from "react"

export default function CompareExport({ left, right }: { left: any; right: any }) {
  async function downloadPDF() {
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf").then((m) => ({ jsPDF: m.default || m.jsPDF || m })),
      ])
      // Try to find the on-page comparison table and clone it for PDF rendering.
      const tableEl = document.querySelector(".cmp-table")
      const container = document.createElement("div")
      container.style.padding = "18px"
      container.style.fontFamily = "Inter, Arial, Helvetica, sans-serif"

      const logoHtml = `<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
        <div style="width:56px;height:56px;border-radius:8px;background:var(--color-primary);display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:20px">OB</div>
        <div><div style="font-size:18px;font-weight:800;color:#0f172a">OTOBİLİR</div><div style="font-size:12px;color:#6b7280">Otomobili, Otobilir.</div></div>
      </div>`

      // Minimal CSS needed to preserve colors/formatting in the PDF
      const embeddedStyles = `
        :root{--color-primary:#1E3A8A;--color-secondary:#F59E0B;--color-bg:#F3F4F6;--color-surface:#FFFFFF}
        .cmp-table{width:100%;border-collapse:collapse;font-size:12px;color:#0f172a}
        .cmp-table th{padding:10px;text-align:left;background:transparent}
        .cmp-table td{padding:10px;vertical-align:middle;border-top:1px solid rgba(15,23,42,0.04)}
        .cmp-label{background:rgba(15,23,42,0.04);font-weight:700}
        .cell-good{background:rgba(16,185,129,0.12);color:#047857;font-weight:700}
        .cell-bad{background:rgba(239,68,68,0.08);color:#b91c1c;font-weight:700}
        .cell-neutral{background:rgba(15,23,42,0.03);color:#374151}
        .big-score{font-size:20px;font-weight:800;color:var(--color-primary)}
        img{max-width:100%;height:auto}
      `

      let tableHtml = ""
      if (tableEl) {
        tableHtml = tableEl.outerHTML
      } else {
        // fallback: simple summary boxes
        tableHtml = `
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <div style="flex:1;border:1px solid #e5e7eb;padding:12px;border-radius:8px">
              <h3 style="margin:0 0 8px 0">Sol Araç</h3>
              <div><strong>${left?.make || "-"} ${left?.model || ""} (${left?.year || ""})</strong></div>
              <div>Otobilir Puanı: <span class="big-score">${left?.score || "-"}</span></div>
            </div>
            <div style="flex:1;border:1px solid #e5e7eb;padding:12px;border-radius:8px">
              <h3 style="margin:0 0 8px 0">Sağ Araç</h3>
              <div><strong>${right?.make || "-"} ${right?.model || ""} (${right?.year || ""})</strong></div>
              <div>Otobilir Puanı: <span class="big-score">${right?.score || "-"}</span></div>
            </div>
          </div>
        `
      }

      container.innerHTML = `<style>${embeddedStyles}</style>${logoHtml}<h2 style="margin:0 0 12px 0;font-size:16px">Karşılaştırma Raporu</h2>${tableHtml}`
      container.style.maxWidth = "900px"
      container.style.background = "white"
      container.style.borderRadius = "8px"
      container.style.padding = "18px"
      container.style.boxSizing = "border-box"

      document.body.appendChild(container)
      // render at higher scale for clarity
      const canvas = await html2canvas(container, { scale: 2, useCORS: true, allowTaint: true })

      // create multi-page A4 PDF
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" })
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      // scale factor between canvas px and pdf pt
      const scale = canvas.width / pdfWidth
      const sliceHeight = Math.floor(pdfHeight * scale)

      let y = 0
      let page = 0
      while (y < canvas.height) {
        const h = Math.min(sliceHeight, canvas.height - y)
        // create page canvas slice
        const pageCanvas = document.createElement("canvas")
        pageCanvas.width = canvas.width
        pageCanvas.height = h
        const ctx = pageCanvas.getContext("2d")
        if (ctx) {
          ctx.fillStyle = "#ffffff"
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height)
          ctx.drawImage(canvas, 0, y, canvas.width, h, 0, 0, canvas.width, h)
        }
        const imgData = pageCanvas.toDataURL("image/png")

        const imgPropsHeight = (pageCanvas.height / canvas.width) * pdfWidth
        if (page > 0) pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgPropsHeight)

        y += h
        page += 1
      }

      pdf.save(`compare-${Date.now()}.pdf`)
      document.body.removeChild(container)
    } catch (e) {
      // fallback to previous method
      const win = window.open("", "_blank", "noopener,noreferrer")
      if (!win) return
      win.document.write("<pre>PDF oluşturulamadı. Tarayıcınızda popup engelleyici olabilir.</pre>")
      win.document.close()
    }
  }

  return <button className="btn btn-ghost" onClick={downloadPDF}>PDF İndir</button>
}

