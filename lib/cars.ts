export type Car = {
  make: string
  model: string
  year: string
  segment?: string
  body?: string
  image?: string
  price?: string
  priceTL?: number
  score?: string
  specs?: {
    engine?: string
    power?: string
    fuel?: string
    transmission?: string
    consumption?: string
    consumptionL?: number
    powerHP?: number
  }
  chronicIssues?: string[]
  resaleSpeed?: {
    label: string
    rank: number
  }
}

export const CAR_DB: Car[] = [
  {
    make: "Fiat",
    model: "Egea",
    year: "2020",
    body: "Sedan",
    image: "/images/egea.jpg",
    price: "₺ 650.000",
    priceTL: 650000,
    segment: "Sedan",
    score: "8.4/10",
    specs: {
      engine: "1.4 Benzin",
      power: "95 HP",
      fuel: "Benzin",
      transmission: "Manuel",
      consumption: "6.5 L/100km",
      consumptionL: 6.5,
      powerHP: 95,
    },
    chronicIssues: [
      "Diyafram benzin pompası aşınması (nadir)",
      "Arka süspansiyon burçlarında erken yıpranma",
    ],
    resaleSpeed: { label: "Hızlı", rank: 3 },
  },
  {
    make: "Renault",
    model: "Clio",
    year: "2019",
    body: "Hatchback",
    image: "/images/clio.jpg",
    price: "₺ 495.000",
    priceTL: 495000,
    segment: "Hatchback",
    score: "7.8/10",
    specs: {
      engine: "1.0 TCe",
      power: "100 HP",
      fuel: "Benzin",
      transmission: "Otomatik",
      consumption: "5.8 L/100km",
      consumptionL: 5.8,
      powerHP: 100,
    },
    chronicIssues: [
      "EGR valf tıkanması (yüksek km'de)",
      "Elektriksel küçük sensör arızaları",
    ],
    resaleSpeed: { label: "Orta", rank: 2 },
  },
  {
    make: "Dacia",
    model: "Sandero",
    year: "2021",
    body: "Hatchback",
    image: "/images/sandero.jpg",
    price: "₺ 420.000",
    priceTL: 420000,
    segment: "B-Segment",
    score: "7.6/10",
    specs: {
      engine: "1.0 SCe",
      power: "75 HP",
      fuel: "Benzin",
      transmission: "Manuel",
      consumption: "6.9 L/100km",
      consumptionL: 6.9,
      powerHP: 75,
    },
    chronicIssues: ["Ses izolasyonunda eksiklik", "Küçük elektrik arızaları"],
    resaleSpeed: { label: "Orta", rank: 2 },
  },
  {
    make: "Hyundai",
    model: "i20",
    year: "2022",
    body: "Hatchback",
    image: "/images/i20.jpg",
    price: "₺ 560.000",
    priceTL: 560000,
    segment: "B-Segment",
    score: "8.0/10",
    specs: {
      engine: "1.2 MPI",
      power: "84 HP",
      fuel: "Benzin",
      transmission: "Manuel",
      consumption: "6.2 L/100km",
      consumptionL: 6.2,
      powerHP: 84,
    },
    chronicIssues: ["Conta problemleri (seyrek)", "İç plastiklerde çatlama (uzun kullanım)"],
    resaleSpeed: { label: "Hızlı", rank: 3 },
  },
  {
    make: "Toyota",
    model: "Corolla",
    year: "2021",
    body: "Sedan",
    image: "/images/corolla.jpg",
    price: "₺ 1.200.000",
    priceTL: 1200000,
    segment: "C-Segment",
    score: "8.6/10",
    specs: {
      engine: "1.6 Valvematic",
      power: "132 HP",
      fuel: "Benzin",
      transmission: "CVT",
      consumption: "6.0 L/100km",
      consumptionL: 6.0,
      powerHP: 132,
    },
    chronicIssues: ["Elektrik aksamında nadir problemler"],
    resaleSpeed: { label: "Hızlı", rank: 3 },
  },
  {
    make: "Dacia",
    model: "Duster",
    year: "2020",
    body: "SUV",
    image: "/images/duster.jpg",
    price: "₺ 850.000",
    priceTL: 850000,
    segment: "C-SUV",
    score: "7.9/10",
    specs: {
      engine: "1.3 TCe",
      power: "130 HP",
      fuel: "Benzin",
      transmission: "Otomatik",
      consumption: "7.2 L/100km",
      consumptionL: 7.2,
      powerHP: 130,
    },
    chronicIssues: ["İç plastik kalitesi", "Yalıtım eksikliği"],
    resaleSpeed: { label: "Orta", rank: 2 },
  },
  {
    make: "TOGG",
    model: "T10X",
    year: "2023",
    body: "SUV",
    image: "/images/t10x.jpg",
    price: "₺ 2.500.000",
    priceTL: 2500000,
    segment: "C-SUV",
    score: "8.2/10",
    specs: {
      engine: "Elektrik",
      power: "200 HP",
      fuel: "Elektrik",
      transmission: "Otomatik",
      consumption: "—",
      consumptionL: 0,
      powerHP: 200,
    },
    chronicIssues: ["Yeni model, uzun dönem verisi sınırlı"],
    resaleSpeed: { label: "Hızlı", rank: 3 },
  },
  {
    make: "Volkswagen",
    model: "Polo",
    year: "2021",
    body: "Hatchback",
    image: "/images/polo.jpg",
    price: "₺ 630.000",
    priceTL: 630000,
    segment: "B-Segment",
    score: "8.0/10",
    specs: {
      engine: "1.0 TSI",
      power: "95 HP",
      fuel: "Benzin",
      transmission: "Manuel",
      consumption: "5.6 L/100km",
      consumptionL: 5.6,
      powerHP: 95,
    },
    chronicIssues: ["Elektriksel küçük arızalar"],
    resaleSpeed: { label: "Orta", rank: 2 },
  },
]

