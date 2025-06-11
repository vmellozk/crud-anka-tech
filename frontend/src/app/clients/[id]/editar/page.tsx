'use client' // Indica que essa página é client-side (React Query precisa disso)

import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { ClienteForm } from '@/components/ClienteForm'
import { api } from '@/services/api'
import { toast } from 'react-hot-toast' // Adiciona o toast

export default function EditarClientePage() {
  const { id } = useParams() // pega o [id] da URL
  const router = useRouter() // para redirecionamento pós-submit

  const { data, isLoading, error } = useQuery({
    queryKey: ['cliente', id], // cache e refetch baseado no ID
    queryFn: async () => {
      try {
        const response = await api.get(`/clients/${id}`)
        return response.data
      } catch (err: any) {
        // ✅ Tratamento de erro amigável com toast
        toast.error('Erro ao buscar os dados do cliente.')
        throw err // importante: lançar para que o React Query também saiba do erro
      }
    },
    enabled: !!id, // só roda a query se o ID existir
  })

  if (isLoading) return <p>Carregando cliente...</p>
  if (error) return <p>Erro ao carregar cliente.</p>

  type ClienteFormValues = {
    nome: string
    email: string
    status: 'ativo' | 'inativo'
  }

  const defaultValues: ClienteFormValues = {
    nome: data.name,
    email: data.email,
    status: data.status ? 'ativo' : 'inativo',
  }

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Editar Cliente</h1>
      <ClienteForm
        clienteId={id as string}
        defaultValues={defaultValues}
        onSuccess={() => router.push('/clients')} // redireciona ao salvar
      />
    </div>
  )
}
