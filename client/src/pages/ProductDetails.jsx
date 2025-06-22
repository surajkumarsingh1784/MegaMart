import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useParams, Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {
    const { Products, Currency, addToCart } = useAppContext();
    const { Category, id } = useParams();
    const navigate = useNavigate();

    const [relatedProducts, setRelatedProducts] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);

    const product = Products?.find((item) => item._id === id);

    useEffect(() => {
        if (Products && Products.length > 0 && product) {
            let productsCopy = Products.filter((item) => product.category === item.category && item._id !== product._id);
            setRelatedProducts(productsCopy.slice(0, 5));
        }
    }, [Products, product]);

    useEffect(() => {
        if (product && Array.isArray(product.images) && product.images.length > 0) {
            setThumbnail(product.images[0]);
        } else {
            setThumbnail(null);
        }
    }, [product]);

    if (!product) return <div className="mt-12 text-center text-xl">Product not found</div>;

    return (
        <div className="mt-12">
            {console.log('product.images:', product.images, 'thumbnail:', thumbnail)}
            <p>
                <Link to={"/"}>Home</Link> /
                <Link to={"/products"}> Products</Link> /
                <Link to={`/products/${product.category.toLowerCase()}`}> {product.category}</Link> /
                <span className="text-primary"> {product.name}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-16 mt-4">
                <div className="flex gap-3">
                  <div className="flex flex-col gap-3">
                    {(Array.isArray(product.images) ? product.images : []).map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setThumbnail(img)}
                        className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer"
                      >
                        <img src={img} alt={`Thumbnail ${idx + 1}`} />
                      </div>
                    ))}
                  </div>
                  <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden flex items-center justify-center" style={{ minWidth: 250, minHeight: 250 }}>
                    <img
                      src={thumbnail && typeof thumbnail === 'string' && thumbnail.trim() !== '' ? thumbnail : '/placeholder.png'}
                      alt={product.name}
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  </div>
                </div>

                <div className="text-sm w-full md:w-1/2">
                    <h1 className="text-3xl font-medium">{product.name}</h1>
                    <div className="flex items-center gap-0.5 mt-1">
                        {Array(5).fill('').map((_, i) => (
                            <img key={i} src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt="" className="md:w-4 w-3.5" />
                        ))}
                        <p className="text-base ml-2">(4)</p>
                    </div>
                    <div className="mt-6">
                        <p className="text-gray-500/70 line-through">MRP: {Currency}{product.price}</p>
                        <p className="text-2xl font-medium">MRP: {Currency}{product.offerPrice}</p>
                        <span className="text-gray-500/70">(inclusive of all taxes)</span>
                    </div>
                    <p className="text-base font-medium mt-6">About Product</p>
                    <ul className="list-disc ml-4 text-gray-500/70">
                        {(Array.isArray(product.description) ? product.description : []).map((desc, index) => (
                            <li key={index}>{desc}</li>
                        ))}
                    </ul>
                    <div className="flex items-center mt-10 gap-4 text-base">
                        <button onClick={() => addToCart(product._id)} className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition" >
                            Add to Cart
                        </button>
                        <button onClick={() => { addToCart(product._id); navigate("/cart") }} className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-dull transition" >
                            Buy now
                        </button>
                    </div>
                </div>
            </div>
            {/* related product */}
            <div className="flex flex-col items-center mt-20">
                <div className="flex flex-col items-center w-max">
                    <p className="text-3xl font-medium">Related Products</p>
                    <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 w-full mt-6">
                    {relatedProducts.filter((product) => product.inStock).map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))}
                </div>
                <button onClick={() => { navigate('/products'); scrollTo(0, 0) }}
                    className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition">
                    See more
                </button>
            </div>
        </div>
    );
};

export default ProductDetails;