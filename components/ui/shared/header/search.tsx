import { getAllCategories } from '@/lib/actions/product.actions';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../../select';
import { SelectValue } from '@radix-ui/react-select';
import { Input } from '../../input';
import { Button } from '../../button';
import { SearchIcon } from 'lucide-react';

const Search = async () => {
  const categories = await getAllCategories();
  return (
    <form action="search" method="GET">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Select name="category">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All"></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="All" value="All">
              All
            </SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.category} value={cat.category}>
                {cat.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          name="q"
          type="text"
          placeholder="Search..."
          className="md:w-[100px] lg:w[300px]"
        ></Input>
        <Button>
          <SearchIcon></SearchIcon>
        </Button>
      </div>
    </form>
  );
};

export default Search;
