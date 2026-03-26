# SendGrid: OTP email not arriving

SendGrid returns **202 Accepted** when the API accepts the message. That does **not** guarantee delivery to the inbox.

## 1. Verify the sender matches exactly

`MAIL_FROM_ADDRESS` in `.env` must be **identical** to the email you verified under:

**Settings → Sender Authentication → Single Sender Verification**

(e.g. if you verified `dangolre@warhawks.ulm.edu`, `MAIL_FROM_ADDRESS` must be that exact address.)

## 2. Check SendGrid Activity

**Email API → Activity** (or **Stats → Activity Feed**)

- **Delivered** → check **Spam/Junk** and **Quarantine** at ULM (Microsoft 365 often holds external mail).
- **Dropped / Bounced / Blocked** → read the reason; fix SPF/DKIM or sender reputation.

## 3. University email (warhawks.ulm.edu)

ULM may **silently quarantine** mail where:

- The **From** domain is `@warhawks.ulm.edu` but the message is sent **via SendGrid’s infrastructure** (SPF/DKIM alignment differs from a normal ULM server).

**Fixes that work in production:**

- Use **Domain Authentication** in SendGrid for a domain **you control** (e.g. `axiomgrader.com`) and send from `noreply@thatdomain.com`, **or**
- Ask IT to allowlist SendGrid’s sending IPs / your verified domain.

## 4. Backend logs

After recent changes, successful API calls log **X-Message-Id**. Search that ID in SendGrid Activity to see the full delivery path.

## 5. Local development

Set `MAIL_PROVIDER=console` in `.env` to print OTP codes in the **uvicorn terminal** (no email).

## 6. API key security

If an API key was ever committed or shared, **rotate it** in SendGrid (API Keys → delete old, create new) and update `.env`.
