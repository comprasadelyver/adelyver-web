import { DomainError } from "@/features/shared/Result";

export function parseError(
  error: DomainError,
  errorMap: ((err: DomainError) => string)[]
) {
  const msg = errorMap.find((err)=> {
    
  });
}
