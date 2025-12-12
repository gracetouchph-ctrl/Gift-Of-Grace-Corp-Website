"""
================================================================================
ACTIONS.PY - CUSTOM ACTIONS FOR GIFT OF GRACE RASA CHATBOT
================================================================================

This file contains all custom business logic for the Gift of Grace chatbot.
Implement these in your Rasa action server for real-time integration.

Key integrations:
- Shopee API (inventory, pricing)
- Email notifications
- CRM/Customer database
- Delivery calculations
- Product recommendations
"""

from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
import requests
import json
from datetime import datetime

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

class GiftOfGraceDatabase:
    """Mock database - replace with real database connection"""
    
    PRODUCTS = {
        "kimchi_tongbaechu": {
            "name": "Kimchi (Tongbaechu)",
            "price": 150,
            "spice_level": "hot",
            "description": "Traditional Korean fermented cabbage",
            "health_focus": ["digestive", "immune", "anti_inflammatory"],
            "in_stock": True,
            "quantity": 50
        },
        "kimchi_kongnamul": {
            "name": "Kimchi (Kongnamul)",
            "price": 120,
            "spice_level": "mild",
            "description": "Light, refreshing fermented bean sprouts",
            "health_focus": ["digestive", "gentle"],
            "in_stock": True,
            "quantity": 30
        },
        "tofu": {
            "name": "Tofu",
            "price": 100,
            "spice_level": "none",
            "description": "Fermented tofu",
            "health_focus": ["protein", "digestive"],
            "in_stock": True,
            "quantity": 40
        },
        "rice_coffee": {
            "name": "Rice Coffee",
            "price": 80,
            "spice_level": "none",
            "description": "Caffeine-free comfort beverage",
            "health_focus": ["energy", "digestive"],
            "in_stock": True,
            "quantity": 60
        },
        "pickled_radish": {
            "name": "Pickled Radish",
            "price": 90,
            "spice_level": "medium",
            "description": "Crunchy fermented daikon",
            "health_focus": ["digestive", "fresh"],
            "in_stock": True,
            "quantity": 35
        }
    }
    
    DELIVERY_ZONES = {
        "baguio": {
            "name": "Baguio City",
            "cost": 50,
            "days": "1-2"
        },
        "cordillera": {
            "name": "Cordillera Region",
            "cost": 75,
            "days": "2-3"
        },
        "ncr": {
            "name": "NCR / Metro Manila",
            "cost": 100,
            "days": "2-3"
        },
        "provincial": {
            "name": "Provincial (Other)",
            "cost": 150,
            "days": "3-5"
        }
    }
    
    CUSTOMERS = {}  # Will store customer data
    
    @staticmethod
    def get_product(product_id):
        return GiftOfGraceDatabase.PRODUCTS.get(product_id)
    
    @staticmethod
    def get_inventory(product_id):
        product = GiftOfGraceDatabase.PRODUCTS.get(product_id)
        return product["quantity"] if product else 0
    
    @staticmethod
    def check_in_stock(product_id):
        product = GiftOfGraceDatabase.PRODUCTS.get(product_id)
        return product["in_stock"] if product else False

# ============================================================================
# PRODUCT TRACKING & CONTEXT ACTIONS
# ============================================================================

class ActionTrackUserContext(Action):
    """Track user context for personalization"""
    
    def name(self) -> Text:
        return "action_track_user_context"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        sender_id = tracker.sender_id
        
        # Check if repeat customer
        is_repeat = GiftOfGraceDatabase.CUSTOMERS.get(sender_id) is not None
        
        if is_repeat:
            dispatcher.utter_message(text="Welcome back! 😊")
        
        return [SlotSet("is_repeat_customer", is_repeat)]


class ActionSetCustomerType(Action):
    """Set customer type for better recommendations"""
    
    def name(self) -> Text:
        return "action_set_customer_type"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        customer_type = next(tracker.get_latest_entity_values("customer_type"), None)
        
        return [SlotSet("customer_type", customer_type)]


class ActionSetSpicePreference(Action):
    """Record spice tolerance preference"""
    
    def name(self) -> Text:
        return "action_set_spice_preference"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        spice_level = next(tracker.get_latest_entity_values("spice_level"), None)
        
        # Map to canonical values
        spice_mapping = {
            "mild": "mild",
            "medium": "medium",
            "hot": "hot",
            "very hot": "very_hot",
            "spicy": "hot"
        }
        
        mapped_spice = spice_mapping.get(spice_level, spice_level)
        
        return [SlotSet("spice_tolerance", mapped_spice)]


class ActionSetHealthFocus(Action):
    """Record primary health focus for personalized recommendations"""
    
    def name(self) -> Text:
        return "action_set_health_focus"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        health_condition = next(tracker.get_latest_entity_values("health_condition"), None)
        
        # Map conditions to health focus areas
        health_mapping = {
            "ibs": "digestive",
            "digestion": "digestive",
            "bloating": "digestive",
            "inflammation": "anti_inflammatory",
            "immune": "immune",
            "skin": "skin",
            "energy": "energy"
        }
        
        mapped_health = health_mapping.get(health_condition, health_condition)
        
        return [SlotSet("health_focus", mapped_health)]


class ActionLogDietaryRestrictions(Action):
    """Record dietary restrictions"""
    
    def name(self) -> Text:
        return "action_log_dietary_restrictions"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        restrictions = next(tracker.get_latest_entity_values("dietary_restriction"), None)
        
        return [SlotSet("dietary_restrictions", restrictions)]

# ============================================================================
# INVENTORY & AVAILABILITY ACTIONS
# ============================================================================

class ActionCheckInventory(Action):
    """Check real-time inventory from Shopee or database"""
    
    def name(self) -> Text:
        return "action_check_inventory"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        product = next(tracker.get_latest_entity_values("PRODUCT"), None)
        
        if not product:
            dispatcher.utter_message(
                text="Which product would you like to check? (kimchi, tofu, rice coffee, etc.)"
            )
            return []
        
        # In production: Query Shopee API or real database
        quantity = GiftOfGraceDatabase.get_inventory(product)
        in_stock = GiftOfGraceDatabase.check_in_stock(product)
        
        if in_stock and quantity > 0:
            dispatcher.utter_message(
                text=f"✅ {product.replace('_', ' ').title()} is in stock! "
                     f"We have {quantity} units available. Ready to order?"
            )
        else:
            dispatcher.utter_message(
                text=f"❌ {product.replace('_', ' ').title()} is currently out of stock. "
                     f"Want me to notify you when it's back?"
            )
        
        return [SlotSet("product_interested", product)]


class ActionCheckDeliveryArea(Action):
    """Check if we deliver to customer's location"""
    
    def name(self) -> Text:
        return "action_check_delivery_area"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        location = next(tracker.get_latest_entity_values("LOCATION"), None)
        
        if not location:
            dispatcher.utter_message(
                text="What's your location? I'll check our delivery coverage."
            )
            return []
        
        # Normalize location
        location_lower = location.lower()
        
        # Check delivery zones
        delivery_zone = None
        if "baguio" in location_lower:
            delivery_zone = GiftOfGraceDatabase.DELIVERY_ZONES["baguio"]
        elif "cordillera" in location_lower or "benguet" in location_lower:
            delivery_zone = GiftOfGraceDatabase.DELIVERY_ZONES["cordillera"]
        elif "metro manila" in location_lower or "ncr" in location_lower:
            delivery_zone = GiftOfGraceDatabase.DELIVERY_ZONES["ncr"]
        else:
            delivery_zone = GiftOfGraceDatabase.DELIVERY_ZONES["provincial"]
        
        dispatcher.utter_message(
            text=f"✅ We deliver to {location}! "
                 f"Estimated delivery: {delivery_zone['days']} business days "
                 f"with shipping fee of ₱{delivery_zone['cost']}."
        )
        
        return [SlotSet("location", location)]

# ============================================================================
# SHIPPING & COST CALCULATION ACTIONS
# ============================================================================

class ActionCalculateShipping(Action):
    """Calculate shipping cost based on location and weight"""
    
    def name(self) -> Text:
        return "action_calculate_shipping"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        location = tracker.get_slot("location")
        
        if not location:
            dispatcher.utter_message(
                text="Please tell me your location so I can calculate shipping for you."
            )
            return []
        
        # Get base shipping cost
        location_lower = location.lower()
        base_cost = 100  # Default
        
        if "baguio" in location_lower:
            base_cost = 50
        elif "cordillera" in location_lower:
            base_cost = 75
        elif "metro" in location_lower or "ncr" in location_lower:
            base_cost = 100
        else:
            base_cost = 150
        
        dispatcher.utter_message(
            text=f"📦 Shipping to {location}: ₱{base_cost}\n"
                 f"*Free shipping on orders above ₱500! ✨"
        )
        
        return []


class ActionTrackOrder(Action):
    """Look up order status"""
    
    def name(self) -> Text:
        return "action_track_order"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        sender_id = tracker.sender_id
        
        # In production: Query order database by sender_id
        dispatcher.utter_message(
            text="To track your order, please provide your order number or email. "
                 "Or contact us directly at 09087804565 for immediate assistance!"
        )
        
        return []

# ============================================================================
# RECOMMENDATION & PERSONALIZATION ACTIONS
# ============================================================================

class ActionRecommendProduct(Action):
    """Intelligent product recommendation based on user profile"""
    
    def name(self) -> Text:
        return "action_recommend_product"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        spice_tolerance = tracker.get_slot("spice_tolerance")
        health_focus = tracker.get_slot("health_focus")
        customer_type = tracker.get_slot("customer_type")
        
        recommendation = "kimchi_tongbaechu"  # Default
        
        # Smart recommendation logic
        if spice_tolerance == "mild":
            recommendation = "kimchi_kongnamul"
        elif customer_type == "first_timer":
            recommendation = "kimchi_kongnamul"
        elif health_focus == "digestive":
            recommendation = "kimchi_kongnamul"
        elif health_focus == "energy":
            recommendation = "rice_coffee"
        elif health_focus == "skin":
            recommendation = "kimchi_tongbaechu"
        
        product = GiftOfGraceDatabase.get_product(recommendation)
        
        dispatcher.utter_message(
            text=f"🌟 Based on your preferences, I recommend:\n\n"
                 f"**{product['name']}** - ₱{product['price']}\n"
                 f"{product['description']}\n\n"
                 f"Would you like to add this to your order?"
        )
        
        return [SlotSet("product_interested", recommendation)]


class ActionApplyLoyaltyDiscount(Action):
    """Apply discounts for repeat customers or bulk orders"""
    
    def name(self) -> Text:
        return "action_apply_loyalty_discount"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        quantity = tracker.get_slot("quantity")
        customer_type = tracker.get_slot("customer_type")
        
        discount = 0
        discount_reason = ""
        
        # Bulk order discount
        if quantity and int(quantity) >= 5:
            discount = 10
            discount_reason = "bulk order (5+ items)"
        
        # Repeat customer discount
        if customer_type == "repeat_customer":
            discount += 5
            discount_reason += " + repeat customer" if discount_reason else "repeat customer"
        
        if discount > 0:
            dispatcher.utter_message(
                text=f"🎉 Congrats! You qualify for a {discount}% discount "
                     f"({discount_reason})!"
            )
        
        return [SlotSet("discount_percent", discount)]


class ActionHighlightUniqueValue(Action):
    """Explain Gift of Grace's competitive advantages"""
    
    def name(self) -> Text:
        return "action_highlight_unique_value"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        dispatcher.utter_message(
            text="""🌟 **Why Choose Gift of Grace?**

✅ **Local Sourcing** - Direct from Baguio farmers (80% of Metro Manila's vegetables come from here!)
✅ **Farm-to-Ferment** - Vegetables processed within 24 hours of harvest
✅ **Traditional Methods** - Small-batch fermentation with temperature control
✅ **FDA Verified** - Registered as low-risk fermented food product
✅ **Quality Probiotics** - Billions of active cultures per serving
✅ **MSME Excellence** - DTI & DOST recognized business supporting local agriculture

We're not just selling food—we're supporting Baguio farmers and creating real health benefits! 💚"""
        )
        
        return []

# ============================================================================
# BRAND STORYTELLING ACTIONS
# ============================================================================

class ActionTellFounderStory(Action):
    """Tell Grace's founder story"""
    
    def name(self) -> Text:
        return "action_tell_founder_story"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        dispatcher.utter_message(
            text="""🌱 **The Grace Behind Gift of Grace**

Grace started as a homemaker experimenting with fermentation in her own kitchen in 2015. 
Fascinated by Korean kimchi and its health benefits, she left her career in insurance to 
pursue her passion.

**From Hobby to Heart Project:**
- 2015: Started with just 2 products (kimchi & tofu)
- 2020s: Grew to 9+ fermented products
- 2025: Recognized by DTI as Small Enterprise Category and DOST as Best Regional SETUP Implementer

**Why She Does This:**
"I wanted to bring traditional Korean fermentation wisdom to the Philippines while 
supporting our local farmers. Every jar of Gift of Grace represents the love, science, 
and community at its heart."

Today, Grace and Satur lead a team dedicated to quality, sustainability, and making 
fermented foods accessible to Filipino families.

Want to chat with Grace or Satur directly? They'd love to hear from you! 💚"""
        )
        
        return []


class ActionTellFarmerStory(Action):
    """Highlight farmer relationships and sourcing"""
    
    def name(self) -> Text:
        return "action_tell_farmer_story"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        dispatcher.utter_message(
            text="""🌾 **Meet the Farmers Behind Your Food**

Gift of Grace works directly with farming families in Benguet and Cordillera:
- **Kibungan, Buguias, Bokod, Atok** - Cool highland climate = fresher, crisper vegetables
- **80% of Metro Manila's vegetables** come from this region
- **Direct fair-trade relationships** - We pay farmers fairly for their crops

**Why This Matters:**
✅ Vegetables harvested → processed within 24 hours (peak freshness)
✅ Highest quality raw materials for fermentation
✅ Direct support for farming families in agriculture-dependent communities
✅ Sustainable agricultural practices

When you buy Gift of Grace, you're not just getting probiotic-rich food—
you're directly supporting Baguio's agricultural heritage! 💚

Want to know about specific cooperatives? Ask about our farmer network!"""
        )
        
        return []


class ActionTellKimchiHistory(Action):
    """Explain kimchi history and cultural significance"""
    
    def name(self) -> Text:
        return "action_tell_kimchi_history"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        dispatcher.utter_message(
            text="""📚 **The Rich History of Kimchi**

Kimchi has been a staple of Korean cuisine for over 2,000 years, evolving from 
a way to preserve vegetables during harsh winters into a cornerstone of Korean culture.

**Cultural Significance:**
🍽️ No Korean meal is complete without kimchi (banchan/side dish)
🧂 Fermentation began as preservation necessity, became health tradition
🌍 UNESCO recognized Kimjang (communal kimchi-making) as Cultural Heritage

**Why Fermentation Matters:**
Ancient Koreans discovered that salt fermentation not only preserved vegetables 
but actually enhanced their nutritional value and created beneficial probiotics. 
They were doing what modern science now validates!

**From Korea to the Philippines:**
Gift of Grace brings this 2,000-year-old wisdom to the Philippines, 
adapting it with locally-sourced Baguio vegetables while honoring 
traditional fermentation methods.

Every jar is a connection to centuries of culinary wisdom and health tradition. 🌿"""
        )
        
        return []


class ActionShareCertifications(Action):
    """Share quality certifications and recognitions"""
    
    def name(self) -> Text:
        return "action_share_certifications"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        dispatcher.utter_message(
            text="""✅ **Gift of Grace Certifications & Recognition**

🏛️ **Government Recognition:**
- **DTI Small Enterprise Category** - Officially registered with Department of Trade & Industry
- **DOST SETUP Award (2025)** - Recognized as Best Regional SETUP Implementer (Science, Technology, Education & Production)
- **FDA Verified** - Registered as Low-Risk Fermented Food Product

🔬 **Food Safety Standards:**
- Fermentation pH < 4.6 (pathogen-killing acidic environment)
- Temperature-controlled processing
- Food-grade materials only
- Safe fermentation practices validated

📊 **Quality Metrics:**
- Small-batch production (quality over quantity)
- Locally-sourced, fresh ingredients
- Active probiotic cultures in every jar
- 3-6 month shelf life when refrigerated

These certifications mean you can trust every jar of Gift of Grace! 💚"""
        )
        
        return []


class ActionShareSocialHandles(Action):
    """Share social media and contact information"""
    
    def name(self) -> Text:
        return "action_share_social_handles"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        dispatcher.utter_message(
            text="""📱 **Connect With Gift of Grace**

🛒 **Shop:** https://ph.shp.ee/k5ZzgF6 (Shopee)
📘 **Facebook:** @kimchigiftofficial
📸 **Instagram:** @gif_tofgrace
🌐 **Website:** gogcorp.com

📞 **Direct Contact:**
- **WhatsApp/Phone:** 09087804565
- **Email:** kimchigit@gmail.com
- **Address:** Cadsi CRONO, Baguio City

Follow us for:
✨ Seasonal product launches
📚 Fermentation tips & recipes
🎉 Loyalty discounts & special offers
👥 Community stories from farmers & customers

See you there! 💚"""
        )
        
        return []

# ============================================================================
# ORDER MANAGEMENT ACTIONS
# ============================================================================

class ActionCreateOrder(Action):
    """Initialize order creation process"""
    
    def name(self) -> Text:
        return "action_create_order"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        product = tracker.get_slot("product_interested")
        quantity = tracker.get_slot("quantity") or 1
        location = tracker.get_slot("location")
        
        if not product:
            dispatcher.utter_message(
                text="Which product would you like to order?"
            )
            return []
        
        product_info = GiftOfGraceDatabase.get_product(product)
        subtotal = product_info["price"] * int(quantity)
        
        dispatcher.utter_message(
            text=f"""🛒 **Order Summary**

📦 {product_info['name']} x{quantity}
💵 ₱{product_info['price']} × {quantity} = ₱{subtotal}

Location: {location or "Not specified yet"}
Delivery: TBD

Next: Let me connect you to complete payment!
You can order via:
🛒 Shopee: https://ph.shp.ee/k5ZzgF6
📱 WhatsApp: 09087804565
📧 Email: kimchigit@gmail.com"""
        )
        
        return [
            SlotSet("order_product", product),
            SlotSet("order_quantity", quantity),
            SlotSet("order_subtotal", subtotal)
        ]


class ActionCheckPurchaseHistory(Action):
    """Check customer's purchase history for personalization"""
    
    def name(self) -> Text:
        return "action_check_purchase_history"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        sender_id = tracker.sender_id
        
        # In production: Query real customer database
        dispatcher.utter_message(
            text="Great! I found your account. Your last order was..."
        )
        
        return []


class ActionCheckSeasonalAvailability(Action):
    """Check what's available this season"""
    
    def name(self) -> Text:
        return "action_check_seasonal_availability"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        current_month = datetime.now().month
        
        seasonal_products = {
            "spring": ["Fresh Pechay Kimchi"],
            "summer": ["Light Kongnamul", "Cold Noodle Toppings"],
            "fall": ["Aged Kimchi", "Warming Rice Coffee"],
            "winter": ["Full-ferment Tongbaechu", "Comfort Rice Coffee"]
        }
        
        season_map = {
            1: "winter", 2: "winter", 3: "spring",
            4: "spring", 5: "spring", 6: "summer",
            7: "summer", 8: "summer", 9: "fall",
            10: "fall", 11: "fall", 12: "winter"
        }
        
        current_season = season_map[current_month]
        products = seasonal_products[current_season]
        
        dispatcher.utter_message(
            text=f"🍂 **{current_season.capitalize()} Seasonal Offerings:**\n\n" +
                 "\n".join(f"✨ {p}" for p in products)
        )
        
        return []


class ActionNotifyProductLaunch(Action):
    """Sign up for product launch notifications"""
    
    def name(self) -> Text:
        return "action_notify_product_launch"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        dispatcher.utter_message(
            text="📬 You'll be notified when new products launch! "
                 "Stay tuned to our Shopee and Facebook for announcements."
        )
        
        return []

# ============================================================================
# ESCALATION & SUPPORT ACTIONS
# ============================================================================

class ActionEscalateToHuman(Action):
    """Escalate to human support"""
    
    def name(self) -> Text:
        return "action_escalate_to_human"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Log escalation for human review
        sender_id = tracker.sender_id
        intent = tracker.latest_message.get("intent", {}).get("name", "unknown")
        
        # In production: Send to ticketing system, email, or Slack
        print(f"ESCALATION: User {sender_id} escalated from intent: {intent}")
        
        return []


class ActionSendRecipeEmail(Action):
    """Email recipe ideas to customer"""
    
    def name(self) -> Text:
        return "action_send_recipe_email"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # In production: Integrate with email service (SendGrid, AWS SES, etc.)
        dispatcher.utter_message(
            text="📧 I'm sending you our top 10 recipes! Check your email."
        )
        
        return []

# ============================================================================
# VALIDATION & HELPER ACTIONS
# ============================================================================

def validate_quantity(quantity_text: str) -> int:
    """Parse quantity from text"""
    try:
        return int(quantity_text.split()[0])
    except:
        return 1

def map_product_name(product_text: str) -> str:
    """Normalize product names"""
    product_mapping = {
        "kimchi": "kimchi_tongbaechu",
        "mild kimchi": "kimchi_kongnamul",
        "light kimchi": "kimchi_kongnamul",
        "tofu": "tofu",
        "rice coffee": "rice_coffee",
        "pickled radish": "pickled_radish",
        "radish": "pickled_radish",
        "thai": "thai_street_food"
    }
    return product_mapping.get(product_text.lower(), product_text)

# ============================================================================
# NOTES FOR IMPLEMENTATION
# ============================================================================

"""
INTEGRATION CHECKLIST:

1. Database Connection
   - Replace GiftOfGraceDatabase with real MySQL/PostgreSQL connection
   - Store customer data, order history, preferences
   
2. Shopee API Integration
   - Check real inventory
   - Process orders
   - Track shipments
   
3. Email Service
   - SendGrid or AWS SES for notifications
   - Order confirmations
   - Recipe emails
   - Launch announcements
   
4. Payment Processing
   - Shopee checkout
   - GCash API integration
   - Bank transfer verification
   
5. Analytics
   - Track intent distribution
   - Customer satisfaction metrics
   - Popular products
   - Health focus trends
   
6. CRM Integration
   - Store customer preferences
   - Track interactions
   - Loyalty points
   - Reorder reminders

7. Escalation System
   - Slack/Teams notifications for human review
   - Ticketing system (Jira, Freshdesk)
   - Email alerts for urgent issues

8. Production Deployment
   - Use environment variables for sensitive data
   - Implement rate limiting
   - Add logging and monitoring
   - Set up error handling
   - Cache frequently accessed data
"""
