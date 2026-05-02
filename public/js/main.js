function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    if (type === 'danger') toast.style.backgroundColor = 'var(--danger-color)';
    if (type === 'success') toast.style.backgroundColor = '#28a745';

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// Global confirm delete
document.addEventListener('submit', (e) => {
    if (e.target.matches('form') && e.target.action.includes('_method=DELETE')) {
        if (!confirm('Are you sure you want to delete this item?')) {
            e.preventDefault();
        }
    }
});
