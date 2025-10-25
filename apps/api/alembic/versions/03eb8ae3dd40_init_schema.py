"""init schema

Revision ID: <PUT-NEW-ID-HERE>
Revises: None
Create Date: 2025-10-25
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from geoalchemy2.types import Geography


# revision identifiers, used by Alembic.
revision = "03eb8ae3dd40"   # keep in sync with filename
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Ensure PostGIS exists (safe if already installed)
    op.execute("CREATE EXTENSION IF NOT EXISTS postgis;")

    # users
    op.create_table(
        "users",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("email", sa.String(length=320), nullable=False, unique=True, index=True),
        sa.Column("display_name", sa.String(length=120), nullable=True),
        sa.Column("hashed_password", sa.String(length=256), nullable=False),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    # amenities (code as PK; adjust if your model differs)
    op.create_table(
        "amenities",
        sa.Column("code", sa.String(length=50), primary_key=True),
        sa.Column("label", sa.String(length=100), nullable=False),
    )
    op.create_index("ix_amenities_code", "amenities", ["code"], unique=True)

    # washrooms
    op.create_table(
        "washrooms",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("address", sa.String(length=300), nullable=True),
        # Geography(POINT,4326)
        sa.Column("location", Geography(geometry_type="POINT", srid=4326, spatial_index=True), nullable=False),
        sa.Column("city", sa.String(length=100), nullable=True),
        sa.Column("is_public", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("price", sa.String(length=50), nullable=True),
        sa.Column("created_by", sa.String(), sa.ForeignKey("users.id", ondelete=None), nullable=True),
    )
    # GIST index for geography column
    op.create_index("idx_washrooms_location", "washrooms", ["location"], postgresql_using="gist")

    # reviews
    op.create_table(
        "reviews",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("washroom_id", sa.String(), sa.ForeignKey("washrooms.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", sa.String(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("rating", sa.Integer(), nullable=False),
        sa.Column("comment", sa.Text(), nullable=True),
        sa.Column("photos", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    )

    # many-to-many join table washroom_amenities
    op.create_table(
        "washroom_amenities",
        sa.Column("washroom_id", sa.String(), sa.ForeignKey("washrooms.id", ondelete="CASCADE"), primary_key=True, nullable=False),
        sa.Column("amenity_code", sa.String(length=50), sa.ForeignKey("amenities.code", ondelete="CASCADE"), primary_key=True, nullable=False),
    )


def downgrade() -> None:
    op.drop_table("washroom_amenities")
    op.drop_table("reviews")
    op.drop_index("idx_washrooms_location", table_name="washrooms")
    op.drop_table("washrooms")
    op.drop_index("ix_amenities_code", table_name="amenities")
    op.drop_table("amenities")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
    # Do not drop PostGIS extension; other DB objects may depend on it.
