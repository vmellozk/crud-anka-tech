'use client'

import { useState } from 'react'
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
  if (!isOpen) return null

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
        <button onClick={onClose} className="mt-4 text-sm text-gray-500 hover:underline">
          Cancelar
        </button>
      </div>
    </div>
  )
}
