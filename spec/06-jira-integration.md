# Epic 6: Jira Integration

> Two-way sync with Jira Cloud: import issues, push estimates back, receive real-time updates.

## Dependencies

- Epic 2 (Premium Gating) - feature is gated behind premium

## Tasks

### 6.1 Schema: Integration tables

**File:** `convex/schema.ts`

```typescript
integrationConnections: defineTable({
  userId: v.id("users"),
  provider: v.union(v.literal("jira"), v.literal("github")),
  // Encrypted OAuth tokens
  encryptedAccessToken: v.string(),
  encryptedRefreshToken: v.optional(v.string()),
  tokenIv: v.string(),              // AES-256-GCM initialization vector
  tokenAuthTag: v.string(),         // AES-256-GCM auth tag
  expiresAt: v.number(),            // Token expiry timestamp
  // Provider-specific metadata
  providerUserId: v.optional(v.string()),
  providerUserEmail: v.optional(v.string()),
  // Jira-specific
  cloudId: v.optional(v.string()),   // Jira Cloud ID
  siteUrl: v.optional(v.string()),   // e.g., "https://yourteam.atlassian.net"
  scopes: v.array(v.string()),
  connectedAt: v.number(),
  lastRefreshedAt: v.number(),
})
  .index("by_user_provider", ["userId", "provider"])
  .index("by_provider", ["provider"]),

integrationMappings: defineTable({
  roomId: v.id("rooms"),
  connectionId: v.id("integrationConnections"),
  provider: v.union(v.literal("jira"), v.literal("github")),
  // Jira mapping
  jiraProjectKey: v.optional(v.string()),
  jiraBoardId: v.optional(v.number()),
  jiraSprintId: v.optional(v.number()),
  storyPointsFieldId: v.optional(v.string()), // e.g., "customfield_10016"
  // GitHub mapping (Epic 7)
  githubRepo: v.optional(v.string()),
  githubProjectId: v.optional(v.string()),
  // Sync settings
  autoImport: v.boolean(),
  autoPushEstimates: v.boolean(),
  createdAt: v.number(),
})
  .index("by_room", ["roomId"])
  .index("by_connection", ["connectionId"]),

// Track imported issues for bidirectional linking
issueLinks: defineTable({
  issueId: v.id("issues"),
  provider: v.union(v.literal("jira"), v.literal("github")),
  externalId: v.string(),          // Jira issue key (e.g., "PROJ-123") or GitHub issue number
  externalUrl: v.string(),         // Direct link to the issue
  lastSyncedAt: v.number(),
})
  .index("by_issue", ["issueId"])
  .index("by_external", ["provider", "externalId"]),
```

---

### 6.2 Backend: Token encryption utilities

**File:** `convex/lib/encryption.ts`

AES-256-GCM encryption using Web Crypto API (works in Convex actions without Node.js):

```typescript
const ALGORITHM = "AES-GCM";

export async function encryptToken(
  plaintext: string,
  keyHex: string
): Promise<{ ciphertext: string; iv: string; authTag: string }> {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const key = await crypto.subtle.importKey(
    "raw",
    hexToBuffer(keyHex),
    ALGORITHM,
    false,
    ["encrypt"]
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encoder.encode(plaintext)
  );

  // GCM appends the auth tag to the ciphertext
  const encryptedArray = new Uint8Array(encrypted);
  const ciphertext = encryptedArray.slice(0, -16);
  const authTag = encryptedArray.slice(-16);

  return {
    ciphertext: bufferToHex(ciphertext),
    iv: bufferToHex(iv),
    authTag: bufferToHex(authTag),
  };
}

export async function decryptToken(
  ciphertext: string,
  iv: string,
  authTag: string,
  keyHex: string
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    hexToBuffer(keyHex),
    ALGORITHM,
    false,
    ["decrypt"]
  );

  // Reconstruct ciphertext + authTag
  const combined = new Uint8Array([
    ...hexToBuffer(ciphertext),
    ...hexToBuffer(authTag),
  ]);

  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv: hexToBuffer(iv) },
    key,
    combined
  );

  return new TextDecoder().decode(decrypted);
}

function hexToBuffer(hex: string): Uint8Array { /* ... */ }
function bufferToHex(buffer: Uint8Array): string { /* ... */ }
```

---

### 6.3 Backend: Jira OAuth flow

**Files:** `convex/integrations/jira.ts`, Next.js API routes

The OAuth flow happens across the Next.js frontend and Convex backend:

**Step 1 - Initiate OAuth (Next.js API route):**

```typescript
// src/app/api/integrations/jira/authorize/route.ts
export async function GET(request: Request) {
  const state = crypto.randomUUID(); // CSRF protection
  // Store state in cookie or session

  const params = new URLSearchParams({
    audience: "api.atlassian.com",
    client_id: process.env.JIRA_CLIENT_ID!,
    scope: "read:jira-work write:jira-work read:sprint:jira-software write:issue:jira-software offline_access",
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/jira/callback`,
    state,
    response_type: "code",
    prompt: "consent",
  });

  return Response.redirect(
    `https://auth.atlassian.com/authorize?${params.toString()}`
  );
}
```

**Step 2 - Handle callback (Next.js API route):**

```typescript
// src/app/api/integrations/jira/callback/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  // Verify state matches stored value

  // Exchange code for tokens
  const tokenResponse = await fetch("https://auth.atlassian.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: process.env.JIRA_CLIENT_ID,
      client_secret: process.env.JIRA_CLIENT_SECRET,
      code,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/jira/callback`,
    }),
  });

  const tokens = await tokenResponse.json();

  // Get accessible resources (Cloud ID)
  const resourcesResponse = await fetch(
    "https://api.atlassian.com/oauth/token/accessible-resources",
    { headers: { Authorization: `Bearer ${tokens.access_token}` } }
  );
  const resources = await resourcesResponse.json();
  const cloudId = resources[0]?.id;
  const siteUrl = resources[0]?.url;

  // Store tokens in Convex (encrypted) via a server-side mutation call
  // The Next.js route needs to call a Convex action to store the tokens
  // Option: Use Convex HTTP client or redirect with a one-time token

  return Response.redirect("/settings/integrations?connected=jira");
}
```

**Step 3 - Store tokens (Convex action):**

```typescript
// convex/integrations/jira.ts
export const storeConnection = internalAction({
  args: {
    userId: v.id("users"),
    accessToken: v.string(),
    refreshToken: v.string(),
    expiresIn: v.number(),
    cloudId: v.string(),
    siteUrl: v.string(),
    scopes: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const encKey = process.env.TOKEN_ENCRYPTION_KEY!;

    const encAccess = await encryptToken(args.accessToken, encKey);
    const encRefresh = await encryptToken(args.refreshToken, encKey);

    await ctx.runMutation(internal.integrations.saveConnection, {
      userId: args.userId,
      provider: "jira",
      encryptedAccessToken: encAccess.ciphertext,
      encryptedRefreshToken: encRefresh.ciphertext,
      tokenIv: encAccess.iv,
      tokenAuthTag: encAccess.authTag,
      expiresAt: Date.now() + args.expiresIn * 1000,
      cloudId: args.cloudId,
      siteUrl: args.siteUrl,
      scopes: args.scopes,
    });
  },
});
```

---

### 6.4 Backend: Token refresh

**File:** `convex/integrations/jira.ts`

```typescript
export async function refreshJiraToken(
  ctx: ActionCtx,
  connection: IntegrationConnection
): Promise<string> {
  const encKey = process.env.TOKEN_ENCRYPTION_KEY!;
  const refreshToken = await decryptToken(
    connection.encryptedRefreshToken!,
    connection.tokenIv,
    connection.tokenAuthTag,
    encKey
  );

  const response = await fetch("https://auth.atlassian.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "refresh_token",
      client_id: process.env.JIRA_CLIENT_ID,
      client_secret: process.env.JIRA_CLIENT_SECRET,
      refresh_token: refreshToken,
    }),
  });

  const tokens = await response.json();

  // Store new tokens (Atlassian uses rotating refresh tokens)
  const encAccess = await encryptToken(tokens.access_token, encKey);
  const encRefresh = await encryptToken(tokens.refresh_token, encKey);

  await ctx.runMutation(internal.integrations.updateTokens, {
    connectionId: connection._id,
    encryptedAccessToken: encAccess.ciphertext,
    encryptedRefreshToken: encRefresh.ciphertext,
    tokenIv: encAccess.iv,
    tokenAuthTag: encAccess.authTag,
    expiresAt: Date.now() + tokens.expires_in * 1000,
  });

  return tokens.access_token;
}
```

**Cron job** in `convex/crons.ts`:

```typescript
crons.interval("refresh-oauth-tokens", { minutes: 30 },
  internal.integrations.refreshExpiringTokens
);
```

---

### 6.5 Backend: Jira API client

**File:** `convex/integrations/jira-client.ts`

Wrapper around Jira REST API calls:

```typescript
export class JiraClient {
  constructor(
    private cloudId: string,
    private accessToken: string
  ) {}

  private get baseUrl() {
    return `https://api.atlassian.com/ex/jira/${this.cloudId}`;
  }

  async getProjects(): Promise<JiraProject[]> {
    return this.get("/rest/api/3/project/search");
  }

  async getBoards(projectKey: string): Promise<JiraBoard[]> {
    return this.get(`/rest/agile/1.0/board?projectKeyOrId=${projectKey}`);
  }

  async getSprints(boardId: number): Promise<JiraSprint[]> {
    return this.get(`/rest/agile/1.0/board/${boardId}/sprint?state=active,future`);
  }

  async getSprintIssues(sprintId: number): Promise<JiraIssue[]> {
    return this.get(`/rest/agile/1.0/sprint/${sprintId}/issue`);
  }

  async getBacklogIssues(boardId: number): Promise<JiraIssue[]> {
    return this.get(`/rest/agile/1.0/board/${boardId}/backlog`);
  }

  async findStoryPointsField(): Promise<string | null> {
    const fields = await this.get("/rest/api/3/field");
    const spField = fields.find(
      (f: any) => f.name === "Story Points" || f.name === "Story point estimate"
    );
    return spField?.id ?? null;
  }

  async updateStoryPoints(
    issueKey: string,
    fieldId: string,
    value: number
  ): Promise<void> {
    await this.put(`/rest/api/3/issue/${issueKey}`, {
      fields: { [fieldId]: value },
    });
  }

  async addComment(issueKey: string, body: string): Promise<void> {
    await this.post(`/rest/api/3/issue/${issueKey}/comment`, {
      body: { type: "doc", version: 1, content: [
        { type: "paragraph", content: [{ type: "text", text: body }] }
      ]},
    });
  }

  private async get(path: string) { /* fetch with auth header */ }
  private async put(path: string, body: any) { /* ... */ }
  private async post(path: string, body: any) { /* ... */ }
}
```

---

### 6.6 Backend: Import issues action

**File:** `convex/integrations/jira.ts`

```typescript
export const importIssues = action({
  args: {
    roomId: v.id("rooms"),
    jiraIssueKeys: v.array(v.string()), // Selected by user in modal
  },
  handler: async (ctx, { roomId, jiraIssueKeys }) => {
    // 1. Get user's Jira connection
    // 2. Build JiraClient with decrypted token
    // 3. Fetch issue details from Jira
    // 4. For each issue:
    //    a. Create issue in room via mutation
    //    b. Create issueLink record
    // 5. Return import summary
  },
});
```

---

### 6.7 Backend: Auto-push estimates

**File:** `convex/integrations/jira.ts`

When consensus is reached on a linked issue, push the estimate back to Jira:

```typescript
export const pushEstimateToJira = internalAction({
  args: {
    issueId: v.id("issues"),
    finalEstimate: v.string(),
  },
  handler: async (ctx, { issueId, finalEstimate }) => {
    // 1. Get issue link for this issue
    // 2. Get integration mapping for the room
    // 3. Build JiraClient with refreshed token
    // 4. Parse estimate to number
    // 5. Call jiraClient.updateStoryPoints()
    // 6. Optionally add a comment: "Estimated at X points via AgileKit"
  },
});
```

Trigger this from `completeIssueVoting()` if the room has an active Jira mapping with `autoPushEstimates: true`.

---

### 6.8 Backend: Jira webhooks (incoming changes)

**File:** `convex/http.ts`

Register a Jira webhook endpoint to receive issue updates:

```typescript
http.route({
  path: "/webhooks/jira",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Verify webhook (shared secret or HMAC)
    const payload = await request.json();

    await ctx.runMutation(internal.integrations.processJiraWebhook, {
      eventType: payload.webhookEvent,
      issue: payload.issue,
    });

    return new Response(null, { status: 200 });
  }),
});
```

Handle events:
- `jira:issue_updated` -> Update title/description in linked AgileKit issue
- `jira:issue_deleted` -> Mark linked issue as removed or show notification

---

### 6.9 Frontend: Connect Jira UI

**File:** `src/app/settings/integrations/page.tsx`

Settings page with:
- "Connect Jira" button -> initiates OAuth flow
- Shows connected Jira site info when connected
- "Disconnect" button to remove connection

---

### 6.10 Frontend: Import issues modal

**File:** `src/components/room/jira-import-modal.tsx`

When a room has a Jira connection, show an "Import from Jira" button in the issues panel:

1. Opens a modal/dialog
2. User selects: Project -> Board -> Sprint (or Backlog)
3. Shows list of issues with checkboxes
4. User selects issues and clicks "Import"
5. Issues are created in the room with Jira links

---

### 6.11 Frontend: Room mapping setup

**File:** `src/components/room/integration-settings.tsx`

In room settings, allow mapping the room to a Jira project:
- Select project from dropdown (fetched via API)
- Select board
- Toggle: Auto-import new sprint issues
- Toggle: Auto-push estimates back to Jira
- Show story points field auto-detection status

---

### 6.12 Jira webhook registration

Register webhooks dynamically when a mapping is created:

```typescript
// Called when user sets up Jira mapping for a room
export async function registerJiraWebhook(
  client: JiraClient,
  jqlFilter: string
): Promise<string> {
  const result = await client.post("/rest/api/3/webhook", {
    url: `${process.env.CONVEX_SITE_URL}/webhooks/jira`,
    webhooks: [{
      jqlFilter,
      events: ["jira:issue_updated", "jira:issue_deleted"],
    }],
  });
  return result.webhookRegistrationResult[0].createdWebhookId;
}
```

Note: Jira webhooks expire after 30 days. Add a cron job to refresh them:

```typescript
crons.weekly("refresh-jira-webhooks",
  { dayOfWeek: "sunday", hourUTC: 2, minuteUTC: 0 },
  internal.integrations.refreshJiraWebhooks
);
```

**Acceptance criteria for the entire epic:**
- User can connect their Jira Cloud account via OAuth
- Tokens are encrypted at rest in the database
- Tokens auto-refresh before expiry
- User can import issues from a Jira sprint into a room
- Imported issues show a Jira link icon
- Estimates auto-push to Jira when consensus is reached (if enabled)
- Jira issue title changes sync to AgileKit
- Room-level mapping persists across sessions
