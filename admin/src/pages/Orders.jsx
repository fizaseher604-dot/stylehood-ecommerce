import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const token = localStorage.getItem("token");

  const fetchAllOrders = useCallback(async () => {
    if (!token) {
      setLoading(false);
      toast.error("Please login again");
      return;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        toast.error(response.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error(
        "Fetch Orders Error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message || "Failed to fetch orders"
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  // Update delivery status and payment status
  const updateStatus = async (orderId, status) => {
    if (!token || updatingOrder) return;

    setUpdatingOrder(orderId);

    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status },
        { headers: { token } }
      );

      if (response.data.success) {
        const updatedOrder = response.data.order;

        setOrders((previousOrders) =>
          previousOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  status: updatedOrder?.status || status,
                  payment:
                    updatedOrder?.payment ?? order.payment,
                }
              : order
          )
        );

        if (
          status === "Delivered" &&
          updatedOrder?.payment === true
        ) {
          toast.success(
            "Order delivered and payment marked as Paid!"
          );
        } else {
          toast.success("Order status updated successfully");
        }

        // Fetch latest saved order details from backend
        await fetchAllOrders();
      } else {
        toast.error(
          response.data.message || "Failed to update order status"
        );

        await fetchAllOrders();
      }
    } catch (error) {
      console.error(
        "Update Status Error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update order status"
      );

      await fetchAllOrders();
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Processing":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Out for Delivery":
        return "bg-violet-50 text-violet-700 border-violet-200";
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Cancelled":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getDate = (date) => {
    if (!date) return "N/A";

    const parsedDate =
      typeof date === "number" || /^\d+$/.test(String(date))
        ? new Date(Number(date))
        : new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const totalItems = (order) =>
    (order.items || []).reduce(
      (total, item) => total + Number(item.quantity || 1),
      0
    );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F6F8] px-4 py-7 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1500px]">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#F97316]">
            STYLEHOOD / ADMINISTRATION
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
            Order Management
          </h1>

          <div className="mt-7 animate-pulse rounded-2xl border border-slate-200 bg-white p-8">
            <div className="h-5 w-40 rounded bg-slate-200" />
            <div className="mt-5 h-24 rounded-xl bg-slate-100" />
            <div className="mt-4 h-24 rounded-xl bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F8] px-4 py-6 text-[#0F172A] sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        {/* Page Header */}
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-[#F97316]" />
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                STYLEHOOD / ADMIN
              </p>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
              Order Management
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage customer purchases, payments and deliveries.
            </p>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setLoading(true);
              fetchAllOrders();
            }}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#F97316] hover:text-[#F97316] disabled:opacity-50"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 7v5h-5M4 17v-5h5M5.6 9a7 7 0 0 1 11.6-2L20 12M18.4 15a7 7 0 0 1-11.6 2L4 12"
              />
            </svg>
            Refresh Orders
          </button>
        </div>

        {/* Overview */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0F172A] text-white">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 5h14v14H5zM8 9h8M8 13h8M8 17h4"
                />
              </svg>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">
                Total Orders
              </p>
              <p className="mt-1 text-2xl font-bold text-[#0F172A]">
                {orders.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-[#F97316]">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">
                In Progress
              </p>
              <p className="mt-1 text-2xl font-bold text-[#0F172A]">
                {
                  orders.filter((order) =>
                    [
                      "Order Placed",
                      "Processing",
                      "Shipped",
                      "Out for Delivery",
                    ].includes(order.status || "Order Placed")
                  ).length
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m5 12 4 4L19 6"
                />
              </svg>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">
                Delivered
              </p>
              <p className="mt-1 text-2xl font-bold text-[#0F172A]">
                {orders.filter((order) => order.status === "Delivered").length}
              </p>
            </div>
          </div>
        </div>

        {/* Main Orders Panel */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">
                All Orders
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Review orders and manage their delivery progress.
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-orange-100 bg-orange-50 px-3 py-2 text-xs font-bold text-[#F97316]">
              <span className="h-2 w-2 rounded-full bg-[#F97316]" />
              {orders.length} {orders.length === 1 ? "Order" : "Orders"}
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <img
                  src={assets.parcel_icon}
                  alt="Orders"
                  className="h-9 w-9 object-contain"
                />
              </div>

              <h3 className="text-base font-bold text-[#0F172A]">
                No orders yet
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Customer orders will appear here when a purchase is placed.
              </p>
            </div>
          ) : (
            <div className="space-y-5 p-4 sm:p-5 lg:p-6">
              {orders.map((order, index) => (
                <article
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:border-slate-300 hover:shadow-md"
                >
                  {/* Order Header */}
                  <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0F172A]">
                        <img
                          src={assets.parcel_icon}
                          alt=""
                          className="h-6 w-6 object-contain brightness-0 invert"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-[#0F172A]">
                            Order #{String(index + 1).padStart(3, "0")}
                          </h3>

                          <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-500">
                            ID: {String(order._id || "").slice(-8)}
                          </span>
                        </div>

                        <p className="mt-1.5 text-xs text-slate-500">
                          Placed on {getDate(order.date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
                        {totalItems(order)}{" "}
                        {totalItems(order) === 1 ? "item" : "items"}
                      </span>

                      <span
                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold ${getStatusStyle(
                          order.status || "Order Placed"
                        )}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {order.status || "Order Placed"}
                      </span>
                    </div>
                  </div>

                  {/* Main Order Content */}
                  <div className="grid grid-cols-1 gap-5 p-4 sm:p-5 lg:grid-cols-12 lg:gap-6 lg:p-6">
                    {/* Products and Delivery */}
                    <div className="min-w-0 lg:col-span-5">
                      <div className="mb-4 flex items-center gap-2">
                        <span className="h-5 w-1 rounded-full bg-[#F97316]" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                          Products & Customer
                        </h4>
                      </div>

                      <div className="space-y-2">
                        {(order.items || []).map((item, itemIndex) => (
                          <div
                            key={`${item._id || item.name}-${itemIndex}`}
                            className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3"
                          >
                            <div className="min-w-0">
                              <p className="break-words text-sm font-semibold text-[#0F172A]">
                                {item.name || "Product"}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                Size: {item.size || "N/A"}
                              </p>
                            </div>

                            <div className="shrink-0 text-right">
                              <span className="inline-flex rounded-lg border border-orange-100 bg-orange-50 px-2.5 py-1.5 text-xs font-bold text-[#F97316]">
                                × {item.quantity || 1}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 rounded-xl border border-slate-200 p-4">
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Delivery Address
                          </h4>

                          <svg
                            className="h-4 w-4 text-[#F97316]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeWidth="1.7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 21s7-5.5 7-12a7 7 0 1 0-14 0c0 6.5 7 12 7 12Z"
                            />
                            <circle cx="12" cy="9" r="2.2" strokeWidth="1.7" />
                          </svg>
                        </div>

                        <p className="text-sm font-bold text-[#0F172A]">
                          {[
                            order.address?.firstName,
                            order.address?.lastName,
                          ]
                            .filter(Boolean)
                            .join(" ") || "Customer"}
                        </p>

                        <p className="mt-2 break-words text-xs leading-5 text-slate-500">
                          {[
                            order.address?.street,
                            order.address?.city,
                            order.address?.state,
                            order.address?.zipcode,
                            order.address?.country,
                          ]
                            .filter(Boolean)
                            .join(", ") || "Address not provided"}
                        </p>

                        {order.address?.phone && (
                          <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
                            <svg
                              className="h-4 w-4 shrink-0 text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeWidth="1.7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 5a2 2 0 0 1 2-2h3l2 5-2 1.5a12 12 0 0 0 4.5 4.5L14 12l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5Z"
                              />
                            </svg>

                            <p className="text-xs font-medium text-slate-600">
                              {order.address.phone}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="min-w-0 lg:col-span-3">
                      <div className="mb-4 flex items-center gap-2">
                        <span className="h-5 w-1 rounded-full bg-[#F97316]" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                          Payment Details
                        </h4>
                      </div>

                      <div className="h-full rounded-xl border border-slate-200 p-4">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-xs text-slate-500">
                              Total Products
                            </span>

                            <span className="text-sm font-bold text-[#0F172A]">
                              {totalItems(order)}
                            </span>
                          </div>

                          <div className="flex items-start justify-between gap-3">
                            <span className="text-xs text-slate-500">
                              Payment Method
                            </span>

                            <span className="max-w-[120px] rounded-md bg-slate-100 px-2 py-1 text-right text-[11px] font-bold text-slate-700">
                              {order.paymentMethod || "COD"}
                            </span>
                          </div>

                          <div className="flex items-start justify-between gap-3">
                            <span className="text-xs text-slate-500">
                              Payment Status
                            </span>

                            <span
                              className={`rounded-md px-2 py-1 text-[11px] font-bold ${
                                order.payment
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-orange-50 text-orange-700"
                              }`}
                            >
                              {order.payment ? "Paid" : "Pending"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-5 rounded-xl bg-[#0F172A] p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                            Total Amount
                          </p>

                          <p className="mt-2 break-words text-xl font-bold text-white">
                            {currency}{" "}
                            {Number(order.amount || 0).toLocaleString()}
                          </p>

                          <div className="mt-3 h-1 w-10 rounded-full bg-[#F97316]" />
                        </div>
                      </div>
                    </div>

                    {/* Update Status */}
                    <div className="min-w-0 lg:col-span-4">
                      <div className="mb-4 flex items-center gap-2">
                        <span className="h-5 w-1 rounded-full bg-[#F97316]" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                          Update Status
                        </h4>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                        <div className="mb-4 flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#F97316]">
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeWidth="1.7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 12h14M13 6l6 6-6 6"
                              />
                            </svg>
                          </div>

                          <div>
                            <p className="text-sm font-bold text-[#0F172A]">
                              Delivery Progress
                            </p>
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              Select the current stage of this order.
                            </p>
                          </div>
                        </div>

                        <label
                          htmlFor={`status-${order._id}`}
                          className="mb-2 block text-xs font-semibold text-slate-600"
                        >
                          Order Status
                        </label>

                        <div className="relative">
                          <select
                            id={`status-${order._id}`}
                            value={order.status || "Order Placed"}
                            disabled={updatingOrder === order._id}
                            onChange={(event) =>
                              updateStatus(order._id, event.target.value)
                            }
                            className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-3 py-3 pr-10 text-sm font-semibold text-[#0F172A] outline-none transition focus:border-[#F97316] focus:ring-4 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <option value="Order Placed">Order Placed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">
                              Out for Delivery
                            </option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          <svg
                            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m7 10 5 5 5-5"
                            />
                          </svg>
                        </div>

                        {updatingOrder === order._id ? (
                          <div className="mt-3 flex items-center gap-2 text-xs font-medium text-[#F97316]">
                            <span className="h-3 w-3 animate-spin rounded-full border-2 border-orange-200 border-t-[#F97316]" />
                            Updating order status...
                          </div>
                        ) : (
                          <p className="mt-3 flex items-center gap-2 text-[11px] leading-5 text-slate-500">
                            <svg
                              className="h-4 w-4 shrink-0 text-emerald-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m5 12 4 4L19 6"
                              />
                            </svg>
                            Changes are saved when you select a status.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-4 py-3 sm:px-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                      STYLEHOOD
                    </p>

                    <p className="text-[11px] font-medium text-slate-500">
                      Order Management
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Panel Footer */}
          {orders.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="font-bold text-[#0F172A]">
                  {orders.length}
                </span>{" "}
                {orders.length === 1 ? "order" : "orders"}
              </p>

              <p className="text-[11px] font-medium text-slate-400">
                STYLEHOOD{" "}
                <span className="text-[#F97316]">●</span> Order Management
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Orders;