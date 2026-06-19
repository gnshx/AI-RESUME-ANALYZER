import type { Route } from "./+types/home";
import { useState } from "react";
import { Link } from 'react-router'
  import Navbar from "~/components/Navbar";
import { res } from "../../constants/index";
import ResumeCard from "~/components/ResumeCard";
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

    const {isLoading,auth,kv} = usePuterStore();
    const location = useLocation();
    const next=location.search.split('next=')[1] || '/';
    const navigate=useNavigate();   

 const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
 useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list('resume:*', true)) as KVItem[];

      const parsedResumes = resumes?.map((resume) => (
          JSON.parse(resume.value) as Resume
      ))
console.log(parsedResumes);
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    }

    loadResumes()
  }, []);

    useEffect(() => {
        if (!auth.isAuthenticated) {
            navigate('/auth?next=/');
        }
    }, [auth.isAuthenticated]);


  return  <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />
     {
        resumes?.length!==0 &&(
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link to="/wipe" className="primary-button w-fit text-xl font-semibold">
            Clear all resumes
            </Link>
          </div>
        )
      }
    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Track Your Applications & Resume Ratings</h1>
        {!loadingResumes && resumes?.length === 0 ? (
            <h2>No resumes found. Upload your first resume to get feedback.</h2>
        ): (
          <h2>Review your submissions and check AI-powered feedback.</h2>
        )}
      </div>
      {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
          </div>
      )}

     {!loadingResumes && resumes.length > 0 && (
  <div className="resumes-section">
    {resumes.map((resume) => (
      <ResumeCard key={resume.id} resume={resume} />
    ))}
  </div>
)}

      {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
              Upload Resume
            </Link>
            <div className="flex flex-row py-10 mx-10 gap-6">
            <ResumeCard key={res[0].id} resume={res[0]}/>
            <ResumeCard key={res[1].id} resume={res[1]}/>
            <ResumeCard key={res[2].id} resume={res[2]}/>
            </div>
          </div>
      )}
     
    </section>
  </main>
}