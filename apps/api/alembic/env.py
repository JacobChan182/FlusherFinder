from alembic import context
from sqlalchemy import engine_from_config, pool
# --- make 'src' importable when running Alembic ---
import os, sys
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))  # /apps/api
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)
# --------------------------------------------------

from src.db import Base

# Optional: your include_object function, keep if already added
def include_object(object, name, type_, reflected, compare_to):
    if name == "spatial_ref_sys":
        return False
    return True

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = context.get_x_argument(as_dictionary=True).get("url") or context.get_main_option("sqlalchemy.url")
    if not url:
        url = os.getenv("DATABASE_URL")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        include_object=include_object,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        context.config.get_section(context.config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            include_object=include_object,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
