import React, { useState } from "react";
import { Product } from "@/lib/api";

interface Specification {
  name: string;
  value: string;
}

interface ProductWithSpecs extends Product {
  description?: string;
  reviewCount?: number;
  specifications?: Specification[];
}

export default function ProductDetailsTabs({ product }: { product: ProductWithSpecs }) {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="mt-8">
      <div className="flex border-b">
        {[
          { id: "description", label: "Description" },
          { id: "reviews", label: `Reviews (${product.reviewCount ?? 0})` },
          { id: "specifications", label: "Specifications" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab.id
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {activeTab === "description" && <p>{product.description ?? product.proDesc}</p>}
        {activeTab === "reviews" && (
          <div>
            <h3 className="text-lg font-bold">Customer Reviews</h3>
            {/* Render reviews here */}
          </div>
        )}
        {activeTab === "specifications" && (
          <table className="w-full text-sm text-left text-gray-500">
            <tbody>
              {(product.specifications ?? []).map((spec: Specification, index: number) => (
                <tr key={index} className="border-b">
                  <th className="px-4 py-2 font-medium text-gray-700">{spec.name}</th>
                  <td className="px-4 py-2">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}