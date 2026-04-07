const POSTS = {
  "20260407-goals-own-reconciliation-projects-are-interventions": {
    file: "logbook/20260407-goals-own-reconciliation-projects-are-interventions.md",
    fallbackTitle:
      "The Data Model For Automatable Agents, Planning, And Work Execution",
  },
  "20260317-why-governance-should-be-built-in-from-day-1": {
    file: "logbook/20260317-why-governance-should-be-built-in-from-day-1.md",
    fallbackTitle: "Governance Must Be In The Model From Day 1",
  },
};

const postTitle = document.querySelector("#post-title");
const postMeta = document.querySelector("#post-meta");
const postDescription = document.querySelector("#post-description");
const postDivider = document.querySelector(".doc-divider");
const postContent = document.querySelector("#post-content");
const postError = document.querySelector("#post-error");
const postLinks = document.querySelectorAll("[data-post-link]");
const canonicalLink = document.querySelector('link[rel="canonical"]');

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isExternalHref(href) {
  return /^(https?:\/\/|mailto:)/i.test(href);
}

function isSafeLocalHref(href) {
  return /^(#|\.{0,2}\/|[a-z0-9][a-z0-9/_\-.]*(?:[?#].*)?)$/i.test(href);
}

function renderLink(label, href) {
  const safeHref = escapeHtml(href);
  const safeLabel = escapeHtml(label);

  if (isExternalHref(href)) {
    return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${safeLabel}</a>`;
  }

  if (isSafeLocalHref(href)) {
    return `<a href="${safeHref}">${safeLabel}</a>`;
  }

  return escapeHtml(`[${label}](${href})`);
}

function linkify(text) {
  return text.replace(
    /(https?:\/\/[^\s]+)/g,
    (url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`,
  );
}

function renderInline(text) {
  const markdownLinkPattern = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let html = "";
  let cursor = 0;
  let match;

  while ((match = markdownLinkPattern.exec(text)) !== null) {
    const [fullMatch, label, href] = match;
    const before = text.slice(cursor, match.index);
    html += linkify(escapeHtml(before));
    html += renderLink(label, href);
    cursor = match.index + fullMatch.length;
  }

  html += linkify(escapeHtml(text.slice(cursor)));
  return html;
}

function normalizeTitle(text) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function setMetaByName(name, content) {
  const node = document.querySelector(`meta[name="${name}"]`);
  if (node) {
    node.setAttribute("content", content);
  }
}

function setMetaByProperty(property, content) {
  const node = document.querySelector(`meta[property="${property}"]`);
  if (node) {
    node.setAttribute("content", content);
  }
}

function parseFrontMatter(raw) {
  if (!raw.startsWith("---\n")) {
    return { meta: {}, body: raw };
  }

  const endIndex = raw.indexOf("\n---", 4);
  if (endIndex === -1) {
    return { meta: {}, body: raw };
  }

  const block = raw.slice(4, endIndex).trim();
  const body = raw.slice(endIndex + 4).replace(/^\n+/, "");
  const meta = {};

  block.split("\n").forEach((line) => {
    const separator = line.indexOf(":");
    if (separator === -1) {
      return;
    }

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    if (key) {
      meta[key] = value;
    }
  });

  return { meta, body };
}

function renderMarkdown(markdown) {
  const lines = markdown.replaceAll("\r\n", "\n").split("\n");
  let html = "";
  let paragraph = [];
  let unorderedListItems = [];
  let orderedListItems = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) {
      return;
    }

    html += `<p>${renderInline(paragraph.join(" "))}</p>`;
    paragraph = [];
  };

  const flushUnorderedList = () => {
    if (unorderedListItems.length === 0) {
      return;
    }

    html += "<ul>";
    unorderedListItems.forEach((item) => {
      html += `<li>${renderInline(item)}</li>`;
    });
    html += "</ul>";
    unorderedListItems = [];
  };

  const flushOrderedList = () => {
    if (orderedListItems.length === 0) {
      return;
    }

    html += "<ol>";
    orderedListItems.forEach((item) => {
      html += `<li>${renderInline(item)}</li>`;
    });
    html += "</ol>";
    orderedListItems = [];
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushUnorderedList();
      flushOrderedList();
      return;
    }

    if (/^#{1,6}\s+/.test(trimmed)) {
      flushParagraph();
      flushUnorderedList();
      flushOrderedList();
      const level = trimmed.match(/^#+/)[0].length;
      const text = trimmed.replace(/^#{1,6}\s+/, "");
      html += `<h${level}>${renderInline(text)}</h${level}>`;
      return;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      flushParagraph();
      flushOrderedList();
      unorderedListItems.push(trimmed.replace(/^[-*]\s+/, ""));
      return;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph();
      flushUnorderedList();
      orderedListItems.push(trimmed.replace(/^\d+\.\s+/, ""));
      return;
    }

    paragraph.push(trimmed);
  });

  flushParagraph();
  flushUnorderedList();
  flushOrderedList();
  return html;
}

function markActivePost(postKey) {
  postLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.postLink === postKey);
  });
}

async function loadPost() {
  const params = new URLSearchParams(window.location.search);
  const requestedPost =
    params.get("post") ||
    "20260407-goals-own-reconciliation-projects-are-interventions";
  const postKey = POSTS[requestedPost]
    ? requestedPost
    : "20260407-goals-own-reconciliation-projects-are-interventions";
  const selected = POSTS[postKey];
  const postUrl = `https://tins8.at/logbook.html?post=${postKey}`;

  markActivePost(postKey);

  try {
    const response = await fetch(selected.file, { cache: "no-cache" });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${selected.file}: ${response.status}`);
    }

    const raw = await response.text();
    const { meta, body } = parseFrontMatter(raw);

    let cleanedBody = body.trim();
    const title = meta.title || selected.fallbackTitle;
    const leadingHeadingMatch = cleanedBody.match(/^#\s+(.+?)(?:\n+|$)/);

    if (
      leadingHeadingMatch &&
      normalizeTitle(leadingHeadingMatch[1]) === normalizeTitle(title)
    ) {
      cleanedBody = cleanedBody.slice(leadingHeadingMatch[0].length).trim();
    }

    postTitle.textContent = title;
    postMeta.textContent = [meta.date, meta.tags].filter(Boolean).join(" · ");
    postDescription.textContent = meta.description || "";
    postDescription.hidden = !meta.description;
    if (postDivider) {
      postDivider.hidden = false;
    }
    postContent.innerHTML = renderMarkdown(cleanedBody);

    const pageTitle = `${title} | The Logbook`;
    const pageDescription =
      meta.description || "The Logbook: a growing record of learnings and architectural formalization behind The Founders Control Plane.";

    document.title = pageTitle;
    setMetaByName("description", pageDescription);
    setMetaByName("twitter:title", pageTitle);
    setMetaByName("twitter:description", pageDescription);
    setMetaByProperty("og:title", pageTitle);
    setMetaByProperty("og:description", pageDescription);
    setMetaByProperty("og:url", postUrl);

    if (canonicalLink) {
      canonicalLink.setAttribute("href", postUrl);
    }

    postError.hidden = true;
  } catch (error) {
    console.error(error);
    postTitle.textContent = selected.fallbackTitle;
    postMeta.textContent = "The Logbook entry could not be loaded.";
    postDescription.hidden = true;
    if (postDivider) {
      postDivider.hidden = true;
    }
    postContent.innerHTML = "";
    postError.hidden = false;
  }
}

loadPost();
