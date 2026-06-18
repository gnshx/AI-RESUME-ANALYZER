import {Link} from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";

const ResumeCard = ({ resume }: { resume: Resume }) => {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState<string>('');

  useEffect(() => {
    let objectUrl: string | null = null;

    const loadResume = async () => {
      try {
        if (!resume?.imagepath) {
          console.warn('Missing imagepath:', resume);
          return;
        }

        const file = await fs.read(resume.imagepath);

        if (!file) {
          console.warn('File not found:', resume.imagepath);
          return;
        }

        if (!(file instanceof Blob)) {
          console.error('Not a file:', file);
          return;
        }

        objectUrl = URL.createObjectURL(file);
        setResumeUrl(objectUrl);
      } catch (err) {
        console.error('Failed to load resume image:', err);
      }
    };

    loadResume();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [resume?.imagepath, fs]);

  return (
    <Link to={`/resumes/${resume.id}`} className="resume-card">
      <div className="resume-card-header">
        <div>
          <h2>{resume.companyName || "Resume"}</h2>
          {resume.jobTitle && <h3>{resume.jobTitle}</h3>}
        </div>

        <ScoreCircle score={resume.feedback.overallScore} />
      </div>

      {resumeUrl && (
        <img
          src={resumeUrl}
          alt="resume"
          className="w-full h-[350px] object-cover"
        />
      )}
    </Link>
  );
};

export default ResumeCard;