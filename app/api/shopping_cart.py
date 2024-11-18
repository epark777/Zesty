from flask import Blueprint, jsonify, request
from app.models import ShoppingCart, Product, db

shopping_cart_bp = Blueprint('shopping_cart', __name__, url_prefix='/cart')


@shopping_cart_bp.route('/users/<int:user_id>/products/<int:product_id>', methods=['POST'])
def add_to_cart(user_id, product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404

    existing_item = ShoppingCart.query.filter_by(user_id=user_id, product_id=product_id).first()
    if existing_item:
        return jsonify({"message": "Product already in cart"}), 400

    new_cart_item = ShoppingCart(
        user_id=user_id,
        product_id=product_id
    )
    db.session.add(new_cart_item)
    db.session.commit()

    product_data = {
        "user_id": product.owner_id,
        "product_id": product.id,
        "name": product.name,
        "price": product.price
    }

    return jsonify(product_data), 201


@shopping_cart_bp.route('/users/<int:user_id>', methods=['GET'])
def get_cart(user_id):
    cart_items = ShoppingCart.query.filter_by(user_id=user_id).all()
    if not cart_items:
        return jsonify([]), 200

    cart_products = []
    for cart_item in cart_items:
        product = Product.query.get(cart_item.product_id)
        if product:
            cart_products.append({
                "user_id": product.owner_id,
                "product_id": product.id,
                "name": product.name,
                "price": product.price
            })
        else:
           
            cart_products.append({
                "error": "Product not found"
            })

    return jsonify(cart_products), 200


@shopping_cart_bp.route('/users/<int:user_id>/products/<int:product_id>', methods=['DELETE'])
def remove_from_cart(user_id, product_id):
    cart_item = ShoppingCart.query.filter_by(user_id=user_id, product_id=product_id).first()
    if not cart_item:
        return jsonify({"message": "Item not found in cart"}), 404

    db.session.delete(cart_item)
    db.session.commit()
    return jsonify({"message": "Product removed from cart"}), 200


@shopping_cart_bp.route('/users/<int:user_id>/checkout', methods=['POST'])
def checkout(user_id):
    cart_items = ShoppingCart.query.filter_by(user_id=user_id).all()
    if not cart_items:
        return jsonify({"message": "Cart is empty"}), 400

    try:
       
        for item in cart_items:
            db.session.delete(item)
        db.session.commit()

        return jsonify({"message": "Checkout successful. Thank you for your purchase!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Checkout failed", "error": str(e)}), 500
