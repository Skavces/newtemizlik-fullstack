import BlogForm from '@/components/panel/BlogForm'

export default async function BlogYazisiDuzenlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <BlogForm postId={id} />
}
