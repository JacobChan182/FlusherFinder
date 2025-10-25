from alembic import op
import sqlalchemy as sa
from geoalchemy2 import Geography

# revision identifiers, used by Alembic.
revision = "0001_init"
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.execute('CREATE EXTENSION IF NOT EXISTS "pgcrypto";')
    op.execute('CREATE EXTENSION IF NOT EXISTS postgis;')

    op.create_table(
        "washrooms",
        sa.Column("id", sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("name", sa.Text, nullable=False),
        sa.Column("address", sa.Text),
        sa.Column("city", sa.Text),
        sa.Column("is_public", sa.Boolean, server_default="true", nullable=False),
        sa.Column("amenities_json", sa.JSON),
        sa.Column("location", Geography(geometry_type="POINT", srid=4326), nullable=False),
    )
    op.create_index("ix_washrooms_location", "washrooms", ["location"], postgresql_using="gist")

    op.create_table(
        "reviews",
        sa.Column("id", sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("user_id", sa.dialects.postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("washroom_id", sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey("washrooms.id"), nullable=False),
        sa.Column("rating", sa.Integer, nullable=False),
        sa.Column("text", sa.Text),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.UniqueConstraint("user_id", "washroom_id")
    )

    op.create_table(
        "washroom_stats",
        sa.Column("washroom_id", sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey("washrooms.id"), primary_key=True),
        sa.Column("ratings_count", sa.Integer, server_default="0", nullable=False),
        sa.Column("ratings_sum", sa.Integer, server_default="0", nullable=False),
        sa.Column("bayes_score", sa.Float, server_default="0", nullable=False),
        sa.Column("last_review_at", sa.DateTime(timezone=True))
    )

def downgrade():
    op.drop_table("washroom_stats")
    op.drop_table("reviews")
    op.drop_index("ix_washrooms_location", table_name="washrooms")
    op.drop_table("washrooms")
