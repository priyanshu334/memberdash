"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Check, CreditCard, ArrowDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface TransactionResponse {
  message: string;
  newBalance?: number;
  error?: string;
}

export default function MoneyTransaction(): React.ReactElement {
  const router = useRouter();
  const [phone, setPhone] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleAddMoney = async (): Promise<void> => {
    setIsProcessing(true);

    // Validate inputs
    if (!phone || !/^\d{10}$/.test(phone)) {
      toast.error("Invalid Phone Number", {
        description: "Please enter a valid 10-digit phone number"
      });
      setIsProcessing(false);
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Invalid Amount", {
        description: "Please enter a positive amount"
      });
      setIsProcessing(false);
      return;
    }

    try {
      toast.promise(
        fetch("https://backend.nurdcells.com/api/user/add-money", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone,
            amount: numericAmount
          })
        }).then(async (response) => {
          const data: TransactionResponse = await response.json();
          if (!response.ok) {
            throw new Error(data.error || "Failed to add money");
          }
          return data;
        }),
        {
          loading: 'Adding money to account...',
          success: (data) => {
            setAmount("");
            setPhone("");
            return `${data.message}. New balance: ₹${data.newBalance}`;
          },
          error: (error) => error.message || "Transaction failed",
        }
      );
    } catch (error) {
      console.error("Add Money Error:", error);
      toast.error("Transaction Failed", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen w-full p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          <CreditCard className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Add Money</h1>
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
              Phone Number
            </label>
            <Input
              placeholder="Enter 10-digit phone number"
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              type="tel"
              pattern="\d{10}"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₹)
            </label>
            <Input
              placeholder="1,000"
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              min="1"
              required
            />
          </div>

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 font-medium"
            onClick={handleAddMoney}
            disabled={isProcessing || !phone || !amount}
          >
            {isProcessing ? (
              <span className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center">
                <Check className="h-4 w-4 mr-2" />
                Add Money
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}