"""
Bulk import users into drim_kits from a CSV file.

CSV format (header required):
    user_name,user_email,kit_code,user_type

user_type is optional — defaults to "student" if omitted or blank.

Usage:
    python bulk_import_users.py users.csv
    python bulk_import_users.py users.csv --dry-run
"""

import csv
import sys
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("ERROR: DATABASE_URL not set in .env")
    sys.exit(1)

engine = create_engine(DATABASE_URL)


def import_users(csv_path: str, dry_run: bool = False):
    if not os.path.exists(csv_path):
        print(f"ERROR: File not found: {csv_path}")
        sys.exit(1)

    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    if not rows:
        print("No rows found in CSV.")
        return

    required = {"user_name", "user_email", "kit_code"}
    missing = required - set(rows[0].keys())
    if missing:
        print(f"ERROR: CSV is missing columns: {missing}")
        sys.exit(1)

    users = []
    for row in rows:
        email = row["user_email"].strip().lower()
        name  = row["user_name"].strip()
        code  = row["kit_code"].strip()
        utype = row.get("user_type", "").strip() or "student"

        if not email or not name or not code:
            print(f"  SKIP (empty field): {row}")
            continue

        users.append({"user_name": name, "user_email": email, "kit_code": code, "user_type": utype})
        print(f"  {'[DRY RUN] ' if dry_run else ''}QUEUED: {name} <{email}>  kit_code={code}  type={utype}")

    if not users:
        print("Nothing to insert.")
        return

    if dry_run:
        print(f"\nDry run complete — {len(users)} rows would be inserted.")
        return

    with engine.begin() as conn:
        # Fix sequence in case it's out of sync with existing rows
        conn.execute(text(
            "SELECT setval(pg_get_serial_sequence('drim_kits', 'id'), "
            "COALESCE(MAX(id), 0) + 1, false) FROM drim_kits"
        ))

        # Get existing emails to skip duplicates
        existing = {row[0] for row in conn.execute(text("SELECT user_email FROM drim_kits"))}

        to_insert = [u for u in users if u["user_email"] not in existing]
        skipped   = len(users) - len(to_insert)

        if to_insert:
            conn.execute(
                text("""
                    INSERT INTO drim_kits (user_name, user_email, kit_code, user_type)
                    VALUES (:user_name, :user_email, :kit_code, :user_type)
                """),
                to_insert
            )

    print(f"\nDone — inserted: {len(to_insert)}, skipped (already existed): {skipped}")


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args:
        print("Usage: python bulk_import_users.py <file.csv> [--dry-run]")
        sys.exit(1)

    csv_file = args[0]
    dry = "--dry-run" in args
    import_users(csv_file, dry_run=dry)
