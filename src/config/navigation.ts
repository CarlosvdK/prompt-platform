export const publicNavItems = [
  { label: 'Browse', href: '/browse' },
  { label: 'Categories', href: '/browse?view=categories' },
] as const

export const adminNavItems = [
  { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
  { label: 'Review Queue', href: '/admin/review', icon: 'ClipboardCheck' },
  { label: 'Prompts', href: '/admin/prompts', icon: 'FileText' },
  { label: 'Training', href: '/admin/training', icon: 'Brain' },
  { label: 'Agent Runs', href: '/admin/agents', icon: 'Bot' },
  { label: 'Analytics', href: '/admin/analytics', icon: 'BarChart3' },
  { label: 'Audit Log', href: '/admin/audit', icon: 'ScrollText' },
  { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
] as const
