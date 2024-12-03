'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MenuItem {
  name: string;
  href: string;
}

const adminMenuItems: MenuItem[] = [
  { name: 'Recepción de Demandas', isHeader: true },
  { name: 'Todos', href: '/todos' },
  { name: 'Sin Asignar', href: '/sin-asignar' },
  { name: 'Asignados', href: '/asignados' },
];

const userMenuItems: MenuItem[] = [
  { name: 'Recepción de Demandas', isHeader: true },
  { name: 'Todos', href: '/todos' },
  { name: 'Sin Leer', href: '/sin-leer' },
  { name: 'Leidos', href: '/leidos' },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();

  // Determine which menu to show based on user permissions
  const hasAssignPermission = user?.is_superuser || user?.all_permissions.some(
    (p) => p.codename === 'add_tdemandaasignado'
  );

  const menuItems = hasAssignPermission ? adminMenuItems : userMenuItems;

  return (
    <aside
      className={`relative bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <nav className="h-full overflow-y-auto">
        <div className="py-4">
        {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              {item.isHeader ? (
                <h2 className={`px-4 py-2 text-sm font-semibold text-gray-600 ${isCollapsed ? 'sr-only' : ''}`}>
                  {item.name}
                </h2>
              ) : (
                <>
                  {index === 1 && <hr className="my-2 border-gray-200" />}
                  <Link href={item.href || '#'} passHref>
                    <div
                      className={`
                        flex justify-between items-center px-4 py-2 text-sm text-gray-700
                        hover:bg-sky-50 hover:text-sky-600 cursor-pointer transition-colors duration-150
                        relative
                      `}
                      tabIndex={0}
                      role="button"
                    >
                      <span className={isCollapsed ? 'sr-only' : ''}>{item.name}</span>
                      {item.count !== undefined && (
                        <span className={`bg-gray-200 text-gray-600 rounded-full px-2 py-1 text-xs ${isCollapsed ? 'ml-2' : ''}`}>
                          {item.count}
                        </span>
                      )}
                    </div>
                  </Link>
                </>
              )}
              {item.hasSeparator && <hr className="my-2 border-gray-200" />}
            </React.Fragment>
          ))}
        </div>
      </nav>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-4 -right-3 bg-white border border-gray-200 rounded-full p-1 text-gray-500 hover:text-gray-700"
        style={{ zIndex: 0 }}
        aria-label={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
    </aside>
  );
}
