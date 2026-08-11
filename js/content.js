/* Data-driven open-source contributions and skill badges. */

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function safeUrl(value, allowedProtocols = ['https:', 'http:']) {
  try {
    const url = new URL(value, document.baseURI);
    return allowedProtocols.includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

function renderContentError(container, message) {
  container.replaceChildren(createElement('p', 'content-error', message));
}

function contributionSummary(items) {
  const openCount = items.filter(item => item.status === 'open').length;
  const mergedCount = items.filter(item => item.status === 'merged').length;
  const parts = [`${items.length} ${items.length === 1 ? 'PR' : 'PRs'}`];
  if (mergedCount) parts.push(`${mergedCount} merged`);
  if (openCount) parts.push(`${openCount} open`);
  return parts.join(' · ');
}

function createContributionRow(item, repository) {
  const url = safeUrl(item.url);
  if (!url || !item.number || !item.title) return null;

  const row = createElement('a', 'contribution-row');
  row.href = url;
  row.target = '_blank';
  row.rel = 'noopener noreferrer';
  row.setAttribute('aria-label', `${repository} pull request ${item.number}: ${item.title}`);

  const main = createElement('div', 'contribution-row-main');
  main.append(
    createElement('div', 'contribution-row-meta', `Pull request #${item.number}`),
    createElement('h4', 'contribution-row-title', item.title)
  );

  const allowedStatuses = ['open', 'merged', 'closed', 'draft'];
  const status = allowedStatuses.includes(item.status) ? item.status : 'open';
  const badge = createElement('span', `highlight-status highlight-status--${status}`, status);
  badge.setAttribute('aria-label', `Pull request status: ${status}`);
  row.append(main, badge);
  return row;
}

function renderOpenSource(items) {
  const list = document.getElementById('openSourceList');
  const count = document.getElementById('openSourceCount');
  if (!list || !count) return;

  const projects = Array.isArray(items) ? items : [];
  const contributions = projects.flatMap(project => (
    Array.isArray(project.contributions) ? project.contributions : []
  ));
  count.textContent = contributionSummary(contributions);

  const fragment = document.createDocumentFragment();
  projects.forEach(project => {
    if (!project.project || !project.repository || !Array.isArray(project.contributions)) return;

    const rows = project.contributions
      .map(item => createContributionRow(item, project.repository))
      .filter(Boolean);
    if (!rows.length) return;

    const section = createElement('section', 'contribution-project');
    const header = createElement('div', 'contribution-project-header');
    const identity = createElement('div', 'contribution-project-identity');
    identity.append(
      createElement('h3', 'contribution-project-name', project.project),
      createElement('span', 'contribution-project-repo', project.repository)
    );
    header.append(
      identity,
      createElement('span', 'contribution-project-summary', contributionSummary(project.contributions))
    );

    const projectList = createElement('div', 'contribution-project-list');
    projectList.append(...rows);
    section.append(header, projectList);
    fragment.append(section);
  });

  if (!fragment.childNodes.length) {
    renderContentError(list, 'No open-source contributions added yet.');
    return;
  }
  list.replaceChildren(fragment);
}

function renderSkills(categories) {
  const list = document.getElementById('skillsList');
  if (!list) return;

  const fragment = document.createDocumentFragment();
  (Array.isArray(categories) ? categories : []).forEach(category => {
    if (!category.category || !Array.isArray(category.items)) return;

    const section = createElement('div', 'skills-category');
    const label = createElement('h3', 'skills-category-label', category.category);
    const cards = createElement('div', 'skill-cards');
    cards.setAttribute('role', 'list');

    category.items.forEach(item => {
      if (!item.name) return;
      const card = createElement('div', 'skill-card');
      card.setAttribute('role', 'listitem');
      card.title = item.title || item.name;

      const iconUrl = item.icon ? safeUrl(item.icon, ['https:', 'http:', 'file:']) : null;
      if (iconUrl) {
        const icon = createElement('img', 'skill-icon');
        icon.src = iconUrl;
        icon.alt = '';
        icon.loading = 'lazy';
        card.append(icon);
      } else {
        card.append(createElement('span', 'skill-icon-text', item.iconText || item.name.slice(0, 3)));
      }

      card.append(createElement('span', 'skill-name', item.name));
      cards.append(card);
    });

    section.append(label, cards);
    fragment.append(section);
  });

  if (!fragment.childNodes.length) {
    renderContentError(list, 'No skill badges added yet.');
    return;
  }
  list.replaceChildren(fragment);
}

document.addEventListener('DOMContentLoaded', () => {
  renderOpenSource(window.PORTFOLIO_OPEN_SOURCE);
  renderSkills(window.PORTFOLIO_SKILLS);
});
