import { useEffect, useState } from 'react'

import { apiFetch } from '../lib/api'

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [name, setName] = useState('')
  const [code, setCode] = useState('')

  useEffect(() => {
    apiFetch('/courses/').then((r) => r.json()).then(setCourses).catch(() => setCourses([]))
  }, [])

  async function create() {
    const payload = { name, code }
    const res = await apiFetch('/courses/', { method: 'POST', body: JSON.stringify(payload) })
    if (res.ok) {
      const data = await res.json()
      setCourses((s) => [data, ...s])
      setName('')
      setCode('')
    } else {
      alert('Create failed: ' + (await res.text()))
    }
  }

  return (
    <div>
      <h2>Courses</h2>
      <div>
        <input placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="code" value={code} onChange={(e) => setCode(e.target.value)} />
        <button onClick={create}>Create</button>
      </div>
      <ul>
        {courses.map((c) => (
          <li key={c.id}>{c.name} {c.code ? `(${c.code})` : ''}</li>
        ))}
      </ul>
    </div>
  )
}
