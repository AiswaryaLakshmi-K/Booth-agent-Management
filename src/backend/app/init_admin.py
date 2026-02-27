from .db.database import SessionLocal, engine, Base
from .models.user import User, UserRole
from .core.auth import get_password_hash

Base.metadata.create_all(bind=engine)

db = SessionLocal()
admin = db.query(User).filter(User.username == "admin").first()
if not admin:
    admin = User(
        username="admin",
        email="admin@booth.com",
        full_name="System Admin",
        hashed_password=get_password_hash("Admin@123"),
        role=UserRole.ADMIN,
        phone="9999999999",
        is_active=True
    )
    db.add(admin)
    db.commit()
    print("Admin created.")
else:
    print("Admin already exists.")
db.close()