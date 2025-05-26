import { useNavigate, useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GeneralError({ className, minimal = false }) {
  const error = useRouteError();
  const navigate = useNavigate();
  console.error(error);

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center p-4",
      className
    )}>
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 p-8 max-w-md w-full">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="p-3 rounded-full bg-yellow-500/10">
            <AlertTriangle className="h-12 w-12 text-yellow-400" />
          </div>
          {!minimal && <h1 className="text-7xl font-bold text-white">500</h1>}
          <span className="text-xl font-medium text-gray-300">
            Oops! Something went wrong {`:')`}
          </span>
          <p className="text-gray-400">
            {error.status} {error.statusText || error.message}
          </p>
          {!minimal && (
            <div className="mt-6 flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              <Button 
                onClick={() => navigate("/")}
                className="bg-blue-600 hover:bg-blue-700">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
