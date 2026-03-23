import { PrismaClient, UserRole, PromptStatus, PromptType, AgentRunStatus, ReviewAction } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.adEvent.deleteMany();
  await prisma.unlockEvent.deleteMany();
  await prisma.reviewDecision.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.promptPreview.deleteMany();
  await prisma.promptVersion.deleteMany();
  await prisma.promptDraft.deleteMany();
  await prisma.agentRun.deleteMany();
  await prisma.promptTag.deleteMany();
  await prisma.prompt.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  // ── Users ──────────────────────────────────────────────────────────────

  const admin = await prisma.user.create({
    data: {
      email: "admin@promptplatform.io",
      name: "Sarah Chen",
      role: UserRole.ADMIN,
      emailVerified: new Date("2025-12-01"),
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    },
  });

  const reviewer = await prisma.user.create({
    data: {
      email: "reviewer@promptplatform.io",
      name: "Marcus Rivera",
      role: UserRole.REVIEWER,
      emailVerified: new Date("2025-12-15"),
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus",
    },
  });

  const user = await prisma.user.create({
    data: {
      email: "user@example.com",
      name: "Jamie Okoro",
      role: UserRole.USER,
      emailVerified: new Date("2026-01-10"),
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=jamie",
    },
  });

  console.log("  Created 3 users");

  // ── Categories ─────────────────────────────────────────────────────────

  const categories = await Promise.all([
    prisma.category.create({
      data: { name: "Writing", slug: "writing", description: "Prompts for blog posts, articles, copywriting, and creative writing", icon: "PenLine", sortOrder: 1 },
    }),
    prisma.category.create({
      data: { name: "Coding", slug: "coding", description: "Prompts for code generation, review, debugging, and documentation", icon: "Code2", sortOrder: 2 },
    }),
    prisma.category.create({
      data: { name: "Marketing", slug: "marketing", description: "Prompts for ad copy, social media, SEO, and campaign strategy", icon: "Megaphone", sortOrder: 3 },
    }),
    prisma.category.create({
      data: { name: "Design", slug: "design", description: "Prompts for UI/UX, image generation, branding, and visual concepts", icon: "Palette", sortOrder: 4 },
    }),
    prisma.category.create({
      data: { name: "Business", slug: "business", description: "Prompts for strategy, analysis, planning, and operations", icon: "Briefcase", sortOrder: 5 },
    }),
    prisma.category.create({
      data: { name: "Education", slug: "education", description: "Prompts for lesson plans, tutoring, quizzes, and explanations", icon: "GraduationCap", sortOrder: 6 },
    }),
    prisma.category.create({
      data: { name: "Data", slug: "data", description: "Prompts for data analysis, visualization, SQL queries, and reporting", icon: "BarChart3", sortOrder: 7 },
    }),
    prisma.category.create({
      data: { name: "Creative", slug: "creative", description: "Prompts for storytelling, world-building, character creation, and art direction", icon: "Sparkles", sortOrder: 8 },
    }),
  ]);

  const [writing, coding, marketing, design, business, education, data, creative] = categories;

  console.log("  Created 8 categories");

  // ── Tags ───────────────────────────────────────────────────────────────

  const tagData = [
    { name: "GPT-4", slug: "gpt-4" },
    { name: "Claude", slug: "claude" },
    { name: "Beginner Friendly", slug: "beginner-friendly" },
    { name: "Advanced", slug: "advanced" },
    { name: "Chain-of-Thought", slug: "chain-of-thought" },
    { name: "Few-Shot", slug: "few-shot" },
    { name: "Zero-Shot", slug: "zero-shot" },
    { name: "System Prompt", slug: "system-prompt" },
    { name: "SEO", slug: "seo" },
    { name: "Productivity", slug: "productivity" },
    { name: "API", slug: "api" },
    { name: "React", slug: "react" },
    { name: "Python", slug: "python" },
    { name: "TypeScript", slug: "typescript" },
    { name: "Structured Output", slug: "structured-output" },
    { name: "Role-Play", slug: "role-play" },
    { name: "Template", slug: "template" },
  ];

  const tags: Record<string, { id: string }> = {};
  for (const t of tagData) {
    tags[t.slug] = await prisma.tag.create({ data: t });
  }

  console.log(`  Created ${tagData.length} tags`);

  // ── Prompts ────────────────────────────────────────────────────────────

  // 1. Published - Blog Post Generator
  const blogPrompt = await prisma.prompt.create({
    data: {
      title: "SEO-Optimized Blog Post Generator",
      slug: "seo-blog-post-generator",
      description: "Generate comprehensive, SEO-friendly blog posts with proper heading structure, meta descriptions, and keyword placement. Produces long-form content ready for publication.",
      type: PromptType.TEXT,
      status: PromptStatus.PUBLISHED,
      categoryId: writing.id,
      content: `You are an expert SEO content writer. Write a comprehensive blog post based on the following inputs.

**Topic:** {{topic}}
**Target Keyword:** {{keyword}}
**Word Count Target:** {{word_count|default:1500}}
**Tone:** {{tone|default:professional yet conversational}}
**Target Audience:** {{audience|default:general readers}}

Follow these guidelines:

1. **Title:** Create an engaging, keyword-rich H1 title (under 60 characters).
2. **Meta Description:** Write a compelling meta description (150-160 characters) that includes the target keyword.
3. **Introduction:** Hook the reader in the first paragraph. Include the target keyword naturally within the first 100 words.
4. **Structure:** Use H2 and H3 headings to organize content logically. Each section should be 150-300 words.
5. **Keyword Density:** Maintain 1-2% keyword density. Use semantic variations and LSI keywords throughout.
6. **Internal Linking Suggestions:** Suggest 3-5 places where internal links could be added (mark with [INTERNAL LINK: suggested anchor text]).
7. **Call to Action:** End with a clear CTA relevant to the topic.
8. **Readability:** Keep paragraphs under 4 sentences. Use bullet points and numbered lists where appropriate. Aim for a Flesch reading ease score above 60.

Output the blog post in Markdown format.`,
      metadata: {
        variables: ["topic", "keyword", "word_count", "tone", "audience"],
        estimatedTokens: 2000,
        bestModel: "gpt-4o",
      },
      unlockCount: 342,
      viewCount: 1847,
      publishedAt: new Date("2026-02-01"),
      createdAt: new Date("2026-01-15"),
    },
  });

  // 2. Published - Code Review Prompt
  const codeReviewPrompt = await prisma.prompt.create({
    data: {
      title: "Senior Engineer Code Review Assistant",
      slug: "senior-engineer-code-review",
      description: "A system prompt that turns an LLM into a meticulous senior engineer performing code reviews. Catches bugs, suggests improvements, and enforces best practices.",
      type: PromptType.SYSTEM_PROMPT,
      status: PromptStatus.PUBLISHED,
      categoryId: coding.id,
      content: `You are a senior software engineer with 15 years of experience performing a thorough code review. You specialize in {{language|default:TypeScript}} and follow industry best practices.

When reviewing code, analyze the following dimensions and provide feedback in a structured format:

## Review Checklist

### 1. Correctness
- Are there any bugs or logic errors?
- Are edge cases handled?
- Are error conditions properly managed?

### 2. Security
- Are there any SQL injection, XSS, or CSRF vulnerabilities?
- Is user input properly validated and sanitized?
- Are secrets or credentials exposed?

### 3. Performance
- Are there any N+1 query problems?
- Are there unnecessary re-renders or expensive computations?
- Could any operations be memoized or cached?

### 4. Readability & Maintainability
- Are variable and function names descriptive?
- Is the code DRY (Don't Repeat Yourself)?
- Are functions small and focused on a single responsibility?

### 5. Testing
- Are the critical paths covered by tests?
- Are test assertions meaningful?
- Are edge cases tested?

For each issue found, provide:
- **Severity:** Critical / Warning / Suggestion / Nitpick
- **Location:** File and line reference
- **Issue:** Clear description of the problem
- **Fix:** Concrete code suggestion

Start your review with a brief summary, then list issues by severity (critical first). End with positive observations about things done well.

---

Code to review:

\`\`\`{{language|default:TypeScript}}
{{code}}
\`\`\``,
      metadata: {
        variables: ["language", "code"],
        estimatedTokens: 1500,
        bestModel: "claude-sonnet",
      },
      unlockCount: 528,
      viewCount: 2931,
      publishedAt: new Date("2026-01-28"),
      createdAt: new Date("2026-01-10"),
    },
  });

  // 3. Approved - Marketing Copy Prompt
  const marketingPrompt = await prisma.prompt.create({
    data: {
      title: "Multi-Channel Marketing Copy Generator",
      slug: "multi-channel-marketing-copy",
      description: "Generate consistent marketing copy across email, social media, and landing pages from a single product brief. Maintains brand voice while adapting to each channel's requirements.",
      type: PromptType.CHAIN,
      status: PromptStatus.APPROVED,
      categoryId: marketing.id,
      content: `You are a seasoned marketing copywriter who adapts content for different channels while maintaining a consistent brand voice.

**Product/Service:** {{product}}
**Unique Value Proposition:** {{uvp}}
**Target Audience:** {{audience}}
**Brand Voice:** {{brand_voice|default:confident, friendly, and professional}}
**Campaign Goal:** {{goal|default:drive conversions}}

Generate copy for ALL of the following channels:

---

### 1. Email Subject Lines (5 options)
Provide 5 email subject lines, each under 50 characters. Include at least one with an emoji and one that creates urgency.

### 2. Email Body
Write a short marketing email (150-200 words) with:
- A compelling opening hook
- 3 bullet points highlighting benefits (not features)
- A clear, single CTA button text
- A P.S. line

### 3. Social Media Posts
**Twitter/X (3 variations):** Under 280 characters each. Include relevant hashtag suggestions.
**LinkedIn (1 post):** Professional tone, 100-150 words, storytelling approach.
**Instagram Caption (1 post):** Engaging, emoji-friendly, include CTA and hashtag block.

### 4. Landing Page Hero Section
- Headline (under 10 words)
- Subheadline (under 25 words)
- 3 bullet points for key benefits
- CTA button text
- Social proof suggestion

Format all output in Markdown with clear section headers.`,
      metadata: {
        variables: ["product", "uvp", "audience", "brand_voice", "goal"],
        estimatedTokens: 2500,
        bestModel: "gpt-4o",
      },
      unlockCount: 0,
      viewCount: 156,
      createdAt: new Date("2026-03-01"),
    },
  });

  // 4. Pending Review - Data Analysis Prompt
  const dataPrompt = await prisma.prompt.create({
    data: {
      title: "SQL Query Builder from Natural Language",
      slug: "natural-language-sql-builder",
      description: "Convert plain English questions into optimized SQL queries. Supports complex joins, aggregations, and window functions. Includes query explanation and optimization tips.",
      type: PromptType.CODE,
      status: PromptStatus.PENDING_REVIEW,
      categoryId: data.id,
      content: `You are an expert SQL developer. Convert the following natural language question into an optimized SQL query.

**Database Schema:**
\`\`\`sql
{{schema}}
\`\`\`

**Question:** {{question}}

**Database Engine:** {{engine|default:PostgreSQL}}

Provide your response in this format:

### Generated Query
\`\`\`sql
-- Your optimized SQL query here
\`\`\`

### Explanation
Walk through the query step by step:
1. What tables are involved and why
2. How joins connect the data
3. What filtering is applied
4. How results are aggregated or ordered

### Performance Notes
- Suggest any indexes that would help this query
- Note if the query could cause a full table scan
- Estimate relative complexity (simple / moderate / complex)

### Alternative Approaches
If there are multiple valid ways to write this query, briefly mention one alternative and explain the tradeoff.

Important rules:
- Use CTEs over subqueries for readability when appropriate
- Always alias tables in joins
- Avoid SELECT * — specify columns explicitly
- Use appropriate JOIN types (INNER, LEFT, etc.)
- Add comments for complex logic`,
      metadata: {
        variables: ["schema", "question", "engine"],
        estimatedTokens: 1200,
        bestModel: "claude-sonnet",
      },
      unlockCount: 0,
      viewCount: 42,
      createdAt: new Date("2026-03-15"),
    },
  });

  // 5. Draft - Education Prompt
  const educationPrompt = await prisma.prompt.create({
    data: {
      title: "Adaptive Learning Tutor",
      slug: "adaptive-learning-tutor",
      description: "A system prompt for an AI tutor that adapts explanations based on student level, uses the Socratic method, and provides practice problems with step-by-step solutions.",
      type: PromptType.SYSTEM_PROMPT,
      status: PromptStatus.DRAFT,
      categoryId: education.id,
      content: `You are a patient, encouraging tutor specializing in {{subject|default:mathematics}}. You adapt your teaching style to the student's level and learning pace.

**Student Level:** {{level|default:high school}}
**Learning Style:** {{style|default:visual and example-based}}
**Topic:** {{topic}}

Teaching Approach:

1. **Assess Understanding:** Start by asking 1-2 diagnostic questions to gauge the student's current knowledge of the topic.

2. **Explain Concepts:** Based on their level:
   - Use analogies and real-world examples
   - Break complex ideas into smaller steps
   - Include diagrams described in text when helpful (use ASCII art or describe visuals)

3. **Socratic Method:** Guide the student to discover answers by asking leading questions rather than giving direct answers immediately.

4. **Practice Problems:** Provide 3 practice problems at increasing difficulty:
   - **Easy:** Direct application of the concept
   - **Medium:** Requires combining two ideas
   - **Challenge:** Real-world application or edge case

5. **Solutions:** For each problem, provide a detailed step-by-step solution. Explain the "why" behind each step, not just the "how."

6. **Common Mistakes:** Highlight 2-3 common mistakes students make with this topic and how to avoid them.

Always be encouraging. If the student makes a mistake, help them understand where their reasoning went wrong without being dismissive.`,
      metadata: {
        variables: ["subject", "level", "style", "topic"],
        estimatedTokens: 1800,
      },
      unlockCount: 0,
      viewCount: 8,
      createdAt: new Date("2026-03-20"),
    },
  });

  // 6. Archived - Old Creative Prompt
  const creativePrompt = await prisma.prompt.create({
    data: {
      title: "Character Backstory Generator (Legacy)",
      slug: "character-backstory-generator-legacy",
      description: "Generate detailed character backstories for fiction writing and RPGs. Superseded by the v2 character development suite.",
      type: PromptType.TEXT,
      status: PromptStatus.ARCHIVED,
      categoryId: creative.id,
      content: `Create a detailed backstory for a fictional character with the following traits:

**Name:** {{name}}
**Genre:** {{genre|default:fantasy}}
**Role:** {{role|default:protagonist}}

Include the following sections:
1. **Origin:** Where they come from, family background, and early life.
2. **Defining Moment:** A pivotal event that shaped who they are.
3. **Motivation:** What drives them and what they ultimately want.
4. **Flaw:** A meaningful character flaw that creates internal conflict.
5. **Relationships:** 2-3 key relationships (allies, rivals, or mentors).
6. **Secret:** Something they hide from others.

Write in third person, past tense. Aim for 500-800 words. Make the backstory feel grounded and emotionally resonant, even in fantastical settings.`,
      metadata: {
        variables: ["name", "genre", "role"],
        estimatedTokens: 1000,
        deprecated: true,
        supersededBy: "character-development-suite-v2",
      },
      unlockCount: 89,
      viewCount: 567,
      publishedAt: new Date("2025-11-15"),
      createdAt: new Date("2025-11-01"),
    },
  });

  console.log("  Created 6 prompts");

  // ── Prompt Tags ────────────────────────────────────────────────────────

  await prisma.promptTag.createMany({
    data: [
      { promptId: blogPrompt.id, tagId: tags["seo"].id },
      { promptId: blogPrompt.id, tagId: tags["template"].id },
      { promptId: blogPrompt.id, tagId: tags["beginner-friendly"].id },
      { promptId: blogPrompt.id, tagId: tags["zero-shot"].id },
      { promptId: codeReviewPrompt.id, tagId: tags["system-prompt"].id },
      { promptId: codeReviewPrompt.id, tagId: tags["typescript"].id },
      { promptId: codeReviewPrompt.id, tagId: tags["advanced"].id },
      { promptId: codeReviewPrompt.id, tagId: tags["claude"].id },
      { promptId: marketingPrompt.id, tagId: tags["template"].id },
      { promptId: marketingPrompt.id, tagId: tags["productivity"].id },
      { promptId: marketingPrompt.id, tagId: tags["gpt-4"].id },
      { promptId: dataPrompt.id, tagId: tags["structured-output"].id },
      { promptId: dataPrompt.id, tagId: tags["chain-of-thought"].id },
      { promptId: dataPrompt.id, tagId: tags["claude"].id },
      { promptId: educationPrompt.id, tagId: tags["role-play"].id },
      { promptId: educationPrompt.id, tagId: tags["beginner-friendly"].id },
      { promptId: creativePrompt.id, tagId: tags["few-shot"].id },
      { promptId: creativePrompt.id, tagId: tags["role-play"].id },
    ],
  });

  console.log("  Created prompt-tag associations");

  // ── Prompt Versions ────────────────────────────────────────────────────

  await prisma.promptVersion.createMany({
    data: [
      {
        promptId: blogPrompt.id,
        version: 1,
        content: blogPrompt.content,
        changelog: "Initial version with core SEO blog generation capabilities.",
        createdAt: new Date("2026-01-15"),
      },
      {
        promptId: codeReviewPrompt.id,
        version: 1,
        content: "Basic code review prompt without structured output.",
        changelog: "Initial version with basic review checklist.",
        createdAt: new Date("2026-01-10"),
      },
      {
        promptId: codeReviewPrompt.id,
        version: 2,
        content: codeReviewPrompt.content,
        changelog: "Added severity levels, security review section, and structured output format.",
        createdAt: new Date("2026-01-25"),
      },
    ],
  });

  console.log("  Created prompt versions");

  // ── Prompt Previews ────────────────────────────────────────────────────

  await prisma.promptPreview.createMany({
    data: [
      {
        promptId: blogPrompt.id,
        type: "sample_output",
        content: `# 10 Proven Strategies to Boost Your Remote Team's Productivity in 2026

*Meta Description: Discover 10 actionable strategies to boost remote team productivity in 2026. From async communication to AI tools, learn what top companies are doing differently.*

## Introduction

Remote work isn't going anywhere — but the way we approach it is evolving fast. A recent Buffer study found that 67% of remote workers struggle with collaboration and communication, directly impacting team output...

[Preview truncated — unlock to see the full 1,500-word generated blog post]`,
        sortOrder: 1,
      },
      {
        promptId: blogPrompt.id,
        type: "variables",
        content: JSON.stringify({
          topic: "remote team productivity strategies",
          keyword: "remote team productivity",
          word_count: "1500",
          tone: "professional yet conversational",
          audience: "team leads and managers",
        }),
        sortOrder: 2,
      },
      {
        promptId: codeReviewPrompt.id,
        type: "sample_output",
        content: `## Code Review Summary

Overall, this is a well-structured React component. There are 2 critical issues related to security and performance that should be addressed before merging, along with several suggestions for improvement.

### Critical

**1. XSS Vulnerability via dangerouslySetInnerHTML**
- **Location:** UserProfile.tsx:47
- **Issue:** User-supplied \`bio\` field is rendered with \`dangerouslySetInnerHTML\` without sanitization.
- **Fix:** Use a sanitization library like DOMPurify...

[Preview truncated — unlock to see the full review output]`,
        sortOrder: 1,
      },
    ],
  });

  console.log("  Created prompt previews");

  // ── Agent Run ──────────────────────────────────────────────────────────

  const agentRun = await prisma.agentRun.create({
    data: {
      initiatedBy: admin.id,
      skill: "prompt-generator",
      input: {
        description: "Create a prompt for generating marketing copy across multiple channels",
        category: "marketing",
        targetModels: ["gpt-4o", "claude-sonnet"],
      },
      output: {
        generatedTitle: "Multi-Channel Marketing Copy Generator",
        generatedSlug: "multi-channel-marketing-copy",
        confidence: 0.92,
        iterations: 3,
      },
      status: AgentRunStatus.COMPLETED,
      startedAt: new Date("2026-02-28T14:00:00Z"),
      completedAt: new Date("2026-02-28T14:02:34Z"),
      createdAt: new Date("2026-02-28T14:00:00Z"),
    },
  });

  // Create a draft linked to the agent run
  await prisma.promptDraft.create({
    data: {
      promptId: marketingPrompt.id,
      agentRunId: agentRun.id,
      title: "Multi-Channel Marketing Copy Generator",
      description: marketingPrompt.description,
      content: marketingPrompt.content,
      type: PromptType.CHAIN,
      metadata: { agentGenerated: true, refinementRound: 3 },
    },
  });

  console.log("  Created agent run with draft");

  // ── Review Decisions ───────────────────────────────────────────────────

  await prisma.reviewDecision.createMany({
    data: [
      {
        promptId: blogPrompt.id,
        reviewerId: reviewer.id,
        action: ReviewAction.APPROVED,
        notes: "Excellent SEO prompt. The structured output format is clear, keyword density guidance is practical, and the internal linking suggestion feature adds real value. Ready for publication.",
        createdAt: new Date("2026-01-28"),
      },
      {
        promptId: codeReviewPrompt.id,
        reviewerId: reviewer.id,
        action: ReviewAction.NEEDS_CHANGES,
        notes: "Great structure, but the security review section should include OWASP Top 10 references. Also suggest adding a complexity rating to the summary.",
        createdAt: new Date("2026-01-20"),
      },
      {
        promptId: codeReviewPrompt.id,
        reviewerId: reviewer.id,
        action: ReviewAction.APPROVED,
        notes: "V2 addresses all previous feedback. Security section now references OWASP. Severity levels are well-defined. Approving for publication.",
        createdAt: new Date("2026-01-27"),
      },
      {
        promptId: marketingPrompt.id,
        reviewerId: reviewer.id,
        action: ReviewAction.APPROVED,
        notes: "Comprehensive multi-channel coverage. The email and social media sections are particularly strong. Brand voice consistency guidance is a nice touch.",
        createdAt: new Date("2026-03-10"),
      },
    ],
  });

  console.log("  Created review decisions");

  // ── Unlock Events ──────────────────────────────────────────────────────

  const unlockEvent1 = await prisma.unlockEvent.create({
    data: {
      promptId: blogPrompt.id,
      userId: user.id,
      method: "ad_view",
      ipHash: "a1b2c3d4e5f6",
      createdAt: new Date("2026-03-01"),
    },
  });

  const unlockEvent2 = await prisma.unlockEvent.create({
    data: {
      promptId: codeReviewPrompt.id,
      userId: user.id,
      method: "ad_view",
      ipHash: "a1b2c3d4e5f6",
      createdAt: new Date("2026-03-05"),
    },
  });

  await prisma.unlockEvent.create({
    data: {
      promptId: codeReviewPrompt.id,
      userId: null,
      method: "ad_view",
      ipHash: "f6e5d4c3b2a1",
      createdAt: new Date("2026-03-08"),
    },
  });

  // ── Ad Events ──────────────────────────────────────────────────────────

  await prisma.adEvent.createMany({
    data: [
      {
        unlockEventId: unlockEvent1.id,
        provider: "google_adsense",
        adUnitId: "ca-pub-1234567890",
        impressionId: "imp_abc123",
        completed: true,
        revenue: 0.0032,
        metadata: { adFormat: "rewarded_interstitial", duration: 15 },
      },
      {
        unlockEventId: unlockEvent2.id,
        provider: "google_adsense",
        adUnitId: "ca-pub-1234567890",
        impressionId: "imp_def456",
        completed: true,
        revenue: 0.0028,
        metadata: { adFormat: "rewarded_interstitial", duration: 15 },
      },
    ],
  });

  console.log("  Created unlock events with ad events");

  // ── Audit Logs ─────────────────────────────────────────────────────────

  await prisma.auditLog.createMany({
    data: [
      {
        userId: admin.id,
        promptId: blogPrompt.id,
        action: "prompt.created",
        details: { title: blogPrompt.title },
        ipAddress: "192.168.1.1",
        createdAt: new Date("2026-01-15"),
      },
      {
        userId: reviewer.id,
        promptId: blogPrompt.id,
        action: "prompt.reviewed",
        details: { action: "APPROVED", version: 1 },
        ipAddress: "192.168.1.2",
        createdAt: new Date("2026-01-28"),
      },
      {
        userId: admin.id,
        promptId: blogPrompt.id,
        action: "prompt.published",
        details: { publishedAt: "2026-02-01T00:00:00.000Z" },
        ipAddress: "192.168.1.1",
        createdAt: new Date("2026-02-01"),
      },
      {
        userId: admin.id,
        promptId: codeReviewPrompt.id,
        action: "prompt.created",
        details: { title: codeReviewPrompt.title },
        ipAddress: "192.168.1.1",
        createdAt: new Date("2026-01-10"),
      },
      {
        userId: reviewer.id,
        promptId: codeReviewPrompt.id,
        action: "prompt.reviewed",
        details: { action: "NEEDS_CHANGES", version: 1 },
        ipAddress: "192.168.1.2",
        createdAt: new Date("2026-01-20"),
      },
      {
        userId: admin.id,
        promptId: codeReviewPrompt.id,
        action: "prompt.version_created",
        details: { version: 2, changelog: "Added security section and severity levels" },
        ipAddress: "192.168.1.1",
        createdAt: new Date("2026-01-25"),
      },
      {
        userId: reviewer.id,
        promptId: codeReviewPrompt.id,
        action: "prompt.reviewed",
        details: { action: "APPROVED", version: 2 },
        ipAddress: "192.168.1.2",
        createdAt: new Date("2026-01-27"),
      },
      {
        userId: admin.id,
        promptId: codeReviewPrompt.id,
        action: "prompt.published",
        details: { publishedAt: "2026-01-28T00:00:00.000Z" },
        ipAddress: "192.168.1.1",
        createdAt: new Date("2026-01-28"),
      },
      {
        userId: user.id,
        promptId: blogPrompt.id,
        action: "prompt.unlocked",
        details: { method: "ad_view" },
        ipAddress: "10.0.0.1",
        createdAt: new Date("2026-03-01"),
      },
      {
        userId: user.id,
        promptId: codeReviewPrompt.id,
        action: "prompt.unlocked",
        details: { method: "ad_view" },
        ipAddress: "10.0.0.1",
        createdAt: new Date("2026-03-05"),
      },
      {
        userId: admin.id,
        promptId: creativePrompt.id,
        action: "prompt.archived",
        details: { reason: "Superseded by v2 character development suite" },
        ipAddress: "192.168.1.1",
        createdAt: new Date("2026-03-10"),
      },
      {
        userId: null,
        promptId: null,
        action: "system.seed_completed",
        details: { version: "1.0.0", timestamp: new Date().toISOString() },
        createdAt: new Date(),
      },
    ],
  });

  console.log("  Created audit log entries");

  console.log("\nSeeding complete!");
  console.log(`
Summary:
  - Users:      3 (admin, reviewer, user)
  - Categories: 8
  - Tags:       ${tagData.length}
  - Prompts:    6 (2 published, 1 approved, 1 pending, 1 draft, 1 archived)
  - Versions:   3
  - Previews:   3
  - Reviews:    4
  - Agent Runs: 1
  - Drafts:     1
  - Unlocks:    3
  - Ad Events:  2
  - Audit Logs: 12
  `);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
