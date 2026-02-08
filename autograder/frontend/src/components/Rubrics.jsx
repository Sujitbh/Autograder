import { useEffect, useState } from 'react'

import { apiFetch } from '../lib/api'

export default function Rubrics() {
  const [items, setItems] = useState([])
  const [assignmentId, setAssignmentId] = useState('')
  const [name, setName] = useState('')

  useEffect(() => {
    apiFetch('/rubrics/').then((r) => r.json()).then(setItems).catch(() => setItems([]))
  }, [])

  async function create() {
    const payload = { assignment_id: Number(assignmentId), name }
    const res = await apiFetch('/rubrics/', { method: 'POST', body: JSON.stringify(payload) })
    if (res.ok) {
      const data = await res.json()
      setItems((s) => [data, ...s])
      setAssignmentId('')
      setName('')
    } else {
      alert('Create failed')
    }
  }

  return (
    <div>
      <h2>Rubrics</h2>
      <div>
        <input placeholder="assignment id" value={assignmentId} onChange={(e) => setAssignmentId(e.target.value)} />
        <input placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={create}>Create</button>
      </div>
      <ul>
        {items.map((r) => (
          <li key={r.id}>assignment {r.assignment_id}: {r.name}</li>
        ))}
      </ul>
    </div>
  )
}
