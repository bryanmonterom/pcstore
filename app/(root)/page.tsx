import { LATEST_PRODUCTS_LIMIT } from '@/lib/constants';
import ProductList from '../../components/ui/shared/product/product-list';
import { getFeaturedProducts, getLatestProducts } from '@/lib/actions/product.actions';
import ProductCarousel from '@/components/ui/shared/product/product-carousel';
import ViewAllProducts from '@/components/view-all-products';
import IconBoxes from '@/components/icon-boxes';
import DealCountDown from '@/components/deal-countdown';

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
      <DealCountDown></DealCountDown>
      <IconBoxes></IconBoxes>
    </>
  );
};

export default HomePage;
