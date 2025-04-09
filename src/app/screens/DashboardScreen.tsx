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
import {Archive, ChevronLeft, ChevronRight, FileText, Plus, Settings, Tag, Users} from "lucide-react";
import UsuariosTable from "@/components/tables/UsuariosTable";
import EventosTable from "@/components/tables/EventosTable";
import InscripcionesTable from "@/components/tables/InscripcionesTable";
import OrganizadoresTable from "@/components/tables/OrganizadoresTable";
import RolesTable from "@/components/tables/RolesTable";
import TipoEventoTable from "@/components/tables/TipoEventoTable";

const DashboardScreen = () => {
  const [view, setView] = useState("usuarios");
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  const renderView = () => {
    switch (view) {
      case "usuarios":
        return <UsuariosTable/>;
      case "eventos":
        return <EventosTable/>;
      case "inscripciones":
        return <InscripcionesTable/>;
      case "organizadores":
        return <OrganizadoresTable/>;
      case "roles":
        return <RolesTable/>;
      case "tiposEventos":
        return <TipoEventoTable/>;
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
              <h2 className={cn("text-xl font-semibold", collapsed ? "hidden" : "")}>Administración</h2>
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
              <SidebarGroupLabel className={collapsed ? "hidden" : ""}>Administrador</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem
                    onClick={() => setView("usuarios")}
                    className="cursor-pointer hover:bg-muted flex items-center space-x-2 p-2 rounded"
                  >
                    <Users size={16}/>
                    <span className={collapsed ? "hidden" : ""}>Usuarios</span>
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
                  <SidebarMenuItem
                    onClick={() => setView("inscripciones")}
                    className="cursor-pointer hover:bg-muted flex items-center space-x-2 p-2 rounded"
                  >
                    <FileText size={16}/>
                    <span className={collapsed ? "hidden" : ""}>Inscripciones</span>
                    <ChevronRight size={16} className={collapsed ? "hidden" : ""}/>
                  </SidebarMenuItem>
                  <SidebarMenuItem
                    onClick={() => setView("organizadores")}
                    className="cursor-pointer hover:bg-muted flex items-center space-x-2 p-2 rounded"
                  >
                    <Archive size={16}/>
                    <span className={collapsed ? "hidden" : ""}>Organizadores</span>
                    <ChevronRight size={16} className={collapsed ? "hidden" : ""}/>
                  </SidebarMenuItem>
                  <SidebarMenuItem
                    onClick={() => setView("roles")}
                    className="cursor-pointer hover:bg-muted flex items-center space-x-2 p-2 rounded"
                  >
                    <Settings size={16}/>
                    <span className={collapsed ? "hidden" : ""}>Roles</span>
                    <ChevronRight size={16} className={collapsed ? "hidden" : ""}/>
                  </SidebarMenuItem>
                  <SidebarMenuItem
                    onClick={() => setView("tiposEventos")}
                    className="cursor-pointer hover:bg-muted flex items-center space-x-2 p-2 rounded"
                  >
                    <Tag size={16}/>
                    <span className={collapsed ? "hidden" : ""}>Tipos de Eventos</span>
                    <ChevronRight size={16} className={collapsed ? "hidden" : ""}/>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <Button
              onClick={() => {
              }}
              className={collapsed ? "hidden" : ""}
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

export default DashboardScreen;
