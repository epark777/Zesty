from app.models import db, Product, environment, SCHEMA
from sqlalchemy.sql import text

def seed_products():
    product1 = Product(
        owner_id=1, name='Product1', category='Electronics', description='High-quality electronic device', price=299.99, quantity=1, imageUrl="https://westcoastvapesupply.com/cdn/shop/files/GeekBarSkyviewSourAppleIce.jpg?v=1717112784&width=500")
    product2 = Product(
        owner_id=2, name='Product2', category='Home Appliance', description='Reliable home appliance', price=149.99, quantity=1, imageUrl="https://i.ebayimg.com/images/g/E38AAOSwwKdl-oN4/s-l1200.jpg")
    product3 = Product(
        owner_id=3, name='Product3', category='Books', description='Fiction novel by popular author', price=19.99, quantity=1, imageUrl="https://m.media-amazon.com/images/I/91vwDVfhnSL.jpg")

    db.session.add_all([product1, product2, product3])
    db.session.commit()

def undo_products():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.products RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM products"))
    db.session.commit()