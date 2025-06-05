'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'

const clienteSchema = z.object({
  nome: z.string().min(3, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  status: z.enum(['ativo', 'inativo']),
})

type ClienteFormData = z.infer<typeof clienteSchema>

interface ClienteFormProps {
  onSuccess: () => void
  defaultValues?: ClienteFormData
  clienteId?: string
}

export function ClienteForm({ onSuccess, defaultValues, clienteId }: ClienteFormProps) {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: defaultValues || {
      nome: '',
      email: '',
      status: 'ativo',
    },
  })

  const mutation = useMutation<void, Error, ClienteFormData>({
    mutationFn: async (data) => {
      try {
        const payload = {
          name: data.nome,
          email: data.email,
          status: data.status === 'ativo',
        }

        if (clienteId) {
          return await api.put(`/clients/${clienteId}`, payload)
        } else {
          return await api.post('/clients', payload)
        }
      } catch (error) {
        // Alerta amigável para o usuário
        alert('Erro ao salvar cliente. Verifique os dados e tente novamente.')
        // Lança o erro para que o onError também capture
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
      onSuccess()
    },
    onError: (error) => {
      console.error('Erro ao salvar cliente:', error.message)
      // Já alertei no try/catch
    }
  })

  return (
    <form
      onSubmit={handleSubmit((data) => {
        console.log('Form submit data:', data)
        mutation.mutate(data)
      })}
      className="space-y-4"
    >
      <div>
        <label className="block">Nome:</label>
        <input {...register('nome')} className="border p-2 w-full rounded" />
        {errors.nome && <p className="text-red-500">{errors.nome.message}</p>}
      </div>
      <div>
        <label className="block">Email:</label>
        <input {...register('email')} className="border p-2 w-full rounded" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block">Status:</label>
        <select {...register('status')} className="border p-2 w-full rounded">
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>
        {errors.status && <p className="text-red-500">{errors.status.message}</p>}
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {clienteId ? 'Salvar Alterações' : 'Cadastrar'}
      </button>

      {/* Exibir erros da mutation, se houver */}
      {mutation.isError && (
        <p className="text-red-500 mt-2">
          Erro ao salvar: {(mutation.error as any)?.response?.data?.error || mutation.error?.message}
        </p>
      )}
    </form>
  )
}
