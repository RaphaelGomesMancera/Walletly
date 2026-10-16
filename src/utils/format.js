const pad = (n) => String(n).padStart(2, '0');

export function formatCurrency(value) {
  const v = Number(value) || 0;
  const [int, dec] = v.toFixed(2).split('.');
  return `R$ ${int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${dec}`;
}

// "12,50" ou "12.50" -> 12.5
export function parseAmount(text) {
  const t = String(text).trim();
  const normalized = t.includes(',') ? t.replace(/\./g, '').replace(',', '.') : t;
  const n = parseFloat(normalized);
  return Number.isFinite(n) ? n : NaN;
}

export function maskDate(text) {
  const d = text.replace(/\D/g, '').slice(0, 8);
  if (d.length > 4) return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
  if (d.length > 2) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return d;
}

// "DD/MM/AAAA" -> "AAAA-MM-DD" (ou null se inválida)
export function brToISO(br) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(br);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  const d = new Date(+yyyy, +mm - 1, +dd);
  if (d.getFullYear() !== +yyyy || d.getMonth() !== +mm - 1 || d.getDate() !== +dd) return null;
  return `${yyyy}-${mm}-${dd}`;
}

export function isoToBR(iso) {
  const [y, m, d] = String(iso).split('-');
  return `${d}/${m}/${y}`;
}

export function todayBR() {
  const n = new Date();
  return `${pad(n.getDate())}/${pad(n.getMonth() + 1)}/${n.getFullYear()}`;
}

export function currentMonthPrefix() {
  const n = new Date();
  return `${n.getFullYear()}-${pad(n.getMonth() + 1)}`;
}
