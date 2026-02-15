import Header from "../components/Header"
import CompareSection from "../components/CompareSection"
import ShowcaseCard from "../components/ShowcaseCard"
import ArticleList from "../components/ArticleList"

export default function Home() {
  const cars = [
    {
      model: "Fiat Egea 1.4",
      price: "₺ 650.000",
      score: "8.4/10",
      marketStatus: "Hızlı Satılır",
      image: "https://images.unsplash.com/photo-1493238792000-8113da705763?w=800&q=60",
    },
    {
      model: "Renault Clio 1.0",
      price: "₺ 495.000",
      score: "7.8/10",
      marketStatus: "Orta Hız",
      image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=60",
    },
    {
      model: "Dacia Sandero",
      price: "₺ 420.000",
      score: "7.6/10",
      marketStatus: "Hızlı Satılır",
      image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&q=60",
    },
  ]

  return (
    <>
      <Header />
      <main>
        {/* Top: compare UI as the main landing entry */}
        <div className="bg-[var(--color-bg)] py-8">
          <CompareSection />
        </div>

        {/* Showcase stars */}
        <section className="container mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Piyasanın Yıldızları</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((c) => (
              <ShowcaseCard
                key={c.model}
                model={c.model}
                price={c.price}
                score={c.score}
                marketStatus={c.marketStatus}
                image={c.image}
              />
            ))}
          </div>
        </section>

        {/* Articles list below */}
        <ArticleList />
      </main>
    </>
  )
}

