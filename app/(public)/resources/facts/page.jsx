import React from 'react'
import Link from 'next/link'
import Banner from '@/components/Banner'
import Deco from '@/components/Deco'
import Partners from '@/components/Partners'
import Image from 'next/image'

const Faqs = () => {
  // Dummy data for FAQs
  const dummyFacts = [
    { id: 1, title: "Fact Sheet Title 1", link: "#" },
    { id: 2, title: "Fact Sheet Title 2", link: "#" },
    { id: 3, title: "Fact Sheet Title 3", link: "#" },
    { id: 4, title: "Fact Sheet Title 4", link: "#" },
  ];

  // Image paths to use
  const images = [
    '/mdcl/sh1.jpg',
    '/mdcl/sh2.jpg',
  ];

  return (
    <>
    <Banner
    title="Facts Sheet"
    subtitle={
    <span className="text-center font-medium text-white/70">
        <Link href="/" className="hover:underline">Home</Link> /{" "}
        <Link href="/resources" className="hover:underline">Resources</Link> /{" "}
        <span className="text-white font-bold">Facts Sheet</span>
    </span>
    }
   
/>
<div className='lg:block hidden'>
<Deco />
</div>
   <section className='z-10 md:w-[85%] mx-auto w-[95%] my-10 '>
       

        <div className="">
          {/* <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
           */}
          <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dummyFacts.map((faq, index) => (
              <div key={faq.id} className="bg-white rounded-lg overflow-hidden shadow-md border-t-4 border-t-green-700 flex flex-col">
                {/* Display image, alternating between the two provided */}
                <div className="relative w-full h-40 bg-gray-200 rounded-t-lg overflow-hidden">
                  {/* <Image
                    src={images[index % images.length]}
                    alt={`Fact Sheet Graphic ${index + 1}`}
                    fill
                    className="object-cover"
                  /> */}
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 flex-grow">{faq.title}</h3>
                  
                  <div className="mt-auto pt-2">
                    <Link
                      href={faq.link}
                      className="text-md underline font-semibold text-green-700 hover:font-bold"
                    >
                      View Fact Sheet
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
   </section>
   <Partners/>
    </>
  )
}

export default Faqs