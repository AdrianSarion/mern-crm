import { companies } from "@/assets/mock-data";
import { Dash } from "@/components/shared/dashboard";
import { Spinner } from "@/components/ui/spinner";
import { Card } from "@/components/ui/card";
import { NotebookTabs } from "lucide-react";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";

export default function HomePage() {
  const { user } = useSelector((state) => state.auth);
  const layout = Cookies.get("react-resizable-panels:layout");
  const collapsed = Cookies.get("react-resizable-panels:collapsed");
  const defaultLayout = layout ? JSON.parse(layout) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed) : undefined;

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <NotebookTabs className="h-8 w-8 text-blue-400" />
            </div>
            <Spinner size="large" className="text-blue-400" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      <Dash
        user={user}
        companies={companies}
        defaultLayout={defaultLayout}
        defaultCollapsed={defaultCollapsed}
        navCollapsedSize={3}
      />
    </div>
  );
}
