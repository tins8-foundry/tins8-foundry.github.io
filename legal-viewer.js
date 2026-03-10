const DOCS = {
  "about-and-terms": {
    file: "legal/about-and-terms.md",
    fallbackTitle: "About & Terms",
  },
  "privacy-notice": {
    file: "legal/privacy-notice.md",
    fallbackTitle: "Privacy Notice",
  },
  "terms-and-conditions": {
    file: "legal/terms-and-conditions.md",
    fallbackTitle: "Terms & Conditions",
  },
  disclaimer: {
    file: "legal/disclaimer.md",
    fallbackTitle: "Disclaimer",
  },
};

const docTitle = document.querySelector("#doc-title");
const docMeta = document.querySelector("#doc-meta");
const docContent = document.querySelector("#doc-content");
const docError = document.querySelector("#doc-error");
const docLinks = document.querySelectorAll("[data-doc-link]");
const canonicalLink = document.querySelector('link[rel="canonical"]');

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
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

    const safeHref = escapeHtml(href);
    const safeLabel = escapeHtml(label);

    if (/^(https?:\/\/|mailto:)/i.test(href)) {
      html += `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${safeLabel}</a>`;
    } else {
      html += escapeHtml(fullMatch);
    }

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
  let listItems = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) {
      return;
    }
    html += `<p>${renderInline(paragraph.join(" "))}</p>`;
    paragraph = [];
  };

  const flushList = () => {
    if (listItems.length === 0) {
      return;
    }
    html += "<ul>";
    listItems.forEach((item) => {
      html += `<li>${renderInline(item)}</li>`;
    });
    html += "</ul>";
    listItems = [];
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      return;
    }

    if (/^#{1,6}\s+/.test(trimmed)) {
      flushParagraph();
      flushList();
      const level = trimmed.match(/^#+/)[0].length;
      const text = trimmed.replace(/^#{1,6}\s+/, "");
      html += `<h${level}>${renderInline(text)}</h${level}>`;
      return;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      flushParagraph();
      listItems.push(trimmed.replace(/^[-*]\s+/, ""));
      return;
    }

    if (
      /^Section\s*\d+\s*-\s*/i.test(trimmed) ||
      /^Section\d+\s*-\s*/i.test(trimmed)
    ) {
      flushParagraph();
      flushList();
      html += `<h2>${renderInline(trimmed)}</h2>`;
      return;
    }

    paragraph.push(trimmed);
  });

  flushParagraph();
  flushList();
  return html;
}

function markActiveDoc(docKey) {
  docLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.docLink === docKey);
  });
}

async function loadDocument() {
  const params = new URLSearchParams(window.location.search);
  const requestedDoc = params.get("doc") || "about-and-terms";
  const docKey = DOCS[requestedDoc] ? requestedDoc : "about-and-terms";
  const selected = DOCS[docKey];
  const docUrl = `https://tins8.at/legal-viewer.html?doc=${docKey}`;

  markActiveDoc(docKey);

  try {
    const response = await fetch(selected.file, { cache: "no-cache" });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${selected.file}: ${response.status}`);
    }

    const raw = await response.text();
    const { meta, body } = parseFrontMatter(raw);

    let cleanedBody = body.trim();
    const bodyLines = cleanedBody.split("\n");
    const title = meta.title || selected.fallbackTitle;

    if (
      bodyLines.length > 0 &&
      normalizeTitle(bodyLines[0]) === normalizeTitle(title)
    ) {
      bodyLines.shift();
    }

    if (
      bodyLines.length > 0 &&
      /^v?\d+\.\d+\s*\d{4}$/i.test(bodyLines[0].trim())
    ) {
      bodyLines.shift();
    }

    cleanedBody = bodyLines.join("\n").trim();

    docTitle.textContent = title;
    docMeta.textContent = `Version ${meta.version || "1.0"} · ${
      meta.year || "2026"
    }`;
    docContent.innerHTML = renderMarkdown(cleanedBody);
    document.title = `${title} | tins8 GmbH`;
    setMetaByName(
      "description",
      `${title} legal document of tins8 GmbH, version ${
        meta.version || "0.1"
      } (${meta.year || "2026"}).`,
    );
    setMetaByName("twitter:title", `${title} | tins8 GmbH`);
    setMetaByName(
      "twitter:description",
      `${title} legal document of tins8 GmbH.`,
    );
    setMetaByProperty("og:title", `${title} | tins8 GmbH`);
    setMetaByProperty(
      "og:description",
      `${title} legal document of tins8 GmbH.`,
    );
    setMetaByProperty("og:url", docUrl);
    if (canonicalLink) {
      canonicalLink.setAttribute("href", docUrl);
    }
    docError.hidden = true;
  } catch (error) {
    console.error(error);
    docTitle.textContent = selected.fallbackTitle;
    docMeta.textContent = "Version 0.1 · 2026";
    docContent.innerHTML = "";
    docError.hidden = false;
  }
}

loadDocument();
