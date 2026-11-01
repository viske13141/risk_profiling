/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Bell,
  Users,
  Briefcase,
  UserCheck,
  Layers,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
} from 'lucide-react';
import { Role, Investor } from '../../types/investor';
import { investingStore } from '../../services/investingState';

interface HeaderProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  investors: Investor[];
  activeInvestor: Investor;
  onInvestorChange: (investorId: string) => void;
  toggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  investors,
  activeInvestor,
  onInvestorChange,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showInvestorMenu, setShowInvestorMenu] = useState(false);

  // Generate notifications based on role & active investor
  const notifications = [
    {
      id: '1',
      title: 'KYC Additional Info Required',
      description: 'Dr. Meenakshi Sundaram has a flagged PAN scan requiring review.',
      time: '15m ago',
      type: 'warning',
    },
    {
      id: '2',
      title: 'Risk Assessment Submitted',
      description: 'Vikramaditya Singhania submitted 12/12 risk questions.',
      time: '1h ago',
      type: 'info',
    },
    {
      id: '3',
      title: 'PEP Compliance Flag',
      description: 'Aarav Builders & Developers LLP requires Enhanced Due Diligence (EDD).',
      time: '3h ago',
      type: 'alert',
    },
  ];

  const roleLabels: Record<Role, { label: string; icon: React.ReactNode; desc: string }> = {
    customer: {
      label: 'Customer',
      icon: <Users className="w-3.5 h-3.5 text-blue-600" />,
      desc: 'Investor Onboarding & Portal',
    },
    admin: {
      label: 'Admin',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />,
      desc: 'KYC, AML & Risk Oversight',
    },
    crm: {
      label: 'CRM',
      icon: <Layers className="w-3.5 h-3.5 text-emerald-600" />,
      desc: 'Pipeline & Lead Acquisition',
    },
    sales: {
      label: 'Sales / DSA',
      icon: <Briefcase className="w-3.5 h-3.5 text-purple-600" />,
      desc: 'Assigned Leads & Tracker',
    },
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner / Development Role Switcher Bar */}
      <div className="bg-slate-900 text-slate-100 px-4 py-1.5 flex flex-wrap items-center justify-between text-xs border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
            PREVIEW ONLY
          </span>
          <span className="text-slate-300 hidden sm:inline">
            Development Role Switcher:
          </span>
          <div className="inline-flex rounded-md shadow-xs bg-slate-800 p-0.5 border border-slate-700">
            {(['customer', 'admin', 'crm', 'sales'] as Role[]).map((role) => (
              <button
                key={role}
                onClick={() => onRoleChange(role)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  currentRole === role
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                {roleLabels[role].icon}
                <span>{roleLabels[role].label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Global Active Investor Switcher */}
        <div className="flex items-center gap-3 mt-1 sm:mt-0">
          <div className="relative">
            <button
              onClick={() => setShowInvestorMenu(!showInvestorMenu)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded border border-slate-700 text-xs transition"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Viewing Investor:</span>
              <span className="font-semibold text-white max-w-[130px] sm:max-w-[180px] truncate">
                {activeInvestor.name}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showInvestorMenu && (
              <div className="absolute right-0 mt-1 w-72 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1.5 z-50">
                <div className="px-3 py-1 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Select Active Investor Persona
                </div>
                {investors.map((inv) => (
                  <button
                    key={inv.id}
                    onClick={() => {
                      onInvestorChange(inv.id);
                      setShowInvestorMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                      activeInvestor.id === inv.id ? 'bg-blue-50/70 text-blue-700 font-semibold' : ''
                    }`}
                  >
                    <div>
                      <div className="font-medium text-slate-900">{inv.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {inv.investorCategory} • KYC: {inv.kycStatus}
                      </div>
                    </div>
                    {activeInvestor.id === inv.id && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold tracking-tight text-lg shadow-sm">
            <span className="text-blue-400">L</span>V
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
                LENDRIX VENTECH
              </span>
              <span className="bg-blue-100 text-blue-800 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                Wealth Management
              </span>
            </div>
            <div className="text-[11px] text-slate-500 hidden sm:block">
              Institutional Investor Onboarding, AML Review & Risk Profiling Platform
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Current Role Indicator Pill */}
          <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-500">Active Role:</span>
            <span className="font-semibold text-slate-800">{roleLabels[currentRole].label}</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-500 text-[11px]">{roleLabels[currentRole].desc}</span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                  <div className="font-semibold text-xs text-slate-900">
                    System Alerts & Notifications
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                    3 New
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-slate-50 transition text-xs">
                      <div className="flex items-start gap-2">
                        {n.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        ) : n.type === 'alert' ? (
                          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        ) : (
                          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="font-semibold text-slate-800">{n.title}</div>
                          <div className="text-slate-600 mt-0.5 text-[11px]">{n.description}</div>
                          <div className="text-[10px] text-slate-400 mt-1">{n.time}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center text-xs shadow-xs">
              {currentRole === 'customer'
                ? activeInvestor.name.substring(0, 2).toUpperCase()
                : currentRole === 'admin'
                ? 'AD'
                : currentRole === 'crm'
                ? 'CR'
                : 'SA'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
