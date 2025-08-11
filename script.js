document.getElementById('btn').addEventListener('click', () => {
  const out = document.getElementById('output');
  const now = new Date();
  out.textContent = `Button clicked at ${now.toLocaleString()}`;
  out.style.opacity = 0;
  setTimeout(() => out.style.opacity = 1, 50);
});
