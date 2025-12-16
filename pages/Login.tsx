import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { USE_MOCK_BACKEND } from '../constants';

interface LoginProps {
  onSwitch: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSwitch }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('demo@devflow.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login(email, password);
      login(data.token, data.user);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Login falhou';
      if (msg.includes('Email not confirmed')) {
        setError('Por favor, verifique seu e-mail para confirmar a conta antes de entrar.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Entrar</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Acesse suas tarefas e gerencie seu fluxo de trabalho
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
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
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

        <div>
          <Button type="submit" className="w-full" isLoading={loading}>
            Entrar
          </Button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Novo no DevFlow?</span>
          </div>
        </div>

        <div className="mt-6">
          <Button variant="secondary" className="w-full" onClick={onSwitch}>
            Criar uma conta
          </Button>
        </div>
      </div>
      
      {USE_MOCK_BACKEND && (
        <div className="mt-6 text-xs text-center text-gray-400 bg-gray-50 p-2 rounded">
          <p className="font-semibold">Modo Demo Ativado</p>
          <p>Email: demo@devflow.com</p>
          <p>Senha: password123</p>
        </div>
      )}
    </div>
  );
};