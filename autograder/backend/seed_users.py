"""
Seed script to create initial users for the autograder system.
"""
import sys
sys.path.insert(0, '/Users/sujitbhattarai/Desktop/Autograder/autograder/backend')

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.user import User


def create_initial_users():
    """Create initial users: admin, faculty, and student."""
    db: Session = SessionLocal()
    
    try:
        users_to_create = [
            {
                "name": "Sujit Bhattarai",
                "email": "sujit.bhattarai@student.edu",
                "password": "Student@123",
                "role": "student"
            },
            {
                "name": "Lon Smith",
                "email": "lon.smith@ulm.edu",
                "password": "Faculty@123",
                "role": "faculty"
            },
            {
                "name": "Arturo Rodriguez",
                "email": "arturo.rodriguez@admin.edu",
                "password": "Admin@123",
                "role": "admin"
            }
        ]
        
        created_users = []
        
        for user_data in users_to_create:
            # Check if user already exists
            existing_user = db.query(User).filter(User.email == user_data["email"]).first()
            
            if existing_user:
                print(f"⚠️  User {user_data['name']} ({user_data['email']}) already exists. Skipping...")
                created_users.append({
                    "name": user_data["name"],
                    "email": user_data["email"],
                    "password": user_data["password"],
                    "role": user_data["role"],
                    "status": "already_exists"
                })
            else:
                # Create new user
                new_user = User(
                    name=user_data["name"],
                    email=user_data["email"],
                    password_hash=hash_password(user_data["password"]),
                    role=user_data["role"],
                    is_active=True
                )
                db.add(new_user)
                db.commit()
                db.refresh(new_user)
                
                print(f"✅ Created {user_data['role']}: {user_data['name']} ({user_data['email']})")
                created_users.append({
                    "name": user_data["name"],
                    "email": user_data["email"],
                    "password": user_data["password"],
                    "role": user_data["role"],
                    "status": "created"
                })
        
        print("\n" + "="*60)
        print("USER CREATION SUMMARY")
        print("="*60)
        for user in created_users:
            status_icon = "✅" if user["status"] == "created" else "⚠️"
            print(f"{status_icon} {user['role'].upper()}: {user['name']}")
            print(f"   Email: {user['email']}")
            print(f"   Password: {user['password']}")
            print(f"   Status: {user['status']}")
            print()
        
        return created_users
        
    except Exception as e:
        print(f"❌ Error creating users: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("🔧 Creating initial users for Autograder system...\n")
    create_initial_users()
    print("✨ Done!")
