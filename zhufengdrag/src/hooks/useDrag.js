import { useCallback, useEffect, useState } from "react";
import { message } from "antd";
import { MAX_FILE_SIZE } from "../constant";

function useDrag(uploadContainerRef) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState({url:null,type:null});
  function handleDrag(event) {
    event.preventDefault();
    event.stopPropagation();
  }
  function checkFile(files) {
    const file = files[0];
    if (!file) {
      message.error("没有选择任何文件");
    }
    if (file.size > MAX_FILE_SIZE) {
      message.error("文件大小不能超过2G");
    }
    if (!(file.type.startsWith("image/") || file.type.startsWith("video/"))) {
      message.error("文件类型只能是图片或者视频");
    }
    setSelectedFile(file);
  }
  function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    checkFile(event.dataTransfer.files);
  }
  useEffect(() => {
    const uploadContainer = uploadContainerRef.current;
    uploadContainer.addEventListener("dragenter", handleDrag);
    uploadContainer.addEventListener("dragover", handleDrag);
    uploadContainer.addEventListener("drop", handleDrop);
    uploadContainer.addEventListener("dragleave", handleDrag);
    return () => {
      uploadContainer.removeEventListener("dragenter", handleDrag);
      uploadContainer.removeEventListener("dragover", handleDrag);
      uploadContainer.removeEventListener("drop", handleDrop);
      uploadContainer.removeEventListener("dragleave", handleDrag);
    };
  }, []);
  useEffect(()=>{
    if(!selectedFile) return 
    const url = URL.createObjectURL(selectedFile);
    console.log(url);
    setFilePreview({url,type:selectedFile.type})
    return ()=>{
        URL.revokeObjectURL(url)
    }
  }, [selectedFile])
  return {selectedFile,filePreview}
}

export default useDrag;
