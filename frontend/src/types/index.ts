/**
 * TypeScript type definitions for the frontend application
 */

// ──────────────────────────────────────────────────────────────────────────────
// API Response Types
// ──────────────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// ──────────────────────────────────────────────────────────────────────────────
// Project Types
// ──────────────────────────────────────────────────────────────────────────────

export interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  short_description: string;
  status: "live" | "development" | "archived";
  tags: string[];
  tech_stack: string[];
  thumbnail_url: string | null;
  live_url: string | null;
  github_url: string | null;
  metrics: ProjectMetrics | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectMetrics {
  uptime_percentage: number;
  avg_response_time_ms: number;
  total_requests: number;
  last_deployment: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// Blog Types
// ──────────────────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  category: string;
  tags: string[];
  read_time_minutes: number;
  published_at: string;
  updated_at: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// Contact Types
// ──────────────────────────────────────────────────────────────────────────────

export interface ContactMessage {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  message?: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// Skill Types
// ──────────────────────────────────────────────────────────────────────────────

export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number; // 1-100
  years_of_experience: number;
  icon: string | null;
}

// ──────────────────────────────────────────────────────────────────────────────
// Testimonial Types
// ──────────────────────────────────────────────────────────────────────────────

export interface Testimonial {
  id: number;
  author_name: string;
  author_title: string;
  author_avatar_url: string | null;
  company: string;
  content: string;
  verification_url: string | null;
  created_at: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// System Metrics Types
// ──────────────────────────────────────────────────────────────────────────────

export interface SystemMetrics {
  api_uptime: number;
  avg_response_time: number;
  projects_shipped: number;
  last_deployment: string;
  total_api_calls: number;
  active_visitors: number;
}

// ──────────────────────────────────────────────────────────────────────────────
// UI Types
// ──────────────────────────────────────────────────────────────────────────────

export type Theme = "dark" | "light" | "system";

export interface NavItem {
  name: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}
