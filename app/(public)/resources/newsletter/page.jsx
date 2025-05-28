import React from 'react'
import Link from 'next/link'
import PreviewNewsletter from '@/components/PreviewNewsletter'
import Banner from '@/components/Banner'
import Deco from '@/components/Deco'
import Partners from '@/components/Partners'
const Newsletter = () => {
  return (
   <section>
        <Banner
            title="Newsletter"
            subtitle={
            <span className="text-center font-medium text-white/70">
                <Link href="/" className="hover:underline">Home</Link> /{" "}
                <Link href="/newsletter" className="hover:underline text-white font-bold">Newsletter</Link>
            </span>
            }
           
        />
        <Deco />
        <PreviewNewsletter />
        <Partners/>
   </section>
  )
}

export default Newsletter