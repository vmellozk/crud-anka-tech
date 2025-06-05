'use client'

import { useState, useEffect } from 'react'
import { ClienteForm } from './ClienteForm'

interface ClienteModalProps {
  isOpen: boolean
  onClose: () => void
  cliente?: {
    id: string
    nome: string
    email: string
    status: 'ativo' | 'inativo'
  }
}

export function ClienteModal({ isOpen, onClose, cliente }: ClienteModalProps) {
  // Pequeno fallback para captura e exibição de erro inesperado
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false) // Reset erro ao abrir modal
  }, [isOpen])

  if (!isOpen) return null

  if (hasError) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center">
          <p className="text-red-600 font-semibold mb-4">
            Ocorreu um erro inesperado. Tente fechar e abrir o modal novamente.
          </p>
          <button
            onClick={() => {
              setHasError(false)
              onClose()
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Fechar
          </button>
        </div>
      </div>
    )
  }

  try {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">
            {cliente ? 'Editar Cliente' : 'Novo Cliente'}
          </h2>
          <ClienteForm
            onSuccess={onClose}
            defaultValues={cliente}
            clienteId={cliente?.id}
          />
          <button
            onClick={onClose}
            className="mt-4 text-sm text-gray-500 hover:underline"
          >
            Cancelar
          </button>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Erro no ClienteModal:', error)
    setHasError(true)
    return null
  }
}
