import React, { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Heart, Share2 } from "lucide-react";
import { createOrder, verifyPayment } from "../../services/payment.services";
import { fetchEvents } from "../../services/event.services";
import {getUser} from "../../utils/auth"
import toast from "react-hot-toast";
// import {createOrder} from "../../services/payment.services"
// const events = [
//     {
//         id: 1,
//         title: 'Neon Nights Music Festival',
//         date: 'OCT 15',
//         time: '8:00 PM',
//         location: 'Central Park Arena',
//         price: '$75',
//         image: 'https://images.unsplash.com/photo-1459749411177-2293291f865d?auto=format&fit=crop&q=80&w=1000',
//         category: 'Music'
//     },
//     {
//         id: 2,
//         title: 'Future Tech Summit 2024',
//         date: 'NOV 02',
//         time: '9:00 AM',
//         location: 'Silicon Valley Center',
//         price: '$299',
//         image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000',
//         category: 'Tech'
//     },
//     {
//         id: 3,
//         title: 'Modern Art Gallery Opening',
//         date: 'SEP 28',
//         time: '6:30 PM',
//         location: 'The Met Museum',
//         price: '$45',
//         image: 'https://images.unsplash.com/photo-1518998053901-5348d3969105?auto=format&fit=crop&q=80&w=1000',
//         category: 'Arts'
//     },
//     {
//         id: 4,
//         title: 'Gourmet Food Carnival',
//         date: 'DEC 12',
//         time: '12:00 PM',
//         location: 'Downtown Square',
//         price: 'Free',
//         image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1000',
//         category: 'Food'
//     },
// ];

const SuggestionsSection = () => {
  const [events, setEvents] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const user=getUser();
//   console.log("user ",user);
  
  const getEvents = async () => {
    const data = await fetchEvents();
    // console.log(data.data.data);
    setEvents(data.data.data);
  };
  useEffect(() => {
    getEvents();
  }, []);
  const handlePayment = async (event) => {
    // console.log("selected event",selectedEvent);
    
    try {
        const response= await createOrder(event._id);
        const data= response.data
        // console.log("Data is : " ,data);
        const options={
            key:data.key_id,
            amount:data.order.amount,
            currency:data.order.currency,
            name:"SwiftPass",
            description:"Event Ticket Purchase",
            order_id:data.order.id,
            handler:(res)=>{
                verifyPayment(res,event)
            },
            prefill:{
                name:user.name,
                email:user.email
            },
            theme:{colour:"#3B82F6"}
        }

        const rzp=new window.Razorpay(options)
        rzp.open();
        toast.success("Payment Successfull")
    } catch (error) {
        toast.error("Payment Failed "+error.message)
        return ;
    }

  };
  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            You Might Also <span className="text-green-700">Like</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Curated events detailed just for you. From high-energy festivals to
            inspiring workshops, don't miss out on what's happening.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {events &&
            events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.bannerImage}
                    alt={event.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-green-700 shadow-sm">
                    Music
                  </span>
                  <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1 text-green-600">
                      <Calendar className="w-4 h-4" />
                      {event.startDate}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {event.endDate}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-green-700 transition-colors cursor-pointer">
                    {event.title}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{event.location}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-2xl font-bold text-gray-900">
                      {event.price}
                    </span>
                    <button
                      onClick={() => {
                          console.log("event from onclick ",event);
                        //   setSelectedEvent(event)
                          handlePayment(event);
                      }}
                      className="px-4 py-2 rounded-xl bg-gray-50 text-gray-900 font-semibold text-sm hover:bg-green-700 hover:text-white transition-colors"
                    >
                      Get Tickets
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="mt-16 text-center">
          <button className="px-10 py-4 bg-transparent border-2 border-green-700 text-green-700 font-bold rounded-full hover:bg-green-700 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1">
            View All Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuggestionsSection;
