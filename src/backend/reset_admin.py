from app.db.database import SessionLocal
from app.models.user import User
from app.core.auth import get_password_hash

db = SessionLocal()
admin = db.query(User).filter(User.username == "admin").first()
if admin:
    admin.hashed_password = get_password_hash("Admin123")
    db.commit()
    print("✅ Admin password reset to Admin123")
else:
    print("❌ Admin user not found")
db.close()