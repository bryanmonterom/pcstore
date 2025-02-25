import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ui/shared/product/product-card';
import {
  getAllProducts,
  getAllCategories,
} from '@/lib/actions/product.actions';
import Link from 'next/link';

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    price: string;
    category: string;
    rating: string;
  }>;
}) {
  const {
    q = 'all',
    price = 'all',
    category = 'all',
    rating = 'all',
  } = await props.searchParams;
  
  const isQuerySet = q && q !== 'all' && q.trim() !== '';
  const isCategorySet = category && category !== 'all' && category.trim() !== '';
  const isPriceSet = price && price !== 'all' && price.trim() !== '';
  const isRatingSet = rating && rating !== 'all' && rating.trim() !== '';

  if(isQuerySet || isCategorySet || isPriceSet || isRatingSet){
    return {
      title: `Search ${isQuerySet ? q : ''} ${isCategorySet ? ` Category: ${category}` : ''} ${isPriceSet ? ` Price: ${price}` : ''} ${isRatingSet ? ` Rating: ${rating}` : ''}`
    }
  }

  return { title: 'Search' };
}

const prices = [
  {
    name: '$1 to $50',
    value: '1-50',
  },
  {
    name: '$51 to $100',
    value: '51-100',
  },
  {
    name: '$101 to $200',
    value: '101-200',
  },
  {
    name: '$201 to $500',
    value: '201-500',
  },
  {
    name: '$501 to $1000',
    value: '501-1000',
  },
];

const ratings = [4, 3, 2, 1];

const sortBy = ['newest', 'lowest', 'highest', 'rating'];

const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) => {
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
  } = await props.searchParams;

  //Build filter url
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, rating, sort, page };

    if (c) params.category = c;
    if (s) params.sort = s;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;

    return `/search/?${new URLSearchParams(params).toString()}`;
  };

  const categories = await getAllCategories();

  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page),
  });
  return (
    <div className="grid md:grid-cols-5 md-grap-5">
      <div className="filter-links">
        {/* {Category} */}
        <div className="text-xl mb-2 mt-3">Department</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${
                  category === 'all' || (category === '' && 'font-bold')
                }`}
                href={getFilterUrl({ c: 'all' })}
              >
                Any
              </Link>
            </li>
            {categories.map((x) => (
              <li key={x.category}>
                <Link
                  className={`${x.category === category && 'font-bold'}`}
                  href={getFilterUrl({ c: x.category })}
                >
                  {x.category}{' '}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* {Prices} */}
        <div className="text-xl mb-2 mt-8">Prices</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${
                  price === 'all' || (category === '' && 'font-bold')
                }`}
                href={getFilterUrl({ p: 'all' })}
              >
                Any
              </Link>
            </li>
            {prices.map((x) => (
              <li key={x.name}>
                <Link
                  className={`${x.value === price && 'font-bold'}`}
                  href={getFilterUrl({ p: x.value })}
                >
                  {x.name}{' '}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-xl mb-2 mt-8"> Customer Ratings</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${
                  rating === 'all' || (rating === '' && 'font-bold')
                }`}
                href={getFilterUrl({ r: 'all' })}
              >
                Any
              </Link>
            </li>
            {ratings.map((x) => (
              <li key={x}>
                <Link
                  className={`${x.toString() === rating && 'font-bold'}`}
                  href={getFilterUrl({ r: x.toString() })}
                >
                  {`${x} stars & up`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="md:col-span-4 space-y-4 ">
        <div className="flex-between flex-col-my-4 md:flex-row">
          <div className="flex items-center">
            {q !== 'all' && q !== '' && 'Query: ' + q}
            {category !== 'all' && category !== '' && ' Category: ' + category}
            {price !== 'all' && price !== '' && ' Price: ' + q}
            {rating !== 'all' &&
              rating !== '' &&
              ' Rating : ' + rating + ' stars and up'}
            &nbsp;
            {(q !== 'all' && q !== '') ||
            (category !== 'all' && category !== '') ||
            (price !== 'all' && price !== '') ||
            (rating !== 'all' && rating !== '') ? (
              <Button variant={'link'} asChild>
                <Link href="/search">Clear</Link>
              </Button>
            ) : null}
          </div>
          <div>
            {/* {sort} */}
            Sort by:{' '}
            {sortBy.map((s) => (
              <Link
                key={s}
                className={`mx-2 ${sort === s && 'font-bold'}`}
                href={getFilterUrl({ s })}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.data.length === 0 && <div>No products found</div>}
          {products.data.map((product) => (
            <ProductCard product={product} key={product.id}></ProductCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
