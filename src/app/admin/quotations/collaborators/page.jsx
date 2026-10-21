import { redirect } from 'next/navigation';

// Collaborators are managed in one place: Admin → Collaborators.
export default function QuotationCollaboratorsRedirect() {
  redirect('/admin/collaborators');
}
