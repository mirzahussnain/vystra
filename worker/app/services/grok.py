import json

from app.core.config import settings
from groq import Groq

# Initialize Groq Client
client = Groq(api_key=settings.GROQ_API_KEY)


def generate_summary(transcript_text: str):
    """
    Sends transcript to Llama3 on Groq to get Action Items & Summary.
    """
    if not transcript_text:
        return None

    print("🧠 Sending to Llama3 for analysis...")

    system_prompt = """
        You are an expert AI Business Analyst.
        Analyze the provided video transcript.

        Return a valid JSON object with the following keys:
        1. "title": A professional, concise title.
        2. "summary": A 3-sentence executive summary.
        3. "key_takeaways": An array of 3-5 distinct bullet points (strings).
        4. "action_items": An array of tasks (strings).

        Return ONLY the raw JSON string. No markdown.
        """

    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",  # Fast & Free
            messages=[
                {"role": "system", "content": system_prompt},
                {
                    "role": "user",
                    "content": transcript_text[:15000],
                },  # Limit length for safety
            ],
            temperature=0.5,
            response_format={"type": "json_object"},  # Forces JSON
        )

        # Parse result
        result_json = json.loads(completion.choices[0].message.content)
        return result_json

    except Exception as e:
        print(f"❌ AI Error: {e}")
        return None
