import React ,{useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
  
interface FileUploaderProps
{
    onFileSelect: (file: File | null) => void; 
}

export const formatFileSize = (sizeInBytes: number): string => {
  const sizeInKb = sizeInBytes / 1024;

  if (sizeInKb < 1024) {
    return `${sizeInKb.toFixed(1)} KB`;
  }

  return `${(sizeInKb / 1024).toFixed(1)} MB`;
};

const FileUploader = ({onFileSelect} : FileUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

const onDrop = useCallback(  (acceptedFiles : File[] ) => {
    const files=acceptedFiles[0] ||null;
    setSelectedFile(files);
    onFileSelect?.(files);
  }, [onFileSelect])
  const {getRootProps, getInputProps} = useDropzone({onDrop, multiple: false, maxSize: 20*1024*1024,})

  return (
    <div className='w-full gradient-border'>
 <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div className='space-y-4 cursor-pointer'>
       
{
    selectedFile?(
        <div className='uploader-selected-file' onClick={(e)=>e.stopPropagation()}>
                        <img src="/images/pdf.png" alt="pdf" className='w-14 h-14 flex-shrink-0 object-contain rounded-md bg-white p-1' />

<div className='flex items-center space-x-3'>
            <p className='text-sm font-medium text-gray-700 max-w-s'>{selectedFile.name}</p>
            <p className='text-sm text-gray-500'>{formatFileSize(selectedFile.size)}</p>
        </div>
        <button type="button" className='cursor-pointer p-2' onClick={(e)=>{
            e.stopPropagation();
            setSelectedFile(null);
            onFileSelect?.(null);
        }}>
            <img src="/icons/cross.svg" alt="remove" className='w-4 h-4' />
        </button>
        </div>
        
    ):(
        
        <div>
             <div className='mx-auto w-28 h-20 flex items-center justify-center mb-3'>
            <img src="./icons/upload.png" alt="upload" className='w-28 h-20 object-contain'/>
        </div>
<p className='text-lg text-grey-500'>
    <span className='font-semibold'>Drag and drop your resume here, or click to select a file</span>
</p>
<p className='text-lg text-grey-500'>Max size of 20MB</p>
        </div>
    )
}
      </div>
    </div>    
        </div>
  )
}

export default FileUploader
