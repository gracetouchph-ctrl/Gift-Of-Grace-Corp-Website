# actions.py - CLEAN, CONVERSATIONAL RESPONSES (v2)
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet, SessionStarted, ActionExecuted, EventType
from datetime import datetime
import logging
import os

# Set up logging
logger = logging.getLogger(__name__)

# Import RAG pipeline - CORPORATE VERSION
try:
    # Try relative import first (when running as package)
    from .rag_pipeline import rag_pipeline, generate_answer, retrieve_context
    RAG_AVAILABLE = True
    logger.info("Corporate RAG Pipeline imported successfully via relative import")
except ImportError:
    try:
        # Fallback to direct import (when running standalone)
        from rag_pipeline import rag_pipeline, generate_answer, retrieve_context
        RAG_AVAILABLE = True
        logger.info("Corporate RAG Pipeline imported successfully via direct import")
    except ImportError as e:
        RAG_AVAILABLE = False
        logger.error(f"Failed to import corporate RAG pipeline: {e}")

class ActionSessionStart(Action):
    def name(self) -> Text:
        return "action_session_start"

    async def run(
        self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]
    ) -> List[EventType]:

        events = [SessionStarted()]

        if len(tracker.events) <= 3:
            # Don't auto-greet, let conversation start naturally
            events.append(ActionExecuted("action_listen"))

        return events

class ActionCorporateQuery(Action):
    def name(self) -> Text:
        return "action_corporate_query"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        search_query = tracker.latest_message.get('text', '')
        logger.info(f"Corporate Query: '{search_query}'")

        if not search_query:
            dispatcher.utter_message(text="Please ask a question about Gift of Grace Food Manufacturing Corporation.")
            return []

        logger.info(f"Processing corporate query: {search_query}")

        if not RAG_AVAILABLE:
            dispatcher.utter_message(text="The corporate knowledge base is currently unavailable.")
            return []

        try:
            # Generate answer about the company
            answer = generate_answer(search_query)

            if answer:
                logger.info(f"Corporate Response: {len(answer)} characters")
                dispatcher.utter_message(text=answer)
                logger.info("Corporate response sent")
            else:
                dispatcher.utter_message(
                    text="I couldn't find specific information about that. "
                         "Try asking about Gift of Grace's products, history, founders, awards, or contact information."
                )

        except Exception as e:
            logger.error(f"Error in corporate query: {e}")
            dispatcher.utter_message(
                text="I encountered an error while searching. Please try again with a different question."
            )

        return [SlotSet("last_search_time", datetime.now().isoformat())]

class ActionSearchKnowledge(Action):
    def name(self) -> Text:
        return "action_search_knowledge"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        search_query = tracker.latest_message.get('text', '').lower()
        logger.info(f"ActionSearchKnowledge processing: '{search_query}'")

        # ALL queries go to corporate query now
        logger.info("Redirecting ALL queries to corporate query...")
        return ActionCorporateQuery().run(dispatcher, tracker, domain)

class ActionHandleProducts(Action):
    def name(self) -> Text:
        return "action_handle_products"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        logger.info("Handling products query")
        return ActionCorporateQuery().run(dispatcher, tracker, domain)

class ActionHandleAwards(Action):
    def name(self) -> Text:
        return "action_handle_awards"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        logger.info("Handling awards query")
        return ActionCorporateQuery().run(dispatcher, tracker, domain)

class ActionHandleContact(Action):
    def name(self) -> Text:
        return "action_handle_contact"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        logger.info("Handling contact query")
        return ActionCorporateQuery().run(dispatcher, tracker, domain)

class ActionHandleFounders(Action):
    def name(self) -> Text:
        return "action_handle_founders"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        logger.info("Handling founders query")
        return ActionCorporateQuery().run(dispatcher, tracker, domain)

class ActionCorporateIntro(Action):
    def name(self) -> Text:
        return "action_corporate_intro"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(
            text="Hello! I'm the Gift of Grace assistant. I can help you learn about the company, "
                 "their products like kimchi, tofu, and rice coffee, the founders, awards, and more. "
                 "What would you like to know?"
        )
        return []

class ActionProvideHelp(Action):
    def name(self) -> Text:
        return "action_provide_help"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Route to RAG for conversational response
        if RAG_AVAILABLE:
            return ActionCorporateQuery().run(dispatcher, tracker, domain)

        # Simple fallback without heavy formatting
        dispatcher.utter_message(
            text="I can help you with information about Gift of Grace Food Manufacturing Corporation - "
                 "their products, history, founders, awards, and contact information. What would you like to know?"
        )
        return []

class ActionFallback(Action):
    def name(self) -> Text:
        return "action_fallback"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # All questions go to corporate query for RAG processing
        if RAG_AVAILABLE:
            return ActionCorporateQuery().run(dispatcher, tracker, domain)

        # Simple fallback response
        dispatcher.utter_message(
            text="I can help with questions about Gift of Grace Food Manufacturing Corporation. "
                 "Try asking about their products, history, founders, or contact information."
        )
        return []

class ActionShowCapabilities(Action):
    def name(self) -> Text:
        return "action_show_capabilities"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Route to RAG for conversational response instead of showing big menu
        if RAG_AVAILABLE:
            return ActionCorporateQuery().run(dispatcher, tracker, domain)

        # Simple fallback
        dispatcher.utter_message(
            text="I can help you with information about Gift of Grace Food Manufacturing Corporation - "
                 "their products, history, founders, awards, and contact information. What would you like to know?"
        )
        return []

class ActionCheckKnowledgeBase(Action):
    def name(self) -> Text:
        return "action_check_knowledge_base"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        if RAG_AVAILABLE:
            try:
                stats = rag_pipeline.get_stats()
                status = (
                    f"Knowledge base status: {stats.get('total_documents', 0)} document chunks loaded. "
                    f"Company: {stats.get('company', 'Unknown')}. "
                    f"LLM: {stats.get('llm_model', 'N/A')}."
                )
                dispatcher.utter_message(text=status)
            except Exception as e:
                dispatcher.utter_message(text=f"Error checking knowledge base: {e}")
        else:
            dispatcher.utter_message(text="Knowledge base is not available.")

        return []

class ActionAddDocument(Action):
    def name(self) -> Text:
        return "action_add_document"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(
            text="To add documents: place PDF files in 'knowledge_base/documents/', "
                 "run 'python setup_ordinances.py', then restart the actions server."
        )
        return []

class ActionDebugCorporateResponse(Action):
    def name(self) -> Text:
        return "action_debug_corporate_response"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        if not RAG_AVAILABLE:
            dispatcher.utter_message(text="Corporate RAG system is not available.")
            return []

        try:
            test_query = "Tell me about Gift of Grace Food Manufacturing Corporation"
            response = generate_answer(test_query)
            dispatcher.utter_message(text=f"Test response ({len(response)} chars): {response[:200]}...")
        except Exception as e:
            dispatcher.utter_message(text=f"Debug error: {e}")

        return []

class ActionDebugSystemStatus(Action):
    def name(self) -> Text:
        return "action_debug_system_status"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        if RAG_AVAILABLE:
            try:
                stats = rag_pipeline.get_stats()
                dispatcher.utter_message(
                    text=f"System operational. Documents: {stats.get('total_documents', 0)}. "
                         f"LLM: {stats.get('llm_model', 'N/A')}."
                )
            except Exception as e:
                dispatcher.utter_message(text=f"System error: {e}")
        else:
            dispatcher.utter_message(text="RAG system not available.")

        return []

# Standard response actions
class ActionUtterGoodbye(Action):
    def name(self) -> Text:
        return "utter_goodbye"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Goodbye! Feel free to come back if you have more questions about Gift of Grace.")
        return []

class ActionUtterThankYou(Action):
    def name(self) -> Text:
        return "utter_thankyou"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="You're welcome! Let me know if you have any other questions about Gift of Grace.")
        return []

class ActionUtterIamABot(Action):
    def name(self) -> Text:
        return "utter_iamabot"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="I'm an AI assistant for Gift of Grace Food Manufacturing Corporation.")
        return []

class ActionUtterOutOfScope(Action):
    def name(self) -> Text:
        return "utter_out_of_scope"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(
            text="I specialize in questions about Gift of Grace Food Manufacturing Corporation. "
                 "Ask me about their products, history, or contact information."
        )
        return []

class ActionUtterHelp(Action):
    def name(self) -> Text:
        return "utter_help"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(
            text="I can answer questions about Gift of Grace Food Manufacturing Corporation. "
                 "Try asking about their products, history, awards, or contact information!"
        )
        return []

class ActionUtterDefault(Action):
    def name(self) -> Text:
        return "utter_default"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(
            text="I'm not sure I understand. Ask me questions about Gift of Grace Food Manufacturing Corporation."
        )
        return []

class ActionUtterSearching(Action):
    def name(self) -> Text:
        return "utter_searching"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Searching for information about Gift of Grace...")
        return []

# Additional utility actions
class ActionProcessGreeting(Action):
    def name(self) -> Text:
        return "action_process_greeting"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(
            text="Hello! I'm the Gift of Grace assistant. I can help you learn about their products, "
                 "history, founders, awards, and more. What would you like to know?"
        )
        return []

class ActionRestartConversation(Action):
    def name(self) -> Text:
        return "action_restart_conversation"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(
            text="Conversation restarted! What would you like to know about Gift of Grace?"
        )

        return [
            SlotSet("search_query", None),
            SlotSet("last_search_time", None)
        ]

class ActionTestRAGConnection(Action):
    def name(self) -> Text:
        return "action_test_rag_connection"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        if not RAG_AVAILABLE:
            dispatcher.utter_message(text="RAG system is not available.")
            return []

        try:
            test_query = "What is Gift of Grace Food Manufacturing Corporation?"
            response = generate_answer(test_query)

            if response:
                dispatcher.utter_message(text=f"RAG test successful. Response: {response[:150]}...")
            else:
                dispatcher.utter_message(text="RAG system responded with empty response.")

        except Exception as e:
            dispatcher.utter_message(text=f"RAG test failed: {e}")

        return []

class ActionShowCompanySummary(Action):
    def name(self) -> Text:
        return "action_show_company_summary"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Route to RAG for conversational response
        if RAG_AVAILABLE:
            return ActionCorporateQuery().run(dispatcher, tracker, domain)

        dispatcher.utter_message(
            text="Gift of Grace Food Manufacturing Corporation is a Filipino food company based in Baguio City, "
                 "founded by Satur Cadsi (CEO) and Janice Osenio Cadsi (COO). They make kimchi, tofu, and rice coffee."
        )
        return []
