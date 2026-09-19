import ReferansForm from '@/components/panel/ReferansForm'

export default async function ReferansDuzenlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ReferansForm referenceId={id} />
}
