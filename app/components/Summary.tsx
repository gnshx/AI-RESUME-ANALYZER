import React from 'react'
import Scoregauge from './Scoregauge'
import ScoreBadge from './Scorebadge';

const Category=({title,score}:{title:string,score:number})=>{
    let textcolor;
if(score>70){
    textcolor='text-green-600';
}
else if(score>49){
    textcolor='text-yellow-600';
}
else{
    textcolor='text-red-600';
}
return(
<div className='resume-summary'>
    <div className='category '>
<div className='flex flex-row items-center gap-2 justify-center '>
    <p className='text-2xl'>
       {title}  
    </p>
    <ScoreBadge score={score}/>
    </div>
    <p className='text-2xl'>
<span className={textcolor}>
{score}
</span>
/100
    </p>

    </div>
    
</div>
)
}

const Summary = ({feedback}:{feedback: Feedback}) => {
  return (
    <div className='bg-white rounded-2xl shadow-md w-full'>
        <div className='flex flex-row gap-8 p-4 items-center'>
            <Scoregauge score={feedback.overallScore}/>

            <div className='flex flex-col gap-2 '>
            <h2 className='text-2xl font-bold'>Your Resume Score</h2>
            <p className='text-sm text-gray-500'>
                This Score calculated Based on Variables Listed Below 
            </p>
            </div>
        </div>
<Category title="Tone & Style" score={feedback.toneAndStyle.score} />
<Category title="Content" score={feedback.content.score} />
<Category title="Structure" score={feedback.structure.score} />
<Category title="Skills" score={feedback.skills.score} />


    </div>
  )
} 

export default Summary