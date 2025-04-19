'use client';

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('https://backend.nurdcells.com/api/members/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });

      const data = await res.json();
      console.log('Login Response:', data);

      if (!res.ok) {
        console.error('Login failed:', data);
        setError(data.message || 'Invalid phone or password');
        return;
      }

      // Token handling
      localStorage.setItem('admin_token', data.token);

      // Optionally store remember me flag
      if (remember) {
        localStorage.setItem('remember', 'true');
      }

      // Redirect
      router.push('/home');
    } catch (err: any) {
      console.error('Login Error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-orange-600 to-orange-800">
      <div className="bg-white rounded-2xl p-10 shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full mb-4"></div>
          <h1 className="text-2xl font-bold text-orange-700">Saffron Exch</h1>
        </div>

        <h2 className="text-lg font-bold text-center mb-4 flex items-center justify-center gap-2">
          Login <span className="text-xl">🔑</span>
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <span className="px-3 text-gray-600">📞</span>
            <Input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full py-2 px-3 focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <span className="px-3 text-gray-600">🔒</span>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-2 px-3 focus:outline-none"
              required
            />
            {/* 👁️ Eye button can be made functional if you want */}
            <Button type="button" variant="ghost" size="icon" className="px-3 text-gray-600">👁️</Button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center cursor-pointer">
              <Checkbox
                className="mr-2"
                checked={remember}
                onCheckedChange={() => setRemember(!remember)}
              />
              Remember me
            </label>
            <a href="#" className="text-orange-700 hover:underline">Forgot Password?</a>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-700 text-white py-2 rounded-lg font-bold"
          >
            {loading ? 'Logging in...' : 'LOGIN'}
          </Button>
        </form>

        <div className="my-6 text-center">OR</div>

        <div className="flex items-center justify-center border border-gray-300 rounded-lg p-2">
          <span className="text-gray-600 mr-2">📞</span>
          <span className="text-gray-800">+91-8602966827</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
