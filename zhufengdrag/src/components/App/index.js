import "./index.css";
import { useEffect, useState, useRef } from "react";
import useDrag from "../../hooks/useDrag";

import axios from "axios";
import axiosInstance from "../../api/axiosInstance";

import { InboxOutlined } from "@ant-design/icons";
import { Button, message, Progress, Spin } from "antd";

import { CHUNK_SIZE, MAX_RETRIES } from "../../constant";
function FileUploader() {
  const uploadContainerRef = useRef(null);
  const { selectedFile, filePreview } = useDrag(uploadContainerRef);
  return (
    <>
      <div className="upload-container" ref={uploadContainerRef}>
        {renderFilePreview(filePreview)}
      </div>
    </>
  );
}

function renderFilePreview(filePreview){
  const {url,type} = filePreview;
  if(url){
    if(type.startsWith('image/')){
      return <img src={url} alt='preview'></img>
    }else if(type.startsWith('video/')){
      return <video src={url} controls alt='preview'></video>
    }else{
      return url
    }
  }else{
    return <InboxOutlined/>
  }
}
export default FileUploader;
