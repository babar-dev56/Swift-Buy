// Compact Voice-Controlled Shopping
class VoiceShopping {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.currentProducts = [];
    this.init();
  }

  init() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';
    
    this.recognition.onresult = (e) => this.handleResult(e);
    this.recognition.onerror = (e) => console.error('Voice error:', e);
    this.recognition.onend = () => { if (this.isListening) this.start(); };
    
    // Load products when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.loadProducts());
    } else {
      this.loadProducts();
    }
  }

  loadProducts() {
    document.querySelectorAll('.product-card').forEach(card => {
      const name = card.querySelector('h3')?.textContent;
      const priceText = card.querySelector('.price')?.textContent;
      const price = parseInt(priceText?.replace(/[^\d]/g, '')) || 0;
      if (name) this.currentProducts.push({ name, price, element: card });
    });
  }

  start() {
    if (!this.recognition) return;
    this.isListening = true;
    this.recognition.start();
    this.updateStatus('🎤 Listening...', true);
  }

  stop() {
    this.isListening = false;
    if (this.recognition) this.recognition.stop();
    this.updateStatus('🎤 Click to start voice shopping', false);
  }

  toggle() {
    this.isListening ? this.stop() : this.start();
  }

  handleResult(e) {
    const transcript = Array.from(e.results).map(r => r[0].transcript).join(' ').toLowerCase();
    this.updateStatus(`Heard: "${transcript}"`, true);
    
    // Filter by price (e.g., "show me budget phones under $200")
    const priceMatch = transcript.match(/(?:under|below|less than|budget|show me).*?(\d+)/);
    if (priceMatch) {
      let maxPrice = parseInt(priceMatch[1]);
      if (transcript.includes('$') || transcript.includes('dollar')) {
        maxPrice *= 280; // Convert $ to PKR (approximate)
      }
      const category = this.extractCategory(transcript);
      this.filterByPrice(maxPrice, category);
      return;
    }

    // Compare products (e.g., "compare iPhone 14 and Samsung S22")
    if (transcript.includes('compare')) {
      const products = this.extractProductNames(transcript);
      if (products.length >= 2) {
        this.compareProducts(products.slice(0, 2));
      } else {
        this.showMessage('Please specify two products to compare');
      }
      return;
    }

    // Add to cart (e.g., "add this to cart" or "add [product] to cart")
    if (transcript.includes('add') && (transcript.includes('cart') || transcript.includes('to cart'))) {
      const productName = this.findProductInTranscript(transcript);
      if (productName) {
        this.addToCartByName(productName);
      } else {
        // Try to add the last viewed/selected product
        const lastProduct = document.querySelector('.product-card:hover, .product-card:focus');
        if (lastProduct) {
          const name = lastProduct.querySelector('h3')?.textContent;
          const priceText = lastProduct.querySelector('.price')?.textContent;
          const price = parseInt(priceText?.replace(/[^\d]/g, '')) || 0;
          if (name && typeof addToCart === 'function') {
            addToCart(name, price);
            this.showMessage(`Added ${name} to cart`);
          }
        } else {
          this.showMessage('Please specify which product to add');
        }
      }
      return;
    }
  }

  filterByPrice(maxPrice, category = null) {
    let filtered = this.currentProducts.filter(p => p.price <= maxPrice);
    
    // Filter by category if specified (e.g., "phones", "electronics")
    if (category) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(category) || 
        p.element.closest('.product-category')?.id === category
      );
    }
    
    this.currentProducts.forEach(p => {
      p.element.style.display = filtered.includes(p) ? '' : 'none';
    });
    
    const categoryText = category ? ` in ${category}` : '';
    this.showMessage(`Showing ${filtered.length} products under ${maxPrice} PKR${categoryText}`);
  }

  extractCategory(transcript) {
    const categories = ['phone', 'phones', 'electronics', 'fashion', 'groceries', 'kitchen'];
    const found = categories.find(cat => transcript.includes(cat));
    if (found === 'phone' || found === 'phones') return 'electronics';
    return found || null;
  }

  compareProducts(names) {
    const products = names.map(n => this.currentProducts.find(p => 
      p.name.toLowerCase().includes(n.toLowerCase())
    )).filter(Boolean);
    
    if (products.length < 2) {
      this.showMessage('Products not found for comparison');
      return;
    }

    const [p1, p2] = products;
    const comparison = `
      <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,0.3);z-index:10000;max-width:500px;">
        <h3>Comparison</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin:15px 0;">
          <div><strong>${p1.name}</strong><br>Price: ${p1.price} PKR</div>
          <div><strong>${p2.name}</strong><br>Price: ${p2.price} PKR</div>
        </div>
        <button onclick="this.parentElement.remove()" style="padding:8px 15px;background:#0074D9;color:white;border:none;border-radius:5px;cursor:pointer;">Close</button>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', comparison);
  }

  addToCartByName(name) {
    const product = this.currentProducts.find(p => 
      p.name.toLowerCase().includes(name.toLowerCase())
    );
    if (product && typeof addToCart === 'function') {
      addToCart(product.name, product.price);
      this.showMessage(`Added ${product.name} to cart`);
    }
  }

  extractProductNames(transcript) {
    // Extract product names from comparison command
    const parts = transcript.split(/compare|and|vs|versus/i);
    return parts.slice(1).map(s => s.trim().replace(/^(the|a|an)\s+/i, '')).filter(s => s.length > 2);
  }

  findProductInTranscript(transcript) {
    // Try exact match first
    let product = this.currentProducts.find(p => 
      transcript.includes(p.name.toLowerCase())
    );
    
    // Try partial match (first few words)
    if (!product) {
      product = this.currentProducts.find(p => {
        const words = p.name.toLowerCase().split(' ');
        return words.some((word, i) => {
          if (word.length < 3) return false;
          const phrase = words.slice(i, Math.min(i + 3, words.length)).join(' ');
          return transcript.includes(phrase);
        });
      });
    }
    
    // Try brand/model match (e.g., "iPhone 14", "Samsung S22")
    if (!product) {
      const brandMatch = transcript.match(/(iphone|samsung|lenovo|hyper|apple)\s*(\w+)?/i);
      if (brandMatch) {
        const brand = brandMatch[1].toLowerCase();
        product = this.currentProducts.find(p => 
          p.name.toLowerCase().includes(brand)
        );
      }
    }
    
    return product?.name;
  }

  updateStatus(text, active) {
    const btn = document.getElementById('voiceBtn');
    if (btn) {
      btn.textContent = text;
      btn.style.background = active ? '#28a745' : '#0074D9';
    }
  }

  showMessage(text) {
    const msg = document.createElement('div');
    msg.textContent = text;
    msg.style.cssText = 'position:fixed;top:20px;right:20px;background:#28a745;color:white;padding:15px 20px;border-radius:5px;z-index:10000;box-shadow:0 4px 15px rgba(0,0,0,0.2);';
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
  }
}

// Initialize
let voiceShopping;
document.addEventListener('DOMContentLoaded', () => {
  voiceShopping = new VoiceShopping();
});

