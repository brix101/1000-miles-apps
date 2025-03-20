import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  title: string;
  caption?: string;
  value?: string | number | null;
  isLoading?: boolean;
  color?: "success" | "danger" | "default";
}

function ResultCard({
  title: label,
  value,
  isLoading,
  color,
  caption,
}: ResultCardProps) {
  return (
    <Card className="grid-item placeholder-glow">
      <CardHeader className="align-items-center justify-content-between">
        {caption ? (
          <>
            <p className="fw-bold mb-1 text-center text-nowrap">{label}</p>
            {isLoading ? (
              <span className="placeholder m-1 w-50 rounded-2" />
            ) : (
              <p className="fw-bold text-center mb-0">{caption}</p>
            )}
          </>
        ) : (
          <CardTitle>{label}</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        <div className="d-flex flex-column align-items-center justify-content-between text-nowrap">
          {isLoading ? (
            <span className="placeholder placeholder-input p-2 w-50 rounded-2" />
          ) : (
            <h3 className={cn("fw-bolder text-nowrap", `text-${color}`)}>
              {value}
            </h3>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ResultCard;
