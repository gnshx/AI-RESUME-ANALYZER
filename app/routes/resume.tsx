import React, { useEffect, useState } from 'react'
import { Link,useNavigate,useParams } from 'react-router'
import { usePuterStore } from '~/lib/puter'
import Summary from '~/components/Summary'
import Details from '~/components/Details'
import ATS from '~/components/ATS'
export const meta =() => ([
  {title: 'Resumai | Review'},
  {name: 'description', content: 'Detailed Overview of Resume'},
])

const resume = () => {

    const[imageUrl,setimageUrl]=useState('');
    const[resumeUrl,setresumeUrl]=useState('');
    const[feedback,setfeedback]=useState<Feedback | null>(null);
    const{auth,kv,isLoading,fs} =usePuterStore();
    const navigate=useNavigate();

 useEffect(() => {
        if (!auth.isAuthenticated) {
            navigate('/auth');
        }
    }, [auth.isAuthenticated,]);
    
    const {id}= useParams();
  useEffect(() => {
  let isMounted = true;

  const loadresume = async () => {
    const resume = await kv.get(`resume:${id}`);
    if (!resume || !isMounted) return;

    const data = JSON.parse(resume);

    const resumeBlob = await fs.read(data.resumePath);
    if (!resumeBlob || !isMounted) return;

    const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
    const resumeUrl = URL.createObjectURL(pdfBlob);
    setresumeUrl(resumeUrl);

    const imgBlob = await fs.read(data.imagepath);
    if (!imgBlob || !isMounted) return;

    const imgurl = URL.createObjectURL(imgBlob);
    setimageUrl(imgurl);

    setfeedback(data.feedback);
  };

  loadresume();

  return () => {
    isMounted = false;
  };
}, [id]);
 return (
    <main className='pt-0'>
        <nav className='resume-nav'>
            <Link to='/' className="back-button">
                <img src="/icons/back.svg" alt="logo" className='w-2.5 h-2.5' />
                <span className='text-gray-800 text-sm font-semibold'>
                    Back to Home page
                </span>
            </Link>
        </nav>

        <div className='flex flex-row w-full max-lg:flex-col-reverse'>

            <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 flex items-center justify-center">

                {imageUrl && resumeUrl && (
                    <div className='animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] w-fit max-xl:h-fit'>
                        <a href={resumeUrl} target='_blank' rel='noopener noreferrer'>
                            <img
                                src={imageUrl}
                                alt="resume-image"
                                className="w-full h-full object-contain rounded-2xl"
                            />
                        </a>
                    </div>
                )}

            </section>

            <section className='feedback-section p-6 w-full overflow-y-auto'>
                <h2 className='text-4xl !text-black font-bold'>
                    Resume review
                </h2>

                {feedback ? (
                    <div className='flex flex-col gap-8 animate-in fade-in duration-1000'>
                       <Summary feedback={feedback}/>
                       <ATS score={feedback.ATS.score ||0} suggestions={feedback.ATS>tips ||'[]'}/>
                    <Details feedback={feedback}/>
                    </div>
                ) : (
                    <img src="/images/resume-scan-2.gif" alt="" className='w-full' />
                )}
            </section>

        </div>
    </main>
)
}

export default resume