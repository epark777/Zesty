from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

class Favorite(db.Model):
    __tablename__ = 'favorites'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    product_id = db.Column(db.BigInteger, db.ForeignKey('products.id'))
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    #relations
    user = db.relationship('User', back_populates='favorites')
    product = db.relationship('Product', back_populates='favorites')

    def to_dict_basic(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "user_id": self.user_id,
        }
    
    def to_dict(self):
        return {
            "product_id": self.product_id,
            "user_id": self.user_id,
        }