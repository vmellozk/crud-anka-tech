'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'

type Ativo = {
  id: number
  name: string
  value: number
}

export function AtivosList() {
  const { data, isLoading, error } = useQuery<Ativo[]>({
    queryKey: ['ativos'],
    queryFn: async () => {
      try {
        const response = await api.get('/assets')
        return response.data
      } catch (err) {
        // Exibir erro amigável para o usuário
        alert('Erro ao carregar os ativos. Por favor, tente novamente mais tarde.')
        // Repassa o erro para o React Query tratar como erro
        throw err
      }
    }
  })

  if (isLoading) return <p>Carregando ativos...</p>
  if (error) return <p>Erro ao carregar ativos.</p>

  return (
    <ul className="space-y-2">
      {data?.map((ativo) => (
        <li key={ativo.id} className="border p-2 rounded">
          <strong>{ativo.name}</strong> — R$ {ativo.value.toFixed(2)}
        </li>
      ))}
    </ul>
  )
}
