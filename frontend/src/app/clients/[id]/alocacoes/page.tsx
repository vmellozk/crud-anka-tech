'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { api } from '@/services/api'
import { useEffect, useState } from 'react'
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

type CreateAllocationResponse = {
  id: number
  amount: number
  asset: {
    id: number
    name: string
    value: number
  }
}

type Asset = {
  id: number
  name: string
  value: number
}

export default function AlocacoesDoClientePage() {
  const params = useParams()
  const clientId = params.id
  const queryClient = useQueryClient()

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

  const {
    data: assets,
    isLoading: isLoadingAssets,
    error: errorAssets,
  } = useQuery<Asset[]>({
    queryKey: ['assets'],
    queryFn: async () => {
      const response = await api.get('/assets')
      return response.data
    }
  })

  useEffect(() => {
    if (error) {
      if ((error as any).response?.status === 404) {
        toast.error('Cliente não encontrado.')
      } else {
        toast.error('Erro ao carregar alocações.')
      }
    }

    if (errorAssets) {
      toast.error('Erro ao carregar ativos.')
    }
  }, [error, errorAssets])

  const [assetName, setAssetName] = useState('')
  const [amount, setAmount] = useState<number>(1)
  const [showForm, setShowForm] = useState(false)

  const [editId, setEditId] = useState<number | null>(null)
  const [editAmount, setEditAmount] = useState<number>(1)

  const mutation = useMutation<CreateAllocationResponse, Error, void>({
    mutationFn: async () => {
      const response = await api.post(`/clients/${clientId}/allocations`, { assetName, amount })
      return response.data
    },
    onSuccess: () => {
      toast.success('Alocação adicionada com sucesso!')
      setAssetName('')
      setAmount(1)
      setShowForm(false)
      queryClient.invalidateQueries({ queryKey: ['alocacoes', clientId] })
    },
    onError: () => {
      toast.error('Erro ao adicionar alocação.')
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, amount }: { id: number; amount: number }) => {
      const response = await api.put(`/assets/allocations/${id}`, { amount })
      return response.data
    },
    onSuccess: () => {
      toast.success('Quantidade atualizada com sucesso!')
      setEditId(null)
      queryClient.invalidateQueries({ queryKey: ['alocacoes', clientId] })
    },
    onError: () => {
      toast.error('Erro ao atualizar quantidade.')
    }
  })

  const mutationIsLoading = mutation.status === 'pending'

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!assetName.trim()) {
      toast.error('Selecione um ativo.')
      return
    }
    if (amount <= 0) {
      toast.error('Quantidade deve ser maior que zero.')
      return
    }
    mutation.mutate()
  }

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
        <table className="w-full border border-gray-200 text-left mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border-b">Ativo</th>
              <th className="p-2 border-b">Valor Atual (R$)</th>
              <th className="p-2 border-b">Quantidade</th>
              <th className="p-2 border-b">Total (R$)</th>
              <th className="p-2 border-b">Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.allocations.map((aloc) => (
              <tr key={aloc.id} className="border-t">
                <td className="p-2">{aloc.asset.name}</td>
                <td className="p-2">R$ {aloc.asset.value.toFixed(2)}</td>
                <td className="p-2">
                  {editId === aloc.id ? (
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(Number(e.target.value))}
                      min={1}
                      className="w-20 border rounded p-1"
                    />
                  ) : (
                    aloc.amount
                  )}
                </td>
                <td className="p-2 font-semibold">
                  R$ {(aloc.asset.value * aloc.amount).toFixed(2)}
                </td>
                <td className="p-2">
                  {editId === aloc.id ? (
                    <>
                      <button
                        className="text-green-600 mr-2"
                        onClick={() =>
                          updateMutation.mutate({ id: aloc.id, amount: editAmount })
                        }
                      >
                        Salvar
                      </button>
                      <button
                        className="text-gray-500"
                        onClick={() => setEditId(null)}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      className="text-blue-600"
                      onClick={() => {
                        setEditId(aloc.id)
                        setEditAmount(aloc.amount)
                      }}
                    >
                      Editar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!showForm && (
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setShowForm(true)}
        >
          Adicionar novo ativo
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 max-w-md space-y-4">
          <div>
            <label htmlFor="assetName" className="block font-medium mb-1">
              Nome do ativo
            </label>
            <select
              id="assetName"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
              required
            >
              <option value="">Selecione um ativo</option>
              {assets?.map((asset) => (
                <option key={asset.id} value={asset.name}>
                  {asset.name} - R$ {asset.value.toFixed(2)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="amount" className="block font-medium mb-1">
              Quantidade
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full border border-gray-300 rounded p-2"
              min={1}
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={mutationIsLoading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
            >
              {mutationIsLoading ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={mutationIsLoading}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
