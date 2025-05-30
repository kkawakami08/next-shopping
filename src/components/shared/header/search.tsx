import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCategories } from "@/lib/actions/product.actions";
import { paths } from "@/lib/constants";
import { SearchIcon } from "lucide-react";
import React from "react";

const Search = async () => {
  const categories = await getAllCategories();

  return (
    <form action={paths.search()} method="GET">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Select name="category">
          <SelectTrigger className="w-[180px] cursor-pointer  ">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key={"All"} value="all" className="cursor-pointer">
              All
            </SelectItem>
            {categories.map((x) => (
              <SelectItem
                key={x.category}
                value={x.category}
                className="cursor-pointer"
              >
                {x.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          name="q"
          type="text"
          placeholder="Search..."
          className="md:w-[100px] lg:[300px] "
        />
        <Button type="submit" className="">
          <SearchIcon />
        </Button>
      </div>
    </form>
  );
};

export default Search;
