# Gift of Grace  Website

A modern, elegant React website for Gift of Grace.

##  Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Technologies Used

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS v3.4.18** - Utility-first CSS framework


## 🎨 Design Features

- **Modern & Elegant UI** - Clean design with ample white space and premium aesthetics
- **Responsive Design** - Fully responsive (desktop, tablet, mobile)
- **Smooth Animations** - Optimized Framer Motion transitions with tween animations
- **Blue-White-Gold Palette** - Premium color scheme (grace-blue, grace-gold)
- **Interactive Product Carousel** - Horizontal scrollable carousel with circular looping
- **Sticky Navigation** - Centered logo navbar with smooth scroll navigation
- **Customer Reviews Section** - Showcasing social proof
- **AI Chatbot** - Auto-appearing chatbot with logo avatar (appears after 7 seconds)
- **Accessibility** - Full keyboard navigation, ARIA labels, focus states

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx           # Centered logo navigation with mobile menu
│   ├── Hero.jsx             # Hero section with logo, tagline, and girl image
│   ├── FeaturedProducts.jsx # Horizontal carousel with 5 products
│   ├── CustomerReviews.jsx  # Customer reviews showcase section
│   ├── About.jsx            # Brand story and feature cards
│   ├── Footer.jsx            # Footer with contact & social links
│   └── Chatbot.jsx          # AI chatbot component
├── App.jsx                   # Main app component
├── main.jsx                  # React entry point
└── index.css                 # Tailwind CSS & Google Fonts

public/
└── images/
    ├── giftofgracelogo.png  # Brand logo
    ├── girl.png             # Hero section image
    ├── Customer Review.png  # Customer reviews showcase
    ├── KimchiGift.png       # Product images
    ├── RiceCoffee.png
    ├── PickledRadish.png
    ├── RenesBangus.png
    └── RenesGourmetChicken.png
```

## 🖼️ Product Images

Product images are located in `public/images/`:
- `KimchiGift.png`
- `RiceCoffee.png`
- `PickledRadish.png`
- `RenesBangus.png`
- `RenesGourmetChicken.png`

All product images should have `.png` or `.jpg` extensions for proper loading.

## 🔗 Key Links

- **Shopee Store**: `https://ph.shp.ee/k5ZzgF6` (configured in components)
- **Social Media**: Update links in `Footer.jsx`

## 🎯 Customization

### Colors

Colors are defined in `tailwind.config.js`:

```js
colors: {
  'grace-blue': '#3B82F6',
  'grace-gold': '#D4AF37',
  'grace-dark-blue': '#1E40AF',
  'grace-light-blue': '#EFF6FF',
}
```

### Fonts

The site uses **Playfair Display** (serif) and **Source Sans Pro** (sans-serif) from Google Fonts, loaded in `index.css`.

### Products

Edit the `products` array in `src/components/FeaturedProducts.jsx` to add/edit products:

```js
const products = [
  {
    id: 1,
    name: 'Product Name',
    price: '₱220',
    image: '/images/ProductImage.png',
    shopeeLink: 'https://ph.shp.ee/k5ZzgF6',
    description: 'Product description',
  },
  // ... more products
]
```
## 🌐 Browser Support

Modern browsers (Chrome, Firefox, Safari, Edge) - Latest 2 versions

## 📦 Deployment

Ready for deployment on **Vercel**, **Netlify**, or any static hosting service.

For Vercel:
1. Push code to GitHub
2. Import repository in Vercel
3. Vercel auto-detects Vite + React
4. Deploy!

---

**Brand**: Gift of Grace  
**Tagline**: A Touch of Grace, Infused with Comfort

