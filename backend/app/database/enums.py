import enum
from termios import PENDIN


class VideoStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    
class NotificationType(str, enum.Enum):
    INFO = "info"
    SUCCESS = "success"
    ERROR = "error"
    
class UserStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    
class UserRole(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"
    GUEST = "guest"
    
class PlanType(str, enum.Enum):
    FREE = "free"
    PRO = "pro"
    ENTERPRISE = "enterprise"
    TRIAL = "trial"
