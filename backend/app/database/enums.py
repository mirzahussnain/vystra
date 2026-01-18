import enum


class VideoStatus(str, enum.Enum):
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    
class NotificationType(str, enum.Enum):
    INFO = "info"
    SUCCESS = "success"
    ERROR = "error"