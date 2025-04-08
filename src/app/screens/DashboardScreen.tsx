import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ComponentProps } from "react";
import UserTable from "@/components/ui/users/UserTable";

const DashboardScreen = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div className={cn("flex flex-col gap-6 h-full", className)} {...props}>
      <Card className="overflow-hidden p-10 h-full">
        <CardContent className="flex flex-col p-0 h-full">
          <UserTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardScreen;