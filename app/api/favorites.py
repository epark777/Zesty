from flask import Blueprint, jsonify, request
from app.models import Favorite, Product, db

favorites_bp = Blueprint('favorites', __name__, url_prefix='/favorites')

@favorites_bp.route('/users/<int:user_id>', methods=['POST'])
def add_to_favorites(user_id):
    data = request.get_json()
    
    existing_favorite = Favorite.query.filter_by(user_id=user_id, name=data['name']).first()
    if existing_favorite:
        return jsonify({"message": "Product is already in favorites"}), 400
    
    new_favorite = Favorite(
        user_id=data["owner_id"],
        name=data["name"],
        category=data['category'],
        description=data['description'],
        price=data['price'],
        quantity=data['quantity'],
        imageUrl=data['imageUrl']
        
    )
    
    db.session.add(new_favorite)
    db.session.commit()
    return jsonify({"message": "created", "body": new_favorite.to_dict_basic()}), 201

@favorites_bp.route('/users/<int:user_id>', methods=['GET'])
def get_favorites(user_id):
    favorites = Favorite.query.filter_by(user_id=user_id).all()
    favorite_products = []
    for fav in favorites:
        product = Product.query.get(fav.name)
        if product:
            favorite_products.append({
                "user_id": user_id,
                "name": product.name,
                "category": product.category,
                "description": product.description,
                "price": product.price,
                "quantity": product.quantity
            })
    return jsonify(favorite_products)

@favorites_bp.route('/users/<int:user_id>/<int:favorite_id>', methods=['GET'])
def get_product_favorites(user_id, favorite_id):
    favorites = Favorite.query.filter_by(user_id=user_id, id=favorite_id).all()
    favorite_products = []
    for fav in favorites:
        product = Product.query.get(fav.product_id)
        if product:
            favorite_products.append({
                "user_id": user_id,
                "name": product.name,
                "category": product.category,
                "description": product.description,
                "price": product.price,
                "quantity": product.quantity
            })
    return jsonify(favorite_products)

@favorites_bp.route('/users/<int:user_id>/<int:favorite_id>', methods=['DELETE'])
def remove_from_favorites(user_id, favorite_id):
    favorite = Favorite.query.filter_by(user_id=user_id, id=favorite_id).first()
    if favorite:
        db.session.delete(favorite)
        db.session.commit()
        return jsonify({"message": "deleted"}), 200
    return jsonify({"message": "Product not found in favorites", "favorite": favorite}), 404