import React, { useEffect, useState } from 'react'
import { getUser } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { getAllTicketOfUser } from '../services/ticket.service';
import toast from 'react-hot-toast';

function Tickets() {

    const currentUser = getUser()
    const navigate = useNavigate()
    const [tickets, setTickets] = useState(null)

    const currDate = new Date();
    currDate.setHours(0, 0, 0, 0);

    if (!currentUser) {
        return (
            <div className='w-full min-h-screen flex items-center justify-center'>
                <h1 className='text-3xl text-gray-800'>Not Found</h1>
                <span
                    onClick={() => navigate("/")}
                    className='underline underline-offset-2 cursor-pointer'
                >
                    back to homepage
                </span>
            </div>
        )
    }

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await getAllTicketOfUser();
                setTickets(response.data.userTickets);
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to fetch tickets");
                console.log(error);
            }
        }

        fetchTickets();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 px-4 sm:px-8 py-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-10">
                My Tickets
            </h1>

            {!tickets?.length ? (
                <div className="flex items-center w-[80vw] justify-center h-[50vh]">
                    <p className="text-gray-500 text-lg">
                        You haven't purchased any tickets yet.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

                    {tickets.map((ticket, idx) => {

                        const eventDate = new Date(ticket.event.startDate);

                        eventDate.setHours(0, 0, 0, 0);

                       const isExpired = eventDate < currDate;

                        return (
                            <div
                                key={idx}
                                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                            >

                                <div className="relative">
                                    <img
                                        src={ticket.event.bannerImage}
                                        alt={ticket.event.title}
                                        className="w-full h-56 object-cover"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                                    <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-green-700 text-xs font-semibold px-3 py-1 rounded-full shadow">
                                        {ticket.event.type}
                                    </span>

                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h2 className="text-white text-xl font-bold line-clamp-2">
                                            {ticket.event.title}
                                        </h2>
                                    </div>
                                </div>

                                <div className="relative p-5">

                                    <div className="absolute -left-3 top-10 h-6 w-6 bg-gray-50 rounded-full"></div>
                                    <div className="absolute -right-3 top-10 h-6 w-6 bg-gray-50 rounded-full"></div>

                                    <div className="border-t border-dashed border-gray-300 mb-4"></div>

                                    <div className="space-y-4">

                                        <div>
                                            <p className="text-xs uppercase tracking-widest text-gray-400">
                                                Event Date
                                            </p>

                                            <p className="font-semibold text-gray-700">
                                                {isExpired
                                                    ? "Event Expired"
                                                    : eventDate.toDateString()}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase tracking-widest text-gray-400">
                                                Ticket Holder
                                            </p>
                                            <p className="font-semibold text-gray-700">
                                                {currentUser.name}
                                            </p>
                                        </div>

                                    </div>

                                    <button
                                        onClick={()=>{navigate("/ticket"  , {
                                            state : {
                                                ticket: ticket
                                            }
                                        })}}
                                        disabled={isExpired} 
                                        className={`w-full mt-6 text-white py-3 rounded-xl font-semibold shadow-md transition-all duration-200 ${
                                            isExpired
                                                ? "bg-gray-500 cursor-not-allowed opacity-70"
                                                : "bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-xl hover:scale-[1.02] cursor-pointer"
                                        }`}
                                    >
                                        {isExpired ? "Event Ended" : "View Ticket"}
                                    </button>

                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Tickets;