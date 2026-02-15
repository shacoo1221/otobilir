import { CAR_DB } from "@/lib/cars"
import dynamic from "next/dynamic"

type Params = { searchParams?: { [key: string]: string | string[] | undefined } }

function decodeParam(q?: string) {
  if (!q) return null
  const dec = decodeURIComponent(q)
  const [make, model, year] = dec.split("|")
  return { make, model, year }
}

function findCar(sel: { make?: string; model?: string; year?: string } | null) {
  if (!sel) return null
  return CAR_DB.find((c) => c.make === sel.make && c.model === sel.model && c.year === sel.year) || null
}

export default function Page({ searchParams }: Params) {
  const leftParam = Array.isArray(searchParams?.left) ? searchParams?.left[0] : searchParams?.left
  const rightParam = Array.isArray(searchParams?.right) ? searchParams?.right[0] : searchParams?.right

  const leftSel = decodeParam(leftParam as string | undefined)
  const rightSel = decodeParam(rightParam as string | undefined)

  const leftCar = findCar(leftSel)
  const rightCar = findCar(rightSel)

  const CompareSaveControls = dynamic(() => import("@/components/CompareSaveControls"), { ssr: false })
  const CompareExport = dynamic(() => import("@/components/CompareExport"), { ssr: false })
  const CompareSticky = dynamic(() => import("@/components/CompareSticky"), { ssr: false })

  return (
    <main className="container py-12">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Karşılaştırma Sonuçları</h1>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[leftCar, rightCar].map((car, idx) => (
          <div key={idx} className="card">
            {car ? (
              <>
                <div className="h-44 w-full bg-gray-100 rounded-md overflow-hidden mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={car.image} alt={`${car.make} ${car.model}`} className="object-cover h-full w-full" />
                </div>
                <h2 className="text-lg font-semibold">
                  {car.make} {car.model} ({car.year})
                </h2>
                <div className="mt-2">
                  <div className="text-sm text-gray-600">Otobilir Puanı</div>
                  <div className="text-2xl font-bold text-[var(--color-primary)]">{car.score}</div>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Teknik Bilgiler</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr>
                        <td className="py-2 text-gray-600">Motor</td>
                        <td className="py-2">{car.specs?.engine}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-600">Güç</td>
                        <td className="py-2">{car.specs?.power}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-600">Yakıt</td>
                        <td className="py-2">{car.specs?.fuel}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-600">Şanzıman</td>
                        <td className="py-2">{car.specs?.transmission}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-600">Tüketim</td>
                        <td className="py-2">{car.specs?.consumption}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Kronik Sorunlar</h3>
                  {car.chronicIssues && car.chronicIssues.length ? (
                    <ul className="list-disc pl-5 text-sm text-gray-700">
                      {car.chronicIssues.map((ci, i) => (
                        <li key={i}>{ci}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-sm text-gray-600">Kayıtlı kronik sorun yok.</div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-gray-600">Seçilen araç bulunamadı.</div>
            )}
          </div>
        ))}
      </section>

      <div className="flex items-center gap-3 mt-6">
        <CompareSaveControls left={leftParam as string} right={rightParam as string} />
        <CompareExport left={leftCar} right={rightCar} />
      </div>

      {/* render client sticky header */}
      <CompareSticky left={leftCar} right={rightCar} />

      {/* sentinel for sticky detection */}
      <div id="cmp-sentinel" style={{ height: 1 }} />
      {/* client-side floating sticky header (appears when scrolled past sentinel) */}
      <div style={{ display: "none" }} id="cmp-sticky-placeholder" />
      {/* Dynamic client component will show floating header */}
      <div id="cmp-sticky-client">
        {/* placeholder for client component */}
      </div>

      {/* Comparison matrix */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Özellik Bazlı Karşılaştırma</h2>

        <div className="overflow-x-auto">
          <table className="cmp-table">
            <thead>
              <tr>
                <th className="cmp-label w-1/3">Özellik</th>
                <th className="cmp-label w-1/3">Sol Araç</th>
                <th className="cmp-label w-1/3">Sağ Araç</th>
              </tr>
            </thead>
            <tbody>
              {/* helper parsers */}
              {/* Otobilir Puanı */}
              <tr>
                <td className="cmp-label">OTOBİLİR Puanı</td>
                <td
                  className={
                    leftCar && rightCar
                      ? parseFloat((leftCar.score || "0").toString()) >
                        parseFloat((rightCar.score || "0").toString())
                        ? "cell-good"
                        : parseFloat((leftCar.score || "0").toString()) <
                          parseFloat((rightCar.score || "0").toString())
                        ? "cell-bad"
                        : "cell-neutral"
                      : "cell-neutral"
                  }
                >
                  {leftCar ? <div className="big-score">{leftCar.score}</div> : "-"}
                </td>
                <td
                  className={
                    leftCar && rightCar
                      ? parseFloat((rightCar.score || "0").toString()) >
                        parseFloat((leftCar.score || "0").toString())
                        ? "cell-good"
                        : parseFloat((rightCar.score || "0").toString()) <
                          parseFloat((leftCar.score || "0").toString())
                        ? "cell-bad"
                        : "cell-neutral"
                      : "cell-neutral"
                  }
                >
                  {rightCar ? <div className="big-score">{rightCar.score}</div> : "-"}
                </td>
              </tr>

              {/* Kronik Sorunlar */}
              <tr>
                <td className="cmp-label">Kronik Sorunlar <span className="tooltip"><span className="tooltip-dot">?</span><span className="tooltip-text">Araçta sıkça bildirilen tekrarlayan arıza veya problemler.</span></span></td>
                <td className={leftCar ? (leftCar.chronicIssues && leftCar.chronicIssues.length ? "cell-bad" : "cell-good") : "cell-neutral"}>
                  {leftCar ? (
                    leftCar.chronicIssues && leftCar.chronicIssues.length ? (
                      <ul className="text-sm list-disc pl-5 text-red-700">
                        {leftCar.chronicIssues.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-green-700">Belirgin kronik sorun yok</div>
                    )
                  ) : (
                    "-"
                  )}
                </td>
                <td className={rightCar ? (rightCar.chronicIssues && rightCar.chronicIssues.length ? "cell-bad" : "cell-good") : "cell-neutral"}>
                  {rightCar ? (
                    rightCar.chronicIssues && rightCar.chronicIssues.length ? (
                      <ul className="text-sm list-disc pl-5 text-red-700">
                        {rightCar.chronicIssues.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-green-700">Belirgin kronik sorun yok</div>
                    )
                  ) : (
                    "-"
                  )}
                </td>
              </tr>

              {/* Ortalama 2. El Satış Hızı */}
              <tr>
                <td className="cmp-label">Ortalama 2. El Satış Hızı <span className="tooltip"><span className="tooltip-dot">?</span><span className="tooltip-text">Piyasada aynı modelin ortalama olarak ne kadar sürede satıldığı.</span></span></td>
                <td
                  className={
                    leftCar && rightCar
                      ? (leftCar.resaleSpeed?.rank || 0) > (rightCar.resaleSpeed?.rank || 0)
                        ? "cell-good"
                        : (leftCar.resaleSpeed?.rank || 0) < (rightCar.resaleSpeed?.rank || 0)
                        ? "cell-bad"
                        : "cell-neutral"
                      : "cell-neutral"
                  }
                >
                  {leftCar ? leftCar.resaleSpeed?.label || "-" : "-"}
                </td>
                <td
                  className={
                    leftCar && rightCar
                      ? (rightCar.resaleSpeed?.rank || 0) > (leftCar.resaleSpeed?.rank || 0)
                        ? "cell-good"
                        : (rightCar.resaleSpeed?.rank || 0) < (leftCar.resaleSpeed?.rank || 0)
                        ? "cell-bad"
                        : "cell-neutral"
                      : "cell-neutral"
                  }
                >
                  {rightCar ? rightCar.resaleSpeed?.label || "-" : "-"}
                </td>
              </tr>

              {/* Yakıt Tüketimi */}
              <tr>
                <td className="cmp-label">Yakıt Tüketimi (L/100km) <span className="tooltip"><span className="tooltip-dot">?</span><span className="tooltip-text">100 km'de ortalama yakıt tüketimi (litre).</span></span></td>
                <td
                  className={
                    leftCar && rightCar && leftCar.specs?.consumptionL != null && rightCar.specs?.consumptionL != null
                      ? leftCar.specs.consumptionL < rightCar.specs.consumptionL
                        ? "cell-good"
                        : leftCar.specs.consumptionL > rightCar.specs.consumptionL
                        ? "cell-bad"
                        : "cell-neutral"
                      : "cell-neutral"
                  }
                >
                  {leftCar ? leftCar.specs?.consumptionL ?? leftCar.specs?.consumption : "-"}
                </td>
                <td
                  className={
                    leftCar && rightCar && leftCar.specs?.consumptionL != null && rightCar.specs?.consumptionL != null
                      ? rightCar.specs.consumptionL < leftCar.specs.consumptionL
                        ? "cell-good"
                        : rightCar.specs.consumptionL > leftCar.specs.consumptionL
                        ? "cell-bad"
                        : "cell-neutral"
                      : "cell-neutral"
                  }
                >
                  {rightCar ? rightCar.specs?.consumptionL ?? rightCar.specs?.consumption : "-"}
                </td>
              </tr>

              {/* Motor Gücü */}
              <tr>
                <td className="cmp-label">Motor Gücü (HP) <span className="tooltip"><span className="tooltip-dot">?</span><span className="tooltip-text">Motorun ürettiği güç (Beygir gücü).</span></span></td>
                <td
                  className={
                    leftCar && rightCar && leftCar.specs?.powerHP != null && rightCar.specs?.powerHP != null
                      ? leftCar.specs.powerHP > rightCar.specs.powerHP
                        ? "cell-good"
                        : leftCar.specs.powerHP < rightCar.specs.powerHP
                        ? "cell-bad"
                        : "cell-neutral"
                      : "cell-neutral"
                  }
                >
                  {leftCar ? leftCar.specs?.powerHP ?? leftCar.specs?.power : "-"}
                </td>
                <td
                  className={
                    leftCar && rightCar && leftCar.specs?.powerHP != null && rightCar.specs?.powerHP != null
                      ? rightCar.specs.powerHP > leftCar.specs.powerHP
                        ? "cell-good"
                        : rightCar.specs.powerHP < leftCar.specs.powerHP
                        ? "cell-bad"
                        : "cell-neutral"
                      : "cell-neutral"
                  }
                >
                  {rightCar ? rightCar.specs?.powerHP ?? rightCar.specs?.power : "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

