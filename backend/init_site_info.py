"""
Initialize site_info.json with current website data
Run this script to populate the admin panel with existing website content
"""

import json
from pathlib import Path

# Current website data
CURRENT_PRODUCTS = [
    {
        "id": 1,
        "name": "Kimchi Gift Set",
        "price": "₱220",
        "image": "/images/KimchiGift.png",
        "shopeeLink": "https://ph.shp.ee/k5ZzgF6",
        "description": "Authentic Korean kimchi with a perfect blend of spices",
        "category": "Best Seller",
        "color": "#F05644"
    },
    {
        "id": 2,
        "name": "Rice Coffee",
        "price": "₱180",
        "image": "/images/RiceCoffee.png",
        "shopeeLink": "https://ph.shp.ee/k5ZzgF6",
        "description": "Traditional rice coffee with a smooth, comforting flavor",
        "category": "Beverages",
        "color": "#8B4513"
    },
    {
        "id": 3,
        "name": "Pickled Radish",
        "price": "₱200",
        "image": "/images/PickledRadish.png",
        "shopeeLink": "https://ph.shp.ee/k5ZzgF6",
        "description": "Crisp and refreshing pickled radish, perfectly seasoned",
        "category": "Sides",
        "color": "#E8C547"
    },
    {
        "id": 4,
        "name": "Rene's Bangus",
        "price": "₱280",
        "image": "/images/RenesBangus.png",
        "shopeeLink": "https://ph.shp.ee/k5ZzgF6",
        "description": "Premium marinated bangus, a Filipino delicacy",
        "category": "Main Dish",
        "color": "#4A90A4"
    },
    {
        "id": 5,
        "name": "Rene's Gourmet Chicken",
        "price": "₱320",
        "image": "/images/RenesGourmetChicken.png",
        "shopeeLink": "https://ph.shp.ee/k5ZzgF6",
        "description": "Gourmet chicken prepared with traditional Filipino flavors",
        "category": "Main Dish",
        "color": "#D4A574"
    }
]

CURRENT_AWARDS = [
    {
        "id": 1,
        "title": "Baguio MSME Kimchi Comeback",
        "year": "2024",
        "description": "From the brink of collapse to a rising kimchi brand with support from government agencies."
    },
    {
        "id": 2,
        "title": "Presidential Awards",
        "year": "2024",
        "description": "CEO Satur Cadsi and COO Janice Cadsi presented the Gift of Grace journey to a distinguished panel."
    },
    {
        "id": 3,
        "title": "Inspiring Filipina Entrepreneur 2025",
        "year": "2025",
        "description": "Honoring leadership that uplifts communities, empowers farmers, and innovates for Filipino families."
    },
    {
        "id": 4,
        "title": "Presidential Awards Presentation",
        "year": "2024",
        "description": "Sharing Gift of Grace milestones and values before a panel of national leaders."
    },
    {
        "id": 5,
        "title": "MSME Feature & Journey",
        "year": "2023",
        "description": "Showcasing growth as an MSME with strong community and market presence."
    }
]

CURRENT_ABOUT = {
    "mission": "To produce 10 different varieties of quality and healthy foods by year 2025.",
    "vision": "To provide not just a living but to extend blessing, sharing grace through nutritious, flavorful, and proudly Filipino-made local products.",
    "story": "Gift of Grace Food Manufacturing Corporation began its journey in 2017, born from a mother's passion for creating Korean kimchi infused with a flavor profile tailored to the Filipino taste. What started as a humble home-based business sharing products with neighbors soon grew beyond the household, reaching the local community, the online market, and eventually well-known retail chains such as SM, Savemore, Puregold, and Robinsons."
}

CURRENT_CONTACT = {
    "address": "#5 Purok 6, Pinsao Pilot Project, Baguio City 2600, Benguet, Philippines",
    "phone": "",
    "email": "",
    "facebook": "https://www.facebook.com/kimchigiftofficial"
}

CURRENT_COMPANY_INFO = {
    "founded": "2017",
    "founders": "Satur Cadsi (CEO) and Janice Osenio Cadsi (COO)",
    "location": "Baguio City, Philippines",
    "certification": "Halal certified"
}

def initialize_site_info():
    """Initialize site_info.json with current website data"""
    site_info = {
        "products": CURRENT_PRODUCTS,
        "awards": CURRENT_AWARDS,
        "about": CURRENT_ABOUT,
        "contact": CURRENT_CONTACT,
        "company_info": CURRENT_COMPANY_INFO
    }
    
    site_info_file = Path("site_info.json")
    with open(site_info_file, 'w', encoding='utf-8') as f:
        json.dump(site_info, f, indent=2, ensure_ascii=False)
    
    print("✅ site_info.json initialized successfully!")
    print(f"   - {len(CURRENT_PRODUCTS)} products")
    print(f"   - {len(CURRENT_AWARDS)} awards")
    print(f"   - About section (mission, vision, story)")
    print(f"   - Contact information")
    print(f"   - Company information")

if __name__ == "__main__":
    initialize_site_info()

