// Shared, framework-free data for the Aegis governance hero.
// fx/fy = fallback label position (% of stage) when WebGL is unavailable.

export const GOV_NODES = [
  {
    id: 'risk',
    label: 'Risk Visibility',
    short: 'Risk',
    desc: 'Brings enterprise risks into one prioritised view across business units.',
    fx: 20, fy: 30,
  },
  {
    id: 'controls',
    label: 'Control Assurance',
    short: 'Controls',
    desc: 'Links controls to risks and records review and assurance outcomes.',
    fx: 80, fy: 28,
  },
  {
    id: 'actions',
    label: 'Action Tracking',
    short: 'Actions',
    desc: 'Follows remediation actions from owner assignment to closure.',
    fx: 82, fy: 72,
  },
  {
    id: 'tenant',
    label: 'Tenant Isolation',
    short: 'Tenants',
    desc: 'Keeps each company workspace separate and scoped to its own roles.',
    fx: 18, fy: 74,
  },
];

export const FALLBACK_TENANTS = ['Northwind Holdings', 'Orion Logistics', 'Helix Finance', 'Atlas Energy'];

// Accepts strings or objects ({ name | label | title | id }).
export const tenantName = (t, i = 0) =>
  typeof t === 'string' ? t : t?.name ?? t?.label ?? t?.title ?? t?.id ?? `Tenant ${i + 1}`;

export const tenantId = (t) => (typeof t === 'string' ? t : t?.id ?? t?.slug ?? t?.name);