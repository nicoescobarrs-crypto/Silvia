/**
 * admin.js
 * Reads every document from the "responses" Firestore collection
 * and renders it as a table, newest submission first.
 * No authentication — anyone with the admin.html link can view it,
 * so keep that link private.
 */

function formatTimestamp(ts) {
  if (!ts) return '—';
  // Firestore Timestamp -> JS Date
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function renderRow(doc) {
  const data = doc.data();
  const tr = document.createElement('tr');

  const dateCell = document.createElement('td');
  dateCell.textContent = formatTimestamp(data.timestamp);

  const placeCell = document.createElement('td');
  placeCell.textContent = data.place || '—';

  const timeCell = document.createElement('td');
  timeCell.textContent = data.timeAnswer || '—';

  const deviceCell = document.createElement('td');
  const badge = document.createElement('span');
  badge.className = 'device-badge';
  badge.textContent = data.deviceType || 'Unknown';
  deviceCell.appendChild(badge);

  tr.append(dateCell, placeCell, timeCell, deviceCell);
  return tr;
}

async function loadResponses() {
  const tbody = document.getElementById('responses-body');
  const loadingState = document.getElementById('loading-state');
  const emptyState = document.getElementById('empty-state');

  tbody.innerHTML = '';
  emptyState.style.display = 'none';
  loadingState.style.display = 'block';
  loadingState.textContent = 'Loading responses…';

  try {
    const snapshot = await db
      .collection('responses')
      .orderBy('timestamp', 'desc')
      .get();

    loadingState.style.display = 'none';

    if (snapshot.empty) {
      emptyState.style.display = 'block';
      return;
    }

    snapshot.forEach((doc) => {
      tbody.appendChild(renderRow(doc));
    });
  } catch (err) {
    console.error('Error loading responses:', err);
    loadingState.textContent = 'Could not load responses — check your Firebase configuration and console for details.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadResponses();
  document.getElementById('refresh-btn').addEventListener('click', loadResponses);
});
