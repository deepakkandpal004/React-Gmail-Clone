// AI helper — talks to any OpenAI-compatible chat API.
// Default: local Ollama (free, no key). Switch provider via .env:
//   VITE_AI_BASE_URL, VITE_AI_MODEL, VITE_AI_API_KEY
const BASE_URL = import.meta.env.VITE_AI_BASE_URL || "http://localhost:11434/v1";
const MODEL = import.meta.env.VITE_AI_MODEL || "llama3.2:3b";
const API_KEY = import.meta.env.VITE_AI_API_KEY || "ollama";

async function askAI(system, user) {
    const res = await fetch(`${BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: MODEL,
            temperature: 0.3,
            messages: [
                { role: "system", content: system },
                { role: "user", content: user },
            ],
        }),
    });
    if (!res.ok) throw new Error(`AI request failed (${res.status})`);
    const data = await res.json();
    return (data.choices?.[0]?.message?.content || "").trim();
}

export async function summarizeEmail(email) {
    return askAI(
        "You summarize emails. Reply with a plain 2-3 line summary only — no heading, no bullet points.",
        `Subject: ${email?.subject || ""}\n\n${email?.message || ""}`
    );
}

export async function suggestReplies(email) {
    const text = await askAI(
        "You suggest short email replies. Reply with exactly 3 replies, one per line. Each reply under 12 words. No numbering, no bullets, no quotes.",
        `Subject: ${email?.subject || ""}\n\n${email?.message || ""}`
    );
    return text
        .split("\n")
        .map((line) => line.replace(/^[\d.)\-*"\s]+/, "").trim())
        .filter(Boolean)
        .slice(0, 3);
}

export async function draftEmail(hint) {
    const text = await askAI(
        'You write emails. Reply with ONLY a JSON object: {"subject": "...", "message": "..."}. The message is a complete, polite email body for the given instruction.',
        hint
    );
    try {
        const clean = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);
        return {
            subject: parsed.subject || "",
            message: parsed.message || "",
        };
    } catch {
        return { subject: "", message: text };
    }
}
