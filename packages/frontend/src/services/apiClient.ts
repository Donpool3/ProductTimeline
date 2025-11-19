/**
 * API Client with Mock Mode Toggle
 *
 * Provides a unified interface for API calls that can switch between
 * real backend API and mock data based on environment configuration.
 */

import { Project, Timeline, Phase, Milestone } from '../types';
import { mockApiClient } from './mockApi';
import { isMockMode, getApiBaseUrl } from '../utils/env';

const MOCK_MODE = isMockMode();
const API_BASE_URL = getApiBaseUrl();

/**
 * Real API Client
 * Makes actual HTTP requests to the backend
 */
class RealApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getProjects(): Promise<Project[]> {
    return this.fetch<Project[]>('/projects');
  }

  async getProject(projectId: string): Promise<Project> {
    return this.fetch<Project>(`/projects/${projectId}`);
  }

  async getTimeline(projectId: string): Promise<Timeline> {
    return this.fetch<Timeline>(`/projects/${projectId}/timeline`);
  }

  async getPhases(projectId: string): Promise<Phase[]> {
    return this.fetch<Phase[]>(`/projects/${projectId}/phases`);
  }

  async getMilestones(projectId: string, phaseId?: string): Promise<Milestone[]> {
    const query = phaseId ? `?phaseId=${phaseId}` : '';
    return this.fetch<Milestone[]>(`/projects/${projectId}/milestones${query}`);
  }
}

/**
 * API Client Factory
 * Returns either mock or real API client based on configuration
 */
class ApiClientFactory {
  private mockClient = mockApiClient;
  private realClient = new RealApiClient(API_BASE_URL);
  private useMock: boolean;

  constructor() {
    this.useMock = MOCK_MODE;
    console.log(`[API Client] Mode: ${this.useMock ? 'MOCK' : 'REAL'}`);
  }

  /**
   * Toggle between mock and real API
   */
  setMockMode(enabled: boolean): void {
    this.useMock = enabled;
    console.log(`[API Client] Switched to ${enabled ? 'MOCK' : 'REAL'} mode`);
  }

  /**
   * Check if mock mode is enabled
   */
  isMockMode(): boolean {
    return this.useMock;
  }

  /**
   * Get all projects
   */
  async getProjects(): Promise<Project[]> {
    return this.useMock ? this.mockClient.getProjects() : this.realClient.getProjects();
  }

  /**
   * Get a single project by ID
   */
  async getProject(projectId: string): Promise<Project> {
    return this.useMock
      ? this.mockClient.getProject(projectId)
      : this.realClient.getProject(projectId);
  }

  /**
   * Get timeline for a project
   */
  async getTimeline(projectId: string): Promise<Timeline> {
    return this.useMock
      ? this.mockClient.getTimeline(projectId)
      : this.realClient.getTimeline(projectId);
  }

  /**
   * Get phases for a project
   */
  async getPhases(projectId: string): Promise<Phase[]> {
    return this.useMock
      ? this.mockClient.getPhases(projectId)
      : this.realClient.getPhases(projectId);
  }

  /**
   * Get milestones for a project
   */
  async getMilestones(projectId: string, phaseId?: string): Promise<Milestone[]> {
    return this.useMock
      ? this.mockClient.getMilestones(projectId, phaseId)
      : this.realClient.getMilestones(projectId, phaseId);
  }
}

// Export singleton instance
export const apiClient = new ApiClientFactory();
