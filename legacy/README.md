# samoilov2004.github.io

Personal portfolio hosted on GitHub Pages.

## Updating content without editing HTML

- Open-source pull requests live in `data/open-source.js`.
- Skill badges live in `data/skills.js`.

Add, remove, or reorder data objects and the page will update automatically.
Keep the commas between objects and use quotes around text.

Open-source pull requests are grouped by project:

```js
{
  project: "Project name",
  repository: "owner/repository",
  contributions: [
    {
      number: 123,
      title: "Short pull request title",
      status: "open",
      url: "https://github.com/owner/repository/pull/123"
    }
  ]
}
```

Supported statuses are `open`, `merged`, `closed`, and `draft`.

A skill badge has this shape inside a category's `items` list:

```js
{ name: "Tool name", icon: "assets/badges/tool.svg" }
```

Use `iconText` instead of `icon` when there is no image available. The data
files work both on GitHub Pages and when `index.html` is opened directly.
