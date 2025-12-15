import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

interface RegisterProps {
  onSwitch: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onSwitch }) => {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.register(name, email, password);
      login(data.token, data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registo falhou');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Cadastrar</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Comece a organizar sua vida hoje
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          label="Nome Completo"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="Endereço de e-mail"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Senha"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

        <div>
          <Button type="submit" className="w-full" isLoading={loading}>
            Criar Conta
          </Button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Já tem uma conta?</span>
          </div>
        </div>

        <div className="mt-6">
          <Button variant="secondary" className="w-full" onClick={onSwitch}>
            Entrar
          </Button>
        </div>
      </div>
    </div>
  );
};