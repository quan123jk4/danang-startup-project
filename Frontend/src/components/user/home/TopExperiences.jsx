import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faSuitcaseRolling,
  faThLarge,
} from "@fortawesome/free-solid-svg-icons";

const experiences = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1621213348107-160a0f0064f2?q=80&w=600",
    rating: 4.9,
    reviews: 125,
    tag: "Cultural",
    title: "Mỹ Sơn Sanctuary: Ancient Kingdom Exploration",
    price: 75,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1596402181057-798888b14a93?q=80&w=600",
    rating: 4.8,
    reviews: 98,
    tag: "Modern",
    title: "Ba Na Hills Golden Bridge & Cable Car Adventure",
    price: 110,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1600350798226-0e3f05545567?q=80&w=600",
    rating: 4.9,
    reviews: 150,
    tag: "Nature",
    title: "Marble Mountains & Dragon Bridge Sunset Tour",
    price: 55,
  },
];

const TopExperiences = () => {
  return (
    <section className="py-24 px-8 md:px-16 lg:px-24 bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <p className="text-sm font-bold text-[#FBBF24] uppercase tracking-widest mb-2">
              Unforgettable Da Nang
            </p>
            <h2 className="text-4xl font-extrabold text-[#1E293B] tracking-tight">
              Your Journey Starts Here.
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 border border-slate-100 rounded-full p-1.5 bg-white shadow-inner">
            <button className="px-5 py-2 rounded-full text-xs font-bold text-[#1E293B] bg-[#FCFDFE] shadow border border-slate-100">
              Most Popular
            </button>
            <button className="px-5 py-2 rounded-full text-xs font-bold text-slate-500 hover:text-[#1E293B]">
              Cultural Gems
            </button>
            <button className="px-5 py-2 rounded-full text-xs font-bold text-slate-500 hover:text-[#1E293B]">
              Nature Escapes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-[#FCFDFE] rounded-3xl border border-slate-100 overflow-hidden shadow-lg hover:shadow-2xl transition-all group flex flex-col"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#468045]">
                  {exp.tag}
                </div>
              </div>
              <div className="p-7 flex flex-col flex-1 gap-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <FontAwesomeIcon icon={faStar} className="text-[#FBBF24]" />
                    <span className="font-bold text-[#1E293B] text-sm">
                      {exp.rating}
                    </span>
                    <span className="text-xs">({exp.reviews} Reviews)</span>
                  </div>
                  <FontAwesomeIcon
                    icon={faSuitcaseRolling}
                    className="text-slate-300"
                  />
                </div>
                <h3 className="text-lg font-bold text-[#1E293B] flex-1 line-clamp-2 leading-snug">
                  {exp.title}
                </h3>
                <div className="flex items-end justify-between gap-4 pt-2 border-t border-slate-100">
                  <p className="text-2xl font-black text-[#1E293B]">
                    <span className="text-base font-normal text-slate-500">
                      From{" "}
                    </span>
                    ${exp.price}
                  </p>
                  <button className="bg-[#1e293b] text-white px-6 py-3 rounded-xl text-xs font-bold hover:bg-black transition-all">
                    BOOK NOW
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button className="border-2 border-slate-200 text-[#1E293B] px-10 py-4 rounded-full font-bold hover:bg-gray-50 transition-all flex items-center gap-3">
            <FontAwesomeIcon icon={faThLarge} className="text-[#FBBF24]" />
            VIEW ALL EXPERIENCES
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopExperiences;
