(() => {
  "use strict";

  const REVISION_PROMPT = `Below is the full transcript of my English conversation lesson.

---

### [Important Instructions (Strictly Follow)]

- Only revise **my statements** (the lines labeled "Me")
- **Do NOT revise, evaluate, or summarize the Tutor's statements at all**
- **When my response is to the Tutor's question,** clearly state **the Tutor's question** for each question
- **Do NOT split my response into pieces — treat it as one whole block**
- Summarizing, shortening, or selectively omitting information is prohibited
- Remove obviously unnecessary hesitations and false starts (e.g., Yeah, I think…, So…, But…, etc.)
- **Reorganize while preserving the meaning, in the way a native speaker would naturally say it**
- Correct to grammatically accurate, **natural English that native speakers actually use in conversation**
- Do NOT add, supplement, or embellish content on your own
- Do NOT use ellipsis (…) to skip over content

---

### [Purpose]

- Only regarding my statements
- **Limited to improving grammar, naturalness, and native-likeness**
- Make them into expressions that can be **used as-is in real English conversation**
- Not "English that gets the point across" but "English that a native speaker would find completely natural"

---

### [Output Format (Strictly Follow)]

**Always output in the following format, numbering each entry sequentially (1, 2, 3…):**

When my statement is a response to the Tutor's question:

**[n]**
- Question:

    (The actual question the Tutor asked)

- My original version:

    (My response, including fillers and false starts, **presented as one whole block**)

- Revised version:

    (The above revised into English that a native speaker would find natural)

- Changes & Why:
    - List only the important corrections in bullet points
    - Briefly explain why each correction sounds more natural

When my statement is not a response but a question or remark to the Tutor:

**[n]**
- My original version:

    (My statement, including fillers and false starts, **presented as one whole block**)

- Revised version:

    (The above revised into English that a native speaker would find natural)

- Changes & Why:
    - List only the important corrections in bullet points
    - Briefly explain why each correction sounds more natural

---

### [Scope]

- From the **very beginning to the very end** of the transcript
- **All of my statements**, including responses to questions and questions I asked the Tutor`;


  // --- Button injection ---

  function injectButton() {
    if (document.querySelector(".cambly-copier-btn")) return;

    const btn = document.createElement("button");
    btn.className = "cambly-copier-btn";
    btn.textContent = "Copy Transcript";
    btn.addEventListener("click", handleClick);
    document.body.appendChild(btn);
  }

  // --- Toast ---

  function showToast(message, isError = false) {
    document.querySelector(".cambly-copier-toast")?.remove();
    const toast = document.createElement("div");
    toast.className = "cambly-copier-toast" + (isError ? " cambly-copier-toast--error" : "");
    toast.textContent = message;
    document.body.appendChild(toast);
    toast.addEventListener("animationend", () => toast.remove());
  }

  // --- Transcript extraction ---

  // Extract the user ID portion from a camblyavatars URL, e.g. "66ef923a8e7de19db73e765c"
  function extractAvatarId(src) {
    const m = src.match(/\/([a-f0-9]{20,})s\d+/i);
    return m ? m[1] : null;
  }

  // Find the logged-in student's avatar ID from the page nav/header.
  // Transcript message avatars sit inside a row that also contains a div[role="button"].
  // The nav/profile avatar does not — so we skip any that do.
  function findStudentAvatarId() {
    for (const img of document.querySelectorAll('img[src*="camblyavatars"]')) {
      const row = img.parentElement?.parentElement;
      if (row && row.querySelector('div[role="button"]')) continue; // transcript avatar
      const id = extractAvatarId(img.getAttribute("src") || "");
      if (id) return id;
    }
    return null;
  }

  function extractTranscript() {
    // Query all avatar images directly — no container detection needed.
    // Structure: row > avatarWrapper > img[alt*="avatar"]
    //            row > messageWrapper > div[role="button"] > p
    const avatarImgs = document.querySelectorAll('img[alt*="avatar"]');
    if (avatarImgs.length === 0) return null;

    const studentId = findStudentAvatarId();

    const lines = [];
    for (const avatar of avatarImgs) {
      const row = avatar.parentElement?.parentElement;
      const btn = row?.querySelector('div[role="button"]');
      if (!btn) continue;

      const text = btn.textContent.trim();
      if (!text) continue;

      const avatarId = extractAvatarId(avatar.getAttribute("src") || "");
      const isStudent = studentId ? avatarId === studentId : !/tutor/i.test(avatar.getAttribute("alt") || "");
      lines.push(`${isStudent ? "Me" : "Tutor"}: ${text}`);
    }

    return lines.length > 0 ? lines.join("\n") : null;
  }

  // --- Click handler with retry ---

  async function handleClick(e) {
    const btn = e.currentTarget;
    btn.textContent = "Extracting...";
    btn.disabled = true;

    let transcript = extractTranscript();
    if (!transcript) {
      await new Promise((r) => setTimeout(r, 1500));
      transcript = extractTranscript();
    }

    if (!transcript) {
      showToast("Transcript not found on this page", true);
    } else {
      try {
        await navigator.clipboard.writeText(REVISION_PROMPT + "\n\n---\n\n" + transcript);
        showToast("Copied!");
      } catch {
        showToast("Failed to copy to clipboard", true);
      }
    }

    btn.textContent = "Copy Transcript";
    btn.disabled = false;
  }

  // --- Init ---

  injectButton();
  new MutationObserver(() => {
    if (!document.querySelector(".cambly-copier-btn")) injectButton();
  }).observe(document.body, { childList: true, subtree: true });
})();
