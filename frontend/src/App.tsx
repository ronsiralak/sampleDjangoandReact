import { useState, useEffect } from 'react'

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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Items</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-8 bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold">Add Item</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded">Add</button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.length === 0 && <li>No items yet. Add one above!</li>}
          {items.map((item) => (
            <li key={item.id} className="flex justify-between items-center bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex flex-col gap-1">
                <strong className="text-lg font-semibold">{item.name}</strong>
                {item.description && <p className="text-gray-600 text-sm">{item.description}</p>}
                <small className="text-gray-400 text-xs">{new Date(item.created_at).toLocaleString()}</small>
              </div>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
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
