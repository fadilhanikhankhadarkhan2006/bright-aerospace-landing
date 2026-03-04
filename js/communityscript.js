/* ══════════════════════════
   PAGE NAVIGATION
══════════════════════════ */
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  if (name === 'saved') renderSaved();
  window.scrollTo(0, 0);
}

/* ══════════════════════════
   localStorage helpers
══════════════════════════ */
function getSaved() {
  return JSON.parse(localStorage.getItem('savedPosts') || '[]');
}
function setSaved(arr) {
  localStorage.setItem('savedPosts', JSON.stringify(arr));
}

/* ── Update sidebar saved count ── */
function refreshSavedCount() {
  const saved   = getSaved();
  const countEl = document.getElementById('savedCount');
  const linkEl  = document.getElementById('viewSavedLink');
  if (saved.length === 0) {
    countEl.textContent = 'No posts saved';
    linkEl.style.display = 'none';
  } else {
    countEl.textContent = saved.length + ' post(s) saved';
    linkEl.style.display = 'inline-block';
  }
}

/* ── On page load: restore save button states ── */
window.addEventListener('DOMContentLoaded', () => {
  refreshSavedCount();
  const saved = getSaved();
  document.querySelectorAll('.post-card').forEach(card => {
    const id = card.dataset.postId;
    if (id && saved.find(p => p.id === id)) {
      const btn = card.querySelector('.save-btn');
      if (btn) {
        btn.classList.add('active');
        btn.querySelector('svg').setAttribute('fill', 'currentColor');
      }
    }
  });
});

/* ── Toggle Save ── */
function toggleSave(btn) {
  const card = btn.closest('.post-card');
  const id   = card.dataset.postId;
  const svg  = btn.querySelector('svg');
  let saved  = getSaved();

  if (btn.classList.contains('active')) {
    btn.classList.remove('active');
    svg.setAttribute('fill', 'none');
    setSaved(saved.filter(p => p.id !== id));
  } else {
    btn.classList.add('active');
    svg.setAttribute('fill', 'currentColor');
    if (!saved.find(p => p.id === id)) {
      const bodyP  = card.querySelector('.post-body p');
      const imgEls = card.querySelectorAll('img[src^="data:"]');
      const images = Array.from(imgEls).map(img => img.src);
      saved.push({
        id:     id,
        author: card.dataset.author || 'Unknown',
        role:   card.dataset.role   || '',
        text:   card.dataset.text   || (bodyP ? bodyP.textContent : ''),
        tags:   card.dataset.tags   || '',
        time:   card.dataset.time   || 'Recently',
        images: images
      });
      setSaved(saved);
    }
  }
  refreshSavedCount();
}

/* ── Like ── */
function toggleLike(btn) {
  btn.classList.toggle('active');
  const svg = btn.querySelector('svg');
  svg.setAttribute('fill', btn.classList.contains('active') ? 'currentColor' : 'none');
}

/* ── Expand post ── */
function expandPost(span, fullText) {
  span.closest('p').textContent = fullText;
}

/* ── Double-tap like ── */
function handleDoubleTap(imageContainer) {
  const card    = imageContainer.closest('.post-card');
  const likeBtn = card.querySelector('.like-btn');
  const heart   = document.createElement('div');
  heart.className = 'heart-pop';
  heart.innerHTML = '❤️';
  imageContainer.style.position = 'relative';
  imageContainer.appendChild(heart);
  setTimeout(() => heart.remove(), 800);
  if (!likeBtn.classList.contains('active')) toggleLike(likeBtn);
}

/* ── Comments ── */
let commentCounter = 0;

function submitComment(event, inputElement) {
  if (event.key !== 'Enter') return;
  const text = inputElement.value.trim();
  if (!text) return;
  const card = inputElement.closest('.post-card');
  addComment(card.querySelector('.comments-display'), 'You', text);
  inputElement.value = '';
}

function addComment(section, author, text, isReply) {
  const cid = 'c-' + (++commentCounter);
  section.style.display = 'flex';
  const thread = document.createElement('div');
  thread.className = 'comment-thread';
  thread.id = cid;
  thread.innerHTML = `
    <div class="single-comment"><strong>${author}:</strong> ${text}</div>
    <div class="comment-actions">
      <button class="comment-action-btn" onclick="toggleCommentLike(this)">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
        <span class="like-label">Like</span> <span class="like-count"></span>
      </button>
      ${!isReply ? `<button class="comment-action-btn" onclick="toggleReplyBox(this, '${cid}')">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
        Reply
      </button>` : ''}
    </div>
    ${!isReply ? `
    <div class="reply-box" id="rb-${cid}">
      <input type="text" placeholder="Write a reply..." onkeypress="submitReply(event, this, '${cid}')"/>
      <button class="reply-send-btn" onclick="submitReplyBtn(this, '${cid}')">↑</button>
    </div>
    <div class="replies-list" id="rl-${cid}"></div>` : ''}
  `;
  section.appendChild(thread);
}

function toggleCommentLike(btn) {
  btn.classList.toggle('liked');
  const countEl = btn.querySelector('.like-count');
  const labelEl = btn.querySelector('.like-label');
  let n = parseInt(countEl.textContent) || 0;
  if (btn.classList.contains('liked')) {
    n++; btn.querySelector('svg').setAttribute('fill', 'currentColor');
  } else {
    n = Math.max(0, n - 1); btn.querySelector('svg').setAttribute('fill', 'none');
  }
  countEl.textContent = n > 0 ? n : '';
  labelEl.textContent = btn.classList.contains('liked') ? 'Liked' : 'Like';
}

function toggleReplyBox(btn, cid) {
  const rb = document.getElementById('rb-' + cid);
  rb.classList.toggle('open');
  if (rb.classList.contains('open')) rb.querySelector('input').focus();
}

function submitReply(event, input, cid) {
  if (event.key !== 'Enter') return;
  postReply(input, cid);
}
function submitReplyBtn(btn, cid) {
  const input = document.getElementById('rb-' + cid).querySelector('input');
  postReply(input, cid);
}
function postReply(input, cid) {
  const text = input.value.trim();
  if (!text) return;
  const rl = document.getElementById('rl-' + cid);
  const replyThread = document.createElement('div');
  replyThread.className = 'comment-thread';
  replyThread.innerHTML = `
    <div class="single-comment" style="background:#eaf0ff;"><strong>You:</strong> ${text}</div>
    <div class="comment-actions">
      <button class="comment-action-btn" onclick="toggleCommentLike(this)">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
        <span class="like-label">Like</span> <span class="like-count"></span>
      </button>
    </div>`;
  rl.appendChild(replyThread);
  input.value = '';
  document.getElementById('rb-' + cid).classList.remove('open');
}

/* ── Modal + Image Upload ── */
let uploadedImages = [];

function openCreateModal() {
  uploadedImages = [];
  document.getElementById('imgPreviewGrid').innerHTML = '';
  document.getElementById('newPostText').value = '';
  document.getElementById('newPostTags').value = '';
  document.getElementById('postModal').style.display = 'flex';
}
function closeCreateModal() { document.getElementById('postModal').style.display = 'none'; }

function handleDragOver(e) {
  e.preventDefault();
  document.getElementById('uploadArea').classList.add('dragover');
}
function handleDragLeave(e) {
  document.getElementById('uploadArea').classList.remove('dragover');
}
function handleDrop(e) {
  e.preventDefault();
  document.getElementById('uploadArea').classList.remove('dragover');
  processFiles(e.dataTransfer.files);
}
function handleFileSelect(e) {
  processFiles(e.target.files);
  e.target.value = '';
}
function processFiles(files) {
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const idx = uploadedImages.length;
      uploadedImages.push(ev.target.result);
      const grid = document.getElementById('imgPreviewGrid');
      const item = document.createElement('div');
      item.className = 'img-preview-item';
      item.dataset.idx = idx;
      item.innerHTML = `<img src="${ev.target.result}" alt="preview"/>
        <button class="img-preview-remove" onclick="removePreview(this)">×</button>`;
      grid.appendChild(item);
    };
    reader.readAsDataURL(file);
  });
}
function removePreview(btn) {
  const item = btn.closest('.img-preview-item');
  const idx  = parseInt(item.dataset.idx);
  uploadedImages[idx] = null;
  item.remove();
}

/* ── Publish new post ── */
let postCounter = 100;
function publishPost() {
  const text      = document.getElementById('newPostText').value.trim();
  const tagsInput = document.getElementById('newPostTags').value.trim();
  if (!text) { alert('Please enter some text for your post.'); return; }

  const postId   = 'post-' + (++postCounter);
  const validImg = uploadedImages.filter(Boolean);

  let tagsHtml = '', tagsStr = '';
  if (tagsInput) {
    const arr = tagsInput.split(',').map(t => t.trim());
    tagsStr   = arr.map(t => t.startsWith('#') ? t : '#' + t).join(',');
    tagsHtml  = `<div class="post-tags">` + arr.map(t => `<span>${t.startsWith('#') ? t : '#'+t}</span>`).join('') + `</div>`;
  }

  const imgHtml = buildImgLayout(validImg, true);

  const postHtml = `
    <div class="post-card" data-post-id="${postId}"
      data-author="You" data-role="Community Member"
      data-text="${text.replace(/"/g,'&quot;')}"
      data-tags="${tagsStr}" data-time="Just now">
      <div class="post-header">
        <div class="post-avatar" style="background:#F5C800;">A</div>
        <div class="post-meta">
          <div class="post-name">You <span class="post-time">Just now</span></div>
          <div class="post-role">Community Member</div>
        </div>
      </div>
      <div class="post-body"><p>${text}</p>${tagsHtml}</div>
      ${imgHtml}
      <div class="post-footer">
        <div class="comment-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <input type="text" placeholder="Add a comment... (Press Enter)" onkeypress="submitComment(event, this)"/>
        </div>
        <div class="post-actions">
          <button class="action-btn like-btn" onclick="toggleLike(this)">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
          </button>
          <button class="action-btn">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
          <button class="action-btn save-btn" onclick="toggleSave(this)">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
        </div>
      </div>
      <div class="comments-display" style="display:none;"></div>
    </div>`;

  document.getElementById('feed').insertAdjacentHTML('afterbegin', postHtml);
  closeCreateModal();
}

/* ══════════════════════════
   SAVED POSTS PAGE
══════════════════════════ */
function unsavePost(id) {
  const communityCard = document.querySelector(`[data-post-id="${id}"]`);
  if (communityCard) {
    const btn = communityCard.querySelector('.save-btn');
    if (btn) {
      btn.classList.remove('active');
      btn.querySelector('svg').setAttribute('fill', 'none');
    }
  }
  setSaved(getSaved().filter(p => p.id !== id));
  refreshSavedCount();
  renderSaved();
}

function buildImgLayout(images, withDoubleTap) {
  if (!images || images.length === 0) return '';
  const tap = withDoubleTap ? 'ondblclick="handleDoubleTap(this)"' : '';
  const imgStyle = 'width:100%;height:100%;object-fit:contain;background:#f0f0f0;';
  const wrap = (inner, extra = '') =>
    `<div ${tap} style="position:relative;overflow:hidden;border-radius:0;${extra}">${inner}</div>`;
  const img = (src, style = '') =>
    `<img src="${src}" style="${imgStyle}${style}">`;

  const n = images.length;
  if (n === 1) return wrap(img(images[0], 'max-height:400px;width:100%;object-fit:contain;'), 'max-height:400px;');
  if (n === 2) return wrap(`<div style="display:grid;grid-template-columns:1fr 1fr;gap:3px;height:240px;">${images.map(src => `<div style="overflow:hidden;background:#f0f0f0;">${img(src)}</div>`).join('')}</div>`, 'height:240px;');
  if (n === 3) return wrap(`<div style="display:grid;grid-template-columns:2fr 1fr;gap:3px;height:260px;"><div style="overflow:hidden;background:#f0f0f0;">${img(images[0])}</div><div style="display:flex;flex-direction:column;gap:3px;"><div style="flex:1;overflow:hidden;background:#f0f0f0;">${img(images[1])}</div><div style="flex:1;overflow:hidden;background:#f0f0f0;">${img(images[2])}</div></div></div>`, 'height:260px;');
  if (n === 4) return wrap(`<div style="display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:3px;height:300px;">${images.slice(0, 4).map(src => `<div style="overflow:hidden;background:#f0f0f0;">${img(src)}</div>`).join('')}</div>`, 'height:300px;');

  const shown = images.slice(0, 5);
  const extra = n - 5;
  const lastImg = extra > 0
    ? `<div style="position:relative;overflow:hidden;background:#f0f0f0;">${img(shown[4])}<div style="position:absolute;inset:0;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px;font-family:'Koulen',sans-serif;">+${extra}</div></div>`
    : `<div style="overflow:hidden;background:#f0f0f0;">${img(shown[4])}</div>`;
  return wrap(
    `<div style="display:grid;grid-template-columns:1fr 1fr;gap:3px;height:160px;margin-bottom:3px;">${shown.slice(0, 2).map(src => `<div style="overflow:hidden;background:#f0f0f0;">${img(src)}</div>`).join('')}</div>
     <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:3px;height:130px;">${shown.slice(2, 4).map(src => `<div style="overflow:hidden;background:#f0f0f0;">${img(src)}</div>`).join('')}${lastImg}</div>`,
    'height:293px;'
  );
}

function renderSaved() {
  const feed  = document.getElementById('savedFeed');
  const saved = getSaved();

  if (saved.length === 0) {
    feed.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔖</div>
        <p>You haven't saved any posts yet.</p>
        <button class="go-community" onclick="showPage('community')">Go to Community</button>
      </div>`;
    return;
  }

  feed.innerHTML = saved.map(post => {
    const initial  = (post.author || 'U')[0].toUpperCase();
    const tagsHtml = post.tags ? post.tags.split(',').map(t => `<span>${t.trim()}</span>`).join('') : '';
    const imgHtml  = buildImgLayout(post.images || [], false);
    return `
      <div class="post-card">
        <div class="post-header">
          <div class="post-avatar" style="background:#F5C800;">${initial}</div>
          <div class="post-meta">
            <div class="post-name">${post.author} <span class="post-time">${post.time}</span></div>
            <div class="post-role">${post.role}</div>
          </div>
        </div>
        <div class="post-body">
          <p>${post.text}</p>
          ${tagsHtml ? `<div class="post-tags">${tagsHtml}</div>` : ''}
        </div>
        ${imgHtml}
        <div class="post-card-footer">
          <button class="unsave-btn" onclick="unsavePost('${post.id}')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            Remove
          </button>
        </div>
      </div>`;
  }).join('');
}
