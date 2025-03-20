function useGetIssues() {
  const data = [
    {
      issueType: "Inventory",
      description: "There are 2 Products Need to Replenish",
      link: "/dashboard/procurement/product-list",
    },
    {
      issueType: "Shipment",
      description: "There are 1 Shipment with Missing Information",
      link: "/dashboard/procurement/shipments",
    },
  ];
  return { data };
}

export default useGetIssues;
