"use client";

import { AiFillBank, AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { MdHotel, MdNightsStay } from "react-icons/md";
import { useWidgetHook } from "../../hooks/widget-hook";
import Widget from "../../components/widget";
import BigWidget from "../../components/big-widget";
import Chart from "../../components/chart";
import { FaMapMarkedAlt } from "react-icons/fa";
import { getYear } from "date-fns";

function Dashboard() {
  let dataTotalPendapatan: {
    dataPendapatan: {
      pendapatan: number;
      bulan: number;
    }[];
    totalPendapatan: number;
  } = {
    dataPendapatan: [],
    totalPendapatan: 0,
  };
  const [
    usersQuery,
    destinationsQuery,
    experiencesQuery,
    lodgingsQuery,
    regularOrdersQuery,
    regularOrdersRevenueQuery,
    packageOrdersQuery,
    packageOrdersRevenueQuery,
    mostOrderedQuery,
  ] = useWidgetHook();

  const widgetData = [
    {
      page: "users",
      label: "Pengguna Aktif",
      data: usersQuery.data,
      icon: <AiOutlineUser color="#efefef" />,
    },
    {
      page: "destinations",
      label: "Destinasi",
      data: destinationsQuery.data,
      icon: <MdHotel color="#efefef" />,
    },
    {
      page: "experiences",
      label: "Experience",
      data: experiencesQuery.data,
      icon: <FaMapMarkedAlt color="#efefef" />,
    },
    {
      page: "lodging",
      label: "Penginapan",
      data: lodgingsQuery.data,
      icon: <MdNightsStay color="#efefef" />,
    },
    {
      page: "orders",
      label: "Pemesanan Reguler",
      data: regularOrdersQuery.data,
      icon: <AiOutlineHome color="#efefef" />,
    },
    {
      page: "orders",
      label: "Pemesanan Paket",
      data: packageOrdersQuery.data,
      icon: <AiOutlineHome color="#efefef" />,
    },
    {
      page: "orders",
      label: `Pendapatan (${getYear(new Date())})`,
      data: regularOrdersRevenueQuery.data,
      icon: <AiFillBank color="#efefef" />,
    },
  ];

  if (regularOrdersRevenueQuery.data && regularOrdersRevenueQuery.data !== 0) {
    dataTotalPendapatan.dataPendapatan = [
      ...dataTotalPendapatan.dataPendapatan,
      ...regularOrdersRevenueQuery.data.dataPendapatan,
    ];

    dataTotalPendapatan.totalPendapatan +=
      regularOrdersRevenueQuery.data.totalPendapatan;
  }

  if (packageOrdersRevenueQuery.data && packageOrdersRevenueQuery.data !== 0) {
    dataTotalPendapatan.dataPendapatan = [
      ...dataTotalPendapatan.dataPendapatan,
      ...packageOrdersRevenueQuery.data.dataPendapatan,
    ];

    dataTotalPendapatan.totalPendapatan +=
      packageOrdersRevenueQuery.data.totalPendapatan;
  }

  console.log(dataTotalPendapatan);

  return (
    <div className="lg-:w-full h-full flex flex-col col-span-10">
      <div className="grid grid-row-4 lg:grid-rows-1 grid-col-1 lg:grid-cols-4 gap-8 justify-items-center w-screen lg:w-full">
        {widgetData?.map(({ page, data, icon, label }) => (
          <Widget
            key={page}
            page={page}
            data={data}
            icon={icon}
            label={label}
          />
        ))}
      </div>
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-7 lg:gap-16 w-screen lg:w-full items-center py-10">
        <BigWidget destination={mostOrderedQuery.data} />

        <Chart propsDataPendapatan={dataTotalPendapatan} />
      </div>
    </div>
  );
}

export default Dashboard;
