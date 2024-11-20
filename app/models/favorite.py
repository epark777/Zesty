from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

class Favorite(db.Model):
    __tablename__ = 'favorites'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.BigInteger, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    name = db.Column(db.Text, nullable=False)
    category = db.Column(db.Text, nullable=True)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.BigInteger, nullable=True)
    quantity = db.Column(db.BigInteger, nullable=True)
    imageUrl = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    user = db.relationship('User', back_populates='favorites')

    def to_dict_basic(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "category": self.category,
            "description": self.description,
            "price": self.price,
            "quantity": self.quantity,
            "imageUrl": self.imageUrl,
            "createdAt": self.created_at,
            "updatedAt": self.updated_at
        }
    
    def to_dict(self):
        return {
        "id": self.id,
        "user_id": self.user_id,
        "name": self.name,
        "category": self.category,
        "description": self.description,
        "price": self.price,
        "quantity": self.quantity,
        "imageUrl": self.imageUrl,
        "createdAt": self.created_at,
        "updatedAt": self.updated_at
    }
