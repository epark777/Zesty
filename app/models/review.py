from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

class Review(db.Model):
    __tablename__ = 'reviews'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    review = db.Column(db.Text)
    rating = db.Column(db.BigInteger, nullable=False)
    product_id = db.Column(db.BigInteger, db.ForeignKey(add_prefix_for_prod('products.id')), nullable=False)
    user_id = db.Column(db.BigInteger, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    product = db.relationship('Product', back_populates='reviews')
    user = db.relationship('User', back_populates='reviews')

    def to_dict_basic(self):
        return {
            "id": self.id,
            "review": self.review,
            "rating": self.rating,
            "product_id": self.product_id,
            "user_id": self.user_id,
            "createdAt": self.created_at,
            "updatedAt": self.updated_at
        }
    
    def to_dict(self):
        return {
            "id": self.id,
            "review": self.review,
            "rating": self.rating,
            "product_id": self.product_id,
            "user_id": self.user_id,
            "User": {
                "id": self.user_id,
                "username": self.user.username
            },
            "createdAt": self.created_at,
            "updatedAt": self.updated_at
        }
    