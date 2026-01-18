import enum


class VideoStatus(str, enum.Enum):
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    
    
# Define types for styling (Green vs Red)
class NotificationType(str, enum.Enum):
    INFO = "info"
    SUCCESS = "success"
    ERROR = "error"