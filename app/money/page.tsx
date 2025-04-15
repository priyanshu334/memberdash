"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Check, CreditCard, ArrowDown, Loader2 } from "lucide-react";

interface TransactionResponse {
  message: string;
  updatedBalance?: number;
}

export default function MoneyTransaction(): React.ReactElement {
  const router = useRouter();

  const [userId, setUserId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [checkResult, setCheckResult] = useState<string | null>(null);
  const [transactionResult, setTransactionResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);

  const handleCheckUserId = async (): Promise<void> => {
    setLoading(true);
    setCheckResult(null);
    setTransactionResult(null);

    try {
      const res = await fetch(`http://localhost:5000/api/user/check-id/${userId}`);
      const data: { message: string } = await res.json();

      if (!res.ok) {
        setCheckResult(data.message || "User not found");
      } else {
        setCheckResult(data.message); // "User ID exists"
      }
    } catch (error) {
      console.error("Error checking user ID:", error);
      setCheckResult("Failed to check user ID");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = async (): Promise<void> => {
    setProcessing(true);
    setTransactionResult(null);

    const numericAmount = parseFloat(amount);

    if (!userId || isNaN(numericAmount) || numericAmount <= 0) {
      setTransactionResult("Please enter a valid user ID and amount.");
      setProcessing(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/user/${userId}/add-money`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: numericAmount }),
      });

      const data: TransactionResponse = await res.json();

      if (!res.ok) {
        setTransactionResult(data.message || "Failed to add money");
      } else {
        setTransactionResult(`${data.message}. New balance: ₹${data.updatedBalance}`);
        setAmount("");
      }
    } catch (error) {
      console.error("Error adding money:", error);
      setTransactionResult("Error processing request");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          <CreditCard className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Money Transfer</h1>
        </div>

        <div className="flex space-x-2 mb-6">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium">
            Add Money
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={() => router.push("/withdraw")}
          >
            Withdraw
          </Button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User ID
            </label>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter user ID"
                className="flex-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                value={userId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserId(e.target.value)}
              />
              <Button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                onClick={handleCheckUserId}
                disabled={loading || !userId}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Verify"
                )}
              </Button>
            </div>
            {checkResult && (
              <p 
                className={`mt-2 text-sm flex items-center ${
                  checkResult.includes("does not") ? "text-red-600" : "text-green-600"
                }`}
              >
                {!checkResult.includes("does not") && (
                  <Check className="h-4 w-4 mr-1" />
                )}
                {checkResult}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₹)
            </label>
            <Input
              placeholder="1,000"
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
              type="number"
              min="0"
            />
          </div>

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 font-medium"
            onClick={handleAddMoney}
            disabled={processing || !userId || !amount}
          >
            {processing ? (
              <span className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center">
                <ArrowDown className="h-4 w-4 mr-2" />
                Add Money
              </span>
            )}
          </Button>

          {transactionResult && (
            <div className={`mt-4 p-3 rounded-lg ${
              transactionResult.includes("Failed") || transactionResult.includes("Error") || transactionResult.includes("Please enter")
                ? "bg-red-50 text-red-700"
                : "bg-green-50 text-green-700"
            }`}>
              {transactionResult}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}