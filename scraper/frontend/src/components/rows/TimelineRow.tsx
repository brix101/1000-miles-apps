import { ProductEntity } from "@/schema/product.schema";
import { useEffect, useState } from "react";

export interface IGroup {
  name: string;
  products: ProductEntity[];
}

function TimelineRow({ group, year }: { group: IGroup; year: number }) {
  const data: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const [timelineYear, setTimelineYear] = useState<number>(
    new Date().getFullYear()
  );
  useEffect(() => {
    setTimelineYear(year);
  }, [year]);

  return (
    <>
      <tr className="hover-actions-trigger btn-reveal-trigger position-static">
        <td className="align-middle white-space-nowrap text-primary pe-5 fw-bold">
          {group.name ?? ""}
        </td>
        {data.map((index) => {
          let first = false;
          let second = false;
          let third = false;
          let month = 0;
          let date = 0;
          let pYear = 0;
          group.products.forEach((product) => {
            const createdAt = new Date(product.created_at);
            month = createdAt.getMonth();
            date = createdAt.getDate();
            pYear = createdAt.getFullYear();
            if (month == index && timelineYear == pYear) {
              if (date < 11) {
                first = true;
              } else if (date < 21) {
                second = true;
              } else if (date < 32) {
                third = true;
              }
            }
          });

          return (
            <td
              key={index}
              className="align-middle white-space-nowrap fw-bold text-1100"
              style={{ height: "64px", padding: 0 }}
            >
              <div
                className="d-flex"
                style={{ justifyContent: "space-evenly", height: "22px" }}
              >
                {first ? (
                  <div
                    style={{
                      backgroundColor: "#85A9FF",
                      height: "100%",
                      width: "34%",
                      padding: 0,
                    }}
                  ></div>
                ) : (
                  <div
                    style={{
                      backgroundColor: "#FFFFFF",
                      height: "100%",
                      width: "34%",
                      padding: 0,
                    }}
                  ></div>
                )}
                {second ? (
                  <div
                    style={{
                      backgroundColor: "#85A9FF",
                      height: "100%",
                      width: "33%",
                      padding: 0,
                    }}
                  ></div>
                ) : (
                  <div
                    style={{
                      backgroundColor: "#FFFFFF",
                      height: "100%",
                      width: "34%",
                      padding: 0,
                    }}
                  ></div>
                )}
                {third ? (
                  <div
                    style={{
                      backgroundColor: "#85A9FF",
                      height: "100%",
                      width: "33%",
                      padding: 0,
                    }}
                  ></div>
                ) : (
                  <div
                    style={{
                      backgroundColor: "#FFFFFF",
                      height: "100%",
                      width: "34%",
                      padding: 0,
                    }}
                  ></div>
                )}
              </div>
            </td>
          );
        })}
      </tr>
    </>
  );
}

export default TimelineRow;
