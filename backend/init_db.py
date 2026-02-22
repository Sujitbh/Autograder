"""
Initialize database tables.
"""
import sys
sys.path.insert(0, '/Users/sujitbhattarai/Desktop/Autograder/autograder/backend')

from sqlalchemy import text
from app.core.database import Base, engine
import app.models  # Import all models


def init_db():
    """Create all database tables."""
    print("🔧 Creating database tables...")
    print(f"📍 Database URL: {engine.url}")
    
    try:
        # Test connection first
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"✅ Database connected: {version[:50]}...")
        
        # Create all tables
        print("\n🔨 Creating tables...")
        print(f"Models to create: {list(Base.metadata.tables.keys())}")
        
        # Force recreation
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
        
        # Verify tables were created
        with engine.connect() as conn:
            result = conn.execute(text(
                "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename"
            ))
            tables =  [row[0] for row in result.fetchall()]
            if tables:
                print("\n📋 Tables in database:")
                for table in tables:
                    print(f"  - {table}")
            else:
                print("\n⚠️  No tables found in database!")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        raise


if __name__ == "__main__":
    init_db()
