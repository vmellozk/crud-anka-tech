'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { api } from '@/services/api'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'

type Alocacao = {
  id: number
  amount: number
  asset: {
    id: number
    name: string
    value: number
  }
}

type ApiResponse = {
  clientName: string
  allocations: Alocacao[]
}

export default function AlocacoesDoClientePage() {
  const params = useParams()
  const clientId = params.id

  const {
    data,
    isLoading,
    error,
  } = useQuery<ApiResponse>({
    queryKey: ['alocacoes', clientId],
    queryFn: async () => {
      const response = await api.get(`/clients/${clientId}/allocations`)
      return response.data
    }
  })

  useEffect(() => {
    if (error) {
      toast.error('Erro ao carregar alocações.')
    }
  }, [error])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Alocações do Cliente {data?.clientName ?? `#${clientId}`}
      </h1>

      {isLoading && <p>Carregando alocações...</p>}

      {!isLoading && data?.allocations && data.allocations.length === 0 && (
        <p className="text-gray-500">Nenhuma alocação encontrada para este cliente.</p>
      )}

      {data?.allocations && data.allocations.length > 0 && (
        <table className="w-full border border-gray-200 text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border-b">Ativo</th>
              <th className="p-2 border-b">Valor Atual (R$)</th>
              <th className="p-2 border-b">Quantidade</th>
              <th className="p-2 border-b">Total (R$)</th>
            </tr>
          </thead>
          <tbody>
            {data.allocations.map((aloc) => (
              <tr key={aloc.id} className="border-t">
                <td className="p-2">{aloc.asset.name}</td>
                <td className="p-2">R$ {aloc.asset.value.toFixed(2)}</td>
                <td className="p-2">{aloc.amount}</td>
                <td className="p-2 font-semibold">
                  R$ {(aloc.asset.value * aloc.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
