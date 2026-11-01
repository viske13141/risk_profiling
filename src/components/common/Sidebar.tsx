/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  UserCheck,
  FileText,
  PieChart,
  Target,
  Sliders,
  FolderOpen,
  Building2,
  Users2,
  FileCheck2,
  Scale,
  Bell,
  Settings,
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  CreditCard,
  History,
  TrendingUp,
  BarChart3,
  Kanban,
  CheckSquare,
  Megaphone,
  Briefcase,
  PhoneCall,
  UserPlus,
  HelpCircle,
} from 'lucide-react';
import { Role } from '../../types/investor';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeColor?: string;
}

interface SidebarProps {
  currentRole: Role;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  pendingKycCount?: number;
  pendingAmlCount?: number;
  pendingConsentCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activeTab,
  onTabChange,
  pendingKycCount = 2,
  pendingAmlCount = 1,
  pendingConsentCount = 1,
}) => {
  const getNavItems = (): NavItem[] => {
    switch (currentRole) {
      case 'customer':
        return [
          { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'onboarding', label: 'Investor Onboarding', icon: <UserCheck className="w-4 h-4" />, badge: 'Flow' },
          { id: 'my-kyc', label: 'My KYC', icon: <FileText className="w-4 h-4" /> },
          { id: 'financial-profile', label: 'Financial Profile', icon: <PieChart className="w-4 h-4" />, badge: 'B1–B9' },
          { id: 'investment-goals', label: 'Investment Goals', icon: <Target className="w-4 h-4" /> },
          { id: 'risk-assessment', label: 'Risk Assessment', icon: <Sliders className="w-4 h-4" />, badge: 'D1–D12', badgeColor: 'bg-blue-100 text-blue-700' },
          { id: 'my-risk-profile', label: 'My Risk Profile', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'documents', label: 'Documents', icon: <FolderOpen className="w-4 h-4" /> },
          { id: 'bank-accounts', label: 'Bank Accounts', icon: <CreditCard className="w-4 h-4" /> },
          { id: 'nominees', label: 'Nominees', icon: <Users2 className="w-4 h-4" /> },
          { id: 'consent', label: 'Consent & Declarations', icon: <FileCheck2 className="w-4 h-4" /> },
          { id: 'suitability', label: 'Investment Suitability', icon: <Scale className="w-4 h-4" /> },
          { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
          { id: 'profile-settings', label: 'Profile & Settings', icon: <Settings className="w-4 h-4" /> },
        ];

      case 'admin':
        return [
          { id: 'admin-overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'investor-management', label: 'Investor Management', icon: <Users2 className="w-4 h-4" /> },
          { id: 'kyc-verification', label: 'KYC Verification', icon: <FileCheck className="w-4 h-4" />, badge: pendingKycCount, badgeColor: 'bg-amber-100 text-amber-800' },
          { id: 'aml-compliance', label: 'AML & Compliance', icon: <AlertTriangle className="w-4 h-4" />, badge: pendingAmlCount, badgeColor: 'bg-rose-100 text-rose-700' },
          { id: 'risk-oversight', label: 'Risk Profile Oversight', icon: <Sliders className="w-4 h-4" /> },
          { id: 'suitability-review', label: 'Suitability Review', icon: <Scale className="w-4 h-4" /> },
          { id: 'adviser-overrides', label: 'Adviser Overrides', icon: <ShieldCheck className="w-4 h-4" /> },
          { id: 'consent-management', label: 'Consent & Declarations', icon: <FileCheck2 className="w-4 h-4" /> },
          { id: 'reassessment-management', label: 'Reassessment Mgmt', icon: <History className="w-4 h-4" /> },
          { id: 'reports-analytics', label: 'Reports & Analytics', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'risk-engine-tests', label: 'Risk Engine Verification', icon: <CheckSquare className="w-4 h-4" />, badge: '15 Tests', badgeColor: 'bg-emerald-100 text-emerald-800' },
          { id: 'audit-logs', label: 'Audit Logs', icon: <FileText className="w-4 h-4" /> },
        ];

      case 'crm':
        return [
          { id: 'crm-dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'investor-leads', label: 'Investor Leads', icon: <UserPlus className="w-4 h-4" /> },
          { id: 'investor-pipeline', label: 'Kanban Pipeline', icon: <Kanban className="w-4 h-4" />, badge: '12 Stages', badgeColor: 'bg-blue-100 text-blue-700' },
          { id: 'crm-investor-360', label: 'Investor 360', icon: <Users2 className="w-4 h-4" /> },
          { id: 'activities-tasks', label: 'Activities & Tasks', icon: <CheckSquare className="w-4 h-4" /> },
          { id: 'campaign-management', label: 'Campaigns', icon: <Megaphone className="w-4 h-4" /> },
          { id: 'conversion-analytics', label: 'Conversion Analytics', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'crm-reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
        ];

      case 'sales':
        return [
          { id: 'sales-overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'my-leads', label: 'My Investor Leads', icon: <Users2 className="w-4 h-4" /> },
          { id: 'onboarding-tracker', label: 'Onboarding Tracker', icon: <Target className="w-4 h-4" /> },
          { id: 'follow-ups', label: 'Follow-up Management', icon: <PhoneCall className="w-4 h-4" /> },
          { id: 'customer-assistance', label: 'Customer Assistance', icon: <HelpCircle className="w-4 h-4" /> },
          { id: 'sales-performance', label: 'Performance', icon: <TrendingUp className="w-4 h-4" /> },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-80px)]">
      {/* Module Title */}
      <div className="p-4 border-b border-slate-200/80 bg-white/50">
        <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          {currentRole.toUpperCase()} PORTAL
        </div>
        <div className="text-sm font-bold text-slate-800">
          Investing & Wealth Hub
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className={isActive ? 'text-white' : 'text-slate-500'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.badgeColor || 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer info */}
      <div className="p-3 border-t border-slate-200 bg-white/60 text-[11px] text-slate-500">
        <div className="flex items-center justify-between">
          <span>Framework</span>
          <span className="font-semibold text-slate-700">Draft 1.0 (Oct 2026)</span>
        </div>
        <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
          <span>Scored D1–D12 / B1–B9</span>
          <span className="text-emerald-600 font-semibold">Active Engine</span>
        </div>
      </div>
    </aside>
  );
};
