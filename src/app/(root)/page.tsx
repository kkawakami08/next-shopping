import React from "react";
import ProductList from "@/components/shared/product/product-list";
import {
  getLatestProducts,
  getFeaturedProducts,
} from "@/lib/actions/product.actions";
import ProductCarousel from "@/components/shared/product/product-carousel";
import ViewAllProductsButton from "@/components/view-all-products-btn";
import IconBoxes from "@/components/icon-boxes";
import DealCountdown from "@/components/deal-countdown";

const HomePage = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();
  return (
    <div className="max-w-6xl mx-auto">
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      <ProductList data={latestProducts} title="Newest Arrivals" />
      <ViewAllProductsButton />
      <DealCountdown />
      <IconBoxes />
    </div>
  );
};

export default HomePage;
