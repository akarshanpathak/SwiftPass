import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve the ticket data passed from the checkout component
  const ticket = location.state?.ticket;
  console.log(" ticket ", ticket);

  // Fallback: If someone types /payment-success directly into the URL without paying
  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            No Ticket Found
          </h2>
          <p className="text-gray-500 mb-6">
            We couldn't find your recent transaction details.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-8">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8 text-center relative overflow-hidden">
        {/* Background decorative blob */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-green-50 to-white -z-10"></div>

        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm border-4 border-white">
          <svg
            className="w-10 h-10 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-500 mb-8 font-medium">
          Your ticket is confirmed and ready.
        </p>

        {/* QR Code Section */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Scan at Entry
          </p>
          <div className="inline-block p-4 border-2 border-dashed border-gray-300 rounded-2xl bg-white shadow-sm">
            <QRCode
              value={ticket.ticketId}
              size={160}
              level="H" // High error correction so it scans easily
              className="mx-auto"
            />
          </div>
        </div>

        {/* Receipt Details Box */}
        <div className="bg-gray-50 rounded-xl p-5 mb-8 text-left border border-gray-100 space-y-3 shadow-inner">
          <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-3">
            <span className="text-gray-500">Ticket ID</span>
            <span className="font-bold text-gray-900 tracking-wide">
              {ticket.ticketId}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-3">
            <span className="text-gray-500">Amount Paid</span>
            <span className="font-bold text-green-600 text-lg">
              ₹{ticket.pricePaid}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm pt-1">
            <span className="text-gray-500">Transaction Ref</span>
            <span className="font-mono text-xs text-gray-400 break-all ml-4 text-right">
              {ticket.paymentIntentId}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => {
              navigate("/profile", {
                state: {
                  tab: "Tickets",
                },
              });
            }}
            className="w-full py-3.5 px-4 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl transition-all active:scale-[0.98] shadow-md"
          >
            View My Tickets
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3.5 px-4 bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 font-semibold rounded-xl transition-all active:scale-[0.98]"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
