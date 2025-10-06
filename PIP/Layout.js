import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Home,
  Users,
  Heart,
  Activity,
  BarChart3,
  Settings,
  BookOpen } from
"lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger } from
"@/components/ui/sidebar";

const navigationItems = [
{
  title: "Início",
  url: createPageUrl("Home"),
  icon: Home
},
{
  title: "Alunos",
  url: createPageUrl("Students"),
  icon: Users
},
{
  title: "Intervenções",
  url: createPageUrl("Interventions"),
  icon: Heart
},
{
  title: "Estados Comportamentais",
  url: createPageUrl("BehavioralStates"),
  icon: Activity
},
{
  title: "Relatórios",
  url: createPageUrl("Reports"),
  icon: BarChart3
}];


export default function Layout({ children }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          --success-color: #10b981;
          --warning-color: #f59e0b;
          --danger-color: #ef4444;
          --info-color: #3b82f6;
        }
      `}</style>
      
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Sidebar className="border-r border-purple-100 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-purple-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">PIIP</h2>
                <p className="text-xs text-gray-600">Plataforma de Intervenção Proativa</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-purple-600 uppercase tracking-wider px-3 py-2">
                Navegação
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) =>
                  <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                      asChild
                      className={`hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 rounded-xl mb-1 ${
                      location.pathname === item.url ?
                      'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' :
                      ''}`
                      }>

                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-purple-100 p-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">Auxiliar de Sala</p>
                <p className="text-xs text-gray-600 truncate">Sistema Ativo</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 px-6 py-4 md:hidden shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-purple-50 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">PIIP</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>);

}