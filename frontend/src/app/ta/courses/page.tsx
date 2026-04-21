import { redirect } from 'next/navigation';

// `/ta/courses` isn't a distinct page. The TA dashboard at `/ta` already lists
// all of the TA's courses, so we just forward there instead of showing a 404
// when a user types the URL directly.
export default function TACoursesIndexPage(): never {
    redirect('/ta');
}
