# LeadBot — AI Lead Generation Assistant

**Automated client qualification, real-time conversations, and lead capture — straight to Google Sheets.**

LeadBot is an AI-powered sales assistant that engages website visitors, qualifies their needs through natural dialogue, collects contact information with GDPR-style consent, and delivers structured leads to your team automatically.

![LeadBot Hero](/screenshots/hero.png)

---

## ✦ Features

- **Conversational AI** — Natural dialogue powered by GPT-4o Mini. Understands context, asks follow-up questions, and guides the conversation toward a qualified lead.
- **Smart Qualification** — Multi-stage pipeline: greeting → qualification → contact request → consent → lead saved. One question at a time, no spam.
- **Contact Collection** — Automatically parses Telegram handles and phone numbers from free-text responses.
- **Legal Consent** — Built-in 152-FZ (Russian GDPR) consent flow before any personal data is stored.
- **Google Sheets Integration** — Leads land in your spreadsheet instantly via webhook. Name, contact, request summary, full conversation log.
- **Premium UI** — Warm minimalist design. Quiet luxury aesthetic. Looks like a product, not a template.

---

## ⎯ Demo

> 🔗 **Live demo:** *coming soon*
>
> In the meantime — clone the repo, add your API keys, and run `npm run dev`.

---

## ⎯ Screenshots

### Chat Flow

![Chat conversation flow](/screenshots/chat-flow.png)

### Contact Collection

![Contact request stage](/screenshots/contact-request.png)

### Google Sheets Output

![Leads in Google Sheets](/screenshots/google-sheets.png)

---

## ⎯ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI | OpenAI GPT-4o Mini |
| Animations | Framer Motion |
| Icons | Lucide React |
| Lead Storage | Google Sheets (Apps Script webhook) |

---

## ⎯ How It Works

```
User opens chat → AI greets → asks qualifying questions
→ understands the task → requests contact (Telegram / phone)
→ asks for data processing consent → saves lead to Google Sheets
```

**Conversation stages:**

| Stage | What happens |
|-------|-------------|
| `greeting` | AI introduces itself, shows quick action buttons |
| `qualification` | 2–3 clarifying questions about the client's needs |
| `contact_request` | Asks for Telegram or phone number |
| `consent_request` | 152-FZ consent with accept/decline buttons |
| `completed` | Lead saved, thank you message |

**Lead payload sent to Google Sheets:**

```json
{
  "name": "Алексей",
  "contact": "@alexey_dev",
  "contactType": "telegram",
  "request": "Need a chatbot for an online store",
  "summary": "Client needs a chatbot for product consultation and order collection",
  "consentGiven": true,
  "source": "website-chat",
  "rawConversation": "[full dialogue]"
}
```

---

## ⎯ Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API key
- Google Apps Script webhook URL ([setup guide](https://developers.google.com/apps-script/guides/web))

### Installation

```bash
git clone https://github.com/your-username/leadbot.git
cd leadbot
npm install
```

### Environment

Create `.env.local` in the project root:

```env
OPENAI_API_KEY=sk-your-key-here
GOOGLE_SCRIPT_WEBHOOK_URL=https://script.google.com/macros/s/your-script-id/exec
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Click the chat icon in the bottom-right corner.

---

## ⎯ Project Structure

```
app/
  page.tsx                    Landing page
  layout.tsx                  Root layout
  api/chat/route.ts           AI chat endpoint
  api/lead/route.ts           Manual lead submission

components/
  chat/
    chat-widget.tsx           Floating chat button
    chat-window.tsx           Main chat container + logic
    message-bubble.tsx        Message component
    chat-input.tsx            Input with auto-resize
    quick-actions.tsx         Quick action buttons
    consent-actions.tsx       Consent UI (152-FZ)
    typing-indicator.tsx      Typing animation
  landing/
    hero.tsx                  Hero section
    features.tsx              Features grid
    how-it-works.tsx          Process steps
    cta.tsx                   Call to action
    footer.tsx                Footer

lib/
  types.ts                    TypeScript interfaces
  openai.ts                   OpenAI client
  prompts.ts                  System prompts per stage
  contact-parser.ts           Telegram/phone parser
  lead-summary.ts             Summary generator
  google-sheets.ts            Webhook integration
```

---

## ⎯ Use Cases

- **Digital agencies** — Qualify inbound leads and route them to the right team member.
- **SaaS companies** — Capture trial requests and product inquiries 24/7.
- **Freelancers** — Automate initial client conversations while you focus on delivery.
- **Service businesses** — Replace contact forms with intelligent conversations that convert better.

---

## ⎯ Why It Matters

Contact forms convert at 2–3%. Chat converts at 10–15%.

LeadBot combines the conversion power of live chat with the scalability of AI. Every conversation is qualified, every lead is structured, and your team only talks to people who are ready to buy.

No missed leads. No manual data entry. No after-hours gaps.

---

**Built with** Next.js, TypeScript, OpenAI, and Google Sheets.

**License:** MIT
