import React, { useState } from "react";
import { motion } from "framer-motion";

const colors = {
  bg: "#060708",
  panel: "#0b0f12",
  red: "#e94132",
  blue: "#2882ff",
  text: "#f9fafb",
  sub: "#9ca3af",
};

const Stat = ({ label, value }) => (
  <div className="flex flex-col items-center gap-1 rounded-2xl bg-white/5 px-6 py-4 border border-white/10">
    <div className="text-3xl font-extrabold tracking-tight text-white">{value}</div>
    <div className="text-xs uppercase tracking-[0.2em] text-white/60">{label}</div>
  </div>
);

const Step = ({ num, title, text }) => (
  <div className="rounded-2xl border border-white/10 bg-[#101319] p-6">
    <div className="text-sm font-bold text-white/70">{String(num).padStart(2, "0")}</div>
    <div className="mt-2 text-xl font-semibold text-white">{title}</div>
    <p className="mt-2 text-white/70 leading-relaxed">{text}</p>
  </div>
);

function TreeNode({ node }) {
  return (
    <div className="inline-flex min-w-[180px] flex-col items-center">
      <div className="rounded-2xl border border-white/15 bg-[#101319] px-4 py-3 text-center shadow">
        <div className="text-xs text-white/60">{node.role || "Member"}</div>
        <div className="text-base font-semibold text-white">{node.name}</div>
        <div className="text-xs text-white/60">Vol: {node.volume}</div>
      </div>
      {node.children && node.children.length > 0 && (
        <div className="mt-5">
          <div className="flex items-start justify-center gap-6">
            {node.children.map((child, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="h-6 w-[2px] bg-white/10" />
                <TreeNode node={child} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const sampleTree = {
  role: "You",
  name: "Marco",
  volume: 2400,
  children: [
    {
      role: "Left Sponsor",
      name: "Jane Smith",
      volume: 1260,
      children: [
        {
          role: "L2",
          name: "Carlos Garcia",
          volume: 620,
          children: [
            { role: "L3", name: "K. Lee", volume: 300 },
            { role: "L3", name: "T. Owens", volume: 220 },
          ],
        },
        { role: "L2", name: "Pending", volume: 0 },
      ],
    },
    {
      role: "Right Sponsor",
      name: "Susan Wilson",
      volume: 1320,
      children: [
        {
          role: "L2",
          name: "Donse Dors",
          volume: 540,
          children: [{ role: "L3", name: "R. Patel", volume: 180 }],
        },
        { role: "L2", name: "Emma Devis", volume: 610 },
      ],
    },
  ],
};

const PAYOUT_RULES = {
  bvPerReferral: 100,
  pairBV: 200,
  payoutPerCycle: 20,
  fastStartPerDirect: 25,
  matchingPct: 0.1,
};

function sumVolume(node) {
  if (!node) return 0;
  const self = Number(node.volume || 0);
  const kids = (node.children || []).reduce((acc, c) => acc + sumVolume(c), 0);
  return self + kids;
}

function estimateBinary(tree) {
  const left = tree.children?.[0];
  const right = tree.children?.[1];
  const leftVol = sumVolume(left);
  const rightVol = sumVolume(right);
  const sideBVPerPair = PAYOUT_RULES.pairBV / 2;
  const matchedPairs = Math.floor(Math.min(leftVol, rightVol) / sideBVPerPair);
  const estBinaryBonus = matchedPairs * PAYOUT_RULES.payoutPerCycle;
  const carryLeft = Math.max(0, leftVol - matchedPairs * sideBVPerPair);
  const carryRight = Math.max(0, rightVol - matchedPairs * sideBVPerPair);
  return { leftVol, rightVol, matchedPairs, estBinaryBonus, carryLeft, carryRight };
}

function estimateFastStart(directs) {
  return directs * PAYOUT_RULES.fastStartPerDirect;
}

function estimateMatching(directBinaryBonuses) {
  const totalDirectBinary = directBinaryBonuses.reduce((a, b) => a + b, 0);
  return totalDirectBinary * PAYOUT_RULES.matchingPct;
}

export default function App() {
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [acceptedSignupTerms, setAcceptedSignupTerms] = useState(false);

  return (
    <div
      className="min-h-screen w-full text-white"
      style={{
        background:
          "radial-gradient(1400px 800px at 20% -10%, rgba(233,65,50,0.20), transparent 60%), radial-gradient(1000px 600px at 80% 0%, rgba(40,130,255,0.18), transparent 60%), #050608",
      }}
    >
            {!acceptedLegal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur">
          <div className="mx-4 max-w-xl rounded-2xl border border-white/15 bg-[#050608] p-6 text-sm text-white/80 shadow-[0_24px_80px_rgba(0,0,0,0.85)]">
            <h2 className="text-lg font-semibold text-white">
              Risk Disclosure, No-Refund Policy & Dispute Waiver
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-white/70">
              Trading foreign exchange, indices, crypto and other leveraged products involves
              significant risk. You can lose some, all, or more than the capital you deposit.
              GeminiFX does not guarantee profits, results, or performance. Past performance does
              not guarantee future returns. All tools, bots, analytics and information are provided
              for educational and informational purposes only and are not financial advice.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-white/70">
              All purchases are final after a 5-hour grace period from the time of purchase. After
              5 hours, no refunds will be issued for any reason. By creating an account, connecting
              your bot, linking a broker, or using the GeminiFX system, you acknowledge and accept
              the risks, the zero-refund policy, and that you are solely responsible for all
              trading decisions and outcomes.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-white/70">
              By proceeding, you also waive your right to file chargebacks or disputes with your
              bank, card issuer, payment processor or financial institution related to performance,
              expectations, losses, product satisfaction, or digital service delivery. Any
              questions or concerns must be handled directly with GeminiFX support.
            </p>
            <p className="mt-3 text-[11px] leading-relaxed text-white/60">
              By clicking &quot;I Understand and Accept&quot; and continuing to use GeminiFX or
              connecting any trading account, you automatically acknowledge and agree to all risk
              disclosures, no-refund terms, and the dispute/chargeback waiver.
            </p>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setAcceptedLegal(true)}
                className="rounded-xl bg-[#e94132] px-5 py-2 text-xs font-semibold uppercase tracking-wide hover:opacity-90"
              >
                I Understand and Accept
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/50 bg-black/60 border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-[#e94132] to-[#2882ff] grid place-items-center shadow-lg">
              <span className="font-black text-black/90 text-xl">Ⅱ</span>
            </div>
            <div className="text-2xl font-extrabold tracking-tight">
              <span className="text-white">GEMINI</span>
              <span className="text-[#2882ff]">FX</span>
            </div>
          </div>
          <nav className="hidden items-center gap-8 md:flex text-sm">
            <a className="hover:text-white text-white/80" href="#hero">
              How It Works
            </a>
            <a className="hover:text-white text-white/80" href="#pricing">
              Pricing
            </a>
            <a className="hover:text-white text-white/80" href="#connect">
              Connect Bot
            </a>
            <a className="hover:text-white text-white/80" href="#education">
              Education
            </a>
            <a className="hover:text-white text-white/80" href="#dashboard">
              Dashboard
            </a>
            <a className="hover:text-white text-white/80" href="#accounts">
              Bot Progress
            </a>
            <a className="hover:text-white text-white/80" href="#backoffice">
              Back Office
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
              Login
            </button>
            <button className="rounded-xl bg-[#e94132] px-4 py-2 text-sm font-semibold hover:opacity-90">
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <section id="hero" className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-extrabold leading-[1.1] md:text-6xl text-white">
              Automate trades.
              <br />
              <span className="text-white">Earn with referrals.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/70">
              Plug into the GeminiFX bot, track performance in real-time, and grow with a simple two-leg referral plan.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#signup"
                className="rounded-2xl bg-[#e94132] px-6 py-3 font-semibold hover:opacity-90"
              >
                Get Started
              </a>
              <a
                href="#pricing"
                className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-semibold hover:bg-white/10"
              >
                View Pricing
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <Stat label="USERS" value="268K+" />
              <Stat label="TOTAL TRADES" value="12.4M" />
              <Stat label="YEARS IN OPERATION" value="3" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-[32px] border border-white/10 bg-black/40 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.65)]"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#e94132] to-[#2882ff] grid place-items-center">
                <span className="text-lg font-black text-black/90">Ⅱ</span>
              </div>
              <div>
                <div className="text-xs font-semibold tracking-[0.2em] text-white/50 uppercase">
                  GeminiFX
                </div>
                <div className="text-xl font-bold text-white">Referral Wallet</div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-xs text-white/60">Daily Earnings</div>
                <div className="mt-2 text-2xl font-bold text-white">$125.00</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-xs text-white/60">Weekly Earnings</div>
                <div className="mt-2 text-2xl font-bold text-white">$750.00</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-xs text-white/60">Monthly Earnings</div>
                <div className="mt-2 text-2xl font-bold text-white">$3,400.00</div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="text-xs font-semibold tracking-[0.2em] text-white/50 uppercase">
                Referral link
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-[#05070b] px-4 py-3 border border-white/10">
                <span className="truncate text-sm text-white/70">
                  https://example.com/r/yourcode
                </span>
                <button className="ml-auto rounded-xl bg-white/10 px-3 py-1 text-xs font-medium text-white hover:bg-white/20">
                  Copy
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-xs text-white/60">Left Volume</div>
                <div className="mt-2 text-3xl font-bold text-white">1,200</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-xs text-white/60">Right Volume</div>
                <div className="mt-2 text-3xl font-bold text-white">1,200</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="how"
        className="border-t border-white/10 bg-gradient-to-b from-transparent via-black/40 to-black/80"
      >
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                SIMPLE 4-STEP FLOW
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">How GeminiFX Works</h2>
              <p className="mt-3 max-w-xl text-white/70">
                From account creation to automated trading and binary earnings, every step is designed
                to be plug-and-play—even if you're brand new to trading.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-4">
            <Step
              num={1}
              title="Create Account"
              text="Sign up and secure your GeminiFX account in a few clicks."
            />
            <Step
              num={2}
              title="Fund & Connect"
              text="Link your broker, choose your risk profile, and connect the bot."
            />
            <Step
              num={3}
              title="Activate Bot"
              text="Turn on auto-trading and let the strategy execute with discipline."
            />
            <Step
              num={4}
              title="Earn Commissions"
              text="Share your link and earn on direct referrals and team volume."
            />
          </div>
        </div>
      </section>

      <section id="pricing" className="border-t border-white/10 bg-black/90">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                PRICING
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
                Two memberships. One engine.
              </h2>
              <p className="mt-3 max-w-xl text-white/70">
                The $100 plan gives you the GeminiFX bot. The $125 Affiliate plan unlocks the
                full referral system and overrides so you can build a team.
              </p>

            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="flex flex-col rounded-3xl border border-white/12 bg-gradient-to-b from-white/5 to-black/60 p-8">
              <div className="text-sm font-semibold text-white/70">User</div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white">$100</span>
                <span className="text-sm text-white/60">/ month</span>
              </div>
              <p className="mt-3 text-sm text-white/70">
                Full access to the GeminiFX trading bot and performance dashboard.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-white/70">
                <li>· GeminiFX automated trading bot</li>
                <li>· Risk profiles & dynamic scaling</li>
                <li>· Live performance analytics dashboard</li>
                <li>· No referral requirements</li>
              </ul>

              <button className="mt-8 rounded-2xl bg-[#e94132] px-5 py-3 text-sm font-semibold hover:opacity-90">
                Get Started
              </button>
            </div>

            <div className="flex flex-col rounded-3xl border border-[#e94132]/80 bg-gradient-to-b from-[#1c1110] via-[#110808] to-black/90 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.75)]">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e94132]/40 bg-[#e94132]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#e94132]">
                Most popular
              </div>
              <div className="mt-4 text-sm font-semibold text-white/80">Affiliate</div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white">$125</span>
                <span className="text-sm text-white/60">/ month</span>
              </div>
              <p className="mt-3 text-sm text-white/70">
                Everything in the User plan, plus the ability to build a team and earn from the network side of GeminiFX.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-white/75">
                <li>· Direct referral commissions on active users</li>
                <li>· Left / right leg volume tracking</li>
                <li>· Binary cycles and matching bonus structure</li>
                <li>· Affiliate back office + education calls</li>
              </ul>
              <button className="mt-8 rounded-2xl bg-[#e94132] px-5 py-3 text-sm font-semibold hover:opacity-90">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="dashboard" className="border-t border-white/10 bg-black">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                LIVE SNAPSHOT
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">Referral dashboard</h2>
              <p className="mt-3 max-w-xl text-white/70">
                See your left and right teams, current cycles, and estimated payouts in one
                simplified view that mirrors what&apos;s happening in real time.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-black/70 p-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/70">
                Live Binary Tree (Sample)
              </div>
              <div className="mt-6 overflow-x-auto pb-4">
                <div className="flex justify-center">
                  <TreeNode node={sampleTree} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-[#090c11] p-5">
                <h3 className="text-sm font-semibold text-white">Binary Snapshot</h3>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-white/60">Left Volume</div>
                    <div className="text-xl font-bold text-white">1,200 BV</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/60">Right Volume</div>
                    <div className="text-xl font-bold text-white">1,200 BV</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/60">Current Cycle</div>
                    <div className="text-lg font-semibold text-white">12 pairs</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/60">Est. Binary Bonus</div>
                    <div className="text-lg font-semibold text-[#e94132]">$240</div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#090c11] p-5">
                <h3 className="text-sm font-semibold text-white">Fast Start & Matching</h3>
                <div className="mt-4 space-y-2 text-sm text-white/70">
                  <div className="flex justify-between">
                    <span>Direct Fast Start (this week)</span>
                    <span className="font-semibold text-white">$150</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1st Level Matching (10%)</span>
                    <span className="font-semibold text-white">$45</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="accounts" className="border-t border-white/10 bg-black">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                BOT PROGRESS
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
                Track every GeminiFX bot in one view.
              </h2>
              <p className="mt-3 max-w-xl text-white/70">
                See equity, daily PnL, and account status across all connected brokers and prop
                accounts.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs text-white/60">Total Equity</div>
              <div className="mt-2 text-3xl font-bold text-white">$54,720</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs text-white/60">Today&apos;s PnL</div>
              <div className="mt-2 text-3xl font-bold text-emerald-400">+ $1,240</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs text-white/60">This Week</div>
              <div className="mt-2 text-3xl font-bold text-emerald-400">+ $4,980</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs text-white/60">Running Bots</div>
              <div className="mt-2 text-3xl font-bold text-white">3</div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              {
                broker: "GenesisFX Markets",
                platform: "MT5",
                accountId: "GF-271930",
                balance: "$12,400",
                equity: "$13,050",
                today: "+$320",
                status: "Running",
              },
              {
                broker: "FTMO",
                platform: "Challenge",
                accountId: "FT-Express-100K",
                balance: "$102,380",
                equity: "$104,120",
                today: "+$740",
                status: "Running",
              },
              {
                broker: "IC Markets",
                platform: "MT4",
                accountId: "IC-883102",
                balance: "$4,800",
                equity: "$4,550",
                today: "-$120",
                status: "Paused",
              },
            ].map((acc) => (
              <div
                key={acc.accountId}
                className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-black/80 p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-white/60">{acc.broker}</div>
                    <div className="text-lg font-semibold text-white">{acc.accountId}</div>
                    <div className="text-xs text-white/50">Platform: {acc.platform}</div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      acc.status === "Running"
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-yellow-500/15 text-yellow-300"
                    }`}
                  >
                    {acc.status}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-black/40 p-3">
                    <div className="text-xs text-white/60">Balance</div>
                    <div className="text-base font-bold text-white">{acc.balance}</div>
                  </div>
                  <div className="rounded-xl bg-black/40 p-3">
                    <div className="text-xs text-white/60">Equity</div>
                    <div className="text-base font-bold text-white">{acc.equity}</div>
                  </div>
                  <div className="rounded-xl bg-black/40 p-3">
                    <div className="text-xs text-white/60">Today&apos;s PnL</div>
                    <div className="text-base font-bold text-white">{acc.today}</div>
                  </div>
                  <div className="rounded-xl bg-black/40 p-3">
                    <div className="text-xs text-white/60">Bot Mode</div>
                    <div className="text-base font-bold text-white">Auto</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-[11px] text-white/60">
                  <span>Last sync: 2 min ago</span>
                  <button className="rounded-lg bg-white/10 px-3 py-1 hover:bg-white/20">
                    View history
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-[11px] text-white/50">
            *In production, these numbers come directly from the GeminiFX master bot and broker APIs
            (MT4/MT5/TradeLocker/prop firms).*
          </p>
        </div>
      </section>

      {/* ================= BACK OFFICE / GENEALOGY ================= */}
<section
  id="backoffice"
  className="border-t border-white/10 bg-gradient-to-b from-black via-[#050612] to-black py-16"
>
  <div className="mx-auto max-w-7xl px-4">
    {/* Header */}
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400/80">
          Live snapshot
        </p>
        <h2 className="mt-2 text-3xl font-bold md:text-4xl text-white">
          Referral dashboard
        </h2>
        <p className="mt-3 max-w-xl text-sm text-white/70">
          See your left and right teams, current cycles, and estimated payouts in a
          simplified view that mirrors the live back office.
        </p>
      </div>

      <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 backdrop-blur">
        <span className="mr-2 inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        Demo data · for illustration only
      </div>
    </div>

    {/* Layout: tree + side cards */}
    <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      {/* LEFT: Binary tree */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#08040f] via-[#05040a] to-[#160306] p-6 shadow-[0_0_40px_rgba(0,0,0,0.7)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-white/60">
              Live binary tree <span className="text-white/40">(sample)</span>
            </p>
            <p className="mt-2 text-xs text-white/60">
              Preview of how your placements stack in the left and right legs.
            </p>
          </div>
          <div className="rounded-full bg-black/40 px-3 py-1 text-[11px] text-white/60">
            Depth preview:{' '}
            <span className="font-semibold text-white/80">2 levels</span>
          </div>
        </div>

        {/* Tree */}
        <div className="mt-10 flex flex-col items-center gap-10">
          {/* YOU */}
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full border border-sky-500/70 bg-sky-500/10 px-5 py-2 text-[11px] font-medium uppercase tracking-wide text-sky-200">
              You
            </div>
            <div className="rounded-2xl border border-sky-500/40 bg-black/70 px-6 py-3 text-center shadow-lg shadow-black/60 backdrop-blur">
              <div className="text-sm font-semibold text-white">Marco</div>
              <div className="mt-1 text-xs text-sky-200/80">Vol: 2400</div>
            </div>
          </div>

          {/* LEVEL 1 */}
          <div className="flex w-full max-w-3xl flex-col items-center gap-6 md:flex-row md:justify-between">
            {/* Left sponsor */}
            <div className="flex flex-col items-center gap-2">
              <p className="text-[11px] uppercase tracking-[0.2em] text-red-300/80">
                Left sponsor
              </p>
              <div className="rounded-2xl border border-red-500/60 bg-red-500/10 px-6 py-3 text-center shadow-lg shadow-red-900/60 backdrop-blur">
                <div className="text-sm font-semibold text-white">Jane Smith</div>
                <div className="mt-1 text-xs text-red-100/80">Vol: 1260</div>
              </div>
            </div>

            {/* Right sponsor */}
            <div className="flex flex-col items-center gap-2">
              <p className="text-[11px] uppercase tracking-[0.2em] text-sky-300/80">
                Right sponsor
              </p>
              <div className="rounded-2xl border border-sky-500/60 bg-sky-500/10 px-6 py-3 text-center shadow-lg shadow-sky-900/50 backdrop-blur">
                <div className="text-sm font-semibold text-white">Susan Wilson</div>
                <div className="mt-1 text-xs text-sky-100/80">Vol: 1320</div>
              </div>
            </div>
          </div>

          {/* LEVEL 2 */}
          <div className="grid w-full max-w-3xl gap-4 md:grid-cols-4">
            {/* Carlos */}
            <div className="rounded-2xl border border-red-500/40 bg-red-500/5 px-4 py-3 text-center text-xs text-white/80 shadow-md shadow-red-900/40 backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.2em] text-red-300/80">
                L2 • Left
              </p>
              <p className="mt-1 text-sm font-semibold text-white">Carlos Garcia</p>
              <p className="mt-1 text-[11px] text-red-100/80">Vol: 620</p>
            </div>

            {/* Pending */}
            <div className="rounded-2xl border border-amber-400/70 bg-amber-500/10 px-4 py-3 text-center text-xs text-amber-50 shadow-md shadow-amber-900/40 backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.2em] text-amber-200">
                L2 • Pending
              </p>
              <p className="mt-1 text-sm font-semibold">Pending</p>
              <p className="mt-1 text-[11px] text-amber-100/80">Vol: 0</p>
            </div>

            {/* Donse */}
            <div className="rounded-2xl border border-sky-500/40 bg-sky-500/5 px-4 py-3 text-center text-xs text-white/80 shadow-md shadow-sky-900/40 backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.2em] text-sky-300/80">
                L2 • Right
              </p>
              <p className="mt-1 text-sm font-semibold text-white">Donse Dors</p>
              <p className="mt-1 text-[11px] text-sky-100/80">Vol: 540</p>
            </div>

            {/* Emma */}
            <div className="rounded-2xl border border-emerald-400/50 bg-emerald-500/5 px-4 py-3 text-center text-xs text-white/80 shadow-md shadow-emerald-900/40 backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-200">
                L2 • Right
              </p>
              <p className="mt-1 text-sm font-semibold text-white">Emma Davis</p>
              <p className="mt-1 text-[11px] text-emerald-100/80">Vol: 550</p>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-white/40">
            Deeper levels will be visible inside the full back office.
          </p>
        </div>
      </div>

      {/* RIGHT: Snapshot cards */}
      <div className="flex flex-col gap-6">
        {/* Binary snapshot */}
        <div className="rounded-3xl border border-sky-500/40 bg-gradient-to-br from-[#020816] via-[#020b18] to-black p-6 shadow-[0_0_30px_rgba(15,118,255,0.35)]">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300/80">
            Binary snapshot
          </p>
          <p className="mt-2 text-xs text-white/70">
            Quick view of volume, current cycle, and estimated binary bonus.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-4 text-sm text-white/80">
            <div>
              <p className="text-xs text-white/60">Left volume</p>
              <p className="mt-1 text-lg font-semibold text-sky-100">1,200 BV</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/60">Right volume</p>
              <p className="mt-1 text-lg font-semibold text-sky-100">1,200 BV</p>
            </div>
            <div>
              <p className="text-xs text-white/60">Current cycle</p>
              <p className="mt-1 text-base font-semibold text-white">12 pairs</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/60">Est. binary bonus</p>
              <p className="mt-1 text-base font-semibold text-red-400">$240</p>
            </div>
          </div>
        </div>

        {/* Fast start & matching */}
        <div className="rounded-3xl border border-red-500/40 bg-gradient-to-br from-[#190306] via-[#140205] to-black p-6 shadow-[0_0_30px_rgba(248,113,113,0.35)]">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-300/80">
            Fast start &amp; matching
          </p>
          <p className="mt-2 text-xs text-white/70">
            Estimated weekly income from directs and first-level matching.
          </p>

          <dl className="mt-5 space-y-3 text-sm text-white/80">
            <div className="flex items-center justify-between">
              <dt>Direct Fast Start (this week)</dt>
              <dd className="font-semibold">$150</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>1st Level Matching (10%)</dt>
              <dd className="font-semibold">$45</dd>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
              <dt className="text-xs uppercase tracking-[0.25em] text-emerald-200">
                Est. weekly total
              </dt>
              <dd className="text-lg font-semibold text-emerald-300">$195</dd>
            </div>
          </dl>

          <p className="mt-3 text-[11px] text-white/50">
            Actual payouts depend on live volume, plan rules, and your connected payout
            method.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

      <section id="signup" className="border-t border-white/10 bg-gradient-to-b from-black to-[#07080b]">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
              SIGN UP / CHECKOUT
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
              Pick your membership and activate your seat.
            </h2>
            <p className="mt-3 text-white/70">
              The GeminiFX bot is the core engine. The Affiliate layer simply lets you earn while the
              engine runs.
            </p>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)]">
            <div className="space-y-4 rounded-3xl border border-white/10 bg-[#090c11] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                    STANDARD
                  </div>
                  <div className="mt-2 text-2xl font-bold text-white">$100 / month</div>
                  <div className="text-xs text-white/60">GeminiFX Bot</div>
                </div>
              </div>

              <div className="h-px bg-white/10" />

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e94132]">
                    MVP MEMBERSHIP
                  </div>
                  <div className="mt-2 text-2xl font-bold text-white">$125 / month</div>
                  <div className="text-xs text-white/60">
                    GeminiFX Bot + Referral System + Education
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 rounded-3xl border border-white/10 bg-[#090c11] p-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                  Personal information
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <input
                    className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#2882ff] focus:ring-1 focus:ring-[#2882ff]"
                    placeholder="Full Name"
                  />
                  <input
                    className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#2882ff] focus:ring-1 focus:ring-[#2882ff]"
                    placeholder="Email Address"
                  />
                  <input
                    type="password"
                    className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#2882ff] focus:ring-1 focus:ring-[#2882ff]"
                    placeholder="Password"
                  />
                  <input
                    type="password"
                    className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#2882ff] focus:ring-1 focus:ring-[#2882ff]"
                    placeholder="Confirm Password"
                  />
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                  Payment details
                </div>
                <div className="mt-3 space-y-3">
                  <input
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#2882ff] focus:ring-1 focus:ring-[#2882ff]"
                    placeholder="Card Number"
                  />
                  <div className="grid grid-cols-[1fr_auto] gap-3 md:grid-cols-[1fr_0.8fr]">
                    <input
                      className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#2882ff] focus:ring-1 focus:ring-[#2882ff]"
                      placeholder="MM / YY"
                    />
                    <input
                      className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#2882ff] focus:ring-1 focus:ring-[#2882ff]"
                      placeholder="CVC"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-start gap-2 text-xs text-white/70">
                <input
                  type="checkbox"
                  id="acceptSignupTerms"
                  className="mt-[3px] h-4 w-4 rounded border border-white/40 bg-black/60"
                  checked={acceptedSignupTerms}
                  onChange={(e) => setAcceptedSignupTerms(e.target.checked)}
                />
                <label htmlFor="acceptSignupTerms" className="leading-relaxed">
                  I have read and understand the GeminiFX risk disclosure, acknowledge that I can
                  lose all funds I deposit, accept the zero-refund policy after 5 hours, and waive
                  my right to file chargebacks or disputes with my bank or payment provider related
                  to this product or service.
                </label>
              </div>

              <button className="w-full rounded-2xl bg-[#e94132] py-3 text-sm font-semibold uppercase tracking-wide hover:opacity-90">
                Sign Up
              </button>
              <p className="text-center text-[11px] text-white/60">
                By signing up, you confirm you understand the risks of trading, accept the
                zero-refund policy after 5 hours, and waive your right to submit chargebacks or
                disputes related to GeminiFX services.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black/90 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm text-white/60">
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
            <p>© {new Date().getFullYear()} GeminiFX — All rights reserved.</p>
            <div className="flex items-center gap-6 text-xs">
              <span>VISA</span>
              <span>SSL Secure</span>
              <span>Privacy</span>
            </div>
          </div>
          <p className="text-[11px] leading-relaxed text-white/55">
            Trading involves risk. You can lose all funds you deposit. GeminiFX does not guarantee
            profits or performance. All sales are final after a 5-hour grace period — no refunds.
            By using GeminiFX, connecting your bot, or accessing any tools, you automatically accept
            all risk disclosures, the zero-refund policy, and waive your right to file chargebacks
            or disputes related to GeminiFX products or services.
          </p>
        </div>
      </footer>
    </div>
  );
}
