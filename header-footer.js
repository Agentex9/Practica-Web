// Header and Footer Component - Injected into all pages

// Get page title from current page
function getPageTitle() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  switch(currentPage) {
    case 'menu.html':
      return 'Main Menu';
    case 'contact.html':
      return 'Contact Us';
    case 'vista2.html':
      return 'Vista 2';
    case 'pokemon.html':
      return 'Pokémon Viewer';
    default:
      return 'Page';
  }
}

function getPageButtons() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  switch(currentPage) {
    case 'menu.html':
      return '<button onclick="logout()">Logout</button>';
    case 'contact.html':
      return '<button onclick="logout()">Exit</button><button onclick="window.location.href=\'menu.html\'">Menu</button>';
    case 'vista2.html':
      return '<button onclick="logout()">Logout</button><button onclick="window.location.href=\'menu.html\'">Menu</button>';
    case 'pokemon.html':
      return '<button onclick="logout()">Logout</button><button onclick="window.location.href=\'menu.html\'">Menu</button>';
    default:
      return '';
  }
}

// Inject header and footer on page load
document.addEventListener('DOMContentLoaded', function() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Only inject on protected pages
  if (currentPage !== 'login.html' && currentPage !== 'register.html') {
    
    // Create and inject header
    const headerHTML = `
      <header>
        <h1>${getPageTitle()}</h1>
        <div class="logout-info">
          <div class="token-timer">Token expires at: <span id="expiryTime">--:--:--</span></div>
          ${getPageButtons()}
        </div>
      </header>
    `;
    
    // Create and inject footer
    const footerHTML = `
      <footer>
        <small>© 2026</small>
      </footer>
    `;
    
    // Find existing header and footer to replace, or inject them
    const existingHeader = document.querySelector('header');
    const existingFooter = document.querySelector('footer');
    const mainElement = document.querySelector('main');
    
    if (existingHeader) {
      existingHeader.outerHTML = headerHTML;
    } else if (mainElement) {
      mainElement.insertAdjacentHTML('beforebegin', headerHTML);
    }
    
    if (existingFooter) {
      existingFooter.outerHTML = footerHTML;
    } else {
      document.body.insertAdjacentHTML('beforeend', footerHTML);
    }
    
    // Update token expiry time
    function updateExpiryTime() {
      const expirySpan = document.getElementById('expiryTime');
      if (expirySpan) {
        expirySpan.textContent = getTokenExpiryTime() || '--:--:--';
      }
    }
    
    updateExpiryTime();
    setInterval(updateExpiryTime, 30000);
  }
});

// Add styles for header-footer components
const style = document.createElement('style');
style.textContent = `
  .logout-info {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .token-timer {
    color: white;
    font-size: 12px;
    background-color: rgba(255, 255, 255, 0.1);
    padding: 5px 10px;
    border-radius: 4px;
  }
`;
document.head.appendChild(style);
