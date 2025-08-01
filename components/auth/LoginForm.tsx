import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/authContext';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  // Check for error parameter in URL
  React.useEffect(() => {
    const { error: urlError } = router.query;
    if (urlError === 'unauthorized') {
      setError('Access denied. Admin privileges required.');
    }
  }, [router.query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await login(email, password);

      if (result.success) {
        console.log('Login successful!');
        router.push('/');
      } else {
        setError(result.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 sr-only">
          Email
        </label>
        <input
          id="email"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-describedby="email-error"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 sr-only">
          Password
        </label>
        <input
          id="password"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-describedby="password-error"
        />
      </div>

      {error && (
        <p role="alert" className="text-red-600 text-sm text-center">
          {error}
        </p>
      )}

      <button
        className={`w-full py-3 px-4 rounded-md text-white font-semibold transition duration-300
          ${loading 
            ? 'bg-blue-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }`}
        type="submit"
        disabled={loading}
      >
        {loading ? 'Logging In...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm; 