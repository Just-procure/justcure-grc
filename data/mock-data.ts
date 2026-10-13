export type RiskLevel = "Low" | "Medium" | "High" | "Critical";
export type TaskPriority = "Low" | "Medium" | "High" | "Critical";
export type TaskStatus = "Open" | "In Progress" | "Completed" | "Overdue";
export type RequestType = "Access" | "Correction" | "Erasure" | "Withdrawal" | "Grievance";
export type DocumentStatus = "Approved" | "Draft" | "Review" | "Pending";
export type SubscriptionPlan = "Free Scan" | "Starter" | "Growth" | "Partner";

export type DataAsset = {
  id: string;
  name: string;
  category: string;
  purpose: string;
  source: string;
  storage: string;
  department: string;
  thirdPartySharing: string;
  retention: string;
  riskLevel: RiskLevel;
  lastReviewed: string;
};

export type ComplianceTask = {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignee: string;
  dueDate: string;
  category: string;
  createdAt: string;
};

export type DocumentRecord = {
  id: string;
  title: string;
  status: DocumentStatus;
  owner: string;
  version: string;
  updatedAt: string;
  nextReview: string;
};

export type ConsentRecord = {
  id: string;
  individual: string;
  channel: string;
  purpose: string;
  status: "Granted" | "Withdrawn" | "Pending";
  timestamp: string;
  withdrawalStatus: "Active" | "Revoked";
};

export type RequestRecord = {
  id: string;
  type: RequestType;
  receivedDate: string;
  owner: string;
  status: "Open" | "In Progress" | "Resolved";
  targetDate: string;
  notes: string;
};

export type IncidentRecord = {
  id: string;
  title: string;
  category: string;
  severity: RiskLevel;
  detectedAt: string;
  owner: string;
  status: "Open" | "Monitoring" | "Closed";
  actions: string;
  closureDate: string | null;
};

export type VendorRecord = {
  id: string;
  name: string;
  serviceType: string;
  dataAccess: string;
  riskScore: number;
  assessmentStatus: "Reviewed" | "Pending" | "At Risk";
  contractReviewDate: string;
  lastAssessmentDate: string;
  owner: string;
};

export type ActivityLog = {
  id: string;
  time: string;
  message: string;
  type: "assessment" | "document" | "task" | "vendor" | "system";
  actor?: string;
  action?: "Created" | "Updated" | "Deleted" | "Reviewed" | "Completed";
  recordType?: string;
  recordName?: string;
};

export type ProcessingActivity = {
  id: string;
  name: string;
  department: string;
  purpose: string;
  dataCategories: string;
  dataSubjects: string;
  recipients: string;
  retention: string;
  source: string;
  crossBorder: boolean;
  status: "Draft" | "In Review" | "Approved";
};

export type DpiaRecord = {
  id: string;
  title: string;
  trigger: string;
  likelihood: "Low" | "Medium" | "High";
  impact: "Low" | "Medium" | "High";
  mitigation: string;
  owner: string;
  status: "Draft" | "In Review" | "Approved";
};

export type AgentReview = {
  id: string;
  targetId?: string;
  agent: string;
  title: string;
  summary: string;
  rationale: string;
  sources: string[];
  status: "Pending Review" | "Approved" | "Changes Requested";
  createdAt: string;
};

export type RegulatoryUpdate = {
  id: string;
  title: string;
  authority: string;
  publishedAt: string;
  sectors: string[];
  summary: string;
  impact: "High" | "Medium" | "Low";
  status: "New" | "Assessing" | "Actioned" | "Not Relevant";
};

export type AiSystemRecord = {
  id: string;
  name: string;
  owner: string;
  purpose: string;
  dataUsed: string;
  decisionImpact: "None" | "Assistive" | "Significant";
  risk: "Low" | "Medium" | "High";
  status: "Registered" | "In Review" | "Approved";
};

export type GroupEntity = {
  id: string;
  name: string;
  country: string;
  role: string;
};

export type Company = {
  id: string;
  name: string;
  industry: string;
  companyId: string;
  readiness: number;
  country: string;
  profile: string;
  logoPlaceholder: string;
  subscription: {
    plan: SubscriptionPlan;
    monthlyPrice: number;
    renewalDate: string;
    features: string[];
  };
  metrics: {
    openTasks: number;
    completedTasks: number;
    overdueTasks: number;
    openRisks: number;
    pendingReviews: number;
    readinessTrend: number[];
  };
  assessment: {
    progress: number;
    answers: Record<string, string>;
    summary: string;
    riskLevel: "Low" | "Moderate" | "Elevated" | "High";
  };
  assets: DataAsset[];
  tasks: ComplianceTask[];
  documents: DocumentRecord[];
  consentRecords: ConsentRecord[];
  requests: RequestRecord[];
  incidents: IncidentRecord[];
  vendors: VendorRecord[];
  activity: ActivityLog[];
  processingActivities?: ProcessingActivity[];
  dpias?: DpiaRecord[];
  agentReviews?: AgentReview[];
  regulatoryUpdates?: RegulatoryUpdate[];
  aiSystems?: AiSystemRecord[];
  groupEntities?: GroupEntity[];
};

export function ensureCompanyModules(company: Company): Company {
  return {
    ...company,
    processingActivities: company.processingActivities ?? [
      {
        id: `${company.id}-ropa-001`,
        name: "Customer account and support",
        department: "Operations",
        purpose: "Provide customer accounts, support and service communications",
        dataCategories: "Contact details, account activity, support history",
        dataSubjects: "Customers and authorised users",
        recipients: "Customer platform, support provider",
        retention: "Account lifetime plus documented retention period",
        source: "CRM, support platform and department interview",
        crossBorder: false,
        status: "In Review",
      },
      {
        id: `${company.id}-ropa-002`,
        name: "Workforce administration",
        department: "People Operations",
        purpose: "Recruitment, employment administration and payroll",
        dataCategories: "Identity, contact, employment and payroll data",
        dataSubjects: "Applicants and employees",
        recipients: "HRMS and payroll provider",
        retention: "Employment lifecycle plus statutory retention",
        source: "HRMS inventory and department interview",
        crossBorder: false,
        status: "Draft",
      },
    ],
    dpias: company.dpias ?? [],
    agentReviews: company.agentReviews ?? [],
    regulatoryUpdates: company.regulatoryUpdates ?? [
      {
        id: `${company.id}-reg-001`,
        title: "Digital Personal Data Protection Rules, 2025",
        authority: "Ministry of Electronics and Information Technology",
        publishedAt: "2025-11-14",
        sectors: ["All sectors"],
        summary: "Review implementing requirements for notices, consent, security safeguards, breach response and data-principal rights against current controls.",
        impact: "High",
        status: "Assessing",
      },
      {
        id: `${company.id}-reg-002`,
        title: "Sectoral privacy and cybersecurity directions",
        authority: "Relevant sector regulator",
        publishedAt: "2026-06-01",
        sectors: [company.industry],
        summary: "Validate applicable sector-specific requirements with counsel and the organisation's regulatory owner.",
        impact: "Medium",
        status: "New",
      },
    ],
    aiSystems: company.aiSystems ?? [],
    groupEntities: company.groupEntities ?? [
      {
        id: `${company.id}-entity-primary`,
        name: company.name,
        country: company.country,
        role: "Primary operating entity",
      },
    ],
  };
}

export const companySeeds: Company[] = [
  {
    id: "novatech",
    name: "NovaTech Solutions Pvt. Ltd.",
    industry: "IT & SaaS",
    companyId: "NT-201",
    readiness: 68,
    country: "India",
    profile: "B2B SaaS provider serving enterprise clients across product analytics and workflow automation.",
    logoPlaceholder: "NT",
    subscription: {
      plan: "Free Scan",
      monthlyPrice: 0,
      renewalDate: "2026-11-15",
      features: ["Risk scan", "Task tracking", "Limited reports"],
    },
    metrics: {
      openTasks: 9,
      completedTasks: 15,
      overdueTasks: 3,
      openRisks: 4,
      pendingReviews: 5,
      readinessTrend: [58, 60, 64, 68, 71, 68],
    },
    assessment: {
      progress: 72,
      answers: {
        dataCollection: "Consent banner and purpose-based notices",
        notices: "Basic notice implemented",
        storage: "Encryption at rest and access controls",
        retention: "Scheduled deletion every 12 months",
        sharing: "Vendor review needed for several processors",
        rights: "Access request workflow exists",
        breach: "IR plan under annual review",
        governance: "DPO roster and policy review incomplete",
      },
      summary: "Strong technical controls, but vendor due diligence and review governance need strengthening.",
      riskLevel: "Moderate",
    },
    assets: [
      { id: "A-1001", name: "Customer CRM", category: "Customer Data", purpose: "Account management", source: "Website forms", storage: "AWS us-east-1", department: "Sales", thirdPartySharing: "HubSpot Sync", retention: "36 months", riskLevel: "Medium", lastReviewed: "2026-09-04" },
      { id: "A-1002", name: "Employee Database", category: "Personnel Data", purpose: "HR operations", source: "Internal onboarding", storage: "Azure AD", department: "People Ops", thirdPartySharing: "No", retention: "7 years", riskLevel: "High", lastReviewed: "2026-08-19" },
      { id: "A-1003", name: "Website Lead Forms", category: "Marketing Data", purpose: "Campaign qualification", source: "Website and paid ads", storage: "CRM + storage bucket", department: "Marketing", thirdPartySharing: "Google Ads", retention: "24 months", riskLevel: "Medium", lastReviewed: "2026-09-20" },
    ],
    tasks: [
      { id: "T-101", title: "Review consent logs", description: "Validate automated consent events for product trial conversion flows.", priority: "High", status: "In Progress", assignee: "Aisha M.", dueDate: "2026-10-14", category: "Consent", createdAt: "2026-09-18" },
      { id: "T-102", title: "Vendor DPA checklist", description: "Verify third-party DPAs for analytics and hosting vendors.", priority: "Medium", status: "Open", assignee: "Rohit K.", dueDate: "2026-10-21", category: "Vendor", createdAt: "2026-09-25" },
      { id: "T-103", title: "Delete inactive records", description: "Apply final deletion for old B2B lead records after retention review.", priority: "High", status: "Overdue", assignee: "Nisha D.", dueDate: "2026-10-08", category: "Retention", createdAt: "2026-08-28" },
    ],
    documents: [
      { id: "D-101", title: "Privacy Notice", status: "Approved", owner: "Legal", version: "v3.1", updatedAt: "2026-09-12", nextReview: "2026-12-01" },
      { id: "D-102", title: "Internal Data Protection Policy", status: "Review", owner: "Security", version: "v2.8", updatedAt: "2026-09-27", nextReview: "2026-11-03" },
      { id: "D-103", title: "Vendor DPA Template", status: "Pending", owner: "Procurement", version: "v1.6", updatedAt: "2026-09-10", nextReview: "2026-10-30" },
    ],
    consentRecords: [
      { id: "C-101", individual: "A. Mehta", channel: "Website signup", purpose: "Product demo follow-up", status: "Granted", timestamp: "2026-09-30T09:12:00Z", withdrawalStatus: "Active" },
      { id: "C-102", individual: "V. Shah", channel: "Newsletter", purpose: "Product updates", status: "Withdrawn", timestamp: "2026-09-18T16:40:00Z", withdrawalStatus: "Revoked" },
      { id: "C-103", individual: "P. Gupta", channel: "App registration", purpose: "Account access and support", status: "Granted", timestamp: "2026-09-26T11:05:00Z", withdrawalStatus: "Active" },
    ],
    requests: [
      { id: "R-101", type: "Access", receivedDate: "2026-09-25", owner: "Legal Ops", status: "In Progress", targetDate: "2026-10-10", notes: "Request from former customer support user." },
      { id: "R-102", type: "Correction", receivedDate: "2026-09-22", owner: "CRM Team", status: "Resolved", targetDate: "2026-09-29", notes: "Address updated after validation." },
    ],
    incidents: [
      { id: "I-101", title: "Misdirected email to sales leads", category: "Data disclosure", severity: "Medium", detectedAt: "2026-09-17", owner: "Operations", status: "Monitoring", actions: "Recall email and notify recipients", closureDate: null },
      { id: "I-102", title: "Vendor API token exposure", category: "Security incident", severity: "High", detectedAt: "2026-09-09", owner: "Security", status: "Closed", actions: "Rotation and escalation", closureDate: "2026-09-12" },
    ],
    vendors: [
      { id: "V-101", name: "CloudReach Analytics", serviceType: "Analytics Platform", dataAccess: "Behavioral telemetry", riskScore: 64, assessmentStatus: "Reviewed", contractReviewDate: "2026-11-02", lastAssessmentDate: "2026-08-14", owner: "Procurement" },
      { id: "V-102", name: "Northstar Hosting", serviceType: "Infrastructure hosting", dataAccess: "Customer records and backups", riskScore: 71, assessmentStatus: "At Risk", contractReviewDate: "2026-10-22", lastAssessmentDate: "2026-07-15", owner: "Infra" },
    ],
    activity: [
      { id: "L-101", time: "Today • 09:14", message: "Assessment progress updated for data retention controls.", type: "assessment" },
      { id: "L-102", time: "Yesterday • 16:40", message: "Internal Data Protection Policy was revised and scheduled for review.", type: "document" },
      { id: "L-103", time: "2026-09-30", message: "Task 'Vendor DPA checklist' assigned to Rohit K.", type: "task" },
    ],
  },
  {
    id: "greenbasket",
    name: "GreenBasket Retail Pvt. Ltd.",
    industry: "E-commerce & Retail",
    companyId: "GB-204",
    readiness: 52,
    country: "India",
    profile: "Omnichannel retail operation with web, app and in-store customer data handling.",
    logoPlaceholder: "GB",
    subscription: {
      plan: "Starter",
      monthlyPrice: 999,
      renewalDate: "2026-11-22",
      features: ["Privacy baseline", "Vendor register", "Document workflows"],
    },
    metrics: {
      openTasks: 12,
      completedTasks: 11,
      overdueTasks: 5,
      openRisks: 6,
      pendingReviews: 7,
      readinessTrend: [46, 49, 45, 52, 57, 52],
    },
    assessment: {
      progress: 61,
      answers: {
        dataCollection: "Forms collect purchase and profile data",
        notices: "Checkout notice present but not layered across all channels",
        storage: "Limited encryption and role-based access",
        retention: "Customer loyalty records retained beyond policy period",
        sharing: "Third-party marketing pixels require review",
        rights: "Customer rights request process is ad hoc",
        breach: "Breach playbook is draft-level",
        governance: "Senior ownership not formally assigned",
      },
      summary: "Customer-facing data controls are relatively mature, but retention and consent governance gaps are significant.",
      riskLevel: "Elevated",
    },
    assets: [
      { id: "A-2001", name: "Customer Orders", category: "Transactional Data", purpose: "Fulfilment and support", source: "Online storefront", storage: "MySQL cluster", department: "Operations", thirdPartySharing: "Logistics partners", retention: "5 years", riskLevel: "High", lastReviewed: "2026-08-27" },
      { id: "A-2002", name: "Marketing Subscriber List", category: "Marketing Data", purpose: "Promotions and loyalty", source: "App + CRM", storage: "CRM + email tool", department: "Marketing", thirdPartySharing: "Email vendors", retention: "18 months", riskLevel: "Medium", lastReviewed: "2026-09-09" },
      { id: "A-2003", name: "Store CCTV Footage", category: "Video Data", purpose: "Security monitoring", source: "In-store cameras", storage: "Local recorders", department: "Security", thirdPartySharing: "No", retention: "30 days", riskLevel: "Medium", lastReviewed: "2026-09-03" },
    ],
    tasks: [
      { id: "T-201", title: "Consent banner refresh", description: "Update checkout banner to capture granular consent for marketing and analytics.", priority: "Critical", status: "Open", assignee: "Anika S.", dueDate: "2026-10-12", category: "Consent", createdAt: "2026-09-19" },
      { id: "T-202", title: "Retention cleanup", description: "Delete dormant loyalty records beyond retention schedule.", priority: "High", status: "Overdue", assignee: "Sandeep R.", dueDate: "2026-10-06", category: "Retention", createdAt: "2026-08-31" },
      { id: "T-203", title: "Partner DPA review", description: "Review logistics processor contracts for cross-border data handling.", priority: "Medium", status: "In Progress", assignee: "Neha P.", dueDate: "2026-10-18", category: "Vendor", createdAt: "2026-09-21" },
    ],
    documents: [
      { id: "D-201", title: "Customer Privacy Notice", status: "Draft", owner: "Legal", version: "v1.9", updatedAt: "2026-09-28", nextReview: "2026-10-29" },
      { id: "D-202", title: "Retention and Deletion Policy", status: "Review", owner: "Operations", version: "v2.3", updatedAt: "2026-09-16", nextReview: "2026-11-07" },
      { id: "D-203", title: "Breach Response Plan", status: "Pending", owner: "Security", version: "v1.2", updatedAt: "2026-09-12", nextReview: "2026-10-31" },
    ],
    consentRecords: [
      { id: "C-201", individual: "R. Joshi", channel: "Website checkout", purpose: "Order fulfilment", status: "Granted", timestamp: "2026-09-27T07:52:00Z", withdrawalStatus: "Active" },
      { id: "C-202", individual: "S. Nair", channel: "Loyalty app", purpose: "Marketing promotions", status: "Pending", timestamp: "2026-09-21T13:20:00Z", withdrawalStatus: "Active" },
      { id: "C-203", individual: "I. Vora", channel: "Newsletter signup", purpose: "Seasonal offers", status: "Granted", timestamp: "2026-09-11T10:09:00Z", withdrawalStatus: "Active" },
    ],
    requests: [
      { id: "R-201", type: "Erasure", receivedDate: "2026-09-24", owner: "Support", status: "Open", targetDate: "2026-10-15", notes: "Customer asks to remove all loyalty and purchase history." },
      { id: "R-202", type: "Withdrawal", receivedDate: "2026-09-19", owner: "CRM", status: "In Progress", targetDate: "2026-10-09", notes: "Consent changed across profile and email channels." },
    ],
    incidents: [
      { id: "I-201", title: "Customer search logs exposed", category: "Data exposure", severity: "High", detectedAt: "2026-09-14", owner: "Engineering", status: "Open", actions: "Review log retention and fix filter rules", closureDate: null },
      { id: "I-202", title: "Marketing email mis-targeting", category: "Consent issue", severity: "Medium", detectedAt: "2026-09-05", owner: "Marketing", status: "Closed", actions: "Opt-out update and audit log", closureDate: "2026-09-11" },
    ],
    vendors: [
      { id: "V-201", name: "QuickFleet Logistics", serviceType: "Delivery operations", dataAccess: "Address and contact details", riskScore: 76, assessmentStatus: "At Risk", contractReviewDate: "2026-10-17", lastAssessmentDate: "2026-08-05", owner: "Operations" },
      { id: "V-202", name: "BrightMail Campaigns", serviceType: "Marketing automation", dataAccess: "Email and profile data", riskScore: 67, assessmentStatus: "Reviewed", contractReviewDate: "2026-10-24", lastAssessmentDate: "2026-09-06", owner: "Marketing" },
    ],
    activity: [
      { id: "L-201", time: "Today • 11:02", message: "Consent banner refresh task created for check-out journey.", type: "task" },
      { id: "L-202", time: "Yesterday • 14:16", message: "Retention policy review flagged 2 inactive customer cohorts.", type: "system" },
      { id: "L-203", time: "2026-09-29", message: "Critical vendor review scheduled for QuickFleet Logistics.", type: "vendor" },
    ],
  },
  {
    id: "medcore",
    name: "MedCore Hospitals Pvt. Ltd.",
    industry: "Healthcare",
    companyId: "MC-433",
    readiness: 81,
    country: "India",
    profile: "Multi-speciality healthcare network with patient records, diagnostics and telehealth workflows.",
    logoPlaceholder: "MC",
    subscription: {
      plan: "Growth",
      monthlyPrice: 2499,
      renewalDate: "2026-11-12",
      features: ["Advanced privacy controls", "Breach response drill", "Enterprise reporting"],
    },
    metrics: {
      openTasks: 8,
      completedTasks: 16,
      overdueTasks: 2,
      openRisks: 3,
      pendingReviews: 4,
      readinessTrend: [72, 74, 78, 80, 82, 81],
    },
    assessment: {
      progress: 88,
      answers: {
        dataCollection: "Purpose-limited patient and care consent established",
        notices: "Clear notices deployed in clinics and digital patient portals",
        storage: "Strong encryption and role-based access with audited access",
        retention: "Regulatory retention schedule implemented",
        sharing: "Business associate controls and data sharing agreements in place",
        rights: "Patient access and grievance handling workflow operational",
        breach: "Breach response team and escalation process active",
        governance: "Governance board and DPO support established",
      },
      summary: "Controls are mature, with a few improvements needed in cross-entity sharing and annual review cycles.",
      riskLevel: "Low",
    },
    assets: [
      { id: "A-3001", name: "Patient Registration Records", category: "Health Data", purpose: "Care coordination", source: "Hospital registration", storage: "HIPAA-aligned cloud", department: "Clinical Ops", thirdPartySharing: "Diagnostics labs", retention: "8 years", riskLevel: "High", lastReviewed: "2026-09-08" },
      { id: "A-3002", name: "Telehealth Session Data", category: "Health Data", purpose: "Remote consultation", source: "Portal and app", storage: "Encrypted telehealth platform", department: "Digital Health", thirdPartySharing: "No", retention: "3 years", riskLevel: "Medium", lastReviewed: "2026-09-13" },
      { id: "A-3003", name: "Employee Health Records", category: "Sensitive Data", purpose: "Occupational health", source: "HR and clinic", storage: "Restricted repository", department: "HR", thirdPartySharing: "No", retention: "6 years", riskLevel: "High", lastReviewed: "2026-09-18" },
    ],
    tasks: [
      { id: "T-301", title: "Review cross-entity data sharing", description: "Map transfers to partner diagnostic labs and insurance partners.", priority: "High", status: "Open", assignee: "Dr. Iyer", dueDate: "2026-10-16", category: "Sharing", createdAt: "2026-09-17" },
      { id: "T-302", title: "Refresh patient portal notice", description: "Update consent wording after service expansion.", priority: "Medium", status: "Completed", assignee: "Aditi C.", dueDate: "2026-10-02", category: "Consent", createdAt: "2026-09-11" },
      { id: "T-303", title: "Audit access lists", description: "Review privileged access for clinical and IT staff.", priority: "High", status: "In Progress", assignee: "Sathish A.", dueDate: "2026-10-13", category: "Security", createdAt: "2026-09-27" },
    ],
    documents: [
      { id: "D-301", title: "Patient Privacy Notice", status: "Approved", owner: "Legal", version: "v5.4", updatedAt: "2026-09-11", nextReview: "2026-12-10" },
      { id: "D-302", title: "Data Breach Response Plan", status: "Approved", owner: "Security", version: "v4.2", updatedAt: "2026-09-09", nextReview: "2026-11-01" },
      { id: "D-303", title: "Vendor Data Processing Agreement", status: "Review", owner: "Procurement", version: "v3.1", updatedAt: "2026-09-22", nextReview: "2026-10-28" },
    ],
    consentRecords: [
      { id: "C-301", individual: "B. Kapoor", channel: "Patient portal", purpose: "Care coordination", status: "Granted", timestamp: "2026-09-28T08:45:00Z", withdrawalStatus: "Active" },
      { id: "C-302", individual: "M. Singh", channel: "Telehealth signup", purpose: "Remote consultation", status: "Granted", timestamp: "2026-09-23T15:34:00Z", withdrawalStatus: "Active" },
      { id: "C-303", individual: "D. Fernandes", channel: "Clinic registration", purpose: "Billing and claims support", status: "Withdrawn", timestamp: "2026-09-15T10:05:00Z", withdrawalStatus: "Revoked" },
    ],
    requests: [
      { id: "R-301", type: "Access", receivedDate: "2026-09-26", owner: "Patient Support", status: "Resolved", targetDate: "2026-10-01", notes: "Access complete and records validated." },
      { id: "R-302", type: "Grievance", receivedDate: "2026-09-18", owner: "Compliance", status: "In Progress", targetDate: "2026-10-07", notes: "Escalation to grievance committee pending." },
    ],
    incidents: [
      { id: "I-301", title: "Unscheduled access to test profile", category: "Unauthorized access", severity: "Medium", detectedAt: "2026-09-16", owner: "IAM Lead", status: "Closed", actions: "Revoked token and reviewed access logs", closureDate: "2026-09-19" },
      { id: "I-302", title: "Diagnostic results shared to wrong queue", category: "Misdirected data", severity: "High", detectedAt: "2026-09-02", owner: "Clinical Ops", status: "Monitoring", actions: "Delay in notification review", closureDate: null },
    ],
    vendors: [
      { id: "V-301", name: "CareLink Labs", serviceType: "Diagnostic services", dataAccess: "Test and patient history", riskScore: 59, assessmentStatus: "Reviewed", contractReviewDate: "2026-10-18", lastAssessmentDate: "2026-09-07", owner: "Procurement" },
      { id: "V-302", name: "DigitHealth Support", serviceType: "IT support", dataAccess: "System access and tickets", riskScore: 62, assessmentStatus: "Reviewed", contractReviewDate: "2026-11-05", lastAssessmentDate: "2026-09-01", owner: "IT" },
    ],
    activity: [
      { id: "L-301", time: "Today • 13:22", message: "Cross-entity data sharing risks were refreshed in the assessment summary.", type: "assessment" },
      { id: "L-302", time: "Yesterday • 15:09", message: "Patient Privacy Notice approved for the new telehealth flow.", type: "document" },
      { id: "L-303", time: "2026-09-30", message: "Vendor review for CareLink Labs completed by procurement.", type: "vendor" },
    ],
  },
  {
    id: "edubridge",
    name: "EduBridge Learning Pvt. Ltd.",
    industry: "Education",
    companyId: "EB-117",
    readiness: 44,
    country: "India",
    profile: "Edtech platform managing student learning records, admissions and payment details.",
    logoPlaceholder: "EB",
    subscription: {
      plan: "Growth",
      monthlyPrice: 2499,
      renewalDate: "2026-11-01",
      features: ["Dashboards", "Advanced records", "Support plan"],
    },
    metrics: {
      openTasks: 14,
      completedTasks: 9,
      overdueTasks: 7,
      openRisks: 8,
      pendingReviews: 6,
      readinessTrend: [38, 41, 42, 44, 47, 44],
    },
    assessment: {
      progress: 51,
      answers: {
        dataCollection: "Limited granularity and weak parent consent tracking",
        notices: "Basic privacy notice exists in app",
        storage: "Cost-focused storage with limited access logging",
        retention: "Student data retention schedules are inconsistent",
        sharing: "LMS and payment processor links require review",
        rights: "Requests tracked manually",
        breach: "No formal escalation drill",
        governance: "Ownership is distributed and informal",
      },
      summary: "Consent and retention controls need foundational work, especially around parent consent and student data lifecycle.",
      riskLevel: "High",
    },
    assets: [
      { id: "A-4001", name: "Student Enrolment Records", category: "Student Data", purpose: "Admission and classroom allocation", source: "Application forms", storage: "S3 bucket + LMS", department: "Admissions", thirdPartySharing: "Payment vendor", retention: "7 years", riskLevel: "High", lastReviewed: "2026-08-23" },
      { id: "A-4002", name: "Learning Analytics", category: "Behavioral Data", purpose: "Course performance tracking", source: "Platform engagement", storage: "Analytics warehouse", department: "Academic Ops", thirdPartySharing: "No", retention: "3 years", riskLevel: "Medium", lastReviewed: "2026-09-06" },
      { id: "A-4003", name: "Parent Contact Directory", category: "Contact Data", purpose: "Communication and support", source: "Admissions and app", storage: "CRM and messaging tool", department: "Operations", thirdPartySharing: "Messaging partner", retention: "18 months", riskLevel: "Medium", lastReviewed: "2026-09-21" },
    ],
    tasks: [
      { id: "T-401", title: "Build consent tracker", description: "Create a record of parent and student consent for marketing and academic data sharing.", priority: "Critical", status: "Open", assignee: "Megha R.", dueDate: "2026-10-11", category: "Consent", createdAt: "2026-09-18" },
      { id: "T-402", title: "Clean up retention matrix", description: "Align retention periods for admissions, assessments and payment records.", priority: "High", status: "Overdue", assignee: "Vivek T.", dueDate: "2026-10-03", category: "Retention", createdAt: "2026-08-29" },
      { id: "T-403", title: "Register LMS vendor", description: "Complete reviews for the learning platform and payment processor.", priority: "Medium", status: "In Progress", assignee: "Ritu C.", dueDate: "2026-10-19", category: "Vendor", createdAt: "2026-09-26" },
    ],
    documents: [
      { id: "D-401", title: "Parent Consent Notice", status: "Draft", owner: "Admissions", version: "v1.4", updatedAt: "2026-09-19", nextReview: "2026-10-30" },
      { id: "D-402", title: "Student Data Handling Policy", status: "Pending", owner: "Academic Ops", version: "v1.7", updatedAt: "2026-09-08", nextReview: "2026-10-31" },
      { id: "D-403", title: "Data Breach Response Plan", status: "Review", owner: "Security", version: "v1.0", updatedAt: "2026-09-20", nextReview: "2026-11-04" },
    ],
    consentRecords: [
      { id: "C-401", individual: "R. Verma", channel: "Admissions form", purpose: "Academic records and support", status: "Granted", timestamp: "2026-09-29T09:18:00Z", withdrawalStatus: "Active" },
      { id: "C-402", individual: "N. Ali", channel: "Upsell campaign", purpose: "Marketing and newsletters", status: "Pending", timestamp: "2026-09-18T11:50:00Z", withdrawalStatus: "Active" },
      { id: "C-403", individual: "P. Sen", channel: "Parent portal", purpose: "Progress reports", status: "Granted", timestamp: "2026-09-12T14:10:00Z", withdrawalStatus: "Active" },
    ],
    requests: [
      { id: "R-401", type: "Correction", receivedDate: "2026-09-24", owner: "Records Team", status: "Open", targetDate: "2026-10-10", notes: "Parent requested correction to contact and emergency details." },
      { id: "R-402", type: "Access", receivedDate: "2026-09-15", owner: "Student Support", status: "In Progress", targetDate: "2026-10-06", notes: "Student request for access to all learning data collected." },
    ],
    incidents: [
      { id: "I-401", title: "Admission form export shared to unapproved group", category: "Misdirected data", severity: "High", detectedAt: "2026-09-13", owner: "Ops", status: "Monitoring", actions: "Restrict exports and review access logs", closureDate: null },
      { id: "I-402", title: "Parent contact list duplicated in mailing list", category: "Data quality issue", severity: "Medium", detectedAt: "2026-09-04", owner: "CRM", status: "Closed", actions: "Clean list and re-verify consent", closureDate: "2026-09-06" },
    ],
    vendors: [
      { id: "V-401", name: "ClassRoom LMS", serviceType: "Learning platform", dataAccess: "Student profile and course activity", riskScore: 81, assessmentStatus: "At Risk", contractReviewDate: "2026-10-21", lastAssessmentDate: "2026-08-17", owner: "Academic Ops" },
      { id: "V-402", name: "PaySwift Education", serviceType: "Payment processing", dataAccess: "Fee and billing data", riskScore: 68, assessmentStatus: "Reviewed", contractReviewDate: "2026-11-06", lastAssessmentDate: "2026-09-05", owner: "Finance" },
    ],
    activity: [
      { id: "L-401", time: "Today • 10:33", message: "Funding oversight flagged a weak consent tracker for parent data.", type: "system" },
      { id: "L-402", time: "Yesterday • 12:42", message: "Student data handling policy was drafted for review.", type: "document" },
      { id: "L-403", time: "2026-09-29", message: "LMS vendor assessment flagged an at-risk status.", type: "vendor" },
    ],
  },
  {
    id: "finedge",
    name: "FinEdge Capital Services Pvt. Ltd.",
    industry: "Financial Services",
    companyId: "FE-502",
    readiness: 76,
    country: "India",
    profile: "Digital lending and wealth advisory platform with customer financial and KYC data.",
    logoPlaceholder: "FE",
    subscription: {
      plan: "Partner",
      monthlyPrice: 5999,
      renewalDate: "2026-11-08",
      features: ["Partner-grade controls", "Risk registers", "Executive reporting"],
    },
    metrics: {
      openTasks: 7,
      completedTasks: 17,
      overdueTasks: 2,
      openRisks: 2,
      pendingReviews: 3,
      readinessTrend: [68, 72, 75, 78, 76, 76],
    },
    assessment: {
      progress: 82,
      answers: {
        dataCollection: "KYC and account onboarding flows are privacy-aware",
        notices: "Notices are clear and updated for digital lending",
        storage: "Strong encryption and privileged access controls",
        retention: "Retention schedules align to policy and regulations",
        sharing: "Third-party providers are reviewed and monitored",
        rights: "Customer request process is operational and documented",
        breach: "Breach workflow exists with periodic testing",
        governance: "Board-level accountability and risk committee active",
      },
      summary: "Control maturity is strong, with monitoring and annual testing as the main focus area.",
      riskLevel: "Low",
    },
    assets: [
      { id: "A-5001", name: "KYC & Identity Records", category: "Financial Data", purpose: "Onboarding and risk checks", source: "Application forms and eKYC", storage: "Secure vault", department: "Risk", thirdPartySharing: "Credit bureau", retention: "7 years", riskLevel: "High", lastReviewed: "2026-09-07" },
      { id: "A-5002", name: "Portfolio & Wealth Data", category: "Client Data", purpose: "Investment analysis", source: "Advisor and app", storage: "Private cloud", department: "Wealth Ops", thirdPartySharing: "No", retention: "10 years", riskLevel: "Medium", lastReviewed: "2026-09-16" },
      { id: "A-5003", name: "Loan Application Data", category: "Transactional Data", purpose: "Underwriting and servicing", source: "Portal and paper files", storage: "Encrypted repository", department: "Credit Ops", thirdPartySharing: "Collections partners", retention: "6 years", riskLevel: "High", lastReviewed: "2026-09-12" },
    ],
    tasks: [
      { id: "T-501", title: "Review third-party credit bureau processing", description: "Validate DPA and access logs for credit reporting partners.", priority: "High", status: "Completed", assignee: "Kunal V.", dueDate: "2026-10-05", category: "Vendor", createdAt: "2026-09-15" },
      { id: "T-502", title: "Breach exercise", description: "Exercise incident playbook for suspicious access to KYC vault.", priority: "Critical", status: "In Progress", assignee: "Naina K.", dueDate: "2026-10-20", category: "Security", createdAt: "2026-09-19" },
      { id: "T-503", title: "Update customer rights summary", description: "Document response path for data access and grievance requests.", priority: "Medium", status: "Open", assignee: "Harsh P.", dueDate: "2026-10-23", category: "Rights", createdAt: "2026-09-26" },
    ],
    documents: [
      { id: "D-501", title: "Privacy Notice & Consent", status: "Approved", owner: "Legal", version: "v6.1", updatedAt: "2026-09-09", nextReview: "2026-12-07" },
      { id: "D-502", title: "KYC & Data Retention Policy", status: "Approved", owner: "Risk", version: "v4.0", updatedAt: "2026-09-14", nextReview: "2026-11-08" },
      { id: "D-503", title: "Grievance Handling Procedure", status: "Review", owner: "Compliance", version: "v2.8", updatedAt: "2026-09-19", nextReview: "2026-10-29" },
    ],
    consentRecords: [
      { id: "C-501", individual: "H. Bansal", channel: "Digital onboarding", purpose: "KYC and underwriting", status: "Granted", timestamp: "2026-09-28T12:32:00Z", withdrawalStatus: "Active" },
      { id: "C-502", individual: "S. Roy", channel: "Portfolio portal", purpose: "Investment advisory", status: "Granted", timestamp: "2026-09-25T08:11:00Z", withdrawalStatus: "Active" },
      { id: "C-503", individual: "A. Gupta", channel: "Marketing campaign", purpose: "Product updates", status: "Withdrawn", timestamp: "2026-09-17T17:05:00Z", withdrawalStatus: "Revoked" },
    ],
    requests: [
      { id: "R-501", type: "Access", receivedDate: "2026-09-27", owner: "Customer Care", status: "Resolved", targetDate: "2026-10-01", notes: "All records shared via secure portal." },
      { id: "R-502", type: "Grievance", receivedDate: "2026-09-21", owner: "Compliance", status: "In Progress", targetDate: "2026-10-08", notes: "Review of marketing opt-in records ongoing." },
    ],
    incidents: [
      { id: "I-501", title: "Suspicious KYC vault query", category: "Security monitoring", severity: "High", detectedAt: "2026-09-18", owner: "Security", status: "Monitoring", actions: "Access review and investigation", closureDate: null },
      { id: "I-502", title: "Misdirected client report", category: "Data disclosure", severity: "Medium", detectedAt: "2026-09-06", owner: "Operations", status: "Closed", actions: "Corrected recipient list and retrained staff", closureDate: "2026-09-10" },
    ],
    vendors: [
      { id: "V-501", name: "SecureScore Credit Bureau", serviceType: "Risk scoring", dataAccess: "Credit and identity records", riskScore: 58, assessmentStatus: "Reviewed", contractReviewDate: "2026-10-25", lastAssessmentDate: "2026-09-04", owner: "Risk" },
      { id: "V-502", name: "Nexa Payment Gateway", serviceType: "Collections and settlements", dataAccess: "Payment and bank data", riskScore: 63, assessmentStatus: "Reviewed", contractReviewDate: "2026-11-02", lastAssessmentDate: "2026-08-30", owner: "Finance" },
    ],
    activity: [
      { id: "L-501", time: "Today • 08:42", message: "Breach drill scheduled for KYC vault access monitoring.", type: "task" },
      { id: "L-502", time: "Yesterday • 18:06", message: "Grievance handling procedure is under annual review.", type: "document" },
      { id: "L-503", time: "2026-09-29", message: "SecureScore Credit Bureau review completed successfully.", type: "vendor" },
    ],
  },
  {
    id: "urbannest",
    name: "UrbanNest Realty Pvt. Ltd.",
    industry: "Real Estate",
    companyId: "UN-350",
    readiness: 61,
    country: "India",
    profile: "Property developer and broker operator managing customer leads, tenancy and property records.",
    logoPlaceholder: "UN",
    subscription: {
      plan: "Free Scan",
      monthlyPrice: 0,
      renewalDate: "2026-11-05",
      features: ["Risk scan", "Basic tasks", "Limited support"],
    },
    metrics: {
      openTasks: 11,
      completedTasks: 13,
      overdueTasks: 4,
      openRisks: 5,
      pendingReviews: 6,
      readinessTrend: [54, 58, 60, 61, 62, 61],
    },
    assessment: {
      progress: 65,
      answers: {
        dataCollection: "CRM and lead capture forms are acceptable",
        notices: "Property inquiry notices need enhancement",
        storage: "Access controls and encryption exist but are uneven",
        retention: "Lease and property records not consistently governed",
        sharing: "Broker and legal partner data-sharing controls are patchy",
        rights: "Customer rights are handled by sales team ad hoc",
        breach: "Incident response plan is partial",
        governance: "Privacy responsibilities are not formalized across offices",
      },
      summary: "Business operations are generally structured, but documentation and rights handling are the main gaps.",
      riskLevel: "Moderate",
    },
    assets: [
      { id: "A-6001", name: "Buyer Lead CRM", category: "Commercial Data", purpose: "Sales and inquiry management", source: "Website forms", storage: "Cloud CRM", department: "Sales", thirdPartySharing: "Broker networks", retention: "24 months", riskLevel: "Medium", lastReviewed: "2026-09-04" },
      { id: "A-6002", name: "Tenant KYC Data", category: "Residential Data", purpose: "Verification and onboarding", source: "Offline and portal", storage: "Shared drive", department: "Operations", thirdPartySharing: "Legal docs partners", retention: "3 years", riskLevel: "High", lastReviewed: "2026-08-29" },
      { id: "A-6003", name: "Property Listing Data", category: "Property Data", purpose: "Marketing and sales", source: "Portfolio and listings", storage: "Digital asset library", department: "Marketing", thirdPartySharing: "Listing portals", retention: "18 months", riskLevel: "Medium", lastReviewed: "2026-09-15" },
    ],
    tasks: [
      { id: "T-601", title: "Review broker agreements", description: "Assess data-sharing and DPA obligations with external sales partners.", priority: "Medium", status: "In Progress", assignee: "Rhea M.", dueDate: "2026-10-14", category: "Vendor", createdAt: "2026-09-09" },
      { id: "T-602", title: "Refresh inquiry notice", description: "Add consistent consent language to lead forms and landing pages.", priority: "High", status: "Open", assignee: "Vikram J.", dueDate: "2026-10-18", category: "Consent", createdAt: "2026-09-22" },
      { id: "T-603", title: "Tenant record cleanup", description: "Delete stale tenant records after lease completion review.", priority: "Medium", status: "Overdue", assignee: "Tanya S.", dueDate: "2026-10-07", category: "Retention", createdAt: "2026-08-28" },
    ],
    documents: [
      { id: "D-601", title: "Privacy Notice for Buyers", status: "Draft", owner: "Legal", version: "v1.8", updatedAt: "2026-09-17", nextReview: "2026-10-28" },
      { id: "D-602", title: "Tenant Data Handling Policy", status: "Review", owner: "Operations", version: "v1.5", updatedAt: "2026-09-09", nextReview: "2026-11-02" },
      { id: "D-603", title: "Incident Response Plan", status: "Pending", owner: "Security", version: "v1.1", updatedAt: "2026-09-24", nextReview: "2026-10-30" },
    ],
    consentRecords: [
      { id: "C-601", individual: "A. Kulkarni", channel: "Property inquiry form", purpose: "Lead follow-up", status: "Granted", timestamp: "2026-09-30T07:11:00Z", withdrawalStatus: "Active" },
      { id: "C-602", individual: "S. Menon", channel: "Broker referral", purpose: "Sales contact and onboarding", status: "Pending", timestamp: "2026-09-21T16:30:00Z", withdrawalStatus: "Active" },
      { id: "C-603", individual: "R. Pawar", channel: "Tenant portal", purpose: "Verification and maintenance", status: "Granted", timestamp: "2026-09-11T12:42:00Z", withdrawalStatus: "Active" },
    ],
    requests: [
      { id: "R-601", type: "Correction", receivedDate: "2026-09-23", owner: "CRM", status: "Open", targetDate: "2026-10-09", notes: "Correction requested for contact and property interest details." },
      { id: "R-602", type: "Access", receivedDate: "2026-09-16", owner: "Sales Ops", status: "In Progress", targetDate: "2026-10-05", notes: "Lead file review pending due to multiple brokers." },
    ],
    incidents: [
      { id: "I-601", title: "Listing data copied into shared drive", category: "Unauthorized sharing", severity: "Medium", detectedAt: "2026-09-11", owner: "Marketing", status: "Monitoring", actions: "Remove access and audit folder usage", closureDate: null },
      { id: "I-602", title: "Lease application sent to wrong agent", category: "Data disclosure", severity: "Medium", detectedAt: "2026-09-02", owner: "Sales", status: "Closed", actions: "Recalled file and retrained team", closureDate: "2026-09-05" },
    ],
    vendors: [
      { id: "V-601", name: "Skyline Listing Portals", serviceType: "Property listings", dataAccess: "Property and lead data", riskScore: 73, assessmentStatus: "At Risk", contractReviewDate: "2026-10-19", lastAssessmentDate: "2026-08-18", owner: "Marketing" },
      { id: "V-602", name: "HomeMate Legal Docs", serviceType: "Legal documentation", dataAccess: "Tenant and transaction documents", riskScore: 61, assessmentStatus: "Reviewed", contractReviewDate: "2026-10-28", lastAssessmentDate: "2026-09-02", owner: "Operations" },
    ],
    activity: [
      { id: "L-601", time: "Today • 09:50", message: "Inquiry form notice refresh is queued for approval.", type: "document" },
      { id: "L-602", time: "Yesterday • 13:28", message: "Broker agreement review flagged cross-border data-sharing obligations.", type: "vendor" },
      { id: "L-603", time: "2026-09-30", message: "Tenant record cleanup remains overdue for 3 lease closure cohorts.", type: "task" },
    ],
  },
  {
    id: "swiftship",
    name: "SwiftShip Logistics Pvt. Ltd.",
    industry: "Logistics",
    companyId: "SS-650",
    readiness: 57,
    country: "India",
    profile: "Freight network coordinating shipment data, route analytics and partner carrier information.",
    logoPlaceholder: "SS",
    subscription: {
      plan: "Starter",
      monthlyPrice: 999,
      renewalDate: "2026-11-17",
      features: ["Privacy basics", "Task history", "Reports"],
    },
    metrics: {
      openTasks: 10,
      completedTasks: 12,
      overdueTasks: 4,
      openRisks: 7,
      pendingReviews: 5,
      readinessTrend: [51, 54, 57, 58, 59, 57],
    },
    assessment: {
      progress: 62,
      answers: {
        dataCollection: "Shipment and customer data is captured across multiple channels",
        notices: "Diversified notices exist but not consistent across B2B flows",
        storage: "Encryption present but access control gaps exist across routes",
        retention: "Transport records retained too long in some systems",
        sharing: "Carrier and customs partners require contractual review",
        rights: "Customer access requests are manually processed",
        breach: "Alerting and breach workflow exist in draft form",
        governance: "Privacy roles across operations are not fully defined",
      },
      summary: "Operational controls are strong but tracking, rights handling and vendor review need structure.",
      riskLevel: "Elevated",
    },
    assets: [
      { id: "A-7001", name: "Shipment Tracking Data", category: "Operational Data", purpose: "Route management and ETA updates", source: "Transit systems", storage: "Fleet platform", department: "Operations", thirdPartySharing: "Carrier partners", retention: "2 years", riskLevel: "Medium", lastReviewed: "2026-09-05" },
      { id: "A-7002", name: "Customer Order Data", category: "Customer Data", purpose: "Delivery scheduling", source: "Order portals", storage: "Cloud ERP", department: "Sales", thirdPartySharing: "Last-mile partners", retention: "4 years", riskLevel: "High", lastReviewed: "2026-09-19" },
      { id: "A-7003", name: "Driver and Route Records", category: "Personnel Data", purpose: "Fleet operations", source: "Driver onboarding", storage: "In-house storage", department: "Fleet", thirdPartySharing: "Vehicle management", retention: "5 years", riskLevel: "High", lastReviewed: "2026-08-31" },
    ],
    tasks: [
      { id: "T-701", title: "Carrier DPA review", description: "Review all carrier contracts for data-sharing, access and retention obligations.", priority: "High", status: "Open", assignee: "Devika N.", dueDate: "2026-10-17", category: "Vendor", createdAt: "2026-09-13" },
      { id: "T-702", title: "Shipment retention sweep", description: "Delete stale shipment records and align customs data retention windows.", priority: "Medium", status: "Overdue", assignee: "Imran H.", dueDate: "2026-10-08", category: "Retention", createdAt: "2026-08-30" },
      { id: "T-703", title: "Customer rights workflow", description: "Create a standard path for access and correction requests from shippers.", priority: "Medium", status: "In Progress", assignee: "Pooja K.", dueDate: "2026-10-22", category: "Rights", createdAt: "2026-09-21" },
    ],
    documents: [
      { id: "D-701", title: "Customer Privacy Notice", status: "Approved", owner: "Legal", version: "v2.9", updatedAt: "2026-09-11", nextReview: "2026-11-15" },
      { id: "D-702", title: "Driver Data Handling Policy", status: "Review", owner: "Fleet Ops", version: "v1.6", updatedAt: "2026-09-20", nextReview: "2026-10-31" },
      { id: "D-703", title: "Customs Data Processing Addendum", status: "Pending", owner: "Trade Ops", version: "v1.3", updatedAt: "2026-09-17", nextReview: "2026-10-26" },
    ],
    consentRecords: [
      { id: "C-701", individual: "J. Fernandes", channel: "Shipment onboarding", purpose: "Delivery coordination", status: "Granted", timestamp: "2026-09-28T13:22:00Z", withdrawalStatus: "Active" },
      { id: "C-702", individual: "L. Rao", channel: "Service portal", purpose: "Route notifications", status: "Granted", timestamp: "2026-09-19T10:40:00Z", withdrawalStatus: "Active" },
      { id: "C-703", individual: "T. Shah", channel: "Newsletter", purpose: "Logistics updates", status: "Withdrawn", timestamp: "2026-09-13T17:14:00Z", withdrawalStatus: "Revoked" },
    ],
    requests: [
      { id: "R-701", type: "Access", receivedDate: "2026-09-26", owner: "Customer Support", status: "In Progress", targetDate: "2026-10-12", notes: "Customer requests movement history, address and route records." },
      { id: "R-702", type: "Correction", receivedDate: "2026-09-17", owner: "Ops", status: "Resolved", targetDate: "2026-09-25", notes: "Address updated after validation." },
    ],
    incidents: [
      { id: "I-701", title: "Shipment ETA feed exposed to wrong client", category: "Misdirected data", severity: "Medium", detectedAt: "2026-09-10", owner: "Ops", status: "Monitoring", actions: "Review routing permissions and notify client", closureDate: null },
      { id: "I-702", title: "Driver contact list export to vendor", category: "Vendor issue", severity: "High", detectedAt: "2026-09-03", owner: "Fleet Ops", status: "Closed", actions: "Remove export and audit access", closureDate: "2026-09-07" },
    ],
    vendors: [
      { id: "V-701", name: "RouteOne Carriers", serviceType: "Freight and route management", dataAccess: "Customer and route datasets", riskScore: 74, assessmentStatus: "At Risk", contractReviewDate: "2026-10-20", lastAssessmentDate: "2026-08-22", owner: "Trade Ops" },
      { id: "V-702", name: "ClearPort Customs", serviceType: "Documentation and customs", dataAccess: "Shipment and compliance records", riskScore: 68, assessmentStatus: "Reviewed", contractReviewDate: "2026-11-04", lastAssessmentDate: "2026-09-08", owner: "Compliance" },
    ],
    activity: [
      { id: "L-701", time: "Today • 11:13", message: "Carrier contracts triggered a vendor review action item.", type: "vendor" },
      { id: "L-702", time: "Yesterday • 15:38", message: "Customer request workflow was updated after route data incident review.", type: "system" },
      { id: "L-703", time: "2026-09-29", message: "Shipment retention sweep remained overdue for two legacy datasets.", type: "task" },
    ],
  },
  {
    id: "pureharvest",
    name: "PureHarvest Foods Pvt. Ltd.",
    industry: "FMCG & Manufacturing",
    companyId: "PH-884",
    readiness: 73,
    country: "India",
    profile: "Food and manufacturing business with product, supplier and consumer transaction data.",
    logoPlaceholder: "PH",
    subscription: {
      plan: "Growth",
      monthlyPrice: 2499,
      renewalDate: "2026-11-19",
      features: ["Operational controls", "Compliance workflows", "Implementation support"],
    },
    metrics: {
      openTasks: 8,
      completedTasks: 18,
      overdueTasks: 3,
      openRisks: 4,
      pendingReviews: 4,
      readinessTrend: [64, 68, 70, 73, 74, 73],
    },
    assessment: {
      progress: 79,
      answers: {
        dataCollection: "Product and supplier data are purpose-limited",
        notices: "Consumer notices available for online purchases",
        storage: "Encryption, vendor controls and role-based access are mostly in place",
        retention: "Food safety and supplier records have planned review windows",
        sharing: "Distribution and logistics partners require stronger review",
        rights: "Consumer requests are received through support channels",
        breach: "Incident plan exists and is tested annually",
        governance: "Legal and operations governance are operationally aligned",
      },
      summary: "Strong operational controls with a few gaps in supplier transparency and retention governance.",
      riskLevel: "Moderate",
    },
    assets: [
      { id: "A-8001", name: "Consumer Purchase Records", category: "Transactional Data", purpose: "Order fulfilment and service", source: "E-commerce and POS", storage: "ERP + cloud", department: "Sales", thirdPartySharing: "Logistics partners", retention: "5 years", riskLevel: "High", lastReviewed: "2026-09-09" },
      { id: "A-8002", name: "Supplier Records", category: "Procurement Data", purpose: "Supply chain management", source: "Vendor onboarding", storage: "Supplier portal", department: "Procurement", thirdPartySharing: "Auditors and logistics", retention: "7 years", riskLevel: "Medium", lastReviewed: "2026-09-13" },
      { id: "A-8003", name: "Batch Quality Data", category: "Product Data", purpose: "Quality assurance and audits", source: "Factory sensors and forms", storage: "Quality database", department: "Quality", thirdPartySharing: "No", retention: "3 years", riskLevel: "Medium", lastReviewed: "2026-09-20" },
    ],
    tasks: [
      { id: "T-801", title: "Review logistics sharing controls", description: "Confirm DPAs and deletion schedules with distribution vendors.", priority: "High", status: "Open", assignee: "Ritika J.", dueDate: "2026-10-16", category: "Vendor", createdAt: "2026-09-14" },
      { id: "T-802", title: "Consumer rights workflow", description: "Document access and correction flow for online order customers.", priority: "Medium", status: "Completed", assignee: "Naveen D.", dueDate: "2026-10-04", category: "Rights", createdAt: "2026-09-11" },
      { id: "T-803", title: "Retention validation", description: "Confirm age-based deletion for outdated consumer purchase logs and supplier records.", priority: "Medium", status: "In Progress", assignee: "Madhav P.", dueDate: "2026-10-24", category: "Retention", createdAt: "2026-09-26" },
    ],
    documents: [
      { id: "D-801", title: "Customer Privacy Notice", status: "Approved", owner: "Legal", version: "v3.4", updatedAt: "2026-09-12", nextReview: "2026-12-02" },
      { id: "D-802", title: "Supplier Data Processing Policy", status: "Review", owner: "Procurement", version: "v2.1", updatedAt: "2026-09-21", nextReview: "2026-11-01" },
      { id: "D-803", title: "Quality and Safety Retention Schedule", status: "Approved", owner: "Quality", version: "v2.6", updatedAt: "2026-09-06", nextReview: "2026-10-31" },
    ],
    consentRecords: [
      { id: "C-801", individual: "A. Iqbal", channel: "Ecommerce checkout", purpose: "Order fulfilment and support", status: "Granted", timestamp: "2026-09-27T11:54:00Z", withdrawalStatus: "Active" },
      { id: "C-802", individual: "P. Agarwal", channel: "Product registration", purpose: "Offers and product updates", status: "Granted", timestamp: "2026-09-18T09:22:00Z", withdrawalStatus: "Active" },
      { id: "C-803", individual: "S. Mullis", channel: "Loyalty program", purpose: "Personalised promotions", status: "Withdrawn", timestamp: "2026-09-13T13:40:00Z", withdrawalStatus: "Revoked" },
    ],
    requests: [
      { id: "R-801", type: "Access", receivedDate: "2026-09-25", owner: "Support", status: "Resolved", targetDate: "2026-09-30", notes: "Purchase history and profile data shared securely." },
      { id: "R-802", type: "Erasure", receivedDate: "2026-09-20", owner: "CRM", status: "In Progress", targetDate: "2026-10-11", notes: "Customer ceased marketing preferences and requested deletion of old purchase notes." },
    ],
    incidents: [
      { id: "I-801", title: "Supplier quote sheet shared to partner group", category: "Misdirected data", severity: "Medium", detectedAt: "2026-09-09", owner: "Procurement", status: "Closed", actions: "Remove access and tighten sharing controls", closureDate: "2026-09-13" },
      { id: "I-802", title: "Consumer support ticket exposed to wrong team", category: "Access issue", severity: "Medium", detectedAt: "2026-09-02", owner: "Support", status: "Monitoring", actions: "Review role mapping and access logs", closureDate: null },
    ],
    vendors: [
      { id: "V-801", name: "North Line Distribution", serviceType: "Logistics", dataAccess: "Order and address data", riskScore: 69, assessmentStatus: "Reviewed", contractReviewDate: "2026-10-23", lastAssessmentDate: "2026-08-31", owner: "Logistics" },
      { id: "V-802", name: "ColdChain Networks", serviceType: "Warehouse and transport", dataAccess: "Inventory and route data", riskScore: 66, assessmentStatus: "Reviewed", contractReviewDate: "2026-11-03", lastAssessmentDate: "2026-09-11", owner: "Operations" },
    ],
    activity: [
      { id: "L-801", time: "Today • 12:43", message: "Supplier data processing review was moved to review stage.", type: "document" },
      { id: "L-802", time: "Yesterday • 17:06", message: "Consumer rights workflow was completed for the support channel.", type: "task" },
      { id: "L-803", time: "2026-09-30", message: "North Line Distribution was assessed and marked as reviewed.", type: "vendor" },
    ],
  },
  {
    id: "talentsphere",
    name: "TalentSphere HR Solutions Pvt. Ltd.",
    industry: "Recruitment & HR",
    companyId: "TS-920",
    readiness: 49,
    country: "India",
    profile: "Recruitment and workforce staffing company handling candidate data, hiring workflows and employer records.",
    logoPlaceholder: "TS",
    subscription: {
      plan: "Partner",
      monthlyPrice: 5999,
      renewalDate: "2026-11-09",
      features: ["Executive reviews", "Advanced risk reporting", "Dedicated support"],
    },
    metrics: {
      openTasks: 13,
      completedTasks: 12,
      overdueTasks: 5,
      openRisks: 7,
      pendingReviews: 8,
      readinessTrend: [42, 45, 49, 46, 49, 49],
    },
    assessment: {
      progress: 56,
      answers: {
        dataCollection: "Recruitment forms capture personal and employment data",
        notices: "Candidate notices are present but not consistently applied across channels",
        storage: "Limited central controls and inconsistent access review",
        retention: "Candidate history retention is uneven across recruitment systems",
        sharing: "Client and staffing partners require stronger DPA controls",
        rights: "Candidate rights requests are handled manually by recruiters",
        breach: "Breach response plan is under development",
        governance: "Privacy governance across hiring teams is informal",
      },
      summary: "Recruitment data controls are evolving but have material gaps in retention, rights handling and governance.",
      riskLevel: "Elevated",
    },
    assets: [
      { id: "A-9001", name: "Candidate CV Database", category: "Candidate Data", purpose: "Recruitment matching and evaluation", source: "Portal and referrals", storage: "HRIS and file share", department: "Talent Acquisition", thirdPartySharing: "Client hiring teams", retention: "3 years", riskLevel: "High", lastReviewed: "2026-09-08" },
      { id: "A-9002", name: "Employee Onboarding Data", category: "Personnel Data", purpose: "Background checks and onboarding", source: "Internal forms", storage: "HRIS", department: "People Ops", thirdPartySharing: "Background verification vendor", retention: "5 years", riskLevel: "High", lastReviewed: "2026-09-11" },
      { id: "A-9003", name: "Employer Client Records", category: "Business Data", purpose: "Account management and service delivery", source: "Sales and onboarding", storage: "CRM + file share", department: "Client Services", thirdPartySharing: "Partner staffing vendors", retention: "2 years", riskLevel: "Medium", lastReviewed: "2026-09-19" },
    ],
    tasks: [
      { id: "T-901", title: "Candidate consent refresh", description: "Revalidate candidate consent across portal and referral-based hiring funnels.", priority: "Critical", status: "Open", assignee: "Pallavi M.", dueDate: "2026-10-15", category: "Consent", createdAt: "2026-09-17" },
      { id: "T-902", title: "CV retention cleanup", description: "Delete old candidate records after review cycles and role closure.", priority: "High", status: "Overdue", assignee: "Sanjay R.", dueDate: "2026-10-05", category: "Retention", createdAt: "2026-08-27" },
      { id: "T-903", title: "Verify staffing partner controls", description: "Assess background verification and staffing vendor contracts.", priority: "Medium", status: "In Progress", assignee: "Mira D.", dueDate: "2026-10-21", category: "Vendor", createdAt: "2026-09-25" },
    ],
    documents: [
      { id: "D-901", title: "Candidate Privacy Notice", status: "Draft", owner: "Legal", version: "v1.9", updatedAt: "2026-09-18", nextReview: "2026-10-29" },
      { id: "D-902", title: "Recruitment Data Handling Policy", status: "Pending", owner: "People Ops", version: "v1.5", updatedAt: "2026-09-12", nextReview: "2026-10-31" },
      { id: "D-903", title: "Breach Response Plan", status: "Review", owner: "Security", version: "v1.0", updatedAt: "2026-09-24", nextReview: "2026-11-03" },
    ],
    consentRecords: [
      { id: "C-901", individual: "K. Sharma", channel: "Job portal", purpose: "Candidate evaluation and hiring", status: "Granted", timestamp: "2026-09-29T09:56:00Z", withdrawalStatus: "Active" },
      { id: "C-902", individual: "M. Chawla", channel: "Referral form", purpose: "Shortlisting and outreach", status: "Pending", timestamp: "2026-09-20T12:34:00Z", withdrawalStatus: "Active" },
      { id: "C-903", individual: "A. Banerjee", channel: "Newsletter opt-in", purpose: "Career updates", status: "Granted", timestamp: "2026-09-14T08:24:00Z", withdrawalStatus: "Active" },
    ],
    requests: [
      { id: "R-901", type: "Access", receivedDate: "2026-09-27", owner: "Talent Ops", status: "Open", targetDate: "2026-10-13", notes: "Candidate requested HRIS and screening history summary." },
      { id: "R-902", type: "Erasure", receivedDate: "2026-09-19", owner: "Recruitment", status: "In Progress", targetDate: "2026-10-06", notes: "Candidate requested deletion of profile and CV after withdrawal." },
    ],
    incidents: [
      { id: "I-901", title: "Candidate CV exported to broad email thread", category: "Misdirected data", severity: "High", detectedAt: "2026-09-12", owner: "Talent Ops", status: "Monitoring", actions: "Audit mail list and tighten role access", closureDate: null },
      { id: "I-902", title: "Background check document stored in general drive", category: "Storage issue", severity: "Medium", detectedAt: "2026-09-05", owner: "HR IS", status: "Closed", actions: "Moved to secure storage and reviewed controls", closureDate: "2026-09-09" },
    ],
    vendors: [
      { id: "V-901", name: "VerifyNow Background Checks", serviceType: "Background verification", dataAccess: "Identity and employment records", riskScore: 77, assessmentStatus: "At Risk", contractReviewDate: "2026-10-24", lastAssessmentDate: "2026-08-14", owner: "People Ops" },
      { id: "V-902", name: "HireWave Client Portal", serviceType: "Client hiring and workflow", dataAccess: "Employment and candidate records", riskScore: 64, assessmentStatus: "Reviewed", contractReviewDate: "2026-11-01", lastAssessmentDate: "2026-09-04", owner: "Client Services" },
    ],
    activity: [
      { id: "L-901", time: "Today • 10:08", message: "Candidate privacy notice draft created for the portal refresh.", type: "document" },
      { id: "L-902", time: "Yesterday • 15:11", message: "CV retention cleanup remained overdue for legacy recruiting datasets.", type: "task" },
      { id: "L-903", time: "2026-09-29", message: "VerifyNow Background Checks assessment is still flagged at-risk.", type: "vendor" },
    ],
  },
  {
    id: "cloudpeak",
    name: "CloudPeak Digital Marketing Pvt. Ltd.",
    industry: "Digital Marketing",
    companyId: "CP-760",
    readiness: 89,
    country: "India",
    profile: "Performance marketing and creative agency managing campaign data, customer profiles and partner platforms.",
    logoPlaceholder: "CP",
    subscription: {
      plan: "Starter",
      monthlyPrice: 999,
      renewalDate: "2026-11-10",
      features: ["Core privacy controls", "Task management", "Campaign reports"],
    },
    metrics: {
      openTasks: 5,
      completedTasks: 19,
      overdueTasks: 1,
      openRisks: 2,
      pendingReviews: 3,
      readinessTrend: [82, 84, 86, 88, 89, 89],
    },
    assessment: {
      progress: 93,
      answers: {
        dataCollection: "Customer and campaign data collection is clearly disclosed",
        notices: "Marketing notices and cookie disclosures are in place",
        storage: "Cloud security, encryption and access policies are mature",
        retention: "Campaign and lead data retention windows are managed",
        sharing: "Partner APIs and ad networks are reviewed and monitored",
        rights: "Access and consent withdrawal routes are operational",
        breach: "Breach response playbook is tested and documented",
        governance: "Privacy ownership and executive oversight are active",
      },
      summary: "The environment is highly mature, with small process refinements needed for evolving ad-tech tracking regulations.",
      riskLevel: "Low",
    },
    assets: [
      { id: "A-10001", name: "Campaign Lead Lists", category: "Marketing Data", purpose: "Campaign execution and lead nurturing", source: "Website forms and ad platforms", storage: "Ad CRM + data warehouse", department: "Marketing", thirdPartySharing: "Ad networks and CRM tools", retention: "18 months", riskLevel: "Medium", lastReviewed: "2026-09-15" },
      { id: "A-10002", name: "Audience Segments", category: "Behavioral Data", purpose: "Targeting and optimization", source: "Platform tracking", storage: "Cloud warehouse", department: "Performance", thirdPartySharing: "Meta, Google and programmatic vendors", retention: "12 months", riskLevel: "Medium", lastReviewed: "2026-09-09" },
      { id: "A-10003", name: "Client Brand Assets", category: "Business Data", purpose: "Creative management", source: "Client briefs and files", storage: "Creative library", department: "Creative", thirdPartySharing: "No", retention: "2 years", riskLevel: "Low", lastReviewed: "2026-09-18" },
    ],
    tasks: [
      { id: "T-1001", title: "Ad-tech consent audit", description: "Review ad network consent logs and tracking disclosures.", priority: "Medium", status: "Completed", assignee: "Anya V.", dueDate: "2026-10-02", category: "Consent", createdAt: "2026-09-07" },
      { id: "T-1002", title: "Prompt vendor contract review", description: "Refresh data processing addenda for tracking and creative vendors.", priority: "Low", status: "Open", assignee: "Karan S.", dueDate: "2026-10-25", category: "Vendor", createdAt: "2026-09-20" },
      { id: "T-1003", title: "Campaign retention validation", description: "Confirm final deletion date for old social campaign leads.", priority: "Medium", status: "In Progress", assignee: "Poonam R.", dueDate: "2026-10-13", category: "Retention", createdAt: "2026-09-27" },
    ],
    documents: [
      { id: "D-1001", title: "Privacy Notice for Leads", status: "Approved", owner: "Legal", version: "v4.5", updatedAt: "2026-09-06", nextReview: "2026-11-12" },
      { id: "D-1002", title: "Ad Tech Consent Procedure", status: "Approved", owner: "Marketing Ops", version: "v2.2", updatedAt: "2026-09-18", nextReview: "2026-10-30" },
      { id: "D-1003", title: "Vendor DPIA Register", status: "Review", owner: "Procurement", version: "v3.0", updatedAt: "2026-09-16", nextReview: "2026-10-27" },
    ],
    consentRecords: [
      { id: "C-1001", individual: "R. Bedi", channel: "Landing page", purpose: "Lead nurturing and campaign follow-up", status: "Granted", timestamp: "2026-09-30T08:40:00Z", withdrawalStatus: "Active" },
      { id: "C-1002", individual: "F. Singh", channel: "Newsletter subscription", purpose: "Marketing updates", status: "Granted", timestamp: "2026-09-20T10:06:00Z", withdrawalStatus: "Active" },
      { id: "C-1003", individual: "S. Patel", channel: "CRM form", purpose: "Offer and remarketing", status: "Withdrawn", timestamp: "2026-09-12T15:26:00Z", withdrawalStatus: "Revoked" },
    ],
    requests: [
      { id: "R-1001", type: "Access", receivedDate: "2026-09-28", owner: "CRM", status: "Resolved", targetDate: "2026-10-01", notes: "Lead data and campaign interaction history shared securely." },
      { id: "R-1002", type: "Withdrawal", receivedDate: "2026-09-16", owner: "Marketing Ops", status: "Resolved", targetDate: "2026-09-29", notes: "Consent withdrawal confirmed across lead and email lists." },
    ],
    incidents: [
      { id: "I-1001", title: "Audience segment exported to unapproved platform", category: "Third-party risk", severity: "Medium", detectedAt: "2026-09-14", owner: "Marketing Ops", status: "Closed", actions: "Remove export and re-validate partner controls", closureDate: "2026-09-17" },
      { id: "I-1002", title: "Lead form redirect captured campaign data in wrong list", category: "Data quality issue", severity: "Low", detectedAt: "2026-09-03", owner: "Performance", status: "Closed", actions: "Corrected forms and refreshed validation", closureDate: "2026-09-05" },
    ],
    vendors: [
      { id: "V-1001", name: "SocialScale Ads", serviceType: "Programmatic campaigns", dataAccess: "Lead and audience lists", riskScore: 54, assessmentStatus: "Reviewed", contractReviewDate: "2026-10-28", lastAssessmentDate: "2026-09-04", owner: "Media Buying" },
      { id: "V-1002", name: "PixelNest CRM", serviceType: "CRM and automation", dataAccess: "Lead profile and engagement data", riskScore: 52, assessmentStatus: "Reviewed", contractReviewDate: "2026-11-05", lastAssessmentDate: "2026-09-05", owner: "Marketing Ops" },
    ],
    activity: [
      { id: "L-1001", time: "Today • 09:40", message: "Ad-tech consent procedure was validated for the latest campaign setup.", type: "assessment" },
      { id: "L-1002", time: "Yesterday • 14:10", message: "Vendor DPIA register moved to review after platform update.", type: "vendor" },
      { id: "L-1003", time: "2026-09-30", message: "Campaign retention validation is in progress for legacy lead lists.", type: "task" },
    ],
  },
];

export const demoUserCredentials = companySeeds.map((company) => ({
  companyId: company.id,
  name: company.name,
  email: `${company.id}@demo.aegis`,
  password: "demo123",
}));
