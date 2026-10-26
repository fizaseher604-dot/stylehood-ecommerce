import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { toast } from "react-toastify";

const Product = () => {
  const { productId } = useParams();
  const { products, productsLoading, currency, addToCart, navigate } =
    useContext(ShopContext);

  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);

  const productData =
    products.find((item) => String(item._id) === String(productId)) || null;

  const productImages = Array.isArray(productData?.Image)
    ? productData.Image
    : [];

  const productSizes = Array.isArray(productData?.Sizes)
    ? productData.Sizes
    : [];

  // Stock checking
  const stock = Math.max(0, Number(productData?.stock) || 0);
  const isOutOfStock = stock <= 0;
  const maxQuantity = stock;

  // Reset selections when product changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setImage("");
    setSize("");
    setQuantity(1);
    setWishlist(false);
  }, [productId]);

  // Keep quantity within available stock
  useEffect(() => {
    if (productData) {
      setQuantity((previousQuantity) => {
        if (stock <= 0) return 1;
        return Math.min(Math.max(previousQuantity, 1), maxQuantity);
      });
    }
  }, [productId, stock, maxQuantity, productData]);

  // Add to cart
  const handleAddToCart = () => {
    if (!productData) {
      toast.error("Product is still loading");
      return;
    }

    if (isOutOfStock) {
      toast.error("Sorry, this product is out of stock");
      return;
    }

    if (!size) {
      toast.error("Please select a size first");
      return;
    }

    if (quantity > stock) {
      toast.error(`Only ${stock} items are available`);
      setQuantity(maxQuantity);
      return;
    }

    addToCart(productData._id, size, quantity);
  };

  // Buy now
  const handleBuyNow = () => {
    if (!productData) {
      toast.error("Product is still loading");
      return;
    }

    if (isOutOfStock) {
      toast.error("Sorry, this product is out of stock");
      return;
    }

    if (!size) {
      toast.error("Please select a size first");
      return;
    }

    if (quantity > stock) {
      toast.error(`Only ${stock} items are available`);
      setQuantity(maxQuantity);
      return;
    }

    const buyNowProduct = {
      ...productData,
      productId: productData._id,
      size,
      selectedSize: size,
      quantity: Number(quantity),
    };

    sessionStorage.setItem("stylehoodBuyNow", JSON.stringify(buyNowProduct));

    navigate("/place-order");
  };

  // Increase quantity
  const increaseQuantity = () => {
    if (isOutOfStock) return;

    setQuantity((previousQuantity) =>
      Math.min(previousQuantity + 1, maxQuantity),
    );
  };

  // Decrease quantity
  const decreaseQuantity = () => {
    setQuantity((previousQuantity) => Math.max(previousQuantity - 1, 1));
  };

  // Wishlist
  const handleWishlist = () => {
    setWishlist((previousWishlist) => {
      const updatedWishlist = !previousWishlist;

      if (updatedWishlist) {
        toast.success("Added to wishlist");
      } else {
        toast.info("Removed from wishlist");
      }

      return updatedWishlist;
    });
  };

  // Share product
  const handleShare = async () => {
    if (!productData) return;

    const productUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: productData.name,
          text: `Check out ${productData.name} on Stylehood`,
          url: productUrl,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Share Error:", error);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(productUrl);
        toast.success("Product link copied");
      } catch {
        toast.error("Unable to copy product link");
      }
    }
  };

  // Loading state
  if (productsLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-[#64748B]">Loading product...</p>
      </div>
    );
  }

  // Product not found
  if (!productData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-semibold text-[#0F172A]">
          Product not found.
        </p>

        <button
          onClick={() => navigate("/collection")}
          className="bg-[#F97316] text-white px-6 py-3 rounded-lg hover:bg-[#0F172A] transition-colors"
        >
          Back to Collection
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 lg:px-12 pt-8 sm:pt-12">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
        {/* Product Images */}
        <div className="w-full lg:w-[55%] flex flex-col-reverse sm:flex-row gap-4">
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-[90px]">
            {productImages.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setImage(item)}
                aria-label={`View product image ${index + 1}`}
                className={`w-[75px] sm:w-[80px] h-[90px] sm:h-[95px] flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                  (image || productImages[0]) === item
                    ? "border-[#F97316] shadow-md"
                    : "border-[#E2E8F0] hover:border-[#F97316]"
                }`}
              >
                <img
                  src={item}
                  alt={`${productData.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-hidden rounded-2xl bg-[#F8FAFC] relative">
            {!isOutOfStock && (
              <div className="absolute top-4 left-4 z-10 bg-[#F97316] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-md">
                NEW
              </div>
            )}

            <button
              type="button"
              onClick={handleWishlist}
              aria-label={wishlist ? "Remove from wishlist" : "Add to wishlist"}
              className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center text-xl hover:scale-110 transition-all duration-300"
            >
              <span className={wishlist ? "text-[#F97316]" : "text-[#64748B]"}>
                {wishlist ? "♥" : "♡"}
              </span>
            </button>

            {isOutOfStock && (
              <div className="absolute inset-0 z-[5] bg-white/40 flex items-center justify-center pointer-events-none">
                <span className="bg-[#0F172A] text-white px-6 py-3 rounded-lg text-sm sm:text-base font-bold tracking-widest shadow-lg">
                  OUT OF STOCK
                </span>
              </div>
            )}

            <img
              src={image || productImages[0] || ""}
              alt={productData.name}
              className={`w-full h-auto object-cover transition-transform duration-500 hover:scale-[1.03] ${
                isOutOfStock ? "opacity-60" : ""
              }`}
            />
          </div>
        </div>

        {/* Product Information */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center">
          <p className="text-[#F97316] text-sm font-semibold tracking-[2px] uppercase mb-3">
            Stylehood Collection
          </p>

          <h1 className="text-3xl sm:text-4xl font-semibold text-[#0F172A] leading-tight">
            {productData.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-5">
            <img src={assets.star_icon} alt="" className="w-4 h-4" />
            <img src={assets.star_icon} alt="" className="w-4 h-4" />
            <img src={assets.star_icon} alt="" className="w-4 h-4" />
            <img src={assets.star_icon} alt="" className="w-4 h-4" />
            <img src={assets.star_dull_icon} alt="" className="w-4 h-4" />

            <span className="ml-2 text-sm text-[#64748B]">
              4.5 (122 Reviews)
            </span>
          </div>

          {/* Price */}
          <div className="mt-7">
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-3xl font-bold text-[#0F172A]">
                {currency}
                {productData.price}
              </p>

              <span className="text-sm text-[#64748B] line-through">
                {currency}
                {Math.round(Number(productData.price) * 1.15)}
              </span>

              <span className="bg-orange-100 text-[#F97316] text-xs font-semibold px-3 py-1 rounded-full">
                15% OFF
              </span>
            </div>

            <p className="text-sm text-[#64748B] mt-2">
              Inclusive of all taxes
            </p>
          </div>

          {/* Availability */}
          <div
            className={`flex items-center gap-2 mt-5 rounded-lg px-3 py-3 border ${
              isOutOfStock
                ? "bg-red-50 border-red-200"
                : "bg-green-50 border-green-200"
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isOutOfStock ? "bg-red-500" : "bg-green-500"
              }`}
            />

            <p
              className={`text-sm font-semibold ${
                isOutOfStock ? "text-red-600" : "text-green-700"
              }`}
            >
              {isOutOfStock ? "OUT OF STOCK" : "In Stock"}
            </p>

            {!isOutOfStock && (
              <span className="text-sm text-[#64748B]">
                • {stock} available
              </span>
            )}
          </div>

          {/* Description */}
          <p className="mt-7 text-[#64748B] leading-7 text-sm sm:text-base max-w-xl">
            {productData.description}
          </p>

          {/* Size Selection */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-[#0F172A]">Select Size</p>

              <p className="text-xs text-[#64748B]">Choose your perfect fit</p>
            </div>

            <div className="flex gap-3 flex-wrap">
              {productSizes.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => setSize(item)}
                  className={`min-w-[58px] h-[48px] rounded-lg border text-sm font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${
                    item === size
                      ? "bg-[#0F172A] border-[#0F172A] text-white"
                      : "bg-white border-[#CBD5E1] text-[#0F172A] hover:border-[#F97316] hover:text-[#F97316]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-7">
            <p className="font-semibold text-[#0F172A] mb-4">Quantity</p>

            <div className="flex items-center w-fit border border-[#CBD5E1] rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={isOutOfStock || quantity <= 1}
                className="w-12 h-12 flex items-center justify-center text-xl text-[#0F172A] hover:bg-[#F8FAFC] transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span className="w-14 h-12 flex items-center justify-center border-x border-[#CBD5E1] text-sm font-semibold text-[#0F172A]">
                {quantity}
              </span>

              <button
                type="button"
                onClick={increaseQuantity}
                disabled={isOutOfStock || quantity >= maxQuantity}
                className="w-12 h-12 flex items-center justify-center text-xl text-[#0F172A] hover:bg-[#F8FAFC] transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {!isOutOfStock && (
              <p className="text-xs text-[#64748B] mt-2">
                Maximum {stock} {stock === 1 ? "item" : "items"} available.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex-1 bg-white border-2 border-[#F97316] text-[#F97316] py-4 rounded-lg text-sm font-semibold tracking-wide hover:bg-orange-50 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
            >
              {isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="flex-1 bg-[#F97316] text-white py-4 rounded-lg text-sm font-semibold tracking-wide hover:bg-[#0F172A] transition-all duration-300 shadow-md hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#F97316]"
            >
              {isOutOfStock ? "OUT OF STOCK" : "BUY NOW"}
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="sm:w-[55px] h-[55px] border border-[#E2E8F0] rounded-lg text-[#0F172A] hover:border-[#F97316] hover:text-[#F97316] transition-all duration-300 flex items-center justify-center text-xl"
              title="Share Product"
              aria-label="Share product"
            >
              ↗
            </button>
          </div>

          {/* Delivery Information */}
          <div className="mt-9 pt-6 border-t border-[#E2E8F0]">
            <div className="flex flex-col gap-4 text-sm text-[#64748B]">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center">
                  🚚
                </span>

                <div>
                  <p className="font-medium text-[#0F172A]">Fast Delivery</p>

                  <p className="text-xs">Delivered safely to your doorstep</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center">
                  💳
                </span>

                <div>
                  <p className="font-medium text-[#0F172A]">Cash on Delivery</p>

                  <p className="text-xs">Pay when your order arrives</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center">
                  🔄
                </span>

                <div>
                  <p className="font-medium text-[#0F172A]">
                    Easy 7 Days Return
                  </p>

                  <p className="text-xs">Simple return and exchange policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-20 sm:mt-24">
        <div className="flex">
          <button
            type="button"
            className="px-6 py-3 bg-[#0F172A] text-white text-sm font-medium rounded-tl-lg"
          >
            Product Details
          </button>

          <button
            type="button"
            className="px-6 py-3 bg-[#F8FAFC] text-[#64748B] border border-[#E2E8E8] text-sm font-medium rounded-tr-lg"
          >
            Reviews (122)
          </button>
        </div>

        <div className="border border-[#E2E8E8] rounded-b-lg p-6 sm:p-8 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            <div className="flex justify-between border-b border-[#E2E8E8] pb-4">
              <span className="text-sm text-[#64748B]">Category</span>

              <span className="text-sm font-medium text-[#0F172A]">
                {productData.category}
              </span>
            </div>

            <div className="flex justify-between border-b border-[#E2E8E8] pb-4">
              <span className="text-sm text-[#64748B]">Sub Category</span>

              <span className="text-sm font-medium text-[#0F172A]">
                {productData.subCategory}
              </span>
            </div>

            <div className="flex justify-between border-b border-[#E2E8E8] pb-4">
              <span className="text-sm text-[#64748B]">Available Sizes</span>

              <span className="text-sm font-medium text-[#0F172A]">
                {productSizes.join(", ")}
              </span>
            </div>

            <div className="flex justify-between border-b border-[#E2E8E8] pb-4">
              <span className="text-sm text-[#64748B]">Availability</span>

              <span
                className={`text-sm font-semibold ${
                  isOutOfStock ? "text-red-600" : "text-green-600"
                }`}
              >
                {isOutOfStock
                  ? "OUT OF STOCK"
                  : `In Stock (${stock} available)`}
              </span>
            </div>
          </div>

          <div className="max-w-5xl flex flex-col gap-5 text-sm text-[#64748B] leading-7">
            <p>{productData.description}</p>

            <p>
              Stylehood brings together modern fashion, quality fabrics and
              everyday comfort for Men, Women and Kids. Every piece is selected
              to give you a stylish and comfortable look for different
              occasions.
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </div>
    </div>
  );
};

export default Product;
