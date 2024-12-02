import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import StarRatingComponent from "../common/star-rating";
import { Separator } from "../ui/separator";
import { useSelector } from "react-redux"; // Importing useSelector to access Redux state

const ProductDetails = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Accessing user info from Redux state
  const { user } = useSelector((state) => state.auth);  // Assuming user information is in auth slice

  // Fetch product details and comments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await fetch(
          `http://localhost:5000/api/products/${productId}/details`
        );
        if (!productResponse.ok) throw new Error("Product not found");
        const productData = await productResponse.json();
        setProduct(productData.product);

        const commentsResponse = await fetch(
          `http://localhost:5000/api/products/${productId}/comments`
        );
        if (!commentsResponse.ok) throw new Error("Failed to load comments");
        const commentsData = await commentsResponse.json();
        setComments(Array.isArray(commentsData.comments) ? commentsData.comments : []);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [productId]);

  const getAuthToken = () => localStorage.getItem("authToken");

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") {
      setError("Please enter a comment.");
      return;
    }

    const token = getAuthToken();

    // Check if both the token and user are available (user info should be in Redux)
    if (!token || !user || !user.userName) {
      setError("You must be logged in to submit a comment.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${productId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: newComment }),
        }
      );

      if (!response.ok) throw new Error("Failed to submit comment");
      const newCommentData = await response.json();
      setComments((prev) => [...prev, newCommentData.comment]);
      setNewComment("");
      toast({ title: "Comment submitted successfully!" });
    } catch (error) {
      setError("There was an error submitting your comment.");
    }
  };

  // Handle rating submission
  const handleRatingSubmit = async () => {
    if (newRating === 0) {
      setError("Please select a rating.");
      return;
    }

    const token = getAuthToken();

    // Check if both the token and user are available (user info should be in Redux)
    if (!token || !user || !user.userName) {
      setError("You must be logged in to submit a rating.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${productId}/rating`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating: newRating }),
        }
      );

      if (!response.ok) throw new Error("Failed to submit rating");
      const updatedProduct = await response.json();
      setProduct(updatedProduct.product);
      setNewRating(0);
      toast({ title: "Rating submitted successfully!" });
    } catch (error) {
      setError("There was an error submitting your rating.");
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={`/product-images/${product.image}`}
          alt={product.name}
          className="aspect-square w-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div>
        <h1 className="text-3xl font-extrabold">{product.name}</h1>
        <p className="text-muted-foreground text-2xl mb-5 mt-4">{product.description}</p>

        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold text-primary">${product.price}</p>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <StarRatingComponent rating={product.rating || 0} />
          <span className="text-muted-foreground">
            {product.rating && !isNaN(product.rating)
              ? `(${Number(product.rating).toFixed(2)})`
              : "(No ratings yet)"}
          </span>
        </div>

        <Separator /> {/* Line separating the sections */}

        {/* Product Additional Info */}
        <div className="mt-5 text-base text-muted-foreground">
          <p><strong>Model:</strong> {product.model}</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Gender:</strong> {product.gender}</p>
          <p><strong>Brand:</strong> {product.brand}</p>
          <p><strong>Stock:</strong> {product.quantityInStock}</p>
        </div>

        {/* Comments Section */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Comments</h2>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="flex gap-4">
                <div>
                  <h3 className="font-bold">{comment.user?.userName || "Anonymous"}</h3>
                  <p>{comment.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          )}

          <form onSubmit={handleCommentSubmit} className="mt-6 space-y-4">
            <Label htmlFor="comment">Write a comment</Label>
            <Input
              name="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
            />
            <Button type="submit">Submit</Button>
          </form>
        </div>

        {/* Rating Section */}
        <div className="mt-10">
          <Label htmlFor="rating">Rate this product</Label>
          <StarRatingComponent
            rating={newRating}
            handleRatingChange={(rating) => setNewRating(rating)}
          />
          <Button
            onClick={handleRatingSubmit}
            disabled={newRating === 0}
            className="mt-4"
          >
            Submit Rating
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
