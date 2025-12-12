# actions.py - FIXED: Direct responses for simple intents, RAG only for complex queries
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet, SessionStarted, ActionExecuted, EventType
from datetime import datetime
import logging
import random

logger = logging.getLogger(__name__)

# Import RAG pipeline - only used for complex queries
try:
    from .rag_pipeline import rag_pipeline, generate_answer, retrieve_context
    RAG_AVAILABLE = True
    logger.info("RAG Pipeline imported successfully")
except ImportError:
    try:
        from rag_pipeline import rag_pipeline, generate_answer, retrieve_context
        RAG_AVAILABLE = True
        logger.info("RAG Pipeline imported successfully (direct)")
    except ImportError as e:
        RAG_AVAILABLE = False
        logger.error(f"Failed to import RAG pipeline: {e}")


# ============ DIRECT RESPONSE DATA ============
# These are used instead of LLM for fast, consistent responses

GREET_RESPONSES = [
    "Hello! I'm Grace, your Gift of Grace assistant. How can I help you today?",
    "Hi there! Welcome to Gift of Grace. What would you like to know?",
    "Hey! I'm here to help with questions about Gift of Grace. What can I do for you?",
    "Good day! I'm Grace, ready to help you learn about Gift of Grace Food Manufacturing. Ask me anything!",
]

GOODBYE_RESPONSES = [
    "Goodbye! Feel free to come back if you have more questions about Gift of Grace.",
    "Take care! Thanks for chatting with Gift of Grace.",
    "Bye! Have a great day!",
    "See you! Don't hesitate to ask if you need anything about Gift of Grace.",
]

THANKYOU_RESPONSES = [
    "You're welcome! Let me know if you have any other questions.",
    "Happy to help! Anything else you'd like to know?",
    "No problem! Feel free to ask more questions anytime.",
    "Glad I could help! Is there anything else about Gift of Grace you'd like to know?",
]

BOT_RESPONSES = [
    "I'm Grace, an AI assistant for Gift of Grace Food Manufacturing Corporation. I'm here to help answer your questions!",
    "Yes, I'm an AI chatbot created to help you learn about Gift of Grace and their products.",
    "I'm Grace, a virtual assistant. While I'm not human, I'm here to help with any questions about Gift of Grace!",
]

HELP_RESPONSES = [
    "I can help you with:\n- Products (kimchi, tofu, rice coffee)\n- Company information and history\n- Founders (Satur & Janice Cadsi)\n- Awards and certifications\n- Location and contact info\n\nJust ask me anything about Gift of Grace!",
]

OUT_OF_SCOPE_RESPONSES = [
    "I specialize in questions about Gift of Grace Food Manufacturing. Try asking about our products, history, or contact info!",
    "That's outside my expertise. I'm best at answering questions about Gift of Grace - their products, founders, awards, and more.",
    "I'm specifically designed for Gift of Grace questions. Would you like to know about our kimchi, tofu, or rice coffee?",
]

# Pre-defined responses for common queries (no LLM needed)
PRODUCT_INFO = """Gift of Grace makes three main products:

1. **Kimchi Gift** - Our flagship K-Fil Fusion kimchi, blending Korean techniques with Filipino vegetables. Halal certified!

2. **Tofu Gift** - Fresh, non-GMO soybean curd in various textures, perfect for healthy cooking.

3. **Rice Coffee with Moringa** - A caffeine-free alternative made from roasted rice and moringa. Great for all ages!

All products are made in Baguio City and are Halal certified."""

FOUNDERS_INFO = """Gift of Grace was founded by husband-and-wife team:

- **Satur Cadsi** (CEO) - Leads company operations and business development
- **Janice Osenio Cadsi** (COO) - Manages production and quality control

They started as a home-based kimchi business in 2015 and have grown into an award-winning food manufacturing company in Baguio City."""

AWARDS_INFO = """Gift of Grace has received several recognitions:

- Presidential Award for Outstanding MSMEs Finalist (2025)
- Inspiring Filipina Entrepreneur Award - Janice Cadsi (2025)
- Regional Best SETUP Adoptor from DOST-CAR
- Halal Certification for all products

The company continues to be recognized for quality and innovation in Filipino food manufacturing."""

LOCATION_INFO = """Gift of Grace is located at:

**Address:** #5 Purok 6, Pinsao Pilot Project, Baguio City 2600, Benguet, Philippines

The cool Baguio climate is perfect for their fermentation processes, especially for making their signature kimchi."""

CONTACT_INFO = """To contact Gift of Grace:

**Location:** #5 Purok 6, Pinsao Pilot Project, Baguio City 2600, Benguet

For the latest contact details, please check:
- Their official Facebook page
- Gift of Grace website

You can visit their Baguio location to see and purchase products directly!"""

COMPANY_INFO = """Gift of Grace Food Manufacturing Corporation is a Filipino food company based in Baguio City.

**Founded:** 2015 (started as home-based business)
**Founders:** Satur Cadsi (CEO) & Janice Osenio Cadsi (COO)
**Products:** Kimchi Gift, Tofu Gift, Rice Coffee with Moringa
**Certification:** Halal certified

They specialize in healthy, locally-made food products and have won several awards for their quality and entrepreneurship."""


# ============ ACTION CLASSES ============

class ActionSessionStart(Action):
    def name(self) -> Text:
        return "action_session_start"

    async def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[EventType]:
        events = [SessionStarted()]
        if len(tracker.events) <= 3:
            events.append(ActionExecuted("action_listen"))
        return events


class ActionGreet(Action):
    """Direct greeting response - NO LLM"""
    def name(self) -> Text:
        return "action_greet"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text=random.choice(GREET_RESPONSES))
        return []


class ActionGoodbye(Action):
    """Direct goodbye response - NO LLM"""
    def name(self) -> Text:
        return "action_goodbye"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text=random.choice(GOODBYE_RESPONSES))
        return []


class ActionThankYou(Action):
    """Direct thank you response - NO LLM"""
    def name(self) -> Text:
        return "action_thankyou"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text=random.choice(THANKYOU_RESPONSES))
        return []


class ActionBotChallenge(Action):
    """Direct bot identity response - NO LLM"""
    def name(self) -> Text:
        return "action_bot_challenge"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text=random.choice(BOT_RESPONSES))
        return []


class ActionHelp(Action):
    """Direct help response - NO LLM"""
    def name(self) -> Text:
        return "action_help"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text=random.choice(HELP_RESPONSES))
        return []


class ActionOutOfScope(Action):
    """Direct out of scope response - NO LLM"""
    def name(self) -> Text:
        return "action_out_of_scope"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text=random.choice(OUT_OF_SCOPE_RESPONSES))
        return []


class ActionHandleProducts(Action):
    """Product queries - use RAG for detailed questions, direct for simple ones"""
    def name(self) -> Text:
        return "action_handle_products"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        query = tracker.latest_message.get('text', '').lower()
        original_query = tracker.latest_message.get('text', '')
        logger.info(f"Product query: {query}")

        # Keywords that indicate detailed questions - USE RAG
        detailed_keywords = ['price', 'cost', 'how much', 'magkano', 'peso', 'php',
                            'ingredient', 'contain', 'content', 'made of', 'process',
                            'how do you', 'how is it', 'recipe', 'shelf life', 'expire',
                            'nutrition', 'calorie', 'benefit', 'health', 'flavor', 'taste',
                            'size', 'variant', 'available', 'order', 'buy', 'purchase',
                            'delivery', 'ship', 'store', 'preserve']

        # Use RAG for detailed questions
        if RAG_AVAILABLE and any(k in query for k in detailed_keywords):
            try:
                response = generate_answer(original_query)
                if response and len(response) > 20:
                    dispatcher.utter_message(text=response)
                    return []
            except Exception as e:
                logger.error(f"RAG error in products: {e}")

        # Simple product overview for basic "what products" questions
        if 'kimchi' in query and not any(k in query for k in detailed_keywords):
            response = "**Kimchi Gift** is our flagship product - a K-Fil Fusion kimchi that blends Korean fermentation with fresh Filipino vegetables. Price: **₱60** per pouch. It's Halal certified!"
        elif 'tofu' in query and not any(k in query for k in detailed_keywords):
            response = "**Tofu Gift** is our non-GMO soybean curd product. Price: **₱43**. It comes in Silken, Soft, Firm, and Extra-Firm textures - perfect for healthy cooking!"
        elif ('rice coffee' in query or 'coffee' in query) and not any(k in query for k in detailed_keywords):
            response = "**Rice Coffee with Moringa** - a caffeine-free beverage from roasted rice and moringa.\n\n**Prices:**\n- 20g (10 sachets): ₱170\n- 200g pack: ₱90\n- 350g pack: ₱165"
        else:
            response = """Gift of Grace makes three main products:

1. **Kimchi Gift** (₱60) - K-Fil Fusion kimchi blending Korean & Filipino flavors. Halal certified!

2. **Tofu Gift** (₱43) - Non-GMO soybean curd in various textures (Silken, Soft, Firm, Extra-Firm).

3. **Rice Coffee with Moringa** - Caffeine-free beverage:
   - 20g (10 sachets): ₱170
   - 200g pack: ₱90
   - 350g pack: ₱165

All products are made in Baguio City and are Halal certified!"""

        dispatcher.utter_message(text=response)
        return []


class ActionHandleFounders(Action):
    """Direct founders response - NO LLM"""
    def name(self) -> Text:
        return "action_handle_founders"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text=FOUNDERS_INFO)
        return []


class ActionHandleAwards(Action):
    """Direct awards response - NO LLM"""
    def name(self) -> Text:
        return "action_handle_awards"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        query = tracker.latest_message.get('text', '').lower()

        if 'halal' in query:
            response = "Yes! All Gift of Grace products are **Halal certified**. This includes our Kimchi Gift, Tofu Gift, and Rice Coffee with Moringa."
        else:
            response = AWARDS_INFO

        dispatcher.utter_message(text=response)
        return []


class ActionHandleLocation(Action):
    """Direct location response - NO LLM"""
    def name(self) -> Text:
        return "action_handle_location"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text=LOCATION_INFO)
        return []


class ActionHandleContact(Action):
    """Contact/supply queries - use RAG for detailed questions"""
    def name(self) -> Text:
        return "action_handle_contact"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        query = tracker.latest_message.get('text', '').lower()
        original_query = tracker.latest_message.get('text', '')

        # Keywords for supplier/business inquiries
        business_keywords = ['supply', 'supplier', 'wholesale', 'bulk', 'distribute', 'distributor',
                           'business', 'partnership', 'resell', 'retail', 'store', 'order']

        if RAG_AVAILABLE and any(k in query for k in business_keywords):
            try:
                response = generate_answer(original_query)
                if response and len(response) > 30:
                    dispatcher.utter_message(text=response)
                    return []
            except Exception as e:
                logger.error(f"RAG error in contact: {e}")

        # Enhanced contact info
        response = """**Contact Gift of Grace:**

**Address:** #5 Purok 6, Pinsao Pilot Project, Baguio City 2600, Benguet, Philippines

**For Product Orders & Business Inquiries:**
- Visit their official Facebook page: Gift of Grace Food Manufacturing
- Visit in person at their Baguio City location

**For Wholesale/Distribution:**
Contact them directly via Facebook or visit their facility to discuss partnership opportunities.

Products available: Kimchi Gift (₱60), Tofu Gift (₱43), Rice Coffee with Moringa (₱90-170)"""

        dispatcher.utter_message(text=response)
        return []


class ActionCorporateQuery(Action):
    """For general company queries - use RAG first for detailed info"""
    def name(self) -> Text:
        return "action_corporate_query"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        query = tracker.latest_message.get('text', '').lower()
        original_query = tracker.latest_message.get('text', '')
        logger.info(f"Corporate query: {query}")

        # Keywords indicating detailed questions - prioritize RAG
        detailed_keywords = ['how', 'why', 'what is', 'tell me', 'explain', 'describe',
                            'mission', 'vision', 'value', 'goal', 'strategy',
                            'employee', 'staff', 'team', 'work', 'operation',
                            'technology', 'innovation', 'process', 'manufacture',
                            'partner', 'supplier', 'distributor', 'retail',
                            'csr', 'community', 'sustainability', 'environment',
                            'certificate', 'standard', 'quality', 'fda', 'dost']

        # Try RAG first for detailed questions
        if RAG_AVAILABLE and any(k in query for k in detailed_keywords):
            try:
                response = generate_answer(original_query)
                if response and len(response) > 30:
                    dispatcher.utter_message(text=response)
                    return [SlotSet("last_search_time", datetime.now().isoformat())]
            except Exception as e:
                logger.error(f"RAG error: {e}")

        # Fallback to predefined for simple queries
        if any(k in query for k in ['history', 'started', 'founded', 'origin', 'when was']):
            response = "Gift of Grace started in **2015** as a home-based kimchi business by Satur and Janice Cadsi in Baguio City. What began as a small family operation has grown into an award-winning food manufacturing company known for their Kimchi Gift, Tofu Gift, and Rice Coffee with Moringa."
        elif any(k in query for k in ['everything', 'all about', 'overview']):
            # For broad questions, use RAG
            if RAG_AVAILABLE:
                try:
                    response = generate_answer(original_query)
                    if response and len(response) > 30:
                        dispatcher.utter_message(text=response)
                        return [SlotSet("last_search_time", datetime.now().isoformat())]
                except:
                    pass
            response = COMPANY_INFO
        else:
            response = COMPANY_INFO

        dispatcher.utter_message(text=response)
        return [SlotSet("last_search_time", datetime.now().isoformat())]


class ActionFallback(Action):
    """Fallback for low-confidence queries - ALWAYS try RAG first"""
    def name(self) -> Text:
        return "action_fallback"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        query = tracker.latest_message.get('text', '')
        logger.info(f"Fallback triggered for: {query}")

        # ALWAYS try RAG first for any meaningful query
        if RAG_AVAILABLE and len(query) > 3:
            try:
                response = generate_answer(query)
                if response and len(response) > 20:
                    # Check if it's not just a "I don't know" response
                    dont_know_phrases = ["i don't have", "i'm not sure", "i cannot", "outside my"]
                    if not any(phrase in response.lower() for phrase in dont_know_phrases):
                        dispatcher.utter_message(text=response)
                        return []
            except Exception as e:
                logger.error(f"RAG fallback error: {e}")

        # Generic fallback only if RAG couldn't help
        dispatcher.utter_message(
            text="I'm not sure about that specific question. I can help with:\n\n- **Products** - Kimchi Gift (₱60), Tofu Gift (₱43), Rice Coffee\n- **Company info** - History, founders, mission\n- **Awards** - Halal certification, MSME awards\n- **Contact** - Location in Baguio City\n\nWhat would you like to know?"
        )
        return []


class ActionCheckKnowledgeBase(Action):
    def name(self) -> Text:
        return "action_check_knowledge_base"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        if RAG_AVAILABLE:
            try:
                stats = rag_pipeline.get_stats()
                status = f"Knowledge base: {stats.get('total_documents', 0)} documents loaded. LLM: {stats.get('llm_model', 'N/A')}."
                dispatcher.utter_message(text=status)
            except Exception as e:
                dispatcher.utter_message(text=f"Error checking knowledge base: {e}")
        else:
            dispatcher.utter_message(text="Knowledge base is not available.")
        return []


class ActionAddDocument(Action):
    def name(self) -> Text:
        return "action_add_document"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(
            text="To add documents: place PDF files in 'knowledge_base/documents/', run 'python setup_ordinances.py', then restart the server."
        )
        return []


class ActionShowCapabilities(Action):
    def name(self) -> Text:
        return "action_show_capabilities"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text=random.choice(HELP_RESPONSES))
        return []


class ActionRestart(Action):
    def name(self) -> Text:
        return "action_restart"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text="Conversation restarted! What would you like to know about Gift of Grace?")
        return [SlotSet("search_query", None), SlotSet("last_search_time", None)]
