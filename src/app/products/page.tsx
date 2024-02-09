import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductReel from "@/components/ProductReel";
import { PRODUCT_CATEGORIES } from "@/config";

type param = string | string[] | null;

interface ProductsPageProps {
  searchParams: { [key: string]: param };
}

// use to check if the param coming is an array or a string, so we always have string
const parse = (param: param) => {
  if (typeof param === "string") {
    return param;
  } else {
    return undefined;
  }
};

const page = ({ searchParams }: ProductsPageProps) => {
  const sort = parse(searchParams.sort);
  const category = parse(searchParams.category);

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === category
  )?.label;

  return (
    <MaxWidthWrapper>
      <ProductReel
        title={label ? label : "Browse High Quality Products"}
        query={{
          category,
          limit: 40,
          sort: sort === "desc" || sort === "asc" ? sort : undefined,
        }}
      />
    </MaxWidthWrapper>
  );
};

export default page;
