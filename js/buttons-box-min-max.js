document.addEventListener('DOMContentLoaded', () => {
    const floatingBox = document.getElementById('floating-box');
    const floatingBoxTab = document.getElementById('floating-box-tab');

    let isOpen = true;

    floatingBoxTab.addEventListener('click', (e) => {
        e.stopPropagation();
        isOpen = !isOpen;
        
        if (isOpen) {
            floatingBox.classList.remove('closed');
        } else {
            floatingBox.classList.add('closed');
        }
        
        localStorage.setItem('floatingBoxState', isOpen ? 'open' : 'closed');
    });
    
    const savedState = localStorage.getItem('floatingBoxState');
    if (savedState === 'closed') {
        isOpen = false;
        floatingBox.classList.add('closed');
    }
    
    floatingBox.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});


