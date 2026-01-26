from .config import settings
from fastembed import TextEmbedding
from groq import Groq

print("🧠 Loading Local AIModels... this might take a minute...")
try:
    local_embedder = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")
    print("✅ Search Model Ready!")
except Exception as e:
    print(f"❌ Error loading search model: {e}")
    local_embedder = None
print("Loading Groq AI Clent..")
groq_client = Groq(api_key=settings.GROQ_API_KEY)
if(groq_client):
    print("✅ Groq AI Client Loaded!")
