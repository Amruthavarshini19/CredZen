import { useState, useMemo, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Slider } from '@/app/components/ui/slider'; // Ensure you have this or use standard input
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, TrendingUp, IndianRupee, Calculator, Plane, ShoppingBag, Coffee, Sparkles, Brain } from 'lucide-react';

import { motion } from 'framer-motion';

export function DebtSimulator() {
    const [purchaseAmount, setPurchaseAmount] = useState(1000);
    const [apr, setApr] = useState(24); // Typical credit card APR
    const [payment, setPayment] = useState(50);

    const [results, setResults] = useState<any>({
        isInfinite: false,
        totalInterest: 0,
        months: 0,
        totalCost: 0,
        data: [],
        minPayment: 0,
        novaInsights: null
    });


    // Debounce effect to call API
    useEffect(() => {
        const timer = setTimeout(async () => {
            try {
                const res = await fetch('http://localhost:8000/api/simulator/simulate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        principal: purchaseAmount,
                        rate: apr,
                        monthly_payment: payment
                    })
                });

                if (!res.ok) {
                    const err = await res.json();
                    if (err.detail && typeof err.detail === 'string') {
                        // Handle specific backend error for infinite debt
                        if (err.detail.includes("too low")) {
                            setResults((prev: any) => ({ ...prev, isInfinite: true }));
                        }
                    }
                    return;
                }

                const data = await res.json();

                // Map backend response to frontend format
                if (data) {
                    setResults({
                        isInfinite: false,
                        totalInterest: data.total_interest,
                        months: data.months_to_pay_off,
                        totalCost: data.total_payment,
                        data: data.schedule.map((s: any) => ({
                            month: s.month,
                            Principal: Math.round(s.principal_paid),
                            Interest: Math.round(s.interest_paid),
                            Balance: Math.round(s.remaining_balance)
                        })),
                        minPayment: data.min_payment || 0,
                        novaInsights: data.nova_insights
                    });

                }

            } catch (error) {
                console.error("Simulation failed", error);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [purchaseAmount, apr, payment]);

    // Opportunity Cost Mapper
    const getOpportunityCost = (interest: number) => {
        if (interest > 2000) return { item: "A Round-Trip Flight to Europe", icon: <Plane className="w-6 h-6" /> };
        if (interest > 1000) return { item: "A New Smartphone", icon: <Calculator className="w-6 h-6" /> };
        if (interest > 500) return { item: "A Weekend Getaway", icon: <Plane className="w-6 h-6" /> };
        if (interest > 200) return { item: "A Fancy Dinner for Two", icon: <ShoppingBag className="w-6 h-6" /> };
        if (interest > 50) return { item: "A Month of Coffee", icon: <Coffee className="w-6 h-6" /> };
        return { item: "A Few Coffees", icon: <Coffee className="w-6 h-6" /> };
    };

    const opportunity = getOpportunityCost(results.totalInterest);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-purple-900/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-purple-500/20 rounded-xl">
                        <Calculator className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Invisible Debt Simulator</h1>
                        <p className="text-gray-300">See the true future cost of your purchases.</p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Controls */}
                <Card className="lg:col-span-1 bg-gray-900/50 border-purple-500/30 p-6 space-y-8 h-fit">
                    <div className="space-y-4">
                        <div>
                            <Label className="text-gray-300">Purchase Amount</Label>
                            <div className="relative mt-2">
                                <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                                <Input
                                    type="number"
                                    className="pl-9 bg-gray-800 border-gray-700 text-white"
                                    value={purchaseAmount}
                                    onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                                />
                            </div>
                        </div>

                        <div>
                            <Label className="text-gray-300">Interest Rate (APR %)</Label>
                            <div className="relative mt-2">
                                <Input
                                    type="number"
                                    className="bg-gray-800 border-gray-700 text-white"
                                    value={apr}
                                    onChange={(e) => setApr(Number(e.target.value))}
                                />
                                <span className="absolute right-3 top-2.5 text-gray-500">%</span>
                            </div>
                        </div>

                        <div className="pt-4">
                            <div className="flex justify-between text-gray-300 mb-2">
                                <Label>Monthly Repayment</Label>
                                <span className="font-bold text-lg text-purple-400">₹{payment}</span>
                            </div>
                            <Slider
                                className="py-4"
                                value={[payment]}
                                min={results.minPayment || 10}
                                max={purchaseAmount}
                                step={10}
                                onValueChange={(vals) => setPayment(vals[0])}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Minimum to cover interest: ₹{results.minPayment}
                            </p>
                        </div>
                    </div>

                    {results.isInfinite && (
                        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                            <div>
                                <h4 className="text-red-300 font-bold">You will never pay this off!</h4>
                                <p className="text-sm text-red-200/80">Your payment is lower than the interest accumulating.</p>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Visualization */}
                <div className="lg:col-span-2 space-y-6">
                    {!results.isInfinite && (
                        <>
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card className="bg-gradient-to-br from-indigo-900/50 to-blue-900/50 border-indigo-500/30 p-6">
                                    <p className="text-gray-400 text-sm">True Cost</p>
                                    <p className="text-3xl font-bold text-white">₹{results.totalCost.toLocaleString()}</p>
                                    <p className="text-xs text-indigo-300 mt-1">Original: ₹{purchaseAmount.toLocaleString()}</p>
                                </Card>
                                <Card className="bg-gradient-to-br from-pink-900/50 to-rose-900/50 border-pink-500/30 p-6">
                                    <p className="text-gray-400 text-sm">Invisible Debt (Interest)</p>
                                    <p className="text-3xl font-bold text-white">₹{Math.round(results.totalInterest).toLocaleString()}</p>
                                    <p className="text-xs text-pink-300 mt-1">+{(results.totalInterest / purchaseAmount * 100).toFixed(0)}% extra cost</p>
                                </Card>
                                <Card className="bg-gradient-to-br from-purple-900/50 to-violet-900/50 border-purple-500/30 p-6">
                                    <p className="text-gray-400 text-sm">Time to Freedom</p>
                                    <p className="text-3xl font-bold text-white">
                                        {Math.floor(results.months / 12)}y {results.months % 12}m
                                    </p>
                                    <p className="text-xs text-purple-300 mt-1">{results.months} monthly payments</p>
                                </Card>
                            </div>

                            {/* Main Graph */}
                            <Card className="bg-gray-900/50 border-gray-800 p-6 h-[400px]">
                                <h3 className="text-white font-semibold mb-4">The Cost of Time</h3>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={results.data}>
                                        <defs>
                                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="month" stroke="#6b7280" label={{ value: 'Months', position: 'insideBottomRight', offset: 0 }} />
                                        <YAxis stroke="#6b7280" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                                            itemStyle={{ color: '#e5e7eb' }}
                                        />
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <Area type="monotone" dataKey="Interest" stackId="1" stroke="#ec4899" fill="url(#colorBalance)" />
                                        <Area type="monotone" dataKey="Principal" stackId="1" stroke="#8b5cf6" fill="url(#colorPrincipal)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Card>
                        </>
                    )}
                </div>
            </div>

            {/* Nova's AI Insights - Broadened Layout */}
            {results.novaInsights && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-2xl p-6"
                >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <Sparkles className="w-5 h-5 text-purple-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white whitespace-nowrap">Nova Analysis</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                                    <Brain className="w-3 h-3" />
                                    <span>Explanation</span>
                                </div>
                                <p className="text-gray-300 text-sm leading-snug">
                                    {results.novaInsights.explanation}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-pink-300 text-xs font-bold uppercase tracking-wider">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>Nudge</span>
                                </div>
                                <p className="text-gray-300 text-sm leading-snug">
                                    {results.novaInsights.behavioral_context}
                                </p>
                            </div>

                            <div className="space-y-1 border-l border-white/5 pl-6">
                                <div className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                                    Strategic Impact
                                </div>
                                <p className="text-gray-400 text-sm leading-snug font-medium">
                                    {results.novaInsights.long_term_impact}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Opportunity Cost/Reality Check */}
            {!results.isInfinite && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-500/30 rounded-xl p-6 flex items-center gap-6"
                >
                    <div className="p-4 bg-emerald-500/20 rounded-full shrink-0">
                        {opportunity.icon}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Reality Check</h3>
                        <p className="text-emerald-100 text-lg">
                            That <span className="font-bold text-white">₹{Math.round(results.totalInterest).toLocaleString()}</span> in interest could have bought you:
                        </p>
                        <p className="text-2xl font-bold text-emerald-400 mt-1">{opportunity.item}</p>
                    </div>
                </motion.div>
            )}
        </div>

    );
}


