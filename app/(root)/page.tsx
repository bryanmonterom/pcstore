import { LATEST_PRODUCTS_LIMIT } from '@/lib/constants';
import ProductList from '../../components/ui/shared/product/product-list';
import { getLatestProducts } from '@/lib/actions/product-actions';

const HomePage = async () => {
  const latestProducts = await getLatestProducts();
  return (
    <>
      <ProductList data={latestProducts} title="Newest arrivals" limit={LATEST_PRODUCTS_LIMIT}/>
    </>
  );
};

export default HomePage;
