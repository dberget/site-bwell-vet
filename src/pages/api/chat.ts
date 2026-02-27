export const prerender = false;

import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { getFile, putFile, branchExists, getBranchSha, createBranch, isClientRepo } from '../../lib/github';
import { checkAuth } from '../../lib/auth';

const SYSTEM_PROMPT = `You are a friendly website editor for a local business. The business owner chats with you to update their website.

You have access to tools to edit the page. When the owner asks for changes:
- Use replace_text for any text content changes (phone, hours, names, descriptions)
- Use update_css_var for color or style changes
- Use insert_html to add new sections or items
- Use replace_block to rework a section of HTML
- Use full_rewrite ONLY for major structural changes that can't be done surgically

Rules:
- Always use tools to make changes — never return code blocks
- You can call multiple tools in one response for multiple changes
- Be friendly and confirm what you changed in plain language
- If the owner asks about something on a different page, tell them to switch pages
- If you can't find the right text to replace, describe what you're looking for and ask them to help identify it

After making changes, summarize what you did in 1-2 sentences.`;

const TOOLS: Anthropic.Messages.Tool[] = [
  {
    name: 'replace_text',
    description: 'Replace an exact string of text in the page. The find string must exist exactly in the file.',
    input_schema: {
      type: 'object' as const,
      properties: {
        find: { type: 'string', description: 'Exact text to find (must exist verbatim in the file)' },
        replace: { type: 'string', description: 'Text to replace it with' },
      },
      required: ['find', 'replace'],
    },
  },
  {
    name: 'replace_block',
    description: 'Replace all content between two unique markers in the file. The markers themselves are preserved.',
    input_schema: {
      type: 'object' as const,
      properties: {
        start_marker: { type: 'string', description: 'Unique string marking the start boundary (kept, not replaced)' },
        end_marker: { type: 'string', description: 'Unique string marking the end boundary (kept, not replaced)' },
        new_content: { type: 'string', description: 'New content to place between the markers' },
      },
      required: ['start_marker', 'end_marker', 'new_content'],
    },
  },
  {
    name: 'update_css_var',
    description: 'Update the value of a CSS custom property (variable). Use for color changes, font changes, etc.',
    input_schema: {
      type: 'object' as const,
      properties: {
        name: { type: 'string', description: 'CSS variable name including -- prefix, e.g. --accent-color' },
        value: { type: 'string', description: 'New value, e.g. #c2590a or 1.5rem' },
      },
      required: ['name', 'value'],
    },
  },
  {
    name: 'insert_html',
    description: 'Insert new HTML immediately after a specific marker string.',
    input_schema: {
      type: 'object' as const,
      properties: {
        after_marker: { type: 'string', description: 'Unique string after which to insert the new HTML' },
        html: { type: 'string', description: 'HTML to insert' },
      },
      required: ['after_marker', 'html'],
    },
  },
  {
    name: 'full_rewrite',
    description: 'Completely rewrite the page. Use ONLY when targeted edits cannot achieve the goal — e.g. major layout changes, full redesigns.',
    input_schema: {
      type: 'object' as const,
      properties: {
        content: { type: 'string', description: 'Complete new file content' },
      },
      required: ['content'],
    },
  },
];

function applyTool(content: string, name: string, input: Record<string, string>): string {
  switch (name) {
    case 'replace_text': {
      if (!content.includes(input.find)) throw new Error(`Text not found: "${input.find.slice(0, 50)}"`);
      return content.split(input.find).join(input.replace);
    }
    case 'replace_block': {
      const si = content.indexOf(input.start_marker);
      if (si === -1) throw new Error(`Start marker not found`);
      const ei = content.indexOf(input.end_marker, si + input.start_marker.length);
      if (ei === -1) throw new Error(`End marker not found after start marker`);
      return content.slice(0, si + input.start_marker.length) + '\n' + input.new_content + '\n' + content.slice(ei);
    }
    case 'update_css_var': {
      const escaped = input.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return content.replace(new RegExp(`(${escaped}\\s*:\\s*)([^;]+)(;)`), `$1${input.value}$3`);
    }
    case 'insert_html': {
      const idx = content.indexOf(input.after_marker);
      if (idx === -1) throw new Error(`Marker not found: "${input.after_marker.slice(0, 50)}"`);
      const at = idx + input.after_marker.length;
      return content.slice(0, at) + '\n' + input.html + content.slice(at);
    }
    case 'full_rewrite': {
      return input.content;
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export const POST: APIRoute = async ({ request, cookies }) => {
  // Auth check
  const ghToken = import.meta.env.GITHUB_TOKEN;
  const auth = await checkAuth(
    cookies.get('se_auth')?.value,
    import.meta.env.ADMIN_SECRET || 'siteengine2026',
    ghToken || ''
  );
  if (!auth.authenticated) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  if (!ghToken) {
    return new Response(JSON.stringify({ error: 'GitHub token not configured' }), { status: 500 });
  }

  try {
    const { messages, siteSlug, pageName = 'index', branch: requestBranch } = await request.json();

    if (!siteSlug) {
      return new Response(JSON.stringify({ error: 'No site selected' }), { status: 400 });
    }

    // Determine branch: use provided, or auto-create preview branch
    const previewBranch = `preview-${siteSlug}`;
    const branch = requestBranch || previewBranch;

    if (!await branchExists(branch, ghToken)) {
      const masterSha = await getBranchSha('master', ghToken);
      await createBranch(branch, masterSha, ghToken);
    }

    // Read current page file from GitHub (from preview branch)
    // Client repos have pages at src/pages/*.astro, main repo at src/pages/{slug}/*.astro
    const pagePath = isClientRepo()
      ? `src/pages/${pageName}.astro`
      : `src/pages/${siteSlug}/${pageName}.astro`;
    let file;
    try {
      file = await getFile(pagePath, ghToken, branch);
    } catch {
      return new Response(JSON.stringify({ error: `Page not found: ${pageName}` }), { status: 404 });
    }

    const systemMessage = `${SYSTEM_PROMPT}\n\nYou are editing the "${pageName}" page for "${siteSlug}". Here is the current file:\n\n\`\`\`astro\n${file.content}\n\`\`\``;

    const anthropic = new Anthropic({ apiKey: import.meta.env.ANTHROPIC_API_KEY });

    // Strip tool calls from history — replace with brief summaries
    // Support multimodal messages: content can be string or array of content blocks
    const cleanedMessages = messages.map((m: { role: string; content: string | Array<{ type: string; text?: string; source?: { type: string; media_type: string; data: string } }> }) => {
      if (m.role === 'assistant') {
        const text = typeof m.content === 'string' ? m.content : m.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n');
        return {
          role: 'assistant' as const,
          content: text.replace(/```astro-page[\s\S]*?```/g, '[site updated]').trim(),
        };
      }
      // User messages: pass through as-is (may contain image blocks)
      return { role: 'user' as const, content: m.content };
    });

    // === CALL 1: Non-streaming with tools to get edits ===
    const call1Response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      system: [{ type: 'text', text: systemMessage, cache_control: { type: 'ephemeral' } }],
      messages: cleanedMessages,
      tools: TOOLS,
      tool_choice: { type: 'auto' },
    });

    // Extract tool uses and text from response
    const toolUses = call1Response.content.filter(
      (block): block is Anthropic.Messages.ToolUseBlock => block.type === 'tool_use'
    );
    const textBlocks = call1Response.content.filter(
      (block): block is Anthropic.Messages.TextBlock => block.type === 'text'
    );
    const call1Text = textBlocks.map((b) => b.text).join('\n');

    // Apply all tool calls to file content in sequence
    let updatedContent = file.content;
    const toolResults: Anthropic.Messages.ToolResultBlockParam[] = [];
    let applyError: string | null = null;

    for (const tool of toolUses) {
      try {
        updatedContent = applyTool(updatedContent, tool.name, tool.input as Record<string, string>);
        toolResults.push({ type: 'tool_result', tool_use_id: tool.id, content: 'Applied successfully.' });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        applyError = msg;
        toolResults.push({ type: 'tool_result', tool_use_id: tool.id, content: `Error: ${msg}`, is_error: true });
      }
    }

    // If tools were used and no errors, commit to GitHub (preview branch)
    let previewed = false;
    let commitSha: string | null = null;
    if (toolUses.length > 0 && !applyError) {
      const result = await putFile(
        pagePath,
        updatedContent,
        `Update ${siteSlug}/${pageName} page via admin panel`,
        file.sha,
        ghToken,
        branch
      );
      previewed = true;
      commitSha = result.commitSha;
    }

    // === CALL 2: Streaming the conversational reply ===
    // Build messages for call 2: prior history + assistant turn (text only) + tool results
    const call2Messages: Anthropic.Messages.MessageParam[] = [
      ...cleanedMessages,
      // Assistant turn from call 1 — text only (strip tool_use blocks)
      {
        role: 'assistant' as const,
        content: call1Text || 'I made the requested changes.',
      },
    ];

    // If there were tool uses, add a user turn with tool results so Claude knows what happened
    if (toolResults.length > 0) {
      const editSummary = toolUses.map((t) => t.name.replace(/_/g, ' ')).join(', ');
      call2Messages.push({
        role: 'user' as const,
        content: `[Tools applied: ${editSummary}. ${previewed ? 'Changes saved to preview.' : applyError ? `Error: ${applyError}` : 'No changes saved.'}] Now give a brief, friendly summary of what was changed.`,
      });
    }

    const body = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const send = (data: object) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        try {
          const stream = anthropic.messages.stream({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
            messages: call2Messages,
          });

          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              send({ text: event.delta.text });
            }
          }

          send({ done: true, dataUpdated: toolUses.length > 0, deployed: false, previewed, branch, commitSha });
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);

          let userMsg = msg;
          if (msg.includes('529') || msg.toLowerCase().includes('overloaded')) {
            userMsg = "Our AI provider is temporarily unavailable due to high demand. Please try again in a minute or two.";
          } else if (msg.includes('401') || msg.toLowerCase().includes('authentication')) {
            userMsg = "There's an issue with our AI service configuration. Please contact support.";
          } else if (msg.includes('429') || msg.toLowerCase().includes('rate')) {
            userMsg = "Too many requests — please wait a moment and try again.";
          }

          send({ error: userMsg });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Chat API error:', msg);
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
