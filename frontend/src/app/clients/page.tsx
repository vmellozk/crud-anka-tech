"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from 'react'
import { ClienteModal } from '@/components/ClienteModal'

type Cliente = {
  id: number;
  name: string;
  email: string;
  status: boolean;
};

async function fetchClientes(): Promise<Cliente[]> {
  const { data } = await axios.get("http://localhost:3001/clients");
  return data;
}

export default function ClientesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["clientes"],
    queryFn: fetchClientes,
  });

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null)

  function abrirCadastro() {
    setClienteEditando(null)
    setIsModalOpen(true)
  }

  function abrirEdicao(cliente: Cliente) {
    setClienteEditando(cliente)
    setIsModalOpen(true)
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>

      {isLoading && <p>Carregando...</p>}
      {error && <p className="text-red-500">Erro ao carregar clientes: {error.message || JSON.stringify(error)}</p>}

      <button onClick={abrirCadastro} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        Novo Cliente
      </button>

      <table className="w-full border border-gray-200 text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border-b">Nome</th>
            <th className="p-2 border-b">Email</th>
            <th className="p-2 border-b">Status</th>
            <th className="p-2 border-b">Ações</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((cliente) => (
            <tr key={cliente.id} className="border-t">
              <td className="p-2">{cliente.name}</td>
              <td className="p-2">{cliente.email}</td>
              <td className="p-2 capitalize">{cliente.status ? "ativo" : "inativo"}</td>
              <td className="p-2">
                <button onClick={() => abrirEdicao(cliente)} className="text-blue-500 hover:underline">
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Coloque o modal aqui, dentro do JSX */}
      <ClienteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cliente={clienteEditando ? {
          id: clienteEditando.id.toString(),
          nome: clienteEditando.name,
          email: clienteEditando.email,
          status: clienteEditando.status ? 'ativo' : 'inativo'
        } : undefined}
      />
    </div>
  );
}
