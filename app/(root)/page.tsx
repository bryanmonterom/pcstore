import sampleData from "@/db/sample-data";
import ProductList from '../../components/ui/shared/product/product-list';

const HomePage = () => {
  return ( <><ProductList data={sampleData.products} title="Newest arrivals"/></> );
}
 
export default HomePage;