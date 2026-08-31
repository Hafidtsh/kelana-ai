"""
One-time migration script to bring the existing DB schema
up to date with the current SQLAlchemy models.
"""
from database import engine
from sqlalchemy import text

def run():
    with engine.connect() as conn:
        # ── users table ────────────────────────────────────────
        # Make sure id is a proper bigserial primary key
        try:
            conn.execute(text("ALTER TABLE users ADD PRIMARY KEY (id)"))
            print("Added PK to users.id")
        except Exception as e:
            print(f"users PK: {e}")
            conn.rollback()

        # Add password_hash if missing
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)"))
            print("Added users.password_hash")
        except Exception as e:
            print(f"users.password_hash: {e}")
            conn.rollback()

        # Add created_at if missing
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()"))
            print("Added users.created_at")
        except Exception as e:
            print(f"users.created_at: {e}")
            conn.rollback()

        conn.commit()

        # ── trips table ────────────────────────────────────────
        # Add user_id FK
        try:
            conn.execute(text("ALTER TABLE trips ADD COLUMN IF NOT EXISTS user_id BIGINT REFERENCES users(id) ON DELETE SET NULL"))
            print("Added trips.user_id")
        except Exception as e:
            print(f"trips.user_id: {e}")
            conn.rollback()

        # Add created_at
        try:
            conn.execute(text("ALTER TABLE trips ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()"))
            print("Added trips.created_at")
        except Exception as e:
            print(f"trips.created_at: {e}")
            conn.rollback()

        conn.commit()
        print("\nMigration done!")

if __name__ == "__main__":
    run()
