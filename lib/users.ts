export type User = {
  id: string
  name: string
  email: string
  password: string // plaintext for mock (dev only)
  avatar?: string
}

// Simple file-backed user store for dev: data/users.json
import fs from "fs"
import path from "path"

const DATA_DIR = path.resolve(process.cwd(), "data")
const USERS_FILE = path.join(DATA_DIR, "users.json")

let USERS: User[] = []

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function loadUsersFromFile() {
  try {
    ensureDataDir()
    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, "utf-8")
      USERS = JSON.parse(raw || "[]")
    } else {
      // seed with one test user
      USERS = [
        {
          id: "u1",
          name: "Test Kullanıcı",
          email: "test@otobilir.dev",
          password: "password",
          avatar: "/images/placeholder.svg",
        },
      ]
      fs.writeFileSync(USERS_FILE, JSON.stringify(USERS, null, 2), "utf-8")
    }
  } catch (e) {
    // fallback to in-memory seed
    USERS = [
      {
        id: "u1",
        name: "Test Kullanıcı",
        email: "test@otobilir.dev",
        password: "password",
        avatar: "/images/placeholder.svg",
      },
    ]
  }
}

function persistUsersToFile() {
  try {
    ensureDataDir()
    fs.writeFileSync(USERS_FILE, JSON.stringify(USERS, null, 2), "utf-8")
  } catch (e) {
    // ignore
  }
}

loadUsersFromFile()

export function createUser({ name, email, password, avatar }: { name: string; email: string; password: string; avatar?: string }) {
  const id = `u${Date.now()}${Math.random().toString(36).slice(2, 6)}`
  const user: User = { id, name, email, password, avatar }
  USERS.push(user)
  persistUsersToFile()
  return user
}

export function findUserByEmail(email: string) {
  return USERS.find((u) => u.email === email) || null
}

export function findUserById(id: string) {
  return USERS.find((u) => u.id === id) || null
}

export function authenticate(email: string, password: string) {
  const u = findUserByEmail(email)
  if (!u) return null
  if (u.password !== password) return null
  return u
}

