import { useEffect, useState } from 'react'

import { apiFetch } from '../lib/api'

export default function Submissions() {
  const [items, setItems] = useState([])
  const [assignmentId, setAssignmentId] = useState('')
  const [studentId, setStudentId] = useState('')

  useEffect(() => {
    apiFetch('/submissions/').then((r) => r.json()).then(setItems).catch(() => setItems([]))
  }, [])

  async function create() {
    const payload = { assignment_id: Number(assignmentId), student_id: Number(studentId) }
    const res = await apiFetch('/submissions/', { method: 'POST', body: JSON.stringify(payload) })
    if (res.ok) {
      const data = await res.json()
      setItems((s) => [data, ...s])
      setAssignmentId('')
      setStudentId('')
    } else {
      alert('Create failed')
    }
  }

  return (
    <div>
      <h2>Submissions</h2>
      <div>
        <input placeholder="assignment id" value={assignmentId} onChange={(e) => setAssignmentId(e.target.value)} />
        <input placeholder="student id" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
        <button onClick={create}>Create</button>
      </div>
      <ul>
        {items.map((s) => (
          <li key={s.id}>submission {s.id} assignment {s.assignment_id} student {s.student_id}</li>
        ))}
      </ul>
    </div>
  )
}
