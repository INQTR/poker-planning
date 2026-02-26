/**
 * Jira Cloud REST API client.
 * Used within Convex actions for all Jira API calls.
 */

export interface JiraProject {
  id: string;
  key: string;
  name: string;
}

export interface JiraBoard {
  id: number;
  name: string;
  type: string;
}

export interface JiraSprint {
  id: number;
  name: string;
  state: string;
  startDate?: string;
  endDate?: string;
}

export interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    issuetype: { name: string; iconUrl?: string };
    status: { name: string };
    priority?: { name: string };
    [key: string]: unknown;
  };
}

interface JiraField {
  id: string;
  name: string;
  custom: boolean;
}

export class JiraClient {
  constructor(
    private cloudId: string,
    private accessToken: string
  ) {}

  private get baseUrl() {
    return `https://api.atlassian.com/ex/jira/${this.cloudId}`;
  }

  async getProjects(): Promise<JiraProject[]> {
    const data = await this.get<{ values: JiraProject[] }>(
      "/rest/api/3/project/search"
    );
    return data.values;
  }

  async getBoards(projectKey: string): Promise<JiraBoard[]> {
    const data = await this.get<{ values: JiraBoard[] }>(
      `/rest/agile/1.0/board?projectKeyOrId=${encodeURIComponent(projectKey)}`
    );
    return data.values;
  }

  async getSprints(boardId: number): Promise<JiraSprint[]> {
    const data = await this.get<{ values: JiraSprint[] }>(
      `/rest/agile/1.0/board/${boardId}/sprint?state=active,future`
    );
    return data.values;
  }

  async getSprintIssues(sprintId: number): Promise<JiraIssue[]> {
    const data = await this.get<{ issues: JiraIssue[] }>(
      `/rest/agile/1.0/sprint/${sprintId}/issue?fields=summary,issuetype,status,priority`
    );
    return data.issues;
  }

  async getBacklogIssues(boardId: number): Promise<JiraIssue[]> {
    const data = await this.get<{ issues: JiraIssue[] }>(
      `/rest/agile/1.0/board/${boardId}/backlog?fields=summary,issuetype,status,priority`
    );
    return data.issues;
  }

  async getIssue(issueKey: string): Promise<JiraIssue> {
    return await this.get<JiraIssue>(
      `/rest/api/3/issue/${encodeURIComponent(issueKey)}?fields=summary,issuetype,status,priority`
    );
  }

  async findStoryPointsField(): Promise<string | null> {
    const fields = await this.get<JiraField[]>("/rest/api/3/field");
    const spField = fields.find(
      (f) =>
        f.name === "Story Points" || f.name === "Story point estimate"
    );
    return spField?.id ?? null;
  }

  async updateStoryPoints(
    issueKey: string,
    fieldId: string,
    value: number
  ): Promise<void> {
    await this.put(`/rest/api/3/issue/${encodeURIComponent(issueKey)}`, {
      fields: { [fieldId]: value },
    });
  }

  async addComment(issueKey: string, body: string): Promise<void> {
    await this.post(
      `/rest/api/3/issue/${encodeURIComponent(issueKey)}/comment`,
      {
        body: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: body }],
            },
          ],
        },
      }
    );
  }

  async registerWebhook(
    jqlFilter: string,
    webhookUrl: string
  ): Promise<string> {
    const result = await this.post<{
      webhookRegistrationResult: Array<{
        createdWebhookId: string;
      }>;
    }>("/rest/api/3/webhook", {
      url: webhookUrl,
      webhooks: [
        {
          jqlFilter,
          events: ["jira:issue_updated", "jira:issue_deleted"],
        },
      ],
    });
    return result.webhookRegistrationResult[0].createdWebhookId;
  }

  // -------------------------------------------------------------------------
  // HTTP helpers
  // -------------------------------------------------------------------------

  private async get<T>(path: string): Promise<T> {
    return this.request<T>("GET", path);
  }

  private async put(path: string, body: unknown): Promise<void> {
    await this.request<void>("PUT", path, body);
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>("POST", path, body);
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    retries = 2
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.accessToken}`,
      Accept: "application/json",
    };

    if (body) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    // Retry on 429 (rate limit)
    if (response.status === 429 && retries > 0) {
      const retryAfter = parseInt(response.headers.get("Retry-After") ?? "5");
      await new Promise((resolve) =>
        setTimeout(resolve, retryAfter * 1000)
      );
      return this.request<T>(method, path, body, retries - 1);
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Jira API ${method} ${path} failed: ${response.status} ${errorText}`
      );
    }

    // PUT/DELETE may return 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }
}
