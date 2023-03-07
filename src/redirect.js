const url = location.hash.slice(1);

if (url) {
    if (!document.hidden) {
        location.href = url;
    } else {
        window.addEventListener('focus', function() {
            location.href = url;
        });
    }
    const fallback = document.getElementById('fallback');
    fallback.href = url;
    fallback.textContent = url;
    document.title += ' ' + url;
}
