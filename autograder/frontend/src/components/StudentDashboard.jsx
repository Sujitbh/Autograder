import { getRole } from '../lib/auth'

export default function StudentDashboard({ navigate }) {
  const role = getRole()
  return (
    <div>
      <h2>Student Dashboard</h2>
      <p>Role: {role}</p>
      <p>Welcome, student — this is a protected view.</p>
      <p>Add student-specific UI here.</p>
    </div>
  )
}
