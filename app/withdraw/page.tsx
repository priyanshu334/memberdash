"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function TransferToMember() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [amount, setAmount] = useState("");
  const [checkResult, setCheckResult] = useState<string | null>(null);
  const [transactionResult, setTransactionResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleCheckUserId = async () => {
    setLoading(true);
    setCheckResult(null);
    setTransactionResult(null);

    try {
      const res = await fetch(`http://localhost:5000/api/user/check-id/${userId}`);
      const data = await res.json();

      if (!res.ok) {
        setCheckResult(data.message || "User not found");
      } else {
        setCheckResult(data.message);
      }
    } catch (error) {
      console.error("Error checking user ID:", error);
      setCheckResult("Failed to check user ID");
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    setProcessing(true);
    setTransactionResult(null);

    const numericAmount = parseFloat(amount);

    if (!userId || !memberId || isNaN(numericAmount) || numericAmount <= 0) {
      setTransactionResult("Please enter valid User ID, Member ID, and amount.");
      setProcessing(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/user/${userId}/transfer-to-member`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: numericAmount, memberId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setTransactionResult(data.message || "Transfer failed");
      } else {
        setTransactionResult(
          `✅ ${data.message}. User balance: ₹${data.userBalance}, Member balance: ₹${data.memberBalance}`
        );
        setAmount("");
      }
    } catch (error) {
      console.error("Transfer error:", error);
      setTransactionResult("Error processing transfer");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen w-full p-4">
      <div className="mx-auto p-6 max-w-xl bg-white rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-4 text-orange-700">Transfer to Member</h1>

        <div className="flex space-x-4 mb-4">
          <Button variant="outline" onClick={() => router.push("/money")}>
            Add Money
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600">Transfer</Button>
        </div>

        <div className="mb-4">
          <label className="block text-lg mb-2">User ID</label>
          <div className="flex space-x-2">
            <Input
              placeholder="Abc123"
              className="flex-1"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={handleCheckUserId}
              disabled={loading || !userId}
            >
              {loading ? "Checking..." : "Check ID"}
            </Button>
          </div>
          {checkResult && (
            <p className={`mt-2 text-sm ${checkResult.includes("not") ? "text-red-600" : "text-green-600"}`}>
              {checkResult}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-lg mb-2">Member ID</label>
          <Input
            placeholder="member123"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg mb-2">Amount</label>
          <Input
            placeholder="1,000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <Button
          className="w-full bg-blue-500 hover:bg-blue-600"
          onClick={handleTransfer}
          disabled={processing || !userId || !memberId || !amount}
        >
          {processing ? "Transferring..." : "Transfer Money"}
        </Button>

        {transactionResult && (
          <p className="mt-4 text-sm text-center text-blue-700">{transactionResult}</p>
        )}
      </div>
    </div>
  );
}
