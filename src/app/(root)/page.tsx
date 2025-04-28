import React from "react";
import sampleData from "@/sample-data";
import ProductList from "@/components/shared/product/product-list";

const HomePage = async () => {
  return (
    <>
      <ProductList data={sampleData.products} title="Newest Arrivals" />
    </>
  );
};

export default HomePage;
