// Browser History Manager — doubly linked list implementation
class HistoryNode {
  constructor(url) {
    this.url = url;
    this.visitedAt = new Date();
    this.prev = null;
    this.next = null;
  }
}
class BrowserHistory {
  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null;
    this.size = 0;
  }
  visit(url) {
    const node = new HistoryNode(url);
    if (!this.current) {
      this.head = this.tail = this.current = node;
    } else {
      // A new visit discards the forward history, just like a browser.
      let forward = this.current.next;
      while (forward) {
        const next = forward.next;
        forward.prev = forward.next = null;
        this.size--;
        forward = next;
      }
      this.current.next = null;
      // After forward entries are removed, current is the list's tail.
      this.tail = this.current;
      node.prev = this.current;
      this.current.next = node;
      this.current = node;
      this.tail = node;
    }
    this.size++;
    return node;
  }
  back() {
    if (this.current && this.current.prev) this.current = this.current.prev;
    return this.current;
  }
  forward() {
    if (this.current && this.current.next) this.current = this.current.next;
    return this.current;
  }
  remove(node) {
    if (!node) return;
    const wasCurrent = node === this.current;
    if (node.prev) node.prev.next = node.next;
    else this.head = node.next;
    if (node.next) node.next.prev = node.prev;
    else this.tail = node.prev;
    if (wasCurrent) this.current = node.prev || node.next || null;
    node.prev = node.next = null;
    this.size--;
  }
  clear() {
    let node = this.head;
    while (node) {
      const next = node.next;
      node.prev = node.next = null;
      node = next;
    }
    this.head = this.tail = this.current = null;
    this.size = 0;
  }
  entries() {
    const result = [];
    let node = this.head;
    while (node) {
      result.push(node);
      node = node.next;
    }
    return result;
  }
}
const history = new BrowserHistory();
const form = document.querySelector('#visit-form');
const input = document.querySelector('#url-input');
const backBtn = document.querySelector('#back-btn');
const forwardBtn = document.querySelector('#forward-btn');
const clearBtn = document.querySelector('#clear-btn');
const currentTitle = document.querySelector('#current-title');
const currentUrl = document.querySelector('#current-url');
const pageStatus = document.querySelector('#page-status');
const historyList = document.querySelector('#history-list');
const count = document.querySelector('#count');

function normalizeUrl(raw) {
  let value = raw.trim();
  if (!value) return null;
  if (!/^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(value)) value = 'https://' + value;
  try {
    const parsed = new URL(value);
    if (!['http:', 'https:'].includes(parsed.protocol)) return null;
    return parsed.href;
  } catch { return null; }
}
function pageName(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
}
function formatTime(date) {
  return date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}
function render() {
  const current = history.current;
  currentTitle.textContent = current ? pageName(current.url) : 'New tab';
  currentUrl.textContent = current ? current.url : 'Enter a URL above to get started.';
  pageStatus.textContent = current ? 'Page selected' : 'Ready';
  backBtn.disabled = !current || !current.prev;
  forwardBtn.disabled = !current || !current.next;
  const entries = history.entries();
  count.textContent = entries.length + (entries.length === 1 ? ' page' : ' pages');
  if (!entries.length) {
    historyList.innerHTML = '<div class="empty-state"><div>⌁</div><h3>Your history is empty</h3><p>Visit a page to see it appear here.</p></div>';
    return;
  }
  historyList.innerHTML = '';
  entries.slice().reverse().forEach(node => {
    const row = document.createElement('div');
    row.className = 'history-item' + (node === current ? ' active' : '');
    const info = document.createElement('div'); info.className = 'page-info';
    const favicon = document.createElement('div'); favicon.className = 'favicon'; favicon.textContent = '↗';
    const text = document.createElement('div'); text.style.minWidth = '0';
    const name = document.createElement('div'); name.className = 'page-name'; name.textContent = pageName(node.url);
    if (node === current) { const tag = document.createElement('span'); tag.className = 'active-tag'; tag.textContent = 'CURRENT'; name.append(tag); }
    const address = document.createElement('div'); address.className = 'page-address'; address.textContent = node.url;
    text.append(name, address); info.append(favicon, text);
    const time = document.createElement('div'); time.className = 'visited-time'; time.textContent = formatTime(node.visitedAt);
    const actions = document.createElement('div'); actions.className = 'item-actions';
    const open = document.createElement('button'); open.className = 'small-btn'; open.type = 'button'; open.title = 'Select this page'; open.setAttribute('aria-label','Select '+node.url); open.textContent = '↗';
    open.addEventListener('click', () => { history.current = node; render(); });
    const remove = document.createElement('button'); remove.className = 'small-btn'; remove.type = 'button'; remove.title = 'Delete from history'; remove.setAttribute('aria-label','Delete '+node.url); remove.textContent = '×';
    remove.addEventListener('click', () => { history.remove(node); render(); });
    actions.append(open, remove); row.append(info, time, actions); historyList.append(row);
  });
}
form.addEventListener('submit', event => {
  event.preventDefault();
  const url = normalizeUrl(input.value);
  if (!url) { input.setCustomValidity('Enter a valid website URL, such as example.com'); input.reportValidity(); return; }
  input.setCustomValidity('');
  history.visit(url);
  input.value = '';
  render();
});
input.addEventListener('input', () => input.setCustomValidity(''));
backBtn.addEventListener('click', () => { history.back(); render(); });
forwardBtn.addEventListener('click', () => { history.forward(); render(); });
clearBtn.addEventListener('click', () => {
  if (history.size && confirm('Clear all browsing history?')) { history.clear(); render(); }
});
render();