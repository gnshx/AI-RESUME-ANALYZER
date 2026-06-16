import React, {type FormEvent,useState } from 'react'
import Navbar from '~/components/Navbar'
import FileUploader from '~/components/FileUploader' 
const Upload = () => {

    const[isProcessing,setIsProcessing]=useState(false);
    const[statustext,setStatustext]=useState('');
    const [file, setFile] = useState<File | null>(null);
const handleFileSelect = (file: File | null) => {
    setFile(file);
};
    const handleSubmit=(e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        const formData=new FormData(e.currentTarget);
        const companyName=formData.get('company-name')?.toString() || '';
        const jobTitle=formData.get('job-title')?.toString() || '';
        const jobDescription=formData.get('job-description')?.toString() || '';
if(!file) return;

        console.log({companyName, jobTitle, jobDescription, file});
    }

  return (
   <main className="bg-[url('/images/bg-main.svg')] bg-cover">

    <Navbar />

    <section className="main-section">
<div className='page-heading py-16' >
<h1>Smart feedback for your resume</h1>
{isProcessing? (
    <>
    <h2>{statustext}</h2>
    <img src="./images/resume-scan.gif" alt="resume scan" className='w-full ' />
    </>
):(
    <h2>Drop your resume here to track its progress and ATS score</h2>
)}
{
    !isProcessing && (
<form id="upload-form" onSubmit={handleSubmit} className='flex flex-col gap-4 mt-8'>
<div className='form-div'>
<label htmlFor="company-name">Company name</label>
<input type="text" id="company-name" name="company-name" placeholder='type company name here' />
</div>


<div className='form-div'>
<label htmlFor="job-title">Job title</label>
<input type="text" id="job-title" name="job-title" placeholder='type job title here' />
</div>

<div className='form-div'>
<label htmlFor="job-description">Job description</label>
<textarea rows={7} id="job-description" name="job-description" placeholder='type job description here' />
</div>

<div className='form-div'>
<label htmlFor="uploader">Upload Resume</label>
<FileUploader onFileSelect={handleFileSelect} />
</div>

<button className='primary-button' type='submit'>
Analyze Resume
</button>
</form>
    )
}
</div>
    </section>
    </main>
  )
}

export default Upload
