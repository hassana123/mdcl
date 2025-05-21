import React from "react";
import Image from "next/image";
import { Twitter, Linkedin, Instagram, Facebook } from "lucide-react";
const Contact = () => {
  return (
    <section className="w-full max-w-6xl bg-white mx-auto py-16 px-4 flex flex-col md:flex-row items-center justify-between">
      {/* Left: Contact Info Card */}
      <div className="bg-[url('/mdcl/bg1.png')] bg-cover bg-center text-white  rounded-xl shadow-lg p-6 flex-1 max-w-md relative overflow-hidden">
        <h2 className="text-lg font-semibold mb-6">Contact Information</h2>
        <div className="text-sm mb-6 space-y-4">
          <div>Email: info@microdevelopmentng.com</div>
          <div>Phone number: +234(0)92920265, +234(0)8052026025</div>
          <div>Address: 23 Liverpool Street, Sabo Yaba, Ebute, Abuja</div>
        </div>
        <div className="w-full  h-40 rounded-lg overflow-hidden mb-4 relative">
          <Image
            src="/mdcl/map.png"
            alt="Map location"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />
          
{/* <svg width="162" height="162" viewBox="0 0 162 162" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="81" cy="81" r="81" fill="#FFF9F9" fillOpacity="0.13"/>
</svg> */}

        </div>
         <span className="text-white  text-sm">Follow us on:</span><br/>
        <div className="mt-2 flex items-center gap-2">
          <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[color:var(--color-primary-olive)] hover:bg-gray-100 transition"><Twitter/></a>
          <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[color:var(--color-primary-olive)] hover:bg-gray-100 transition"><Facebook/></a>
          <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[color:var(--color-primary-olive)] hover:bg-gray-100 transition"><Instagram/></a>
          <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[color:var(--color-primary-olive)] hover:bg-gray-100 transition"><Linkedin/></a>
        </div>

        
      </div>
      {/* Right: Contact Form */}
      <form className="flex-1 max-w-lg bg-white rounded-xl shadow p-6 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="First Name"
            className="flex-1 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary-olive)] text-sm"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            className="flex-1 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary-olive)] text-sm"
            required
          />
        </div>
        <input
          type="tel"
          placeholder="Phone Number"
          className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary-olive)] text-sm"
          required
        />
        <textarea
          placeholder="Comment or Message"
          className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary-olive)] text-sm min-h-[80px]"
          required
        />
        <button
          type="submit"
          className="bg-[color:var(--color-primary-light-brown)] text-white px-8 py-2 rounded font-semibold text-base shadow hover:bg-[color:var(--color-primary-brown)]/90 transition self-start"
        >
          Submit
        </button>
      </form>
    </section>
  );
};

export default Contact;