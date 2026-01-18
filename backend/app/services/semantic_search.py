from sentence_transformers import SentenceTransformer
from sqlalchemy.orm import Session
from app.database.models import VideoSegment
from sqlalchemy import text


print("Loading Semantic Search Model...")
search_model = SentenceTransformer('all-MiniLM-L6-v2') 
print("✅ Search Model Ready!")

def search_transcript(db: Session, query_text: str, video_id: str = None, limit: int = 5):
    """
    Performs semantic search on video segments.
    """
    try:
        # 1. Convert User Query -> Vector (Numbers)
        query_vector = search_model.encode(query_text).tolist()
        sql_query = db.query(VideoSegment)
        
                # 2. Apply Filters (IF any) <-- DO THIS FIRST
        if video_id:
            sql_query = sql_query.filter(VideoSegment.video_id == video_id)

        # 3. Order by Similarity
        sql_query = sql_query.order_by(
            VideoSegment.embedding.cosine_distance(query_vector)
        )

        # 4. Apply Limit <-- DO THIS LAST
        results = sql_query.limit(limit).all()

      

        # 4. Format Results
        return [
            {
                "text": r.content,
                "start": r.start_time,
                "end": r.end_time,
                "video_id": r.video_id,
                "score": "Match" 
            }
            for r in results
        ]
    except Exception as e:
        print(f"❌ Search Error: {e}")
        return []