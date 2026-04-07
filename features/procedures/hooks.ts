import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProcedures,
  getProcedure,
  createProcedure,
  updateProcedure,
} from "./api";
import { CreateProcedureReq, UpdateProcedureReq } from "./types";
import { toast } from "sonner";

export const useProcedures = () => {
  return useQuery({
    queryKey: ["procedures"],
    queryFn: getProcedures,
  });
};

export const useProcedure = (id: string) => {
  return useQuery({
    queryKey: ["procedures", id],
    queryFn: () => getProcedure(id),
    enabled: !!id,
  });
};

export const useCreateProcedure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (procedure: CreateProcedureReq) => createProcedure(procedure),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["procedures"] });
      toast.success("Procedure catalog entry created!");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to create procedure");
    },
  });
};

export const useUpdateProcedure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProcedureReq & { id: string }) => updateProcedure(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["procedures"] });
      queryClient.invalidateQueries({ queryKey: ["procedures", variables.id] });
      toast.success("Procedure updated!");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to update procedure");
    },
  });
};
