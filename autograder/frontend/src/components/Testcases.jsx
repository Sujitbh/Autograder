import { useEffect, useState } from 'react'

import { apiFetch } from '../lib/api'

export default function Testcases() {
  const [items, setItems] = useState([])
  const [assignmentId, setAssignmentId] = useState('')
  const [inputData, setInputData] = useState('')
  const [expectedOutput, setExpectedOutput] = useState('')

  useEffect(() => {
    apiFetch('/testcases/').then((r) => r.json()).then(setItems).catch(() => setItems([]))
  }, [])

  async function create() {
    const payload = { assignment_id: Number(assignmentId), input_data: inputData, expected_output: expectedOutput }
    const res = await apiFetch('/testcases/', { method: 'POST', body: JSON.stringify(payload) })
    if (res.ok) {
      const data = await res.json()
      setItems((s) => [data, ...s])
      setAssignmentId('')
      setInputData('')
      setExpectedOutput('')
    } else {
      alert('Create failed')
    }
  }

  return (
    <div>
      <h2>TestCases</h2>
      <div>
        <input placeholder="assignment id" value={assignmentId} onChange={(e) => setAssignmentId(e.target.value)} />
        <input placeholder="input" value={inputData} onChange={(e) => setInputData(e.target.value)} />
        <input placeholder="expected" value={expectedOutput} onChange={(e) => setExpectedOutput(e.target.value)} />
        <button onClick={create}>Create</button>
      </div>
      <ul>
        {items.map((t) => (
          <li key={t.id}>assignment {t.assignment_id}: {t.input_data} &rarr; {t.expected_output}</li>
        ))}
      </ul>
    </div>
  )
}
