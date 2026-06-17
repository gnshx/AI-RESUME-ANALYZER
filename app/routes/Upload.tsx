import React, { type FormEvent, useState } from 'react';
import Navbar from '~/components/Navbar';
import FileUploader from '~/components/FileUploader';
import { usePuterStore } from '~/lib/puter';
import { convertPdfToImage } from '~/lib/pdftoimg';
import { useNavigate } from 'react-router';
import { generateUUID } from '~/lib/utils';
import { prepareInstructions } from '../../constants';
const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    try {
      setIsProcessing(true);
      setStatusText('Analyzing your resume...');
      console.log('🚀 Step 1: Starting file upload...');

      const uploadedFile = await fs.upload([file]);
      console.log('📁 Step 1 result:', uploadedFile);
      if (!uploadedFile) {
        console.error('❌ Step 1 FAILED: uploadedFile is null');
        setStatusText('Upload failed');
        return;
      }

      setStatusText('Converting into image...');
      console.log('🖼️ Step 2: Converting PDF to image...');
      const imagefile = await convertPdfToImage(file);
      console.log('🖼️ Step 2 result:', imagefile);
      if (!imagefile.file) {
        console.error('❌ Step 2 FAILED:', imagefile.error);
        return setStatusText('failed to convert into image: ' + imagefile.error);
      }

      setStatusText('Uploading the image...');
      console.log('📤 Step 3: Uploading image...');
      const uploadedimage = await fs.upload([imagefile.file]);
      console.log('📤 Step 3 result:', uploadedimage);
      if (!uploadedimage) {
        console.error('❌ Step 3 FAILED: image upload returned null');
        return setStatusText('failed to upload image');
      }

      setStatusText('Preparing Data...');
      const uuid = generateUUID();
      console.log('🆔 UUID:', uuid);
      const data = {
        id: uuid,
        resumePath: uploadedFile?.path,
        imagepath: uploadedimage?.path,
        companyName, jobTitle, jobDescription,
        feedback: '' as any,
      };
      console.log('💾 Step 4: Saving to KV...', data);
      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      setStatusText('Analyzing with AI...');
      console.log('🤖 Step 5: Calling AI feedback...');
      const feedback = await ai.feedback(
        uploadedFile.path,
        prepareInstructions({ jobDescription, jobTitle }),
      );
      console.log('🤖 Step 5 result:', feedback);
      if (!feedback) {
        console.error('❌ Step 5 FAILED: AI returned null');
        setStatusText('failed to analyze');
        return;
      }

      const feedbacktxt = typeof feedback.message.content === 'string'
        ? feedback.message.content
        : feedback.message.content[0].text;
      console.log('📝 Raw feedback text:', feedbacktxt);

      const cleanedFeedback = feedbacktxt
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
      console.log('🧹 Cleaned feedback:', cleanedFeedback);

      data.feedback = JSON.parse(cleanedFeedback);
      await kv.set(`resume:${uuid}`, JSON.stringify(data));
      setStatusText('Analysis Completed, redirecting...');
      console.log('🎉 FINAL DATA:', data);

    } catch (error) {
      console.error('💥 CAUGHT ERROR:', error);
      setStatusText('Upload failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const companyName =
      formData.get('company-name')?.toString() || '';
    const jobTitle =
      formData.get('job-title')?.toString() || '';
    const jobDescription =
      formData.get('job-description')?.toString() || '';

    if (!file) {
      alert('Please upload a resume');
      return;
    }

    await handleAnalyze({
      companyName,
      jobTitle,
      jobDescription,
      file,
    });
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart feedback for your resume</h1>

          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img
                src="/images/resume-scan.gif"
                alt="resume scan"
                className="w-full"
              />
            </>
          ) : (
            <h2>
              Drop your resume here to track its progress and ATS score
            </h2>
          )}

          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-8"
            >
              <div className="form-div">
                <label htmlFor="company-name">Company name</label>
                <input
                  type="text"
                  id="company-name"
                  name="company-name"
                  placeholder="Type company name here"
                />
              </div>

              <div className="form-div">
                <label htmlFor="job-title">Job title</label>
                <input
                  type="text"
                  id="job-title"
                  name="job-title"
                  placeholder="Type job title here"
                />
              </div>

              <div className="form-div">
                <label htmlFor="job-description">Job description</label>
                <textarea
                  rows={7}
                  id="job-description"
                  name="job-description"
                  placeholder="Type job description here"
                />
              </div>

              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>

              <button className="primary-button" type="submit">
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;