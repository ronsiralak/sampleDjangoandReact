import { useState, useEffect } from 'react'
import './App.css'

interface Item {
  id: number
  name: string
  description: string
  created_at: string
}

const API_URL = 'http://localhost:8000/api/items/'

function App() {
  const [items, setItems] = useState<Item[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = async () => {
    try {
      setLoading(true)
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error('Failed to fetch items')
      const data: Item[] = await res.json()
      setItems(data)
      setError(null)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      })
      if (!res.ok) throw new Error('Failed to create item')
      setName('')
      setDescription('')
      await fetchItems()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}${id}/`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete item')
      await fetchItems()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div className="container">
      <h1>Items</h1>

      <form onSubmit={handleSubmit} className="form">
        <h2>Add Item</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="item-list">
          {items.length === 0 && <li>No items yet. Add one above!</li>}
          {items.map((item) => (
            <li key={item.id} className="item-card">
              <div className="item-info">
                <strong>{item.name}</strong>
                {item.description && <p>{item.description}</p>}
                <small>{new Date(item.created_at).toLocaleString()}</small>
              </div>
              <button
                className="delete-btn"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
