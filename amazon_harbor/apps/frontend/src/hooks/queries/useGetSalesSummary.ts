function useGetSalesSummary() {
  const data = [
    {
      productName: "Product 1",
      sales: 1200,
      profit: 620,
      comparison: [
        {
          name: "Last Year (Jan-17, 2023 to Jan-18, 2023)",
          sales: 600,
          salesGrowth: 100,
          profit: 620,
          profitGrowth: 80,
        },
        {
          name: "Custom Period (Aug-17, 2023 to Aug-18, 2023)",
          sales: 600,
          salesGrowth: -78,
          profit: 620,
          profitGrowth: 80,
        },
      ],
    },
    {
      productName: "Product 2",
      sales: 1200,
      profit: 620,
      comparison: [
        {
          name: "Last Year (Jan-17, 2023 to Jan-18, 2023)",
          sales: 600,
          salesGrowth: -20,
          profit: 620,
          profitGrowth: 80,
        },
        {
          name: "Custom Period (Aug-17, 2023 to Aug-18, 2023)",
          sales: 600,
          salesGrowth: 100,
          profit: 620,
          profitGrowth: 80,
        },
      ],
    },
    {
      productName: "Product 3",
      sales: 1200,
      profit: 620,
      comparison: [
        {
          name: "Last Year (Jan-17, 2023 to Jan-18, 2023)",
          sales: 600,
          salesGrowth: 100,
          profit: 620,
          profitGrowth: 80,
        },
        {
          name: "Custom Period (Aug-17, 2023 to Aug-18, 2023)",
          sales: 600,
          salesGrowth: 100,
          profit: 620,
          profitGrowth: 80,
        },
      ],
    },
    {
      productName: "Product 4",
      sales: 1200,
      profit: 620,
      comparison: [
        {
          name: "Last Year (Jan-17, 2023 to Jan-18, 2023)",
          sales: 600,
          salesGrowth: 100,
          profit: 620,
          profitGrowth: 80,
        },
        {
          name: "Custom Period (Aug-17, 2023 to Aug-18, 2023)",
          sales: 600,
          salesGrowth: -40,
          profit: 620,
          profitGrowth: 80,
        },
      ],
    },
    {
      productName: "Product 5",
      sales: 1200,
      profit: 620,
      comparison: [
        {
          name: "Last Year (Jan-17, 2023 to Jan-18, 2023)",
          sales: 600,
          salesGrowth: -40,
          profit: 620,
          profitGrowth: 80,
        },
        {
          name: "Custom Period (Aug-17, 2023 to Aug-18, 2023)",
          sales: 600,
          salesGrowth: -40,
          profit: 620,
          profitGrowth: 80,
        },
      ],
    },
  ];
  return { data };
}

export default useGetSalesSummary;
