import { LATEST_PRODUCTS_LIMIT } from '@/lib/constants';
import ProductList from '../../components/ui/shared/product/product-list';
import { getFeaturedProducts, getLatestProducts } from '@/lib/actions/product.actions';
import ProductCarousel from '@/components/ui/shared/product/product-carousel';
import ViewAllProducts from '@/components/view-all-products';

const HomePage = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();
  return (
    <>
    {featuredProducts.length > 0 && <ProductCarousel data ={featuredProducts}></ProductCarousel>}
      <ProductList
        data={latestProducts}
        title="Newest arrivals"
        limit={LATEST_PRODUCTS_LIMIT}
      />
      <ViewAllProducts></ViewAllProducts>
    </>
  );
};

export default HomePage;
