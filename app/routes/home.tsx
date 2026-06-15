import type { Route } from "./+types/home";
  import Navbar from "~/components/Navbar";
  import { resumes } from "../../constants/index";
  import ResumeCard from "~/components/ResumeCard";
import { resume } from "react-dom/server";
import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "resumai" },
    { name: "description", content: "LAND YOUR DREAM JOB" },
  ];
}

export default function Home() {

    const {isLoading,auth} = usePuterStore();
    const location = useLocation();
    const next=location.search.split('next=')[1] || '/';
    const navigate=useNavigate();   

    useEffect(() => {
        if (!auth.isAuthenticated) {
            navigate('/auth?next=/');
        }
    }, [auth.isAuthenticated]);


  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">

    <Navbar />

    <section className="main-section">
  <div className="page-heading">
    <h1>Track your application & resume rating</h1>
    <h2>Get insights and improve your chances of landing your dream job</h2>
  </div>
 
  {
  resumes.length>0 && (<div className="resumes-section">
    {resumes.map((resume) => (
      <ResumeCard key={resume.id} resume={resume} />
    ))}
  </div>
  )
  }
   </section>
  </main>
}
