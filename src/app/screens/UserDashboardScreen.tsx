'use client'

import {useState} from "react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider
} from "@/components/ui/sidebar";
import {ChevronLeft, ChevronRight, Plus, Users} from "lucide-react";
import UsuariosTable from "@/components/tables/UsuariosTable";
import {useRouter} from "next/navigation";
import UserDashboard from "@/components/UserDashboard";

const UserDashboardScreen = () => {
  const [view, setView] = useState("usuarios");
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => setCollapsed(!collapsed);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const renderView = () => {
    switch (view) {
      case "perfil":
        return <UserDashboard/>;
      case "eventos":
        return <UserDashboard/>;
      default:
        return <UsuariosTable/>;
    }
  };

  return (
    <div className="flex h-full">
      <SidebarProvider>
        <Sidebar
          className={cn("transition-all duration-300", collapsed ? "w-16" : "w-64")}
        >
          <SidebarHeader>
            <div className="flex justify-between items-center">
              <h2 className={cn("text-xl font-semibold", collapsed ? "hidden" : "")}>Usuario</h2>
              <Button
                variant="link"
                className="p-0"
                onClick={toggleSidebar}
              >
                <ChevronLeft size={16} className={collapsed ? "rotate-180" : ""}/>
              </Button>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className={collapsed ? "hidden" : ""}>Usuario</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem
                    onClick={() => setView("perfil")}
                    className="cursor-pointer hover:bg-muted flex items-center space-x-2 p-2 rounded"
                  >
                    <Users size={16}/>
                    <span className={collapsed ? "hidden" : ""}>Perfil</span>
                    <ChevronRight size={16} className={collapsed ? "hidden" : ""}/>
                  </SidebarMenuItem>
                  <SidebarMenuItem
                    onClick={() => setView("eventos")}
                    className="cursor-pointer hover:bg-muted flex items-center space-x-2 p-2 rounded"
                  >
                    <Plus size={16}/>
                    <span className={collapsed ? "hidden" : ""}>Eventos</span>
                    <ChevronRight size={16} className={collapsed ? "hidden" : ""}/>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <Button
              onClick={handleLogout}
              className={collapsed ? "hidden" : "cursor-pointer"}
            >
              Cerrar sesión
            </Button>
          </SidebarFooter>
        </Sidebar>
      </SidebarProvider>

      {/* Main content area */}
      <div className="flex-1 p-6 md:p-10">
        {renderView()}
      </div>
    </div>
  );
};

export default UserDashboardScreen;
