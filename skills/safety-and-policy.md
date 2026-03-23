# Safety and Content Policy

## Content Policies

### Prohibited Content

The following categories of prompts are never permitted on the platform, regardless of intent or framing:

1. **Harmful instructions.** Prompts that generate instructions for causing physical harm, creating weapons, manufacturing drugs, or conducting attacks of any kind.

2. **Jailbreak assistance.** Prompts designed to bypass, override, or circumvent AI safety filters, content policies, or system instructions. This includes "DAN" prompts, role-play exploits, and instruction injection techniques.

3. **PII generation.** Prompts that generate, collect, or facilitate the exposure of personally identifiable information (real names with addresses, phone numbers, SSNs, financial details, medical records).

4. **Illegal content guidance.** Prompts that provide step-by-step guidance for illegal activities, including fraud, hacking, unauthorized access, identity theft, or copyright infringement tools.

5. **Discriminatory content.** Prompts that target, demean, or promote bias against individuals or groups based on race, ethnicity, gender, sexual orientation, religion, disability, age, or national origin.

6. **Sexual content involving minors.** Absolutely prohibited, zero tolerance.

7. **Harassment and threats.** Prompts designed to harass, threaten, stalk, or intimidate specific individuals.

8. **Disinformation tools.** Prompts explicitly designed to generate fake news, deepfake scripts, or manipulative propaganda.

### Restricted Content (Requires Extra Review)

These categories are not prohibited but require elevated review and explicit safety guardrails in the prompt itself:

- **Health and medical advice.** Must include disclaimers. Cannot present AI output as medical diagnosis.
- **Legal advice.** Must include disclaimers. Cannot present AI output as legal counsel.
- **Financial advice.** Must include disclaimers. Cannot present AI output as professional financial guidance.
- **Content about vulnerable populations.** Extra sensitivity review required.
- **Political content.** Must be balanced and not propagandistic.

## Review Escalation Criteria

A prompt should be escalated from the normal review queue when:

| Trigger | Action |
|---|---|
| Prompt falls in a prohibited category | Reject immediately, log as policy violation |
| Prompt is in a restricted category without disclaimers | Return for changes with specific disclaimer requirements |
| Reviewer is uncertain about policy application | Escalate to admin for second opinion |
| Prompt appears plagiarized | Escalate for IP review |
| Prompt has been modified after a previous rejection | Escalate for admin review of changes |
| Pattern of similar policy-violating submissions from same agent run | Escalate for pipeline review |

## User-Generated Content Handling

Currently, all prompts are generated internally (by agents or staff). If user-generated content is introduced in the future:

- All UGC must pass through the same review pipeline as agent-generated content.
- Users must agree to content policy terms before submitting.
- Repeat policy violators should have submission privileges suspended.
- A reporting mechanism must be available for published content that violates policy.

## DMCA and Intellectual Property

- Prompts must be original or properly attributed.
- If a prompt closely mirrors a specific copyrighted work's structure (e.g., a specific author's known framework), it should be flagged.
- DMCA takedown requests should be processed within 48 hours by an admin.
- Maintain a log of all IP-related actions in the audit trail.

## Rate Limiting Guidelines

Rate limits protect the platform from abuse and ensure fair access:

| Endpoint Category | Rate Limit | Window |
|---|---|---|
| Public browsing (catalog, search) | 100 requests | 1 minute |
| Unlock requests | 10 requests | 1 minute per IP |
| Ad completion callbacks | 5 requests | 1 minute per IP |
| API routes (authenticated) | 60 requests | 1 minute per user |
| Admin operations | 120 requests | 1 minute per user |
| Agent run triggers | 5 requests | 5 minutes per user |

### Abuse Prevention

- Hash and store IP addresses for rate limiting (do not store raw IPs long-term).
- Detect patterns: same IP unlocking many prompts in rapid succession suggests automation.
- Implement ad completion verification to prevent spoofed unlock events.
- Monitor for unusual agent run patterns (high volume, repetitive content).

## Incident Response

When a policy-violating prompt is discovered after publication:

1. **Unpublish immediately.** Remove from public catalog.
2. **Log the incident.** Create an audit log entry with details.
3. **Review the pipeline.** If agent-generated, review the agent run and its inputs.
4. **Notify stakeholders.** Alert admins of the incident.
5. **Post-mortem.** Document what happened, why it was not caught in review, and what process changes are needed.

## Data Retention

- Audit logs are retained indefinitely.
- Rejected prompt content is retained for 90 days for review pattern analysis, then anonymized.
- User unlock history is retained for the lifetime of the user account.
- Ad event data is retained for 2 years for revenue reconciliation.
- IP hashes for rate limiting are retained for 24 hours.
