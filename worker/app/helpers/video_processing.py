import json
import os

from ..core.config import settings
from ..core.model_loader import groq_client, local_embedder


def generate_transcription(file_path):
    """
    Uses Groq (Whisper V3) for blazing fast, free transcription.
    """
    if not groq_client:
        print("❌ Groq Client not initialized.")
        return None

    try:
        print(f"🎙️ Transcribing {os.path.basename(file_path)} via Groq...")

        with open(file_path, "rb") as file:
            # Groq's Whisper implementation
            completion = groq_client.audio.transcriptions.create(
                file=(os.path.basename(file_path), file),
                model="whisper-large-v3",
                response_format="verbose_json",
            )

        # Groq SDK returns a model that can be converted to a dict
        # or accessed via attributes. To be safe across versions:
        response_dict = (
            completion if isinstance(completion, dict) else completion.model_dump()
        )
        # Map Groq response to  segments format
        segments = [
            {"start": s["start"], "end": s["end"], "text": s["text"].strip()}
            for s in response_dict.get("segments", [])
        ]

        return {"full_text": response_dict.get("text", ""), "segments": segments}

    except Exception as e:
        print(f"❌ Groq Transcription Error: {e}")

        return None


def generate_vector_embeddings(segments: list):
    """
    Generates embeddings using FastEmbed (CPU-optimized).
    """
    if not local_embedder:
        print("⚠️ Embedder not ready.")
        return []

    # Filter out tiny segments (noise)
    valid_segments = [s for s in segments if len(s["text"].strip()) > 5]

    if not valid_segments:
        return []

    # FastEmbed accepts a list of strings
    texts = [s["text"] for s in valid_segments]

    try:
        # returns a generator, convert to list
        embeddings_list = list(local_embedder.embed(texts))

        vectorized_segments = []
        for i, segment in enumerate(valid_segments):
            vectorized_segments.append(
                {
                    "text": segment["text"],
                    "start": segment["start"],
                    "end": segment["end"],
                    "embedding": embeddings_list[
                        i
                    ].tolist(),  # Convert numpy to list for JSON/DB
                }
            )

        return vectorized_segments

    except Exception as e:
        print(f"❌ Embedding Error: {e}")
        return []


def generate_ai_insights(transcript_text: str):
    """
    Uses Groq (Llama 3) to generate summary and action items.
    """
    if not groq_client or not transcript_text:
        return None

    print("🧠 Sending to Llama 3 for analysis...")

    # Strict System Prompt to ensure valid JSON
    system_prompt = """
    You are a Business Intelligence AI. Analyze the transcript.
    Output purely valid JSON with these keys:
    {
        "title": "Professional Title",
        "summary": "3-sentence summary",
        "key_takeaways": ["point 1", "point 2", "point 3"],
        "action_items": ["task 1", "task 2"]
    }
    Do not add Markdown formatting (```json). Just the raw JSON string.
    """

    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {
                    "role": "user",
                    "content": transcript_text[:20000],
                },  # Truncate to fit context window
            ],
            temperature=0.3,  # Lower temperature for consistent JSON
            response_format={"type": "json_object"},  #  Enforces valid JSON
        )

        result_content = completion.choices[0].message.content
        return json.loads(result_content)

    except Exception as e:
        print(f"❌ AI Insight Error: {e}")
        return None
