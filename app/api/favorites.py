# from flask import Blueprint, jsonify, request
# from app.models import Favorite, Product, db

# favorites_bp = Blueprint('favorites', __name__, url_prefix='/favorites')

# @favorites_bp.route('/users/<int:user_id>', methods=['POST'])
# def add_to_favorites(user_id):
#     data = request.get_json()
    
#     if not all(field in data for field in ['user_id', 'id']):
#         return jsonify({"message": "Missing required fields"}), 400
    
#     new_favorite = Favorite(
#         user_id=user_id,
#         product_id=data['id']
#     )
    
#     db.session.add(new_favorite)
#     db.session.commit()
#     return jsonify(new_favorite.to_dict_basic()), 201

# @favorites_bp.route('/users/<int:user_id>', methods=['GET'])
# def get_favorites(user_id):
#     favorites = Favorite.query.filter_by(user_id=user_id).all()
#     favorite_products = []
#     for fav in favorites:
#         product = Product.query.get(fav.product_id)
#         if product:
#             favorite_products.append({
#                 "product_id": product.id,
#             })
#     return jsonify(favorite_products)

# @favorites_bp.route('/users/<int:user_id>/product/<int:product_id>', methods=['DELETE'])
# def remove_from_favorites(user_id, product_id):
#     favorite = Favorite.query.filter_by(user_id=user_id, product_id=product_id).first()
#     if favorite:
#         db.session.delete(favorite)
#         db.session.commit()
#         return jsonify({"message": "Product removed from favorites"}), 200
#     return jsonify({"message": "Product not found in favorites"}), 404

from flask import Blueprint, jsonify, request
from app.models import Favorite, Product, db

favorites_bp = Blueprint('favorites', __name__, url_prefix='/favorites')

@favorites_bp.route('/users/<int:user_id>', methods=['GET'])
def get_favorites(user_id):
    """
    Get all favorites for a specific user.
    """
    favorites = Favorite.query.filter_by(user_id=user_id).all()
    favorite_products = [
        {
            "product_id": fav.product_id,
            "product_name": Product.query.get(fav.product_id).name,
        }
        for fav in favorites if Product.query.get(fav.product_id)
    ]  # Filter out invalid products
    return jsonify(favorite_products), 200


@favorites_bp.route('/users/<int:user_id>', methods=['POST'])
def add_to_favorites(user_id):
    """
    Add a product to a user's favorites.
    Ensures the product exists and prevents duplicate favorites.
    """
    data = request.get_json()
    product_id = data.get('id')

    if not product_id:
        return jsonify({'errors': {'id': 'Missing required field: id'}}), 400

    already_exists = Favorite.query.filter_by(user_id=user_id, product_id=product_id).first()
    if already_exists:
        return jsonify({'errors': {'product_id': 'This product is already in the user\'s favorites!'}}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({'errors': {'product_id': 'This product does not exist!'}}), 404

    new_favorite = Favorite(user_id=user_id, product_id=product_id)
    db.session.add(new_favorite)
    db.session.commit()
    return jsonify(new_favorite.to_dict_basic()), 201


@favorites_bp.route('/users/<int:user_id>/product/<int:product_id>', methods=['DELETE'])
def remove_from_favorites(user_id, product_id):
    """
    Remove a product from a user's favorites.
    Ensures the favorite exists and belongs to the user.
    """
    favorite = Favorite.query.filter_by(user_id=user_id, product_id=product_id).first()
    if not favorite:
        return jsonify({'errors': {'product_id': 'This favorite does not exist!'}}), 404

    db.session.delete(favorite)
    db.session.commit()
    return jsonify({'message': 'Successfully removed from favorites', 'removed_product_id': product_id}), 200
