import React from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/api";

interface ProductInfoProps {
  product: Product & {
    name?: string;
    category?: string;
    price?: number;
    oldPrice?: number;
    reviewCount?: number;
    description?: string;
  };
}

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
      <p className="text-sm text-gray-500 mt-1">Category: {product.category}</p>

      <div className="flex items-center mt-4">
        <span className="text-3xl font-bold text-gray-900">${product.price}</span>
        {product.oldPrice && (
          <span className="ml-4 text-lg text-gray-500 line-through">${product.oldPrice}</span>
        )}
      </div>

      <div className="flex items-center mt-4">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-5 h-5 ${index < (product.rating ?? 0) ? "text-yellow-400" : "text-gray-300"}`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-500">({product.reviewCount} reviews)</span>
      </div>

      <p className="mt-4 text-gray-700">{product.description}</p>

      <div className="flex items-center gap-4 mt-6">
        <Button className="bg-blue-600 text-white hover:bg-blue-700">Add to Cart</Button>
        <Button className="bg-green-600 text-white hover:bg-green-700">Buy Now</Button>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-500">Availability: {(product.stock ?? 0) > 0 ? "In Stock" : "Out of Stock"}</p>
      </div>
    </div>
  );
}