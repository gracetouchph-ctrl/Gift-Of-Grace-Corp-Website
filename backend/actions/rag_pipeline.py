# rag_pipeline.py - HUMAN-LIKE CONVERSATIONAL RESPONSES (v4)
# Based on RAG best practices for natural language generation
# Using Google Gemini for LLM responses
import os
import json
import logging
import numpy as np
import faiss
from dotenv import load_dotenv
import torch
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any

load_dotenv()

# Try to import Google Generative AI
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    genai = None

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Improved system prompt following RAG best practices
SYSTEM_PROMPT_TEMPLATE = """You are Grace, a friendly and knowledgeable assistant for Gift of Grace Food Manufacturing Corporation (GoGFMC), a Filipino food company based in Baguio City.

CONVERSATION STYLE:
- Speak naturally like a helpful customer service representative
- Be warm, friendly, and conversational - not robotic or formal
- Keep responses concise (2-4 sentences for simple questions)
- Use simple language, avoid jargon unless asked
- Match the user's energy - casual for casual questions, detailed for detailed questions

RESPONSE RULES:
1. ONLY answer using the provided context below. Do not make up information.
2. If the context doesn't contain the answer, honestly say "I don't have that specific information, but I can help you with questions about our products, company history, founders, awards, or location."
3. For greetings (hello, hi, hey), respond warmly and briefly mention what you can help with.
4. For yes/no questions, start with "Yes" or "No" then briefly explain.
5. Never use markdown formatting like **bold** or bullet points. Write in plain conversational text.
6. Don't repeat the question back to the user.

COMPANY QUICK FACTS (use when relevant):
- Products: Kimchi Gift, Tofu Gift, Rice Coffee with Moringa
- Founders: Satur Cadsi (CEO) and Janice Osenio Cadsi (COO)
- Location: Baguio City, Philippines
- Started: 2015 as home-based business
- Certification: Halal certified

CONTEXT FROM KNOWLEDGE BASE:
{context}

Remember: Be helpful, be human, be brief."""


class CorporateRAGPipeline:
    def __init__(self, vector_db_path: str = "knowledge_base/vector_db"):
        logger.info("Initializing Corporate RAG Pipeline for Gift of Grace...")
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.vector_db_path = vector_db_path
        self.embedder = None
        self.llm_client = None
        self.index = None
        self._documents = []
        self._metadata = []
        self._setup_models()
        self._load_vector_db()

    def _setup_models(self):
        try:
            logger.info("Loading embedding model...")
            self.embedder = SentenceTransformer("all-MiniLM-L6-v2", device=self.device)

            # Setup Gemini LLM client
            logger.info("Setting up Google Gemini client...")
            gemini_key = os.getenv("GEMINI_API_KEY")

            if gemini_key and GEMINI_AVAILABLE:
                genai.configure(api_key=gemini_key)
                self.llm_client = genai.GenerativeModel('gemini-1.5-flash')
                self.llm_type = "gemini"
                logger.info("Google Gemini client initialized (gemini-1.5-flash)")
            else:
                if not GEMINI_AVAILABLE:
                    logger.warning("google-generativeai package not installed. Run: pip install google-generativeai")
                else:
                    logger.warning("Gemini API key not found in environment.")
                self.llm_client = None
                self.llm_type = None

            logger.info("RAG models initialized")
        except Exception as e:
            logger.error(f"Error setting up RAG models: {e}")
            self.llm_client = None
            self.llm_type = None

    def _load_vector_db(self):
        try:
            index_path = os.path.join(self.vector_db_path, "corporate.index")
            documents_path = os.path.join(self.vector_db_path, "corporate_documents.json")
            if not os.path.exists(index_path) or not os.path.exists(documents_path):
                logger.warning("No corporate database found.")
                self._create_empty_index()
                return
            self.index = faiss.read_index(index_path)
            with open(documents_path, 'r', encoding='utf-8') as f:
                self._documents = json.load(f)
            logger.info(f"Corporate RAG loaded with {len(self._documents)} document chunks")
        except Exception as e:
            logger.error(f"Error loading vector DB: {e}")
            self._create_empty_index()

    def _create_empty_index(self):
        if self.embedder:
            dim = self.embedder.get_sentence_embedding_dimension()
            self.index = faiss.IndexFlatL2(dim)
        self._documents = []
        self._metadata = []

    def retrieve(self, query: str, k: int = 5) -> List[Dict[str, Any]]:
        if not self._documents or self.index is None:
            return []
        try:
            query_emb = self.embedder.encode(query)
            D, I = self.index.search(np.array([query_emb]).astype("float32"), k)
            results = []
            for i, idx in enumerate(I[0]):
                if idx < len(self._documents):
                    doc = self._documents[idx]
                    similarity_score = float(1 - D[0][i] / 100.0)
                    results.append({
                        "content": doc["content"],
                        "source": doc["source"],
                        "metadata": doc["metadata"],
                        "similarity_score": similarity_score
                    })
            results.sort(key=lambda x: x["similarity_score"], reverse=True)
            filtered = [r for r in results if r["similarity_score"] > 0.1]
            return filtered if filtered else results[:2]
        except Exception as e:
            logger.error(f"Error in retrieval: {e}")
            return []

    def generate_with_llm(self, query: str, context_docs: List[Dict[str, Any]]) -> str:
        if not self.llm_client:
            return self._generate_fallback(query, context_docs)

        # Format context for the prompt
        if context_docs:
            context_text = "\n\n".join([
                f"[Source: {doc['source']}]\n{doc['content']}"
                for doc in context_docs[:3]
            ])
        else:
            context_text = "No specific context retrieved for this query."

        # Build the full prompt with context
        full_prompt = SYSTEM_PROMPT_TEMPLATE.format(context=context_text) + f"\n\nUser question: {query}"

        try:
            if self.llm_type == "gemini":
                # Use Gemini API
                response = self.llm_client.generate_content(
                    full_prompt,
                    generation_config=genai.types.GenerationConfig(
                        max_output_tokens=500,
                        temperature=0.7
                    )
                )
                return response.text.strip()
            else:
                return self._generate_fallback(query, context_docs)
        except Exception as e:
            logger.error(f"LLM API error: {e}")
            return self._generate_fallback(query, context_docs)

    def _generate_fallback(self, query: str, context_docs: List[Dict[str, Any]]) -> str:
        """Fallback responses when OpenAI is unavailable"""
        query_lower = query.lower().strip()

        # Greetings - warm and brief
        greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'kumusta', 'musta']
        if any(query_lower.startswith(g) or query_lower == g for g in greetings):
            return "Hello! I'm Grace, your Gift of Grace assistant. I can help you with questions about our products, company history, founders, or location. What would you like to know?"

        # Goodbye
        goodbyes = ['bye', 'goodbye', 'see you', 'thanks bye', 'paalam']
        if any(g in query_lower for g in goodbyes):
            return "Goodbye! Feel free to come back anytime you have questions about Gift of Grace."

        # Thank you responses
        if any(t in query_lower for t in ['thank', 'thanks', 'appreciate', 'salamat']):
            return "You're welcome! Let me know if you have any other questions."

        # Bot identity questions - WHO ARE YOU / WHAT ARE YOU
        if self._is_asking_bot_identity(query_lower):
            return self._get_bot_identity_response(query_lower)

        # Bot capabilities questions - WHAT CAN YOU DO
        if self._is_asking_bot_capabilities(query_lower):
            return self._get_bot_capabilities_response()

        # Yes/No questions - answer directly first
        if self._is_yes_no_question(query_lower):
            return self._handle_yes_no(query_lower, context_docs)

        # Topic-specific responses
        if self._is_about_products(query_lower):
            return self._get_products_info(query_lower)
        elif self._is_about_location(query_lower):
            return self._get_location_info()
        elif self._is_about_founders(query_lower):
            return self._get_founders_info()
        elif self._is_about_awards(query_lower):
            return self._get_awards_info()
        elif self._is_about_contact(query_lower):
            return self._get_contact_info()
        elif self._is_about_prices(query_lower):
            return "I don't have current pricing information. For prices, please contact Gift of Grace directly or check their social media pages."
        elif self._is_general_inquiry(query_lower):
            return self._get_company_overview()
        else:
            return self._get_contextual_response(query, context_docs)

    def _is_asking_bot_identity(self, query: str) -> bool:
        """Check if user is asking about the bot's identity"""
        identity_patterns = [
            'who are you', 'what are you', 'what is your name', 'your name',
            'introduce yourself', 'tell me about yourself', 'who am i talking to',
            'are you a bot', 'are you human', 'are you real', 'are you ai',
            'sino ka', 'ano ka'  # Filipino
        ]
        return any(p in query for p in identity_patterns)

    def _get_bot_identity_response(self, query: str) -> str:
        """Return appropriate bot identity response"""
        if 'name' in query:
            return "My name is Grace! I'm the virtual assistant for Gift of Grace Food Manufacturing Corporation. I'm here to help answer your questions about our company and products."
        if 'bot' in query or 'ai' in query or 'human' in query or 'real' in query:
            return "I'm Grace, an AI assistant created to help you learn about Gift of Grace Food Manufacturing Corporation. I'm not a human, but I'm here to help answer your questions about our products, company history, and more!"
        return "I'm Grace, the virtual assistant for Gift of Grace Food Manufacturing Corporation. I'm here to help you with questions about our healthy food products like kimchi, tofu, and rice coffee, as well as our company story and achievements."

    def _is_asking_bot_capabilities(self, query: str) -> bool:
        """Check if user is asking what the bot can do"""
        capability_patterns = [
            'what can you do', 'what do you do', 'how can you help',
            'what are your capabilities', 'what can you help with',
            'what can i ask', 'what questions', 'help me with',
            'list what you can', 'tell me what you can', 'show me what you can',
            'ano pwede mo', 'ano kaya mo'  # Filipino
        ]
        return any(p in query for p in capability_patterns)

    def _get_bot_capabilities_response(self) -> str:
        """Return bot capabilities"""
        return """I can help you with the following:

1. Product Information - Learn about our Kimchi Gift, Tofu Gift, and Rice Coffee with Moringa
2. Company Story - How Gift of Grace started and grew from a home-based business
3. Founders - Information about Satur and Janice Cadsi
4. Awards & Achievements - Our recognitions and Halal certification
5. Location & Contact - Where to find us in Baguio City

Just ask me anything about Gift of Grace and I'll do my best to help!"""

    def _is_yes_no_question(self, query: str) -> bool:
        yes_no_starters = ['can you', 'do you', 'are you', 'is it', 'does', 'will you', 'would you', 'could you', 'is there', 'are there']
        return any(query.startswith(s) for s in yes_no_starters)

    def _handle_yes_no(self, query: str, context_docs: List[Dict[str, Any]]) -> str:
        # Answer yes/no first, then explain briefly
        if 'answer yes or no' in query:
            return "Yes! I can answer yes or no questions. I'm best at answering questions about Gift of Grace though."
        if 'running locally' in query or 'local' in query:
            return "Yes, I'm running locally to help answer your questions about Gift of Grace."
        if 'can you help' in query or 'could you help' in query:
            return "Yes! I'd be happy to help. I can answer questions about Gift of Grace's products, history, founders, awards, and location."
        if 'halal' in query:
            return "Yes, Gift of Grace products are Halal certified."
        if 'deliver' in query or 'delivery' in query:
            return "I don't have specific delivery information. Please contact Gift of Grace directly for delivery options."
        return "I can help with questions about Gift of Grace Food Manufacturing Corporation. What would you like to know?"

    def _is_about_products(self, query: str) -> bool:
        return any(k in query for k in ['product', 'sell', 'make', 'manufacture', 'food', 'kimchi', 'tofu', 'rice coffee', 'offer', 'buy', 'available'])

    def _is_about_location(self, query: str) -> bool:
        return any(k in query for k in ['where', 'location', 'address', 'reside', 'based', 'headquarters', 'baguio', 'situated', 'find you'])

    def _is_about_founders(self, query: str) -> bool:
        return any(k in query for k in ['founder', 'owner', 'ceo', 'coo', 'started', 'establish', 'satur', 'janice', 'cadsi', 'who started', 'who owns'])

    def _is_about_awards(self, query: str) -> bool:
        return any(k in query for k in ['award', 'recognition', 'achievement', 'certificate', 'certification', 'halal', 'won', 'achievements'])

    def _is_about_contact(self, query: str) -> bool:
        return any(k in query for k in ['contact', 'phone', 'email', 'reach', 'call', 'message', 'number'])

    def _is_about_prices(self, query: str) -> bool:
        return any(k in query for k in ['price', 'cost', 'how much', 'pricing', 'rate', 'magkano'])

    def _is_general_inquiry(self, query: str) -> bool:
        return any(k in query for k in ['what is', 'tell me about', 'who is', 'about', 'gift of grace', 'company', 'what do you do', 'who are you'])

    def _get_products_info(self, query: str) -> str:
        if 'kimchi' in query:
            return "Kimchi Gift is our flagship product - a K-Fil Fusion kimchi that blends Korean fermentation techniques with fresh, locally-sourced Filipino vegetables. It's available in various sizes for both home cooking and food businesses."
        if 'tofu' in query:
            return "Tofu Gift is our non-GMO soybean curd product. It comes in multiple textures and is perfect for healthy cooking, vegetarian dishes, and traditional Filipino recipes."
        if 'rice coffee' in query or 'coffee' in query:
            return "Rice Coffee with Moringa is our caffeine-free alternative made from roasted rice grains and moringa. It's a healthy beverage option that's suitable for all ages, including those who want to avoid caffeine."

        return "Gift of Grace makes three main products: Kimchi Gift (our K-Fil Fusion fermented vegetables), Tofu Gift (non-GMO soybean curd), and Rice Coffee with Moringa (caffeine-free beverage). All products are Halal-certified and made in Baguio City."

    def _get_location_info(self) -> str:
        return "Gift of Grace is located in Baguio City, Philippines at #5 Purok 6, Pinsao Pilot Project, Baguio City 2600, Benguet. The cool Baguio climate is perfect for our fermentation processes."

    def _get_founders_info(self) -> str:
        return "Gift of Grace was founded by husband-and-wife team Satur Cadsi (CEO) and Janice Osenio Cadsi (COO). They started the business as a home-based kimchi operation in 2015 and have grown it into an award-winning food manufacturing company."

    def _get_awards_info(self) -> str:
        return "Gift of Grace has won several awards including Presidential Award for Outstanding MSMEs Finalist (2025), the Inspiring Filipina Entrepreneur Award for Janice Cadsi (2025), and Regional Best SETUP Adoptor from DOST-CAR. All our products are also Halal certified."

    def _get_contact_info(self) -> str:
        return "You can find Gift of Grace at #5 Purok 6, Pinsao Pilot Project, Baguio City 2600, Benguet. For the latest contact details, please check their official Facebook page or website."

    def _get_company_overview(self) -> str:
        return "Gift of Grace Food Manufacturing Corporation is a Filipino food company based in Baguio City. Founded by Satur and Janice Cadsi in 2015, we specialize in healthy food products like kimchi, tofu, and rice coffee. We're proud to be an award-winning MSME with Halal certification, committed to quality products and supporting local communities."

    def _get_contextual_response(self, query: str, context_docs: List[Dict[str, Any]]) -> str:
        if not context_docs:
            return "I don't have specific information about that. I can help with questions about Gift of Grace's products (kimchi, tofu, rice coffee), company history, founders, awards, or location. What would you like to know?"

        content = context_docs[0]['content']
        if len(content) > 400:
            content = content[:400] + "..."
        return f"Based on what I know: {content}"

    def generate(self, query: str, context_docs: List[Dict[str, Any]] = None) -> str:
        if context_docs is None:
            context_docs = self.retrieve(query)
        if self.llm_client:
            return self.generate_with_llm(query, context_docs)
        else:
            return self._generate_fallback(query, context_docs)

    def get_stats(self) -> Dict[str, Any]:
        return {
            "total_documents": len(self._documents),
            "has_data": len(self._documents) > 0,
            "company": "Gift of Grace Food Manufacturing Corporation",
            "document_type": "Corporate Report (2025)",
            "embedding_model": "all-MiniLM-L6-v2",
            "llm_model": "gemini-1.5-flash" if self.llm_type == "gemini" else "Fallback mode",
            "llm_available": self.llm_client is not None,
            "llm_type": self.llm_type or "none"
        }

    def generate_answer(self, query: str) -> str:
        return self.generate(query)

    def retrieve_context(self, query: str, k: int = 5) -> List[Dict[str, Any]]:
        return self.retrieve(query, k)


# Global instance
rag_pipeline = CorporateRAGPipeline()

def generate_answer(query: str) -> str:
    return rag_pipeline.generate(query)

def retrieve_context(query: str, k: int = 5) -> List[Dict[str, Any]]:
    return rag_pipeline.retrieve(query, k)

if __name__ == "__main__":
    print("Testing Corporate RAG Pipeline v3")
    stats = rag_pipeline.get_stats()
    for key, value in stats.items():
        print(f"  {key}: {value}")
