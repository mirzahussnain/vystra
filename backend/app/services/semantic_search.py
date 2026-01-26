from fastembed import TextEmbedding
from sqlalchemy import text
from sqlalchemy.orm import Session

from ..database.models import User, Video, VideoSegment

print("Loading Semantic Search Model...")
search_model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")
print("✅ Search Model Ready!")

def search_transcript(
    db: Session, query_text: str, user: User, video_id: str = None, limit: int = 5
):
    """
    Performs semantic search on video segments.
    """
    try:
        # 1. Convert User Query -> Vector
        query_vector = list(search_model.embed([query_text]))[0].tolist()

        # Query BOTH VideoSegment and Video to access video.title later
        sql_query = db.query(VideoSegment, Video).join(Video)

        # 2. Security Filter 
        sql_query = sql_query.filter(Video.user_id == user.id)

        # 3. Optional Video Filter
        if video_id:
            sql_query = sql_query.filter(VideoSegment.video_id == video_id)

        # 4. Execute Search
        results = (
            sql_query.order_by(VideoSegment.embedding.cosine_distance(query_vector))
            .limit(limit)
            .all()
        )
    
        # 5. Billing
        user.used_ai_actions += 1
        db.commit()

        # 6. Format Results
        
        match_data = {
            "query": query_text,
            "results": [],
            "remaining_credits": user.max_ai_actions - user.used_ai_actions
        }

        # Now this loop works because we queried (VideoSegment, Video)
        for segment, video in results:
            match_data["results"].append({
                "video_id": video.id,
                "video_title": video.title,
                "text": segment.content,
                "start": segment.start_time,
                "end": segment.end_time,
                "score": "Match" 
            })
        
        return match_data

    except Exception as e:
        print(f"❌ Search Error: {e}")
        db.rollback() 
        return {"results": [], "error": str(e)} 