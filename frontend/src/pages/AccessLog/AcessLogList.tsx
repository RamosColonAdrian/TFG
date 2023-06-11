import React, { useState, useEffect } from "react";
import axios from "axios";
import { AccessLog } from "../../shared/Interfaces/Interfaces";
import useRedirectBasedOnAuthentication from "../../hooks/useRedirectBasedOnAuthentication";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { writeFile, utils } from "xlsx";
import csv from "../../assets/csv.png";

const AccessLogList: React.FC = () => {
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useRedirectBasedOnAuthentication("authenticated");

  const handleExportToExcel = () => {
    // Crea una matriz de datos que contendrá los datos de la tabla
    const data = accessLogs.map((log) => [
      log.User.name + " " + log.User.surname,
      log.User.email === null || log.User.email === ""
        ? "No Data"
        : log.User.email,
      log.User.phone === null || log.User.email === ""
        ? "No Data"
        : log.User.email, 
      log.Zone.name,
      log.access ? "Allowed" : "Denied",
      formatDate(log.createdAt),
      formatDate(log.updatedAt),
    ]);

    // Crea una nueva hoja de cálculo de Excel
    const ws = utils.aoa_to_sheet([
      ["User name","Email","Phone", "Zone", "Access", "Created At", "Updated At"],
      ...data,
    ]);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Access Logs");

    const csvData = utils.sheet_to_csv(wb.Sheets["Access Logs"])

    // Genera el nombre del archivo con la fecha actual en el formato "dia-mes-año"
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = String(today.getFullYear());
    const fileName = `access_logs_${day}-${month}-${year}.csv`;

    // Guarda el archivo de Excel
    writeFile(wb, fileName);
  };

  const handleSort = (column: string) => {
    if (column === sortBy) {
      // Si ya se está ordenando por la misma columna, cambia la dirección
      setSortDirection((prevDirection) =>
        prevDirection === "asc" ? "desc" : "asc"
      );
    } else {
      // Si se está ordenando por una columna diferente, establece la nueva columna y la dirección ascendente por defecto
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    fetchAccessLogs();
  }, [searchTerm, sortBy, sortDirection]); // Agrega sortBy y sortDirection como dependencias

  const fetchAccessLogs = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/access-logs`,
        {
          params: {
            username: searchTerm,
            sortBy: sortBy || undefined, // Asegúrate de pasar undefined si sortBy es falsy
            sortDirection: sortDirection || undefined, // Asegúrate de pasar undefined si sortDirection es falsy
          },
        }
      );
      setAccessLogs(response.data);
    } catch (error) {
      toast.error("Error fetching access logs");
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString(); // Formatea la fecha utilizando toLocaleString()
  };

  return (
    <div className="min-w-screen min-h-screen flex items-center justify-center bg-gray-100 font-sans overflow-hidden">
      
      <div className="w-full lg:w-5/6">
        <label
          htmlFor="name"
          className="block mb-2 font-medium text-gray-900 "
        >
          Search:
        </label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by user name"
          className="bg-orange-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
        />
        <div className="bg-white shadow-md rounded my-6">
          <table className="min-w-max w-full table-auto">
            <thead>
              <tr className="bg-orange-400 bg-opacity-70 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-center">User name</th>
                <th className="py-3 px-6 text-center">Zone</th>
                <th className="py-3 px-6 text-center">Access</th>
                <th className="py-3 px-6 text-center" onClick={() => handleSort("createdAt")}>
                  Created At{" "}
                  {sortBy === "createdAt" && (
                    <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
                  )}
                </th>
                <th className="py-3 px-6 text-center" onClick={() => handleSort("updatedAt")}>
                  Updated At{" "}
                  {sortBy === "updatedAt" && (
                    <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {accessLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100 text-center"
                >
                  <Link to={`/user/${log.User.id}`}>
                    <td className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                      <div className="relative h-10 w-10">
                        <img
                          className="h-full w-full rounded-full object-cover object-center"
                          src={log.User.picture}
                        />
                        <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white"></span>
                      </div>
                      <div className="text-sm text-left">
                        <div className="font-medium text-gray-700">
                          {log.User.name} {log.User.surname}
                        </div>
                        <div className="text-start text-gray-400">
                          {log.User.email}
                        </div>
                      </div>
                    </td>
                  </Link>

                  <td className="py-3 px-6 text-center">
                    <span className="font-medium">
                      {log.Zone.name}
                    </span>
                  </td>
                  <td className={`py-3 px-6 text-center `}>
                    <span className="font-medium">
                      {log.access 
                        ? 
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                            Allowed
                          </span>
                        : 
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                            Denied
                          </span>
                        }
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span className="font-medium">
                      {formatDate(log.createdAt)}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span className="font-medium">
                      {formatDate(log.updatedAt)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end"> 
          <button className="group rounded-xl h-11 w-28 bg-green-700 font-bold text-base text-white relative overflow-hidden" onClick={handleExportToExcel}>
          <div className="flex items-center justify-center gap-3">
            <div className="rounded-full bg-white p-1">
                <img src={csv} alt="Excel" className="w-5" />
            </div>
            <span>Export</span>
          </div>
          <div className="absolute duration-300 inset-0 w-full h-full transition-all scale-0 group-hover:scale-100 group-hover:bg-white/30 rounded-xl"></div>

        </button></div>
       
      </div>
      
    </div>
  );
};

export default AccessLogList;
