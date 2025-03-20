import useGetCategories from "@/hooks/queries/useGetCategories";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ReducedItem {
  parentCategory: string;
  totalSales: number;
}

function DashboardCategoryCard() {
  const { data, isLoading } = useGetCategories();

  const reducedItems: Record<string, number> | undefined = data?.reduce(
    (map, item) => {
      // Assuming each item has a property named "sales"
      const sales = item.totalSales;

      if (map[item.parentCategory]) {
        // If the category already exists in the map, add the sales
        map[item.parentCategory] += sales;
      } else {
        // If the category doesn't exist in the map, initialize it with the sales
        map[item.parentCategory] = sales;
      }

      return map;
    },
    {}
  );

  // Convert the reducedItems object into an array of ReducedItem objects
  const itemsArray: ReducedItem[] | undefined = reducedItems
    ? Object.entries(reducedItems).map(([parentCategory, totalSales]) => ({
        parentCategory,
        totalSales,
      }))
    : undefined;

  // Sort the itemsArray based on totalSales in descending order
  if (itemsArray) {
    itemsArray.sort((a, b) => b.totalSales - a.totalSales);
  }

  return (
    <Card className="grid-item">
      <CardHeader className="align-items-center justify-content-between">
        <CardTitle>Top Catories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="col-12">
          <ul className="list-unstyled placeholder-glow col-form-label text-center">
            {isLoading ? (
              <>
                {Array.from({ length: 3 }, (_, index) => (
                  <li key={index}>
                    <span
                      className="placeholder w-50 rounded-2"
                      style={{ height: "12px" }}
                    ></span>
                  </li>
                ))}
              </>
            ) : (
              <>
                {itemsArray?.slice(0, 3).map((item, index) => {
                  return (
                    <li key={index}>
                      <p className="card-text mb-0">{item.parentCategory}</p>
                    </li>
                  );
                })}
              </>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default DashboardCategoryCard;
