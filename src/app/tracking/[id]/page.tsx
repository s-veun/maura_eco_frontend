"use client";

import { use } from "react";
import { 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Truck, 
  ArrowLeft, 
  ShieldCheck, 
  Calendar,
  AlertCircle
} from "lucide-react";
import { useTrackOrderQuery, useGetOrderStatusHistoryQuery } from "@/redux/api/orderApi";
import Header from "@/components/header";

type TrackingEvent = {
  status: string;
  updatedAt?: string;
  note?: string;
  updatedBy?: string;
};

export default function OrderTrackingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const orderId = parseInt(id);

  const { data: tracking, isLoading: isTrackingLoading, isError: isTrackingError } = useTrackOrderQuery(orderId);
  const { data: history = [], isLoading: isHistoryLoading } = useGetOrderStatusHistoryQuery(orderId);
  const trackingData = (tracking ?? {}) as { orderId?: number; status?: string };
  const trackingOrderId = typeof trackingData.orderId === "number" ? trackingData.orderId : orderId;
  const trackingStatus =
    typeof trackingData.status === "string" && trackingData.status.trim().length > 0
      ? trackingData.status
      : "PENDING";

  const isLoading = isTrackingLoading || isHistoryLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-fade-in">
          <div className="w-20 h-20 border-4 border-[#5c2d91]/20 border-t-[#5c2d91] rounded-full animate-spin shadow-2xl" />
          <p className="text-gray-500 dark:text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Accessing Logistics Feed...</p>
        </div>
      </div>
    );
  }

  if (isTrackingError || !tracking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-4 text-center">
          <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-3xl flex items-center justify-center shadow-inner">
            <AlertCircle size={48} />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Mission Failed</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm font-bold text-sm uppercase tracking-widest leading-relaxed">Could not find order ID #{id} in our global tracking database. Please verify the identifier.</p>
          </div>
          <button onClick={() => window.history.back()} className="px-10 py-5 bg-[#5c2d91] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all flex items-center gap-3">
            <ArrowLeft size={18} /> Return to Base
          </button>
        </div>
      </div>
    );
  }

  // Helper to determine status color
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED": case "DELIVERED": return "text-emerald-500";
      case "PROCESSING": case "PENDING": return "text-amber-500";
      case "SHIPPED": return "text-blue-500";
      case "CANCELLED": return "text-red-500";
      default: return "text-[#5c2d91]";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500 pb-24">
      <Header />
      
      {/* Header Section */}
      <div className="bg-gradient-to-br from-[#1a1a2e] to-[#252545] pt-40 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#10b981] rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />
        </div>
        
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="space-y-6">
              <button 
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-[#10b981] font-black text-[10px] uppercase tracking-[0.3em] hover:translate-x-[-4px] transition-transform"
              >
                <ArrowLeft size={16} /> Previous Sector
              </button>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#10b981] bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">Live Deployment</span>
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Order #{trackingOrderId}</span>
                </div>
                <h1 className="text-5xl sm:text-7xl font-black text-white uppercase tracking-tighter leading-none">Logistics <br /> Manifest</h1>
              </div>
            </div>

            <div className="flex items-center gap-12 text-center md:text-right">
               <div>
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] mb-2">Current Protocol</p>
                  <p className={`text-xl font-black uppercase tracking-tight ${getStatusColor(trackingStatus)}`}>{trackingStatus}</p>
               </div>
               <div className="w-px h-12 bg-white/10 hidden sm:block" />
               <div>
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] mb-2">Secure Verification</p>
                  <div className="flex items-center gap-2 text-[#10b981] font-black text-sm uppercase">
                    <ShieldCheck size={18} /> Verified Hub
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Feed: Timeline */}
          <div className="lg:col-span-2 space-y-12">
            <section className="bg-white dark:bg-[#1a1a2e] p-8 sm:p-12 rounded-[3rem] shadow-2xl border-2 border-[#5c2d91]/5">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-12 flex items-center gap-4">
                <Clock size={28} className="text-[#5c2d91]" /> Deployment Timeline
              </h2>

              <div className="relative space-y-12 pl-8 border-l-2 border-gray-100 dark:border-white/5">
                {history.length > 0 ? (history as TrackingEvent[]).map((event, i: number) => (
                  <div key={i} className="relative animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className={`absolute -left-[41px] top-0 w-5 h-5 rounded-full border-4 border-white dark:border-[#1a1a2e] shadow-lg transition-colors ${i === 0 ? "bg-[#10b981] scale-125" : "bg-gray-300 dark:bg-white/20"}`} />
                    <div className="space-y-2">
                       <div className="flex items-center gap-3">
                          <p className={`text-xs font-black uppercase tracking-widest ${i === 0 ? getStatusColor(event.status) : "text-gray-400"}`}>
                            {event.status}
                          </p>
                          <span className="text-[9px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-widest">
                            <Calendar size={10} className="inline mr-1" /> {event.updatedAt ? new Date(event.updatedAt).toLocaleString() : "Unknown timestamp"}
                          </span>
                       </div>
                       <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-relaxed max-w-lg">
                         {event.note || `Order transitioned to ${event.status} state via Nexa Logistics Hub.`}
                       </p>
                       {event.updatedBy && (
                         <p className="text-[8px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-[0.2em]">Validated by: {event.updatedBy}</p>
                       )}
                    </div>
                  </div>
                )) : (
                  <div className="relative">
                    <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full border-4 border-white dark:border-[#1a1a2e] bg-[#10b981] scale-125 shadow-lg" />
                    <div className="space-y-2">
                       <div className="flex items-center gap-3">
                          <p className={`text-xs font-black uppercase tracking-widest ${getStatusColor(trackingStatus)}`}>
                            {trackingStatus}
                          </p>
                          <span className="text-[9px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-widest">
                            <Calendar size={10} className="inline mr-1" /> {new Date().toLocaleString()}
                          </span>
                       </div>
                       <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-relaxed">
                         Current deployment state: {trackingStatus}. Awaiting further logistics transitions.
                       </p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar: Details & Action */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white dark:bg-[#1a1a2e] p-10 rounded-[3rem] shadow-2xl border-2 border-[#5c2d91]/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Truck size={120} />
              </div>
              
              <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-8 relative z-10">Cargo Summary</h2>
              
              <div className="space-y-8 relative z-10">
                <div className="flex items-start gap-4">
                   <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-[#5c2d91] flex-shrink-0 shadow-inner">
                      <MapPin size={20} />
                   </div>
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Destination Hub</p>
                      <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest leading-relaxed">
                        Sector 7-G, Logistics District <br /> Nexa Central
                      </p>
                   </div>
                </div>

                <div className="flex items-start gap-4">
                   <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-[#10b981] flex-shrink-0 shadow-inner">
                      <Package size={20} />
                   </div>
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Operational Status</p>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${getStatusColor(trackingStatus)}`}>
                        {trackingStatus === 'COMPLETED' ? 'Operational Success' : 'Deployment In Progress'}
                      </p>
                   </div>
                </div>

                <div className="pt-8 border-t dark:border-white/5 space-y-6">
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Identifier</span>
                      <span className="text-[10px] font-black text-gray-900 dark:text-white">#{trackingOrderId}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Security Protocol</span>
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">AES-256</span>
                   </div>
                </div>

                <button className="w-full bg-[#5c2d91] hover:bg-[#3c3068] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95">
                   <CheckCircle2 size={18} /> Request Update
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#10b981]/10 to-transparent p-8 rounded-[2.5rem] border border-[#10b981]/20 flex items-center gap-5">
               <div className="w-12 h-12 bg-[#10b981] text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <Truck size={24} />
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Express Transit</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Hub-to-Hub Encryption Active</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
