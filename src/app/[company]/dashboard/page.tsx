import { redirect } from 'next/navigation';

export default async function DashboardPage({ params }: { params: { company: string }}) {
  redirect(`/${params.company}/financial-dashboard`);
}
