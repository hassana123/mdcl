import Banner from "@/components/Banner";
import Link from "next/link";
import Deco from "@/components/Deco";
const OtherResources  = () => {
 return(
    <>
     <Banner
            title="Other Resources"
            subtitle={
            <span className="text-center font-medium text-white/70">
                <Link href="/" className="hover:underline">Home</Link> /{" "}
                <Link href="/resources" className="hover:underline">Resources</Link> /{" "}
                <Link href="/resources/others" className="hover:underline text-white font-bold">Other Resources</Link>
            </span>
            }
           
        />
      <div className='lg:block hidden'>
      <Deco />
      </div>
    </>
 )   
}

export default OtherResources;