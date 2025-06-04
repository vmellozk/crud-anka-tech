'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type Ativo = {
  id: number
  name: string
  value: number
}

export function AtivosList() {
  const { data, isLoading, error } = useQuery<Ativo[]>({
    queryKey: ['ativos'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3001/assets') // http://backend:3001/assets
      return response.data
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
