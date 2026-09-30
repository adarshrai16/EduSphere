import React,{useContext,useEffect,useRef,useState} from 'react';
import {assets} from '../../assets/assets';
import {toast} from 'react-toastify';
import Quill from 'quill';
import uniqid from 'uniqid';
import axios from 'axios';
import {AppContext} from '../../context/AppContext';

const AddCourse=()=>{
  const editorRef=useRef(null),quillRef=useRef(null);
  const {backendUrl,getToken,fetchAllCourses}=useContext(AppContext);
  const [courseTitle,setCourseTitle]=useState(''),[coursePrice,setCoursePrice]=useState(0),[discount,setDiscount]=useState(0),[image,setImage]=useState(null),[chapters,setChapters]=useState([]),[showPopup,setShowPopup]=useState(false),[currentChapterId,setCurrentChapterId]=useState(null);
  const [lectureDetails,setLectureDetails]=useState({lectureTitle:'',lectureDuration:'',lectureUrl:'',isPreviewFree:false});

  const handleChapter=(action,id)=>{
    if(action==='add'){
      const title=prompt('Enter Chapter Name:');
      if(title)setChapters([...chapters,{chapterId:uniqid(),chapterTitle:title,chapterContent:[],collapsed:false,chapterOrder:chapters.length?chapters.at(-1).chapterOrder+1:1}]);
    }else if(action==='remove')setChapters(chapters.filter(c=>c.chapterId!==id));
    else setChapters(chapters.map(c=>c.chapterId===id?{...c,collapsed:!c.collapsed}:c));
  };

  const handleLecture=(action,chapterId,index)=>{
    if(action==='add'){setCurrentChapterId(chapterId);setShowPopup(true);}
    else setChapters(chapters.map(c=>c.chapterId===chapterId?{...c,chapterContent:c.chapterContent.filter((_,i)=>i!==index)}:c));
  };

  const addLecture=()=>{
    setChapters(chapters.map(c=>c.chapterId===currentChapterId?{...c,chapterContent:[...c.chapterContent,{...lectureDetails,lectureOrder:c.chapterContent.length?c.chapterContent.at(-1).lectureOrder+1:1,lectureId:uniqid()}]}:c));
    setShowPopup(false);
    setLectureDetails({lectureTitle:'',lectureDuration:'',lectureUrl:'',isPreviewFree:false});
  };

  const handleSubmit=async e=>{
    e.preventDefault();
    try{
      if(!image)return toast.error('Thumbnail Not Selected');
      const courseData={courseTitle,courseDescription:quillRef.current.root.innerHTML,coursePrice:Number(coursePrice),discount:Number(discount),courseContent:chapters};
      const formData=new FormData();
      formData.append('courseData',JSON.stringify(courseData));
      formData.append('image',image);
      const token=await getToken();
      const {data}=await axios.post(backendUrl+'/api/educator/add-course',formData,{headers:{Authorization:`Bearer ${token}`}});
      if(data.success){
        toast.success(data.message);
        await fetchAllCourses();
        setCourseTitle('');setCoursePrice(0);setDiscount(0);setImage(null);setChapters([]);
        quillRef.current.root.innerHTML='';
      }else toast.error(data.message);
    }catch(error){toast.error(error.response?.data?.message||error.message);}
  };

  useEffect(()=>{
    if(!quillRef.current&&editorRef.current)
      quillRef.current=new Quill(editorRef.current,{theme:'snow'});
  },[]);

  return(
    <div className="add-course-page">
      <form onSubmit={handleSubmit} className="add-course-form">

        <div className="form-group">
          <p>Course Title</p>
          <input value={courseTitle} onChange={e=>setCourseTitle(e.target.value)} placeholder="Type here" required/>
        </div>

        <div className="form-group">
          <p>Course Description</p>
          <div ref={editorRef} className="course-editor"/>
        </div>

        <div className="course-info-row">
          <div className="form-group">
            <p>Course Price</p>
            <input value={coursePrice} onChange={e=>setCoursePrice(e.target.value)} type="number" placeholder="0" required/>
          </div>

          <div className="thumbnail-group">
            <p>Thumbnail</p>
            <label htmlFor="thumbnailImage">
              <img src={assets.file_upload_icon} className="upload-icon"/>
              <input id="thumbnailImage" type="file" onChange={e=>setImage(e.target.files[0])} accept="image/*" hidden/>
              {image&&<img className="thumbnail-preview" src={URL.createObjectURL(image)} alt=""/>}
            </label>
          </div>
        </div>

        <div className="form-group">
          <p>Discount %</p>
          <input value={discount} onChange={e=>setDiscount(e.target.value)} type="number" min="0" max="100" placeholder="0" required/>
        </div>

        <div className="chapters">
          {chapters.map((chapter,i)=>(
            <div key={chapter.chapterId} className="chapter">
              <div className="chapter-header">
                <div className="chapter-title">
                  <img src={assets.dropdown_icon} className={chapter.collapsed?'rotate':''} onClick={()=>handleChapter('toggle',chapter.chapterId)}/>
                  <span>{i+1}. {chapter.chapterTitle}</span>
                </div>
                <span>{chapter.chapterContent.length} Lectures</span>
                <img src={assets.cross_icon} className="delete-icon" onClick={()=>handleChapter('remove',chapter.chapterId)}/>
              </div>

              {!chapter.collapsed&&(
                <div className="lecture-list">
                  {chapter.chapterContent.map((lecture,j)=>(
                    <div key={lecture.lectureId} className="lecture">
                      <span>{j+1}. {lecture.lectureTitle} - {lecture.lectureDuration} mins - <a href={lecture.lectureUrl} target="_blank" rel="noreferrer">Link</a> - {lecture.isPreviewFree?'Free Preview':'Paid'}</span>
                      <img src={assets.cross_icon} className="delete-icon" onClick={()=>handleLecture('remove',chapter.chapterId,j)}/>
                    </div>
                  ))}
                  <button type="button" className="add-lecture" onClick={()=>handleLecture('add',chapter.chapterId)}>+ Add Lecture</button>
                </div>
              )}
            </div>
          ))}

          <button type="button" className="add-chapter" onClick={()=>handleChapter('add')}>+ Add Chapter</button>

          {showPopup&&(
            <div className="popup-overlay">
              <div className="lecture-popup">
                <h2>Add Lecture</h2>

                <div className="popup-field">
                  <p>Lecture Title</p>
                  <input value={lectureDetails.lectureTitle} onChange={e=>setLectureDetails({...lectureDetails,lectureTitle:e.target.value})}/>
                </div>

                <div className="popup-field">
                  <p>Duration (minutes)</p>
                  <input type="number" value={lectureDetails.lectureDuration} onChange={e=>setLectureDetails({...lectureDetails,lectureDuration:e.target.value})}/>
                </div>

                <div className="popup-field">
                  <p>Lecture URL</p>
                  <input value={lectureDetails.lectureUrl} onChange={e=>setLectureDetails({...lectureDetails,lectureUrl:e.target.value})}/>
                </div>

                <label className="preview-check">
                  <span>Is Preview Free?</span>
                  <input type="checkbox" checked={lectureDetails.isPreviewFree} onChange={e=>setLectureDetails({...lectureDetails,isPreviewFree:e.target.checked})}/>
                </label>

                <button type="button" className="add-btn" onClick={addLecture}>Add</button>
                <img src={assets.cross_icon} className="popup-close" onClick={()=>setShowPopup(false)}/>
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="submit-btn">ADD</button>
      </form>
    </div>
  );
};

export default AddCourse;

