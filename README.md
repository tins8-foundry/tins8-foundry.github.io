# tins8-foundry.github.io

Static GitHub Pages site with `uv` tooling.

## Quick start

```bash
uv sync --dev
uv run preview
```

Open <http://127.0.0.1:8000>.

## Formatting

```bash
uv run pre-commit install
uv run pre-commit run --all-files
```

## Legal PDFs

Put these files in `legal/`:

- `about-and-terms.pdf`
- `privacy-notice.pdf`
- `terms-and-conditions.pdf`
- `disclaimer.pdf`

## GitHub Pages

`Settings` -> `Pages` -> `Deploy from a branch` -> `main` + `/ (root)`.
