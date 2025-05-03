import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Budget } from "@shared/schema";

export function useBudget(bondPaymentEnabled: boolean) {
  const { data, isLoading, error } = useQuery<Budget>({
    queryKey: [`/api/budget?bondPayment=${bondPaymentEnabled}`]
  });
  
  if (error) {
    console.error("Error fetching budget", error);
  }
  
  return {
    budget: data,
    isLoading
  };
}
