import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Scale,
  Activity,
  Coins,
  CreditCard,
} from "lucide-react";
import { useTheme } from "../theme.js";

export default function Policy() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#eaf5ee] to-[#f4faf7] dark:from-[#060a07] dark:to-[#0c130d] text-gray-800 dark:text-zinc-100 p-6 md:p-12 relative transition-colors duration-300">
      {/* Top Left Floating Back Controller Button */}
      <div className="max-w-4xl mx-auto mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center p-3 bg-white dark:bg-zinc-900 text-green-700 dark:text-green-400 hover:bg-green-600 hover:text-white rounded-2xl shadow-md border border-green-100/50 dark:border-zinc-800 transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span className="text-xs font-bold uppercase tracking-wider px-2">
            Back to Dashboard
          </span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white/95 dark:bg-[#0c130d]/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-transparent dark:border-green-950/20 overflow-hidden p-8 md:p-12">
        {/* Document Header Deck */}
        <div className="border-b border-gray-100 dark:border-green-950/20 pb-6 mb-8 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-black text-[#2e3a34] dark:text-green-400 tracking-tight">
            Terms of Service & Privacy Policy
          </h1>
          <p className="text-xs text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-widest mt-2">
            NutriCare Legal Operating Matrix • Last Updated: July 2026
          </p>
        </div>

        {/* CRITICAL MEDICAL DISCLAIMER SECTION */}
        <div className="mb-10 p-5 bg-amber-500/10 dark:bg-amber-500/5 border border-dashed border-amber-500/30 rounded-2xl flex items-start gap-4">
          <Scale className="w-8 h-8 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-black text-sm text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              ⚠️ Essential Medical Disclaimer
            </h3>
            <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1 leading-relaxed">
              NutriCare provides AI-generated personalized dietary
              configurations and daily wellness accountability trackers. **We
              are not licensed healthcare providers, medical practitioners, or
              clinical nutritionists.** Our software metrics are provided
              entirely for structural guidance purposes. Always seek direct
              medical confirmation before beginning any sudden metabolic
              adjustments.
            </p>
          </div>
        </div>

        {/* Dynamic Accordion Flow Container */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" /> 1. User Accounts &
              Registration Integrity
            </h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed px-7">
              By confirming your profile initialization settings, you certify
              that all information supplied is completely accurate. Accounts are
              strictly bound to unique validation rules (requiring robust
              characters and standard formats). You maintain total
              responsibility for preserving active session state tokens and
              cookie parameters securely.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" /> 2. AI Generation
              Limits & Quota Matrices
            </h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed px-7">
              Standard tier accounts enjoy access to a baseline tier of up to
              **5 automated personalized meal plan generations per month**. This
              calculation operates strictly within a rolling 30-day window
              lookback tracker. Upon consuming the full monthly generation
              allotment, account generation features will lock down until the
              next rolling renewal timeline checkpoint is met.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Coins className="w-5 h-5 text-green-500" /> 3. Gamification
              Framework & Nutri Points Rules
            </h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed px-7">
              Nutri Points are digital rewards allocated automatically upon
              hitting 100% completion bounds on tracked challenges. Points are
              awarded **exactly once per event milestone**, verified securely by
              backend transaction keys to block multi-claim exploits. Points
              convert into purchase credits based on sliding brackets (up to a
              fixed 50% max allowable premium cap). Applying tokens to purchases
              flushes the token balance to zero instantly upon checking out.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-green-500" /> 4. Payments,
              Subscriptions & Cancellations
            </h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed px-7">
              Premium upgrades are processed securely using Razorpay gateway
              validation systems. A completed purchase unlocks unlimited
              creation capabilities for a clear **30-day validation window**.
              Once that timer expires, accounts are automatically scaled back to
              standard free tiers, resetting counters based on the user's last
              generation timestamps. All data collections match modern cloud
              token safety laws.
            </p>
          </section>
        </div>

        {/* Footer legal close out banner */}
        <div className="mt-12 pt-6 border-t border-gray-100 dark:border-green-950/20 text-center">
          <p className="text-xs text-gray-400 dark:text-zinc-500">
            By creating an account inside NutriCare, you recognize that you have
            read, understood, and consented to these operating limits
            completely.
          </p>
        </div>
      </div>
    </div>
  );
}
