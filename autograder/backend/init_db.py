"""
Initialize database tables.
"""
import sys
sys.path.insert(0, '/Users/sujitbhattarai/Desktop/Autograder/autograder/backend')

from app.core.database import Base, engine
import app.models  # Import all models


def init_db():
    """Create all database tables."""
    print("🔧 Creating database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
        
        # List all tables created
        print("\n📋 Tables created:")
        for table in Base.metadata.sorted_tables:
            print(f"  - {table.name}")
            
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        raise


if __name__ == "__main__":
    init_db()
